import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await supabase
      .from('saved_recommendations')
      .select('*, product:products(*)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return NextResponse.json({ data: data || [], total: count || 0, limit, offset })
  } catch (err) {
    console.error('[Saved Recs GET]', err)
    return NextResponse.json({ error: 'Failed to fetch saved recommendations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('saved_recommendations')
      .upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data, success: true })
  } catch (err) {
    console.error('[Saved Recs POST]', err)
    return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, productId } = await req.json()

    let deleteQuery = supabase.from('saved_recommendations').delete().eq('user_id', user.id)
    if (id) {
      deleteQuery = deleteQuery.eq('id', id)
    } else if (productId) {
      deleteQuery = deleteQuery.eq('product_id', productId)
    } else {
      return NextResponse.json({ error: 'id or productId required' }, { status: 400 })
    }

    const { error } = await deleteQuery
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Saved Recs DELETE]', err)
    return NextResponse.json({ error: 'Failed to remove saved recommendation' }, { status: 500 })
  }
}
