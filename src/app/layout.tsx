import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Secure-Doc | Legal & Investigation Document Management System',
  description:
    'Secure Digital Document Management System for Legal & Investigation Documents - Ministry of Home Affairs, NCRB (Smart India Hackathon 2026)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
