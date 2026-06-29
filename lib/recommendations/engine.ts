import type { Product, ParsedQuery, Recommendation } from '@/lib/types'

function scoreProduct(product: Product, parsed: ParsedQuery): number {
  let score = 0

  // Rating score: 0-30 points
  const ratingScore = (product.rating / 5) * 30
  score += ratingScore

  // Price match: 0-30 points
  if (parsed.budget_max !== undefined) {
    if (product.price <= parsed.budget_max) {
      const priceRatio = 1 - product.price / parsed.budget_max
      score += 15 + priceRatio * 15
    } else {
      const overBudget = (product.price - parsed.budget_max) / parsed.budget_max
      score += Math.max(0, 15 - overBudget * 30)
    }
  } else {
    score += 15
  }

  // Requirements match: 0-40 points
  if (parsed.requirements && parsed.requirements.length > 0) {
    const specText = JSON.stringify(product.specifications).toLowerCase()
    const descText = (product.description + product.name).toLowerCase()
    let matched = 0
    for (const req of parsed.requirements) {
      const reqLower = req.toLowerCase()
      if (specText.includes(reqLower) || descText.includes(reqLower)) {
        matched++
      }
    }
    score += (matched / parsed.requirements.length) * 40
  } else {
    score += 20
  }

  // Brand preference bonus
  if (parsed.brands && parsed.brands.length > 0) {
    const brandLower = product.brand.toLowerCase()
    if (parsed.brands.some(b => brandLower.includes(b.toLowerCase()))) {
      score += 5
    }
  }

  // Reviews bonus (popular products)
  if (product.reviews_count > 1000) score += 3
  if (product.reviews_count > 5000) score += 2

  // In-stock bonus
  if (product.in_stock) score += 2

  return Math.min(100, Math.round(score))
}

export function getRecommendations(
  products: Product[],
  parsed: ParsedQuery,
  explanations?: Record<string, string>
): Recommendation[] {
  const scored = products
    .filter(p => p.in_stock)
    .map(p => ({ product: p, score: scoreProduct(p, parsed) }))
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return []

  const bestOverall = scored[0]

  const budgetCandidates = [...scored]
    .filter(s => s.product.id !== bestOverall.product.id)
    .sort((a, b) => {
      const aRatio = a.score / a.product.price
      const bRatio = b.score / b.product.price
      return bRatio - aRatio
    })

  const bestBudget = budgetCandidates[0] || scored[1] || scored[0]

  const perfCandidates = [...scored]
    .filter(s => s.product.id !== bestOverall.product.id && s.product.id !== bestBudget.product.id)
    .sort((a, b) => b.product.rating - a.product.rating)

  const bestPerformance = perfCandidates[0] || scored[2] || scored[1] || scored[0]

  const unique = new Map<string, { product: Product; score: number; badge: Recommendation['badge'] }>()
  unique.set(bestOverall.product.id, { ...bestOverall, badge: 'Best Overall' })
  unique.set(bestBudget.product.id, { ...bestBudget, badge: 'Best Budget' })
  unique.set(bestPerformance.product.id, { ...bestPerformance, badge: 'Best Performance' })

  return Array.from(unique.values()).map(({ product, score, badge }) => ({
    product,
    score,
    badge,
    explanation: explanations?.[product.id] || generateLocalExplanation(product, badge, parsed),
  }))
}

function generateLocalExplanation(product: Product, badge: Recommendation['badge'], parsed: ParsedQuery): string {
  if (badge === 'Best Overall') {
    return `${product.name} offers the best balance of performance and value at ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)} with a ${product.rating}/5 rating from ${product.reviews_count.toLocaleString()} reviews.`
  }
  if (badge === 'Best Budget') {
    const budget = parsed.budget_max
    const savings = budget ? budget - product.price : 0
    return `${product.name} delivers excellent value${savings > 0 ? `, saving you ₹${savings.toLocaleString()} under your budget` : ''}. Rated ${product.rating}/5 with proven reliability.`
  }
  return `${product.name} leads in performance with a ${product.rating}/5 rating and ${product.reviews_count.toLocaleString()} reviews backing its top-tier capabilities.`
}
