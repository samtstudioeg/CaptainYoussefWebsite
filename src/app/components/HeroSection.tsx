'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { heroData } from '@/data/heroData';

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 1400 / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const primaryCta = heroData.ctas.find((c: { variant: string }) => c.variant === 'primary') ?? heroData.ctas[0];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Portrait — right half */}
      <div className="absolute inset-y-0 right-0 w-1/2 z-0">
        <AppImage
          src={heroData.portraitImage}
          alt={heroData.portraitAlt}
          fill
          priority
          className="object-cover object-top"
          sizes="50vw"
        />
        {/* Fade left into background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, var(--background) 0%, rgba(8,12,20,0.55) 55%, transparent 100%)',
          }}
        />
        {/* Subtle primary glow behind subject */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 70% 40%, rgba(0,212,255,0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 z-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-32">
        <div className="max-w-lg">

          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              border: '1px solid rgba(0,212,255,0.25)',
              backgroundColor: 'rgba(0,212,255,0.07)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.12em]"
              style={{ color: 'var(--primary)' }}
            >
              {heroData.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-hero-xl mb-6" style={{ color: 'var(--foreground)' }}>
            {heroData.headline.map((line: string, i: number) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className="glow-text-blue" style={{ color: 'var(--primary)' }}>
                    {line}
                  </span>
                ) : i === 2 ? (
                  <span className="glow-text-green" style={{ color: 'var(--accent)' }}>
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            className="text-base leading-relaxed mb-9 max-w-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {heroData.subheadline}
          </p>

          {/* Single primary CTA */}
          <a href={primaryCta.href} className="btn-primary">
            {primaryCta.label}
          </a>

          {/* Stats row */}
          <div
            className="flex mt-12 pt-8"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {heroData.stats.map(
              (stat: { value: number; suffix: string; label: string }, i: number) => (
                <div
                  key={stat.label}
                  className="flex-1"
                  style={{
                    paddingRight: i < heroData.stats.length - 1 ? '24px' : '0',
                    paddingLeft: i > 0 ? '24px' : '0',
                    borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span
                    className="block leading-none counter-value"
                    style={{ color: 'var(--primary)' }}
                  >
                    {mounted ? (
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    ) : (
                      `${stat.value}${stat.suffix}`
                    )}
                  </span>
                  <span
                    className="block text-[11px] uppercase tracking-[0.1em] font-medium mt-1.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {stat.label}
                  </span>
                </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 transition-opacity hover:opacity-100 opacity-50"
        >
          <span
            className="text-[9px] uppercase tracking-[0.18em] font-semibold"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Scroll
          </span>
          <div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, var(--primary), transparent)' }}
          />
        </a>
      </div>
    </section>
  );
}
