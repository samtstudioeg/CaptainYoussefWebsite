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

export default function HomePage() {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* About */}
      <AboutSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Services */}
      <ServicesSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Experience Timeline */}
      <ExperienceSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Gallery */}
      <GallerySection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Video Showcase */}
      <VideoSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Download CV */}
      <CVSection />

      {/* Divider */}
      <div className="section-divider mx-6" />

      {/* Contact */}
      <ContactSection />

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppFloat />
    </main>
  );
}