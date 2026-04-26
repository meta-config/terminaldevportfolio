import { memo, useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react'
import TerminalHeader from './TerminalHeader'
import { useLayout } from '../layout'
import { AVAILABLE_COMMANDS, createCommandMap, executeCommand } from './terminalCommands'

const HOME_DIRECTORY = '/home/samarsingh'
const SSH_USER = 'samarsingh'
const TYPE_CHAR_DELAY_MS = 3
const EXECUTION_DELAY_MS = 30
const LINE_GAP_MS = 8
const PROMPT_USER_COLOR = '#00ff88'

/** Typing jitter: ±1ms around base (keeps steps in 2-4ms range when base is 3) */
const charDelayWithJitter = (baseMs, stepIndex) => {
  const jitter = ((stepIndex * 7 + 3) % 3) - 1
  return Math.max(2, Math.min(4, baseMs + jitter))
}

const LONG_LINE_CHUNK_THRESHOLD = 120
const getTypingChunkSize = (lineLength) => {
  if (lineLength > 240) return 8
  if (lineLength > LONG_LINE_CHUNK_THRESHOLD) return 5
  return 1
}

/** SSH scripted intro: snappy but still readable */
const SSH_TYPE_CHAR_MS = 6
const SSH_LINE_GAP_MS = 60
const SSH_EXEC_MS = 60

const SSH_CONNECT_LINES = [
  'Connecting to samarsingh@portfolio...',
  'Authenticating...'
]

const SSH_LOGIN_PREFIX = 'portfolio login: '
const SSH_PASSWORD_PREFIX = 'Password: '
const SSH_PASSWORD_MASK = '********'

const BOOT_LOGS = [
  '[    0.000000] Linux version 6.8.0-portfolio (gcc 13.2.0)',
  '[    0.084213] VFS: Mounted root filesystem ext4 on /dev/nvme0n1p2 (rw,relatime)',
  '[    0.431990] systemd[1]: Starting Load Kernel Modules...',
  '[    0.989342] systemd[1]: Started Journal Service.',
  '[    1.200000] systemd[1]: Starting Network Manager...',
  '[    1.447030] NetworkManager[407]: Device "wlp2s0" link is up, initializing IPv4',
  '[    2.038552] systemd[1]: Starting OpenSSH Daemon...',
  '[    2.614881] systemd[1]: Reached target Multi-User System.',
  '[    3.108735] login[821]: pam_unix(login:session): session opened for user samarsingh(uid=1000)',
  '[    3.652471] samarsingh@portfolio login: samarsingh',
  '[    4.211947] portfolio: session started for samarsingh at tty1'
]

const isUrl = (value) => /^https?:\/\/\S+$/i.test(value) || /^tel:\S+$/i.test(value)

const renderOutputLine = (line, key) => {
  const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/)
  if (match) {
    const [, label, href] = match
    return (
      <div key={key} className="text-red-500 leading-relaxed whitespace-pre-wrap break-words">
        {line.replace(match[0], '')}
        <a href={href} target="_blank" rel="noreferrer" className="text-red-400 underline">
          {label}
        </a>
      </div>
    )
  }

  if (isUrl(line)) {
    return (
      <a key={key} href={line} target="_blank" rel="noreferrer" className="block text-red-400 underline leading-relaxed whitespace-pre-wrap break-all">
        {line}
      </a>
    )
  }

  return <div key={key} className="text-red-500 leading-relaxed whitespace-pre-wrap break-words">{line}</div>
}

const TerminalHistory = memo(function TerminalHistory({ entries }) {
  const lastEntryId = entries.length > 0 ? entries[entries.length - 1].id : 0

  return (
    <div className="w-full min-w-0">
      {entries.map((entry) => {
        if (entry.type === 'input') {
          return (
            <div key={entry.id} className="flex flex-wrap items-baseline leading-relaxed whitespace-pre-wrap min-w-0">
              <span style={{ color: PROMPT_USER_COLOR }}>samarsingh</span>
              <span className="text-gray-300">@portfolio</span>
              <span className="text-blue-400">:{entry.pathLabel}</span>
              <span className="text-red-400">$&nbsp;</span>
              <span className="text-white break-all">{entry.value}</span>
            </div>
          )
        }

        return (
          <div key={entry.id} className="terminal-output-line">
            {renderOutputLine(entry.value, entry.id)}
          </div>
        )
      })}
    </div>
  )
})

