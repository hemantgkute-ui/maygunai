'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, RefreshCw, Bot } from 'lucide-react'
import type { RecommendationsResponse } from '@/lib/types'
import RecommendationCard from './RecommendationCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Props {
  query: string
  onDismiss: () => void
}

export default function RecommendationsList({ query, onDismiss }: Props) {
  const [data, setData] = useState<RecommendationsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ran, setRan] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)
    setRan(true)
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) throw new Error('Failed to get recommendations')
      const result: RecommendationsResponse = await res.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (!ran) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
          <Bot size={22} className="text-white" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">Get AI Recommendations</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
          Let AI find the best matches for <span className="font-semibold text-gray-700 dark:text-gray-300">&quot;{query}&quot;</span>
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={fetchRecommendations} className="btn-primary">
            <Sparkles size={14} />
            Get AI Picks
          </button>
          <button onClick={onDismiss} className="btn-ghost">
            Skip
          </button>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="card p-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <Bot size={24} className="text-purple-500" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <LoadingSpinner size="sm" />
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 dark:text-gray-200">Analyzing your query…</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">AI is finding the best matches</p>
        </div>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-purple-400"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm mb-3">{error}</p>
        <button onClick={fetchRecommendations} className="btn-secondary text-sm inline-flex items-center gap-2">
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    )
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recommendations found for this query.</p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Sparkles size={11} className="text-white" />
              </div>
              <h2 className="section-heading">AI Recommendations</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Best picks for <span className="font-medium text-gray-700 dark:text-gray-300">&quot;{data.query}&quot;</span>
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Filter context */}
        {(data.parsed_query.category || data.parsed_query.budget_max) && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 inline-flex flex-wrap gap-2"
          >
            {data.parsed_query.category && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 font-medium">
                📁 {data.parsed_query.category}
              </span>
            )}
            {data.parsed_query.budget_max && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 font-medium">
                💰 Up to ₹{data.parsed_query.budget_max.toLocaleString()}
              </span>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.recommendations.map((rec, i) => (
            <RecommendationCard key={rec.product.id} recommendation={rec} rank={i} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
