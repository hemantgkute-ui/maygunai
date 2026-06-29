'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function SearchHistoryClient({ action }: { action: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const clearHistory = async () => {
    if (!confirm('Clear all search history?')) return
    setLoading(true)
    try {
      await fetch('/api/search-history', { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (action === 'clear-button') {
    return (
      <button
        onClick={clearHistory}
        disabled={loading}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        {loading ? <LoadingSpinner size="sm" /> : '🗑️'}
        Clear History
      </button>
    )
  }

  return null
}
