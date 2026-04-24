import { useState, useCallback } from 'react'

const NumberGuessingGame = () => {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameWon, setGameWon] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState('')
  const [gamesWon, setGamesWon] = useState(0)
  const [bestScore, setBestScore] = useState(null)

  const MAX_ATTEMPTS = 10

  // Handle guess submission
  const handleGuess = useCallback(() => {
    const guess = parseInt(currentGuess)
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
      setHint('Please enter a number between 1 and 100')
      return
    }

    if (guesses.includes(guess)) {
      setHint(`You already guessed ${guess}! Try a different number.`)
      return
    }

    const newGuesses = [...guesses, guess]
    const newAttempts = attempts + 1
    setGuesses(newGuesses)
    setAttempts(newAttempts)
    setCurrentGuess('')

    if (guess === targetNumber) {
      setGameWon(true)
      setHint(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`)
      setGamesWon(prev => prev + 1)
      if (!bestScore || newAttempts < bestScore) {
        setBestScore(newAttempts)
      }
    } else if (newAttempts >= MAX_ATTEMPTS) {
      setHint(`💀 Game Over! The number was ${targetNumber}`)
    } else if (guess < targetNumber) {
      setHint(`📈 Too low! Try a higher number. (Attempts: ${newAttempts}/${MAX_ATTEMPTS})`)
    } else {
      setHint(`📉 Too high! Try a lower number. (Attempts: ${newAttempts}/${MAX_ATTEMPTS})`)
    }
  }, [currentGuess, guesses, attempts, targetNumber, bestScore])

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !gameWon && attempts < MAX_ATTEMPTS) {
      handleGuess()
    }
  }

  // Reset game
  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuesses([])
    setCurrentGuess('')
    setGameWon(false)
    setAttempts(0)
    setHint('')
  }

  // Reset all stats
  const resetAll = () => {
    resetGame()
    setGamesWon(0)
    setBestScore(null)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400">Number Guessing</h2>
            <p className="text-gray-400 text-sm mt-1">Guess the number (1-100)</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-4 text-center">
          <div className="flex-1 min-w-[140px] bg-green-900 bg-opacity-30 rounded-lg p-3 border border-green-700">
            <div className="text-3xl font-bold text-green-400">{gamesWon}</div>
            <div className="text-xs text-gray-400 mt-1">Games Won</div>
          </div>
          <div className="flex-1 min-w-[140px] bg-blue-900 bg-opacity-30 rounded-lg p-3 border border-blue-700">
            <div className="text-3xl font-bold text-blue-400">{bestScore || '-'}</div>
            <div className="text-xs text-gray-400 mt-1">Best Score</div>
          </div>
          <div className="flex-1 min-w-[140px] bg-purple-900 bg-opacity-30 rounded-lg p-3 border border-purple-700">
            <div className="text-3xl font-bold text-purple-400">{attempts}/{MAX_ATTEMPTS}</div>
            <div className="text-xs text-gray-400 mt-1">Attempts</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Hint Message */}
        {hint && (
          <div className={`mb-6 p-4 rounded-lg border ${
            gameWon ? 'bg-green-900 bg-opacity-30 border-green-500 text-green-400' :
            attempts >= MAX_ATTEMPTS ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-400' :
            'bg-blue-900 bg-opacity-30 border-blue-500 text-blue-400'
          }`}>
            <p className="text-lg font-semibold">{hint}</p>
          </div>
        )}

        {/* Input Area */}
        {!gameWon && attempts < MAX_ATTEMPTS && (
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="number"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your guess (1-100)"
                className="flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg 
                           text-white text-lg focus:border-green-400 focus:outline-none transition-colors"
                min="1"
                max="100"
                autoFocus
              />
              <button
                onClick={handleGuess}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                           transition-all hover:scale-105 font-semibold"
              >
                Guess
              </button>
            </div>
          </div>
        )}

        {/* Guesses History */}
        {guesses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Your Guesses:</h3>
            <div className="flex flex-wrap gap-2">
              {guesses.map((guess, index) => (
                <div
                  key={index}
                  className={`w-[70px] p-3 rounded-lg text-center font-bold ${
                    guess === targetNumber
                      ? 'bg-green-600 text-white'
                      : guess < targetNumber
                      ? 'bg-blue-600 bg-opacity-50 text-blue-300'
                      : 'bg-red-600 bg-opacity-50 text-red-300'
                  }`}
                >
                  {guess}
                  <div className="text-xs mt-1">
                    {guess === targetNumber ? '✓' : guess < targetNumber ? '↑' : '↓'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-blue-600 rounded"></span> Too Low
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-red-600 rounded"></span> Too High
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-green-600 rounded"></span> Correct
              </span>
            </div>
          </div>
        )}

        {/* Game Over Actions */}
        {(gameWon || attempts >= MAX_ATTEMPTS) && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={resetGame}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                         transition-all hover:scale-105 font-semibold"
            >
              Play Again
            </button>
            <button
              onClick={resetAll}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                         transition-all hover:scale-105 font-semibold"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-green-400 mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• I'm thinking of a number between 1 and 100</li>
            <li>• You have {MAX_ATTEMPTS} attempts to guess it</li>
            <li>• I'll tell you if your guess is too high or too low</li>
            <li>• Try to guess the number in as few attempts as possible</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Target: <span className="text-green-400 font-semibold">1-100</span> • Attempts: <span className="text-green-400 font-semibold">{MAX_ATTEMPTS}</span>
        </div>
      </div>
    </div>
  )
}

export default NumberGuessingGame
