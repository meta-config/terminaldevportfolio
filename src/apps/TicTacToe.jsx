import { useState, useCallback } from 'react'

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [xScore, setXScore] = useState(0)
  const [oScore, setOScore] = useState(0)
  const [draws, setDraws] = useState(0)

  // Winning combinations
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ]

  // Check for winner
  const checkWinner = useCallback((squares) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: pattern }
      }
    }
    return null
  }, [winPatterns])

  // Handle cell click
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

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine(null)
  }

  // Reset all scores
  const resetAll = () => {
    resetGame()
    setXScore(0)
    setOScore(0)
    setDraws(0)
  }

  // Render cell
  const renderCell = (index) => {
    const isWinningCell = winningLine && winningLine.includes(index)
    const value = board[index]
    
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`
          w-24 h-24 bg-gray-800 border-2 border-gray-700 
          flex items-center justify-center text-5xl font-bold
          transition-all duration-200 cursor-pointer
          hover:bg-gray-750 hover:border-gray-600
          ${isWinningCell ? 'bg-green-900 border-green-500 scale-105' : ''}
          ${!value && !winner ? 'hover:scale-105' : ''}
        `}
      >
        {value === 'X' && (
          <span className="text-blue-400 drop-shadow-lg">X</span>
        )}
        {value === 'O' && (
          <span className="text-red-400 drop-shadow-lg">O</span>
        )}
      </button>
    )
  }

  // Status message
  const getStatus = () => {
    if (winner) {
      return (
        <span>
          Winner: <span className={winner === 'X' ? 'text-blue-400' : 'text-red-400'}>
            Player {winner}
          </span> 🎉
        </span>
      )
    }
    if (board.every(cell => cell !== null)) {
      return <span className="text-yellow-400">It's a Draw! 🤝</span>
    }
    return (
      <span>
        Next: <span className={isXNext ? 'text-blue-400' : 'text-red-400'}>
          Player {isXNext ? 'X' : 'O'}
        </span>
      </span>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400">Tic Tac Toe</h2>
            <p className="text-gray-400 text-sm mt-1">2 Player Game</p>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-4 text-center">
          <div className="flex-1 min-w-[120px] bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-700">
            <div className="text-blue-400 text-2xl font-bold">X</div>
            <div className="text-3xl font-bold text-blue-400">{xScore}</div>
            <div className="text-xs text-gray-400 mt-1">Wins</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-gray-700 bg-opacity-30 rounded-lg p-3 border border-gray-600">
            <div className="text-gray-400 text-2xl font-bold">🤝</div>
            <div className="text-3xl font-bold text-gray-400">{draws}</div>
            <div className="text-xs text-gray-400 mt-1">Draws</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-red-900 bg-opacity-30 rounded-lg p-3 border border-red-700">
            <div className="text-red-400 text-2xl font-bold">O</div>
            <div className="text-3xl font-bold text-red-400">{oScore}</div>
            <div className="text-xs text-gray-400 mt-1">Wins</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Status */}
        <div className="mb-6 text-center">
          <div className="text-xl font-semibold">
            {getStatus()}
          </div>
        </div>

        {/* Board */}
        <div className="flex flex-wrap w-[304px] gap-2 bg-gray-700 p-2 rounded-lg shadow-2xl">
          {board.map((_, index) => renderCell(index))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={resetAll}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                       transition-all hover:scale-105 font-semibold shadow-lg"
          >
            Reset Scores
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400 text-center">
          <span className="text-blue-400 font-semibold">Player X</span> vs <span className="text-red-400 font-semibold">Player O</span> • Take turns to play
        </div>
      </div>
    </div>
  )
}

export default TicTacToe
