import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_PAGE_LIMIT } from '@/lib/constants'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brand = searchParams.get('brand') || ''
    const sortBy = searchParams.get('sortBy') || 'rating'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_LIMIT))
    const offset = (page - 1) * limit

    const supabase = await createClient()
    let query = supabase.from('products').select('*', { count: 'exact' })

    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`)
    }
    if (category) query = query.eq('category', category)
    if (brand) query = query.ilike('brand', `%${brand}%`)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))

    switch (sortBy) {
      case 'price_asc': query = query.order('price', { ascending: true }); break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'reviews': query = query.order('reviews_count', { ascending: false }); break
      default: query = query.order('rating', { ascending: false })
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    // Log search if authenticated (non-critical)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && q) {
        await supabase.from('searches').insert({
          user_id: user.id,
          query: q,
          results_count: count ?? 0,
        })
      }
    } catch { /* non-critical */ }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    })
  } catch (err) {
    console.error('[Search API]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
