'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, BookMarked, History, User, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
    { href: '/', label: 'Home', icon: Sparkles },
    { href: '/search-history', label: 'History', icon: History, auth: true },
    { href: '/saved-recommendations', label: 'Saved', icon: BookMarked, auth: true },
    { href: '/profile', label: 'Profile', icon: User, auth: true },
  ]

  const visibleLinks = navLinks.filter(l => !l.auth || user)

  const initials = user?.email ? user.email[0].toUpperCase() : ''

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-gray-200/60 dark:border-gray-800/60'
          : 'bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="MaygunAI"
            width={130}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 ml-4">
          {visibleLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-purple-50 dark:bg-purple-900/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {loading ? (
            <LoadingSpinner size="sm" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
              >
                {signingOut ? <LoadingSpinner size="sm" /> : <><LogOut size={14} /><span className="hidden sm:inline">Sign Out</span></>}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm py-1.5 px-3.5">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-1.5 px-4">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="md:hidden ml-1 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {visibleLinks.map(link => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
