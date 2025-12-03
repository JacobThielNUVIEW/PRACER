export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // DEBUG: Log all relevant environment tokens
  // Debug logging removed to prevent environment values from being printed to logs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  console.log('🔍 Callback received:', { code: !!code, error, error_description })

  // If there's an error from OAuth provider
  if (error) {
    // Sanitize error strings before redirecting to avoid embedding
    // complex JS error objects that can break client-side parsing.
    const raw = error_description || error || ''
    const safe = String(raw)
      .replace(/\s+/g, ' ') // collapse whitespace/newlines
      .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // remove control chars
      .slice(0, 200)
    console.error('❌ OAuth error:', error, error_description)
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(safe)}`)
  }

  // If we have a code, exchange it for a session
  if (code) {
    try {
      const cookieStore = cookies()
      
      // Use @supabase/ssr for proper cookie handling
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: cookieStore,
          }
        );
      
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('❌ Code exchange error:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(exchangeError.message)}`)
      }
      
      if (data.user) {
        console.log('✅ User authenticated:', data.user.email)
        
        // Check if profile exists, create if not
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (!existingProfile) {
          console.log('📝 Creating new profile for:', data.user.email)
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
            })
          
          if (insertError) {
            console.error('⚠️ Profile creation error:', insertError.message)
          }
        }
        
        // Redirect to dashboard
        console.log('🎉 Redirecting to dashboard')
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
    } catch (err: any) {
      const raw = err?.message ?? String(err ?? '')
      const safe = String(raw).replace(/\s+/g, ' ').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').slice(0, 200)
      console.error('❌ Callback error:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(safe)}`)
    }
  }

  // No code, redirect back to auth
  console.log('⚠️ No code in callback, redirecting to auth')
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}
