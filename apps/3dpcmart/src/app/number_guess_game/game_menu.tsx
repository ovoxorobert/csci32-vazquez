'use client'
import { Button } from '@repo/ui/button'
import { GuessingGameMenuProps } from './page'
import { FormEventHandler, useState } from 'react'
import Input from '@repo/ui/input'

export default function RandomNumberGameMenu({ startGame }: GuessingGameMenuProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [guess, setGuess] = useState(0)

  function onSubmitSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const min = Number(data.get('min'))
    const max = Number(data.get('max'))
    const maxGuessCount = Number(data.get('maxGuessCount'))
    startGame({ min, max, maxGuessCount })
    setShowSettings(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {showSettings ? (
        <div className="flex flex-col gap-4">
          <header>
            <h1 className="text-2xl font-bold">Enter the Request Bellow</h1>
          </header>
          <form className="flex flex-col gap-4" onSubmit={onSubmitSettings}>
            <Input
              type="number"
              placeholder={'Minimum guessing value'}
              name="min"
              id="min"
              min={0}
              setValue={(newValue) => setGuess(Number(newValue))}
            />
            <Input
              type="number"
              placeholder={'Maximum guessing value'}
              name="max"
              id="max"
              min={0}
              setValue={(newValue) => setGuess(Number(newValue))}
            />
            <Input
              type="number"
              placeholder={'Number of Guesses'}
              name="maxGuessCount"
              id="maxGuessCount"
              min={0}
              setValue={(newValue) => setGuess(Number(newValue))}
            />
            <Button>Submit</Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Welcome to the random number guessing game!</h1>
            <p>The rules are simple just guess the correct number between the number and chances you pick!</p>
            <p>You win absouletly nothing!</p>
            <p>JUST HAVE FUN!</p>
          </header>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowSettings(true)
            }}
          >
            <Button>Play</Button>
          </form>
        </div>
      )}
    </div>
  )
}
