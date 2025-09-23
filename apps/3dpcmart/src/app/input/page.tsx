'use client'
import { Button } from '@repo/ui/button'
import Input from '@repo/ui/input'
import { Size } from '@repo/ui/size'
import { Variant } from '@repo/ui/variant'
import { useState } from 'react'

export default function ButtonPage() {
  const [name, setName] = useState('')
  const [email, seteMail] = useState('')
  const [number, setNumber] = useState('')
  return (
    <div className="p-24">
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          <Input
            value={name}
            setValue={setName}
            size={Size.MEDIUM}
            variant={Variant.PRIMARY}
            name="name"
            id="name"
            placeholder="Full Name"
            min={0}
          />
          <Button
            onClick={() => alert(`You've enetered "${name}" is this correct?`)}
            size={Size.MEDIUM}
            variant={Variant.PRIMARY}
          >
            Submit
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={email}
            setValue={seteMail}
            size={Size.MEDIUM}
            variant={Variant.SECONDARY}
            name="email"
            id="email"
            placeholder="eMail"
            min={0}
          />
          <Button onClick={() => alert(`You've entered "${email}" is this correct?`)} variant={Variant.SECONDARY}>
            Submit
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={number}
            setValue={setNumber}
            size={Size.MEDIUM}
            variant={Variant.TERTIARY}
            name="number"
            id="number"
            placeholder="Phone Number"
            min={0}
          />
          <Button
            onClick={() => alert(`You've entered "${number}" is this correct?`)}
            size={Size.MEDIUM}
            variant={Variant.TERTIARY}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
