import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'not set'

  let supabaseConnected = false
  let productCount = 0
  let supabaseError: string | null = null

  if (supabaseConfigured) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
      if (error) {
        supabaseError = error.message
      } else {
        supabaseConnected = true
        productCount = count ?? 0
      }
    } catch (e) {
      supabaseError = e instanceof Error ? e.message : 'Unknown error'
    }
  }

  const status = supabaseConnected && productCount > 0 ? 'ready' : 'degraded'

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    integrations: {
      supabase: {
        configured: supabaseConfigured,
        connected: supabaseConnected,
        productCount,
        error: supabaseError,
      },
      openai: {
        configured: openaiConfigured,
      },
    },
    app: {
      url: appUrl,
    },
    checklist: {
      'NEXT_PUBLIC_SUPABASE_URL': Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      'SUPABASE_SERVICE_ROLE_KEY': Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      'OPENAI_API_KEY': Boolean(process.env.OPENAI_API_KEY),
      'NEXT_PUBLIC_APP_URL': Boolean(process.env.NEXT_PUBLIC_APP_URL),
      'database_migration_run': supabaseConnected,
      'products_seeded': productCount > 0,
    },
  })
}
