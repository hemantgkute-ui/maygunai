'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="card p-8 w-full max-w-md mx-auto text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Check your email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/login" className="btn-primary inline-block">
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Start finding the best products with AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            placeholder="Min. 6 characters"
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="input"
            placeholder="Repeat password"
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
          {loading ? <LoadingSpinner size="sm" /> : null}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
