"use client"

import './globals.scss'
import RootStyleRegistry from './emotion'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <RootStyleRegistry>

          {children}

        </RootStyleRegistry>

      </body>
    </html>
  )
}
