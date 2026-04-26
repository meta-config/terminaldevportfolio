import { useLayout } from '../layout'
import AppPanel from './AppPanel'
import ResumeApp from '../apps/ResumeApp'
import PicturesApp from '../apps/PicturesApp'
import SnakeGame from '../apps/SnakeGame'
import TicTacToe from '../apps/TicTacToe'
import FlappyBird from '../apps/FlappyBird'
import NumberGuessingGame from '../apps/NumberGuessingGame'
import DinoGame from '../apps/DinoGame'

const APP_REGISTRY = {
  about: {
    title: 'About',
    component: () => (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4 text-green-400">About Samar Singh</h2>
        <p className="text-gray-300 leading-relaxed">
          Samar Singh is an aspiring software developer and AI-ML student with strong
          foundations in programming, data structures, and system design. He builds
          scalable and efficient solutions and has experience developing real-world projects.
        </p>
      </div>
    )
  },
  skills: {
    title: 'Skills',
    component: () => (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Technical Skills</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Languages</h3>
            <p className="text-gray-300">C, C++, Python, JavaScript</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Frontend</h3>
            <p className="text-gray-300">HTML, CSS, TailwindCSS, React</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Backend</h3>
            <p className="text-gray-300">Node.js</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Data/AI</h3>
            <p className="text-gray-300">NumPy, Pandas, TensorFlow, Scikit-learn, Matplotlib</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Tools</h3>
            <p className="text-gray-300">Git, GitHub, Docker, Redis, Kubernetes</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Core</h3>
            <p className="text-gray-300">DSA, OS, CN, DBMS, System Design, LLM</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Other</h3>
            <p className="text-gray-300">Linux, Linux commands, Web hosting</p>
          </div>
        </div>
      </div>
    )
  },
  projects: {
    title: 'Projects',
    component: () => (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Projects</h2>
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <h3 className="text-xl font-semibold mb-2 text-red-400">ThaiTourDMC</h3>
          <p className="text-gray-300 mb-3">Tours and travel website</p>
          <div className="space-y-2 text-sm">
            <p><span className="text-green-400 font-semibold">Tech:</span> HTML, CSS, Tailwind, React</p>
            <p>
              <span className="text-green-400 font-semibold">GitHub:</span>{' '}
              <a href="https://github.com/meta-config/ThaiTourDMC" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-400 hover:text-blue-300 underline">
                https://github.com/meta-config/ThaiTourDMC
              </a>
            </p>
            <p>
              <span className="text-green-400 font-semibold">Live:</span>{' '}
              <a href="https://thaitourdmc.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-400 hover:text-blue-300 underline">
                https://thaitourdmc.com
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  },
  contact: {
    title: 'Contact',
    component: () => (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Contact Information</h2>
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="space-y-3">
              <div>
                <span className="text-green-400 font-semibold block mb-1">Email</span>
                <a href="mailto:meta.config.smr@gmail.com" className="text-gray-300 hover:text-white">
                  meta.config.smr@gmail.com
                </a>
              </div>
              <div>
                <span className="text-green-400 font-semibold block mb-1">Phone</span>
                <a href="tel:+918467098054" className="text-gray-300 hover:text-white">
                  +91 8467098054
                </a>
              </div>
              <div>
                <span className="text-green-400 font-semibold block mb-1">Instagram</span>
                <a href="https://www.instagram.com/smr.ext/?hl=en" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-400 hover:text-blue-300 underline">
                  @smr.ext
                </a>
              </div>
              <div>
                <span className="text-green-400 font-semibold block mb-1">Location</span>
                <p className="text-gray-300">India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  resume: {
    title: 'Resume',
    component: ResumeApp
  },
  docs: {
    title: 'Documentation',
    component: () => (
      <ResumeApp
        title="Documentation"
        subtitle="Project documentation PDF"
        pdfUrl="/Samar_Singh_Resume.pdf"
        downloadName="documentation.pdf"
      />
    )
  },

  pictures: {
    title: 'Pictures',
    component: ({ onClose }) => (
      <PicturesApp onClose={onClose} />
    )
  },
  snake: {
    title: 'Snake Game',
    component: ({ onClose }) => (
      <SnakeGame onClose={onClose} />
    )
  },
  tictactoe: {
    title: 'Tic Tac Toe',
    component: ({ onClose }) => (
      <TicTacToe onClose={onClose} />
    )
  },
  flappy: {
    title: 'Flappy Bird',
    component: ({ onClose }) => (
      <FlappyBird onClose={onClose} />
    )
  },
  guess: {
    title: 'Number Guessing',
    component: ({ onClose }) => (
      <NumberGuessingGame onClose={onClose} />
    )
  },
  dino: {
    title: 'Dino Game',
    component: ({ onClose }) => (
      <DinoGame onClose={onClose} />
    )
  }
}

const AppContainer = () => {
  const { activeApp, closeApp, openApp } = useLayout()

  if (!activeApp || !APP_REGISTRY[activeApp]) {
    return null
  }

  const appConfig = APP_REGISTRY[activeApp]
  const AppComponent = appConfig.component
  const isGameApp = ['snake', 'tictactoe', 'flappy', 'guess'].includes(activeApp)
  const headerActions = isGameApp
    ? [{
        label: 'restart',
        icon: '↻',
        onClick: () => {
          const currentApp = activeApp
          closeApp()
          setTimeout(() => openApp(currentApp), 0)
        }
      }]
    : []

  return (
    <div className="w-full h-full animate-slide-in">
      <AppPanel 
        title={appConfig.title} 
        onClose={closeApp}
        headerActions={headerActions}
      >
        <AppComponent />
      </AppPanel>
    </div>
  )
}

export default AppContainer
