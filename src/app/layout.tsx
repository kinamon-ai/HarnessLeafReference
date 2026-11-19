import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://kinamon-ai.github.io/HarnessLeafReference';
const ogImageUrl = `${siteUrl}/og-image.png`;
const siteTitle = 'Leaf Reference - Agent Harness Designer';
const siteDescription =
  'Visual encyclopedia and socket specification reference for all 26 Leaf components in Agent Harness Designer';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    type: 'website',
    siteName: 'Agent Harness Designer - Leaf Reference',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Leaf Components - Agent Harness Designer Visual Reference',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="antialiased bg-[#070b14] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
