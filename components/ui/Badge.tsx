import { cn } from '@/lib/utils'

type BadgeVariant = 'overall' | 'budget' | 'performance' | 'category' | 'inStock' | 'outOfStock'

interface Props {
  label: string
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  overall: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  budget: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  performance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  category: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  inStock: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  outOfStock: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
}

const badgeIcons: Record<BadgeVariant, string> = {
  overall: '🏆',
  budget: '💰',
  performance: '⚡',
  category: '',
  inStock: '✓',
  outOfStock: '✗',
}

export default function Badge({ label, variant = 'category', className }: Props) {
  const icon = badgeIcons[variant]
  return (
    <span className={cn('badge', variantStyles[variant], className)}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  )
}
