'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { RoleName } from '@/generated/graphql' // Import the generated RoleName enum

// Array defining the nav links
const navLinks = [
  { name: 'Home', href: '/home' },
  { name: 'Products', href: '/products' },
]

export default function Header() {
  const { user, signOut, isHydrated } = useAuth()
  const router = useRouter()

  const handleAuthAction = () => {
    if (user) {
      signOut()
      router.push('/home')
    } else {
      router.push('/welcome')
    }
  }

  if (!isHydrated) {
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            3DPC Mart
          </Link>
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/home" className="text-2xl font-extrabold text-indigo-600">
          3DPC Mart
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}

          {user && user.role === RoleName.Admin && (
            <Link
              href="/admin"
              className="text-white bg-red-600 hover:bg-red-700 font-bold px-3 py-1 rounded transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </nav>
        <button
          onClick={handleAuthAction}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200
            ${user ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
          `}
        >
          {user ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </header>
  )
}
