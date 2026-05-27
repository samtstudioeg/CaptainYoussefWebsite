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

  // Intersection Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filtered Images
  const filtered =
    activeFilter === 'All'
      ? galleryData.images
      : galleryData.images.filter(
          (img) => img.category === activeFilter
        );

  // Reset lightbox if filter changes
  useEffect(() => {
    if (
      lightboxIdx !== null &&
      lightboxIdx >= filtered.length
    ) {
      setLightboxIdx(null);
    }
  }, [filtered.length, lightboxIdx]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;

      if (e.key === 'Escape') {
        setLightboxIdx(null);
      }

      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev !== null
            ? (prev + 1) % filtered.length
            : null
        );
      }

      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev !== null
            ? (prev - 1 + filtered.length) %
              filtered.length
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKey);

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey
      );
  }, [lightboxIdx, filtered.length]);

  // Responsive Grid Span Classes
  const spanClasses: Record<string, string> = {
    '2c2r': 'sm:col-span-2 sm:row-span-2',
    '2c1r': 'sm:col-span-2',
    '1c2r': 'sm:row-span-2',
    '1c1r': '',
    full: 'col-span-full',
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`py-16 md:py-24 px-4 sm:px-6 transition-all duration-700 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-bold uppercase tracking-widest text-accent">
            {galleryData.badge}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {galleryData.title}{' '}
            <span className="text-accent">
              {galleryData.titleAccent}
            </span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 md:mb-10">
          {galleryData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Open image ${img.caption}`}
              onClick={() => setLightboxIdx(i)}
              className={`relative overflow-hidden rounded-2xl group text-left focus:outline-none focus:ring-2 focus:ring-accent ${
                spanClasses[img.span] || ''
              }`}
            >
              <AppImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  25vw
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="space-y-1">
                  <p className="text-white text-sm font-semibold">
                    {img.caption}
                  </p>

                  <p className="text-white/60 text-xs">
                    {img.category}
                  </p>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon
                    name="MagnifyingGlassPlusIcon"
                    size={16}
                    className="text-white"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null &&
        filtered[lightboxIdx] && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* Image */}
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden">
                <AppImage
                  src={filtered[lightboxIdx].src}
                  alt={filtered[lightboxIdx].alt}
                  fill
                  priority
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center justify-between mt-4">
                {/* Prev */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setLightboxIdx((prev) =>
                      prev !== null
                        ? (prev -
                            1 +
                            filtered.length) %
                          filtered.length
                        : null
                    );
                  }}
                  className="btn-outline text-xs px-4 py-2"
                >
                  ← Prev
                </button>

                {/* Counter */}
                <p className="text-center text-xs sm:text-sm text-white/70 px-2">
                  {
                    filtered[lightboxIdx]
                      .caption
                  }{' '}
                  · {lightboxIdx + 1}/
                  {filtered.length}
                </p>

                {/* Next */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setLightboxIdx((prev) =>
                      prev !== null
                        ? (prev + 1) %
                          filtered.length
                        : null
                    );
                  }}
                  className="btn-outline text-xs px-4 py-2"
                >
                  Next →
                </button>
              </div>

              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(null);
                }}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Icon
                  name="XMarkIcon"
                  size={20}
                  className="text-white"
                />
              </button>
            </div>
          </div>
        )}
    </section>
  );
}
