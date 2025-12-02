import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // DEBUG: Log all relevant environment tokens
  console.log('[DEBUG] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('[DEBUG] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('[DEBUG] NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  console.log('🔍 Callback received:', { code: !!code, error, error_description })

  // If there's an error from OAuth provider
  if (error) {
    console.error('❌ OAuth error:', error, error_description)
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error_description || error)}`)
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
          cookies: {
            get: (name) => cookieStore.get(name)?.value,
            set: (name, value, options) => cookieStore.set({ name, value, ...options }),
            remove: (name, options) => cookieStore.set({ name, value: '', ...options }),
          },
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
      console.error('❌ Callback error:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(err.message)}`)
    }
  }

  // No code, redirect back to auth
  console.log('⚠️ No code in callback, redirecting to auth')
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}
