import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GameTrust | Find your next teammate',
  description:
    'A fictional gaming services sandbox. No real money or wallet connection.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
