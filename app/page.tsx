'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Download, Mail, Send } from 'lucide-react';

interface Ripple { x: number; y: number; r: number; alpha: number; color: string; }

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

/* ========== SCROLL REVEAL WRAPPERS ========== */
const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
    className={className}
  >{children}</motion.div>
);

const RevealLeft = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
    className={className}
  >{children}</motion.div>
);

const RevealRight = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
    className={className}
  >{children}</motion.div>
);

/* ========== CUSTOM CURSOR ========== */
const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!canvas || !outer || !inner) return;
    const ctx = canvas.getContext('2d');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let ox = mx, oy = my;
    let particles: Ripple[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      inner.style.left = mx + 'px';
      inner.style.top = my + 'px';
      if (Math.hypot(mx - ox, my - oy) > 12) {
        for (let i = 0; i < 6; i++) {
          particles.push({ x: mx, y: my, r: 0, alpha: 0.35 + Math.random() * 0.25, color: Math.random() > 0.5 ? '245,183,0' : '19,62,124' });
        }
        ox = mx; oy = my;
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 14; i++) {
        particles.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.5 + Math.random() * 0.3, color: i % 2 === 0 ? '245,183,0' : '244,96,54' });
      }
    };

    const animCursor = () => { outer.style.left = mx + 'px'; outer.style.top = my + 'px'; requestAnimationFrame(animCursor); };
    animCursor();

    const animRipple = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0.01);
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${p.color},${p.alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
        p.r += 1.2 + Math.random() * 1.8; p.alpha *= 0.93;
      }
      requestAnimationFrame(animRipple);
    };
    animRipple();

    const hoverIn = () => document.body.classList.add('cursor-hover');
    const hoverOut = () => document.body.classList.remove('cursor-hover');
    const hoverEls = document.querySelectorAll('a, button, .btn, .glass, input, textarea, h1, h2, h3');
    hoverEls.forEach(el => { el.addEventListener('mouseenter', hoverIn); el.addEventListener('mouseleave', hoverOut); });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('resize', resize); document.removeEventListener('mousemove', onMove); document.removeEventListener('click', onClick); };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="ripple-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99990 }} />
      <div ref={outerRef} id="cursor-outer" />
      <div ref={innerRef} id="cursor-inner" />
      <style dangerouslySetInnerHTML={{ __html: `
        #cursor-outer { position:fixed;top:0;left:0;width:36px;height:36px;border-radius:50%;border:2px solid var(--gold);background:rgba(245,183,0,0.07);box-shadow:0 0 16px 4px rgba(245,183,0,0.25),inset 0 0 8px rgba(19,62,124,0.3);pointer-events:none;z-index:99999;transition:transform 0.12s cubic-bezier(.18,.89,.32,1.28),background 0.2s,box-shadow 0.2s;transform:translate(-50%,-50%);will-change:transform,left,top; }
        #cursor-inner { position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:var(--gold);pointer-events:none;z-index:100000;transform:translate(-50%,-50%);transition:transform 0.06s;will-change:left,top; }
        body.cursor-hover #cursor-outer { width:56px;height:56px;background:rgba(245,183,0,0.15);box-shadow:0 0 32px 10px rgba(245,183,0,0.4),0 0 0 2px var(--orange);border-color:var(--orange); }
        * { cursor: none !important; }
      ` }} />
    </>
  );
};

