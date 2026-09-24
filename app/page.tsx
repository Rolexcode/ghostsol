export default function Home() {
  return (
    <>

  <div id="intro" className="intro" role="dialog" aria-label="GhostSol introduction" aria-modal="true">
    <video id="arrival-video" autoPlay muted playsInline preload="auto" poster="/assets/walk.jpg"><source src="/assets/arrival.mp4" type="video/mp4" /></video>
    <div className="intro-shade"></div>
    <div className="intro-top"><span>GHOSTSOL / A SIGHTING</span><button id="skip-intro" type="button">SKIP INTRO <span aria-hidden="true">↗</span></button></div>
    <div className="intro-copy" aria-live="polite"><span className="intro-index">01 / 03</span><p id="intro-line">Nobody noticed him arrive.</p></div>
    <div className="intro-progress"><span></span></div>
  </div>

  <header className="site-header">
    <a className="brand" href="#top" aria-label="GhostSol home"><span className="brand-mark">G<span className="mark-ghost">◕</span>ST</span><span className="brand-sub">ON SOLANA</span></a>
    <nav aria-label="Main navigation"><a href="#sighting">THE SIGHTING</a><a href="#evidence">EVIDENCE</a><a href="#community">THE CROWD</a></nav>
    <a className="header-join" href="https://t.me/ghostsolchat" target="_blank" rel="noopener noreferrer">ENTER THE CHAT <span aria-hidden="true">↗</span></a>
  </header>

  <main id="top">
    <section className="hero" aria-labelledby="hero-title">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/city.jpg"><source src="/assets/reveal.mp4" type="video/mp4" /></video>
      <div className="hero-grain"></div>
      <div className="hero-topline"><span>AN UNCONFIRMED SIGHTING</span><span>EST. SOMEWHERE ON SOLANA</span></div>
      <div className="hero-content">
        <p className="eyebrow"><span className="red-square"></span> THE CITY HAS A NEW RUMOUR</p>
        <h1 id="hero-title">YOU SAW<br /><em>NOTHING.</em></h1>
        <div className="hero-bottom"><p>He walked right past you.<br />Now he's everywhere.</p><a className="round-scroll" href="#sighting" aria-label="Explore the story">↓</a></div>
      </div>
      <div className="hero-edge">$GHOSTSOL <span>///</span> JUST MEMES. JUST COMMUNITY. JUST GHOST.</div>
    </section>

    <section id="sighting" className="story section-wrap">
      <div className="section-label"><span>01</span><span>THE SIGHTING</span><span>FILE STILL OPEN</span></div>
      <div className="story-grid"><div className="story-copy"><p className="small-red">IT STARTED WITH A WALK.</p><h2>HE WAS<br /><i>NEVER</i><br />HERE.</h2><p>One minute, just another face in the crowd. The next, his face was on every wall in the city.</p><p>He vanishes without warning, then turns up where nobody expected. Every sighting gives the city another story to tell.</p><span className="handnote">Or can they?</span></div><figure className="story-image"><img src="/assets/walk.jpg" alt="GhostSol walking unnoticed through a busy city" loading="lazy" /><figcaption>FIG 001 — LAST KNOWN WALK / LOCATION UNKNOWN</figcaption></figure></div>
    </section>

    <section className="interlude" aria-label="The rumour"><div className="interlude-inner"><span>WHISPERS GOT LOUDER.</span><strong>THEN THE CITY<br />LOOKED UP.</strong></div></section>

    <section id="evidence" className="evidence section-wrap"><div className="section-label"><span>02</span><span>COLLECTED EVIDENCE</span><span>DRAW YOUR OWN CONCLUSIONS</span></div><div className="evidence-intro"><h2>THE GHOST<br />GETS AROUND.</h2><p>Every rumour leaves a trace.<br />These are ours.</p></div><div className="evidence-grid"><figure className="evidence-large"><img src="/assets/alley.jpg" alt="GhostSol in a dark alley under the words You Saw Nothing" loading="lazy" /><figcaption><span>01 / THE ALLEY</span><span>YOU SAW NOTHING.</span></figcaption></figure><figure className="evidence-small"><img src="/assets/wall.jpg" alt="GhostSol street poster asking if anyone has seen the ghost" loading="lazy" /><figcaption><span>02 / THE WALL</span><span>HAVE YOU SEEN HIM?</span></figcaption></figure><figure className="evidence-wide"><img src="/assets/morning.jpg" alt="GhostSol overlooks the city at sunrise" loading="lazy" /><figcaption><span>03 / THE ROOFTOP</span><span>JUST ANOTHER NIGHT.</span></figcaption></figure></div></section>

    <section className="manifesto"><div className="manifesto-image" role="img" aria-label="GhostSol towering above the night city"></div><div className="manifesto-content"><span className="small-red">THE ONLY THING WE KNOW FOR SURE</span><h2>NO ROADMAP.<br />NO PROMISES.<br /><i>JUST MEMES.</i></h2><p>$GHOSTSOL is a community driven meme coin on Solana. The ghost disappears, returns and keeps moving. The community decides where his story goes next.</p><div className="solana-note"><span>◈</span> ON SOLANA</div></div></section>

    <section id="community" className="community section-wrap"><div className="section-label"><span>03</span><span>JOIN THE CROWD</span><span>THE GHOST SPEAKS FIRST IN THE CHAT</span></div><div className="community-content"><span className="eyebrow">YOU'VE COME THIS FAR.</span><h2>KEEP YOUR<br /><i>EYES OPEN.</i></h2><p>Follow the sightings. Find the others. If anyone asks where you heard about us—</p><strong>YOU CAN’T KILL WHAT NEVER TRULY DIES.</strong><div className="social-actions"><a href="https://t.me/ghostsolchat" target="_blank" rel="noopener noreferrer">JOIN TELEGRAM <span>↗</span></a><a href="https://x.com/GhostSol5" target="_blank" rel="noopener noreferrer">FOLLOW ON X <span>↗</span></a></div></div><img className="community-ghost" src="/assets/portrait.jpg" alt="GhostSol wearing sunglasses and a chain" loading="lazy" /></section>
  </main>
  <footer><span>© GHOSTSOL</span><span>ON SOLANA · COMMUNITY DRIVEN</span><a href="#top">BACK TO THE TOP ↑</a></footer>
  
    </>
  )
}
