import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { timeAgo } from '@/lib/utils'
import type { SearchHistory } from '@/lib/types'
import SearchHistoryClient from './SearchHistoryClient'

export const metadata = { title: 'Search History - MaygunAI' }

export default async function SearchHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/search-history')

  const { data: history } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Search History</h1>
        {history && history.length > 0 && (
          <SearchHistoryClient action="clear-button" />
        )}
      </div>

      {!history || history.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No search history</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your searches will appear here after you start searching.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item: SearchHistory) => (
            <div key={item.id} className="card p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.query}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{timeAgo(item.created_at)}</span>
                  {item.results_count > 0 && (
                    <span className="text-xs text-gray-400">{item.results_count} results</span>
                  )}
                  {item.parsed_query?.category && (
                    <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                      {item.parsed_query.category}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`/?q=${encodeURIComponent(item.query)}`}
                className="ml-4 flex-shrink-0 text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Search again →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
