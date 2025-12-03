import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/colors.css'
import BrandHeader from '@/components/BrandHeader'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REACELAY',
  description: 'Adaptive running platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-rac-depth text-rac-text-main`}>
        <ErrorBoundary>
          <BrandHeader />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
