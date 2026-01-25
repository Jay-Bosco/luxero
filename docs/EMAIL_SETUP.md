# Email Setup Guide for Luxero

This guide explains how to set up email verification and welcome emails.

## 1. Resend Setup (Recommended)

### Create Resend Account
1. Go to [resend.com](https://resend.com) and sign up (free tier: 100 emails/day)
2. Verify your domain or use their test domain for development
3. Get your API key from the dashboard

### Add to .env.local
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL="Luxero <noreply@yourdomain.com>"
NEXT_PUBLIC_SITE_URL=http://localhost:3005
```

For production:
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL="Luxero <noreply@luxero.com>"
NEXT_PUBLIC_SITE_URL=https://luxero.com
```

## 2. Supabase Email Configuration

### Enable Email Confirmation
1. Go to Supabase Dashboard → Authentication → Providers
2. Click on Email
3. Enable "Confirm email"
4. Save

### Configure Redirect URL
1. Go to Authentication → URL Configuration
2. Add your site URL to "Redirect URLs":
   - `http://localhost:3005/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Custom Email Templates (Optional)
1. Go to Authentication → Email Templates
2. Customize the "Confirm signup" template:

```html
<h2>Verify Your Luxero Account</h2>
<p>Hello {{ .Data.full_name }},</p>
<p>Click the link below to verify your email:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email</a></p>
```

## 3. Email Flow

### Signup Process:
1. User signs up → Supabase sends verification email
2. User clicks link → Redirected to `/auth/callback`
3. Callback verifies token → Sends welcome email via Resend
4. User redirected to `/account/verified`

### Emails Sent:
- **Verification Email**: Sent by Supabase (or customized via templates)
- **Welcome Email**: Sent by Resend after verification
- **Order Confirmation**: Sent by Resend after purchase

## 4. Testing

### Development Mode
For development, you can disable email confirmation:
1. Supabase Dashboard → Authentication → Providers → Email
2. Disable "Confirm email"

This will skip verification and auto-confirm users.

### Test Email
Use Resend's test domain during development:
```env
FROM_EMAIL="Luxero <onboarding@resend.dev>"
```

## 5. Troubleshooting

### Emails not sending?
1. Check Resend API key is correct
2. Verify domain is set up in Resend
3. Check Supabase email settings

### Verification link not working?
1. Check redirect URL is in Supabase allowed list
2. Ensure NEXT_PUBLIC_SITE_URL matches your domain

### User not receiving emails?
1. Check spam folder
2. Verify email address is valid
3. Check Resend dashboard for delivery status

## 6. Production Checklist

- [ ] Add production domain to Supabase redirect URLs
- [ ] Verify domain in Resend
- [ ] Update FROM_EMAIL with verified domain
- [ ] Update NEXT_PUBLIC_SITE_URL to production URL
- [ ] Test full signup flow
