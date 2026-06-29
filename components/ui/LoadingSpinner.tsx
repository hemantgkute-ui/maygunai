import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-10 w-10' }

export default function LoadingSpinner({ size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-purple-100 dark:border-purple-900/50 border-t-purple-600',
        sizes[size],
        className
      )}
    />
  )
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function LoadingCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-20 rounded-full" />
              <div className="skeleton h-5 w-4/5" />
              <div className="skeleton h-4 w-2/5" />
            </div>
            <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0" />
          </div>
          <div className="space-y-1.5">
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-3.5 w-5/6" />
            <div className="skeleton h-3.5 w-3/4" />
          </div>
          <div className="skeleton h-4 w-28" />
          <div className="flex justify-between items-center">
            <div className="skeleton h-7 w-24" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-9 flex-1 rounded-xl" />
            <div className="skeleton h-9 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
