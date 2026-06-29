'use client'

import { useState } from 'react'
import type { Product } from '@/lib/types'
import { formatPrice, truncate } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/lib/auth/context'

interface Props {
  products: Product[]
  total: number
  onCompare?: (product: Product) => void
  compareList?: Product[]
}

export default function ProductGrid({ products, total, onCompare, compareList = [] }: Props) {
  const { user } = useAuth()
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const handleSave = async (product: Product) => {
    if (!user) return
    setSaving(s => new Set(s).add(product.id))
    try {
      const res = await fetch('/api/saved-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (res.ok) setSaved(s => new Set(s).add(product.id))
    } finally {
      setSaving(s => { const n = new Set(s); n.delete(product.id); return n })
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{total} products found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(product => {
          const isInCompare = compareList.some(p => p.id === product.id)
          const isSaved = saved.has(product.id)
          const isSaving = saving.has(product.id)

          return (
            <div key={product.id} className="card p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Badge label={product.category} variant="category" className="mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.brand}</p>
                </div>
                {user && (
                  <button
                    onClick={() => handleSave(product)}
                    disabled={isSaving || isSaved}
                    className={`ml-2 p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      isSaved
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    aria-label="Save product"
                  >
                    {isSaving ? '⏳' : isSaved ? '❤️' : '🤍'}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-3">
                {truncate(product.description, 100)}
              </p>

              <div className="mb-3">
                <RatingStars rating={product.rating} reviewsCount={product.reviews_count} />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(product.price)}
                </span>
                <Badge
                  label={product.in_stock ? 'In Stock' : 'Out of Stock'}
                  variant={product.in_stock ? 'inStock' : 'outOfStock'}
                />
              </div>

              <div className="flex gap-2 mt-auto">
                {product.amazon_link && (
                  <a
                    href={product.amazon_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="btn-primary text-xs py-2 flex-1 text-center"
                  >
                    Amazon
                  </a>
                )}
                {product.flipkart_link && (
                  <a
                    href={product.flipkart_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="btn-secondary text-xs py-2 flex-1 text-center"
                  >
                    Flipkart
                  </a>
                )}
                {onCompare && (
                  <button
                    onClick={() => onCompare(product)}
                    disabled={isInCompare || compareList.length >= 4}
                    className={`text-xs py-2 px-3 rounded-xl border transition-colors ${
                      isInCompare
                        ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600'
                    }`}
                  >
                    {isInCompare ? '✓ Added' : '+ Compare'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
