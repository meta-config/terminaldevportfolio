import { useState, useEffect, useCallback } from 'react'

const bootLines = [
  'Initializing PortfolioOS...',
  'Loading kernel modules...',
  'Mounting file systems...',
  'Starting system services...',
  'Loading desktop environment...',
  'Launching user interface...',
  'System ready.'
]

const BootLoader = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const delay = currentLine === 0 ? 200 : 150 + Math.random() * 100
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      // Boot complete, wait a moment then transition
      setIsComplete(true)
      const timer = setTimeout(() => {
        onComplete()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentLine, onComplete])

  return (
    <div 
      className={`w-screen h-screen bg-black flex items-center justify-center font-mono text-sm transition-opacity duration-500 ${
        isComplete ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-2xl px-8">
        {bootLines.slice(0, currentLine).map((line, index) => (
          <div 
            key={index}
            className="text-green-500 mb-1"
            style={{
              animation: 'terminal-line-appear 100ms ease-out'
            }}
          >
            <span className="text-green-700">[  OK  ]</span> {line}
          </div>
        ))}
        {currentLine < bootLines.length && (
          <div className="text-green-500 animate-pulse">
            <span className="text-green-700">[ .... ]</span> Loading...
          </div>
        )}
      </div>
    </div>
  )
}

export default BootLoader
