import { cn, formatNumber, getRatingColor } from '@/lib/utils'

interface Props {
  rating: number
  reviewsCount?: number
  showCount?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function RatingStars({ rating, reviewsCount, showCount = true, size = 'sm', className }: Props) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  const starSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('flex', starSize)}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`f-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalf && <span className="text-yellow-400">½</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`e-${i}`} className="text-gray-300 dark:text-gray-600">★</span>
        ))}
      </div>
      <span className={cn(getRatingColor(rating), 'font-semibold text-sm')}>{rating.toFixed(1)}</span>
      {showCount && reviewsCount !== undefined && (
        <span className="text-gray-400 text-xs">({formatNumber(reviewsCount)})</span>
      )}
    </div>
  )
}
