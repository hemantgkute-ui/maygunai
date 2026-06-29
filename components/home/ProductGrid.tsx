'use client'

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Heart, GitCompare, ExternalLink, Star, ShoppingCart, Package } from 'lucide-react'
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
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
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No products found</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 font-medium">
        {total.toLocaleString()} {total === 1 ? 'product' : 'products'} found
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {products.map(product => {
          const isInCompare = compareList.some(p => p.id === product.id)
          const isSaved = saved.has(product.id)
          const isSaving = saving.has(product.id)

          return (
            <motion.div key={product.id} variants={item}>
              <div className="card-hover group flex flex-col h-full overflow-hidden">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-purple-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <Badge label={product.category} variant="category" className="mb-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{product.brand}</p>
                    </div>
                    {user && (
                      <motion.button
                        onClick={() => handleSave(product)}
                        disabled={isSaving || isSaved}
                        whileTap={{ scale: 0.85 }}
                        className={`ml-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                          isSaved
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        aria-label="Save product"
                      >
                        <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
                      </motion.button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-3 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="mb-3">
                    <RatingStars rating={product.rating} reviewsCount={product.reviews_count} />
                  </div>

                  {/* Specs preview */}
                  {Object.keys(product.specifications).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Object.entries(product.specifications).slice(0, 3).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                        >
                          {String(v)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price + stock */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(product.price)}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.in_stock
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      {product.in_stock ? '● In Stock' : '● Out of Stock'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    {product.amazon_link && (
                      <a
                        href={product.amazon_link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="btn-primary text-xs py-2 flex-1 text-center inline-flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={12} />
                        Amazon
                      </a>
                    )}
                    {product.flipkart_link && (
                      <a
                        href={product.flipkart_link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="btn-secondary text-xs py-2 flex-1 text-center inline-flex items-center justify-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Flipkart
                      </a>
                    )}
                    {onCompare && (
                      <motion.button
                        onClick={() => onCompare(product)}
                        disabled={isInCompare || compareList.length >= 4}
                        whileTap={{ scale: 0.95 }}
                        className={`text-xs py-2 px-3 rounded-xl border transition-all duration-200 flex items-center gap-1 ${
                          isInCompare
                            ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-600 dark:hover:text-purple-400'
                        }`}
                      >
                        <GitCompare size={12} />
                        {isInCompare ? '✓' : ''}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
