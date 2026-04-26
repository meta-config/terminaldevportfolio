# PortfolioOS - Terminal-Based Portfolio

## PROJECT DESCRIPTION

A Linux terminal-based portfolio website that simulates a real operating system environment. It includes an interactive terminal, command system, internal applications, games, and dynamic layout behavior.

## FEATURES

- Interactive Linux-like terminal with authentic command execution
- Command-based navigation and file system simulation
- Built-in applications (PDF viewer, image viewer, games)
- External links integration (GitHub, LinkedIn, Instagram, LeetCode, Codeforces)
- OS-like window management with minimize, maximize, and close controls
- Bootloader and SSH simulation for realistic boot sequence
- Split-screen layout for terminal and app panel
- Draggable desktop icons with persistent positioning
- Retro-styled games (Snake, Flappy Bird, Tic Tac Toe, Number Guessing, Dino)
- ASCII art system info (neofetch, screenfetch, datafetch)

## TECH STACK

### Frontend
- React 18
- Tailwind CSS 4
- Vite

### Core
- JavaScript (ES6+)
- Canvas API for game rendering

### Concepts
- State management with React hooks
- Virtual terminal simulation
- UI/UX animations with GPU acceleration
- Context API for layout state
- Component persistence across state changes

## AVAILABLE COMMANDS

### Information
- `help` - List all available commands
- `about` - Learn about Samar Singh
- `skills` - View technical skills
- `projects` - View projects
- `contact` - Get contact information
- `resume` - View and download resume PDF

### System
- `neofetch` - Display system information
- `screenfetch` - Display system info (compact)
- `datafetch` - Display custom ASCII art
- `whoami` - Display current user
- `ps` - List processes
- `kill [pid]` - Terminate process
- `man [cmd]` - Show manual page

### File System
- `ls` - List directory contents
- `cd [dir]` - Change directory
- `pwd` - Print working directory

### Games
- `snake` - Play Snake game
- `tictactoe` - Play Tic Tac Toe
- `flappy` - Play Flappy Bird
- `guess` - Play Number Guessing
- `dino` - Play Chrome Dino game

### External Links
- `github` - Open GitHub profile
- `linkedin` - Open LinkedIn profile
- `instagram` - Open Instagram profile
- `leetcode` - Open LeetCode profile
- `codeforces` - Open Codeforces profile
- `codolio` - Open Codolio profile

### Utilities
- `clear` - Clear terminal screen
- `exit` - Close terminal session
- `sudo hire-me` - Special hiring command

## GETTING STARTED

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd tuipotfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## PROJECT STRUCTURE

```
tuipotfolio/
├── src/
│   ├── apps/              # Game and app components
│   ├── components/        # UI components
│   ├── layout/            # Layout management
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML template
└── package.json           # Dependencies
```

## LICENSE

MIT License - Feel free to use this project for learning or inspiration.

## AUTHOR

**Samar Singh**
- GitHub: https://github.com/meta-config
- LinkedIn: https://www.linkedin.com/in/samarsingh1/
- Portfolio: Terminal-based interactive experience
