'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { galleryData } from '@/data/galleryData';

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeFilter === 'All'
    ? galleryData.images
    : galleryData.images.filter((img) => img.category === activeFilter);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight' && lightboxIdx !== null) setLightboxIdx((prev) => prev !== null ? Math.min(prev + 1, filtered.length - 1) : null);
      if (e.key === 'ArrowLeft' && lightboxIdx !== null) setLightboxIdx((prev) => prev !== null ? Math.max(prev - 1, 0) : null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, filtered.length]);

  const spanClasses: Record<string, string> = {
    '2c2r': 'masonry-span-2c masonry-span-2r',
    '2c1r': 'masonry-span-2c',
    '1c2r': 'masonry-span-2r',
    '1c1r': '',
    'full': 'masonry-span-full',
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-24 px-6 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-700 uppercase tracking-widest text-accent">
            {galleryData.badge}
          </span>
          <h2 className="text-section-title">
            {galleryData.title}{' '}
            <span className="text-accent">{galleryData.titleAccent}</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {galleryData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-700 uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${spanClasses[img.span] || ''}`}
              onClick={() => setLightboxIdx(i)}
            >
              <AppImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="space-y-1">
                  <p className="text-white text-sm font-600">{img.caption}</p>
                  <p className="text-white/60 text-xs">{img.category}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name="MagnifyingGlassPlusIcon" size={16} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden">
              <AppImage
                src={filtered[lightboxIdx].src}
                alt={filtered[lightboxIdx].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                onClick={() => setLightboxIdx((p) => p !== null ? Math.max(p - 1, 0) : null)}
                disabled={lightboxIdx === 0}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-30"
              >
                ← Prev
              </button>
              <p className="text-sm text-foreground/70">{filtered[lightboxIdx].caption} · {lightboxIdx + 1}/{filtered.length}</p>
              <button
                onClick={() => setLightboxIdx((p) => p !== null ? Math.min(p + 1, filtered.length - 1) : null)}
                disabled={lightboxIdx === filtered.length - 1}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <Icon name="XMarkIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}