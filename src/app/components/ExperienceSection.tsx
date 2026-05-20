'use client';

import React, { useRef, useState, useEffect } from 'react';
import { experienceData } from '@/data/experienceData';

const typeIcons: Record<string, string> = {
  coaching: '🏋️',
  rehabilitation: '💪',
  education: '🎓',
  specialneeds: '❤️',
  training: '⚡',
};

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-96 h-96 blob-primary opacity-50" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {experienceData.badge}
          </span>
          <h2 className="text-section-title">
            {experienceData.title}{' '}
            <span className="text-primary">{experienceData.titleAccent}</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-px" />

          <div className="space-y-12">
            {experienceData.timeline.map((item, i) => {
              const isEven = i % 2 === 0;
              const accentIsGreen = experienceData.typeColors[item.type as keyof typeof experienceData.typeColors] === 'accent';
              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 top-6 w-5 h-5 rounded-full border-2 md:-translate-x-1/2 z-10 flex items-center justify-center"
                    style={{ borderColor: accentIsGreen ? 'var(--accent)' : 'var(--primary)', backgroundColor: 'var(--background)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentIsGreen ? 'var(--accent)' : 'var(--primary)' }} />
                  </div>

                  {/* Content card */}
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-3rem)] glass-card rounded-3xl p-6 space-y-3 hover:border-primary/30 transition-all duration-300 ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <span className={`text-xs font-700 uppercase tracking-widest px-3 py-1 rounded-full ${accentIsGreen ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                        {item.year}
                      </span>
                      <span className="text-lg">{typeIcons[item.type]}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-700 text-foreground">{item.role}</h3>
                      <p className="text-sm text-primary font-500 mt-0.5">{item.organization}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.highlights.map((h, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Empty spacer for opposite side */}
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}