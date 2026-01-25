import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/account';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Send welcome email
      const email = data.user.email;
      const name = data.user.user_metadata?.full_name || 'there';

      if (email) {
        await sendWelcomeEmail(email, name);
      }

      // Redirect to success page
      return NextResponse.redirect(new URL('/account/verified', request.url));
    }
  }

  // If there's an error, redirect to login
  return NextResponse.redirect(new URL('/account/login?error=verification_failed', request.url));
}
