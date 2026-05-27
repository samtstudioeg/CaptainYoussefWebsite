'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { testimonialsData } from '@/data/testimonialsData';

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragEndX = useRef(0);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const total =
    testimonialsData.testimonials.length;

  // =========================
  // Navigation
  // =========================

  const next = useCallback(() => {
    setActiveIdx(
      (prev) => (prev + 1) % total
    );
  }, [total]);

  const prev = useCallback(() => {
    setActiveIdx(
      (prev) =>
        (prev - 1 + total) % total
    );
  }, [total]);

  // =========================
  // Auto Slide
  // =========================

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      next();
    }, 5000);
  }, [next]);

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const resetTimer = () => {
    startTimer();
  };

  const handleNext = () => {
    next();
    resetTimer();
  };

  const handlePrev = () => {
    prev();
    resetTimer();
  };

  // =========================
  // Swipe / Drag
  // =========================

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;

    dragEndX.current = e.clientX;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;

    const diff =
      dragStartX.current -
      dragEndX.current;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }

    setIsDragging(false);
  };

  // =========================
  // Keyboard Navigation
  // =========================

  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      }

      if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener(
      'keydown',
      handleKey
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey
      );
  }, []);

  const active =
    testimonialsData.testimonials[
      activeIdx
    ];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6"
    >
      {/* Background Blob */}
      <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 blob-accent opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-bold uppercase tracking-widest text-accent">
            {testimonialsData.badge}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {testimonialsData.title}{' '}
            <span className="text-accent">
              {
                testimonialsData.titleAccent
              }
            </span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 relative select-none touch-pan-y"
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={handlePointerUp}
          onPointerLeave={() =>
            setIsDragging(false)
          }
        >
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-10">
            <Icon
              name="ChatBubbleLeftEllipsisIcon"
              size={70}
              className="text-primary"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 glow-blue">
                <AppImage
                  src={active.image}
                  alt={active.imageAlt}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 flex-1 text-center md:text-left">
              {/* Stars */}
              <div className="flex gap-1 justify-center md:justify-start">
                {Array.from({
                  length: active.rating,
                }).map((_, i) => (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={16}
                    variant="solid"
                    className="text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground/85 text-sm sm:text-base md:text-lg leading-relaxed italic">
                "{active.text}"
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div>
                  <p className="text-foreground font-bold">
                    {active.name}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {active.role}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    {active.location}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 self-center sm:self-auto">
                  {active.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonialsData.testimonials.map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIdx(i);
                    resetTimer();
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIdx
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted'
                  }`}
                  aria-label={`Go to testimonial ${
                    i + 1
                  }`}
                />
              )
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
              aria-label="Previous testimonial"
            >
              <Icon
                name="ArrowLeftIcon"
                size={16}
                className="text-foreground"
              />
            </button>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all"
              aria-label="Next testimonial"
            >
              <Icon
                name="ArrowRightIcon"
                size={16}
                className="text-foreground"
              />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 justify-start sm:justify-center mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {testimonialsData.testimonials.map(
            (t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveIdx(i);
                  resetTimer();
                }}
                className={`shrink-0 flex flex-col items-center gap-2 transition-all duration-300 ${
                  i === activeIdx
                    ? 'opacity-100 scale-105'
                    : 'opacity-40 hover:opacity-70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    i === activeIdx
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <AppImage
                    src={t.image}
                    alt={t.imageAlt}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="text-xs text-muted-foreground hidden md:block">
                  {
                    t.name.split(' ')[0]
                  }
                </p>
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
