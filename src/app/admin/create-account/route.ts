// src/app/admin/create-account/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Use service role to bypass restrictions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('🔐 Creating admin account:', email)

    // Create user
    const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (createError) {
      console.error('❌ Create user error:', createError)
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    console.log('✅ Admin user created:', user?.id)

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user?.id,
        is_premium: true, // Make admin premium by default
      })

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    console.log('✅ Admin profile created')

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
      },
    })
  } catch (err: any) {
    console.error('❌ Exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
