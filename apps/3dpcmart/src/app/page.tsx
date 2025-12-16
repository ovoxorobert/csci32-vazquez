'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-700">
      Redirecting to Home...
    </div>
  )
}