/* ========== NAVBAR ========== */
const Navbar = () => (
  <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000, padding: '0 5vw', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,17,31,0.72)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,183,0,0.10)' }}>
    <a href="#hero" className="font-playfair" style={{ fontWeight: 900, fontSize: '1.35rem', color: 'var(--gold)', letterSpacing: '0.01em', textDecoration: 'none', textShadow: '0 0 18px rgba(245,183,0,0.4)', whiteSpace: 'nowrap' }}>Bharath Raj</a>
    <ul style={{ display: 'flex', gap: 28, listStyle: 'none', alignItems: 'center' }} className="nav-links-hide-mobile">
      {['About', 'Skills', 'Experience', 'Projects', 'Research', 'Training', 'Contact'].map(item => (
        <li key={item}><a href={`#${item.toLowerCase()}`} style={{ color: 'rgba(240,243,248,0.7)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'color 0.2s' }}>{item}</a></li>
      ))}
    </ul>
    <div style={{ display: 'flex', gap: 12 }}>
      <a href="#" className="btn btn-outline">⬇ Download CV</a>
      <a href="#training" className="btn btn-gold">📅 Book Training</a>
    </div>
  </nav>
);

/* ========== SECTION HEADER ========== */
const SectionHeader = ({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) => (
  <div>
    <Reveal><div className="section-label">{label}</div></Reveal>
    <Reveal delay={0.1}><h2 className="section-title font-playfair" dangerouslySetInnerHTML={{ __html: title }} /></Reveal>
    {subtitle && <Reveal delay={0.2}><p className="section-sub">{subtitle}</p></Reveal>}
  </div>
);

/* ========== COUNTER ========== */
const Counter = ({ target, suffix }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  useEffect(() => {
    if (!isInView) return;
    let c = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      c = Math.min(c + step, target);
      setCount(c);
      if (c >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <span ref={ref}>{count}{suffix || ''}</span>;
};

/* ========== SKILL BAR ========== */
const SkillBar = ({ name, pct, gradient }: { name: string; pct: number; gradient: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: '0.88rem', fontWeight: 500 }}>
        <span>{name}</span><span style={{ color: 'var(--gold)' }}>{pct}%</span>
      </div>
      <div ref={ref} style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${pct}%` } : {}} transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }} style={{ height: '100%', borderRadius: 10, background: gradient }} />
      </div>
    </div>
  );
};

/* ========== INTERACTIVE PHOTO REVEAL ========== */
const InteractivePhotoReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRevealRef = useRef<HTMLCanvasElement>(null);
  const bwImgRef = useRef<HTMLImageElement | null>(null);
  const colorImgRef = useRef<HTMLImageElement | null>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const isHovering = useRef(false);
  const animFrame = useRef<number>(0);
  const currentRadius = useRef(0);

  const CIRCLE_RADIUS = 120;
  const FEATHER = 55;
  const COLOR_SCALE = 1.08;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRevealRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const bwImg = new Image();
    bwImg.src = `${basePath}/img/beforehover-removebg.png`;
    const colorImg = new Image();
    colorImg.src = `${basePath}/img/afterhover-removebg.png`;
    bwImgRef.current = bwImg;
    colorImgRef.current = colorImg;

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded >= 2) startRender();
    };
    bwImg.onload = onLoad;
    colorImg.onload = onLoad;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      mousePos.current = { x: -9999, y: -9999 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const startRender = () => {
      const render = () => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;

        if (canvas.width !== w * 2 || canvas.height !== h * 2) {
          canvas.width = w * 2;
          canvas.height = h * 2;
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
        }

        ctx.setTransform(2, 0, 0, 2, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // Draw B&W image (full)
        if (bwImgRef.current) {
          const img = bwImgRef.current;
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const containerAspect = w / h;
          let sw: number, sh: number, sx: number, sy: number;
          if (imgAspect > containerAspect) {
            sh = img.naturalHeight;
            sw = sh * containerAspect;
            sx = (img.naturalWidth - sw) / 2;
            sy = 0;
          } else {
            sw = img.naturalWidth;
            sh = sw / containerAspect;
            sx = 0;
            sy = (img.naturalHeight - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
        }

        // Animate circle radius
        const targetRadius = isHovering.current ? CIRCLE_RADIUS : 0;
        currentRadius.current += (targetRadius - currentRadius.current) * 0.12;

        // Draw color image with circular mask if hovering or transitioning
        if (currentRadius.current > 0.5 && colorImgRef.current) {
          const mx = mousePos.current.x;
          const my = mousePos.current.y;
          const r = currentRadius.current;
          const img = colorImgRef.current;

          ctx.save();

          // Create a radial gradient mask for soft circle edges
          const gradient = ctx.createRadialGradient(mx, my, Math.max(0, r - FEATHER), mx, my, r + FEATHER);
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(0.5, 'rgba(255,255,255,0.7)');
          gradient.addColorStop(0.85, 'rgba(255,255,255,0.2)');
          gradient.addColorStop(1, 'rgba(255,255,255,0)');

          // Use composite to mask
          ctx.globalCompositeOperation = 'source-over';

          // Draw color image scaled up slightly
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const containerAspect = w / h;
          let sw: number, sh: number, sx: number, sy: number;
          if (imgAspect > containerAspect) {
            sh = img.naturalHeight;
            sw = sh * containerAspect;
            sx = (img.naturalWidth - sw) / 2;
            sy = 0;
          } else {
            sw = img.naturalWidth;
            sh = sw / containerAspect;
            sx = 0;
            sy = (img.naturalHeight - sh) / 2;
          }

          // Draw to an offscreen canvas to apply mask
          const offscreen = document.createElement('canvas');
          offscreen.width = w * 2;
          offscreen.height = h * 2;
          const offCtx = offscreen.getContext('2d');
          if (offCtx) {
            offCtx.setTransform(2, 0, 0, 2, 0, 0);
            // Draw the circular gradient as mask shape
            offCtx.fillStyle = gradient;
            offCtx.fillRect(0, 0, w, h);

            // Use 'source-in' to clip the color image to the gradient
            offCtx.globalCompositeOperation = 'source-in';

            // Slightly zoom the color image
            const scaleOffset = (1 - COLOR_SCALE) / 2;
            offCtx.drawImage(
              img,
              sx, sy, sw, sh,
              w * scaleOffset,
              h * scaleOffset,
              w * COLOR_SCALE,
              h * COLOR_SCALE
            );

            // Draw offscreen result onto main canvas
            ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, w, h);
          }

          ctx.restore();
        }

        // Bottom fade for both images
        const fadeH = h * 0.28;
        const bottomGrad = ctx.createLinearGradient(0, h - fadeH, 0, h);
        bottomGrad.addColorStop(0, 'rgba(7,17,31,0)');
        bottomGrad.addColorStop(0.6, 'rgba(7,17,31,0.5)');
        bottomGrad.addColorStop(1, 'rgba(7,17,31,1)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, h - fadeH, w, fadeH);

        animFrame.current = requestAnimationFrame(render);
      };
      render();
    };

    return () => {
      cancelAnimationFrame(animFrame.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-photo-wrap"
      style={{
        width: 340,
        maxWidth: '42vw',
        aspectRatio: '340/420',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 28,
      }}
    >
      <canvas
        ref={canvasRevealRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          borderRadius: 28,
        }}
      />
      <div className="hero-float-badge badge-1">⚡ 5+ AI Projects</div>
      <div className="hero-float-badge badge-2">🔥 Currently Hiring</div>
    </div>
  );
};

/* ========== HERO ========== */
const Hero = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 90]);
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 6vw 60px', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-bg-orb" style={{ width: 520, height: 520, background: 'radial-gradient(circle,rgba(19,62,124,0.55) 0%,transparent 70%)', top: -80, right: '10vw' }} />
      <div className="hero-bg-orb" style={{ width: 340, height: 340, background: 'radial-gradient(circle,rgba(245,183,0,0.2) 0%,transparent 70%)', bottom: 60, left: '5vw' }} />
      <div className="hero-bg-orb" style={{ width: 220, height: 220, background: 'radial-gradient(circle,rgba(244,96,54,0.18) 0%,transparent 70%)', top: '50%', right: '25vw' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 60, flexWrap: 'wrap' }}>
        <motion.div style={{ flex: 1, minWidth: 300, y: yText }}>
          <Reveal><p className="hero-eyebrow">AI Engineer &amp; Data Scientist</p></Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-playfair" style={{ fontSize: 'clamp(2.8rem,5.5vw,5.2rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--light)', marginBottom: 8 }}>
              Bharath<br /><span style={{ color: 'var(--gold)' }}>Raj M.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 'clamp(1rem,2.2vw,1.5rem)', fontWeight: 300, color: 'rgba(240,243,248,0.7)', marginBottom: 20 }}>
              <strong style={{ color: 'var(--orange)', fontWeight: 600 }}>Full-Stack Python</strong> · AI/NLP · Data Science · <strong style={{ color: 'var(--orange)', fontWeight: 600 }}>Educator</strong>
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontSize: '1.05rem', color: 'rgba(240,243,248,0.55)', maxWidth: 480, marginBottom: 36, lineHeight: 1.8 }}>
              Building intelligent systems that transform raw data into strategic insight — from bank-grade AI dashboards to crime-solving NLP bots. Currently shaping the next generation of Python developers.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#projects" className="btn btn-gold">🚀 View Projects</a>
              <a href="#contact" className="btn btn-orange">📬 Get In Touch</a>
              <a href="#" className="btn btn-outline">⬇ Download CV</a>
            </div>
          </Reveal>
        </motion.div>
        <Reveal delay={0.3}>
          <div style={{ flex: '0 0 auto' }}>
            <InteractivePhotoReveal />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ========== ABOUT ========== */
const About = () => (
  <section id="about" style={{ padding: '100px 6vw' }}>
    <SectionHeader label="Who I Am" title='About <span>Me</span>' />
    <div className="about-grid">
      <RevealLeft>
        <div style={{ color: 'rgba(240,243,248,0.72)', fontSize: '1.02rem', lineHeight: 1.85 }}>
          <p style={{ marginBottom: 18 }}>I&apos;m <strong style={{ color: 'var(--gold)' }}>Bharath Raj M</strong>, an AI Engineer, Data Scientist, and Full-Stack Python Developer based in India. I bridge the gap between cutting-edge machine learning and production-grade software — building systems that are not just intelligent, but genuinely useful.</p>
          <p style={{ marginBottom: 18 }}>Currently driving AI innovation at <strong style={{ color: 'var(--orange)' }}>3Edge Solutions</strong>, I specialize in NLP, Deep Learning, Django-based backends, and React frontends. Beyond code, I&apos;m passionate about teaching — training aspiring developers in Python Full-Stack development.</p>
          <p style={{ marginBottom: 18 }}>My work spans from 800K-row public health datasets to predictive Power BI dashboards, always anchored in a belief that data should tell compelling, actionable stories.</p>
          <div style={{ marginTop: 28 }}><a href="#" className="btn btn-gold">⬇ Download Resume</a></div>
        </div>
      </RevealLeft>
      <RevealRight>
        <div className="about-stats">
          {[{ n: 5, l: 'AI Projects' }, { n: 3, l: 'Companies' }, { n: 100, l: 'Students Trained' }, { n: 800, l: 'K+ Dataset Rows' }].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.1}>
              <div className="stat-card glass">
                <div className="stat-num font-playfair"><Counter target={s.n} /></div>
                <div className="stat-label">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </RevealRight>
    </div>
  </section>
);

/* ========== SKILLS ========== */
const Skills = () => (
  <section id="skills" style={{ padding: '100px 6vw' }}>
    <SectionHeader label="Expertise" title='Technical <span>Skills</span>' />
    <div className="skills-grid">
      <RevealLeft>
        <div className="glass" style={{ padding: '36px 32px' }}>
          <div className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} /> Data Science &amp; AI
          </div>
          {[['Machine Learning / Deep Learning', 92], ['NLP / BERT / Transformers', 88], ['Data Analysis & Visualization', 90], ['Power BI / Tableau', 85], ['Python (Pandas, NumPy, Sklearn)', 95], ['Knowledge Graphs', 78]].map(([n, p]) => (
            <SkillBar key={n as string} name={n as string} pct={p as number} gradient="linear-gradient(90deg,var(--gold),var(--orange))" />
          ))}
        </div>
      </RevealLeft>
      <RevealRight>
        <div className="glass" style={{ padding: '36px 32px' }}>
          <div className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)' }} /> Full-Stack Python (Teaching)
          </div>
          {[['Django / DRF', 93], ['React / JavaScript', 87], ['PostgreSQL / MySQL', 88], ['REST APIs / Integration', 91], ['Git / Docker / Deployment', 82], ['Teaching / Curriculum Design', 96]].map(([n, p]) => (
            <SkillBar key={n as string} name={n as string} pct={p as number} gradient="linear-gradient(90deg,#133e7c,#1e5fba)" />
          ))}
        </div>
      </RevealRight>
    </div>
  </section>
);

/* ========== EXPERIENCE ========== */
const Experience = () => (
  <section id="experience" style={{ padding: '100px 6vw' }}>
    <SectionHeader label="Career Path" title='Experience &amp; <span>Journey</span>' subtitle="From global giants to agile startups — each role sharpened my edge in AI and full-stack development." />
    <div className="timeline">
      {[
        { company: '3Edge Solutions', role: 'AI Engineer & Full-Stack Developer', date: 'Oct 13, 2025 – Present', desc: 'Building production-grade AI systems including a Bank Office AI Dashboard with DeepSeek-powered sentiment analysis, auto-scoring engine, and employee performance insights.', current: true },
        { company: 'Prochant', role: 'Data Analyst / Python Developer', date: '2023 – 2025', desc: 'Led data pipeline development, created advanced Power BI dashboards for healthcare analytics, and built predictive models.' },
        { company: 'Accenture', role: 'Technology Analyst', date: '2022 – 2023', desc: 'Contributed to large-scale enterprise technology solutions. Gained hands-on experience in agile delivery and cross-functional team collaboration.' },
        { company: 'TATA', role: 'Junior Data Engineer', date: '2021 – 2022', desc: 'Worked on enterprise data engineering pipelines, ETL processes, and foundational ML model deployment.' },
      ].map((item, i) => (
        <Reveal key={i} delay={i * 0.15}>
          <div className={`tl-item ${item.current ? 'current' : ''}`}>
            <div className="tl-dot" />
            <div className={`tl-card glass ${item.current ? 'current-card' : ''}`}>
              <div className="tl-header">
                <div className="tl-company font-playfair">{item.company}</div>
                <span className={`tl-badge ${item.current ? 'badge-current' : 'badge-past'}`}>{item.current ? '● Current' : 'Past'}</span>
              </div>
              <div className="tl-role">{item.role}</div>
              <div className="tl-date">📅 {item.date}</div>
              <div className="tl-desc">{item.desc}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ========== PROJECTS ========== */
const Projects = () => {
  const [tab, setTab] = useState('ai');
  const projects: Record<string, Array<{ tag: string; title: string; desc: string; metrics: string[]; tech: string[] }>> = {
    ai: [
      { tag: '🏦 AI Dashboard', title: 'Bank Office AI Dashboard', desc: 'Internal bank portal for customer queries, lost-card processing, and chequebook requests. DeepSeek-powered sentiment analysis drives automatic customer scoring, delay prioritization, and employee performance evaluation.', metrics: ['↑ Auto-Scoring', '📈 Priority Queue', '👔 Perf Analytics'], tech: ['Django', 'DRF', 'React', 'DeepSeek', 'NLP', 'PostgreSQL'] },
      { tag: '⚖️ NLP / Knowledge Graph', title: 'Crime Lawyer Bot', desc: 'An intelligent legal assistant leveraging BERT embeddings and Knowledge Graphs to help lawyers find case precedents and retrieve relevant legal sections with high accuracy.', metrics: ['+30% Accuracy', '-25% Search Time'], tech: ['BERT', 'Knowledge Graph', 'Python', 'Neo4j', 'FastAPI'] },
    ],
    fullstack: [
      { tag: '🏦 Flagship Full-Stack AI Project', title: 'Bank Office AI Dashboard — Full-Stack Showcase', desc: 'The complete production-grade full-stack implementation. Django REST Framework backend powers an intelligent bank portal, while React handles a real-time, role-based frontend. DeepSeek AI provides sentiment & intent analysis.', metrics: ['Role-Based Auth', 'Real-Time Analytics', 'AI-Powered Scoring', 'REST API'], tech: ['Django', 'DRF', 'React', 'DeepSeek LLM', 'PostgreSQL', 'Redis', 'JWT Auth', 'Docker'] },
    ],
    bi: [
      { tag: '🎬 Business Intelligence', title: 'Cinemetrics Predictive Power BI Dashboard', desc: 'A cinematic industry intelligence platform that uses predictive modeling to forecast box office performance, ROI probabilities, and market timing windows.', metrics: ['+40% Forecast Accuracy', '+30% Investment Outcomes', '25% Faster Insights'], tech: ['Power BI', 'Python', 'Predictive Modeling', 'DAX', 'Pandas'] },
    ],
  };
  return (
    <section id="projects" style={{ padding: '100px 6vw' }}>
      <SectionHeader label="Portfolio" title='Featured <span>Projects</span>' subtitle="Across AI, Full-Stack, and Business Intelligence — each project is a real-world problem solved with precision." />
      <div className="tabs">
        {[{ id: 'ai', l: '🤖 AI & NLP' }, { id: 'fullstack', l: '⚡ Full-Stack' }, { id: 'bi', l: '📊 BI & Dashboards' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>{t.l}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="projects-grid">
          {projects[tab].map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="project-card glass">
                <div className="proj-tag">{p.tag}</div>
                <div className="proj-title font-playfair">{p.title}</div>
                <div className="proj-desc">{p.desc}</div>
                <div className="proj-metrics">{p.metrics.map(m => <span key={m} className="metric-chip">{m}</span>)}</div>
                <div className="proj-tech">{p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
                <div className="proj-actions">
                  <a href="#" className="btn btn-gold" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>🔍 View Case Study</a>
                  <a href="#" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>🌐 Live Demo</a>
                  <a href="#" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>⭐ GitHub</a>
                </div>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

/* ========== RESEARCH ========== */
const Research = () => (
  <section id="research" style={{ padding: '100px 6vw' }}>
    <SectionHeader label="Research & Insights" title='Data <span>Research</span>' subtitle="Deep-dive research projects on real-world datasets — revealing hidden patterns that shape policy, industry, and society." />
    <div className="research-grid">
      {[
        { tag: '🏥 Public Health | 800K Rows', tagColor: 'rgba(244,96,54,0.12)', tagTextColor: 'var(--orange)', tagBorder: 'rgba(244,96,54,0.3)', title: 'Public Health Insights — USA', meta: '800,000+ rows · Real-Time Analysis · Multi-State Study', desc: 'Comprehensive analysis of US public health data to uncover patterns in chronic diseases, vaccination impact, and healthcare access metrics.', questions: ['How do age and income correlate with chronic disease prevalence?', "What is vaccination's impact on state-level hospitalization rates?", 'What are the strongest lifestyle predictors of obesity?', 'What hidden high-risk clusters emerge through PCA?', 'How did post-2020 health policies affect access metrics?'], skills: ['800K Sampling', 'PCA', 'Feature Engineering', 'Statistical Tests', 'Interactive Dashboards'], insight: 'Clear hidden risk clusters identified for targeted policy intervention across 15 states.', insightColor: 'var(--gold)', insightBg: 'rgba(245,183,0,0.08)', insightBorder: 'var(--gold)' },
        { tag: '🚗 EV Adoption | 200K+ Rows', tagColor: 'rgba(19,62,124,0.25)', tagTextColor: '#4d9de0', tagBorder: 'rgba(19,62,124,0.5)', title: 'Electric Vehicle Adoption — Washington', meta: '200,000+ rows · Time-Series · County-Level Analysis', desc: 'In-depth study of EV adoption patterns across Washington state, combining demographic data, infrastructure metrics, and vehicle specifications.', questions: ['What are the primary drivers of EV adoption by county?', 'How does charging station density affect sales volumes?', 'What vehicle attributes (range, price, brand) are strongest predictors?', 'What does the 2026 EV market forecast look like after preprocessing?', 'What demographic and infrastructure patterns are hidden in the data?'], skills: ['Heavy Sampling', 'Multicollinearity Fix', 'Time-Series', 'Forecasting', 'Geospatial Viz'], insight: 'Actionable recommendations for EV manufacturers and government infrastructure investment planning.', insightColor: '#4d9de0', insightBg: 'rgba(19,62,124,0.15)', insightBorder: '#4d9de0' },
      ].map((card, i) => (
        <motion.div key={i} className="research-card glass"
          initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="proj-tag" style={{ background: card.tagColor, color: card.tagTextColor, borderColor: card.tagBorder }}>{card.tag}</div>
          <div className="research-title font-playfair">{card.title}</div>
          <div className="research-meta">{card.meta}</div>
          <p style={{ color: 'rgba(240,243,248,0.6)', fontSize: '0.87rem', marginBottom: 16 }}>{card.desc}</p>
          <ol className="rq-list">{card.questions.map((q, j) => <li key={j}>{q}</li>)}</ol>
          <div className="skills-shown">{card.skills.map(s => <span key={s} className="tech-tag">{s}</span>)}</div>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: card.insightBg, borderLeft: `3px solid ${card.insightBorder}`, fontSize: '0.83rem', color: 'rgba(240,243,248,0.65)', marginBottom: 20 }}>
            💡 <strong style={{ color: card.insightColor }}>Key Insight:</strong> {card.insight}
          </div>
          <div className="proj-actions">
            <a href="#" className="btn btn-gold" style={{ fontSize: '0.75rem', padding: '8px 18px' }}>🔍 View Case Study</a>
            <a href="#" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>⭐ GitHub</a>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ========== TRAINING ========== */
const Training = () => (
  <section id="training" style={{ padding: '100px 6vw' }}>
    <SectionHeader label="Education & Mentorship" title='Training <span>Highlights</span>' subtitle="Passionate about building the next generation of Python full-stack developers." />
    <div className="training-grid">
      <RevealLeft>
        <div className="glass" style={{ padding: '32px 28px' }}>
          <h3 className="font-playfair" style={{ fontSize: '1.2rem', marginBottom: 22, color: 'var(--gold)' }}>What I Teach</h3>
          {['Python fundamentals to advanced OOP, decorators & design patterns', 'Django & Django REST Framework — from models to production APIs', 'React frontend development with state management & hooks', 'PostgreSQL database design, query optimization & migrations', 'Deployment pipelines with Docker, Nginx, and cloud platforms', 'Git workflows, code review practices, and team collaboration', 'AI/ML integration into full-stack applications', 'Real-world project building with portfolio-grade deliverables'].map(t => (
            <div key={t} className="training-item">{t}</div>
          ))}
        </div>
      </RevealLeft>
      <div>
        <RevealRight>
          <div className="glass" style={{ padding: '32px 28px', marginBottom: 24, border: '1px solid rgba(245,183,0,0.3)', background: 'rgba(245,183,0,0.05)' }}>
            <div className="current-batch"><div className="live-dot" /> Currently Active: Python Full-Stack Batch</div>
            <p style={{ color: 'rgba(240,243,248,0.65)', fontSize: '0.9rem', marginBottom: 20 }}>Actively training a live cohort in Python Full-Stack Development. Students build real-world Django + React projects from day one.</p>
            <a href="#contact" className="btn btn-gold">📅 Book Your Seat</a>
          </div>
        </RevealRight>
        <RevealRight delay={0.2}>
          <div className="glass" style={{ padding: '28px 26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              {[{ n: '100+', l: 'Students Trained', c: 'var(--gold)' }, { n: '3+', l: 'Batches Completed', c: 'var(--orange)' }, { n: '95%', l: 'Placement Rate', c: '#4d9de0' }].map(s => (
                <div key={s.l}>
                  <div className="font-playfair" style={{ fontSize: '2.5rem', fontWeight: 900, color: s.c }}>{s.n}</div>
                  <div style={{ color: 'rgba(240,243,248,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealRight>
      </div>
    </div>
    <div className="section-divider" style={{ margin: '60px 0 0' }} />
    <div style={{ marginTop: 60 }}>
      <SectionHeader label="Academic Background" title="Education" />
      <Reveal delay={0.2}>
        <div className="edu-card glass" style={{ maxWidth: 680 }}>
          <div className="edu-icon">🎓</div>
          <div>
            <div className="edu-degree font-playfair">Bachelor of Engineering — Computer Science</div>
            <div className="edu-school">Anna University / Affiliated College, Tamil Nadu</div>
            <div className="edu-year">📅 Graduated 2021 · GPA: 8.4 / 10</div>
            <p style={{ color: 'rgba(240,243,248,0.5)', fontSize: '0.85rem', marginTop: 10 }}>Specialization in Data Structures, Algorithms, Database Systems, and Software Engineering.</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ========== CONTACT ========== */
const Contact = () => (
  <section id="contact" style={{ padding: '100px 6vw 60px' }}>
    <SectionHeader label="Let&apos;s Connect" title='Get In <span>Touch</span>' />
    <div className="contact-grid">
      <RevealLeft>
        <div>
          <p style={{ color: 'rgba(240,243,248,0.6)', marginBottom: 28, fontSize: '0.98rem' }}>Whether you&apos;re looking to collaborate on an AI project, hire a full-stack developer, or book a Python training session — I&apos;d love to hear from you.</p>
          <div className="contact-links">
            {[
              { icon: '📧', text: 'bharathraj@example.com', href: 'mailto:bharathraj@example.com' },
              { icon: '💼', text: 'linkedin.com/in/bharathrajm' },
              { icon: '⭐', text: 'github.com/bharathrajm' },
              { icon: '🐦', text: '@bharathrajm' },
              { icon: '📍', text: 'Chennai, Tamil Nadu, India' },
            ].map(l => (
              <a key={l.text} href={l.href || '#'} className="contact-link">
                <div className="contact-link-icon">{l.icon}</div>{l.text}
              </a>
            ))}
          </div>
        </div>
      </RevealLeft>
      <RevealRight>
        <div className="glass" style={{ padding: '36px 32px' }}>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <div className="form-row">
              <input className="form-input" type="text" placeholder="Your Name" />
              <input className="form-input" type="email" placeholder="Your Email" />
            </div>
            <input className="form-input" type="text" placeholder="Subject — Project / Training / Hire" />
            <textarea className="form-input" placeholder="Tell me about your project or inquiry..." />
            <button className="btn btn-gold" style={{ fontSize: '0.9rem', padding: '14px 28px', width: 'fit-content' }}>🚀 Send Message</button>
          </form>
        </div>
      </RevealRight>
    </div>
  </section>
);

/* ========== FOOTER ========== */
const FooterBar = () => (
  <footer style={{ textAlign: 'center', padding: '30px 6vw', borderTop: '1px solid rgba(245,183,0,0.1)', color: 'rgba(240,243,248,0.35)', fontSize: '0.82rem' }}>
    <p style={{ marginBottom: 10 }}><span style={{ color: 'var(--gold)' }}>Bharath Raj M</span> · AI Engineer · Data Scientist · Python Educator · Chennai, India</p>
    <p>Made with ❤️ &amp; <span style={{ color: 'var(--gold)' }}>bolt.new</span> | Custom cursor &amp; ripple by <span style={{ color: 'var(--gold)' }}>Grok</span> | © {new Date().getFullYear()} All Rights Reserved</p>
  </footer>
);

/* ========== DIVIDER ========== */
const Divider = () => <div className="section-divider" />;

/* ========== APP ========== */
export default function App() {
  return (
    <div>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Skills />
      <Divider />
      <Experience />
      <Divider />
      <Projects />
      <Divider />
      <Research />
      <Divider />
      <Training />
      <Divider />
      <Contact />
      <FooterBar />
    </div>
  );
}