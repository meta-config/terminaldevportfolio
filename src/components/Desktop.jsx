import { useCallback, useState, useEffect, useRef } from 'react'
import homepagewallpaper from '../assets/homepagewallpaper.jpeg'

const Desktop = ({ onOpenTerminal }) => {
  const [iconPosition, setIconPosition] = useState(() => {
    // Load from localStorage or use default (center)
    const saved = localStorage.getItem('terminal-icon-position')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // Invalid data, use default
      }
    }
    // Default: center horizontally, slightly below vertical center
    return { x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 20 }
  })

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isHighlighted, setIsHighlighted] = useState(false)
  const iconRef = useRef(null)
  const lastClickTime = useRef(0)

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('terminal-icon-position', JSON.stringify(iconPosition))
  }, [iconPosition])

  // Handle mouse down (start dragging)
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    const rect = iconRef.current?.getBoundingClientRect()
    if (!rect) return

    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
    setIsHighlighted(true)
  }, [])

  // Handle mouse move (dragging)
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      e.preventDefault()
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Constrain to screen bounds
      const maxX = window.innerWidth - 80 // icon width
      const maxY = window.innerHeight - 100 // icon height + label

      setIconPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Handle click (highlight)
  const handleClick = useCallback((e) => {
    e.preventDefault()
    const now = Date.now()
    const timeDiff = now - lastClickTime.current

    if (timeDiff < 300) {
      // Double click - open terminal
      onOpenTerminal()
      lastClickTime.current = 0
    } else {
      // Single click - highlight
      setIsHighlighted(true)
      lastClickTime.current = now
      setTimeout(() => setIsHighlighted(false), 200)
    }
  }, [onOpenTerminal])

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  return (
    <div 
      className="w-full h-full overflow-hidden relative select-none desktop-view"
      style={{
        backgroundImage: `url(${homepagewallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Terminal Icon */}
      <div
        ref={iconRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`absolute cursor-pointer transition-shadow duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isHighlighted ? 'drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]' : ''}`}
        style={{
          left: `${iconPosition.x}px`,
          top: `${iconPosition.y}px`,
          userSelect: 'none',
          WebkitUserDrag: 'none'
        }}
      >
        {/* Terminal Icon */}
        <div className={`w-[72px] h-[72px] border-2 ${
          isHighlighted ? 'border-green-400 bg-green-900/30' : 'border-green-700 bg-black/80'
        } flex items-center justify-center backdrop-blur-sm`}>
          <div className="text-green-500 font-mono text-xs">
            <div className="mb-1">┌──────────┐</div>
            <div className="mb-1">│ $ _      │</div>
            <div className="mb-1">│          │</div>
            <div>└──────────┘</div>
          </div>
        </div>
        <div className="text-green-500 text-xs font-mono text-center mt-1 select-none bg-black/70 px-2 py-0.5 backdrop-blur-sm">
          Terminal
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t-2 border-green-900 bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between text-green-700 text-xs font-mono">
          <div className="hidden sm:block">PortfolioOS 1.0</div>
          <div className="text-center flex-1">Double-click Terminal to open • Drag to move</div>
          <div>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  )
}

export default Desktop
