import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

type Position = { x: number; y: number }
type Direction = { x: number; y: number }

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const directionQueueRef = useRef<Direction[]>([])

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(generateFood(INITIAL_SNAKE))
    setGameOver(false)
    setIsPaused(false)
    setScore(0)
    setGameStarted(true)
    directionQueueRef.current = []
  }, [generateFood])

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setSnake((prevSnake) => {
      // Get next direction from queue or use current direction
      const nextDirection = directionQueueRef.current.shift() || direction
      if (directionQueueRef.current.length === 0) {
        setDirection(nextDirection)
      }

      const head = prevSnake[0]
      const newHead = {
        x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
      }

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        setGameStarted(false)
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake))
        setScore((prevScore) => prevScore + 10)
        return newSnake
      }

      // Remove tail if food not eaten
      newSnake.pop()
      return newSnake
    })
  }, [direction, food, gameOver, isPaused, gameStarted, generateFood])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) return

      // Pause/Resume
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        if (gameStarted && !gameOver) {
          setIsPaused((prev) => !prev)
        }
        return
      }

      if (isPaused || gameOver) return

      const directionMap: { [key: string]: Direction } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }

      const newDirection = directionMap[e.key]
      if (!newDirection) return

      e.preventDefault()

      const currentDirection = directionQueueRef.current.length > 0
        ? directionQueueRef.current[directionQueueRef.current.length - 1]
        : direction

      // Prevent reversing direction
      if (
        newDirection.x === -currentDirection.x ||
        newDirection.y === -currentDirection.y
      ) {
        return
      }

      // Add to queue (max 2 moves ahead)
      if (directionQueueRef.current.length < 2) {
        directionQueueRef.current.push(newDirection)
      }
    },
    [direction, gameStarted, gameOver, isPaused]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED)
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      }
    }
  }, [moveSnake, gameStarted, gameOver, isPaused])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Snake Game
        </h1>
        <div className="text-3xl font-bold mb-4 text-pink-600">
          Score: {score}
        </div>
        {gameOver && (
          <div className="text-2xl font-bold text-red-500 mb-4">
            Game Over! Final Score: {score}
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="text-2xl font-bold text-yellow-500 mb-4">
            Paused
          </div>
        )}
      </div>

      <div
        className="relative border-4 border-pink-500 rounded-lg shadow-2xl mb-6"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          backgroundColor: '#1a1a2e',
        }}
      >
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              backgroundColor: index === 0 ? '#ec4899' : '#a855f7',
              boxShadow: index === 0 ? '0 0 10px #ec4899' : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        {!gameStarted ? (
          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Start Game
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={gameOver}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Restart
            </Button>
          </>
        )}
      </div>

      <div className="text-center text-gray-400 max-w-md">
        <p className="mb-2">
          <strong>Controls:</strong> Arrow keys or WASD to move
        </p>
        <p className="mb-2">
          <strong>Pause:</strong> Space or Escape
        </p>
        <p>
          Eat the red food to grow and earn points. Don't hit yourself!
        </p>
      </div>
    </div>
  )
}

export default SnakeGame
