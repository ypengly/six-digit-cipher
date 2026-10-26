import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'The Six-Digit Cipher: 100 Levels of IQ', template: '%s | Six-Digit Cipher' },
  description: 'Escape a digital vault by solving 100 reasoning puzzles. Each one hides a six-digit code.',
  icons: { icon: '/images/logo.svg' },
};
export const viewport: Viewport = { themeColor: '#05070f', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-motion="on" suppressHydrationWarning>
      <body className="font-display antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">Skip to content</a>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
