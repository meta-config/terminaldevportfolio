import { useCallback } from 'react'
import Terminal from './Terminal'

const TerminalWindow = ({ onClose, onMinimize, onToggleMaximize, isMaximized, onExit, isTerminalOpen }) => {
  const handleMaximize = useCallback(() => {
    if (onToggleMaximize) {
      onToggleMaximize()
    }
  }, [onToggleMaximize])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleMinimize = useCallback(() => {
    onMinimize()
  }, [onMinimize])

  return (
    <div className={`w-full h-full flex flex-col bg-black ${
      !isMaximized ? 'border-2 border-green-700 shadow-lg shadow-green-900/20' : ''
    }`}>
      <div className="flex items-center justify-between bg-gray-900 border-b-2 border-green-800 px-3 py-2 select-none flex-shrink-0">
        <div className="text-green-500 text-sm font-mono">
          samarsingh@portfolio: ~
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 flex items-center justify-center text-yellow-500 hover:bg-yellow-900 hover:text-black transition-colors font-mono text-lg leading-none"
            title="Minimize"
          >
            —
          </button>

          <button
            onClick={handleMaximize}
            className="w-6 h-6 flex items-center justify-center text-green-500 hover:bg-green-900 hover:text-black transition-colors font-mono text-sm leading-none"
            title={isMaximized ? 'Windowed' : 'Maximize'}
          >
            {isMaximized ? '❐' : '□'}
          </button>

          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-900 hover:text-black transition-colors font-mono text-lg leading-none"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Terminal onExit={onExit} isTerminalOpen={isTerminalOpen} />
      </div>
    </div>
  )
}

export default TerminalWindow
