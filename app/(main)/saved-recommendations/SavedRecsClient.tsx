'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SavedRecsClient({ savedId }: { savedId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRemove = async () => {
    setLoading(true)
    try {
      await fetch('/api/saved-recommendations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: savedId }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="ml-2 text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1"
      aria-label="Remove saved product"
    >
      {loading ? '⏳' : '❤️'}
    </button>
  )
}
