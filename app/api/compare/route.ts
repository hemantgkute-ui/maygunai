import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateComparisonAnalysis } from '@/lib/openai/queryParser'
import { buildComparison } from '@/lib/comparison/engine'
import { MIN_COMPARISON_PRODUCTS, MAX_COMPARISON_PRODUCTS } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const { productIds, query } = await req.json()

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: 'productIds must be an array' }, { status: 400 })
    }
    if (productIds.length < MIN_COMPARISON_PRODUCTS) {
      return NextResponse.json({ error: `Need at least ${MIN_COMPARISON_PRODUCTS} products to compare` }, { status: 400 })
    }
    if (productIds.length > MAX_COMPARISON_PRODUCTS) {
      return NextResponse.json({ error: `Cannot compare more than ${MAX_COMPARISON_PRODUCTS} products` }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (error) throw error
    if (!products || products.length < MIN_COMPARISON_PRODUCTS) {
      return NextResponse.json({ error: 'Products not found' }, { status: 404 })
    }

    const orderedProducts = productIds
      .map(id => products.find((p: any) => p.id === id))
      .filter(Boolean) as typeof products

    const { analysis, winner } = await generateComparisonAnalysis(
      orderedProducts.map((p: any) => p.name),
      query
    )

    const result = buildComparison(orderedProducts, analysis, winner)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Compare API]', err)
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 })
  }
}
