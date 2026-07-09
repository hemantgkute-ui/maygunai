'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { POPULAR_SEARCHES } from '@/lib/constants'

interface Props {
  onSearch: (query: string) => void
  loading?: boolean
  initialQuery?: string
}

export default function SearchBar({ onSearch, loading, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
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
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={focused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`relative flex items-center bg-white dark:bg-gray-900 rounded-2xl transition-all duration-200 ${
            focused
              ? 'shadow-[0_0_0_3px_rgba(124,58,237,0.15),0_8px_24px_rgba(0,0,0,0.1)] border-2 border-purple-400'
              : 'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)] border-2 border-transparent'
          }`}
        >
          <div className="pl-5 text-gray-400 flex-shrink-0">
            {loading ? (
              <Loader2 size={20} className="animate-spin text-purple-500" />
            ) : (
              <Search size={20} className={focused ? 'text-purple-500' : 'text-gray-400'} />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Best laptop under ₹50,000 for video editing…"
            className="flex-1 px-4 py-5 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none text-base"
            disabled={loading}
          />

          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            whileTap={{ scale: 0.96 }}
            className="m-2 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span className="hidden sm:inline">Searching</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Search</span>
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mr-1">
          <Sparkles size={11} />
          Try:
        </span>
        {POPULAR_SEARCHES.slice(0, 4).map(s => (
          <motion.button
            key={s}
            onClick={() => handleSuggestion(s)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-xs px-3.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-700 dark:hover:border-purple-600 dark:hover:text-purple-400 transition-all duration-200 shadow-sm"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
