'use client'

import { useState } from 'react'
import SearchBar from '@/components/home/SearchBar'
import FilterSection from '@/components/home/FilterSection'
import ProductGrid from '@/components/home/ProductGrid'
import RecommendationsList from '@/components/recommendations/RecommendationsList'
import ComparisonTable from '@/components/comparison/ComparisonTable'
import { LoadingCards } from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { useSearch } from '@/lib/hooks/useSearch'
import type { Product, SearchParams } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'

export default function HomePage() {
  const { results, total, loading, error, search, reset } = useSearch()
  const [activeQuery, setActiveQuery] = useState('')
  const [showRecs, setShowRecs] = useState(false)
  const [compareList, setCompareList] = useState<Product[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = (query: string) => {
    setActiveQuery(query)
    setShowRecs(true)
    setSearched(true)
    search({ q: query })
  }

  const handleFilter = (params: Partial<SearchParams>) => {
    search({ q: activeQuery, ...params })
  }

  const handleCategoryClick = (cat: string) => {
    setActiveQuery('')
    setShowRecs(false)
    setSearched(true)
    search({ category: cat })
  }

  const addToCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id) || compareList.length >= 4) return
    setCompareList(prev => [...prev, product])
    setShowComparison(true)
  }

  const removeFromCompare = (id: string) => {
    const updated = compareList.filter(p => p.id !== id)
    setCompareList(updated)
    if (updated.length < 2) setShowComparison(false)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.08),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <span>🤖</span> Powered by OpenAI GPT-4o mini
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 mb-4 leading-tight tracking-tight">
            Find the <span className="text-purple-600 dark:text-purple-400">Best Products</span>
            <br />with AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Describe what you need in plain language. Get personalized recommendations with AI-powered analysis.
          </p>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category quick access */}
        {!searched && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const icons: Record<string, string> = {
                  Laptops: '💻', Smartphones: '📱', Headphones: '🎧', Tablets: '📟',
                  Smartwatches: '⌚', Cameras: '📷', Monitors: '🖥️', Keyboards: '⌨️',
                  Mice: '🖱️', 'Gaming Accessories': '🎮',
                }
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="card p-4 text-center hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{icons[cat] || '📦'}</div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                      {cat}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {showRecs && activeQuery && (
          <div className="mb-10">
            <RecommendationsList query={activeQuery} onDismiss={() => setShowRecs(false)} />
          </div>
        )}

        {/* Comparison */}
        {showComparison && compareList.length >= 2 && (
          <div className="mb-10">
            <ComparisonTable products={compareList} onRemove={removeFromCompare} />
          </div>
        )}

        {compareList.length > 0 && compareList.length < 2 && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl flex items-center justify-between">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {compareList[0].name} added to compare. Add 1 more product to compare.
            </p>
            <button onClick={() => setCompareList([])} className="text-xs text-gray-500 hover:text-gray-700">
              ✕ Clear
            </button>
          </div>
        )}

        {/* Search results */}
        {searched && (
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="md:w-64 flex-shrink-0">
              <FilterSection onFilter={handleFilter} />
            </aside>
            <div className="flex-1 min-w-0">
              {loading ? (
                <LoadingCards />
              ) : error ? (
                <ErrorMessage message={error} onRetry={() => search({ q: activeQuery })} />
              ) : (
                <ProductGrid
                  products={results}
                  total={total}
                  onCompare={addToCompare}
                  compareList={compareList}
                />
              )}
            </div>
          </div>
        )}

        {/* Feature highlights */}
        {!searched && (
          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Why MaygunAI?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🤖', title: 'AI-Powered', desc: 'GPT-4o understands your natural language queries' },
                { icon: '📊', title: 'Smart Comparison', desc: 'Side-by-side comparison with AI analysis' },
                { icon: '💰', title: 'Best Value', desc: 'Find the best price-to-performance ratio' },
              ].map(f => (
                <div key={f.title} className="card p-5">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
