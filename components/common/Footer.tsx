import Link from 'next/link'
import { Sparkles, Mail, MessageSquare, Code2, Briefcase } from 'lucide-react'

const links = {
  Product: [
    { label: 'Home', href: '/' },
    { label: 'Search History', href: '/search-history' },
    { label: 'Saved Items', href: '/saved-recommendations' },
    { label: 'Profile', href: '/profile' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socials = [
  { icon: MessageSquare, href: 'https://twitter.com/maygunai', label: 'Twitter/X' },
  { icon: Code2, href: 'https://github.com/maygunai', label: 'GitHub' },
  { icon: Briefcase, href: 'https://linkedin.com/company/maygunai', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@maygunai.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-10 border-b border-gray-100 dark:border-gray-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">MaygunAI</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              AI-powered shopping assistant for India. Find the best products at the best prices using natural language.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} MaygunAI. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Powered by TechMayGun · Affiliate links may earn a commission
          </p>
        </div>
      </div>
    </footer>
  )
}
