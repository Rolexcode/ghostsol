import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'GhostSol — You saw nothing.', description: 'A ghost in the Solana city. He disappears, returns, and the story follows the community.', icons: { icon: '/favicon.svg' } }
import Boot from './boot';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="intro-active">{children}<Boot /><Analytics /></body></html> }
