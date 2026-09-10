import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://devpantry.com'),
  title: {
    default: 'DevPantry | Developer Asset Engine & Chaos Testing Studio',
    template: '%s | DevPantry'
  },
  description: 'The ultimate developer pantry and utility suite: high-entropy mock data synthesis, custom schema builder, 2,180+ open-source typography studio, 353,000+ vector icons across 238 libraries, client-side zero-leak JWT inspector, and real-world API response vault.',
  authors: [{ name: 'DevPantry Community' }],
  creator: 'DevPantry',
  publisher: 'DevPantry Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devpantry.com',
    siteName: 'DevPantry Studio',
    title: 'DevPantry | Developer Asset Engine & Chaos Testing Studio',
    description: 'High-entropy mock data, 2,180+ open-source typefaces, 353K+ vector icons, zero-leak JWT inspector, and 19 production API & SSO response schemas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevPantry Developer Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPantry | Developer Edge-Case & Open-Source Asset Studio',
    description: 'High-entropy mock data, 2,180+ open-source typefaces, 353K+ vector icons, zero-leak JWT inspector, and real-world API & SSO response vault.',
    creator: '@devpantry',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen w-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-rose-500 selection:text-white bg-dev-grid transition-colors">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WYTNMC3H2B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WYTNMC3H2B');
          `}
        </Script>
        <ThemeProvider>
          {/* Top Developer Navigation */}
          <Header />

          {/* Main Viewport Container */}
          <main className="flex-1 min-h-0 overflow-y-auto min-w-0 flex flex-col relative">
            <div className="flex-1 shrink-0 flex flex-col">
              {children}
            </div>
            
            {/* Global Footer */}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
