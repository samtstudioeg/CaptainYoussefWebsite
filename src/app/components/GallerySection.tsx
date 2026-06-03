'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { galleryData } from '@/data/galleryData';
import { useChildReveal } from '@/hooks/useScrollReveal';

const PAGE_SIZE = 12;

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [view, setView] = useState<'masonry' | 'grid'>('masonry');
  const containerRef = useChildReveal({ threshold: 0.05 });
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filtered images based on category + search
  const filtered = useMemo(() => {
    let imgs = activeFilter === 'All'
      ? galleryData.images
      : galleryData.images.filter((img) => img.category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      imgs = imgs.filter(
        (img) =>
          img.caption?.toLowerCase().includes(q) ||
          img.category?.toLowerCase().includes(q) ||
          img.alt?.toLowerCase().includes(q)
      );
    }
    return imgs;
  }, [activeFilter, searchQuery]);

  // Paginated slice
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  // Track whether the user has interacted yet — prevents scrollIntoView firing on mount
  const hasInteracted = useRef(false);

  // Reset page when filter or search changes
  useEffect(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      return;
    }
    setPage(1);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: galleryData.images.length };
    galleryData.images.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Lightbox open/close with animation
  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
    setLightboxVisible(false);
    requestAnimationFrame(() => setLightboxVisible(true));
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
    setTimeout(() => {
      setLightboxIdx(null);
      document.body.style.overflow = '';
    }, 200);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight')
        setLightboxIdx((p) => (p !== null ? Math.min(p + 1, filtered.length - 1) : null));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((p) => (p !== null ? Math.max(p - 1, 0) : null));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, filtered.length, closeLightbox]);

  // Swipe support in lightbox
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxIdx === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setLightboxIdx((p) => (p !== null ? Math.min(p + 1, filtered.length - 1) : null));
      else setLightboxIdx((p) => (p !== null ? Math.max(p - 1, 0) : null));
    }
    touchStartX.current = null;
  };

  const spanClasses: Record<string, string> = {
    '2c2r': 'masonry-span-2c masonry-span-2r',
    '2c1r': 'masonry-span-2c',
    '1c2r': 'masonry-span-2r',
    '1c1r': '',
    full: 'masonry-span-full',
  };

  return (
    <section id="gallery" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto" ref={containerRef}>

        {/* ── Header ── */}
        <div className="text-center mb-12 space-y-4">
          <span className="reveal inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-700 uppercase tracking-widest text-accent">
            {galleryData.badge}
          </span>
          <h2 className="reveal delay-150 text-section-title">
            {galleryData.title}{' '}
            <span className="text-accent">{galleryData.titleAccent}</span>
          </h2>
          <p className="reveal delay-200 text-muted-foreground text-sm">
            {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
            {activeFilter !== 'All' && ` in ${activeFilter}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* ── Controls Bar ── */}
        <div className="reveal delay-200 flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Icon
              name="MagnifyingGlassIcon"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search photos…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <Icon name="XMarkIcon" size={14} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 glass-card p-1 rounded-xl">
            <button
              onClick={() => setView('masonry')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'masonry'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Masonry view"
            >
              <Icon name="Squares2X2Icon" size={18} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                view === 'grid'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
            >
              <Icon name="ViewColumnsIcon" size={18} />
            </button>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="reveal delay-250 flex flex-wrap gap-2 justify-center mb-10">
          {galleryData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-700 uppercase tracking-wider transition-all duration-300 min-h-[44px] ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 hover:scale-105'
              }`}
            >
              {cat}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-600 leading-none ${
                  activeFilter === cat
                    ? 'bg-white/20 text-primary-foreground'
                    : 'bg-foreground/10 text-muted-foreground'
                }`}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div ref={gridRef}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <Icon name="PhotoIcon" size={48} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">No photos found</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="btn-outline text-xs px-4 py-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  view === 'masonry'
                    ? 'masonry-grid'
                    : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
                }
              >
                {visible.map((img, i) => (
                  <GalleryItem
                    key={img.id}
                    img={img}
                    index={i}
                    spanClass={view === 'masonry' ? (spanClasses[img.span] || '') : ''}
                    onClick={() => openLightbox(i)}
                  />
                ))}
              </div>

              {/* ── Load More ── */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex flex-col items-center gap-3 mt-12">
                  <p className="text-xs text-muted-foreground">
                    Showing {visible.length} of {filtered.length}
                  </p>
                  {/* Progress bar */}
                  <div className="w-48 h-1 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${(visible.length / filtered.length) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-outline flex items-center gap-2 px-6 py-3 rounded-xl hover:scale-105 transition-transform"
                  >
                    <Icon name="ArrowDownIcon" size={16} />
                    Load more photos
                  </button>
                </div>
              )}

              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center text-xs text-muted-foreground mt-12">
                  All {filtered.length} photos loaded
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="lightbox-overlay"
          style={{
            opacity: lightboxVisible ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Counter pill */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-card text-sm text-foreground z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxIdx + 1} / {filtered.length}
          </div>

          {/* Close */}
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <Icon name="XMarkIcon" size={20} className="text-white" />
          </button>

          {/* Main image */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: lightboxVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
              transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-black/40">
              <AppImage
                src={filtered[lightboxIdx].src}
                alt={filtered[lightboxIdx].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Caption + nav */}
            <div className="flex items-center justify-between mt-4 px-1 gap-4">
              <button
                onClick={() =>
                  setLightboxIdx((p) => (p !== null ? Math.max(p - 1, 0) : null))
                }
                disabled={lightboxIdx === 0}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-30 flex items-center gap-1.5 shrink-0"
              >
                <Icon name="ChevronLeftIcon" size={14} /> Prev
              </button>

              <div className="text-center min-w-0">
                <p className="text-sm font-600 text-foreground truncate">
                  {filtered[lightboxIdx].caption}
                </p>
                <p className="text-xs text-muted-foreground">{filtered[lightboxIdx].category}</p>
              </div>

              <button
                onClick={() =>
                  setLightboxIdx((p) =>
                    p !== null ? Math.min(p + 1, filtered.length - 1) : null
                  )
                }
                disabled={lightboxIdx === filtered.length - 1}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-30 flex items-center gap-1.5 shrink-0"
              >
                Next <Icon name="ChevronRightIcon" size={14} />
              </button>
            </div>

            {/* Thumbnail strip — shows 7 surrounding images */}
            <LightboxStrip
              images={filtered}
              currentIdx={lightboxIdx}
              onSelect={setLightboxIdx}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Gallery Item ─────────────────────────────────────────────────────────── */
interface GalleryItemProps {
  img: (typeof galleryData.images)[number];
  index: number;
  spanClass: string;
  onClick: () => void;
}

function GalleryItem({ img, index, spanClass, onClick }: GalleryItemProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${spanClass}`}
      onClick={onClick}
      style={{
        opacity: 0,
        transform: 'translateY(24px) scale(0.97)',
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${(index % PAGE_SIZE) * 55}ms,
                     transform 0.55s cubic-bezier(0.22,1,0.36,1) ${(index % PAGE_SIZE) * 55}ms`,
      }}
      ref={(el) => {
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0) scale(1)';
              observer.disconnect();
            }
          },
          { threshold: 0.05 }
        );
        observer.observe(el);
      }}
    >
      <AppImage
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="space-y-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-600 leading-snug">{img.caption}</p>
          <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white/80">
            {img.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
          <Icon name="MagnifyingGlassPlusIcon" size={15} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─── Lightbox Thumbnail Strip ─────────────────────────────────────────────── */
interface LightboxStripProps {
  images: (typeof galleryData.images);
  currentIdx: number;
  onSelect: (idx: number) => void;
}

function LightboxStrip({ images, currentIdx, onSelect }: LightboxStripProps) {
  const STRIP_HALF = 3;
  const start = Math.max(0, currentIdx - STRIP_HALF);
  const end = Math.min(images.length, currentIdx + STRIP_HALF + 1);
  const strip = images.slice(start, end);

  return (
    <div className="flex justify-center gap-2 mt-4 overflow-hidden">
      {strip.map((img, i) => {
        const realIdx = start + i;
        const isCurrent = realIdx === currentIdx;
        return (
          <button
            key={img.id}
            onClick={() => onSelect(realIdx)}
            className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${
              isCurrent
                ? 'ring-2 ring-accent scale-110 opacity-100'
                : 'opacity-50 hover:opacity-80 hover:scale-105'
            }`}
            aria-label={img.caption}
          >
            <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="56px" />
          </button>
        );
      })}
    </div>
  );
}