const Terminal = ({ onExit, isTerminalOpen }) => {
  const { openApp, closeApp, activeApp } = useLayout()

  const [mode, setMode] = useState('ssh') // 'ssh' | 'boot' | 'terminal'
  /** connecting → login_display → success → continue (typing hint) → await_boot → mode boot */
  const [sshPhase, setSshPhase] = useState('connecting')

  const [input, setInput] = useState('')
  const [currentDirectory, setCurrentDirectory] = useState(HOME_DIRECTORY)
  const [entries, setEntries] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [cursorBlinkSolid, setCursorBlinkSolid] = useState(false)
  const [processes, setProcesses] = useState([])
  const [activeProcess, setActiveProcess] = useState(null)
  const [attachedProcessPid, setAttachedProcessPid] = useState(null)
  const [isCommandRunning, setIsCommandRunning] = useState(false)

  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorBlinkTimerRef = useRef(null)
  const outputTimersRef = useRef([])
  const nextEntryIdRef = useRef(1)
  const previousActiveAppRef = useRef(activeApp)
  const suppressCloseMessageRef = useRef(false)
  const nextPidRef = useRef(1000)
  const typeOutputLinesRef = useRef(null)
  const sshFlowGenRef = useRef(0)
  const sshAutoBootTimerRef = useRef(null)
  const bootGenRef = useRef(0)
  const modeRef = useRef(mode)
  modeRef.current = mode

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && mode === 'terminal') {
      // Focus immediately after render
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isTerminalOpen, mode])

  const lastLoginDisplay = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    d.setHours(14, 20, 33, 0)
    return d.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
      timeZoneName: 'short'
    })
  }, [])

  const isTerminalAttached = Boolean(activeApp && attachedProcessPid !== null)
  const isInputGloballyBlocked =
    mode === 'boot' || (mode === 'terminal' && (isTerminalAttached || isCommandRunning))

  const promptPath = currentDirectory === HOME_DIRECTORY ? '~' : currentDirectory.replace(HOME_DIRECTORY, '~')

  const pushEntry = useCallback((entry) => {
    setEntries((prev) => [...prev, { ...entry, id: nextEntryIdRef.current++ }])
  }, [])

  const updateOutputEntry = useCallback((entryId, value) => {
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, value } : entry)))
  }, [])

  const clearOutputTimers = useCallback(() => {
    outputTimersRef.current.forEach(clearTimeout)
    outputTimersRef.current = []
  }, [])

  const bumpCursorBlinkHold = useCallback(() => {
    setCursorBlinkSolid(true)
    if (cursorBlinkTimerRef.current) clearTimeout(cursorBlinkTimerRef.current)
    cursorBlinkTimerRef.current = setTimeout(() => {
      cursorBlinkTimerRef.current = null
      setCursorBlinkSolid(false)
    }, 350)
  }, [])

  const typeOutputLines = useCallback(
    (
      lines,
      onComplete,
      {
        markBusy = false,
        charDelayMs = TYPE_CHAR_DELAY_MS,
        execDelayMs = EXECUTION_DELAY_MS,
        lineGapMs = LINE_GAP_MS
      } = {}
    ) => {
      if (markBusy) setIsCommandRunning(true)
      
      // Dynamic delay based on output size
      const totalChars = lines.join('').length
      const isShortOutput = totalChars < 100
      const dynamicExecDelay = isShortOutput ? 10 : execDelayMs
      const dynamicCharDelay = isShortOutput ? 2 : charDelayMs
      
      let delay = dynamicExecDelay

      lines.forEach((line) => {
        if (line === '') {
          const timer = setTimeout(() => {
            pushEntry({ type: 'output', value: '' })
            outputTimersRef.current = outputTimersRef.current.filter((id) => id !== timer)
          }, delay)
          outputTimersRef.current.push(timer)
          delay += lineGapMs
          return
        }

        const entryId = nextEntryIdRef.current++
        const createTimer = setTimeout(() => {
          setEntries((prev) => [...prev, { id: entryId, type: 'output', value: '' }])
          outputTimersRef.current = outputTimersRef.current.filter((id) => id !== createTimer)
        }, delay)
        outputTimersRef.current.push(createTimer)

        let localDelay = delay
        const chunkSize = getTypingChunkSize(line.length)
        let stepIndex = 0
        let pos = 0
        while (pos < line.length) {
          const nextPos = Math.min(pos + chunkSize, line.length)
          stepIndex += 1
          localDelay += charDelayWithJitter(dynamicCharDelay, stepIndex)
          const textValue = line.slice(0, nextPos)
          pos = nextPos
          const charTimer = setTimeout(() => {
            requestAnimationFrame(() => {
              updateOutputEntry(entryId, textValue)
            })
            outputTimersRef.current = outputTimersRef.current.filter((id) => id !== charTimer)
          }, localDelay)
          outputTimersRef.current.push(charTimer)
        }

        delay = localDelay + lineGapMs
      })

      const doneTimer = setTimeout(() => {
        if (markBusy) setIsCommandRunning(false)
        onComplete?.()
        outputTimersRef.current = outputTimersRef.current.filter((id) => id !== doneTimer)
      }, delay > dynamicExecDelay ? delay - lineGapMs : delay)
      outputTimersRef.current.push(doneTimer)
    },
    [pushEntry, updateOutputEntry]
  )

  typeOutputLinesRef.current = typeOutputLines

  /** Boot: full lines instantly, staggered 70–130ms (no per-character typing) */
  const scheduleBootOutputLines = useCallback(
    (lines, onComplete) => {
      let lineStart = 50
      lines.forEach((line, i) => {
        const at = lineStart
        const timer = setTimeout(() => {
          pushEntry({ type: 'output', value: line })
          outputTimersRef.current = outputTimersRef.current.filter((id) => id !== timer)
        }, at)
        outputTimersRef.current.push(timer)
        if (i < lines.length - 1) lineStart += 70 + Math.floor(Math.random() * 61)
      })
      const doneTimer = setTimeout(() => {
        onComplete?.()
        outputTimersRef.current = outputTimersRef.current.filter((id) => id !== doneTimer)
      }, lineStart + 80)
      outputTimersRef.current.push(doneTimer)
    },
    [pushEntry]
  )

  const scheduleTypedOutput = useCallback(
    (lines) => {
      typeOutputLines(lines, undefined, { markBusy: true })
    },
    [typeOutputLines]
  )

  const SSH_LOGIN_DISPLAY_LINES = useMemo(
    () => [
      `${SSH_LOGIN_PREFIX}${SSH_USER}`,
      `${SSH_PASSWORD_PREFIX}${SSH_PASSWORD_MASK}`,
    ],
    []
  )

  const SSH_TIMING = useMemo(
    () => ({
      markBusy: false,
      charDelayMs: SSH_TYPE_CHAR_MS,
      lineGapMs: SSH_LINE_GAP_MS,
      execDelayMs: SSH_EXEC_MS
    }),
    []
  )

  const flushSshFullScriptToAwaitBoot = useCallback(() => {
    clearOutputTimers()
    sshFlowGenRef.current += 1
    if (sshAutoBootTimerRef.current) {
      clearTimeout(sshAutoBootTimerRef.current)
      sshAutoBootTimerRef.current = null
    }
    const lines = [
      ...SSH_CONNECT_LINES,
      ...SSH_LOGIN_DISPLAY_LINES,
      'Welcome to portfolio',
      `Last login: ${lastLoginDisplay} from 192.168.1.42`,
      'Press Enter to continue...',
    ]
    setEntries(
      lines.map((value) => ({
        id: nextEntryIdRef.current++,
        type: 'output',
        value
      }))
    )
    setSshPhase('await_boot')
    sshAutoBootTimerRef.current = setTimeout(() => {
      sshAutoBootTimerRef.current = null
      setMode((m) => (m === 'ssh' ? 'boot' : m))
    }, 1500)
  }, [clearOutputTimers, lastLoginDisplay, SSH_LOGIN_DISPLAY_LINES])

  const sshPhaseRef = useRef(sshPhase)
  sshPhaseRef.current = sshPhase

  const handleSshEnterKey = useCallback(() => {
    if (modeRef.current !== 'ssh') return
    if (sshPhaseRef.current === 'await_boot') {
      if (sshAutoBootTimerRef.current) {
        clearTimeout(sshAutoBootTimerRef.current)
        sshAutoBootTimerRef.current = null
      }
      setMode('boot')
      return
    }
    flushSshFullScriptToAwaitBoot()
  }, [flushSshFullScriptToAwaitBoot])

  // SSH: typed connect → pre-filled login/password → welcome → hint; Enter skips to gate or boots (StrictMode-safe)
  useEffect(() => {
    if (mode !== 'ssh') return undefined

    const myGen = ++sshFlowGenRef.current
    const alive = () => sshFlowGenRef.current === myGen

    const scheduleAwaitBootGate = () => {
      if (sshAutoBootTimerRef.current) {
        clearTimeout(sshAutoBootTimerRef.current)
        sshAutoBootTimerRef.current = null
      }
      sshAutoBootTimerRef.current = setTimeout(() => {
        sshAutoBootTimerRef.current = null
        setMode((m) => (m === 'ssh' ? 'boot' : m))
      }, 1500)
    }

    const afterConnect = () => {
      if (!alive()) return
      setSshPhase('login_display')
      typeOutputLinesRef.current?.(SSH_LOGIN_DISPLAY_LINES, afterLogin, SSH_TIMING)
    }
    const afterLogin = () => {
      if (!alive()) return
      setSshPhase('success')
      typeOutputLinesRef.current?.(
        ['Welcome to portfolio', `Last login: ${lastLoginDisplay} from 192.168.1.42`],
        afterWelcome,
        SSH_TIMING
      )
    }
    const afterWelcome = () => {
      if (!alive()) return
      setSshPhase('continue')
      typeOutputLinesRef.current?.(['Press Enter to continue...'], afterContinueHint, SSH_TIMING)
    }
    const afterContinueHint = () => {
      if (!alive()) return
      setSshPhase('await_boot')
      scheduleAwaitBootGate()
    }

    setSshPhase('connecting')
    typeOutputLinesRef.current?.(SSH_CONNECT_LINES, afterConnect, SSH_TIMING)

    return () => {
      if (sshAutoBootTimerRef.current) {
        clearTimeout(sshAutoBootTimerRef.current)
        sshAutoBootTimerRef.current = null
      }
      sshFlowGenRef.current += 1
      clearOutputTimers()
    }
  }, [mode, clearOutputTimers, lastLoginDisplay, SSH_LOGIN_DISPLAY_LINES, SSH_TIMING])

  useEffect(() => {
    if (mode !== 'ssh') return undefined
    const onKey = (event) => {
      if (event.key !== 'Enter' && event.key !== 'NumpadEnter') return
      event.preventDefault()
      handleSshEnterKey()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, handleSshEnterKey])

  // Boot sequence: instant lines, staggered delays (StrictMode-safe via bootGenRef)
  useEffect(() => {
    if (mode !== 'boot') return undefined
    const myBoot = ++bootGenRef.current
    clearOutputTimers()
    scheduleBootOutputLines(BOOT_LOGS, () => {
      if (bootGenRef.current === myBoot) setMode('terminal')
    })
    return () => {
      clearOutputTimers()
      bootGenRef.current += 1
    }
  }, [mode, clearOutputTimers, scheduleBootOutputLines])

  // Optimized auto-scroll: instant, no animation delay
  useLayoutEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [entries])

  useEffect(() => {
    if (mode !== 'terminal' || isInputGloballyBlocked) return
    inputRef.current?.focus()
  }, [isInputGloballyBlocked, mode])

  useEffect(() => {
    const previousActiveApp = previousActiveAppRef.current
    if (mode !== 'terminal') {
      previousActiveAppRef.current = activeApp
      return
    }
    if (previousActiveApp && !activeApp) {
      if (attachedProcessPid !== null) {
        setProcesses((prev) => prev.map((process) => (
          process.pid === attachedProcessPid ? { ...process, status: 'terminated' } : process
        )))
        setActiveProcess(null)
        setAttachedProcessPid(null)
      }

      if (suppressCloseMessageRef.current) {
        suppressCloseMessageRef.current = false
      } else {
        pushEntry({ type: 'output', value: `${previousActiveApp} closed` })
      }
    }
    previousActiveAppRef.current = activeApp
  }, [activeApp, attachedProcessPid, mode, pushEntry])

  useEffect(() => {
    const handleGlobalInterrupt = (event) => {
      if (!(event.ctrlKey && (event.key === 'c' || event.key === 'C'))) return
      event.preventDefault()

      if (mode !== 'terminal') {
        pushEntry({ type: 'output', value: '^C' })
        return
      }

      if (activeProcess) {
        const pid = activeProcess.pid
        setProcesses((prev) => prev.map((process) => (
          process.pid === pid ? { ...process, status: 'terminated' } : process
        )))
        setActiveProcess(null)
        setAttachedProcessPid(null)
        setIsCommandRunning(false)

        suppressCloseMessageRef.current = true
        if (activeApp) closeApp()

        pushEntry({ type: 'output', value: '^C' })
        pushEntry({ type: 'output', value: `[${pid}] terminated` })
      } else {
        pushEntry({ type: 'output', value: '^C' })
      }
    }

    window.addEventListener('keydown', handleGlobalInterrupt)
    return () => window.removeEventListener('keydown', handleGlobalInterrupt)
  }, [activeApp, activeProcess, closeApp, mode, pushEntry])

  useEffect(() => () => {
    clearOutputTimers()
    if (cursorBlinkTimerRef.current) clearTimeout(cursorBlinkTimerRef.current)
  }, [clearOutputTimers])

  const commands = useMemo(() => createCommandMap(openApp), [openApp])
  const suggestions = useMemo(() => {
    if (mode !== 'terminal') return []
    const normalized = input.trim().toLowerCase()
    if (!normalized) return []
    return AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(normalized))
  }, [input, mode])

  useEffect(() => {
    if (!suggestions.length) {
      setSuggestionIndex(0)
      return
    }
    if (suggestionIndex >= suggestions.length) setSuggestionIndex(0)
  }, [suggestions, suggestionIndex])

  const handleTabComplete = useCallback(() => {
    if (suggestions.length === 1) {
      setInput(suggestions[0])
      setCursorPosition(suggestions[0].length)
      setShowSuggestions(false)
    } else if (suggestions.length > 1) {
      setShowSuggestions(true)
      setSuggestionIndex(0)
    }
  }, [suggestions])

  const handleKeyDown = useCallback(
    (event) => {
      if (mode === 'boot') {
        event.preventDefault()
        return
      }

      if (isInputGloballyBlocked) {
        event.preventDefault()
        return
      }

      bumpCursorBlinkHold()

      if (event.key === 'Tab') {
        event.preventDefault()
        if (suggestions.length === 1) {
          setInput(suggestions[0])
          setCursorPosition(suggestions[0].length)
          setShowSuggestions(false)
        } else if (showSuggestions && suggestions.length > 0) {
          const selected = suggestions[suggestionIndex]
          setInput(selected)
          setCursorPosition(selected.length)
          setShowSuggestions(false)
        } else {
          handleTabComplete()
        }
        return
      }

      if (event.key === 'Escape') {
        setShowSuggestions(false)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (cursorPosition > 0) setCursorPosition((p) => p - 1)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (cursorPosition < input.length) setCursorPosition((p) => p + 1)
        return
      }

      if (event.key === 'Enter') {
        let rawInput = input
        if (showSuggestions && suggestions.length > 0) {
          event.preventDefault()
          const selected = suggestions[suggestionIndex]
          setInput(selected)
          setCursorPosition(selected.length)
          setShowSuggestions(false)
          rawInput = selected
        } else {
          setShowSuggestions(false)
        }

        const trimmedInput = rawInput.trim()

        if (trimmedInput === '') {
          pushEntry({ type: 'input', value: '', pathLabel: promptPath })
          setInput('')
          setCursorPosition(0)
          return
        }

        if (trimmedInput.toLowerCase() === 'clear') {
          clearOutputTimers()
          setIsCommandRunning(false)
          setEntries([])
          setProcesses([])
          setActiveProcess(null)
          setAttachedProcessPid(null)
          setInput('')
          setCursorPosition(0)
          return
        }

        if (trimmedInput.toLowerCase() === 'exit') {
          clearOutputTimers()
          pushEntry({ type: 'input', value: rawInput, pathLabel: promptPath })
          pushEntry({ type: 'output', value: 'logout\nsession closed' })
          setInput('')
          setCursorPosition(0)
          // Notify parent to show desktop
          if (onExit) {
            setTimeout(() => onExit(), 500)
          }
          return
        }

        pushEntry({ type: 'input', value: rawInput, pathLabel: promptPath })
        setInput('')
        setCursorPosition(0)

        if (activeProcess || isCommandRunning) {
          pushEntry({
            type: 'output',
            value: activeProcess ? `process busy: [${activeProcess.pid}] running ${activeProcess.name}` : 'process busy'
          })
          return
        }

        const pid = nextPidRef.current
        nextPidRef.current += 1
        const process = { pid, name: trimmedInput, status: 'running' }
        setProcesses((prev) => [...prev, process])
        setActiveProcess(process)

        const commandResult = executeCommand(rawInput, commands, {
          pid,
          currentDirectory,
          setCurrentDirectory,
          processes,
          terminateProcessByPid: (targetPid) => {
            const targetProcess = processes.find((processItem) => processItem.pid === targetPid)
            if (!targetProcess || targetProcess.status === 'terminated') return false

            setProcesses((prev) => prev.map((item) => (
              item.pid === targetPid ? { ...item, status: 'terminated' } : item
            )))

            if (activeProcess?.pid === targetPid) {
              setActiveProcess(null)
              setAttachedProcessPid(null)
              if (activeApp) {
                suppressCloseMessageRef.current = true
                closeApp()
              }
            }
            return true
          }
        })

        if (commandResult.type === 'app') {
          setAttachedProcessPid(pid)
          pushEntry({ type: 'output', value: `[${pid}] running ${trimmedInput}` })
        } else if (commandResult.content === '__EXIT__') {
          pushEntry({ type: 'output', value: 'logout\nsession closed' })
          setProcesses((prev) => prev.map((item) => (
            item.pid === pid ? { ...item, status: 'terminated' } : item
          )))
          setActiveProcess(null)
          setAttachedProcessPid(null)
          // Notify parent to show desktop
          if (onExit) {
            setTimeout(() => onExit(), 500)
          }
        } else if (commandResult.isError) {
          const outputLines = commandResult.content.split('\n')
          outputLines.forEach((line) => {
            if (line.trim() !== '') pushEntry({ type: 'output', value: line })
          })
          setProcesses((prev) => prev.map((item) => (
            item.pid === pid ? { ...item, status: 'terminated' } : item
          )))
          setActiveProcess(null)
          setAttachedProcessPid(null)
        } else {
          setIsCommandRunning(true)
          const outputLines = commandResult.content.split('\n')
          scheduleTypedOutput(outputLines)
          setProcesses((prev) => prev.map((item) => (
            item.pid === pid ? { ...item, status: 'terminated' } : item
          )))
          setActiveProcess(null)
          setAttachedProcessPid(null)
        }

        setCommandHistory((prev) => [...prev, rawInput])
        setHistoryIndex(-1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (showSuggestions && suggestions.length > 0) {
          const nextIndex = suggestionIndex <= 0 ? suggestions.length - 1 : suggestionIndex - 1
          setSuggestionIndex(nextIndex)
        } else if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          const nextIndex = historyIndex + 1
          setHistoryIndex(nextIndex)
          const cmd = commandHistory[commandHistory.length - 1 - nextIndex]
          setInput(cmd)
          setCursorPosition(cmd.length)
        }
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (showSuggestions && suggestions.length > 0) {
          const nextIndex = (suggestionIndex + 1) % suggestions.length
          setSuggestionIndex(nextIndex)
        } else if (historyIndex > 0) {
          const nextIndex = historyIndex - 1
          setHistoryIndex(nextIndex)
          const cmd = commandHistory[commandHistory.length - 1 - nextIndex]
          setInput(cmd)
          setCursorPosition(cmd.length)
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInput('')
          setCursorPosition(0)
        }
        return
      }
    },
    [
      mode,
      isInputGloballyBlocked,
      suggestions,
      showSuggestions,
      suggestionIndex,
      handleTabComplete,
      input,
      pushEntry,
      promptPath,
      activeProcess,
      isCommandRunning,
      commands,
      currentDirectory,
      processes,
      activeApp,
      closeApp,
      scheduleTypedOutput,
      commandHistory,
      historyIndex,
      clearOutputTimers,
      cursorPosition,
      bumpCursorBlinkHold
    ]
  )

  const handleInputChange = useCallback(
    (event) => {
      if (mode !== 'terminal' || isInputGloballyBlocked) return
      const value = event.target.value
      setInput(value)
      setCursorPosition(value.length)
      setShowSuggestions(value.trim().length > 0)
      setSuggestionIndex(0)
      bumpCursorBlinkHold()
    },
    [mode, isInputGloballyBlocked, bumpCursorBlinkHold]
  )

  const inputValue = mode === 'terminal' ? input : ''

  const showCursor = mode === 'terminal' && !isInputGloballyBlocked

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-black">
      <TerminalHeader />
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden bg-black font-mono text-sm text-red-500 sm:text-sm"
        onClick={() => {
          if (mode === 'terminal') inputRef.current?.focus()
        }}
      >
        <div
          ref={outputRef}
          className="terminal-scroll-hidden min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pt-3 sm:px-4 sm:pt-4"
          style={{ scrollBehavior: 'instant' }}
        >
          <TerminalHistory entries={entries} />

          {mode === 'terminal' && (
            <div className="relative mt-0.5 min-h-[1.25rem] min-w-0 font-mono text-sm leading-normal">
              <span className="inline min-w-0 whitespace-pre-wrap break-words align-baseline">
                <span style={{ color: PROMPT_USER_COLOR }}>samarsingh</span>
                <span className="text-gray-300">@portfolio</span>
                <span className="text-blue-400">:{promptPath}</span>
                <span className="text-red-400">$&nbsp;</span>
                {showCursor ? (
                  <span className="whitespace-pre-wrap break-all text-white">
                    {input.slice(0, cursorPosition)}
                    <span
                      ref={cursorRef}
                      className={`pointer-events-none inline-block h-[1.1em] w-[0.6em] shrink-0 bg-red-500 ${
                        cursorBlinkSolid ? 'terminal-input-cursor--solid' : 'terminal-input-cursor'
                      }`}
                      style={{ verticalAlign: 'text-bottom' }}
                      aria-hidden
                    />
                    {input.slice(cursorPosition)}
                  </span>
                ) : (
                  <span className="break-all text-white">{input}</span>
                )}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isInputGloballyBlocked}
                className="absolute inset-0 z-10 min-h-[1.25rem] w-full cursor-text font-mono text-sm opacity-0"
                spellCheck={false}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 z-20 mt-0 max-h-40 min-w-[12rem] overflow-y-auto border border-red-500 bg-black">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onMouseDown={(e) => {
                        e.preventDefault() // prevent input blur
                        setInput(suggestion)
                        setCursorPosition(suggestion.length)
                        setShowSuggestions(false)
                        
                        // Fake enter key press to execute immediately
                        handleKeyDown({ key: 'Enter', preventDefault: () => {} })
                      }}
                      className={`cursor-pointer px-2 py-1 text-xs font-mono ${
                        index === suggestionIndex ? 'bg-red-500 text-black font-bold' : 'text-red-500 bg-black hover:bg-red-900 hover:text-white'
                      }`}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-neutral-800/90 px-3 pt-2 pb-3 text-left sm:px-4">
          <div className="text-xs leading-relaxed text-red-600/85">
            <p className="whitespace-normal">{"Welcome to Samar Singh's Portfolio"}</p>
            <p className="mt-0.5 whitespace-normal">{"Type 'help' to get started"}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Terminal
