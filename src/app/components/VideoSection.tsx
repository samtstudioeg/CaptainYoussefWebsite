'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { videosData } from '@/data/videosData';

function VideoCard({ video, index }: { video: (typeof videosData.videos)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`glass-card rounded-3xl overflow-hidden group transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 ${visible ? 'opacity-100' : 'opacity-100'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden">
        <AppImage
          src={video.thumbnail}
          alt={video.thumbnailAlt}
          fill
          className={`object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`video-play-btn transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
            <Icon name="PlayIcon" size={24} variant="solid" className="text-primary ml-1" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs text-white font-600">
          {video.duration}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-xs text-primary font-600">
          {video.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-2">
        <h3 className="text-sm font-700 text-foreground leading-tight">{video.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{video.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{video.views} views</span>
          <button className="text-xs text-primary font-600 hover:text-primary/80 transition-colors flex items-center gap-1">
            Watch <Icon name="ArrowRightIcon" size={12} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? videosData.videos
    : videosData.videos.filter((v) => v.category === activeFilter);

  return (
    <section id="videos" className="py-24 px-6 relative">
      <div className="absolute top-0 left-1/2 w-80 h-80 blob-primary opacity-40" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {videosData.badge}
          </span>
          <h2 className="text-section-title">
            {videosData.title}{' '}
            <span className="text-primary">{videosData.titleAccent}</span>
          </h2>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {videosData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-700 uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}