'use client';

import React, { useRef, useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { servicesData } from '@/data/servicesData';
import { useChildReveal } from '@/hooks/useScrollReveal';

const iconMap: Record<string, string> = {
  BoltIcon: 'BoltIcon',
  HeartIcon: 'HeartIcon',
  ShieldCheckIcon: 'ShieldCheckIcon',
  TrophyIcon: 'TrophyIcon',
  ChartBarIcon: 'ChartBarIcon',
  HandRaisedIcon: 'HandRaisedIcon',
  AcademicCapIcon: 'AcademicCapIcon',
};

function ServiceCard({ service, index }: { service: (typeof servicesData.services)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`glass-card rounded-3xl overflow-hidden service-card-hover flex flex-col transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <AppImage
          src={service.image}
          alt={service.imageAlt}
          fill
          className={`object-cover transition-transform duration-700 ${hovered ? 'scale-115' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
        {/* Icon */}
        <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center transition-all duration-300 ${hovered ? 'scale-110 bg-primary/30' : ''}`}>
          <Icon name={iconMap[service.icon] as any} size={20} className="text-primary" />
        </div>
        {/* Hover shine overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <h3 className={`text-lg font-700 text-foreground leading-tight transition-colors duration-300 ${hovered ? 'text-primary' : ''}`}>{service.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{service.description}</p>

        {/* Benefits */}
        <ul className="space-y-1.5">
          {service.benefits.map((benefit, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 text-xs text-foreground/70 transition-all duration-300 ${hovered ? 'translate-x-1 text-foreground/90' : ''}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${service.accentColor === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className={`${service.accentColor === 'accent' ? 'btn-accent' : 'btn-primary'} text-xs justify-center mt-auto`}
        >
          {service.cta}
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const containerRef = useChildReveal({ threshold: 0.08 });

  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="absolute bottom-0 left-0 w-80 h-80 blob-accent" />

      <div className="max-w-7xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-700 uppercase tracking-widest text-accent">
            {servicesData.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {servicesData.title}{' '}
            <span className="text-accent">{servicesData.titleAccent}</span>
          </h2>
          <p className="reveal delay-250 text-muted-foreground max-w-2xl mx-auto">{servicesData.subtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicesData.services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}