'use client'
import { Button } from '@repo/ui/button'
import { GuessingGameEngineProps } from './page'
import { Input } from '@repo/ui/input'
import { useState } from 'react'

export default function RandomNumberGame({
  randomNumber,
  endGame,
  maxGuessCount,
}: GuessingGameEngineProps) {
  const [guessCount, setGuessCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [guess, setGuess] = useState(0)
  const [hasWon, setGameOver] = useState(false)

  function submitGuess(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newGuessCount = guessCount + 1
    const zeroNum = 0
    if (guess === randomNumber) {
      setFeedback(`You won in ${newGuessCount} guesses!`)
      setGameOver(true)
    } else if (newGuessCount === maxGuessCount || maxGuessCount === 0) {
      setFeedback(`You lose! The correct number was ${randomNumber}.`)
      setGameOver(true)
    } else if (guess < randomNumber) {
      setFeedback('The Random Number is Higher')
    } else if (guess > randomNumber) {
      setFeedback('The Random Number is Lower')
    }

    setGuessCount(newGuessCount)
  }
  function onSubmitEndGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuessCount(0)
    setFeedback('')
    setGameOver(false)
    endGame()
  }
  return (
    <div
      className={`${maxGuessCount - 1 === guessCount ? 'bg-red-50' : ''}
${maxGuessCount === guessCount ? 'bg-red-200' : ''}
${hasWon ? '!bg-green-100' : ''}
p-10 rounded-md transition-color`}
    >
      {hasWon ? (
        <form className="flex flex-col gap-4" onSubmit={onSubmitEndGame}>
          <div>{feedback}</div>
          <Button>End Game</Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={submitGuess}>
          <Input
            name="guess"
            id="guess"
            type="number"
            placeholder="Enter your guess"
            value={guess}
            min={0}
            setValue={(newValue) => setGuess(Number(newValue))}
          />
          <div>{feedback}</div>
          <div>You have guessed {guessCount} times</div>
          <div>You have {maxGuessCount - guessCount} guesses left</div>
          <Button>Take A Chance</Button>
        </form>
      )}
    </div>
  )
}
