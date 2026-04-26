export const AVAILABLE_COMMANDS = [
  'help', 'about', 'skills', 'projects', 'contact', 'resume',
  'docs', 'pictures', 'snake', 'tictactoe', 'flappy', 'guess', 'dino',
  'github', 'linkedin', 'instagram', 'leetcode', 'codeforces', 'codolio',
  'whoami', 'clear', 'ls', 'cd', 'pwd', 'grep', 'ps', 'kill', 'man', 'apt',
  'neofetch', 'screenfetch', 'datafetch', 'exit', 'sudo hire-me'
]

const text = (content, isError = false) => ({ type: 'text', content, isError })
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
    '  flappy      - Play Flappy Bird (block style)\n' +
    '  guess       - Play Number Guessing game\n' +
    '  dino        - Play Chrome Dino game\n' +
    '  github      - Open GitHub profile\n' +
    '  linkedin    - Open LinkedIn profile\n' +
    '  instagram   - Open Instagram profile\n' +
    '  leetcode    - Open LeetCode profile\n' +
    '  codeforces  - Open Codeforces profile\n' +
    '  codolio     - Open Codolio profile\n' +
    '\n' +
    'System Commands:\n' +
    '  neofetch    - Display system information\n' +
    '  screenfetch - Display system info (compact)\n' +
    '  datafetch   - Display custom ASCII art\n' +
    '  whoami      - Display current user\n' +
    '  ps          - List processes\n' +
    '  kill [pid]  - Terminate process by pid\n' +
    '  man [cmd]   - Show manual page for command\n' +
    '  apt install - Simulate package installation\n' +
    '  sudo hire-me - Special hiring command\n' +
    '\n' +
    'File System Commands:\n' +
    '  ls          - List directory contents\n' +
    '  cd [dir]    - Change directory (documents, projects, pictures)\n' +
    '  pwd         - Print working directory\n' +
    '\n' +
    'Utilities:\n' +
    '  clear       - Clear terminal screen\n' +
    '  exit        - Close terminal session\n' +
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
    window.open('https://github.com/meta-config', '_blank')
    return text('Opening GitHub in a new tab...\n')
  },
  linkedin: () => {
    window.open('https://www.linkedin.com/in/samarsingh1/', '_blank')
    return text('Opening LinkedIn in a new tab...\n')
  },
  instagram: () => {
    window.open('https://www.instagram.com/smr.ext/?hl=en', '_blank')
    return text('Opening Instagram in a new tab...\n')
  },
  leetcode: () => {
    window.open('https://leetcode.com/u/meta-config-smr/', '_blank')
    return text('Opening LeetCode in a new tab...\n')
  },
  codeforces: () => {
    window.open('https://codeforces.com/profile/meta.config.smr', '_blank')
    return text('Opening Codeforces in a new tab...\n')
  },
  codolio: () => {
    window.open('https://codolio.com/profile/meta.config.smr', '_blank')
    return text('Opening Codolio in a new tab...\n')
  },
  resume: () => {
    openApp('resume')
    return app('Opening resume...')
  },
  docs: () => {
    openApp('docs')
    return app('Opening docs...')
  },
  neofetch: () => text(
    '[32m        .-/+oossssoo+/-.        [0m  [1msamarsingh[0m@[1mportfolio[0m\n' +
    '[32m    `:+ssssssssssssssssss+:`    [0m  -----------------\n' +
    '[32m  -+ssssssssssssssssssyyssss+-  [0m  [1mOS:[0m PortfolioOS 1.0.0 x86_64\n' +
    '[32m .ossssssssssssssssssd[0mMMMNy[32mssso.[0m  [1mHost:[0m Web Browser\n' +
    '[32m/osssssssssssshdmmNNmmyNMMMMh[0m  [1mKernel:[0m React 18 + Vite\n' +
    '[32m+ssssssssshmydMMMMMMMN[0mddddy[32m/[0m  [1mUptime:[0m just now\n' +
    '[32m/sssssssshNMMMyhhyyyhdmmNN[0m  [1mShell:[0m custom-terminal 1.0\n' +
    '[32m.ssssssssdMMMNh[0msssssssssshmy[32m  [0m[1mResolution:[0m responsive\n' +
    '[32m+ssss[0mhhhyNMMNy[32mssssssssssssy[0m  [1mDE:[0m Terminal UI\n' +
    '[32mossyNMMMNyMMh[0mssssssssssss[32m  [0m[1mWM:[0m React Router\n' +
    '[32m+ssss[0mhhhyNMMNy[32mssssssssssssy[0m  [1mTerminal:[0m Portfolio Term\n' +
    '[32m.ssssssssdMMMNh[0msssssssssshmy[32m  [0m[1mCPU:[0m JavaScript V8\n' +
    '[32m/sssssssshNMMMyhhyyyhdmmNN[0m  [1mMemory:[0m optimized\n' +
    '[32m+ssssssssshmydMMMMMMMN[0mddddy[32m/[0m\n' +
    '[32m/osssssssssssshdmmNNmmyNMMMMh[0m  [1mLanguages:[0m C, C++, Python, JavaScript\n' +
    '[32m .ossssssssssssssssssd[0mMMMNy[32mssso.[0m  [1mFrontend:[0m React, TailwindCSS\n' +
    '[32m  -+sssssssssssssssssyyyssss+-  [0m[1mBackend:[0m Node.js\n' +
    '[32m    `:+ssssssssssssssssss+:`    [0m[1mTools:[0m Git, Docker, Redis, K8s\n' +
    '[32m        .-/+oossssoo+/-.        [0m\n'
  ),
  screenfetch: () => text(
    '\x1b[32m         _____        \x1b[0m\n' +
    '\x1b[32m        /  ___|       \x1b[0m  \x1b[1msamarsingh\x1b[0m@\x1b[1mportfolio\x1b[0m\n' +
    '\x1b[32m       |  |           \x1b[0m  \x1b[1mOS:\x1b[0m PortfolioOS\n' +
    '\x1b[32m       |  |           \x1b[0m  \x1b[1mShell:\x1b[0m custom-terminal\n' +
    '\x1b[32m       |  |____       \x1b[0m  \x1b[1mTech:\x1b[0m React + Vite + Tailwind\n' +
    '\x1b[32m        \\______\\      \x1b[0m  \x1b[1mSkills:\x1b[0m C, C++, Python, JS\n' +
    '\x1b[32m                    \x1b[0m  \x1b[1mStatus:\x1b[0m ready to hire\n' +
    '\n'
  ),
  datafetch: () => text(
    '\x1b[37m       ██████\x1b[0m  \x1b[36m"Fear of death is ridiculous because\x1b[0m\n' +
    '\x1b[37m     ██\x1b[31m░░\x1b[0m\x1b[37m  ██\x1b[0m  \x1b[36mas long as you are not dead you are\x1b[0m\n' +
    '\x1b[37m   ██\x1b[31m░░░░░░\x1b[0m\x1b[37m██\x1b[0m  \x1b[36malive and when you are dead there is\x1b[0m\n' +
    '\x1b[37m  ██\x1b[31m░░\x1b[0m\x1b[37m██████\x1b[0m\x1b[31m░░\x1b[0m\x1b[37m██\x1b[0m  \x1b[36mnothing more to worry about!\x1b[0m\n' +
    '\x1b[37m  ██\x1b[31m░░\x1b[0m\x1b[37m██\x1b[0m\x1b[31m░░\x1b[0m\x1b[37m  ██\x1b[0m\n' +
    '\x1b[37m  ██\x1b[31m░░\x1b[0m\x1b[37m██████\x1b[0m\x1b[31m░░\x1b[0m\x1b[37m██\x1b[0m  \x1b[36m- Samar Singh\x1b[0m\n' +
    '\x1b[37m   ██\x1b[31m░░░░░░\x1b[0m\x1b[37m██\x1b[0m\n' +
    '\x1b[37m     ██\x1b[31m░░\x1b[0m\x1b[37m  ██\x1b[0m\n' +
    '\x1b[37m       ██████\x1b[0m\n' +
    '\n'
  ),
  dino: () => {
    openApp('dino')
    return app('Opening dino...')
  },
  exit: () => text('__EXIT__')
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

    if (normalized === 'clear') {
      return text('__CLEAR__')
    }

    if (normalized === 'exit') {
      return text('__EXIT__')
    }
    if (grepMatch) {
      if (!pipedLines) {
        return text('grep: no input to filter\n', true)
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
        result = text('ls: cannot access current directory\n', true)
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
        result = text(`cd: no such file or directory: ${target || '~'}\n`, true)
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
        result = text('kill: usage: kill <pid>\n', true)
      } else if (typeof terminateProcessByPid !== 'function') {
        result = text(`kill: failed to terminate ${targetPid}\n`, true)
      } else {
        const didTerminate = terminateProcessByPid(targetPid)
        result = didTerminate ? text(`[${targetPid}] terminated\n`) : text(`kill: (${targetPid}) - no such process\n`, true)
      }
    } else if (commandName === 'man') {
      const subject = (args[0] || '').toLowerCase()
      const page = MAN_PAGES[subject]
      if (!subject) {
        result = text('man: missing command name\n', true)
      } else if (!page) {
        result = text(`No manual entry for ${subject}\n`, true)
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
        result = text('Usage: apt install <package>\n', true)
      } else {
        const pkg = args[1].toLowerCase()
        if (!APT_PACKAGES.has(pkg)) {
          result = text(`E: Unable to locate package ${pkg}\n`, true)
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
      result = handler ? handler() : text(`command not found: ${normalized}\n`, true)
    }

    if (result.type === 'app') {
      if (index < segments.length - 1) {
        return text('pipe error: cannot pipe app command output\n', true)
      }
      return { ...result, pid }
    }

    // Normalize to lines so each pipe stage can consume prior output.
    pipedLines = result.content.split('\n').filter((line) => line.length > 0)
  }

  return text(`${(pipedLines || []).join('\n')}\n`)
}
