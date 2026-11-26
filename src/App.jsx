import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createScene } from './scene.js';
import {
  PROFILE, ABOUT, SKILLS, STATS, MARQUEE, TECH_CLOUD, SERVICES, PROJECTS, FILTERS, bookDemoUrl,
} from './data.js';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Icons ---------------- */
const ICONS = {
  web: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
  brain: 'M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 3 4 3 3 0 0 0 5 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-3 4 3 3 0 0 1-5 1',
  mobile: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  chat: 'M4 5h16v10H9l-5 4zM8 10h.01M12 10h.01M16 10h.01',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  devices: 'M2 6h13v10H2zM6 20h5M18 8h4v12h-4z',
  phone: 'M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z',
  pin: 'M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  close: 'M6 6l12 12M18 6 6 18',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  linkedin: 'M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v2c.6-1.2 2-2.2 4-2.2 3 0 4 2 4 5V20h-4v-5.5c0-1.4-.5-2.4-1.8-2.4S14 13.2 14 14.5V20h-4z',
  github: 'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z',
};
function Icon({ name, size = 20, fill = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'}
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ---------------- Hooks ---------------- */
// Reveals [data-reveal] elements as they scroll in, including ones mounted later
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const seen = new WeakSet(); // per-run, so React StrictMode's double effect run in dev re-observes everything
    const scan = () => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

function tilt(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
  el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
  el.style.setProperty('--gx', `${x * 100}%`);
  el.style.setProperty('--gy', `${y * 100}%`);
}
function untilt(e) {
  const el = e.currentTarget;
  el.style.setProperty('--ry', '0deg');
  el.style.setProperty('--rx', '0deg');
}

/* ---------------- Background 3D canvas ---------------- */
function SceneCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    let api;
    try { api = createScene(ref.current, { reducedMotion: prefersReduced() }); }
    catch (err) { console.warn('WebGL unavailable', err); return; }
    const onScroll = () => api.setScroll(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const sections = document.querySelectorAll('[data-shift]');
    const sectionIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) api.setShift(parseFloat(e.target.dataset.shift)); }),
      { threshold: 0.35 }
    );
    sections.forEach((s) => sectionIO.observe(s));
    return () => { window.removeEventListener('scroll', onScroll); sectionIO.disconnect(); api.dispose(); };
  }, []);
  // Inline size so the canvas is full-screen even before styles.css has loaded
  return (
    <canvas ref={ref} className="scene" aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['contact', 'Contact']];
  return (
    <header className={`nav ${solid ? 'solid' : ''} ${open ? 'open' : ''}`}>
      <a href="#top" className="logo" onClick={() => setOpen(false)}>
        <span className="logo-orb" aria-hidden="true" /><span>{PROFILE.name.toLowerCase()}<b>.</b></span>
      </a>
      <nav id="primary-nav" aria-label="Primary">
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="btn btn-sm btn-rose" href={bookDemoUrl()} target="_blank" rel="noreferrer">Book demo</a>
      </nav>
      <button className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
        <Icon name={open ? 'close' : 'menu'} size={22} />
      </button>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="hero" id="top" data-shift="0">
      <div className="hero-copy">
        <p className="hero-role" data-reveal>{PROFILE.role}</p>
        <h1 className="hero-name" data-reveal aria-label={PROFILE.name}>
          {PROFILE.name.split('').map((ch, i) => (
            <span key={i} style={{ '--i': i }} aria-hidden="true">{ch}</span>
          ))}
        </h1>
        <p className="hero-tag" data-reveal>{PROFILE.tagline}</p>
        <p className="hero-intro" data-reveal>{PROFILE.intro}</p>
        <div className="hero-cta" data-reveal>
          <a className="btn btn-rose" href="#contact">Contact me <Icon name="arrow" size={18} /></a>
          <a className="btn btn-ghost" href="#work">View work</a>
        </div>
      </div>
      <div className="hero-foot">
        <a href="#about" className="scroll-cue"><span />Scroll down</a>
        <div className="socials">
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" fill size={18} /></a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" fill size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    // The wrapper clips the tilted band so it can never make the page wider than the screen
    <div className="marquee-wrap">
      <div className="marquee" aria-label="Core technologies">
        <div className="marquee-track">
          {row.map((t, i) => (<span key={i}>{t}<i aria-hidden="true">✦</i></span>))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */
function Counter({ value, suffix }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (prefersReduced()) { setN(value); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// Skill ring: fills from 0 to its value every time it scrolls into view, and resets when it leaves
function Gauge({ label, value }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (prefersReduced()) { setN(value); return; }
    let raf = 0;
    const animate = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1800, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) animate();
      else { cancelAnimationFrame(raf); setN(0); }
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return (
    <div className="gauge" ref={ref} style={{ '--v': n }} data-reveal>
      <div className="gauge-ring" role="img" aria-label={`${label} ${value}%`}><i aria-hidden="true" /><span aria-hidden="true">{n}%</span></div>
      <p>{label}</p>
    </div>
  );
}

function TechSphere() {
  const wrap = useRef(null);
  const items = useRef([]);
  useEffect(() => {
    const N = TECH_CLOUD.length;
    const pts = TECH_CLOUD.map((_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    let ax = 0.3, ay = 0, vx = 0.0015, vy = 0.004, drag = null, raf;
    const reduced = prefersReduced();
    const render = () => {
      const R = (wrap.current?.clientWidth || 320) * 0.4;
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      pts.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const s = 0.62 + (z2 + 1) * 0.3;
        const el = items.current[i];
        if (!el) return;
        el.style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px,${y2 * R}px,0) scale(${s})`;
        el.style.opacity = (0.25 + (z2 + 1) * 0.375).toFixed(2);
        el.style.zIndex = Math.round((z2 + 1) * 50);
        el.classList.toggle('front', z2 > 0.55);
      });
    };
    const loop = () => {
      if (!drag) { ay += vy; ax += vx; vy += (0.004 - vy) * 0.02; vx += (0.0015 - vx) * 0.02; }
      render();
      raf = requestAnimationFrame(loop);
    };
    const down = (e) => { drag = { x: e.clientX, y: e.clientY }; wrap.current.setPointerCapture(e.pointerId); };
    const move = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      ay += dx * 0.008; ax -= dy * 0.008; vy = dx * 0.002; vx = -dy * 0.002;
      drag = { x: e.clientX, y: e.clientY };
      if (reduced) render();
    };
    const up = () => { drag = null; };
    const el = wrap.current;
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    if (reduced) render(); else loop();
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
  }, []);
  return (
    <div className="sphere" ref={wrap} role="img" aria-label={`Technologies: ${TECH_CLOUD.join(', ')}`}>
      <div className="sphere-glow" aria-hidden="true" />
      {TECH_CLOUD.map((t, i) => (
        <span key={t} ref={(n) => (items.current[i] = n)} aria-hidden="true">{t}</span>
      ))}
      <p className="sphere-hint" aria-hidden="true">Drag to spin</p>
    </div>
  );
}

function About() {
  return (
    <section className="band about" id="about" data-shift="0.15">
      <div className="wrap about-grid">
        <div className="about-text">
          <p className="kicker" data-reveal>About me</p>
          <h2 data-reveal>Engineer for founders who move fast.</h2>
          {ABOUT.map((p, i) => <p key={i} data-reveal>{p}</p>)}
        </div>
        <div className="about-side">
          <TechSphere />
          <div className="skills" aria-label="My skills">
            {SKILLS.map((s) => <Gauge key={s.label} {...s} />)}
          </div>
        </div>
      </div>
      <div className="wrap stats" data-reveal>
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <strong><Counter value={s.value} suffix={s.suffix} /></strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Services: 3D carousel ring ---------------- */
function Services() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [wide, setWide] = useState(true);
  const N = SERVICES.length;
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const on = () => setWide(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    if (!wide || paused || prefersReduced()) return;
    const t = setInterval(() => setActive((a) => (a + 1) % N), 4800);
    return () => clearInterval(t);
  }, [wide, paused, N]);
  const go = (d) => setActive((a) => (a + d + N) % N);
  const step = 360 / N;
  return (
    <section className="band services" id="services" data-shift="0.5">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Services</p>
            <h2 data-reveal>What I build with you.</h2>
          </div>
          <p data-reveal>I provide the best services to ensure that the end-to-end journey with products meets desired outcomes and identifies new opportunities to create better user experiences.</p>
        </div>
        {wide ? (
          <div className="ring-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}>
            <div className="ring" style={{ transform: `translateZ(-420px) rotateY(${-active * step}deg)` }}>
              {SERVICES.map((s, i) => {
                const dist = Math.min(Math.abs(i - active), N - Math.abs(i - active));
                return (
                  <article key={s.title} className={`svc ${i === active ? 'is-active' : ''}`}
                    style={{ transform: `rotateY(${i * step}deg) translateZ(420px)`, opacity: dist === 0 ? 1 : dist === 1 ? 0.45 : 0.16 }}
                    onClick={() => setActive(i)} aria-hidden={i !== active}>
                    <div className="svc-icon"><Icon name={s.icon} size={26} /></div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </article>
                );
              })}
            </div>
            <div className="ring-controls">
              <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous service"><Icon name="left" /></button>
              <div className="dots" role="tablist" aria-label="Services">
                {SERVICES.map((s, i) => (
                  <button key={s.title} role="tab" aria-selected={i === active} aria-label={s.title}
                    className={i === active ? 'on' : ''} onClick={() => setActive(i)} />
                ))}
              </div>
              <button className="icon-btn" onClick={() => go(1)} aria-label="Next service"><Icon name="right" /></button>
            </div>
          </div>
        ) : (
          <div className="svc-list">
            {SERVICES.map((s) => (
              <article key={s.title} className="svc tilt" data-reveal onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="svc-icon"><Icon name={s.icon} size={26} /></div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Work ---------------- */
function Orb({ hue, seed }) {
  const [a, b] = hue;
  const lines = 7;
  return (
    <svg className="orb" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id={`g-${seed}`} cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor={`hsl(${a} 95% 70%)`} />
          <stop offset=".55" stopColor={`hsl(${b} 90% 45%)`} />
          <stop offset="1" stopColor="#07070a" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="58" fill={`url(#g-${seed})`} />
      <g className="orb-wire" style={{ transformOrigin: '100px 100px', transform: `rotate(${(seed * 37) % 60 - 30}deg)` }}>
        {Array.from({ length: lines }, (_, i) => {
          const ry = 58 * Math.abs(Math.cos((i / lines) * Math.PI));
          return <ellipse key={`h${i}`} cx="100" cy="100" rx="58" ry={Math.max(ry, 1)} fill="none" stroke="rgba(220,227,234,.28)" strokeWidth=".7" />;
        })}
        {Array.from({ length: lines }, (_, i) => {
          const rx = 58 * Math.abs(Math.cos((i / lines) * Math.PI));
          return <ellipse key={`v${i}`} cx="100" cy="100" rx={Math.max(rx, 1)} ry="58" fill="none" stroke="rgba(220,227,234,.18)" strokeWidth=".7" />;
        })}
      </g>
      <ellipse cx="100" cy="100" rx="88" ry="22" fill="none" stroke={`hsl(${b} 95% 65%)`} strokeWidth="1.2" opacity=".8"
        transform={`rotate(${-18 + (seed % 4) * 9} 100 100)`} />
      <circle cx={100 + 88 * Math.cos(seed)} cy={100 + 22 * Math.sin(seed)} r="3" fill={`hsl(${a} 100% 80%)`}
        transform={`rotate(${-18 + (seed % 4) * 9} 100 100)`} />
    </svg>
  );
}

// Real project screenshot inside a themed browser window. Falls back to the orb art if the image ever fails.
function Shot({ p, seed, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (failed || !p.image) return <Orb hue={p.hue} seed={seed} />;
  return (
    <figure className="shot">
      <div className="shot-bar" aria-hidden="true"><i /><i /><i /><span>{p.host}</span></div>
      <img src={p.image} alt={`${p.title} screenshot`} width="800" height="500"
        loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
    </figure>
  );
}

const KIND_LABEL = { ai: 'AI product', platform: 'Platform', oss: 'Open source' };

// One row of tags: shows as many as fit the card's width, then a "+N" chip for the rest,
// so every card's tag row is the same height and lines up with its neighbours.
function FitTags({ items }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ul = ref.current;
    const fit = () => {
      const tags = [...ul.querySelectorAll('li.t')];
      const more = ul.querySelector('li.more');
      tags.forEach((li) => { li.hidden = false; });
      more.hidden = true;
      if (ul.scrollWidth <= ul.clientWidth) return;
      more.hidden = false;
      let hiddenCount = 0;
      for (let i = tags.length - 1; i > 0 && ul.scrollWidth > ul.clientWidth; i--) {
        tags[i].hidden = true;
        hiddenCount++;
        more.textContent = `+${hiddenCount}`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(ul);
    document.fonts?.ready.then(fit); // re-fit once the web font has loaded and widths change
    return () => ro.disconnect();
  }, [items]);
  return (
    <ul className="tags tags-one" ref={ref}>
      {items.map((t) => <li key={t} className="t">{t}</li>)}
      <li className="more" hidden />
    </ul>
  );
}

function ProjectCard({ p, index, onOpen }) {
  return (
    <article className="card tilt" data-reveal style={{ '--d': `${(index % 3) * 80}ms` }}
      onPointerMove={tilt} onPointerLeave={untilt}>
      <button className="card-hit" onClick={() => onOpen(p)} aria-label={`Open ${p.title} details`} />
      <div className="card-cover" style={{ '--ha': p.hue[0], '--hb': p.hue[1] }}>
        <Shot p={p} seed={index + 1} />
        <span className="chip">{KIND_LABEL[p.kind]}</span>
      </div>
      <div className="card-body">
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <FitTags items={p.stack} />
        <div className="card-foot">
          <span className="read">Case study <Icon name="arrow" size={16} /></span>
          {p.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="card-link">
              {l.label} <Icon name="ext" size={14} />
            </a>
          ))}
        </div>
      </div>
      <div className="glare" aria-hidden="true" />
    </article>
  );
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);
  return (
    <dialog ref={ref} className="pdialog" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {project && (
        <div className="pd-inner">
          <button className="icon-btn pd-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
          <div className="pd-shot" style={{ '--ha': project.hue[0], '--hb': project.hue[1] }}>
            <Shot p={project} seed={PROJECTS.indexOf(project) + 1} eager />
          </div>
          <div className="pd-head">
            <div>
              <span className="chip">{KIND_LABEL[project.kind]}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
          </div>
          <p className="pd-detail">{project.detail}</p>
          <h4>Core capabilities</h4>
          <ul className="pd-feats">{project.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <h4>Technologies</h4>
          <ul className="tags">{project.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="pd-links">
            {project.links.map((l) => (
              <a key={l.url} className="btn btn-rose" href={l.url} target="_blank" rel="noreferrer">{l.label} <Icon name="ext" size={16} /></a>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}

function Work() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const list = useMemo(() => PROJECTS.filter((p) => filter === 'all' || p.kind === filter), [filter]);
  const count = (id) => (id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.kind === id).length);
  return (
    <section className="band work" id="work" data-shift="1">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Recent works</p>
            <h2 data-reveal>Selected projects.</h2>
          </div>
          <p data-reveal>A showcase of AI products, platforms, and open-source systems I've designed, engineered, and shipped.</p>
        </div>
        <div className="filters" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} className={filter === f.id ? 'on' : ''}
              onClick={() => setFilter(f.id)}>
              {f.label}<sup>{count(f.id)}</sup>
            </button>
          ))}
        </div>
        <div className="grid" key={filter}>
          {list.map((p) => <ProjectCard key={p.id} p={p} index={PROJECTS.indexOf(p)} onOpen={setOpen} />)}
        </div>
      </div>
      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Project inquiry from ${f.get('name')}`;
    const body = `${f.get('message')}\n\n${f.get('name')}\n${f.get('email')}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  return (
    <section className="band contact" id="contact" data-shift="0.3">
      <div className="wrap contact-grid">
        <div>
          <p className="kicker" data-reveal>Keep in touch</p>
          <h2 data-reveal>Got a project? Let's talk.</h2>
          <p className="lead" data-reveal>Please don't hesitate to contact me in order to transform your ideas into tangible products and ultimately facilitate profitable outcomes.</p>
          <ul className="info">
            <li data-reveal><span className="info-ic"><Icon name="phone" /></span><div><small>Phone</small><a href={`tel:${PROFILE.phone.replace(/[^+\d]/g, '')}`}>{PROFILE.phone}</a></div></li>
            <li data-reveal><span className="info-ic"><Icon name="pin" /></span><div><small>Address</small><span>{PROFILE.address}</span></div></li>
            <li data-reveal><span className="info-ic"><Icon name="mail" /></span><div><small>Email</small><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></div>
              <button className="copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></li>
          </ul>
          <div className="contact-cta" data-reveal>
            <a className="btn btn-ghost" href={bookDemoUrl()} target="_blank" rel="noreferrer">Book a demo call <Icon name="arrow" size={18} /></a>
          </div>
        </div>
        <form className="form tilt" onSubmit={submit} data-reveal onPointerMove={tilt} onPointerLeave={untilt}>
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" required autoComplete="name" placeholder="Your name" />
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
          <label htmlFor="cf-msg">Message</label>
          <textarea id="cf-msg" name="message" rows="5" required placeholder="Tell me what you're building" />
          <button className="btn btn-rose btn-block" type="submit">Send request <Icon name="arrow" size={18} /></button>
          {sent && <p className="form-note" role="status">Your email app should open with the message ready. If it doesn't, write to {PROFILE.email}.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="footer-big" aria-hidden="true">Let's build something.</p>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved</span>
          <div className="socials">
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" fill size={18} /></a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" fill size={18} /></a>
          </div>
          <span>Crafted with care and lots of coffee</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <SceneCanvas />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
