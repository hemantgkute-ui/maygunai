import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { formatPrice } from '@/lib/utils'
import type { SavedRecommendation } from '@/lib/types'
import RatingStars from '@/components/ui/RatingStars'
import SavedRecsClient from './SavedRecsClient'

export const metadata = { title: 'Saved Recommendations - MaygunAI' }

export default async function SavedRecommendationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/saved-recommendations')

  const { data: saved } = await supabase
    .from('saved_recommendations')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Saved Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {saved?.length ?? 0} saved {saved?.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {!saved || saved.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No saved products</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Save products from search results or recommendations.
          </p>
          <Link href="/" className="btn-primary inline-block">Start Searching</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((item: SavedRecommendation & { product: any }) => {
            const p = item.product
            if (!p) return null
            return (
              <div key={item.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-2 leading-snug">{p.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.brand}</p>
                  </div>
                  <SavedRecsClient savedId={item.id} />
                </div>

                <RatingStars rating={p.rating} reviewsCount={p.reviews_count} className="mb-3" />

                <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {formatPrice(p.price)}
                </div>

                <div className="flex gap-2 mt-auto">
                  {p.amazon_link && (
                    <a href={p.amazon_link} target="_blank" rel="noopener noreferrer nofollow"
                      className="btn-primary text-xs py-2 flex-1 text-center">Amazon</a>
                  )}
                  {p.flipkart_link && (
                    <a href={p.flipkart_link} target="_blank" rel="noopener noreferrer nofollow"
                      className="btn-secondary text-xs py-2 flex-1 text-center">Flipkart</a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
