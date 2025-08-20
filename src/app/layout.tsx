// app/layout.tsx
import './globals.css';
import { AuthProvider } from '../Components/AuthProvider';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Every Roast',
  description: 'Discover trusted roasters, explore unique coffees, and learn from curated guides.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>

        {/* Simple Analytics (load on all pages; prod-only to avoid polluting local dev) */}
        {isProd && (
          <>
            <Script
              src="https://scripts.simpleanalyticscdn.com/latest.js"
              data-collect-dnt="true"
              async
            />
            <noscript>
              <img
                src="https://queue.simpleanalyticscdn.com/noscript.gif"
                alt=""
                referrerPolicy="no-referrer-when-downgrade"
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
