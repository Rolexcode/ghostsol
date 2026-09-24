import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'GhostSol — You saw nothing.', description: 'A ghost in the Solana city. He disappears, returns, and the story follows the community.', icons: { icon: '/favicon.svg' } }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="intro-active">{children}<script src="/script.js" defer /></body></html> }
