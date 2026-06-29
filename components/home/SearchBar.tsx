'use client'

import { useState, useRef } from 'react'
import { POPULAR_SEARCHES } from '@/lib/constants'

interface Props {
  onSearch: (query: string) => void
  loading?: boolean
  initialQuery?: string
}

export default function SearchBar({ onSearch, loading, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleSuggestion = (s: string) => {
    setQuery(s)
    onSearch(s)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl border-2 border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/20 overflow-hidden">
          <span className="pl-4 text-gray-400 text-xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Best laptop under ₹50,000 for gaming…"
            className="flex-1 px-3 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="m-1.5 btn-primary px-6 py-2.5 text-sm flex-shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Searching…
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {POPULAR_SEARCHES.slice(0, 4).map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
