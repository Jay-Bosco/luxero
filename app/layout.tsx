import type { Metadata } from 'next';
import './globals.css';
import SiteWrapper from '@/components/layout/SiteWrapper';

export const metadata: Metadata = {
  title: 'Luxero | Luxury Timepieces',
  description: 'Discover exceptional luxury watches. Handcrafted timepieces for the discerning collector.',
  keywords: ['luxury watches', 'timepieces', 'haute horlogerie', 'fine watches'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteWrapper>
          {children}
        </SiteWrapper>
      </body>
    </html>
  );
}
