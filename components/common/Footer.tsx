import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-purple-700 dark:text-purple-400 text-lg">MaygunAI</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              AI-powered shopping assistant for India
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/search-history" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Search History
            </Link>
            <Link href="/saved-recommendations" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Saved Items
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} MaygunAI. Built with Next.js, Supabase, and OpenAI.
            Affiliate links may earn commission.
          </p>
        </div>
      </div>
    </footer>
  )
}
