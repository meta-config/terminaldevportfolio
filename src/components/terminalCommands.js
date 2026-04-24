export const AVAILABLE_COMMANDS = [
  'help', 'about', 'skills', 'projects', 'contact', 'resume',
  'docs', 'pictures', 'snake', 'tictactoe', 'flappy', 'guess',
  'github', 'linkedin', 'instagram', 'leetcode', 'codeforces', 'codolio',
  'whoami', 'clear', 'ls', 'cd', 'pwd', 'grep', 'ps', 'kill', 'man', 'apt', 'sudo hire-me'
]

const text = (content) => ({ type: 'text', content })
const app = (content) => ({ type: 'app', content })
const HOME_DIRECTORY = '/home/samarsingh'
const FILE_SYSTEM = {
  '/home/samarsingh': ['pictures', 'projects', 'documents'],
  '/home/samarsingh/pictures': [],
  '/home/samarsingh/projects': [],
  '/home/samarsingh/documents': []
}

const getDirectoryEntries = (path) => FILE_SYSTEM[path] || null
const APT_PACKAGES = new Set(['skills', 'projects', 'ai', 'portfolio'])
const MAN_PAGES = {
  help: {
    name: 'help',
    summary: 'list available commands',
    description: 'Displays all supported terminal commands and quick usage hints.'
  },
  projects: {
    name: 'projects',
    summary: 'show project portfolio',
    description: 'Prints highlighted projects with technology stack and links.'
  },
  snake: {
    name: 'snake',
    summary: 'launch Snake game',
    description: 'Opens the Snake game in the app panel and attaches process state.'
  },
  apt: {
    name: 'apt',
    summary: 'simulate package management',
    description: 'Supports fake installation flow via apt install <package>.'
  },
  man: {
    name: 'man',
    summary: 'read command manual pages',
    description: 'Shows formatted NAME and DESCRIPTION sections for commands.'
  }
}

const resolvePath = (currentDirectory, rawTarget) => {
  const target = rawTarget.trim()
  if (!target || target === '~') {
    return HOME_DIRECTORY
  }

  if (target === '..') {
    if (currentDirectory === HOME_DIRECTORY) {
      return HOME_DIRECTORY
    }
    const segments = currentDirectory.split('/')
    segments.pop()
    return segments.join('/') || HOME_DIRECTORY
  }

  if (target.startsWith('/')) {
    return target.replace(/\/+$/, '') || '/'
  }

  if (target.startsWith('~/')) {
    return `${HOME_DIRECTORY}/${target.slice(2)}`.replace(/\/+$/, '')
  }

  return `${currentDirectory}/${target}`.replace(/\/+$/, '')
}

