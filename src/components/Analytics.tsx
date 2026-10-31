'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, analyticsPageLocation, analyticsReferrer, completionAction, isAnalyticsHost } from '@/lib/analytics';
import { getToolBySlug } from '@/lib/loaders/toolLoader';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const initialized = useRef(false);
  const lastPage = useRef('');

  useEffect(() => {
    if (!isAnalyticsHost(window.location.hostname) || navigator.doNotTrack === '1') return;
    const location = analyticsPageLocation(pathname);
    const page = {
      page_location: location,
      page_path: new URL(location).pathname,
      page_referrer: lastPage.current || analyticsReferrer(document.referrer),
      page_title: document.title,
    };
    if (!initialized.current) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (..._args: unknown[]) { window.dataLayer!.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        ...page,
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      initialized.current = true;
      setEnabled(true);
    }
    if (lastPage.current !== location) {
      window.gtag?.('set', page);
      window.gtag?.('event', 'page_view', page);
      lastPage.current = location;
    }
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    const onSuccess = (event: Event) => {
      const source = (event as CustomEvent<{ source?: string }>).detail?.source;
      const tool = pathname.startsWith('/tools/') ? getToolBySlug(pathname.split('/')[2]) : null;
      const asset = pathname.startsWith('/fonts') ? 'fonts' : pathname.startsWith('/icons') ? 'icons' : 'home';
      window.gtag?.('event', 'tool_complete', {
        tool_id: tool?.slug || asset,
        action: completionAction(typeof source === 'string' ? source : ''),
        page_location: analyticsPageLocation(pathname),
      });
    };
    window.addEventListener('devpantry:tool-success', onSuccess);
    return () => window.removeEventListener('devpantry:tool-success', onSuccess);
  }, [enabled, pathname]);

  return enabled ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" crossOrigin="anonymous" /> : null;
}
