import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GhostSol — You Saw Nothing',
  description: 'GhostSol on Solana. No promises. No guarantees. Just memes.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
