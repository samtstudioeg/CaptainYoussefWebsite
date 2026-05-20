'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { contactData } from '@/data/contactData';

const iconMap: Record<string, string> = {
  PhoneIcon: 'PhoneIcon',
  EnvelopeIcon: 'EnvelopeIcon',
  MapPinIcon: 'MapPinIcon',
};

const SocialIcon = ({ icon }: { icon: string }) => {
  const paths: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  };
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d={paths[icon] || ''} />
    </svg>
  );
};

export default function ContactSection() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData['name'] || '';
    const email = formData['email'] || '';
    const phone = formData['phone'] || '';
    const service = formData['service'] || '';
    const message = formData['message'] || '';

    const text = [
      `👋 Hello! I'm reaching out via the website contact form.`,
      ``,
      `👤 *Name:* ${name}`,
      email ? `📧 *Email:* ${email}` : '',
      phone ? `📞 *Phone:* ${phone}` : '',
      service ? `🏋️ *Service Interest:* ${service}` : '',
      ``,
      `💬 *Message:*`,
      message,
    ]
      .filter((line) => line !== null && line !== undefined)
      .join('\n');

    const whatsappNumber = contactData.whatsapp.number.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 blob-primary opacity-20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 blob-accent opacity-15" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-700 uppercase tracking-widest text-primary">
            {contactData.badge}
          </span>
          <h2 className="text-section-title">
            {contactData.title}{' '}
            <span className="text-primary">{contactData.titleAccent}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{contactData.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact options */}
            <div className="space-y-4">
              {contactData.options.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  className="flex items-center gap-4 glass-card rounded-2xl px-5 py-4 hover:border-primary/30 transition-all duration-200 group min-h-[44px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name={iconMap[opt.icon] as any} size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{opt.label}</p>
                    <p className="text-sm font-600 text-foreground group-hover:text-primary transition-colors">{opt.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={contactData.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">WhatsApp</p>
                <p className="text-sm font-600 text-[#25D366]">Message on WhatsApp</p>
              </div>
              <Icon name="ArrowRightIcon" size={16} className="text-[#25D366] ml-auto group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Social Links */}
            <div className="flex gap-3 flex-wrap">
              {contactData.social.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  aria-label={s.platform}
                  className="w-11 h-11 glass-card rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 space-y-5">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto">
                    <Icon name="CheckCircleIcon" size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-700 text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {contactData.formFields.slice(0, 2).map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
                          {field.label}{field.required && <span className="text-primary ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          required={field.required}
                          onChange={handleChange}
                          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {contactData.formFields.slice(2, 4).map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
                          {field.label}{field.required && <span className="text-primary ml-1">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            name={field.name}
                            required={field.required}
                            onChange={handleChange}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                          >
                            <option value="">Select a service...</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            required={field.required}
                            onChange={handleChange}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {contactData.formFields.slice(4).map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-xs font-700 uppercase tracking-wider text-muted-foreground">
                        {field.label}{field.required && <span className="text-primary ml-1">*</span>}
                      </label>
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={5}
                        onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center text-sm py-4"
                  >
                    <Icon name="PaperAirplaneIcon" size={18} className="text-primary-foreground" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}