'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ROUND = 40;
const SIGHTINGS = [
  [24, 29], [43, 25], [74, 30], [61, 38], [30, 44], [76, 49],
  [25, 57], [48, 54], [72, 64], [36, 70], [57, 72], [75, 69],
] as const;
type Mode = 'ready' | 'playing' | 'ended';
type Pop = { slot: number; id: number } | null;

export default function GhostGame() {
  const [mode, setMode] = useState<Mode>('ready');
  const [pop, setPop] = useState<Pop>(null);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [combo, setCombo] = useState(0);
  const [seconds, setSeconds] = useState(ROUND);
  const [feedback, setFeedback] = useState<{ slot: number; text: string; id: number } | null>(null);
  const [best, setBest] = useState(0);
  const [musicOn, setMusicOn] = useState(true);
  const [effectsOn, setEffectsOn] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const modeRef = useRef<Mode>('ready'), popRef = useRef<Pop>(null), scoreRef = useRef(0), comboRef = useRef(0);
  const startAt = useRef(0), previousSlot = useRef(-1), sequence = useRef(0), generation = useRef(0), sound = useRef<AudioContext | null>(null), ambience = useRef<HTMLAudioElement | null>(null), musicEnabled = useRef(true), effectsEnabled = useRef(true);
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null), vanishTimer = useRef<ReturnType<typeof setTimeout> | null>(null), frame = useRef(0);

  const cue = useCallback((kind: 'appear' | 'catch' | 'miss') => {
    const ac = sound.current; if (!effectsEnabled.current || !ac || ac.state !== 'running') return;
    const now = ac.currentTime;
    const tone = (start: number, end: number, length: number, volume: number, type: OscillatorType = 'sine', delay = 0) => {
      const osc = ac.createOscillator(), gain = ac.createGain(), at = now + delay;
      osc.type = type; osc.frequency.setValueAtTime(start, at);
      osc.frequency.exponentialRampToValueAtTime(end, at + length);
      gain.gain.setValueAtTime(.001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + .012);
      gain.gain.exponentialRampToValueAtTime(.001, at + length);
      osc.connect(gain).connect(ac.destination); osc.start(at); osc.stop(at + length + .01);
    };
    const noise = (length: number, volume: number, high: number, low: number) => {
      const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * length), ac.sampleRate), samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      const source = ac.createBufferSource(), filter = ac.createBiquadFilter(), gain = ac.createGain();
      source.buffer = buffer; filter.type = 'bandpass'; filter.Q.value = .7;
      filter.frequency.setValueAtTime(high, now); filter.frequency.exponentialRampToValueAtTime(low, now + length);
      gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + length);
      source.connect(filter).connect(gain).connect(ac.destination); source.start(now); source.stop(now + length);
    };
    if (kind === 'appear') { noise(.13, .16, 2200, 420); tone(310, 105, .15, .13, 'triangle'); }
    if (kind === 'catch') { tone(670, 1150, .16, .16); tone(980, 1590, .24, .095, 'triangle', .035); noise(.035, .08, 3300, 2300); }
    if (kind === 'miss') { tone(225, 68, .34, .17, 'triangle'); tone(138, 78, .24, .08, 'sine', .09); noise(.19, .075, 650, 180); }
  }, []);

  const stopTimers = () => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (vanishTimer.current) clearTimeout(vanishTimer.current);
    cancelAnimationFrame(frame.current);
  };

  const finish = useCallback(() => {
    if (modeRef.current !== 'playing') return;
    modeRef.current = 'ended'; generation.current++; stopTimers(); popRef.current = null;
    ambience.current?.pause();
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
    let slot = Math.floor(Math.random() * SIGHTINGS.length);
    while (slot === previousSlot.current) slot = Math.floor(Math.random() * SIGHTINGS.length);
    previousSlot.current = slot;
    const item = { slot, id: ++sequence.current };
    popRef.current = item; setFeedback(null); setPop(item); cue('appear');
    // A quick flicker stays catchable on touch screens, then gets a little faster.
    const life = Math.max(680, 970 - elapsed * 7 + (comboRef.current === 0 ? 80 : 0));
    vanishTimer.current = setTimeout(() => {
      if (generation.current !== token || popRef.current?.id !== item.id) return;
      popRef.current = null; setPop(null); comboRef.current = 0; setCombo(0);
      setFeedback({ slot, text: 'VANISHED', id: item.id }); cue('miss');
      spawnTimer.current = setTimeout(() => spawn(token), 170 + Math.random() * 210);
    }, life);
  }, [cue, finish]);

  const begin = () => {
    stopTimers(); generation.current++;
    const token = generation.current;
    if (!sound.current) sound.current = new AudioContext();
    sound.current.resume().catch(() => {});
    if (!ambience.current) {
      ambience.current = new Audio('/assets/ghost-city-score.m4a');
      ambience.current.loop = true;
      ambience.current.volume = .62;
    }
    ambience.current.currentTime = 0;
    if (musicEnabled.current) ambience.current.play().catch(() => {});
    modeRef.current = 'playing'; popRef.current = null; scoreRef.current = 0; comboRef.current = 0; previousSlot.current = -1;
    setMode('playing'); setScore(0); setCaught(0); setCombo(0); setPop(null); setFeedback(null); setSeconds(ROUND);
    startAt.current = performance.now();
    const tick = () => {
      if (modeRef.current !== 'playing' || generation.current !== token) return;
      const remaining = Math.max(0, ROUND - (performance.now() - startAt.current) / 1000);
      setSeconds(Math.ceil(remaining));
      if (remaining <= 0) finish(); else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    spawnTimer.current = setTimeout(() => spawn(token), 470);
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
    setCaught(value => value + 1);
    const points = 10 + Math.min(20, (comboRef.current - 1) * 2);
    scoreRef.current += points; setScore(scoreRef.current);
    setFeedback({ slot, text: `+${points}`, id: active.id }); cue('catch');
    const token = generation.current;
    spawnTimer.current = setTimeout(() => spawn(token), 150 + Math.random() * 170);
  };

  const toggleMusic = () => {
    musicEnabled.current = !musicEnabled.current;
    setMusicOn(musicEnabled.current);
    if (musicEnabled.current && modeRef.current === 'playing') ambience.current?.play().catch(() => {});
    else ambience.current?.pause();
  };

  const toggleEffects = () => {
    effectsEnabled.current = !effectsEnabled.current;
    setEffectsOn(effectsEnabled.current);
    if (effectsEnabled.current) sound.current?.resume().catch(() => {});
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.querySelector('.play-page')?.requestFullscreen();
      setExpanded(Boolean(document.fullscreenElement));
    } catch { /* The viewport layout still fills the available browser screen. */ }
  };

  useEffect(() => {
    try { setBest(Number(localStorage.getItem('ghostsol-best') || 0)); } catch { /* optional */ }
    const syncFullscreen = () => setExpanded(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => { document.removeEventListener('fullscreenchange', syncFullscreen); generation.current++; stopTimers(); ambience.current?.pause(); ambience.current = null; sound.current?.close().catch(() => {}); sound.current = null; };
  }, []);

  return <div className="hunt-shell">
    <div className="hunt-hud"><div><small>TIME LEFT</small><strong>{seconds.toString().padStart(2, '0')}<i>s</i></strong></div><div><small>GHOSTS CAUGHT</small><strong>{caught.toString().padStart(2, '0')}</strong></div><div><small>SCORE</small><strong>{score.toString().padStart(3, '0')}</strong></div><div><small>PERSONAL BEST</small><strong>{best.toString().padStart(3, '0')}</strong></div></div>
    <div className={`hunt-scene ${pop ? 'is-haunted' : ''}`}>
      <div className="hunt-sky" aria-hidden="true"><span className="hunt-fog"/></div>
      <div className="cctv-layer" aria-hidden="true">
        <span className="cctv-corner cctv-tl"/><span className="cctv-corner cctv-tr"/><span className="cctv-corner cctv-bl"/><span className="cctv-corner cctv-br"/>
        <span className="sighting-camera"><i/> REC <b>CAM 03</b></span>
        <span className="cctv-time">09.25.26 &nbsp; 03:14:{String(ROUND - seconds).padStart(2, '0')} &nbsp; / &nbsp; CAMERA FEED</span>
        <span className="cctv-signal">SIGNAL {pop ? 'UNSTABLE' : 'STABLE'} <em>▂▄▆</em></span>
      </div>
      {pop && <button type="button" key={pop.id} className="roaming-ghost" style={{ left: `${SIGHTINGS[pop.slot][0]}%`, top: `${SIGHTINGS[pop.slot][1]}%` }} onClick={() => catchGhost(pop.slot)} aria-label="Catch the floating ghost">
        <span className="ghost-figure"><img src="/assets/ghost-game.webp" alt="" draggable={false}/></span>
      </button>}
      {feedback && <span className={`roaming-feedback ${feedback.text === 'VANISHED' || feedback.text === 'EMPTY' ? 'miss' : ''}`} key={feedback.id} style={{ left: `${SIGHTINGS[feedback.slot][0]}%`, top: `${SIGHTINGS[feedback.slot][1]}%` }}><img src="/assets/ghost-game.webp" alt="" draggable={false}/><b>{feedback.text}</b></span>}
      <span className="hunt-foreground" aria-hidden="true"/>
      {mode !== 'playing' && <div className="hunt-overlay"><span className="play-kicker">{mode === 'ended' ? 'SIGHTING ENDED / FILE SAVED' : 'A SIGHTING IS ABOUT TO BEGIN'}</span><h2>{mode === 'ended' ? 'DID YOU SEE HIM?' : 'HE IS IN THE CITY.'}</h2><p>{mode === 'ended' ? `You caught ${caught} ghosts and scored ${score} points. He will be back.` : 'He appears without warning. Tap the ghost before he disappears. You have 40 seconds.'}</p><button type="button" onClick={begin}>{mode === 'ended' ? 'PLAY AGAIN ↗' : 'ENTER THE CITY ↗'}</button><small>TURN UP YOUR SOUND · LOOK EVERYWHERE</small></div>}
    </div>
    <div className="hunt-bottom"><span>01 / LOOK FOR THE FLOATING GHOST</span><span>STREAK ×{combo || 0} / BONUS POINTS</span><div className="hunt-actions"><button type="button" className="hunt-sound" onClick={toggleMusic} aria-pressed={musicOn}>{musicOn ? '♫ MUSIC ON' : '♫ MUSIC OFF'}</button><button type="button" className="hunt-sound" onClick={toggleEffects} aria-pressed={effectsOn}>{effectsOn ? '⌁ FX ON' : '⌁ FX OFF'}</button><button type="button" className="hunt-sound" onClick={toggleFullscreen} aria-label={expanded ? 'Exit full screen' : 'Enter full screen'}>{expanded ? '↙ EXIT FULL SCREEN' : '⛶ FULL SCREEN'}</button></div></div>
  </div>;
}
