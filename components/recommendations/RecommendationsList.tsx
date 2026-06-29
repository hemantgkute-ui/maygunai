'use client'

import { useState } from 'react'
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
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">🎯</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Get AI Recommendations</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Let AI find the best products for: &quot;{query}&quot;
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={fetchRecommendations} className="btn-primary">
            Get Recommendations
          </button>
          <button onClick={onDismiss} className="btn-ghost">
            Skip
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="font-medium text-gray-700 dark:text-gray-300">Analyzing your query…</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Finding the best matches with AI</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
        <button onClick={fetchRecommendations} className="btn-secondary text-sm">Retry</button>
      </div>
    )
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No recommendations found for this query.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Recommendations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Best picks for &quot;{data.query}&quot;
          </p>
        </div>
        <button onClick={onDismiss} className="btn-ghost text-sm">
          ✕ Close
        </button>
      </div>

      {data.parsed_query.category && (
        <div className="mb-4 px-4 py-2.5 bg-purple-50 dark:bg-purple-900/10 rounded-xl text-sm text-gray-600 dark:text-gray-400">
          Filtered to: <strong className="text-purple-700 dark:text-purple-300">{data.parsed_query.category}</strong>
          {data.parsed_query.budget_max && (
            <span> · Budget: up to <strong className="text-purple-700 dark:text-purple-300">₹{data.parsed_query.budget_max.toLocaleString()}</strong></span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.recommendations.map((rec, i) => (
          <RecommendationCard key={rec.product.id} recommendation={rec} rank={i} />
        ))}
      </div>
    </div>
  )
}
