'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <CartProvider>{children}</CartProvider>;
  }

  return (
    <CartProvider>
      {/* Decorative elements */}
      <div className="noise-overlay" />
      <div className="accent-line-left" />
      <div className="accent-line-right" />
      
      {/* Main content */}
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
