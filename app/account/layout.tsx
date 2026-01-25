'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if on auth pages or verified page
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup') || pathname?.includes('/verified') || pathname?.includes('/forgot-password') || pathname?.includes('/reset-password');

  useEffect(() => {
    if (!isAuthPage) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const checkAuth = async () => {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/account/login');
      return;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setUser({
      id: session.user.id,
      email: session.user.email || '',
      full_name: profile?.full_name || session.user.user_metadata?.full_name || ''
    });
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { href: '/account', label: 'Profile', icon: User },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/account/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/account') {
      return pathname === '/account';
    }
    return pathname?.startsWith(href);
  };

  // Show auth pages without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get first name only
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-light mb-2">My Account</h1>
          <p className="text-luxury-muted font-sans">Welcome back, {firstName}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 font-sans text-sm transition-all relative ${
                      active 
                        ? 'text-gold-500 bg-gold-500/10' 
                        : 'text-luxury-light hover:bg-luxury-gray/20 hover:text-gold-500'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold-500" />
                    )}
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-luxury-muted font-sans text-sm hover:text-red-500 transition-colors w-full"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
