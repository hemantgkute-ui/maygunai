import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Profile - MaygunAI' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/profile')

  const [{ count: savedCount }, { count: searchCount }] = await Promise.all([
    supabase.from('saved_recommendations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('searches').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Your Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{savedCount ?? 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Saved Products</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{searchCount ?? 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Searches Made</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Details</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">User ID</span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{user.id.slice(0, 8)}…</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Email Verified</span>
            <span className={`text-sm font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.email_confirmed_at ? '✓ Verified' : '⚠ Unverified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
