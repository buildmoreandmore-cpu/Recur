import React, { useEffect } from 'react';

export interface IndustryConfig {
  slug: string;
  name: string;
  pluralName: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  painPoints: {
    title: string;
    description: string;
  }[];
  features: {
    title: string;
    description: string;
    icon: 'calendar' | 'money' | 'chart' | 'users' | 'bell' | 'link';
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

// Industry configurations
export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'hair-stylists': {
    slug: 'hair-stylists',
    name: 'Hair Stylist',
    pluralName: 'Hair Stylists',
    title: 'Salon Booking Software with Deposits | Recur for Hair Stylists',
    metaDescription: 'Salon booking software built for hair stylists. Collect deposits to reduce no-shows, forecast your income, and manage recurring clients. Start your free trial today.',
    h1: 'Salon Booking Software with Deposits',
    heroSubtitle: 'Stop chasing payments and reduce no-shows. Recur helps hair stylists collect deposits upfront, forecast income, and keep their chair full.',
    painPoints: [
      { title: 'No-shows cost you money', description: 'Empty chairs mean lost income. Collect deposits when clients book to ensure they show up.' },
      { title: 'Income feels unpredictable', description: 'Not knowing what next month looks like is stressful. See your projected income based on client rotations.' },
      { title: 'Clients fall through the cracks', description: 'When regulars go too long without booking, you lose them. Get alerts when clients are overdue.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require deposits when clients book online. Payments go directly to your Stripe account.', icon: 'money' },
      { title: 'Revenue Forecasting', description: 'See projected income for the month, quarter, and year based on your client rotation schedules.', icon: 'chart' },
      { title: 'Client Rotation Tracking', description: 'Know which clients come every 4 weeks vs every 8 weeks. Plan your schedule around their patterns.', icon: 'calendar' },
      { title: 'Online Booking Page', description: 'Share your personalized booking link. Clients pick services, times, and pay deposits without back-and-forth.', icon: 'link' }
    ],
    faqs: [
      { question: 'How much should I charge for salon appointment deposits?', answer: 'Most stylists charge 20-50% of the service price or a flat $25-50 deposit. Recur lets you set either a fixed amount or percentage.' },
      { question: 'Will clients actually pay deposits to book?', answer: 'Yes. Clients who pay deposits are committed clients. You may see fewer bookings initially, but almost zero no-shows. Most stylists report this increases their actual revenue.' },
      { question: 'How does revenue forecasting work for salons?', answer: 'Enter each client\'s rotation schedule (e.g., color every 8 weeks, cuts every 6 weeks). Recur calculates their annual value and projects your income month by month.' },
      { question: 'Can clients book without paying a deposit?', answer: 'You control this. You can require deposits for new clients only, for certain services, or make deposits optional.' }
    ],
    testimonial: {
      quote: 'I stopped losing $500/month to no-shows the first month I started collecting deposits. Recur paid for itself immediately.',
      author: 'Jessica M.',
      role: 'Independent Hair Stylist, Atlanta'
    }
  },
  'barbers': {
    slug: 'barbers',
    name: 'Barber',
    pluralName: 'Barbers',
    title: 'Barber Shop Booking App with Payment Processing | Recur',
    metaDescription: 'Barbershop scheduling software that collects deposits and reduces no-shows. Perfect for independent barbers and barbershop owners. Start free.',
    h1: 'Barber Shop Booking App',
    heroSubtitle: 'Fill your chair and protect your time. Recur helps barbers collect deposits, manage recurring clients, and forecast their income.',
    painPoints: [
      { title: 'No-shows waste your time', description: 'When clients don\'t show, that\'s money you can\'t get back. Deposits ensure commitment.' },
      { title: 'Chasing regulars is exhausting', description: 'Stop texting clients to remind them to book. Let them book themselves through your link.' },
      { title: 'Income varies week to week', description: 'See what\'s coming before it arrives. Forecast your income based on your client base.' }
    ],
    features: [
      { title: 'Deposit Protection', description: 'Collect $10-25 deposits to protect your time. No more empty chairs from no-shows.', icon: 'money' },
      { title: 'Easy Online Booking', description: 'Clients book through your link. No more DMs or phone tag.', icon: 'link' },
      { title: 'Client Rotation Tracking', description: 'Track who comes every 2 weeks vs every month. Know your regulars\' patterns.', icon: 'users' },
      { title: 'Income Forecasting', description: 'See projected weekly and monthly income based on your booked clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Do barber clients pay deposits?', answer: 'More and more do. A $10-15 deposit for a $30-40 haircut is reasonable and dramatically reduces no-shows.' },
      { question: 'What if a client has an emergency?', answer: 'You can easily refund deposits or credit them to future appointments. Recur gives you full control.' },
      { question: 'Can I use this for a barbershop with multiple barbers?', answer: 'Yes. Each barber can have their own booking page and client list while you manage the shop overall.' }
    ]
  },
  'personal-trainers': {
    slug: 'personal-trainers',
    name: 'Personal Trainer',
    pluralName: 'Personal Trainers',
    title: 'Personal Trainer Booking Software | Client Management for Trainers',
    metaDescription: 'Personal trainer booking software with deposit collection and client management. Reduce cancellations, track client progress, and forecast your income.',
    h1: 'Personal Trainer Booking Software',
    heroSubtitle: 'Protect your sessions from cancellations. Recur helps personal trainers collect deposits, manage client packages, and forecast monthly income.',
    painPoints: [
      { title: 'Last-minute cancellations hurt', description: 'When clients cancel the night before, you can\'t fill that slot. Deposits reduce cancellations by 80%.' },
      { title: 'Tracking packages is tedious', description: 'Who has how many sessions left? Recur tracks client packages and rotations automatically.' },
      { title: 'Income is feast or famine', description: 'January is packed, February is dead. Forecast your income to plan for slow periods.' }
    ],
    features: [
      { title: 'Session Deposits', description: 'Collect deposits for sessions. Clients who pay upfront actually show up.', icon: 'money' },
      { title: 'Package Management', description: 'Track how many sessions each client has remaining. Get alerts when packages run low.', icon: 'users' },
      { title: 'Schedule Automation', description: 'Clients book their preferred days and times. Recur suggests their next session automatically.', icon: 'calendar' },
      { title: 'Revenue Forecasting', description: 'See projected income from recurring clients. Plan your business with confidence.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Should personal trainers require deposits?', answer: 'Absolutely. A deposit equal to one session (or 50% of a session) dramatically reduces last-minute cancellations.' },
      { question: 'How do I handle clients who buy packages?', answer: 'Enter the package details when you add the client. Recur tracks remaining sessions and alerts you when it\'s time to renew.' },
      { question: 'Can clients book recurring weekly sessions?', answer: 'Yes. Set up a client\'s rotation (e.g., every Tuesday and Thursday) and Recur will track their pattern.' }
    ]
  },
  'massage-therapists': {
    slug: 'massage-therapists',
    name: 'Massage Therapist',
    pluralName: 'Massage Therapists',
    title: 'Massage Therapist Booking Software with Deposits | Recur',
    metaDescription: 'Spa and massage booking software with deposit collection. Reduce no-shows, manage recurring clients, and forecast revenue. Built for massage therapists.',
    h1: 'Massage Therapist Booking Software',
    heroSubtitle: 'Protect your table time. Recur helps massage therapists collect deposits, manage client preferences, and maintain a steady income.',
    painPoints: [
      { title: '90-minute no-shows are costly', description: 'An empty table for 90 minutes is significant lost income. Deposits ensure clients value your time.' },
      { title: 'Remembering preferences is hard', description: 'Pressure preferences, problem areas, allergies. Recur stores it all so you can deliver personalized care.' },
      { title: 'Building a steady practice takes time', description: 'See which clients are due for their next session and follow up before they forget.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require 50% deposits for longer sessions. Protect your income from no-shows.', icon: 'money' },
      { title: 'Client Preferences', description: 'Store pressure preferences, health notes, and treatment history for each client.', icon: 'users' },
      { title: 'Rotation Reminders', description: 'Know when clients are overdue. Many clients need gentle reminders to rebook.', icon: 'bell' },
      { title: 'Online Booking', description: 'Clients book through your link. Select service type, duration, and pay deposit.', icon: 'link' }
    ],
    faqs: [
      { question: 'What deposit amount works for massage therapy?', answer: 'Most massage therapists charge 50% of the service or a flat $50 deposit. For 90+ minute sessions, a higher deposit is appropriate.' },
      { question: 'Can I store health intake information?', answer: 'Yes. Recur stores client notes including health considerations, pressure preferences, and areas of focus.' },
      { question: 'How do I handle couples or group bookings?', answer: 'Create a booking for each person. You can note in client profiles that they book together.' }
    ]
  },
  'estheticians': {
    slug: 'estheticians',
    name: 'Esthetician',
    pluralName: 'Estheticians',
    title: 'Esthetician Booking Software | Skincare Scheduling App',
    metaDescription: 'Esthetician booking software with deposit collection. Manage facials, skin treatments, and recurring skincare clients. Start your free trial.',
    h1: 'Esthetician Booking Software',
    heroSubtitle: 'Build your skincare practice with confidence. Recur helps estheticians collect deposits, track treatment plans, and forecast revenue.',
    painPoints: [
      { title: 'Treatment plans require follow-through', description: 'Skincare results require consistency. Track client treatment plans and remind them when it\'s time for their next session.' },
      { title: 'Product recommendations get forgotten', description: 'Keep notes on what products you recommended so you can follow up on results.' },
      { title: 'Building recurring revenue is challenging', description: 'Move from one-off facials to recurring skincare clients. Forecast your income based on client rotation.' }
    ],
    features: [
      { title: 'Treatment Tracking', description: 'Record treatment history, products used, and client reactions for each visit.', icon: 'users' },
      { title: 'Deposit Collection', description: 'Require deposits for premium treatments. Protect your income and reduce no-shows.', icon: 'money' },
      { title: 'Rotation Scheduling', description: 'Track optimal treatment intervals. Remind clients when it\'s time for their next facial.', icon: 'calendar' },
      { title: 'Revenue Forecasting', description: 'See projected income from your recurring facial and treatment clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How often should esthetician clients return?', answer: 'Most facial clients benefit from treatments every 4-6 weeks. Recur helps you track and optimize each client\'s rotation.' },
      { question: 'Can I track product recommendations?', answer: 'Yes. Store notes on products recommended and sold to each client. Great for follow-up and retail tracking.' },
      { question: 'Do estheticians really need deposits?', answer: 'For premium treatments (peels, LED, microneedling), deposits are increasingly common and expected.' }
    ]
  },
  'lash-technicians': {
    slug: 'lash-technicians',
    name: 'Lash Technician',
    pluralName: 'Lash Technicians',
    title: 'Lash Tech Booking App | Lash Artist Scheduling Software',
    metaDescription: 'Lash tech booking software with deposit collection. Manage lash fill rotations, reduce no-shows, and grow your lash business. Start free.',
    h1: 'Lash Tech Booking App',
    heroSubtitle: 'Grow your lash business without the headaches. Recur helps lash techs collect deposits, track fill rotations, and forecast income.',
    painPoints: [
      { title: '3-hour no-shows devastate your day', description: 'Full set appointments are long. A no-show means hours of lost income. Deposits ensure commitment.' },
      { title: 'Fill timing is everything', description: 'Clients need fills every 2-3 weeks. Track who\'s due and send reminders before they let their lashes go.' },
      { title: 'Growing a lash business is hard', description: 'See your income projection based on your client base. Plan for growth with confidence.' }
    ],
    features: [
      { title: 'Deposit Protection', description: 'Require deposits for full sets and long appointments. No more 3-hour no-shows.', icon: 'money' },
      { title: 'Fill Rotation Tracking', description: 'Track each client\'s fill schedule. Know who\'s due for a 2-week vs 3-week fill.', icon: 'calendar' },
      { title: 'Client Preferences', description: 'Store lash style preferences, curl type, and length for each client.', icon: 'users' },
      { title: 'Revenue Forecasting', description: 'See projected monthly income from your recurring lash clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How much deposit should lash techs charge?', answer: 'Most lash techs charge $25-50 for fills and $50-100 for full sets. The longer the appointment, the higher the deposit.' },
      { question: 'How do I track different lash styles?', answer: 'Store preferences in each client\'s profile: classic vs volume, curl type, length map, and any allergies.' },
      { question: 'What\'s the typical fill rotation?', answer: 'Most clients need fills every 2-3 weeks. Recur lets you set custom rotations for each client.' }
    ]
  },
  'nail-technicians': {
    slug: 'nail-technicians',
    name: 'Nail Technician',
    pluralName: 'Nail Technicians',
    title: 'Nail Technician Scheduling Software | Nail Salon Booking',
    metaDescription: 'Nail salon booking software with deposit collection. Manage manicure and pedicure appointments, track client preferences, and reduce no-shows.',
    h1: 'Nail Technician Scheduling Software',
    heroSubtitle: 'Fill your book and protect your time. Recur helps nail techs collect deposits, track rotation schedules, and forecast income.',
    painPoints: [
      { title: 'No-shows hurt your income', description: 'Empty slots can\'t be filled last minute. Deposits ensure clients show up.' },
      { title: 'Remembering preferences takes effort', description: 'Gel vs dip, shape preferences, favorite colors. Store it all in client profiles.' },
      { title: 'Income varies seasonally', description: 'Holiday seasons are busy, January is slow. Forecast your income to plan ahead.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require deposits for nail sets and longer appointments. Reduce no-shows significantly.', icon: 'money' },
      { title: 'Client Preferences', description: 'Track nail shape, product preferences, and design history for each client.', icon: 'users' },
      { title: 'Fill Tracking', description: 'Know who needs fills every 2 weeks vs 3 weeks. Send reminders when they\'re due.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Clients book through your link, select services, and pay deposits.', icon: 'link' }
    ],
    faqs: [
      { question: 'Should nail techs require deposits?', answer: 'Yes, especially for nail sets and intricate designs. A $15-25 deposit is standard for most services.' },
      { question: 'How do I handle walk-ins with a booking system?', answer: 'Recur is for managing your regular clients. You can still accept walk-ins for open slots.' },
      { question: 'Can clients see my availability?', answer: 'You control what availability you show on your booking page.' }
    ]
  },
  'tattoo-artists': {
    slug: 'tattoo-artists',
    name: 'Tattoo Artist',
    pluralName: 'Tattoo Artists',
    title: 'Tattoo Artist Booking Software with Deposits | Recur',
    metaDescription: 'Tattoo shop scheduling software with deposit collection. Protect your time from no-shows, manage consultations, and forecast revenue.',
    h1: 'Tattoo Artist Booking Software with Deposits',
    heroSubtitle: 'Protect your time and your art. Recur helps tattoo artists collect deposits, manage consultations, and build a steady client base.',
    painPoints: [
      { title: 'No-shows on big pieces are devastating', description: 'When someone no-shows a 4-hour session, that\'s significant lost income. Deposits ensure commitment.' },
      { title: 'Consultations take time', description: 'Track consultation notes, reference images, and quotes all in one place.' },
      { title: 'Building a waitlist is valuable', description: 'When you\'re booked out, capture interested clients and notify them when slots open.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require $50-200 deposits for sessions. Protect your time from no-shows.', icon: 'money' },
      { title: 'Consultation Tracking', description: 'Store reference images, notes, and quotes for each client project.', icon: 'users' },
      { title: 'Session Management', description: 'Track multi-session projects. Know how many hours remain on large pieces.', icon: 'calendar' },
      { title: 'Revenue Forecasting', description: 'See projected income from booked sessions and recurring clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How much deposit do tattoo artists charge?', answer: 'Most artists charge $50-100 minimum or 20-50% of the quoted price. Larger pieces warrant larger deposits.' },
      { question: 'Are deposits refundable?', answer: 'That\'s your policy to set. Many artists make deposits non-refundable but transferable to rescheduled appointments.' },
      { question: 'Can I track multi-session pieces?', answer: 'Yes. Create notes for ongoing projects and track total hours quoted vs completed.' }
    ]
  },
  'pet-groomers': {
    slug: 'pet-groomers',
    name: 'Pet Groomer',
    pluralName: 'Pet Groomers',
    title: 'Pet Grooming Booking Software | Dog Groomer Scheduling',
    metaDescription: 'Pet grooming booking software with deposit collection. Manage grooming appointments, track pet preferences, and reduce no-shows. Start free.',
    h1: 'Pet Grooming Booking Software',
    heroSubtitle: 'Grow your grooming business with less stress. Recur helps pet groomers collect deposits, track pet profiles, and forecast income.',
    painPoints: [
      { title: 'No-shows disrupt your whole day', description: 'Grooming appointments are tightly scheduled. A no-show throws off everything. Deposits ensure commitment.' },
      { title: 'Remembering every pet is challenging', description: 'Breed, temperament, cut style, health notes. Store it all in pet profiles.' },
      { title: 'Seasonal demand fluctuates', description: 'Summer is busy, winter slows down. Forecast your income to plan for slow periods.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require deposits for grooming appointments. Reduce no-shows and protect your schedule.', icon: 'money' },
      { title: 'Pet Profiles', description: 'Store breed, temperament, grooming preferences, and health notes for each pet.', icon: 'users' },
      { title: 'Grooming Rotation', description: 'Track how often each pet needs grooming. Send reminders when they\'re due.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Pet parents book through your link with service selection and deposit payment.', icon: 'link' }
    ],
    faqs: [
      { question: 'Do pet groomers charge deposits?', answer: 'Increasingly yes. A $15-25 deposit for a $50-80 groom is reasonable and dramatically reduces no-shows.' },
      { question: 'How do I handle multiple pets from one owner?', answer: 'Create a profile for each pet. You can note in the profile that they\'re from the same household.' },
      { question: 'What\'s typical grooming rotation?', answer: 'Most dogs need grooming every 4-8 weeks depending on breed and coat type.' }
    ]
  },
  'therapists': {
    slug: 'therapists',
    name: 'Therapist',
    pluralName: 'Therapists',
    title: 'Therapist Scheduling Software | Private Practice Client Management',
    metaDescription: 'Therapist scheduling software for private practice. Manage appointments, track client sessions, and forecast revenue. HIPAA-friendly booking.',
    h1: 'Therapist Scheduling Software',
    heroSubtitle: 'Focus on your clients, not your calendar. Recur helps therapists manage appointments, track sessions, and build a sustainable practice.',
    painPoints: [
      { title: 'No-shows affect your livelihood', description: 'Therapy sessions are valuable time. Reduce no-shows with commitment deposits.' },
      { title: 'Tracking sessions is tedious', description: 'Who\'s on session 5 of 12? Track client progress and session counts automatically.' },
      { title: 'Building a full caseload takes time', description: 'Forecast your income based on your current client roster and see where you have capacity.' }
    ],
    features: [
      { title: 'Session Management', description: 'Track session counts, frequency, and client progress over time.', icon: 'users' },
      { title: 'Appointment Deposits', description: 'Optional deposits to reduce no-shows. Particularly useful for new clients.', icon: 'money' },
      { title: 'Recurring Scheduling', description: 'Set up recurring weekly or biweekly appointments automatically.', icon: 'calendar' },
      { title: 'Revenue Forecasting', description: 'See projected income from your current caseload.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Should therapists charge deposits?', answer: 'It depends on your practice. Many therapists charge for missed sessions or require card-on-file to reduce no-shows.' },
      { question: 'Is Recur HIPAA compliant?', answer: 'Recur is designed for scheduling and client management. We recommend not storing sensitive health information in the notes field.' },
      { question: 'Can I set up recurring appointments?', answer: 'Yes. Set a client\'s rotation to weekly or biweekly and Recur will track their schedule.' }
    ]
  },
  'consultants': {
    slug: 'consultants',
    name: 'Consultant',
    pluralName: 'Consultants',
    title: 'Consultant Scheduling Software | Business Coach Booking',
    metaDescription: 'Consultant and business coach booking software. Collect deposits, manage client engagements, and forecast revenue. Start your free trial.',
    h1: 'Consultant Scheduling Software',
    heroSubtitle: 'Run your consulting practice professionally. Recur helps consultants collect deposits, manage engagements, and forecast income.',
    painPoints: [
      { title: 'No-shows waste your expertise', description: 'Your time is valuable. Deposits ensure clients are committed to scheduled calls.' },
      { title: 'Tracking engagements is complex', description: 'Multiple clients at different stages. Track where each engagement stands.' },
      { title: 'Revenue fluctuates project to project', description: 'Forecast your income based on ongoing engagements and retainer clients.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require payment upfront for calls and sessions. No more chasing invoices.', icon: 'money' },
      { title: 'Engagement Tracking', description: 'Track project status, hours used, and remaining deliverables for each client.', icon: 'users' },
      { title: 'Online Booking', description: 'Clients book calls through your link. Set available times and let them choose.', icon: 'link' },
      { title: 'Revenue Forecasting', description: 'See projected income from retainers and ongoing engagements.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Do consultants require deposits?', answer: 'Many do. For discovery calls, a small deposit ensures serious inquiries. For ongoing work, deposits or retainers are standard.' },
      { question: 'Can I set different rates for different services?', answer: 'Yes. Create different services (strategy call, coaching session, etc.) each with their own price.' },
      { question: 'How does forecasting work for project-based work?', answer: 'Track ongoing engagements and their expected value. Recur helps you see your projected income.' }
    ]
  },
  'auto-detailers': {
    slug: 'auto-detailers',
    name: 'Auto Detailer',
    pluralName: 'Auto Detailers',
    title: 'Auto Detailing Booking Software | Mobile Detailer Scheduling',
    metaDescription: 'Auto detailing booking software with deposit collection. Schedule appointments, manage recurring clients, and grow your detailing business.',
    h1: 'Auto Detailing Booking Software',
    heroSubtitle: 'Grow your detailing business with less hassle. Recur helps auto detailers collect deposits, manage schedules, and forecast income.',
    painPoints: [
      { title: 'No-shows on mobile jobs are costly', description: 'Driving to a location for a no-show wastes time and gas. Deposits ensure clients are serious.' },
      { title: 'Managing recurring maintenance clients', description: 'Track who gets monthly washes vs quarterly details. Know who\'s due for service.' },
      { title: 'Seasonal demand varies', description: 'Spring is busy, winter slows down. Forecast your income to plan ahead.' }
    ],
    features: [
      { title: 'Deposit Collection', description: 'Require deposits for detailing appointments. Protect your time from no-shows.', icon: 'money' },
      { title: 'Vehicle Profiles', description: 'Store vehicle type, size, and service history for each client.', icon: 'users' },
      { title: 'Service Rotation', description: 'Track maintenance schedules. Know which clients need monthly vs quarterly service.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Clients book through your link, select services, and pay deposits.', icon: 'link' }
    ],
    faqs: [
      { question: 'How much deposit for auto detailing?', answer: 'Most detailers charge $25-50 deposits for standard details and $50-100 for premium or ceramic coating services.' },
      { question: 'Can I manage mobile detailing routes?', answer: 'Recur helps you manage appointments and client info. You can note locations in client profiles.' },
      { question: 'How do I handle fleet or recurring accounts?', answer: 'Set up recurring rotations for each vehicle. Great for clients who want monthly maintenance.' }
    ]
  }
};

interface IndustryLandingPageProps {
  industrySlug: string;
  onSignUp: () => void;
  onDemo: () => void;
  onBack: () => void;
}

const IconComponent: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-6 h-6" }) => {
  switch (icon) {
    case 'calendar':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
        </svg>
      );
    case 'money':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'link':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    default:
      return null;
  }
};

