'use client'

import { useState } from 'react'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import type { SearchParams } from '@/lib/types'

interface Props {
  onFilter: (params: Partial<SearchParams>) => void
  currentParams?: SearchParams
}

export default function FilterSection({ onFilter, currentParams = {} }: Props) {
  const [category, setCategory] = useState(currentParams.category || '')
  const [minPrice, setMinPrice] = useState(currentParams.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || '')
  const [sortBy, setSortBy] = useState<NonNullable<SearchParams['sortBy']>>(currentParams.sortBy || 'rating')

  const apply = () => {
    onFilter({ category: category || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sortBy: sortBy as SearchParams['sortBy'] })
  }

  const reset = () => {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('rating')
    onFilter({})
  }

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wide">
        Filters
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input text-sm py-2"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sort By</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as NonNullable<SearchParams['sortBy']>)}
            className="input text-sm py-2"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Price Range (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="Min"
              className="input text-sm py-2 w-1/2"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="input text-sm py-2 w-1/2"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={apply} className="btn-primary text-sm py-2 flex-1">Apply</button>
          <button onClick={reset} className="btn-secondary text-sm py-2 flex-1">Reset</button>
        </div>
      </div>
    </div>
  )
}
