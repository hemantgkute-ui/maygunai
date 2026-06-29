'use client'

import { useState } from 'react'
import type { Recommendation } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/lib/auth/context'

interface Props {
  recommendation: Recommendation
  rank: number
}

const badgeVariants = {
  'Best Overall': 'overall',
  'Best Budget': 'budget',
  'Best Performance': 'performance',
} as const

const rankColors = [
  'from-purple-500 to-purple-700',
  'from-green-500 to-green-700',
  'from-blue-500 to-blue-700',
]

export default function RecommendationCard({ recommendation, rank }: Props) {
  const { user } = useAuth()
  const { product, score, explanation, badge } = recommendation
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch('/api/saved-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (res.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-1.5 bg-gradient-to-r ${rankColors[rank] || rankColors[2]}`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <Badge label={badge} variant={badgeVariants[badge]} className="mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {product.brand} · {product.category}
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score}</div>
            <div className="text-xs text-gray-400">/ 100</div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{explanation}</p>
        </div>

        <div className="mb-4">
          <RatingStars rating={product.rating} reviewsCount={product.reviews_count} />
        </div>

        {Object.keys(product.specifications).length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(product.price)}
            </span>
          </div>
          {user && (
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                saved
                  ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              {saved ? '❤️ Saved' : saving ? 'Saving…' : '🤍 Save'}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {product.amazon_link && (
            <a
              href={product.amazon_link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-primary text-sm py-2.5 flex-1 text-center"
            >
              Buy on Amazon
            </a>
          )}
          {product.flipkart_link && (
            <a
              href={product.flipkart_link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-secondary text-sm py-2.5 flex-1 text-center"
            >
              Buy on Flipkart
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
