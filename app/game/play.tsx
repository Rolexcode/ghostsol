'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Thing = { x: number; y: number; kind: 'beam' | 'echo'; id: number; taken?: boolean };
type Game = { running: boolean; time: number; y: number; target: number; energy: number; phased: boolean; phaseHeld: boolean; lives: number; echoes: number; things: Thing[]; spawn: number; nextId: number; invincible: number; distance: number; ended: boolean; won: boolean };
const W = 960, H = 540, GOAL = 45;
const initial = (): Game => ({ running: false, time: 0, y: 270, target: 270, energy: 100, phased: false, phaseHeld: false, lives: 3, echoes: 0, things: [], spawn: .7, nextId: 0, invincible: 0, distance: 0, ended: false, won: false });

function ghost(ctx: CanvasRenderingContext2D, x: number, y: number, phased: boolean, t: number, invincible: number) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 4) * 5);
  if (invincible > 0 && Math.floor(t * 12) % 2) ctx.globalAlpha = .25;
  if (phased) { ctx.globalAlpha = .5; ctx.shadowColor = '#f6f6ff'; ctx.shadowBlur = 36; }
  ctx.fillStyle = '#e9e8e5'; ctx.beginPath(); ctx.moveTo(-34, 24); ctx.lineTo(-34, -9); ctx.arc(0, -9, 34, Math.PI, 0); ctx.lineTo(34, 25); ctx.quadraticCurveTo(20, 12, 13, 34); ctx.quadraticCurveTo(4, 16, -5, 34); ctx.quadraticCurveTo(-17, 16, -22, 32); ctx.quadraticCurveTo(-31, 20, -34, 24); ctx.fill();
  ctx.fillStyle = '#101114'; ctx.beginPath(); ctx.roundRect(-27, -17, 25, 15, 4); ctx.roundRect(3, -17, 25, 15, 4); ctx.fill(); ctx.fillRect(-3, -13, 7, 4);
  ctx.strokeStyle = '#7d7b79'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-22, 8); ctx.quadraticCurveTo(0, 23, 22, 8); ctx.stroke();
  ctx.fillStyle = '#bdbbb8'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center'; ctx.fillText('$', 0, 24);
  ctx.restore();
}

function render(ctx: CanvasRenderingContext2D, g: Game) {
  const t = g.time, d = g.distance;
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#101318'); bg.addColorStop(.55, '#1b1d23'); bg.addColorStop(1, '#090a0c'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#bcbcc6'; ctx.globalAlpha = .65; ctx.beginPath(); ctx.arc(740, 95, 38, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  for (let layer = 0; layer < 3; layer++) {
    const step = 92 - layer * 12, offset = (d * (.13 + layer * .2)) % step;
    for (let i = -1; i < W / step + 2; i++) {
      const x = i * step - offset, seed = ((i + Math.floor(d * (.13 + layer * .2) / step)) * 17 + layer * 13);
      const height = 95 + (Math.abs(seed * 37) % 155) + layer * 42;
      ctx.fillStyle = ['#1c2025', '#15191e', '#0c1015'][layer]; ctx.fillRect(x, H - height, step - 5, height);
      ctx.fillStyle = layer === 2 ? '#8b3432' : '#59616a'; ctx.globalAlpha = layer === 2 ? .23 : .16;
      for (let wy = H - height + 16; wy < H - 16; wy += 21) for (let wx = x + 12; wx < x + step - 10; wx += 19) if ((Math.floor(wx + wy + seed) % 4) === 0) ctx.fillRect(wx, wy, 5, 8);
      ctx.globalAlpha = 1;
    }
  }
  const fog = ctx.createLinearGradient(0, H * .54, 0, H); fog.addColorStop(0, '#d0d1da00'); fog.addColorStop(.6, '#b6b9c011'); fog.addColorStop(1, '#b6b9c000'); ctx.fillStyle = fog; ctx.fillRect(0, H * .54, W, H * .46);
  ctx.strokeStyle = '#e7e7e71b'; ctx.lineWidth = 1; for (let j = 0; j < 12; j++) { const x = (j * 117 - d * 1.2 % 117 + W) % W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 55, H); ctx.stroke(); }
  g.things.forEach(o => {
    if (o.taken) return;
    if (o.kind === 'beam') {
      ctx.fillStyle = '#f3493926'; ctx.beginPath(); ctx.moveTo(o.x + 22, 0); ctx.lineTo(o.x - 47, H); ctx.lineTo(o.x + 94, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e95348'; ctx.shadowColor = '#ee4d42'; ctx.shadowBlur = 19; ctx.fillRect(o.x - 3, o.y - 43, 6, 86); ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ee4d4277'; ctx.strokeRect(o.x - 18, o.y - 49, 36, 98);
      ctx.fillStyle = '#f5b5af'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText('SCAN', o.x, o.y - 58);
    } else {
      const pulse = Math.sin(t * 6 + o.id) * 3; ctx.shadowColor = '#e9e9f5'; ctx.shadowBlur = 19; ctx.strokeStyle = '#e8e9ed'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x, o.y, 13 + pulse, 0, Math.PI * 2); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#ededf0'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.fillText('✦', o.x, o.y + 6);
    }
  });
  ghost(ctx, 170, g.y, g.phased, t, g.invincible);
  ctx.fillStyle = '#e8e8e877'; ctx.font = '12px monospace'; ctx.textAlign = 'left'; ctx.fillText('CAM 03  •  SIGNAL UNSTABLE', 26, 30);
  ctx.textAlign = 'right'; ctx.fillStyle = '#ee514c'; ctx.fillText('● REC', W - 28, 30);
  ctx.strokeStyle = '#ffffff31'; ctx.strokeRect(12, 12, W - 24, H - 24);
  ctx.fillStyle = '#ffffff0d'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
}

