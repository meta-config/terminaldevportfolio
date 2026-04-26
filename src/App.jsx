import { useState, useCallback, useEffect, useRef } from 'react'
import { LayoutProvider } from './layout'
import TerminalWindow from './components/TerminalWindow'
import Desktop from './components/Desktop'
import AppContainer from './components/AppContainer'
import BootLoader from './components/BootLoader'

function App() {
  const [hasBooted, setHasBooted] = useState(false)
  const [mainState, setMainState] = useState('desktop')
  const [windowState, setWindowState] = useState('desktop')
  const [activeApp, setActiveApp] = useState(null)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const animationTimerRef = useRef(null)

  const handleBootComplete = useCallback(() => {
    setHasBooted(true)
    setMainState('desktop')
  }, [])

  const handleOpenTerminal = useCallback(() => {
    setTerminalVisible(true)
    setMainState('terminal')
    setWindowState('terminal_fullscreen')
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
  }, [])

  const handleCloseTerminal = useCallback(() => {
    setTerminalVisible(false)
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    animationTimerRef.current = setTimeout(() => {
      setMainState('desktop')
      setWindowState('desktop')
    }, 150)
  }, [])

  const handleMinimizeTerminal = useCallback(() => {
    setTerminalVisible(false)
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    animationTimerRef.current = setTimeout(() => {
      setMainState('desktop')
      setWindowState('desktop')
    }, 150)
  }, [])

  const handleToggleMaximize = useCallback(() => {
    setWindowState(prev => {
      const next = prev === 'terminal_fullscreen' ? 'terminal_windowed' : 'terminal_fullscreen'
      if (next === 'terminal_windowed') {
        setActiveApp(null)
      }
      return next
    })
  }, [])

  const handleSetActiveApp = useCallback((app) => {
    setActiveApp(app)
  }, [])

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    }
  }, [])

  if (!hasBooted) {
    return <BootLoader onComplete={handleBootComplete} />
  }

  const showSplitLayout = mainState === 'terminal' && activeApp && windowState === 'terminal_fullscreen'

  return (
    <LayoutProvider onSetActiveApp={handleSetActiveApp}>
      {/* Hidden SEO content for crawlers - visible to DOM but not users */}
      <div id="seo-content" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <h1>Samar Singh - Software Developer & AI-ML Engineer</h1>
        <p>About: Samar Singh is an aspiring software developer and AI-ML student with strong foundations in programming, data structures, and system design. He builds scalable and efficient solutions and has experience developing real-world projects. This interactive linux terminal portfolio showcases his technical skills and creative approach to developer portfolio design.</p>
        
        <h2>Technical Skills</h2>
        <ul>
          <li>Languages: C, C++, Python, JavaScript</li>
          <li>Frontend: React, HTML, CSS, TailwindCSS</li>
          <li>Backend: Node.js</li>
          <li>Data/AI: NumPy, Pandas, TensorFlow, Scikit-learn, Matplotlib</li>
          <li>Tools: Git, GitHub, Docker, Redis, Kubernetes</li>
          <li>Core: DSA, OS, CN, DBMS, System Design, LLM</li>
          <li>Other: Linux, Linux commands, Web hosting</li>
        </ul>
        
        <h2>Projects</h2>
        <p>ThaiTourDMC - Tours and travel website built with HTML, CSS, Tailwind, and React. Live at https://thaitourdmc.com</p>
        <p>PortfolioOS - An interactive linux terminal portfolio built with React and Vite, featuring games, document viewers, and a simulated Linux environment.</p>
        
        <h2>Contact</h2>
        <p>Email: meta.config.smr@gmail.com</p>
        <p>Phone: +91 8467098054</p>
        <p>Location: India</p>
        <p>GitHub: https://github.com/meta-config</p>
        <p>LinkedIn: https://www.linkedin.com/in/samarsingh1/</p>
        <p>LeetCode: https://leetcode.com/u/meta-config-smr/</p>
      </div>
      
      <div className="w-screen h-screen overflow-hidden relative bg-black">
        <Desktop onOpenTerminal={handleOpenTerminal} />

        {showSplitLayout ? (
          <div className="absolute inset-0 flex flex-row">
            <div className="w-1/2 h-full">
              <TerminalWindow
                onClose={handleCloseTerminal}
                onMinimize={handleMinimizeTerminal}
                onToggleMaximize={handleToggleMaximize}
                isMaximized={true}
                isTerminalOpen={true}
              />
            </div>
            <div className="w-1/2 h-full">
              <AppContainer />
            </div>
          </div>
        ) : (
          <div
            className={`absolute ${
              mainState === 'desktop' || !terminalVisible
                ? !terminalVisible
                  ? 'opacity-0 scale-95 pointer-events-none'
                  : 'opacity-0 scale-95 invisible pointer-events-none'
                : 'opacity-100 scale-100'
            } ${
              windowState === 'terminal_fullscreen'
                ? 'w-screen h-screen top-0 left-0'
                : 'w-[70vw] h-[70vh]'
            }`}
            style={{ 
              zIndex: 10, 
              transition: 'opacity 150ms ease-out, transform 150ms ease-out',
              pointerEvents: (mainState === 'desktop' || !terminalVisible) ? 'none' : 'auto',
              ...(windowState !== 'terminal_fullscreen' && {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              })
            }}
          >
            <TerminalWindow
              onClose={handleCloseTerminal}
              onMinimize={handleMinimizeTerminal}
              onToggleMaximize={handleToggleMaximize}
              isMaximized={windowState === 'terminal_fullscreen'}
              isTerminalOpen={terminalVisible}
            />
          </div>
        )}
      </div>
    </LayoutProvider>
  )
}

export default App
