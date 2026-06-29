export const CATEGORIES = [
  'Laptops',
  'Smartphones',
  'Headphones',
  'Tablets',
  'Smartwatches',
  'Cameras',
  'Monitors',
  'Keyboards',
  'Mice',
  'Gaming Accessories',
] as const

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Best Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviewed' },
] as const

export const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: 999999 },
] as const

export const POPULAR_SEARCHES = [
  'Best laptop under ₹50,000',
  'Gaming laptop with RTX GPU',
  'iPhone vs Samsung flagship',
  'Wireless headphones for music',
  'Budget smartphone under ₹15,000',
  'Best monitor for design work',
  'Mechanical keyboard for coding',
  'Smartwatch for fitness tracking',
]

export const DEFAULT_PAGE_LIMIT = 12
export const MAX_COMPARISON_PRODUCTS = 4
export const MIN_COMPARISON_PRODUCTS = 2
