import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Secure-Doc | Sovereign Legal & Investigation Evidence Infrastructure',
  description:
    'Sovereign Digital Evidence Management & Cryptographic Chain-of-Custody Repository — Ministry of Home Affairs, NCRB (Smart India Hackathon 2026)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
