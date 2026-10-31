import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeedbackNudge } from '../components/FeedbackNudge';
import { Analytics } from '../components/Analytics';

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
    default: 'DevPantry — Free Browser-Based Developer Tools',
    template: '%s | DevPantry'
  },
  description: 'Inspect JWTs, generate test data, convert JSON to TypeScript and Zod, and prepare images in your browser. Free tools, fonts, and icons. No account required.',
  authors: [{ name: 'Allwin S Antony', url: 'https://github.com/allwin-antony' }],
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
    title: 'DevPantry — Free Browser-Based Developer Tools',
    description: 'Debug tokens, generate test data, and prepare web assets. Useful tools that process your inputs in your browser.',
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
    title: 'DevPantry — Free Browser-Based Developer Tools',
    description: 'Debug tokens, generate test data, and prepare web assets in your browser. No account required.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                'name': 'DevPantry',
                'url': 'https://devpantry.com',
                'description': 'The ultimate developer pantry and utility suite: real-time WebRTC P2P collaborative editor, AI background remover, image studio, JWT inspector, 2,180+ typefaces, and 353,000+ vector icons.',
                'applicationCategory': 'DeveloperApplication',
                'operatingSystem': 'All',
                'browserRequirements': 'Requires JavaScript and HTML5',
                'offers': {
                  '@type': 'Offer',
                  'price': '0',
                  'priceCurrency': 'USD'
                },
                'author': {
                  '@type': 'Organization',
                  'name': 'DevPantry Studio',
                  'url': 'https://devpantry.com'
                }
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                'name': 'DevPantry',
                'url': 'https://devpantry.com',
                'logo': 'https://devpantry.com/favicon-32x32.png'
              }
            ])
          }}
        />
      </head>
      <body className="h-screen w-full overflow-x-hidden flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-rose-500 selection:text-white bg-dev-grid transition-colors">
        <Analytics />
        <ThemeProvider>
          {/* Top Developer Navigation */}
          <Header />

          {/* Main Viewport Container */}
          <main id="main-content" tabIndex={-1} className="flex-1 min-h-0 overflow-y-auto min-w-0 flex flex-col relative overflow-x-hidden">
            <div className="flex-1 shrink-0 flex flex-col min-w-0 w-full">
              {children}
            </div>
            
            {/* Global Footer */}
            <Footer />
          </main>

          {/* Non-intrusive feedback nudge — fires after tool success or 90s idle */}
          <FeedbackNudge />
        </ThemeProvider>
      </body>
    </html>
  );
}