export const IndustryLandingPage: React.FC<IndustryLandingPageProps> = ({
  industrySlug,
  onSignUp,
  onDemo,
  onBack
}) => {
  const config = INDUSTRY_CONFIGS[industrySlug];

  // Update page title and meta description for SEO
  useEffect(() => {
    if (config) {
      document.title = config.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', config.metaDescription);
      }
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://bookrecur.com/for/${config.slug}`);
      }
    }
  }, [config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-serif text-maroon mb-4">Page Not Found</h1>
          <p className="text-maroon/60 mb-6">This industry page doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-3 text-maroon">
            <div className="w-10 h-10 bg-gradient-to-br from-maroon to-maroon/80 rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-lg">R</span>
            </div>
            <span className="font-serif text-2xl hidden sm:inline">Recur</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onDemo}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-[15px] font-medium text-maroon hover:opacity-70"
          >
            Demo
          </button>
          <button
            onClick={onSignUp}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-sm sm:text-[15px] font-bold shadow-sm hover:bg-maroon/90 transition-colors"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-wider text-maroon/60 mb-4">
            For {config.pluralName}
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-maroon mb-6 leading-tight">
            {config.h1}
          </h1>
          <p className="text-lg sm:text-xl text-maroon/70 mb-8 max-w-2xl mx-auto">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignUp}
              className="w-full sm:w-auto px-8 py-4 bg-maroon text-white rounded-full text-lg font-bold shadow-xl hover:bg-maroon/90 transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={onDemo}
              className="text-maroon/60 hover:text-maroon text-sm font-medium underline underline-offset-4"
            >
              See the demo first
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-center text-maroon mb-12">
            Sound familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {config.painPoints.map((point, index) => (
              <div key={index} className="p-6 sm:p-8 bg-cream rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-3">{point.title}</h3>
                <p className="text-maroon/70">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-center text-maroon mb-4">
            How Recur helps {config.pluralName.toLowerCase()}
          </h2>
          <p className="text-center text-maroon/60 mb-12 max-w-2xl mx-auto">
            Everything you need to run your business professionally
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {config.features.map((feature, index) => (
              <div key={index} className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-[#fff38a] rounded-xl flex items-center justify-center text-maroon flex-shrink-0">
                  <IconComponent icon={feature.icon} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-maroon mb-2">{feature.title}</h3>
                  <p className="text-maroon/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {config.testimonial && (
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-xl sm:text-2xl font-serif text-maroon mb-6 italic">
              "{config.testimonial.quote}"
            </blockquote>
            <div>
              <p className="font-bold text-maroon">{config.testimonial.author}</p>
              <p className="text-maroon/60 text-sm">{config.testimonial.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-center text-maroon mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {config.faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-maroon mb-3">{faq.question}</h3>
                <p className="text-maroon/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-maroon text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-serif mb-6">
            Ready to grow your {config.name.toLowerCase()} business?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Start your free trial today. No credit card required.
          </p>
          <button
            onClick={onSignUp}
            className="px-8 py-4 bg-[#fff38a] text-maroon rounded-full text-lg font-bold shadow-xl hover:bg-[#fff38a]/90 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-sm">R</span>
            </div>
            <span className="text-maroon/60 text-sm">Recur - Booking software for service professionals</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={onBack} className="text-maroon/60 hover:text-maroon">Home</button>
            <a href="/about" className="text-maroon/60 hover:text-maroon">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndustryLandingPage;
