import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeverStop',
  description: 'Adaptive running platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
  <body className={`${inter.className} text-gold-500 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800`}>{children}</body>
    </html>
  )
}
