'use client';

import React, { useRef, useState, useEffect } from 'react';
import { experienceData } from '@/data/experienceData';
import { useChildReveal } from '@/hooks/useScrollReveal';

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  coaching:       { icon: '🏋️', label: 'Coaching'       },
  rehabilitation: { icon: '💪', label: 'Rehabilitation' },
  education:      { icon: '🎓', label: 'Education'      },
  specialneeds:   { icon: '❤️', label: 'Special Needs'  },
  training:       { icon: '⚡', label: 'Training'       },
};

export default function ExperienceSection() {
  const containerRef = useChildReveal({ threshold: 0.08 });
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineH, setLineH] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Animate the vertical line by measuring container height on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && lineRef.current) {
          setLineH(lineRef.current.scrollHeight);
        }
      },
      { threshold: 0.05 }
    );
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  const items = experienceData.timeline;

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 blob-primary opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto" ref={containerRef}>

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {experienceData.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {experienceData.title}{' '}
            <span className="text-primary">{experienceData.titleAccent}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative" ref={lineRef}>

          {/* Animated vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-foreground/8" />
          <div
            className="absolute left-[19px] top-2 w-px bg-primary/50 origin-top"
            style={{
              height: lineH > 0 ? lineH : 0,
              transition: lineH > 0 ? 'height 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s' : 'none',
            }}
          />

          <div className="space-y-2">
            {items.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type] ?? { icon: '📌', label: item.type };
              const isOpen = expanded === i;

              return (
                <div
                  key={i}
                  className="relative pl-12"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const obs = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        obs.disconnect();
                      }
                    }, { threshold: 0.1 });
                    obs.observe(el);
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-5 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 z-10 ${
                      isOpen
                        ? 'border-primary bg-primary/10 scale-110 shadow-md shadow-primary/20'
                        : 'border-foreground/15 bg-background hover:border-primary/40'
                    }`}
                    style={{ fontSize: '18px', lineHeight: 1 }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen ? 'border-primary/25 shadow-md' : 'hover:border-foreground/20'
                    }`}
                  >
                    {/* Always-visible header row — click to expand */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-center gap-4"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      {/* Year pill */}
                      <span className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-700 tabular-nums border border-primary/20 min-w-[52px] text-center">
                        {item.year}
                      </span>

                      {/* Role + org */}
                      <div className="flex-1 min-w-0">
                        <p className="font-700 text-foreground text-sm leading-snug truncate">
                          {item.role}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.organization}
                        </p>
                      </div>

                      {/* Type label — hidden on small screens */}
                      <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-[11px] font-600 text-muted-foreground uppercase tracking-wider px-2.5 py-1 rounded-full bg-foreground/5">
                        {cfg.label}
                      </span>

                      {/* Chevron */}
                      <svg
                        className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expandable body */}
                    <div
                      className="overflow-hidden transition-all duration-400 ease-in-out"
                      style={{ maxHeight: isOpen ? '600px' : '0px' }}
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-foreground/8 pt-4">

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>

                        {/* Highlights */}
                        {item.highlights?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[11px] font-700 uppercase tracking-widest text-muted-foreground/50">
                              Key Highlights
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.highlights.map((h: string, j: number) => (
                                <span
                                  key={j}
                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 font-500"
                                >
                                  <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}