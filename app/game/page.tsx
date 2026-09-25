import Link from 'next/link';
import GhostGame from './play';

export const metadata = { title: 'You Saw Nothing — GhostSol', description: 'A playable GhostSol city sighting.' };

export default function GamePage() {
  return <main className="play-page">
    <header className="play-header"><Link href="/" className="play-back">← EXIT CITY</Link><span>GHOSTSOL / SIGHTING 001</span><span>YOU SAW NOTHING.</span></header>
    <GhostGame />
  </main>;
}
