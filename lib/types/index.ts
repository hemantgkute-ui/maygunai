export interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  currency: string
  description: string
  specifications: Record<string, string>
  pros: string[]
  cons: string[]
  rating: number
  reviews_count: number
  image_url: string
  amazon_link: string
  flipkart_link: string
  affiliate_enabled: boolean
  in_stock: boolean
  created_at: string
  updated_at: string
}

export interface ParsedQuery {
  category?: string
  budget_min?: number
  budget_max?: number
  brands?: string[]
  use_case?: string
  requirements?: string[]
  confidence: number
}

export interface Recommendation {
  product: Product
  score: number
  explanation: string
  badge: 'Best Overall' | 'Best Budget' | 'Best Performance'
}

export interface RecommendationsResponse {
  recommendations: Recommendation[]
  parsed_query: ParsedQuery
  query: string
}

export interface ComparisonResult {
  products: Product[]
  analysis: string
  winner: string
  breakdown: Record<string, Record<string, string>>
}

export interface SearchHistory {
  id: string
  user_id: string
  query: string
  parsed_query: ParsedQuery | null
  results_count: number
  created_at: string
}

export interface SavedRecommendation {
  id: string
  user_id: string
  product_id: string
  saved_at: string
  product?: Product
}

export interface SearchParams {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  brand?: string
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'reviews'
  page?: string
  limit?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
