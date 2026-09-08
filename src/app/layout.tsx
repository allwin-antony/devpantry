import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://devpantry.dev'),
  title: {
    default: 'DevPantry | Developer Edge-Case & Open-Source Asset Studio',
    template: '%s | DevPantry'
  },
  description: 'The ultimate developer pantry and utility suite: high-entropy mock data synthesis, custom schema builder, 2,180+ open-source typography studio, 353,000+ vector icons across 238 libraries, client-side zero-leak JWT inspector, and real-world API response vault.',
  keywords: [
    'devpantry',
    'free developer tools online',
    'web developer utility kit',
    'frontend design resources',
    'open source fonts',
    'mock data generator',
    'jwt inspector',
    'free vector icons',
    'client side jwt',
    'edge case test data generator',
    'font preview',
    'image compressor no signup',
    'icon search engine'
  ],
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
    url: 'https://devpantry.dev',
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
  alternates: {
    canonical: 'https://devpantry.dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DevPantry Studio',
    operatingSystem: 'Any',
    applicationCategory: 'DeveloperApplication',
    description: 'Developer pantry and edge-case testing studio featuring chaos data synthesis, custom schema builder, open-source font testing, vector icon customization, client-side zero-leak JWT inspection, and real-world API response fixtures.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Mock data generator with 100+ naughty strings for edge case testing',
      'Visual Custom Schema Builder with 13+ field types',
      '2,180+ Open Source Fonts interactive testing and CSS/npm generator',
      '353,000+ free vector icons search engine and SVG code generator',
      'Client-Side Zero-Leak JWT / OAuth Token Inspector',
      'Production API & SSO response fixtures for mocking (Google, GitHub, Stripe)'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Fontshare CDN preload for typography playground */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700&f[]=clash-display@400,600,700&f[]=general-sans@400,600&f[]=cabinet-grotesk@400,700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-rose-500 selection:text-white bg-dev-grid transition-colors">
        <ThemeProvider>
          {/* Top Developer Navigation */}
          <Header />

          {/* Main Viewport Container */}
          <main className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