export const createCommandMap = (openApp) => ({
  help: () => text(
    'Available commands:\n' +
    '  help        - List all available commands\n' +
    '  about       - Learn about Samar Singh\n' +
    '  skills      - View technical skills\n' +
    '  projects    - View projects\n' +
    '  contact     - Get contact information\n' +
    '  resume      - View and download resume PDF\n' +
    '  docs        - Open documentation PDF\n' +
    '  pictures    - View personal photo gallery\n' +
    '  snake       - Play Snake game\n' +
    '  tictactoe   - Play Tic Tac Toe (2 players)\n' +
    '  flappy      - Play Flappy Bird (ASCII)\n' +
    '  guess       - Play Number Guessing game\n' +
    '  github      - Open GitHub profile\n' +
    '  linkedin    - Open LinkedIn profile\n' +
    '  instagram   - Open Instagram profile\n' +
    '  leetcode    - Open LeetCode profile\n' +
    '  codeforces  - Open Codeforces profile\n' +
    '  codolio     - Open Codolio profile\n' +
    '\n' +
    'File System Commands:\n' +
    '  ls          - List directory contents\n' +
    '  cd [dir]    - Change directory (documents, projects, pictures)\n' +
    '  pwd         - Print working directory\n' +
    '  whoami      - Display current user\n' +
    '  ps          - List processes\n' +
    '  kill [pid]  - Terminate process by pid\n' +
    '  man [cmd]   - Show manual page for command\n' +
    '  apt install - Simulate package installation\n' +
    '\n' +
    'Easter Eggs:\n' +
    '  sudo hire-me - Special hiring command\n' +
    '\n' +
    'Utilities:\n' +
    '  clear       - Clear terminal screen\n' +
    '\n' +
    'Tip: Use Tab for autocomplete, ↑↓ for history\n'
  ),
  about: () => text(
    'Samar Singh is an aspiring software developer and AI-ML student with strong\n' +
    'foundations in programming, data structures, and system design. He builds\n' +
    'scalable and efficient solutions and has experience developing real-world projects.\n'
  ),
  skills: () => text(
    'Technical Skills:\n' +
    '\n' +
    'Languages:  C, C++, Python, JavaScript\n' +
    'Frontend:   HTML, CSS, TailwindCSS, React\n' +
    'Backend:    Node.js\n' +
    'Data/AI:    NumPy, Pandas, TensorFlow, Scikit-learn, Matplotlib\n' +
    'Tools:      Git, GitHub, Docker, Redis, Kubernetes\n' +
    'Core:       DSA, OS, CN, DBMS, System Design, LLM\n' +
    'Other:      Linux, Linux commands, Web hosting\n'
  ),
  projects: () => text(
    'Projects:\n' +
    '\n' +
    'ThaiTourDMC - Tours and travel website\n' +
    '  Tech: HTML, CSS, Tailwind, React\n' +
    '  GitHub: https://github.com/meta-config/ThaiTourDMC\n' +
    '  Live: https://thaitourdmc.com\n'
  ),
  contact: () => text(
    'Contact Information:\n' +
    '\n' +
    'Email:\n' +
    'https://mail.google.com/mail/?view=cm&to=meta.config.smr@gmail.com\n' +
    'Phone:\n' +
    'tel:+918467098054\n' +
    'Instagram:\n' +
    'https://www.instagram.com/smr.ext/?hl=en\n' +
    'Location:   India\n'
  ),
  whoami: () => text('samarsingh\n'),
  'sudo hire-me': () => text(
    '[sudo] password for samarsingh: ********\n' +
    '\n' +
    'Permission granted. Hiring Samar Singh...\n' +
    '\n' +
    '✓ Loading qualifications...\n' +
    '✓ Checking availability...\n' +
    '✓ Verifying skills...\n' +
    '✓ Contacting references...\n' +
    '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '  🎉 CONGRATULATIONS! 🎉\n' +
    '\n' +
    '  You are now considering hiring\n' +
    '  Samar Singh - Software Developer\n' +
    '\n' +
    '  📧 meta.config.smr@gmail.com\n' +
    '  📱 +91 8467098054\n' +
    '  💼 Ready to join your team!\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '\n' +
    'Type "contact" to get in touch!\n'
  ),
  ls: () => text('documents/  projects/  pictures/\n'),
  cd: () => text(
    'Available directories:\n' +
    '  cd documents  - Personal documents\n' +
    '  cd projects   - Project files\n' +
    '  cd pictures   - Photo gallery (type "pictures" to open)\n'
  ),
  pwd: () => text('/home/samarsingh\n'),
  clear: () => text('__CLEAR__'),
  pictures: () => {
    openApp('pictures')
    return app('Opening pictures...')
  },
  snake: () => {
    openApp('snake')
    return app('Opening snake...')
  },
  tictactoe: () => {
    openApp('tictactoe')
    return app('Opening tictactoe...')
  },
  flappy: () => {
    openApp('flappy')
    return app('Opening flappy...')
  },
  guess: () => {
    openApp('guess')
    return app('Opening guess...')
  },
  github: () => {
    openApp('github')
    return app('Opening github...')
  },
  linkedin: () => {
    openApp('linkedin')
    return app('Opening linkedin...')
  },
  instagram: () => {
    openApp('instagram')
    return app('Opening instagram...')
  },
  leetcode: () => {
    openApp('leetcode')
    return app('Opening leetcode...')
  },
  codeforces: () => {
    openApp('codeforces')
    return app('Opening codeforces...')
  },
  codolio: () => {
    openApp('codolio')
    return app('Opening codolio...')
  },
  resume: () => {
    openApp('resume')
    return app('Opening resume...')
  },
  docs: () => {
    openApp('docs')
    return app('Opening docs...')
  }
})

