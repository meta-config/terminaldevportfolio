import { useState, useEffect, useRef, useCallback } from 'react'

const SnakeGame = () => {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const directionRef = useRef({ x: 1, y: 0 })
  const snakeRef = useRef([{ x: 10, y: 10 }])
  const foodRef = useRef({ x: 15, y: 15 })
  const scoreRef = useRef(0)
  
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const CANVAS_SIZE = 400
  const GRID_SIZE = 20
  const CELL_SIZE = CANVAS_SIZE / GRID_SIZE
  const GAME_SPEED = 150

  // Generate random food position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    return { x, y }
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }]
    directionRef.current = { x: 1, y: 0 }
    foodRef.current = generateFood()
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
    setIsPaused(false)
  }, [generateFood])

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw playfield lines
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        (segment.x + 1) * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      )
      
      if (index === 0) {
        // Head
        gradient.addColorStop(0, '#00ff88')
        gradient.addColorStop(1, '#00cc6a')
      } else {
        // Body
        gradient.addColorStop(0, '#00cc6a')
        gradient.addColorStop(1, '#009950')
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )

      // Add glow effect to head
      if (index === 0) {
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = 10
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        )
        ctx.shadowBlur = 0
      }
    })

    // Draw food
    const food = foodRef.current
    ctx.shadowColor = '#ff6b6b'
    ctx.shadowBlur = 15
    ctx.fillStyle = '#ff6b6b'
    ctx.beginPath()
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.shadowBlur = 0
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    const snake = snakeRef.current
    const direction = directionRef.current
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true)
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
      }
      return
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
      }
      return
    }

    // Add new head
    snake.unshift(head)

    // Check food collision
    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      foodRef.current = generateFood()
    } else {
      // Remove tail
      snake.pop()
    }

    draw()
  }, [gameOver, isPaused, gameStarted, generateFood, draw, highScore])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame()
        } else if (gameStarted) {
          setIsPaused(prev => !prev)
        } else {
          resetGame()
        }
        return
      }

      if (!gameStarted || gameOver || isPaused) return

      const direction = directionRef.current
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) directionRef.current = { x: 0, y: -1 }
          break
        case 'ArrowDown':
          if (direction.y === 0) directionRef.current = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
          if (direction.x === 0) directionRef.current = { x: -1, y: 0 }
          break
        case 'ArrowRight':
          if (direction.x === 0) directionRef.current = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, isPaused, resetGame])

  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED)
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused, gameLoop])

  // Initial draw
  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400">Snake Game</h2>
            <p className="text-gray-400 text-sm mt-1">Classic arcade game</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-3xl font-bold text-green-400">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">High Score</div>
            <div className="text-3xl font-bold text-yellow-400">{highScore}</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border-2 border-gray-700 rounded-lg shadow-2xl"
          />

          {/* Start Screen */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🐍</div>
                <h3 className="text-3xl font-bold text-green-400 mb-4">Snake Game</h3>
                <p className="text-gray-300 mb-2">Use arrow keys to move</p>
                <p className="text-gray-300 mb-6">Press SPACE to start</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>⬆️ ⬇️ ⬅️ ➡️ Arrow Keys - Move</p>
                  <p>⏸️ SPACE - Pause/Resume</p>
                </div>
              </div>
            </div>
          )}

          {/* Pause Screen */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">⏸️</div>
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">Paused</h3>
                <p className="text-gray-300">Press SPACE to resume</p>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💀</div>
                <h3 className="text-3xl font-bold text-red-400 mb-4">Game Over</h3>
                <p className="text-gray-300 mb-2">Final Score: <span className="text-green-400 font-bold">{score}</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-400 mb-4 font-semibold">🎉 New High Score!</p>
                )}
                <p className="text-gray-300 mb-2">Press SPACE to play again</p>
                <p className="text-sm text-gray-400">or click Restart button</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <span className="text-green-400 font-semibold">Arrow Keys</span> to move • <span className="text-green-400 font-semibold">SPACE</span> to pause
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
