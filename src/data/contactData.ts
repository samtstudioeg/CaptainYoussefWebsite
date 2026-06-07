export const contactData = {
  badge: 'Get In Touch',
  title: 'Ready to',
  titleAccent: 'Start?',
  subtitle: 'Whether you\'re an athlete, a school, or a rehabilitation client — let\'s build your program.',
  options: [
    {
      icon: 'PhoneIcon',
      label: 'Phone / WhatsApp',
      value: '+20 102 430 8748',
      href: 'tel:+201024308748',
    },
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'yousef4je@gmail.com',
      href: 'mailto:yousef4je@gmail.com',
    },
    {
      icon: 'MapPinIcon',
      label: 'Location',
      value: 'Giza, Egypt',
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
    number: '+20 102 430 8748',
    message: 'Hi! I\'d like to book a consultation with EliteCoach.',
    href: 'https://wa.me/+201024308748?text=Hi!%20I%27d%20like%20to%20book%20a%20consultation%20with%20EliteCoach.',
  },
  formFields: [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '01234567890', required: false },
    { name: 'service', label: 'Service Interest', type: 'select', options: ['Fitness Coaching', 'Special Needs Fitness', 'Sports Rehabilitation', 'Basketball Coaching', 'Performance Planning', 'Sports Massage', 'PE Teaching'], required: true },
    { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell me about your goals, current situation, and how I can help...', required: true },
  ],
};
