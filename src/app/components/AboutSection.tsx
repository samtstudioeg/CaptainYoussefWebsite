'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { aboutData } from '@/data/aboutData';

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(current));
      }, duration / steps);
    }
  }, [inView, target]);

  return <>{count}{suffix}</>;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const iconMap: Record<string, string> = {
    UserGroupIcon: 'UserGroupIcon',
    HeartIcon: 'HeartIcon',
    TrophyIcon: 'TrophyIcon',
    AcademicCapIcon: 'AcademicCapIcon',
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-24 px-6 relative overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-100'}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 blob-primary" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {aboutData.badge}
          </span>
          <h2 className="text-section-title">
            {aboutData.title}{' '}
            <span className="text-primary">{aboutData.titleAccent}</span>
          </h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {aboutData.stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-3xl p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name={iconMap[stat.icon] as any} size={24} className="text-primary" />
              </div>
              <p className="counter-value text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
              </p>
              <p className="text-xs text-muted-foreground font-500 mt-2 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5]">
              <AppImage
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Floating cert badge */}
            <div className="absolute -bottom-6 -right-4 glass-card rounded-2xl p-4 max-w-[220px] hidden md:block">
              <p className="text-xs font-700 text-primary uppercase tracking-wider mb-1">NSCA Certified</p>
              <p className="text-xs text-muted-foreground">Strength & Conditioning Specialist</p>
            </div>
          </div>

          {/* Right: Bio + Certs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bio */}
            <div className="space-y-4">
              {aboutData.bio.map((para, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed font-400">{para}</p>
              ))}
            </div>

            {/* Philosophy */}
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-xs font-700 uppercase tracking-widest text-primary mb-2">{aboutData.philosophy.title}</p>
              <p className="text-foreground/70 italic leading-relaxed">{aboutData.philosophy.text}</p>
            </div>

            {/* Certifications */}
            <div>
              <p className="text-sm font-700 uppercase tracking-widest text-muted-foreground mb-4">Certifications & Credentials</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {aboutData.certifications.map((cert, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}