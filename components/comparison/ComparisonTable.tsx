'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Trophy, X, ShoppingCart, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import type { Product, ComparisonResult } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getComparisonHighlights } from '@/lib/comparison/engine'

interface Props {
  products: Product[]
  onRemove: (id: string) => void
}

export default function ComparisonTable({ products, onRemove }: Props) {
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const highlights = getComparisonHighlights(products)
  const cheapest = products.reduce((a, b) => a.price < b.price ? a : b)
  const topRated = products.reduce((a, b) => a.rating > b.rating ? a : b)

  const runComparison = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: products.map(p => p.id) }),
      })
      if (!res.ok) throw new Error('Comparison failed')
      const data: ComparisonResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  const allSpecKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.specifications)))
  )

  const isWinner = (product: Product) => result?.winner === product.name

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
            Comparing {products.length} Products
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Side-by-side AI comparison</p>
        </div>
        <button
          onClick={runComparison}
          disabled={loading || products.length < 2}
          className="btn-primary text-sm"
        >
          {loading ? (
            <><LoadingSpinner size="sm" /> Analyzing…</>
          ) : (
            <><Zap size={14} /> AI Analysis</>
          )}
        </button>
      </div>

      {/* AI result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20 border-b border-purple-100 dark:border-purple-900/30"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
              <Zap size={15} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">AI Analysis</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{result.analysis}</p>
              {result.winner && (
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl text-sm font-semibold border border-amber-200 dark:border-amber-800/50">
                  <Trophy size={13} className="text-amber-500" />
                  Best Overall: {result.winner}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="px-5 py-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-32 bg-gray-50/50 dark:bg-gray-800/30">
                Feature
              </th>
              {products.map(p => (
                <th
                  key={p.id}
                  className={`py-4 px-4 text-center transition-colors ${
                    isWinner(p)
                      ? 'bg-amber-50/60 dark:bg-amber-900/10'
                      : 'bg-gray-50/30 dark:bg-gray-800/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {isWinner(p) && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full font-semibold border border-amber-200 dark:border-amber-800/40">
                        🏆 Winner
                      </span>
                    )}
                    {highlights[p.id] && !isWinner(p) && (
                      <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-900/40">
                        {highlights[p.id]}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-snug max-w-[130px] text-center">
                      {p.name}
                    </span>
                    <button
                      onClick={() => onRemove(p.id)}
                      className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={10} /> Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <td className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/40 dark:bg-gray-800/20">
                Price
              </td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 text-center ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  <span className={`font-bold text-base ${p.id === cheapest.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {formatPrice(p.price)}
                  </span>
                  {p.id === cheapest.id && (
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Lowest price</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <td className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/40 dark:bg-gray-800/20">Rating</td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 text-center ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  <div className="flex justify-center">
                    <RatingStars rating={p.rating} reviewsCount={p.reviews_count} size="sm" />
                  </div>
                  {p.id === topRated.id && products.filter(x => x.id !== p.id).every(x => x.rating < p.rating) && (
                    <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Top rated</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <td className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/40 dark:bg-gray-800/20">Brand</td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 text-center text-sm text-gray-700 dark:text-gray-300 font-medium ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  {p.brand}
                </td>
              ))}
            </tr>

            {/* Stock */}
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <td className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/40 dark:bg-gray-800/20">Stock</td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 text-center ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${p.in_stock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {p.in_stock ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {p.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Specs */}
            {allSpecKeys.map(key => (
              <tr key={key} className="border-b border-gray-50 dark:border-gray-800/60">
                <td className="py-3.5 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize bg-gray-50/40 dark:bg-gray-800/20">
                  {key}
                </td>
                {products.map(p => (
                  <td key={p.id} className={`py-3.5 px-4 text-center text-xs text-gray-700 dark:text-gray-300 ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                    {p.specifications[key] ? (
                      <span className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        {String(p.specifications[key])}
                      </span>
                    ) : '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Pros */}
            <tr className="border-b border-gray-50 dark:border-gray-800/60">
              <td className="py-3.5 px-5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide bg-emerald-50/30 dark:bg-emerald-900/5">
                Pros
              </td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  <ul className="space-y-1.5">
                    {p.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons */}
            <tr>
              <td className="py-3.5 px-5 text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide bg-red-50/20 dark:bg-red-900/5">
                Cons
              </td>
              {products.map(p => (
                <td key={p.id} className={`py-3.5 px-4 ${isWinner(p) ? 'bg-amber-50/30 dark:bg-amber-900/5' : ''}`}>
                  <ul className="space-y-1.5">
                    {p.cons.slice(0, 3).map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <XCircle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buy buttons footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
          {products.map(p => (
            <div key={p.id} className="flex gap-2">
              {p.amazon_link && (
                <a href={p.amazon_link} target="_blank" rel="noopener noreferrer nofollow"
                  className="btn-primary text-xs py-2 flex-1 text-center inline-flex items-center justify-center gap-1">
                  <ShoppingCart size={11} /> Amazon
                </a>
              )}
              {p.flipkart_link && (
                <a href={p.flipkart_link} target="_blank" rel="noopener noreferrer nofollow"
                  className="btn-secondary text-xs py-2 flex-1 text-center inline-flex items-center justify-center gap-1">
                  <ExternalLink size={11} /> Flipkart
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
