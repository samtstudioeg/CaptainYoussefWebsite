'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { heroData } from '@/data/heroData';

/* ─── Animated Counter ────────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Word-by-word staggered headline ────────────────────────────────────── */
function AnimatedHeadline({
  lines,
  entered,
  baseDelay = 200,
}: {
  lines: string[];
  entered: boolean;
  baseDelay?: number;
}) {
  let wordIdx = 0;
  return (
    <h1 className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight">
      {lines.map((line, li) => {
        const words = line.split(' ');
        return (
          <span key={li} className={`block ${li === 1 ? 'text-primary' : li === 2 ? 'text-accent' : ''}`}>
            {words.map((word) => {
              const delay = baseDelay + wordIdx++ * 55;
              return (
                <span
                  key={`${li}-${word}`}
                  className="inline-block mr-[0.22em] overflow-hidden"
                >
                  <span
                    className="inline-block transition-all duration-500 ease-out"
                    style={{
                      opacity: entered ? 1 : 0,
                      transform: entered ? 'translateY(0)' : 'translateY(105%)',
                      transitionDelay: `${delay}ms`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Staggered delay helper */
  const fade = (delay: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* ── Portrait panel — right half, diagonal clip ── */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[55%] z-0"
        style={{
          clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
          opacity: entered ? 1 : 0,
          transition: 'opacity 1s ease 150ms',
        }}
      >
        <AppImage
          src={heroData.backgroundImage}
          alt="Professional athlete"
          fill
          priority
          className="object-cover object-center"
          sizes="55vw"
        />
        {/* Portrait-specific gradient — fades left edge into bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* ── Atmospheric glow spots ── */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[90px] pointer-events-none" />

      {/* ── Noise overlay ── */}
      <div className="absolute inset-0 z-0 noise-overlay opacity-30" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-0 lg:pb-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="w-full lg:w-[48%] flex flex-col gap-5">

          {/* Badge */}
          <div style={fade(80)}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-[11px] font-700 uppercase tracking-[0.16em] text-primary">
                {heroData.badge}
              </span>
            </span>
          </div>

          {/* Headline — word-by-word wipe */}
          <AnimatedHeadline lines={heroData.headline} entered={entered} baseDelay={160} />

          {/* Divider line sweep */}
          <div
            className="h-px bg-primary/20 origin-left w-3/4"
            style={{
              transform: entered ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1) 680ms',
            }}
          />

          {/* Subheadline */}
          <p
            className="text-sm md:text-base text-foreground/60 max-w-[360px] leading-relaxed"
            style={fade(760)}
          >
            {heroData.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1" style={fade(860)}>
            {heroData.ctas.map((cta) => (
              <a key={cta.label} href={cta.href} className={`btn-${cta.variant}`}>
                {cta.label}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── Portrait floating card — years badge ── */}
      <div
        className="absolute bottom-16 right-6 lg:right-[8%] z-10 glass-card rounded-2xl px-5 py-4 text-center"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 1100ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 1100ms',
        }}
      >
        <p className="text-3xl font-800 text-primary leading-none">12+</p>
        <p className="text-[11px] text-muted-foreground font-600 uppercase tracking-widest mt-1">
          Years Elite<br />Coaching
        </p>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.6s ease 1300ms',
        }}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-primary transition-colors duration-300 group"
          aria-label="Scroll down"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-600">Scroll</span>
          {/* Animated mouse icon */}
          <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-1.5 rounded-full bg-current animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}