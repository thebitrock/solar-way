import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
import { Providers } from './components/Providers';

import "./globals.css";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(config);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Solar Way",
  description: "Solar string calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
