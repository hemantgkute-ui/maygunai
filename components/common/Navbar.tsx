'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/')
    setSigningOut(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search-history', label: 'History', auth: true },
    { href: '/saved-recommendations', label: 'Saved', auth: true },
    { href: '/profile', label: 'Profile', auth: true },
  ]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image src="/logo.png" alt="MaygunAI" width={120} height={40} className="h-10 w-auto object-contain" priority />
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1 ml-2">
          {navLinks.filter(l => !l.auth || user).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {loading ? (
            <LoadingSpinner size="sm" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="btn-secondary text-sm py-1.5"
              >
                {signingOut ? <LoadingSpinner size="sm" /> : 'Sign Out'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm py-1.5">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-1.5">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="md:hidden ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-400 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-400" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {navLinks.filter(l => !l.auth || user).map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
