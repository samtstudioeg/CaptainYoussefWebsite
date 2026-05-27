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

  // Use only the primary CTA
  const primaryCta = heroData.ctas.find((c: { variant: string }) => c.variant === 'primary') ?? heroData.ctas[0];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0c0c0c]"
    >
      {/* Portrait image — right half */}
      <div className="absolute inset-y-0 right-0 w-1/2 z-0">
        <AppImage
          src={heroData.portraitImage}
          alt={heroData.portraitAlt}
          fill
          priority
          className="object-cover object-top"
          sizes="50vw"
        />
        {/* Fade left edge into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/60 to-transparent" />
      </div>

      {/* Warm glow behind image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[480px] h-[480px] rounded-full bg-orange-600/10 blur-[140px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-32">
        <div className="max-w-lg">

          {/* Eyebrow */}
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-400/90 mb-5">
            {heroData.badge}
          </p>

          {/* Headline */}
          <h1
            className="leading-[0.9] text-white mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(64px, 9vw, 96px)' }}
          >
            {heroData.headline.map((line: string, i: number) =>
              i === heroData.headline.length - 1 ? (
                <span key={i} className="block text-orange-500">{line}</span>
              ) : (
                <span key={i} className="block">{line}</span>
              )
            )}
          </h1>

          {/* Subheadline — short */}
          <p className="text-base leading-relaxed text-white/50 mb-9 max-w-sm">
            {heroData.subheadline}
          </p>

          {/* Single CTA */}
          <a
            href={primaryCta.href}
            className="inline-block px-8 py-3.5 rounded-lg bg-orange-500 text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
          >
            {primaryCta.label}
          </a>

          {/* Stats row */}
          <div className="flex mt-12 pt-8 border-t border-white/[0.07]">
            {heroData.stats.map((stat: { value: number; suffix: string; label: string }, i: number) => (
              <div
                key={stat.label}
                className={`flex-1 ${i > 0 ? 'pl-6 border-l border-white/[0.07]' : ''} ${i < heroData.stats.length - 1 ? 'pr-6' : ''}`}
              >
                <span
                  className="block text-white leading-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px' }}
                >
                  {mounted
                    ? <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    : `${stat.value}${stat.suffix}`}
                </span>
                <span className="block text-[11px] text-white/35 uppercase tracking-[0.1em] font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bebas Neue font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>
    </section>
  );
}
