import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/app/components/ScrollProgress';
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import ServicesSection from '@/app/components/ServicesSection';
import ExperienceSection from '@/app/components/ExperienceSection';
import GallerySection from '@/app/components/GallerySection';
import VideoSection from '@/app/components/VideoSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import CVSection from '@/app/components/CVSection';
import ContactSection from '@/app/components/ContactSection';
import WhatsAppFloat from '@/app/components/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'EliteCoach — Sports Performance & Fitness Specialist',
  description: 'Elite fitness trainer specializing in sports performance, injury rehabilitation, basketball coaching, special needs fitness, and athlete conditioning. Book your consultation today.',
};

function AnimatedDivider() {
  return (
    <div className="relative mx-6 h-px overflow-hidden">
      <div className="absolute inset-0 section-divider" />
      <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-shimmer-line" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Header />

      {/* Hero */}
      <HeroSection />

      <AnimatedDivider />

      {/* About */}
      <AboutSection />

      <AnimatedDivider />

      {/* Services */}
      <ServicesSection />

      <AnimatedDivider />

      {/* Experience Timeline */}
      <ExperienceSection />

      <AnimatedDivider />

      {/* Gallery */}
      <GallerySection />

      <AnimatedDivider />

      {/* Video Showcase */}
      {/* <VideoSection /> */}

      <AnimatedDivider />

      {/* Testimonials */}
      <TestimonialsSection />

      <AnimatedDivider />

      {/* Download CV */}
      <CVSection />

      <AnimatedDivider />

      {/* Contact */}
      <ContactSection />

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppFloat />
    </main>
  );
}
