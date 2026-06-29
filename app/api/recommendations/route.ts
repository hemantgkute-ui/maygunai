import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseQuery, generateRecommendationExplanation } from '@/lib/openai/queryParser'
import { getRecommendations } from '@/lib/recommendations/engine'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const parsed = await parseQuery(query)

    let dbQuery = supabase.from('products').select('*').eq('in_stock', true)

    if (parsed.category) dbQuery = dbQuery.eq('category', parsed.category)
    if (parsed.budget_max) dbQuery = dbQuery.lte('price', parsed.budget_max * 1.2)
    if (parsed.budget_min) dbQuery = dbQuery.gte('price', parsed.budget_min)
    if (parsed.brands && parsed.brands.length > 0) {
      dbQuery = dbQuery.in('brand', parsed.brands)
    }

    dbQuery = dbQuery.order('rating', { ascending: false }).limit(50)

    let { data: products, error } = await dbQuery

    if (error) throw error

    if (!products || products.length < 3) {
      let fallback = supabase.from('products').select('*').eq('in_stock', true)
      if (parsed.category) fallback = fallback.eq('category', parsed.category)
      if (parsed.budget_max) fallback = fallback.lte('price', parsed.budget_max * 1.5)
      const { data: more } = await fallback.order('rating', { ascending: false }).limit(30)
      const existing = new Set((products || []).map((p: any) => p.id))
      const extra = (more || []).filter((p: any) => !existing.has(p.id))
      products = [...(products || []), ...extra]
    }

    if (!products || products.length === 0) {
      const { data: fallback } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(30)
      products = fallback || []
    }

    const recommendations = getRecommendations(products, parsed)

    const withExplanations = await Promise.all(
      recommendations.map(async (rec) => {
        const explanation = await generateRecommendationExplanation(
          query,
          rec.product.name,
          rec.badge,
          rec.score
        )
        return { ...rec, explanation }
      })
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      try {
        await supabase.from('searches').insert({
          user_id: user.id,
          query,
          parsed_query: parsed,
          results_count: products.length,
        })
      } catch { /* non-critical */ }
    }

    return NextResponse.json({
      recommendations: withExplanations,
      parsed_query: parsed,
      query,
    })
  } catch (err) {
    console.error('[Recommendations API]', err)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}