export const executeCommand = (input, commandMap, context = {}) => {
  const trimmed = input.trim()

  if (!trimmed) {
    return text('')
  }

  const segments = trimmed.split('|').map((segment) => segment.trim()).filter(Boolean)
  if (!segments.length) {
    return text('')
  }

  let pipedLines = null
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    const normalized = segment.toLowerCase()
    const grepMatch = normalized.match(/^grep\s+(.+)$/)

    if (grepMatch) {
      if (!pipedLines) {
        return text('grep: no input to filter\n')
      }

      const keyword = grepMatch[1].trim().toLowerCase()
      pipedLines = pipedLines.filter((line) => line.toLowerCase().includes(keyword))
      continue
    }

    let result
    const [commandName, ...args] = segment.split(/\s+/)
    const currentDirectory = context.currentDirectory || HOME_DIRECTORY
    const setCurrentDirectory = context.setCurrentDirectory
    const pid = context.pid
    const processList = context.processes || []
    const terminateProcessByPid = context.terminateProcessByPid

    if (commandName === 'ls') {
      const entries = getDirectoryEntries(currentDirectory)
      if (!entries) {
        result = text('ls: cannot access current directory\n')
      } else {
        result = text(`${entries.map((entry) => `${entry}/`).join('  ')}\n`)
      }
    } else if (commandName === 'pwd') {
      result = text(`${currentDirectory}\n`)
    } else if (commandName === 'cd') {
      const target = args.join(' ')
      const resolvedPath = resolvePath(currentDirectory, target)
      const targetEntries = getDirectoryEntries(resolvedPath)
      if (!targetEntries) {
        result = text(`cd: no such file or directory: ${target || '~'}\n`)
      } else {
        if (typeof setCurrentDirectory === 'function') {
          setCurrentDirectory(resolvedPath)
        }
        result = text('')
      }
    } else if (commandName === 'ps') {
      const lines = processList
        .map((process) => `${process.pid}  ${process.status.padEnd(10, ' ')} ${process.name}`)
      result = text(lines.length ? `PID  STATUS     COMMAND\n${lines.join('\n')}\n` : 'PID  STATUS     COMMAND\n')
    } else if (commandName === 'kill') {
      const targetPid = Number(args[0])
      if (!Number.isFinite(targetPid)) {
        result = text('kill: usage: kill <pid>\n')
      } else if (typeof terminateProcessByPid !== 'function') {
        result = text(`kill: failed to terminate ${targetPid}\n`)
      } else {
        const didTerminate = terminateProcessByPid(targetPid)
        result = text(didTerminate ? `[${targetPid}] terminated\n` : `kill: (${targetPid}) - no such process\n`)
      }
    } else if (commandName === 'man') {
      const subject = (args[0] || '').toLowerCase()
      const page = MAN_PAGES[subject]
      if (!subject) {
        result = text('man: missing command name\n')
      } else if (!page) {
        result = text(`No manual entry for ${subject}\n`)
      } else {
        result = text(
          'NAME\n' +
          `    ${page.name} - ${page.summary}\n\n` +
          'DESCRIPTION\n' +
          `    ${page.description}\n`
        )
      }
    } else if (commandName === 'apt') {
      if (args[0] !== 'install' || !args[1]) {
        result = text('Usage: apt install <package>\n')
      } else {
        const pkg = args[1].toLowerCase()
        if (!APT_PACKAGES.has(pkg)) {
          result = text(`E: Unable to locate package ${pkg}\n`)
        } else {
          result = text(
            'Reading package lists...\n' +
            'Building dependency tree...\n' +
            `Installing ${pkg}...\n` +
            'Done.\n'
          )
        }
      }
    } else {
      const handler = commandMap[normalized]
      result = handler ? handler() : text(`command not found: ${normalized}\n`)
    }

    if (result.type === 'app') {
      if (index < segments.length - 1) {
        return text('pipe error: cannot pipe app command output\n')
      }
      return { ...result, pid }
    }

    // Normalize to lines so each pipe stage can consume prior output.
    pipedLines = result.content.split('\n').filter((line) => line.length > 0)
  }

  return text(`${(pipedLines || []).join('\n')}\n`)
}
