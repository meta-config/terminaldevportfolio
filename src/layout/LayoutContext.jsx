import { createContext, useContext, useState, useCallback } from 'react'

const LayoutContext = createContext()

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return context
}

export const LayoutProvider = ({ children }) => {
  const [activeApp, setActiveApp] = useState(null)

  const openApp = useCallback((appName) => {
    setActiveApp(appName)
  }, [])

  const closeApp = useCallback(() => {
    setActiveApp(null)
  }, [])

  const isAppOpen = activeApp !== null

  return (
    <LayoutContext.Provider value={{ activeApp, openApp, closeApp, isAppOpen }}>
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutProvider
