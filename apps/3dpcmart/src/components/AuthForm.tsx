'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { Size } from '@repo/ui/size'
import { Variant } from '@repo/ui/variant'

type AuthFormInputs = {
  name?: string
  email: string
  password: string
}

export default function AuthForm() {
  const { signUp, signIn, isLoading, error, clearError } = useAuth()
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>()

  const onSubmit = async (data: AuthFormInputs) => {
    clearError()
    if (isSignUpMode) {
      await signUp(data)
    } else {
      await signIn({ email: data.email, password: data.password })
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isSignUpMode ? 'Create Account' : 'Sign In'}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isSignUpMode && (
          <Input
            type="text"
            placeholder="Name (optional)"
            size={Size.LARGE}
            variant={Variant.PRIMARY}
            {...register('name')}
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          className="w-full"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Input
          type="password"
          placeholder="Password"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          className="w-full"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <div className="w-full pt-2">
          <Button
            type="submit"
            size={Size.LARGE}
            variant={Variant.PRIMARY}
            className="w-full bg-indigo-500 hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isSignUpMode ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          className="text-gray-600 hover:text-indigo-700 text-sm font-medium transition-colors"
        >
          {isSignUpMode
            ? 'Already have an account? Sign In'
            : "Don't have an account? Create an Account"}
        </button>
      </div>
    </div>
  )
}