export default function GhostGame() {
  const canvas = useRef<HTMLCanvasElement>(null), game = useRef<Game>(initial()), frame = useRef(0), previous = useRef(0), audio = useRef<AudioContext | null>(null);
  const [view, setView] = useState({ running: false, ended: false, won: false, time: 0, lives: 3, echoes: 0, energy: 100, phased: false });
  const sync = useCallback(() => { const g = game.current; setView({ running: g.running, ended: g.ended, won: g.won, time: g.time, lives: g.lives, echoes: g.echoes, energy: g.energy, phased: g.phased }); }, []);
  const cue = useCallback((kind: 'echo' | 'hit') => {
    const ac = audio.current; if (!ac || ac.state !== 'running') return;
    const oscillator = ac.createOscillator(), gain = ac.createGain(), now = ac.currentTime;
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(kind === 'echo' ? 520 : 120, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'echo' ? 890 : 45, now + .23);
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'echo' ? .085 : .13, now + .025); gain.gain.exponentialRampToValueAtTime(.0001, now + .3);
    oscillator.connect(gain).connect(ac.destination); oscillator.start(now); oscillator.stop(now + .31);
  }, []);
  const start = useCallback(() => { if (!audio.current) audio.current = new AudioContext(); audio.current.resume().catch(() => {}); game.current = initial(); game.current.running = true; previous.current = 0; sync(); canvas.current?.focus(); }, [sync]);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => { const g = game.current; if (['ArrowUp', 'ArrowDown', ' ', 'w', 's', 'W', 'S'].includes(e.key)) e.preventDefault(); if (e.key === ' ' || e.key === 'Shift') g.phaseHeld = true; if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') g.target = Math.max(70, g.target - 80); if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') g.target = Math.min(H - 65, g.target + 80); };
    const keyup = (e: KeyboardEvent) => { if (e.key === ' ' || e.key === 'Shift') game.current.phaseHeld = false; };
    window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup);
    return () => { window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); };
  }, []);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d'); if (!ctx) return;
    let lastSync = 0;
    const tick = (now: number) => {
      const dt = previous.current ? Math.min((now - previous.current) / 1000, .05) : 0; previous.current = now;
      const g = game.current;
      if (g.running) {
        g.time += dt; g.distance += dt * (105 + g.time * 1.1); g.y += (g.target - g.y) * Math.min(1, dt * 9);
        g.phased = g.phaseHeld && g.energy > 0; g.energy = Math.min(100, Math.max(0, g.energy + (g.phased ? -57 : 29) * dt));
        g.invincible = Math.max(0, g.invincible - dt); g.spawn -= dt;
        if (g.spawn <= 0) { const y = 95 + Math.random() * (H - 190); const kind = Math.random() < .57 ? 'beam' : 'echo'; g.things.push({ x: W + 40, y, kind, id: g.nextId++ }); g.spawn = .8 + Math.random() * .45; }
        g.things.forEach(o => {
          o.x -= dt * (245 + g.time * 2);
          if (o.taken || Math.abs(o.x - 170) > (o.kind === 'beam' ? 33 : 34) || Math.abs(o.y - g.y) > (o.kind === 'beam' ? 57 : 38)) return;
          if (o.kind === 'echo') { o.taken = true; g.echoes++; g.energy = Math.min(100, g.energy + 14); cue('echo'); }
          else if (!g.phased && g.invincible <= 0) { o.taken = true; g.lives--; g.invincible = 1.4; cue('hit'); }
        });
        g.things = g.things.filter(o => !o.taken && o.x > -100);
        if (g.lives <= 0 || g.time >= GOAL) { g.running = false; g.ended = true; g.won = g.time >= GOAL; g.phaseHeld = false; sync(); }
        if (now - lastSync > 100) { sync(); lastSync = now; }
      }
      render(ctx, g); frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame.current); audio.current?.close().catch(() => {}); audio.current = null; };
  }, [sync, cue]);
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => { const rect = e.currentTarget.getBoundingClientRect(); game.current.target = Math.max(65, Math.min(H - 65, (e.clientY - rect.top) / rect.height * H)); };
  return <div className="game-shell">
    <div className="game-hud"><div><small>SIGHTING TIME</small><strong>{Math.min(GOAL, Math.floor(view.time)).toString().padStart(2, '0')} / {GOAL}</strong></div><div><small>ECHOES FOUND</small><strong>{view.echoes.toString().padStart(2, '0')}</strong></div><div><small>GHOST SIGNAL</small><strong>{'♥'.repeat(view.lives)}{'♡'.repeat(3 - view.lives)}</strong></div><div className="energy-hud"><small>PHASE ENERGY</small><span><i style={{ width: `${view.energy}%` }} /></span></div></div>
    <div className="game-stage"><canvas ref={canvas} width={W} height={H} tabIndex={0} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={e => { if (e.buttons) move(e); }} aria-label="GhostSol city game. Move vertically with up and down keys or drag. Hold Space or Phase to disappear." />
      {!view.running && <div className="game-overlay"><span className="play-kicker">{view.ended ? (view.won ? 'THE CITY LOST YOU.' : 'THE CITY FOUND YOU.') : 'CAMERA FEED / LIVE'}</span><h2>{view.ended ? (view.won ? 'YOU SAW NOTHING.' : 'TRY TO VANISH.') : 'STAY UNSEEN.'}</h2><p>{view.ended ? `You found ${view.echoes} echoes and lasted ${Math.floor(view.time)} seconds.` : 'Survive 45 seconds. Collect echoes. Phase through the red searchlights.'}</p><button onClick={start}>{view.ended ? 'GO AGAIN ↗' : 'ENTER THE CITY ↗'}</button></div>}
    </div>
    <div className="game-controls"><div className="control-explain"><span>↑ ↓ / DRAG TO MOVE</span><span>HOLD SPACE / PHASE TO DISAPPEAR</span></div><button className={view.phased ? 'phase-button active' : 'phase-button'} onPointerDown={e => { e.preventDefault(); game.current.phaseHeld = true; }} onPointerUp={() => game.current.phaseHeld = false} onPointerCancel={() => game.current.phaseHeld = false} onPointerLeave={() => game.current.phaseHeld = false}>◌ HOLD TO PHASE</button></div>
  </div>;
}
