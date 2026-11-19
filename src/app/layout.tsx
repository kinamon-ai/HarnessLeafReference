import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leaf Reference - Agent Harness Designer',
  description: 'Visual encyclopedia and socket specification reference for all 26 Leaf components in Agent Harness Designer',
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
