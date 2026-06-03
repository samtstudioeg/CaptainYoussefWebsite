'use client';

import React, { useRef, useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { cvData } from '@/data/cvData';
import { useChildReveal } from '@/hooks/useScrollReveal';

export default function CVSection() {
  const containerRef = useChildReveal({ threshold: 0.12 });

  return (
    <section
      id="cv"
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary opacity-60" />
      <div className="absolute top-0 left-0 w-64 h-64 blob-primary opacity-30" />
      <div className="absolute bottom-0 right-0 w-64 h-64 blob-accent opacity-20" />
      <div className="max-w-5xl mx-auto relative" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {cvData?.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {cvData?.title}{' '}
            <span className="text-primary">{cvData?.titleAccent}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Preview Card */}
          <div className="reveal-left glass-card rounded-3xl p-8 space-y-6 glow-blue hover:scale-[1.01] transition-transform duration-300">
            {/* Header of card */}
            <div className="flex items-start gap-4 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon name="DocumentTextIcon" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-700 text-foreground">{cvData?.previewDetails?.name}</h3>
                <p className="text-sm text-primary font-500 mt-0.5">{cvData?.previewDetails?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{cvData?.previewDetails?.experience}</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Icon name="MapPinIcon" size={16} className="text-primary shrink-0" />
                {cvData?.previewDetails?.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Icon name="EnvelopeIcon" size={16} className="text-primary shrink-0" />
                {cvData?.previewDetails?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Icon name="PhoneIcon" size={16} className="text-primary shrink-0" />
                {cvData?.previewDetails?.phone}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={cvData?.downloadUrl}
                download
                className="btn-primary flex-1 justify-center text-xs hover:scale-105 transition-transform duration-200"
              >
                <Icon name="ArrowDownTrayIcon" size={16} className="text-primary-foreground" />
                Download CV
              </a>
              <a
                href={cvData?.viewOnlineUrl}
                className="btn-outline flex-1 justify-center text-xs hover:scale-105 transition-transform duration-200"
              >
                <Icon name="EyeIcon" size={16} className="text-foreground" />
                View Online
              </a>
            </div>
          </div>

          {/* Certifications List */}
          <div className="space-y-4">
            <p className="reveal text-sm font-700 uppercase tracking-widest text-muted-foreground mb-6">Key Qualifications</p>
            {cvData?.highlights?.map((cert, i) => (
              <div
                key={i}
                className="reveal flex items-start gap-3 glass-card rounded-2xl px-5 py-4 hover:border-primary/30 hover:translate-x-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="CheckBadgeIcon" size={14} className="text-primary" />
                </div>
                <p className="text-sm text-foreground/80 font-500 leading-relaxed">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}