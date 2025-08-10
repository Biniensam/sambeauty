import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import { CartProvider } from '@/components/CartContext'
import { FavoritesProvider } from '@/components/FavoritesContext'
import { ThemeProvider } from '@/components/ThemeContext'
import { LanguageProvider } from '@/components/LanguageProvider'
import { NotificationProvider } from '@/components/NotificationContext'
import NotificationProviderComponent from '@/components/NotificationProvider'
import { ClerkProvider } from '@/components/ClerkProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <FavoritesProvider>
                  <NotificationProvider>
                    <NotificationProviderComponent />
                    {children}
                  </NotificationProvider>
                </FavoritesProvider>
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </ClerkProvider>
      </body>
    </html>
  )
} 