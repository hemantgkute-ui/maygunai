'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, BarChart3, ShieldCheck, X, GitCompare } from 'lucide-react'
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

const categoryIcons: Record<string, string> = {
  Laptops: '💻', Smartphones: '📱', Headphones: '🎧', Tablets: '📟',
  Smartwatches: '⌚', Cameras: '📷', Monitors: '🖥️', Keyboards: '⌨️',
  Mice: '🖱️', 'Gaming Accessories': '🎮',
}

const features = [
  { icon: Brain, title: 'Natural Language', desc: 'Just describe what you need in plain English — no filters required.' },
  { icon: BarChart3, title: 'Smart Comparison', desc: 'Side-by-side AI analysis helps you pick the right product.' },
  { icon: ShieldCheck, title: 'Verified Picks', desc: 'Every recommendation is backed by real ratings and reviews.' },
]

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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-950 dark:to-purple-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(124,58,237,0.12),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-100/60 to-transparent dark:from-violet-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/50 to-transparent dark:from-purple-900/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* AI badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-7 shadow-sm border border-purple-100 dark:border-purple-900/60"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <Sparkles size={13} className="text-purple-500" />
            Powered by OpenAI GPT-4o mini
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-gray-100 mb-5 leading-[1.08] tracking-tight"
          >
            Find the{' '}
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
              Perfect Product
            </span>
            <br />with AI
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gray-500 dark:text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Describe what you need in plain language. Get personalized AI recommendations in seconds.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <SearchBar onSearch={handleSearch} loading={loading} />
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400 dark:text-gray-500"
          >
            {[
              { value: '100+', label: 'products indexed' },
              { value: '10', label: 'categories' },
              { value: 'AI', label: 'powered picks' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="font-bold text-gray-700 dark:text-gray-300">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Browse categories ── */}
        <AnimatePresence>
          {!searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mb-12"
            >
              <h2 className="section-heading mb-5">Browse Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategoryClick(cat)}
                    className="card-hover p-4 text-center cursor-pointer group"
                  >
                    <div className="text-3xl mb-2">{categoryIcons[cat] || '📦'}</div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors leading-tight">
                      {cat}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI Recommendations ── */}
        {showRecs && activeQuery && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <RecommendationsList query={activeQuery} onDismiss={() => setShowRecs(false)} />
          </motion.div>
        )}

        {/* ── Comparison table ── */}
        {showComparison && compareList.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <ComparisonTable products={compareList} onRemove={removeFromCompare} />
          </motion.div>
        )}

        {/* ── Compare nudge ── */}
        <AnimatePresence>
          {compareList.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/15 rounded-2xl border border-purple-100 dark:border-purple-900/40 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <GitCompare size={15} className="text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                  <span className="font-semibold">{compareList[0].name}</span> added — add 1 more to compare
                </p>
              </div>
              <button
                onClick={() => setCompareList([])}
                className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors p-1"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search results ── */}
        {searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <aside className="md:w-60 flex-shrink-0">
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
          </motion.div>
        )}

        {/* ── Feature highlights ── */}
        <AnimatePresence>
          {!searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mt-8"
            >
              <h2 className="section-heading mb-5">Why MaygunAI?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((f, i) => {
                  const Icon = f.icon
                  return (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="card-hover p-5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <Icon size={19} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1.5 text-sm">{f.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
