import { useState, useCallback, useEffect, useRef } from 'react'
import { LayoutProvider } from './layout'
import TerminalWindow from './components/TerminalWindow'
import Desktop from './components/Desktop'
import AppContainer from './components/AppContainer'
import BootLoader from './components/BootLoader'

function App() {
  const [appState, setAppState] = useState('booting')
  const [windowState, setWindowState] = useState('desktop')
  const [activeApp, setActiveApp] = useState(null)
  const animationTimerRef = useRef(null)

  const handleBootComplete = useCallback(() => {
    setAppState('desktop')
  }, [])

  const handleOpenTerminal = useCallback(() => {
    setAppState('terminal_opening')
    setWindowState('terminal_fullscreen')
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    animationTimerRef.current = setTimeout(() => {
      setAppState('terminal_open')
    }, 150)
  }, [])

  const handleCloseTerminal = useCallback(() => {
    setAppState('terminal_closing')
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    animationTimerRef.current = setTimeout(() => {
      setAppState('desktop')
      setWindowState('desktop')
    }, 150)
  }, [])

  const handleMinimizeTerminal = useCallback(() => {
    setAppState('terminal_closing')
    setActiveApp(null)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    animationTimerRef.current = setTimeout(() => {
      setAppState('desktop')
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

  if (appState === 'booting') {
    return <BootLoader onComplete={handleBootComplete} />
  }

  const showSplitLayout = appState !== 'desktop' && appState !== 'terminal_closing' && activeApp && windowState === 'terminal_fullscreen'

  return (
    <LayoutProvider onSetActiveApp={handleSetActiveApp}>
      <div className="w-screen h-screen overflow-hidden relative bg-black">
        <Desktop onOpenTerminal={handleOpenTerminal} />

        {showSplitLayout ? (
          <div className="absolute inset-0 flex flex-row">
            <div className="w-1/2 h-full">
              <AppContainer />
            </div>
            <div className="w-1/2 h-full">
              <TerminalWindow
                onClose={handleCloseTerminal}
                onMinimize={handleMinimizeTerminal}
                onToggleMaximize={handleToggleMaximize}
                isMaximized={true}
                isTerminalOpen={true}
              />
            </div>
          </div>
        ) : (
          <div
            className={`absolute ${
              appState === 'desktop' || appState === 'terminal_closing'
                ? appState === 'terminal_closing'
                  ? 'opacity-0 scale-95 pointer-events-none'
                  : 'opacity-0 scale-95 invisible pointer-events-none'
                : appState === 'terminal_opening'
                  ? 'opacity-0 scale-95'
                  : 'opacity-100 scale-100'
            } ${
              windowState === 'terminal_fullscreen'
                ? 'w-screen h-screen top-0 left-0'
                : 'w-[70vw] h-[70vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            }`}
            style={{ 
              zIndex: 10, 
              transition: 'opacity 150ms ease-out, transform 150ms ease-out',
              pointerEvents: (appState === 'desktop' || appState === 'terminal_closing') ? 'none' : 'auto'
            }}
          >
            <TerminalWindow
              onClose={handleCloseTerminal}
              onMinimize={handleMinimizeTerminal}
              onToggleMaximize={handleToggleMaximize}
              isMaximized={windowState === 'terminal_fullscreen'}
              isTerminalOpen={appState === 'terminal_open' || appState === 'terminal_opening'}
            />
          </div>
        )}
      </div>
    </LayoutProvider>
  )
}

export default App
