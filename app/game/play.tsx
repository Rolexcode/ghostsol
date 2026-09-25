'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ROUND = 40;
type Mode = 'ready' | 'playing' | 'ended';
type Pop = { slot: number; id: number } | null;

export default function GhostGame() {
  const [mode, setMode] = useState<Mode>('ready');
  const [pop, setPop] = useState<Pop>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(ROUND);
  const [feedback, setFeedback] = useState<{ slot: number; text: string; id: number } | null>(null);
  const [best, setBest] = useState(0);
  const modeRef = useRef<Mode>('ready'), popRef = useRef<Pop>(null), scoreRef = useRef(0), comboRef = useRef(0);
  const startAt = useRef(0), previousSlot = useRef(-1), sequence = useRef(0), generation = useRef(0), sound = useRef<AudioContext | null>(null);
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null), vanishTimer = useRef<ReturnType<typeof setTimeout> | null>(null), frame = useRef(0);

  const cue = useCallback((kind: 'appear' | 'catch' | 'miss') => {
    const ac = sound.current; if (!ac || ac.state !== 'running') return;
    const now = ac.currentTime, osc = ac.createOscillator(), gain = ac.createGain();
    osc.type = kind === 'appear' ? 'triangle' : 'sine';
    const pitch = kind === 'catch' ? 570 : kind === 'miss' ? 125 : 185;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(kind === 'catch' ? 880 : kind === 'miss' ? 65 : 270, now + .22);
    gain.gain.setValueAtTime(.001, now);
    gain.gain.exponentialRampToValueAtTime(kind === 'appear' ? .025 : .065, now + .025);
    gain.gain.exponentialRampToValueAtTime(.001, now + .25);
    osc.connect(gain).connect(ac.destination); osc.start(now); osc.stop(now + .26);
  }, []);

  const stopTimers = () => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (vanishTimer.current) clearTimeout(vanishTimer.current);
    cancelAnimationFrame(frame.current);
  };

  const finish = useCallback(() => {
    if (modeRef.current !== 'playing') return;
    modeRef.current = 'ended'; generation.current++; stopTimers(); popRef.current = null;
    setPop(null); setMode('ended'); setSeconds(0);
    try {
      const prior = Number(localStorage.getItem('ghostsol-best') || 0);
      if (scoreRef.current > prior) { localStorage.setItem('ghostsol-best', String(scoreRef.current)); setBest(scoreRef.current); }
    } catch { /* A disabled storage setting does not stop the round. */ }
  }, []);

  const spawn = useCallback((token: number) => {
    if (generation.current !== token || modeRef.current !== 'playing') return;
    const elapsed = (performance.now() - startAt.current) / 1000;
    if (elapsed >= ROUND) { finish(); return; }
    let slot = Math.floor(Math.random() * 9);
    while (slot === previousSlot.current) slot = Math.floor(Math.random() * 9);
    previousSlot.current = slot;
    const item = { slot, id: ++sequence.current };
    popRef.current = item; setPop(item); cue('appear');
    // The window closes gently at first, then tightens as the visitor learns the rhythm.
    const life = Math.max(850, 1480 - elapsed * 13 + (comboRef.current === 0 ? 100 : 0));
    vanishTimer.current = setTimeout(() => {
      if (generation.current !== token || popRef.current?.id !== item.id) return;
      popRef.current = null; setPop(null); comboRef.current = 0; setCombo(0);
      setFeedback({ slot, text: 'VANISHED', id: item.id }); cue('miss');
      spawnTimer.current = setTimeout(() => spawn(token), 300 + Math.random() * 170);
    }, life);
  }, [cue, finish]);

  const begin = () => {
    stopTimers(); generation.current++;
    const token = generation.current;
    if (!sound.current) sound.current = new AudioContext();
    sound.current.resume().catch(() => {});
    modeRef.current = 'playing'; popRef.current = null; scoreRef.current = 0; comboRef.current = 0; previousSlot.current = -1;
    setMode('playing'); setScore(0); setCombo(0); setPop(null); setFeedback(null); setSeconds(ROUND);
    startAt.current = performance.now();
    const tick = () => {
      if (modeRef.current !== 'playing' || generation.current !== token) return;
      const remaining = Math.max(0, ROUND - (performance.now() - startAt.current) / 1000);
      setSeconds(Math.ceil(remaining));
      if (remaining <= 0) finish(); else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    spawnTimer.current = setTimeout(() => spawn(token), 650);
  };

  const catchGhost = (slot: number) => {
    if (modeRef.current !== 'playing') return;
    const active = popRef.current;
    if (active?.slot !== slot) {
      if (active) { comboRef.current = 0; setCombo(0); scoreRef.current = Math.max(0, scoreRef.current - 2); setScore(scoreRef.current); setFeedback({ slot, text: 'EMPTY', id: ++sequence.current }); }
      return;
    }
    if (vanishTimer.current) clearTimeout(vanishTimer.current);
    popRef.current = null; setPop(null);
    comboRef.current++; setCombo(comboRef.current);
    const points = 10 + Math.min(20, (comboRef.current - 1) * 2);
    scoreRef.current += points; setScore(scoreRef.current);
    setFeedback({ slot, text: `+${points}`, id: active.id }); cue('catch');
    const token = generation.current;
    spawnTimer.current = setTimeout(() => spawn(token), 230 + Math.random() * 160);
  };

  useEffect(() => {
    try { setBest(Number(localStorage.getItem('ghostsol-best') || 0)); } catch { /* optional */ }
    return () => { generation.current++; stopTimers(); sound.current?.close().catch(() => {}); sound.current = null; };
  }, []);

  return <div className="hunt-shell">
    <div className="hunt-hud"><div><small>TIME LEFT</small><strong>{seconds.toString().padStart(2, '0')}<i>s</i></strong></div><div><small>GHOSTS CAUGHT</small><strong>{score.toString().padStart(3, '0')}</strong></div><div><small>STREAK</small><strong>{combo > 1 ? `×${combo}` : '—'}</strong></div><div><small>PERSONAL BEST</small><strong>{best.toString().padStart(3, '0')}</strong></div></div>
    <div className="hunt-scene">
      <div className="hunt-sky" aria-hidden="true"><span className="hunt-moon"/><span className="hunt-fog"/></div>
      <div className="hunt-building"><div className="hunt-roof">GHOSTSOL <span>CAMERA 03 — 03:14 AM</span></div>
        <div className="hunt-windows">{Array.from({ length: 9 }, (_, slot) => <button key={slot} className={`hunt-window ${pop?.slot === slot ? 'haunted' : ''}`} type="button" onClick={() => catchGhost(slot)} aria-label={pop?.slot === slot ? `Catch ghost in window ${slot + 1}` : `Empty window ${slot + 1}`}>
          <span className="window-depth"/><span className="window-glass"/>
          {pop?.slot === slot && <span className="window-ghost" key={pop.id}><span className="ghost-shape"><span className="ghost-shine"/><span className="ghost-glasses"/><span className="ghost-smile"/><span className="ghost-chain">$</span></span></span>}
          {feedback?.slot === slot && <span className={`catch-feedback ${feedback.text === 'VANISHED' || feedback.text === 'EMPTY' ? 'miss' : ''}`} key={feedback.id}>{feedback.text}</span>}
          <span className="window-number">0{slot + 1}</span>
        </button>)}</div>
        <div className="hunt-building-base"><span>THE CITY SWEARS IT SAW NOTHING.</span><span>● REC</span></div>
      </div>
      <span className="hunt-foreground" aria-hidden="true"/>
      {mode !== 'playing' && <div className="hunt-overlay"><span className="play-kicker">{mode === 'ended' ? 'SIGHTING ENDED / FILE SAVED' : 'A SIGHTING IS ABOUT TO BEGIN'}</span><h2>{mode === 'ended' ? 'DID YOU SEE HIM?' : 'CATCH THE GHOST.'}</h2><p>{mode === 'ended' ? `You scored ${score} points. The ghost will be back.` : 'He appears in a window, then vanishes. Tap him before he disappears. You have 40 seconds.'}</p><button type="button" onClick={begin}>{mode === 'ended' ? 'PLAY AGAIN ↗' : 'START SIGHTING ↗'}</button><small>APPEAR → TAP → VANISH</small></div>}
    </div>
    <div className="hunt-bottom"><span>01 / LOOK FOR THE WHITE GHOST</span><span>02 / TAP HIM BEFORE HE VANISHES</span><span>MISS A WINDOW: −2 POINTS</span></div>
  </div>;
}
