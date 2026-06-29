import type { Product, ComparisonResult } from '@/lib/types'

export function buildComparison(
  products: Product[],
  analysis: string,
  winner: string
): ComparisonResult {
  const allSpecKeys = new Set<string>()
  for (const p of products) {
    Object.keys(p.specifications).forEach(k => allSpecKeys.add(k))
  }

  const breakdown: Record<string, Record<string, string>> = {}
  for (const key of allSpecKeys) {
    breakdown[key] = {}
    for (const p of products) {
      breakdown[key][p.id] = p.specifications[key] || '—'
    }
  }

  return { products, analysis, winner, breakdown }
}

export function getComparisonHighlights(products: Product[]): Record<string, string> {
  const highlights: Record<string, string> = {}

  const cheapest = products.reduce((a, b) => (a.price < b.price ? a : b))
  highlights[cheapest.id] = 'Most Affordable'

  const topRated = products.reduce((a, b) => (a.rating > b.rating ? a : b))
  if (topRated.id !== cheapest.id) {
    highlights[topRated.id] = 'Top Rated'
  }

  const mostReviewed = products.reduce((a, b) => (a.reviews_count > b.reviews_count ? a : b))
  if (!highlights[mostReviewed.id]) {
    highlights[mostReviewed.id] = 'Most Popular'
  }

  return highlights
}
