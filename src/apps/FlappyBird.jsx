import { useState, useEffect, useRef, useCallback } from 'react'

const FlappyBird = () => {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const birdRef = useRef({ y: 200, velocity: 0 })
  const pipesRef = useRef([])
  const scoreRef = useRef(0)
  const frameRef = useRef(0)

  const [gameState, setGameState] = useState('start') // start, playing, gameover
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 500
  const BIRD_SIZE = 20
  const PIPE_WIDTH = 40
  const PIPE_GAP = 150
  const GRAVITY = 0.5
  const JUMP_STRENGTH = -8
  const PIPE_SPEED = 3
  const PIPE_SPAWN_RATE = 90

  // ASCII characters for rendering
  const ASCII_BIRD = ['>', '▄', '<']
  const ASCII_PIPE_TOP = '█'
  const ASCII_PIPE_BOTTOM = '█'
  const ASCII_GROUND = '▓'

  // Reset game
  const resetGame = useCallback(() => {
    birdRef.current = { y: 200, velocity: 0 }
    pipesRef.current = []
    scoreRef.current = 0
    frameRef.current = 0
    setScore(0)
    setGameState('playing')
  }, [])

  // Jump
  const jump = useCallback(() => {
    if (gameState === 'start' || gameState === 'gameover') {
      resetGame()
    } else if (gameState === 'playing') {
      birdRef.current.velocity = JUMP_STRENGTH
    }
  }, [gameState, resetGame])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [jump])

  // Handle canvas click
  const handleCanvasClick = () => {
    jump()
  }

  // Draw ASCII bird
  const drawBird = (ctx, x, y) => {
    ctx.fillStyle = '#FFD700'
    ctx.font = '16px monospace'
    ctx.fillText(ASCII_BIRD[0], x - 10, y - 5)
    ctx.fillText(ASCII_BIRD[1], x - 10, y + 5)
    ctx.fillText(ASCII_BIRD[2], x + 10, y + 5)
  }

  // Draw ASCII pipes
  const drawPipe = (ctx, x, topHeight, bottomY) => {
    ctx.fillStyle = '#00FF00'
    ctx.font = '12px monospace'

    // Top pipe
    for (let y = 0; y < topHeight; y += 12) {
      ctx.fillText(ASCII_PIPE_TOP, x, y + 12)
      ctx.fillText(ASCII_PIPE_TOP, x + 10, y + 12)
      ctx.fillText(ASCII_PIPE_TOP, x + 20, y + 12)
      ctx.fillText(ASCII_PIPE_TOP, x + 30, y + 12)
    }

    // Bottom pipe
    for (let y = bottomY; y < CANVAS_HEIGHT; y += 12) {
      ctx.fillText(ASCII_PIPE_BOTTOM, x, y + 12)
      ctx.fillText(ASCII_PIPE_BOTTOM, x + 10, y + 12)
      ctx.fillText(ASCII_PIPE_BOTTOM, x + 20, y + 12)
      ctx.fillText(ASCII_PIPE_BOTTOM, x + 30, y + 12)
    }
  }

  // Draw ground
  const drawGround = (ctx) => {
    ctx.fillStyle = '#8B4513'
    ctx.font = '12px monospace'
    for (let x = 0; x < CANVAS_WIDTH; x += 10) {
      ctx.fillText(ASCII_GROUND, x, CANVAS_HEIGHT - 10)
    }
  }

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const bird = birdRef.current
    const pipes = pipesRef.current

    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (gameState === 'playing') {
      frameRef.current++

      // Update bird
      bird.velocity += GRAVITY
      bird.y += bird.velocity

      // Spawn pipes
      if (frameRef.current % PIPE_SPAWN_RATE === 0) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
        pipes.push({
          x: CANVAS_WIDTH,
          topHeight: topHeight,
          bottomY: topHeight + PIPE_GAP,
          passed: false
        })
      }

      // Update pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED

        // Check if bird passed pipe
        if (!pipes[i].passed && pipes[i].x < 50) {
          pipes[i].passed = true
          scoreRef.current++
          setScore(scoreRef.current)
        }

        // Remove off-screen pipes
        if (pipes[i].x < -PIPE_WIDTH) {
          pipes.splice(i, 1)
        }
      }

      // Check collisions
      const birdY = bird.y
      const birdX = 50

      // Ground collision
      if (birdY > CANVAS_HEIGHT - 30 || birdY < 0) {
        setGameState('gameover')
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current)
        }
      }

      // Pipe collision
      for (let pipe of pipes) {
        if (birdX + BIRD_SIZE / 2 > pipe.x && birdX - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH) {
          if (birdY - BIRD_SIZE / 2 < pipe.topHeight || birdY + BIRD_SIZE / 2 > pipe.bottomY) {
            setGameState('gameover')
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current)
            }
            break
          }
        }
      }
    }

    // Draw pipes
    pipes.forEach(pipe => {
      drawPipe(ctx, pipe.x, pipe.topHeight, pipe.bottomY)
    })

    // Draw ground
    drawGround(ctx)

    // Draw bird
    if (gameState !== 'gameover') {
      drawBird(ctx, 50, bird.y)
    }

    // Draw score
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, 40)

    // Draw start screen
    if (gameState === 'start') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      ctx.fillStyle = '#00FF00'
      ctx.font = 'bold 32px monospace'
      ctx.fillText('FLAPPY BIRD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60)
      
      ctx.fillStyle = '#FFD700'
      ctx.font = '20px monospace'
      ctx.fillText('ASCII Edition', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '16px monospace'
      ctx.fillText('Click or Press SPACE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
      ctx.fillText('to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 55)
    }

    // Draw game over screen
    if (gameState === 'gameover') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      ctx.fillStyle = '#FF0000'
      ctx.font = 'bold 32px monospace'
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60)
      
      ctx.fillStyle = '#FFD700'
      ctx.font = '24px monospace'
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      
      ctx.fillStyle = '#00FF00'
      ctx.font = '20px monospace'
      ctx.fillText(`Best: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '16px monospace'
      ctx.fillText('Click or SPACE to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90)
    }

    ctx.textAlign = 'start'
  }, [gameState, score, highScore])

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 30) // 30 FPS
    } else {
      gameLoop() // Still draw for start/gameover screens
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400">Flappy Bird</h2>
            <p className="text-gray-400 text-sm mt-1">ASCII Style Game</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-3xl font-bold text-green-400">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Best</div>
            <div className="text-3xl font-bold text-yellow-400">{highScore}</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="border-2 border-gray-700 rounded-lg shadow-2xl cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <span className="text-green-400 font-semibold">SPACE</span> or <span className="text-green-400 font-semibold">Click</span> to flap
        </div>
      </div>
    </div>
  )
}

export default FlappyBird
