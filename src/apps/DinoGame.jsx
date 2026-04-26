import { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 200
const GROUND_Y = 170
const GRAVITY = 0.6
const JUMP_FORCE = -12
const INITIAL_SPEED = 5

const DinoGame = ({ onClose }) => {
  const canvasRef = useRef(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dino-high-score')
    return saved ? parseInt(saved) : 0
  })
  const [gameStarted, setGameStarted] = useState(false)

  const dinoRef = useRef({ x: 50, y: GROUND_Y, velocity: 0, jumping: false })
  const obstaclesRef = useRef([])
  const speedRef = useRef(INITIAL_SPEED)
  const scoreRef = useRef(0)
  const gameLoopRef = useRef(null)
  const frameCountRef = useRef(0)
  const gameOverRef = useRef(false)

  const resetGame = useCallback(() => {
    dinoRef.current = { x: 50, y: GROUND_Y, velocity: 0, jumping: false }
    obstaclesRef.current = []
    speedRef.current = INITIAL_SPEED
    scoreRef.current = 0
    frameCountRef.current = 0
    setGameOver(false)
    setScore(0)
    gameOverRef.current = false
  }, [])

  const jump = useCallback(() => {
    if (gameOverRef.current) {
      resetGame()
      setGameStarted(true)
      return
    }
    
    if (!dinoRef.current.jumping) {
      dinoRef.current.velocity = JUMP_FORCE
      dinoRef.current.jumping = true
    }
  }, [resetGame])

  // Game loop
  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const gameLoop = () => {
      // Check if game is over from ref (more reliable than state in loop)
      if (gameOverRef.current) return

      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Update dino
      const dino = dinoRef.current
      dino.velocity += GRAVITY
      dino.y += dino.velocity

      if (dino.y >= GROUND_Y) {
        dino.y = GROUND_Y
        dino.velocity = 0
        dino.jumping = false
      }

      // Spawn obstacles
      frameCountRef.current++
      if (frameCountRef.current % Math.floor(100 / (speedRef.current / INITIAL_SPEED)) === 0) {
        const height = 30 + Math.random() * 20
        obstaclesRef.current.push({
          x: CANVAS_WIDTH,
          y: GROUND_Y - height + 40,
          width: 20,
          height
        })
      }

      // Update obstacles
      obstaclesRef.current = obstaclesRef.current.filter(obs => {
        obs.x -= speedRef.current
        return obs.x > -50
      })

      // Check collisions
      for (const obs of obstaclesRef.current) {
        if (
          dino.x + 30 > obs.x &&
          dino.x < obs.x + obs.width &&
          dino.y + 40 > obs.y
        ) {
          gameOverRef.current = true
          setGameOver(true)
          const finalScore = scoreRef.current
          if (finalScore > highScore) {
            setHighScore(finalScore)
            localStorage.setItem('dino-high-score', finalScore.toString())
          }
          // Draw final frame
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(dino.x, dino.y, 30, 40)
          ctx.fillStyle = '#000000'
          ctx.fillRect(dino.x + 20, dino.y + 5, 5, 5)
          ctx.fillStyle = '#ffffff'
          obstaclesRef.current.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
          })
          return
        }
      }

      // Update score
      if (frameCountRef.current % 10 === 0) {
        scoreRef.current++
        setScore(scoreRef.current)
        
        // Increase speed
        if (scoreRef.current % 50 === 0) {
          speedRef.current += 0.5
        }
      }

      // Draw ground line
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y + 40)
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 40)
      ctx.stroke()

      // Draw dino (pixel style)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(dino.x, dino.y, 30, 40)
      // Eye
      ctx.fillStyle = '#000000'
      ctx.fillRect(dino.x + 20, dino.y + 5, 5, 5)

      // Draw obstacles
      ctx.fillStyle = '#ffffff'
      obstaclesRef.current.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
      })

      // Continue game loop
      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    // Cleanup on unmount
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      gameLoopRef.current = null
    }
  }, [gameStarted, highScore])

  // Keyboard controls (only jump, Ctrl+C is handled globally)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black font-mono relative">
      <div className="flex flex-col items-center relative">
        {/* Score */}
        <div className="flex justify-between items-center mb-2 px-2 text-green-500 text-sm w-full">
          <div>SCORE: {score.toString().padStart(5, '0')}</div>
          <div>HI: {highScore.toString().padStart(5, '0')}</div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative border-2 border-green-700 bg-black p-1">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={() => {
              if (!gameStarted) setGameStarted(true)
              else jump()
            }}
            className="block bg-black cursor-pointer"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Overlays */}
          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-green-500 text-center">
                <div className="text-lg mb-2">DINO GAME</div>
                <div className="text-sm">Press SPACE to start</div>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-green-500 text-center">
                <div className="text-lg mb-2">GAME OVER</div>
                <div className="text-sm mb-2">Score: {score}</div>
                <div className="text-xs">Press SPACE to restart</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-2 text-green-700 text-xs text-center">
          <div>SPACE / ARROW UP TO JUMP</div>
          <div className="mt-1">CTRL+C TO EXIT</div>
        </div>
      </div>
    </div>
  )
}

export default DinoGame
