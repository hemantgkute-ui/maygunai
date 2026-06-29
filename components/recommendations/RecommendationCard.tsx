'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, ExternalLink, Trophy, TrendingUp, BadgeDollarSign, CheckCircle2, XCircle } from 'lucide-react'
import type { Recommendation } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import { useAuth } from '@/lib/auth/context'

interface Props {
  recommendation: Recommendation
  rank: number
}

const badgeConfig = {
  'Best Overall': {
    icon: Trophy,
    className: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    bar: 'from-amber-400 to-orange-400',
  },
  'Best Budget': {
    icon: BadgeDollarSign,
    className: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    bar: 'from-emerald-400 to-teal-400',
  },
  'Best Performance': {
    icon: TrendingUp,
    className: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    bar: 'from-purple-400 to-violet-500',
  },
} as const

const rankBars = [
  'from-amber-400 to-orange-400',
  'from-emerald-400 to-teal-400',
  'from-purple-400 to-violet-500',
]

export default function RecommendationCard({ recommendation, rank }: Props) {
  const { user } = useAuth()
  const { product, score, explanation, badge } = recommendation
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const config = badgeConfig[badge] ?? {
    icon: Trophy,
    className: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200',
    bar: rankBars[rank] ?? rankBars[2],
  }
  const BadgeIcon = config.icon

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch('/api/saved-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (res.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: rank * 0.08 }}
      className="card-hover flex flex-col overflow-hidden h-full"
    >
      {/* Top gradient bar */}
      <div className={`h-1 bg-gradient-to-r ${config.bar}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Badge + save */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
            <BadgeIcon size={12} />
            {badge}
          </span>
          {user && (
            <motion.button
              onClick={handleSave}
              disabled={saving || saved}
              whileTap={{ scale: 0.85 }}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                saved
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
            </motion.button>
          )}
        </div>

        {/* Product name */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug mb-0.5 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">
          {product.brand} · {product.category}
        </p>

        {/* AI explanation */}
        <div className="relative bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20 rounded-xl p-3.5 mb-4 border border-purple-100 dark:border-purple-900/40">
          <div className="absolute -top-2 -left-1 text-purple-400 text-lg leading-none">&#x275D;</div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">{explanation}</p>
        </div>

        {/* Confidence score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Confidence</span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{score}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: rank * 0.1 + 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${config.bar}`}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating} reviewsCount={product.reviews_count} />
        </div>

        {/* Specs */}
        {Object.keys(product.specifications).length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-2 border border-gray-100 dark:border-gray-700/60">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{key}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5 truncate">{String(value)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pros / Cons */}
        {(product.pros.length > 0 || product.cons.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {product.pros.length > 0 && (
              <div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-1.5">Pros</p>
                <ul className="space-y-1">
                  {product.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons.length > 0 && (
              <div>
                <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold uppercase tracking-wide mb-1.5">Cons</p>
                <ul className="space-y-1">
                  {product.cons.slice(0, 3).map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <XCircle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Price + buy buttons */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex gap-2">
            {product.amazon_link && (
              <a
                href={product.amazon_link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-primary text-xs py-2.5 flex-1 text-center inline-flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={13} />
                Amazon
              </a>
            )}
            {product.flipkart_link && (
              <a
                href={product.flipkart_link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-secondary text-xs py-2.5 flex-1 text-center inline-flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={13} />
                Flipkart
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
