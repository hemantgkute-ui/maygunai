'use client'

import { useState, useCallback } from 'react'
import type { Product, PaginatedResponse, SearchParams } from '@/lib/types'

export function useSearch() {
  const [results, setResults] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentParams, setCurrentParams] = useState<SearchParams>({})

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true)
    setError(null)
    setCurrentParams(params)

    try {
      const qs = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') qs.set(key, String(value))
      }

      const res = await fetch(`/api/search?${qs.toString()}`)
      if (!res.ok) throw new Error('Search failed')

      const data: PaginatedResponse<Product> = await res.json()
      setResults(data.data)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResults([])
    setTotal(0)
    setError(null)
    setCurrentParams({})
  }, [])

  return { results, total, loading, error, search, reset, currentParams }
}
