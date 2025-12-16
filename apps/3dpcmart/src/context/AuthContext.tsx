'use client'

import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  gqlClient,
  setAuthToken,
  clearAuthToken,
} from '../services/graphql-client'
import { graphql } from '../generated/gql'
import type {
  SignUpInput,
  SignInInput,
  AuthPayload,
  UserDto,
} from '../generated/graphql'
import { ClientError } from 'graphql-request'

export interface AuthContextType {
  isLoading: boolean
  error: string | null
  user: UserDto | null
  isAuthenticated: boolean
  isHydrated: boolean
  signUp: (input: SignUpInput) => Promise<AuthPayload | null>
  signIn: (input: SignInInput) => Promise<AuthPayload | null>
  signOut: () => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SIGN_UP_MUTATION = graphql(`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        user_id
        name
        email
        role
      }
    }
  }
`)

const SIGN_IN_MUTATION = graphql(`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        user_id
        name
        email
        role
      }
    }
  }
`)

interface AuthProviderProps {
  children: ReactNode
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof ClientError) {
    return err.response?.errors?.[0]?.message || fallback
  }
  return fallback
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserDto | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('authUser')
      }
    }
    setIsHydrated(true)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signOut = useCallback(() => {
    clearAuthToken()
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser')
    }
    clearError()
  }, [clearError])

  const signUp = async (input: SignUpInput): Promise<AuthPayload | null> => {
    try {
      setIsLoading(true)
      clearError()
      const result = await gqlClient.request(SIGN_UP_MUTATION, { input })

      if (result.signUp) {
        setAuthToken(result.signUp.token)

        const newUser = result.signUp.user
        setUser(newUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(newUser))
        }

        router.push('/dashboard')

        return result.signUp
      }

      return null
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Sign up failed')
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (input: SignInInput): Promise<AuthPayload | null> => {
    try {
      setIsLoading(true)
      clearError()

      const result = await gqlClient.request(SIGN_IN_MUTATION, { input })

      if (result.signIn) {
        setAuthToken(result.signIn.token)

        const newUser = result.signIn.user
        setUser(newUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(newUser))
        }

        router.push('/dashboard')

        return result.signIn
      }

      return null
    } catch (err) {
      const errorMessage = extractErrorMessage(err, 'Sign in failed')
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue = useMemo(
    () => ({
      isLoading,
      error,
      user,
      isAuthenticated,
      isHydrated,
      signUp,
      signIn,
      signOut,
      clearError,
    }),
    [
      isLoading,
      error,
      user,
      isAuthenticated,
      isHydrated,
      signUp,
      signIn,
      signOut,
      clearError,
    ],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
