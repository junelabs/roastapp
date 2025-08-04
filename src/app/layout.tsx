import './globals.css';
import { AuthProvider } from '../Components/AuthProvider';
// Or use ../../ if layout.tsx is deeper inside folders like /app/some/page

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Every Roast',
  description: 'Discover trusted roasters, explore unique coffees, and learn from curated guides.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
