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
          const duration = 1800;
          const steps = 60;
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
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-end pb-16 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src={heroData.backgroundImage}
          alt="Professional athlete training, dramatic lighting"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Multi-directional scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      </div>

      {/* Atmospheric color glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[400px] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[100px]" />
        <div className="absolute top-0 left-1/2 w-[600px] h-[300px] rounded-full bg-amber-400/6 blur-[100px]" />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Decorative large number */}
      <div
        className="absolute bottom-0 right-8 z-0 select-none pointer-events-none text-white/[0.02] leading-none"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '280px' }}
        aria-hidden="true"
      >
        12
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32">
        <div className="grid lg:grid-cols-12 gap-10 items-end">

          {/* ── Left: Text ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 backdrop-blur-sm w-fit animate-[fadeSlideUp_0.5s_ease_both]">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-400">
                {heroData.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="leading-[0.92] m-0"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {heroData.headline.map((line: string, i: number) => (
                <span key={i} className="block" style={{ fontSize: 'clamp(56px, 8vw, 88px)' }}>
                  {i === 0 && <span className="text-white">{line}</span>}
                  {i === 1 && (
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #ff5000, #ffaa00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {line}
                    </span>
                  )}
                  {i === 2 && (
                    <span
                      style={{
                        background: 'linear-gradient(90deg, #00e87a, #00c4b0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {line}
                    </span>
                  )}
                  {i > 2 && <span className="text-white">{line}</span>}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-white/55 max-w-xl leading-relaxed font-normal">
              {heroData.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {heroData.ctas.map((cta: { label: string; href: string; variant: string }) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={
                    cta.variant === 'primary'
                      ? 'px-7 py-3.5 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:-translate-y-0.5 hover:opacity-90 active:scale-95'
                      : 'px-7 py-3.5 rounded-lg text-sm font-medium text-white/75 border border-white/20 tracking-wide transition-all hover:border-white/50 hover:text-white active:scale-95'
                  }
                  style={
                    cta.variant === 'primary'
                      ? { background: 'linear-gradient(135deg, #ff5000, #ff8c00)' }
                      : {}
                  }
                >
                  {cta.label}
                </a>
              ))}
            </div>

            {/* Stats bar */}
            <div className="flex gap-7 mt-2 flex-wrap">
              {heroData.stats.map((stat: { value: number; suffix: string; label: string }, i: number) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <div className="w-px bg-white/10 self-stretch my-1" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-white leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '34px' }}
                    >
                      {mounted ? (
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      ) : (
                        `${stat.value}${stat.suffix}`
                      )}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-medium">
                      {stat.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Right: Portrait + mini-stats ── */}
          <div className="lg:col-span-5 flex flex-col gap-3 items-start lg:items-end">

            {/* Portrait card */}
            <div className="relative w-56 h-72 md:w-64 md:h-80">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-orange-500/30">
                <AppImage
                  src={heroData.portraitImage}
                  alt={heroData.portraitAlt}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 224px, 256px"
                />
              </div>
              {/* Floating experience badge */}
              <div
                className="absolute -bottom-4 -left-4 rounded-xl px-4 py-2.5 border border-emerald-400/40"
                style={{
                  background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <p
                  className="leading-none text-emerald-400"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px' }}
                >
                  12+
                </p>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-medium mt-0.5">
                  Yrs Elite Coaching
                </p>
              </div>
            </div>

            {/* Mini stat cards */}
            <div className="flex flex-col gap-2 w-56 md:w-64 mt-6">
              {heroData.stats.slice(0, 2).map(
                (stat: { value: number; suffix: string; label: string }, i: number) => (
                  <div
                    key={stat.label}
                    className="flex justify-between items-center rounded-xl px-4 py-3 border border-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-[11px] text-white/40 uppercase tracking-[0.08em] font-medium">
                      {stat.label}
                    </span>
                    <span
                      className="leading-none"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '22px',
                        color: i === 0 ? '#ff6a1a' : '#00e87a',
                      }}
                    >
                      {mounted ? (
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      ) : (
                        `${stat.value}${stat.suffix}`
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-white/30 hover:text-orange-400 transition-colors"
          >
            <span className="text-[9px] uppercase tracking-[0.18em] font-semibold">Scroll</span>
            <div
              className="w-px h-8"
              style={{ background: 'linear-gradient(to bottom, #ff5000aa, transparent)' }}
            />
          </a>
        </div>
      </div>

      {/* Float keyframe injected once */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
