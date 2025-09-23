'use client'
import { useState } from 'react'
import RandomNumberGame from './game'
import RandomNumberGameMenu from './game_menu'
import { getRandomInt } from '@repo/ui/getRandomInt'
export interface StartGameProps {
  min: number
  max: number
  maxGuessCount: number
}

export interface GuessingGameMenuProps {
  startGame: (props: StartGameProps) => void
}

export interface GuessingGameEngineProps {
  randomNumber: number
  maxGuessCount: number
  endGame: () => void
}

export default function RandomNumberGuesser() {
  const [isGameInProgress, setIsGameInProgress] = useState(false)
  const [randomNumber, setRandomNumber] = useState(0)
  const [maxGuessCount, setMaxGuessCount] = useState(0)

  function startGame({ min, max, maxGuessCount }: StartGameProps) {
    const newRandomNumber = getRandomInt({ min, max })
    setRandomNumber(newRandomNumber)
    setMaxGuessCount(maxGuessCount)
    setIsGameInProgress(true)
  }

  function endGame() {
    setIsGameInProgress(false)
  }

  return (
    <div className="p-24 max-w-[800px] m-auto">
      {isGameInProgress ? (
        <RandomNumberGame endGame={endGame} randomNumber={randomNumber} maxGuessCount={maxGuessCount} />
      ) : (
        <RandomNumberGameMenu startGame={startGame} />
      )}
    </div>
  )
}
