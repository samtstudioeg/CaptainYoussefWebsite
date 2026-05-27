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
              setCount(Math.round(current));
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

  const primaryCta =
    heroData.ctas.find((c: { variant: string }) => c.variant === 'primary') ?? heroData.ctas[0];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Background image — full bleed, faded for legibility */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src={heroData.backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, var(--background) 45%, rgba(8,12,20,0.88) 75%, rgba(8,12,20,0.75) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--background) 0%, transparent 35%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-32">
        <div className="flex flex-col lg:flex-row lg:items-center gap-0">

          {/* ── LEFT: Badge + Headline ── */}
          <div className="flex-1 flex flex-col gap-6 pb-12 lg:pb-0 lg:pr-16">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit"
              style={{
                border: '1px solid rgba(0,212,255,0.2)',
                backgroundColor: 'rgba(0,212,255,0.06)',
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
            <h1 className="text-hero-xl" style={{ color: 'var(--foreground)' }}>
              {heroData.headline.map((line: string, i: number) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span style={{ color: 'var(--primary)' }}>{line}</span>
                  ) : i === 2 ? (
                    <span style={{ color: 'var(--accent)' }}>{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
          </div>

          {/* ── Vertical divider (large screens only) ── */}
          <div
            className="hidden lg:block w-px self-stretch"
            style={{ backgroundColor: 'var(--border)', margin: '0' }}
          />

          {/* ── RIGHT: Sub + CTA + Stats ── */}
          <div className="flex-1 flex flex-col gap-8 lg:pl-16">

            {/* Subheadline */}
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {heroData.subheadline}
            </p>

            {/* CTA */}
            <a href={primaryCta.href} className="btn-primary w-fit">
              {primaryCta.label}
            </a>

            {/* Stats 2×2 grid */}
            <div
              className="grid grid-cols-2 gap-px rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--border)' }}
            >
              {heroData.stats.map(
                (stat: { value: number; suffix: string; label: string }) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-1 p-5"
                    style={{ backgroundColor: 'var(--card)' }}
                  >
                    <span
                      className="counter-value leading-none"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {mounted ? (
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      ) : (
                        `${stat.value}${stat.suffix}`
                      )}
                    </span>
                    <span
                      className="text-[11px] uppercase tracking-[0.08em] font-medium"
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
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
