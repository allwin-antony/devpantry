import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, Type, Box, Radio, ShieldCheck, Heart, BookOpen } from 'lucide-react';
import { DevPantryLogo } from './DevPantryLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full shrink-0 border-t border-[var(--border-dev)] bg-[var(--bg-panel)] font-mono text-xs text-[var(--text-muted)] transition-colors">
      {/* Top Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Column 1: Image Studio */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Image Studio</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/tools/background-remover" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  AI Background Remover
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resizer" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Image Resizer &amp; Artboard
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Image Compressor &amp; WebP
                </Link>
              </li>
              <li>
                <span className="text-[10px] text-[var(--text-muted)] opacity-75">
                  100% Client-Side WebGPU &amp; WASM
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Developer Utilities */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <Terminal className="w-3.5 h-3.5 text-cyan-500" />
              <span>Dev Utilities</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/tools/jwt-decoder" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Zero-Leak JWT Decoder
                </Link>
              </li>
              <li>
                <Link href="/tools/collab" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  P2P Collab Editor
                </Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  JSON Formatter &amp; Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/mock-data" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Chaos Mock Data Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/diff-viewer" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Text &amp; Code Diff Viewer
                </Link>
              </li>
              <li>
                <Link href="/tools/social-preview" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Social Share Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Typefaces */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              <span>Open Fonts</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/fonts/inter" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Inter (UI Sans)
                </Link>
              </li>
              <li>
                <Link href="/fonts/jetbrains-mono" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  JetBrains Mono (Code)
                </Link>
              </li>
              <li>
                <Link href="/fonts/satoshi" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Satoshi (Modernist)
                </Link>
              </li>
              <li>
                <Link href="/fonts/clash-display" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Clash Display (Editorial)
                </Link>
              </li>
              <li>
                <Link href="/fonts/fira-code" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Fira Code (Ligatures)
                </Link>
              </li>
              <li>
                <Link href="/fonts" className="text-rose-500 dark:text-rose-400 font-semibold hover:underline transition-colors">
                  Browse 2,180+ Fonts →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Vector Icon Toolkits */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <Box className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vector Icons</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/icons/lucide" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Lucide Icons (1,800+)
                </Link>
              </li>
              <li>
                <Link href="/icons/tabler" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Tabler Icons (6,100+)
                </Link>
              </li>
              <li>
                <Link href="/icons/heroicons" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Heroicons (Tailwind)
                </Link>
              </li>
              <li>
                <Link href="/icons/material-symbols" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Material Symbols
                </Link>
              </li>
              <li>
                <Link href="/icons/simple-icons" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Simple Icons (Brands)
                </Link>
              </li>
              <li>
                <Link href="/icons" className="text-rose-500 dark:text-rose-400 font-semibold hover:underline transition-colors">
                  Browse 238+ Toolkits →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Production API Mocks */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <Radio className="w-3.5 h-3.5 text-violet-500" />
              <span>API Fixtures</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/tools/api-templates/stripe-billing" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Stripe Billing &amp; Webhooks
                </Link>
              </li>
              <li>
                <Link href="/tools/api-templates/google-sso" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Google OAuth 2.0 / OIDC
                </Link>
              </li>
              <li>
                <Link href="/tools/api-templates/github-webhooks" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  GitHub Webhook Payloads
                </Link>
              </li>
              <li>
                <Link href="/tools/api-templates/postgrest-supabase" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Supabase PostgREST
                </Link>
              </li>
              <li>
                <Link href="/tools/api-templates" className="text-rose-500 dark:text-rose-400 font-semibold hover:underline transition-colors">
                  View 19 API Standards →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Engineering Guides */}
          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-wide uppercase">
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>Engineering Guides</span>
            </div>
            <ul className="flex flex-col gap-2 text-[11px]">
              <li>
                <Link href="/guides/p2p-webrtc-collaboration" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  WebRTC P2P &amp; CRDT Sync
                </Link>
              </li>
              <li>
                <Link href="/guides/browser-ai-background-removal" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Client-Side AI &amp; WebGPU
                </Link>
              </li>
              <li>
                <Link href="/guides/zero-leak-jwt-inspector" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Zero-Leak JWT Cryptography
                </Link>
              </li>
              <li>
                <Link href="/guides/browser-image-compression" className="hover:text-[var(--text-primary)] hover:underline transition-colors">
                  Browser Image Compression
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-rose-500 dark:text-rose-400 font-semibold hover:underline transition-colors">
                  All Guides &amp; Specs →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Guarantee Bar */}
      <div className="border-t border-[var(--border-dev)] bg-[var(--bg-sidebar)] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <DevPantryLogo size={18} className="w-4.5 h-4.5" />
              <span className="font-bold text-xs text-[var(--text-primary)] font-mono">
                DEVPANTRY<span className="text-blue-500">.COM</span>
              </span>
            </Link>
            <span className="text-[var(--text-muted)]">|</span>
            <span className="text-[var(--text-secondary)]">
              © {new Date().getFullYear()} DevPantry
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Client-Side Sandbox · Zero Server Telemetry · Unlimited Free</span>
          </div>

          <nav className="flex items-center gap-4 text-[11px]">
            <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/security" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Security Architecture
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

