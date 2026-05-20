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

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full min-h-screen flex items-end pb-16 overflow-hidden"
    >
      {/* Background Image with scrim */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src={heroData.backgroundImage}
          alt="Professional athlete training in a high-performance gym, dramatic side lighting, dark background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark scrim for white text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 z-0 noise-overlay" />

      {/* Atmospheric blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 blob-primary z-0" />
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 blob-accent z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          {/* Left: Text Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-700 uppercase tracking-widest text-primary">
                {heroData.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero-xl text-foreground leading-none">
              {heroData.headline.map((line, i) => (
                <span
                  key={i}
                  className={`block ${i === 1 ? 'text-primary glow-text-blue' : i === 2 ? 'text-accent glow-text-green' : ''}`}
                >
                  {line}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed font-400">
              {heroData.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              {heroData.ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={`btn-${cta.variant}`}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Portrait + Stats */}
          <div className="lg:col-span-5 space-y-6">
            {/* Portrait */}
            <div className="relative mx-auto lg:mx-0 w-64 h-80 md:w-72 md:h-96">
              <div className="w-full h-full rounded-3xl overflow-hidden border border-primary/20 glow-blue">
                <AppImage
                  src={heroData.portraitImage}
                  alt={heroData.portraitAlt}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 256px, 288px"
                />
              </div>
              {/* Floating experience badge */}
              <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 animate-float">
                <p className="text-2xl font-800 text-primary">12+</p>
                <p className="text-xs text-muted-foreground font-500 uppercase tracking-wider">Years Elite Coaching</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {heroData.stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                  <p className="text-2xl font-800 text-primary">
                    {mounted ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : `${stat.value}${stat.suffix}`}
                  </p>
                  <p className="text-xs text-muted-foreground font-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-xs uppercase tracking-widest font-600">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
          </a>
        </div>
      </div>
    </section>
  );
}