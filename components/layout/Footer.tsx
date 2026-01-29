import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Luxero"
                className="h-10 w-auto mb-4"
              />
            </Link>
            <p className="text-luxury-muted font-sans text-sm leading-relaxed">
              Your trusted destination for authenticated luxury watches. 
              Shop with confidence.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-luxury-light font-sans text-xs tracking-extra-wide uppercase mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {['All Watches', 'New Arrivals', 'Featured', 'Rolex', 'Patek Philippe'].map((item) => (
                <li key={item}>
                  <Link
                    href="/watches"
                    className="text-luxury-muted font-sans text-sm hover:text-gold-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-luxury-light font-sans text-xs tracking-extra-wide uppercase mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping & Tracking', href: '/shipping' },
                { label: 'Track My Order', href: '/shipping' },
                { label: 'Returns', href: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-luxury-muted font-sans text-sm hover:text-gold-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-luxury-light font-sans text-xs tracking-extra-wide uppercase mb-6">
              Stay Connected
            </h4>
            <p className="text-luxury-muted font-sans text-sm mb-4">
              Subscribe for exclusive previews and updates.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="input-luxury flex-1"
              />
              <button type="submit" className="btn-primary px-4">
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-luxury-gray/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-luxury-muted font-sans text-xs tracking-wide">
            © {new Date().getFullYear()} Luxero. Premium Luxury Watches.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-luxury-muted font-sans text-xs tracking-wide hover:text-gold-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Escrow badge */}
      <div className="bg-luxury-dark/50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-center items-center gap-2">
          <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-luxury-muted font-sans text-xs tracking-wide">
            Secure Escrow Payment Protection
          </span>
        </div>
      </div>
    </footer>
  );
}
