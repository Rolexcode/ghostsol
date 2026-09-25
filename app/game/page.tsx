import Link from 'next/link';
import GhostGame from './play';

export const metadata = { title: 'You Saw Nothing — GhostSol', description: 'A playable GhostSol city sighting.' };

export default function GamePage() {
  return <main className="play-page">
    <header className="play-header"><Link href="/" className="play-back">← BACK TO THE CITY</Link><span>GHOSTSOL / INTERACTIVE SIGHTING 001</span><span>YOU SAW NOTHING.</span></header>
    <div className="play-heading"><span className="play-kicker">THE GHOST HAS BEEN SPOTTED.</span><h1>YOU SAW<br/><em>NOTHING.</em></h1><p>He appears. You catch him. Then he is gone again. How many sightings can you make?</p></div>
    <GhostGame />
    <div className="play-notes"><span>01 / A GHOSTSOL GAME PROTOTYPE</span><span>THE STORY IS STILL BEING WRITTEN.</span></div>
  </main>;
}
