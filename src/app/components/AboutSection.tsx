'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { aboutData } from '@/data/aboutData';
import { useChildReveal } from '@/hooks/useScrollReveal';

/* ─── Animated Counter ─────────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(current));
      }, 2000 / steps);
    }
  }, [inView, target]);

  return <>{count}{suffix}</>;
}

const ICON_MAP: Record<string, string> = {
  UserGroupIcon: 'UserGroupIcon',
  HeartIcon: 'HeartIcon',
  TrophyIcon: 'TrophyIcon',
  AcademicCapIcon: 'AcademicCapIcon',
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useChildReveal({ threshold: 0.1 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] blob-primary opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 blob-accent opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto" ref={containerRef}>

        {/* ── Header ── */}
        <div className="text-center mb-16 space-y-3">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {aboutData.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {aboutData.title}{' '}
            <span className="text-primary">{aboutData.titleAccent}</span>
          </h2>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-10 xl:gap-16 items-start">

          {/* ── LEFT: Image column ── */}
          <div className="reveal-left space-y-4">

            {/* Portrait */}
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4]">
              <AppImage
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

              {/* Cert badge overlaid on image */}
              <div className="absolute bottom-5 left-5 right-5 glass-card rounded-2xl px-4 py-3">
                <p className="text-xs font-700 text-primary uppercase tracking-wider">NSCA Certified</p>
                <p className="text-xs text-muted-foreground mt-0.5">Strength & Conditioning Specialist</p>
              </div>
            </div>

            {/* Stats — 2×2 grid below image */}
            <div className="grid grid-cols-2 gap-3">
              {aboutData.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-2xl p-4 text-center group hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    opacity: 0,
                    transform: 'translateY(16px)',
                    transition: `opacity 0.5s ease ${300 + i * 80}ms, transform 0.5s ease ${300 + i * 80}ms`,
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
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={ICON_MAP[stat.icon] as any} size={18} className="text-primary" />
                  </div>
                  <p className="text-2xl font-800 text-primary leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-600 uppercase tracking-wider mt-1 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Bio column ── */}
          <div className="space-y-8">

            {/* Bio paragraphs */}
            <div className="space-y-4">
              {aboutData.bio.map((para, i) => (
                <p
                  key={i}
                  className="reveal text-foreground/75 leading-relaxed text-base"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Pull quote / philosophy */}
            <div className="reveal-left delay-200 relative pl-5">
              {/* Accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary" />
              <p className="text-[10px] font-700 uppercase tracking-[0.18em] text-primary mb-2">
                {aboutData.philosophy.title}
              </p>
              <p className="text-foreground/70 italic leading-relaxed text-sm md:text-base">
                "{aboutData.philosophy.text}"
              </p>
            </div>

            {/* Certifications */}
            <div className="reveal delay-300 space-y-3">
              <p className="text-[11px] font-700 uppercase tracking-[0.15em] text-muted-foreground/60">
                Certifications & Credentials
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {aboutData.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/8 hover:border-primary/25 hover:bg-primary/5 transition-all duration-200 group"
                    style={{ transitionDelay: `${i * 35}ms` }}
                  >
                    {/* Checkmark dot */}
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors duration-200 leading-snug">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            {aboutData.cta && (
              <div className="reveal delay-400 pt-2">
                <a href={aboutData.cta.href} className="btn-primary inline-flex items-center gap-2">
                  {aboutData.cta.label}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}