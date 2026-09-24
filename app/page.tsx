import GhostMark from '@/components/GhostMark'
import CopyContract from '@/components/CopyContract'

const sightings = [
  ['01', 'ROOFTOP', 'A silhouette above the skyline. Gone before anyone gets a clean shot.'],
  ['02', 'TIMELINE', 'The same face. Different meme. Nobody remembers who posted it first.'],
  ['03', 'CITY', 'Posters show up overnight. By morning, everyone swears they were always there.'],
]

const stages = [
  ['01', 'APPEAR', 'Nobody knows where the Ghost came from.'],
  ['02', 'HAUNT', 'Memes, sightings and community keep it moving.'],
  ['03', 'SPREAD', 'The Ghost becomes harder to ignore.'],
  ['04', 'RETURN', 'You cannot kill what never truly dies.'],
]

export default function Home() {
  return (
    <main>
      <div className="grain" aria-hidden="true" />

      <header className="nav-shell">
        <a className="brand" href="#top">$GHOST</a>
        <nav>
          <a href="#sightings">SIGHTINGS</a>
          <a href="#lore">LORE</a>
          <a href="#token">$GHOST</a>
        </nav>
        <div className="nav-actions">
          <a href="https://x.com/GhostSol5" target="_blank" rel="noreferrer">X</a>
          <a className="solid" href="https://t.me/ghostsolchat" target="_blank" rel="noreferrer">TELEGRAM</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="moon" aria-hidden="true" />
        <div className="smoke smoke-a" aria-hidden="true" />
        <div className="smoke smoke-b" aria-hidden="true" />

        <div className="skyline skyline-back" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => <i key={i} />)}
        </div>
        <div className="skyline skyline-front" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => <i key={i} />)}
        </div>

        <div className="hero-copy">
          <p className="eyebrow">GHOSTSOL · SOLANA · SIGHTING 001</p>
          <h1>YOU SAW<br />NOTHING.</h1>
          <p className="lede">
            A Ghost inside the Solana ecosystem. Mysterious, unpredictable, impossible to keep down.
            No promises. No guarantees. Just memes and a story that refuses to stay buried.
          </p>
          <div className="hero-actions">
            <a className="primary" href="https://t.me/ghostsolchat" target="_blank" rel="noreferrer">JOIN THE COMMUNITY</a>
            <a className="secondary" href="https://x.com/GhostSol5" target="_blank" rel="noreferrer">FOLLOW THE SIGHTINGS ↗</a>
          </div>
        </div>

        <div className="apparition" aria-label="GhostSol apparition">
          <div className="apparition-glow" />
          <GhostMark className="ghost-mark" />
          <span className="sighting-tag">THE GHOST IS ALREADY HERE.</span>
        </div>

        <div className="hero-note note-left">SAME CITY.<br />NEW GHOST.</div>
        <div className="hero-note note-right">JUST MEMES.<br />JUST COMMUNITY.<br />JUST $GHOST.</div>
      </section>

      <section className="ticker" aria-label="GhostSol motto">
        <div>YOU SAW NOTHING · NO ROADMAP · NO PROMISES · JUST MEMES · YOU SAW NOTHING · YOU SAW NOTHING · NO ROADMAP · NO PROMISES · JUST MEMES · YOU SAW NOTHING ·</div>
      </section>

      <section className="section" id="sightings">
        <div className="section-head">
          <div>
            <p className="eyebrow">EVIDENCE BOARD</p>
            <h2>SIGHTINGS</h2>
          </div>
          <p>
            GhostSol should feel less like a token brochure and more like an urban legend leaking into the timeline.
            Every post becomes another piece of evidence.
          </p>
        </div>

        <div className="evidence-grid">
          {sightings.map(([n, title, body]) => (
            <article className="evidence-card" key={n}>
              <div className="evidence-photo">
                <div className={`mini-ghost ghost-${n}`}><GhostMark /></div>
                <div className="city-lines" />
                <span className="stamp">CASE {n}</span>
              </div>
              <div className="evidence-copy">
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lore" id="lore">
        <div className="lore-quote">
          <p className="eyebrow">THE NARRATIVE</p>
          <h2>YOU CAN’T KILL<br />WHAT NEVER<br />TRULY DIES.</h2>
          <p>
            GhostSol is built around an identity that can keep evolving with the community. New sightings, new characters,
            new jokes, new moments — without pretending there is a corporate masterplan behind a meme.
          </p>
        </div>

        <div className="lore-list">
          {stages.map(([n, title, body]) => (
            <div className="lore-row" key={n}>
              <span>{n}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="token-section" id="token">
        <div className="token-visual">
          <div className="target-ring ring-1" />
          <div className="target-ring ring-2" />
          <div className="target-ring ring-3" />
          <GhostMark className="token-ghost" />
          <span>NOT A CULT.<br />JUST MEMES.</span>
        </div>

        <div className="token-copy">
          <p className="eyebrow">$GHOST</p>
          <h2>NO UTILITY.<br />JUST VIBES.</h2>
          <p className="body-copy">
            Keep the practical information honest and simple. No fake numbers, no made-up partnerships, no manufactured urgency.
          </p>
          <dl>
            <div><dt>CHAIN</dt><dd>SOLANA</dd></div>
            <div><dt>TICKER</dt><dd>$GHOSTSOL</dd></div>
            <div><dt>CONTRACT</dt><dd>COMING SOON</dd></div>
          </dl>
          <CopyContract />
        </div>
      </section>

      <section className="community" id="community">
        <div className="community-ghost"><GhostMark /></div>
        <p className="eyebrow">TRANSMISSION OPEN</p>
        <h2>THE GHOST SPEAKS<br />FIRST ON TELEGRAM.</h2>
        <p>Follow the sightings. Add to the lore. Keep the Ghost moving.</p>
        <div className="community-actions">
          <a href="https://t.me/ghostsolchat" target="_blank" rel="noreferrer">JOIN TELEGRAM ↗</a>
          <a href="https://x.com/GhostSol5" target="_blank" rel="noreferrer">FOLLOW @GHOSTSOL5 ↗</a>
        </div>
      </section>

      <footer>
        <strong>YOU SAW NOTHING.</strong>
        <span>GHOSTSOL · ON SOLANA · 2026</span>
      </footer>
    </main>
  )
}
