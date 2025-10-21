'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated) {
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/welcome')
      }
    }
  }, [user, isHydrated, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Checking Session...
    </div>
  )
}
