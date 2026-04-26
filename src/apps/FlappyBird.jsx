import { useState, useEffect, useRef, useCallback } from 'react'

const FlappyBird = () => {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const birdRef = useRef({ y: 200, velocity: 0 })
  const pipesRef = useRef([])
  const scoreRef = useRef(0)
  const frameRef = useRef(0)

  const [gameState, setGameState] = useState('start')
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

  const resetGame = useCallback(() => {
    birdRef.current = { y: 200, velocity: 0 }
    pipesRef.current = []
    scoreRef.current = 0
    frameRef.current = 0
    setScore(0)
    setGameState('playing')
  }, [])

  const jump = useCallback(() => {
    if (gameState === 'start' || gameState === 'gameover') {
      resetGame()
    } else if (gameState === 'playing') {
      birdRef.current.velocity = JUMP_STRENGTH
    }
  }, [gameState, resetGame])

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

  const handleCanvasClick = () => jump()

  const drawBird = (ctx, x, y) => {
    ctx.fillStyle = '#00ff00' // Green block (retro)
    ctx.fillRect(x - BIRD_SIZE / 2, y - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
  }

  const drawPipe = (ctx, x, topHeight, bottomY) => {
    ctx.fillStyle = '#ff0000' // Red blocks (retro)
    ctx.fillRect(x, 0, PIPE_WIDTH, topHeight)
    ctx.fillRect(x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - bottomY)
  }

  const drawGround = (ctx) => {
    ctx.fillStyle = '#00ff00' // Green ground line
    ctx.fillRect(0, CANVAS_HEIGHT - 4, CANVAS_WIDTH, 4)
  }

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const bird = birdRef.current
    const pipes = pipesRef.current

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (gameState === 'playing') {
      frameRef.current++
      bird.velocity += GRAVITY
      bird.y += bird.velocity

      if (frameRef.current % PIPE_SPAWN_RATE === 0) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
        pipes.push({
          x: CANVAS_WIDTH,
          topHeight: topHeight,
          bottomY: topHeight + PIPE_GAP,
          passed: false
        })
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED

        if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < 50) {
          pipes[i].passed = true
          scoreRef.current++
          setScore(scoreRef.current)
        }
        if (pipes[i].x < -PIPE_WIDTH) {
          pipes.splice(i, 1)
        }
      }

      const birdY = bird.y
      const birdX = 50

      if (birdY > CANVAS_HEIGHT - 20 || birdY < 0) {
        setGameState('gameover')
        if (scoreRef.current > highScore) setHighScore(scoreRef.current)
      }

      for (let pipe of pipes) {
        if (birdX + BIRD_SIZE / 2 > pipe.x && birdX - BIRD_SIZE / 2 < pipe.x + PIPE_WIDTH) {
          if (birdY - BIRD_SIZE / 2 < pipe.topHeight || birdY + BIRD_SIZE / 2 > pipe.bottomY) {
            setGameState('gameover')
            if (scoreRef.current > highScore) setHighScore(scoreRef.current)
            break
          }
        }
      }
    }

    pipes.forEach(pipe => {
      drawPipe(ctx, pipe.x, pipe.topHeight, pipe.bottomY)
    })
    drawGround(ctx)

    if (gameState !== 'gameover') {
      drawBird(ctx, 50, bird.y)
    }

    if (gameState === 'start') {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#00ff00'
      ctx.font = 'bold 32px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('FLAPPY BIRD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
      ctx.fillStyle = '#00ff00'
      ctx.font = '16px monospace'
      ctx.fillText('PRESS SPACE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    }

    if (gameState === 'gameover') {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#ff0000'
      ctx.font = 'bold 32px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
      ctx.fillStyle = '#00ff00'
      ctx.font = '16px monospace'
      ctx.fillText('PRESS SPACE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
    }

    ctx.textAlign = 'start'
  }, [gameState, score, highScore])

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 30)
    } else {
      gameLoop()
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameState, gameLoop])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black font-mono">
      <div className="flex flex-col items-center">
        {/* Retro border */}
        <div className="border-4 border-green-700 bg-black p-1">
          {/* Score display */}
          <div className="flex justify-between items-center mb-1 px-2 py-1 text-green-500 text-sm">
            <div>SCORE:{score.toString().padStart(4, '0')}</div>
            <div>HI:{highScore.toString().padStart(4, '0')}</div>
          </div>
          
          {/* Game canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            className="block bg-black cursor-pointer"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        {/* Controls hint */}
        <div className="mt-2 text-green-700 text-xs text-center">
          SPACE OR CLICK TO FLAP
        </div>
      </div>
    </div>
  )
}

export default FlappyBird
