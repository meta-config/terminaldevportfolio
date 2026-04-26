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

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    return { x, y }
  }, [])

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

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    // Clear canvas - pure black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw snake - solid green blocks (Nokia style)
    ctx.fillStyle = '#00ff00'
    snakeRef.current.forEach((segment) => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      )
    })

    // Draw food - solid red block
    const food = foodRef.current
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(
      food.x * CELL_SIZE,
      food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    )
  }, [])

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    const snake = snakeRef.current
    const direction = directionRef.current
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true)
      if (scoreRef.current > highScore) setHighScore(scoreRef.current)
      return
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      if (scoreRef.current > highScore) setHighScore(scoreRef.current)
      return
    }

    snake.unshift(head)

    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      foodRef.current = generateFood()
    } else {
      snake.pop()
    }

    draw()
  }, [gameOver, isPaused, gameStarted, generateFood, draw, highScore])

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

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED)
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameStarted, gameOver, isPaused, gameLoop])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black font-mono">
      <div className="flex flex-col items-center">
        {/* Nokia-style border */}
        <div className="border-4 border-green-700 bg-black p-1">
          {/* Score display */}
          <div className="flex justify-between items-center mb-1 px-2 py-1 text-green-500 text-sm">
            <div>SCORE:{score.toString().padStart(4, '0')}</div>
            <div>HI:{highScore.toString().padStart(4, '0')}</div>
          </div>
          
          {/* Game canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="block bg-black"
              style={{ imageRendering: 'pixelated' }}
            />
            
            {/* Start screen */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                <div className="text-green-500 text-2xl mb-4 font-bold">SNAKE</div>
                <div className="text-green-500 text-sm">PRESS SPACE</div>
              </div>
            )}
            
            {/* Paused */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="text-green-500 text-2xl font-bold">PAUSED</div>
              </div>
            )}
            
            {/* Game over */}
            {gameOver && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                <div className="text-red-500 text-2xl mb-4 font-bold">GAME OVER</div>
                <div className="text-green-500 text-sm">PRESS SPACE</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls hint */}
        <div className="mt-2 text-green-700 text-xs text-center">
          ARROW KEYS TO MOVE
        </div>
      </div>
    </div>
  )
}

export default SnakeGame

