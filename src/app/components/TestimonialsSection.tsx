'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { testimonialsData } from '@/data/testimonialsData';
import { useChildReveal } from '@/hooks/useScrollReveal';

const AUTOPLAY_MS = 6000;

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useChildReveal({ threshold: 0.1 });

  // Keep a ref to activeIdx so interval callbacks never go stale
  const activeIdxRef = useRef(activeIdx);
  const transitioningRef = useRef(transitioning);
  activeIdxRef.current = activeIdx;
  transitioningRef.current = transitioning;

  const total = testimonialsData.testimonials.length;
  const active = testimonialsData.testimonials[activeIdx];

  // Stable goTo — reads from refs, never needs to be in dep arrays
  const goTo = useCallback((idx: number, scrollSidebar = false) => {
    if (idx === activeIdxRef.current || transitioningRef.current) return;
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setActiveIdx(idx);
      setTransitioning(false);
      // Only scroll sidebar when user explicitly clicks — not during autoplay
      if (scrollSidebar) {
        const sidebar = sidebarRef.current;
        const el = sidebar?.querySelector(`[data-idx="${idx}"]`) as HTMLElement | null;
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 350);
  }, []);

  // Stable startTimers — uses goTo (stable) and reads total from closure (constant)
  const startTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    const TICK = 50;
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (TICK / AUTOPLAY_MS) * 100, 100));
    }, TICK);

    timerRef.current = setInterval(() => {
      goTo((activeIdxRef.current + 1) % total);
    }, AUTOPLAY_MS);
  }, [goTo, total]); // total is constant; goTo is stable

  useEffect(() => {
    startTimers();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []); // run once on mount only — startTimers is stable but we intentionally omit it here

  const handleSelect = (idx: number) => {
    goTo(idx, true); // scroll sidebar on user click
    startTimers();
  };

  const handleNext = () => { goTo((activeIdxRef.current + 1) % total, true); startTimers(); };
  const handlePrev = () => { goTo((activeIdxRef.current - 1 + total) % total, true); startTimers(); };

  // Swipe
  const touchStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { dx > 0 ? handleNext() : handlePrev(); }
  };

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      {/* Subtle ambient blob */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] blob-accent opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={containerRef}>

        {/* ── Header ── */}
        <div className="text-center mb-16 space-y-4">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-700 uppercase tracking-widest text-accent">
            {testimonialsData.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {testimonialsData.title}{' '}
            <span className="text-accent">{testimonialsData.titleAccent}</span>
          </h2>
        </div>

        {/* ── Main Split Layout ── */}
        <div className="reveal-scale grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── LEFT: Featured Testimonial ── */}
          <div
            className="relative glass-card rounded-[2rem] overflow-hidden select-none cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Progress bar — sweeps across top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-foreground/5 z-10">
              <div
                className="h-full bg-accent origin-left transition-none"
                style={{ width: `${progress}%`, transition: transitioning ? 'none' : undefined }}
              />
            </div>

            {/* Content area */}
            <div className="p-8 md:p-12">
              {/* Decorative large quote mark */}
              <div className="absolute top-10 right-10 select-none pointer-events-none">
                <span className="text-[120px] leading-none font-serif text-primary/6 select-none">"</span>
              </div>

              {/* Animated inner */}
              <div
                key={activeIdx}
                className="space-y-8"
                style={{
                  animation: transitioning ? 'none' : 'testimonialIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
                }}
              >
                {/* Stars + category */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <Icon key={i} name="StarIcon" size={18} variant="solid" className="text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - active.rating }).map((_, i) => (
                      <Icon key={i} name="StarIcon" size={18} variant="solid" className="text-foreground/15" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-600 border border-accent/20">
                    {active.category}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/85 text-xl md:text-2xl leading-relaxed font-400 tracking-tight">
                  <span className="text-accent font-600">"</span>
                  {active.text}
                  <span className="text-accent font-600">"</span>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-2 border-t border-foreground/8">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/30">
                      <AppImage
                        src={active.image}
                        alt={active.imageAlt}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 ring-2 ring-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-foreground text-base leading-snug">{active.name}</p>
                    <p className="text-muted-foreground text-sm truncate">{active.role}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Icon name="MapPinIcon" size={11} className="text-muted-foreground/60 shrink-0" />
                      <p className="text-muted-foreground/60 text-xs">{active.location}</p>
                    </div>
                  </div>

                  {/* Nav arrows */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-accent/40 hover:scale-110 transition-all duration-200"
                      aria-label="Previous"
                    >
                      <Icon name="ArrowLeftIcon" size={15} className="text-foreground" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-accent/40 hover:scale-110 transition-all duration-200"
                      aria-label="Next"
                    >
                      <Icon name="ArrowRightIcon" size={15} className="text-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-1.5 px-8 pb-6 md:px-12">
              {testimonialsData.testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    i === activeIdx
                      ? 'w-8 bg-accent'
                      : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Scrollable Sidebar List ── */}
          <div
            ref={sidebarRef}
            className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent) transparent' }}
          >
            {testimonialsData.testimonials.map((t, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={t.id}
                  data-idx={i}
                  onClick={() => handleSelect(i)}
                  className={`relative group flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-300 border ${
                    isActive
                      ? 'glass-card border-accent/30 scale-[1.02] shadow-md'
                      : 'border-transparent hover:glass-card hover:border-foreground/10 opacity-60 hover:opacity-90'
                  }`}
                >
                  {/* Active accent bar */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-accent" />
                  )}

                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
                      isActive ? 'ring-accent/50' : 'ring-transparent'
                    }`}
                  >
                    <AppImage
                      src={t.image}
                      alt={t.imageAlt}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-600 truncate ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                        {t.name}
                      </p>
                      {/* Mini stars */}
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: t.rating }).map((_, si) => (
                          <Icon key={si} name="StarIcon" size={10} variant="solid" className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                    <p className={`text-xs leading-relaxed line-clamp-2 transition-colors duration-300 ${
                      isActive ? 'text-foreground/70' : 'text-foreground/40'
                    }`}>
                      {t.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        {testimonialsData.stats && (
          <div className="reveal mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {testimonialsData.stats.map((stat: { value: string; label: string }, i: number) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 text-center"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-2xl font-700 text-accent">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes testimonialIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}