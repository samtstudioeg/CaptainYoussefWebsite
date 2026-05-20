export const contactData = {
  badge: 'Get In Touch',
  title: 'Ready to',
  titleAccent: 'Start?',
  subtitle: 'Whether you\'re an athlete, a school, or a rehabilitation client — let\'s build your program.',
  options: [
    {
      icon: 'PhoneIcon',
      label: 'Phone / WhatsApp',
      value: '+1 (310) 555-0192',
      href: 'tel:+13105550192',
    },
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'coach@elitecoach.com',
      href: 'mailto:coach@elitecoach.com',
    },
    {
      icon: 'MapPinIcon',
      label: 'Location',
      value: 'Los Angeles, CA 90001, USA',
      href: '#map',
    },
  ],
  social: [
    { platform: 'Instagram', handle: '@elitecoach', href: '#', icon: 'instagram' },
    { platform: 'LinkedIn', handle: 'EliteCoach', href: '#', icon: 'linkedin' },
    { platform: 'YouTube', handle: 'EliteCoach TV', href: '#', icon: 'youtube' },
    { platform: 'Twitter/X', handle: '@elitecoach', href: '#', icon: 'twitter' },
  ],
  whatsapp: {
    number: '+13105550192',
    message: 'Hi! I\'d like to book a consultation with EliteCoach.',
    href: 'https://wa.me/13105550192?text=Hi!%20I%27d%20like%20to%20book%20a%20consultation%20with%20EliteCoach.',
  },
  formFields: [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: false },
    { name: 'service', label: 'Service Interest', type: 'select', options: ['Fitness Coaching', 'Special Needs Fitness', 'Sports Rehabilitation', 'Basketball Coaching', 'Performance Planning', 'Sports Massage', 'PE Teaching'], required: true },
    { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell me about your goals, current situation, and how I can help...', required: true },
  ],
};