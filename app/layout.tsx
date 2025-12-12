
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRACER | Never Stop",
  description: "The modular SaaS platform for athletes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      DEFAULT: '#007BFF', // Race Blue
                      hover: '#0069D9',
                      dark: '#0056B3'
                    },
                    secondary: {
                      DEFAULT: '#FFD700', // Solar Gold
                      hover: '#E5C100'
                    },
                    background: '#F1F5F9', // Slate-100 (Standardized)
                    surface: '#FFFFFF',
                    text: {
                      primary: '#0F172A', // Slate-900
                      secondary: '#64748B', // Slate-500
                    },
                    success: '#28A745',
                    warning: '#FFC107',
                    error: '#DC3545'
                  },
                  backgroundImage: {
                    'hero-gradient': 'linear-gradient(135deg, #007BFF 0%, #0056B3 100%)',
                    'pr-burst': 'conic-gradient(from 180deg at 50% 50%, #FFD700, #FFED4E, #FFD700)',
                    'streak-fire': 'linear-gradient(to bottom right, #FF512F, #DD2476)'
                  }
                }
              }
            }
          `
        }} />
      </head>
      {/* Forced bg-slate-100 to ensure contrast against white cards */}
      <body className={`${inter.className} bg-slate-100 text-slate-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
