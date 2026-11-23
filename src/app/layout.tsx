import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/lib/session'
import AdsterraGlobals from '@/components/AdsterraGlobals'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'TechNexus — Your Daily Tech Insights', template: '%s | TechNexus' },
  description: 'Your daily source for the latest in technology, AI, web development, gadgets, and cybersecurity.',
  keywords: ['tech blog', 'technology', 'AI', 'web development', 'programming', 'gadgets', 'cybersecurity'],
  authors: [{ name: 'Alex Carter' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AdsterraGlobals />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
