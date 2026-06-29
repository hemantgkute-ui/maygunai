'use client'

import { useState } from 'react'
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

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
          Comparing {products.length} Products
        </h2>
        <button
          onClick={runComparison}
          disabled={loading || products.length < 2}
          className="btn-primary text-sm"
        >
          {loading ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Analyzing…</span> : '⚡ AI Analysis'}
        </button>
      </div>

      {result && (
        <div className="p-5 bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Analysis</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{result.analysis}</p>
          {result.winner && (
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-lg text-sm font-medium">
              🏆 Best Overall: {result.winner}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium w-32">Feature</th>
              {products.map(p => (
                <th key={p.id} className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {highlights[p.id] && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        {highlights[p.id]}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight max-w-[120px]">
                      {p.name}
                    </span>
                    <button
                      onClick={() => onRemove(p.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 dark:border-gray-800/50">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Price</td>
              {products.map(p => {
                const cheapest = products.reduce((a, b) => a.price < b.price ? a : b)
                return (
                  <td key={p.id} className="py-3 px-4 text-center">
                    <span className={`font-bold ${p.id === cheapest.id ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      {formatPrice(p.price)}
                    </span>
                    {p.id === cheapest.id && <span className="block text-xs text-green-600 dark:text-green-400">Lowest</span>}
                  </td>
                )
              })}
            </tr>
            <tr className="border-b border-gray-50 dark:border-gray-800/50">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Rating</td>
              {products.map(p => (
                <td key={p.id} className="py-3 px-4 text-center">
                  <RatingStars rating={p.rating} reviewsCount={p.reviews_count} size="sm" />
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-50 dark:border-gray-800/50">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Brand</td>
              {products.map(p => (
                <td key={p.id} className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{p.brand}</td>
              ))}
            </tr>
            <tr className="border-b border-gray-50 dark:border-gray-800/50">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Stock</td>
              {products.map(p => (
                <td key={p.id} className="py-3 px-4 text-center">
                  <span className={p.in_stock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                    {p.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>
            {allSpecKeys.map(key => (
              <tr key={key} className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium capitalize">{key}</td>
                {products.map(p => (
                  <td key={p.id} className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 text-xs">
                    {p.specifications[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-gray-50 dark:border-gray-800/50 bg-green-50/30 dark:bg-green-900/5">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Pros</td>
              {products.map(p => (
                <td key={p.id} className="py-3 px-4 text-xs text-gray-600 dark:text-gray-300">
                  <ul className="space-y-1 text-left">
                    {p.pros.slice(0, 3).map((pro, i) => <li key={i} className="flex gap-1"><span className="text-green-500 flex-shrink-0">+</span>{pro}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="bg-red-50/20 dark:bg-red-900/5">
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Cons</td>
              {products.map(p => (
                <td key={p.id} className="py-3 px-4 text-xs text-gray-600 dark:text-gray-300">
                  <ul className="space-y-1 text-left">
                    {p.cons.slice(0, 3).map((con, i) => <li key={i} className="flex gap-1"><span className="text-red-400 flex-shrink-0">-</span>{con}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}>
          {products.map(p => (
            <div key={p.id} className="flex gap-2">
              {p.amazon_link && (
                <a href={p.amazon_link} target="_blank" rel="noopener noreferrer nofollow"
                  className="btn-primary text-xs py-2 flex-1 text-center">Amazon</a>
              )}
              {p.flipkart_link && (
                <a href={p.flipkart_link} target="_blank" rel="noopener noreferrer nofollow"
                  className="btn-secondary text-xs py-2 flex-1 text-center">Flipkart</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
