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
