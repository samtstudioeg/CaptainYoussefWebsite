'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { testimonialsData } from '@/data/testimonialsData';

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonialsData.testimonials.length;

  const next = useCallback(() => setActiveIdx((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIdx((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  };

  const handleNext = () => { next(); resetTimer(); };
  const handlePrev = () => { prev(); resetTimer(); };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setIsDragging(false);
  };

  const active = testimonialsData.testimonials[activeIdx];

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 blob-accent opacity-40" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-700 uppercase tracking-widest text-accent">
            {testimonialsData.badge}
          </span>
          <h2 className="text-section-title">
            {testimonialsData.title}{' '}
            <span className="text-accent">{testimonialsData.titleAccent}</span>
          </h2>
        </div>

        {/* Main testimonial */}
        <div
          className="glass-card rounded-[2.5rem] p-8 md:p-12 relative select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setIsDragging(false)}
        >
          {/* Quote icon */}
          <div className="absolute top-8 right-8 text-primary/10">
            <Icon name="ChatBubbleLeftEllipsisIcon" size={80} className="text-primary opacity-10" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 glow-blue">
                <AppImage
                  src={active.image}
                  alt={active.imageAlt}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 flex-1">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Icon key={i} name="StarIcon" size={16} variant="solid" className="text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground/85 text-base md:text-lg leading-relaxed italic font-400">
                "{active.text}"
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                <div>
                  <p className="text-foreground font-700">{active.name}</p>
                  <p className="text-muted-foreground text-sm">{active.role}</p>
                  <p className="text-muted-foreground text-xs">{active.location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-600 border border-primary/20">
                  {active.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {testimonialsData.testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); resetTimer(); }}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-8 bg-primary' : 'w-2 bg-muted'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
              aria-label="Previous testimonial"
            >
              <Icon name="ArrowLeftIcon" size={16} className="text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
              aria-label="Next testimonial"
            >
              <Icon name="ArrowRightIcon" size={16} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Thumbnail Row */}
        <div className="flex gap-4 justify-center mt-8 overflow-x-auto pb-2">
          {testimonialsData.testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setActiveIdx(i); resetTimer(); }}
              className={`shrink-0 flex flex-col items-center gap-2 transition-all duration-200 ${i === activeIdx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-primary' : 'border-transparent'}`}>
                <AppImage
                  src={t.image}
                  alt={t.imageAlt}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">{t.name.split(' ')[0]}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}