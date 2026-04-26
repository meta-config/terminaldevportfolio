import { useState, useCallback } from 'react'

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [xScore, setXScore] = useState(0)
  const [oScore, setOScore] = useState(0)
  const [draws, setDraws] = useState(0)

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  const checkWinner = useCallback((squares) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: pattern }
      }
    }
    return null
  }, [winPatterns])

  const handleClick = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      if (result.winner === 'X') {
        setXScore(prev => prev + 1)
      } else {
        setOScore(prev => prev + 1)
      }
    } else if (newBoard.every(cell => cell !== null)) {
      setDraws(prev => prev + 1)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine(null)
  }

  const resetAll = () => {
    resetGame()
    setXScore(0)
    setOScore(0)
    setDraws(0)
  }

  const renderCell = (index) => {
    const isWinningCell = winningLine && winningLine.includes(index)
    const value = board[index]
    
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        disabled={value || winner}
        className={`
          aspect-square flex items-center justify-center text-5xl font-bold border-2
          ${isWinningCell ? 'bg-green-900 border-green-500 text-green-500' : 'bg-black border-green-700'}
          ${value === 'X' ? 'text-green-500' : value === 'O' ? 'text-red-500' : ''}
          ${!value && !winner ? 'cursor-pointer hover:bg-green-900' : 'cursor-default'}
        `}
      >
        {value}
      </button>
    )
  }

  const getStatus = () => {
    if (winner) {
      return (
        <span>
          WINNER: <span className={winner === 'X' ? 'text-green-500' : 'text-red-500'}>PLAYER {winner}</span>
        </span>
      )
    }
    if (board.every(cell => cell !== null)) {
      return <span className="text-green-500">DRAW</span>
    }
    return (
      <span>
        NEXT: <span className={isXNext ? 'text-green-500' : 'text-red-500'}>PLAYER {isXNext ? 'X' : 'O'}</span>
      </span>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-black text-green-500 font-mono items-center justify-center p-4">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Scoreboard */}
        <div className="w-full flex justify-between text-sm mb-4 border-b-2 border-green-800 pb-2">
          <div className="text-green-500">X:{xScore}</div>
          <div className="text-green-700">D:{draws}</div>
          <div className="text-red-500">O:{oScore}</div>
        </div>

        {/* Status */}
        <div className="mb-4 text-lg font-bold h-8 flex items-center justify-center">
          {getStatus()}
        </div>

        {/* 3x3 Grid */}
        <div className="w-full aspect-square grid grid-cols-3 gap-1 bg-green-800 p-1 border-2 border-green-700">
          {board.map((_, index) => renderCell(index))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-3 w-full">
          <button
            onClick={resetGame}
            className="flex-1 py-2 border-2 border-green-500 text-green-500 hover:bg-green-900 bg-black font-bold text-sm"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={resetAll}
            className="flex-1 py-2 border-2 border-red-500 text-red-500 hover:bg-red-900 bg-black font-bold text-sm"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
