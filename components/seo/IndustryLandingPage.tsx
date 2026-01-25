import React, { useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  injectSchema,
  removeSchema
} from './schemaHelpers';

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
  relatedIndustries?: string[]; // Slugs of related industries for internal linking
}

// Industry configurations with expanded FAQs and mechanism-based messaging
export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'hair-stylists': {
    slug: 'hair-stylists',
    name: 'Hair Stylist',
    pluralName: 'Hair Stylists',
    title: 'Salon Booking Software with Deposits | Recur for Hair Stylists',
    metaDescription: 'Salon booking software built for hair stylists. Collect deposits to reduce no-shows, forecast your income, and manage recurring clients. Start your free trial today.',
    h1: 'Salon Booking Software with Deposits',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track client rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows are stealing $500+/month from your business', description: 'Empty chairs mean lost income you can\'t get back. Collect deposits when clients book to ensure they show up.' },
      { title: 'You shouldn\'t have to guess what you\'ll make next month', description: 'See your projected income based on client rotations. Know what\'s coming before it arrives.' },
      { title: 'Every week without a system, you\'re losing clients to competitors who follow up', description: 'When regulars go too long without booking, you lose them. Get alerts when clients are overdue.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require deposits when clients book online. Payments go directly to your Stripe account.', icon: 'money' },
      { title: 'Predictable Income Dashboard', description: 'See projected income for the month, quarter, and year based on your client rotation schedules.', icon: 'chart' },
      { title: 'Never Lose a Recurring Client', description: 'Know which clients come every 4 weeks vs every 8 weeks. Plan your schedule around their patterns.', icon: 'calendar' },
      { title: 'Online Booking Page', description: 'Share your personalized booking link. Clients pick services, times, and pay deposits without back-and-forth.', icon: 'link' }
    ],
    faqs: [
      { question: 'How much should I charge for salon appointment deposits?', answer: 'Most stylists charge 20-50% of the service price or a flat $25-50 deposit. Recur lets you set either a fixed amount or percentage.' },
      { question: 'Will clients actually pay deposits to book?', answer: 'Yes. Clients who pay deposits are committed clients. You may see fewer bookings initially, but almost zero no-shows. Most stylists report this increases their actual revenue.' },
      { question: 'How does revenue forecasting work for salons?', answer: 'Enter each client\'s rotation schedule (e.g., color every 8 weeks, cuts every 6 weeks). Recur calculates their annual value and projects your income month by month.' },
      { question: 'Can clients book without paying a deposit?', answer: 'You control this. You can require deposits for new clients only, for certain services, or make deposits optional.' },
      { question: 'How do I handle last-minute cancellations as a hairstylist?', answer: 'Recur\'s deposit system protects you from last-minute cancellations. If a client cancels within 24-48 hours, you keep the deposit. Set your own cancellation policy and let the system enforce it.' },
      { question: 'What\'s a fair deposit policy for color appointments?', answer: 'For color services that take 2+ hours, most stylists charge 50% or a flat $50-75 deposit. This protects your time investment and ensures clients are committed to their appointment.' },
      { question: 'How do I build a recurring client base as a new stylist?', answer: 'Track every client\'s rotation pattern in Recur. Set reminders when they\'re due, and watch your revenue become more predictable as you build relationships with clients who return regularly.' }
    ],
    testimonial: {
      quote: 'I stopped losing $500/month to no-shows the first month I started collecting deposits. Recur paid for itself immediately.',
      author: 'Jessica M.',
      role: 'Independent Hair Stylist, Atlanta'
    },
    relatedIndustries: ['barbers', 'estheticians', 'nail-technicians']
  },
  'barbers': {
    slug: 'barbers',
    name: 'Barber',
    pluralName: 'Barbers',
    title: 'Barber Shop Booking App with Payment Processing | Recur',
    metaDescription: 'Barbershop scheduling software that collects deposits and reduces no-shows. Perfect for independent barbers and barbershop owners. Start free.',
    h1: 'Barber Shop Booking App',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track client rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows are stealing your income', description: 'When clients don\'t show, that\'s money you can\'t get back. Deposits ensure commitment.' },
      { title: 'You shouldn\'t have to guess what you\'ll make this week', description: 'Stop texting clients to remind them to book. Let them book themselves and see your projected income.' },
      { title: 'Every empty slot costs you money', description: 'See what\'s coming before it arrives. Forecast your income based on your client base.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Collect $10-25 deposits to protect your time. No more empty chairs from no-shows.', icon: 'money' },
      { title: 'Easy Online Booking', description: 'Clients book through your link. No more DMs or phone tag.', icon: 'link' },
      { title: 'Never Lose a Recurring Client', description: 'Track who comes every 2 weeks vs every month. Know your regulars\' patterns.', icon: 'users' },
      { title: 'Predictable Income Dashboard', description: 'See projected weekly and monthly income based on your booked clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Do barber clients pay deposits?', answer: 'More and more do. A $10-15 deposit for a $30-40 haircut is reasonable and dramatically reduces no-shows.' },
      { question: 'What if a client has an emergency?', answer: 'You can easily refund deposits or credit them to future appointments. Recur gives you full control.' },
      { question: 'Can I use this for a barbershop with multiple barbers?', answer: 'Yes. Each barber can have their own booking page and client list while you manage the shop overall.' },
      { question: 'Should barbers charge deposits for haircuts?', answer: 'Absolutely. Even a small $10-15 deposit reduces no-shows by 80% or more. Clients who aren\'t willing to put down a deposit often weren\'t going to show up anyway.' },
      { question: 'How do I get clients to rebook regularly?', answer: 'Recur tracks each client\'s rotation pattern and alerts you when they\'re overdue. You can also see your projected income drop when clients fall off schedule.' },
      { question: 'What\'s the best way to handle walk-ins vs appointments?', answer: 'Recur is designed for appointment-based booking. You can still accept walk-ins for open slots, but having clients book ahead with deposits protects your income.' }
    ],
    relatedIndustries: ['hair-stylists', 'tattoo-artists', 'auto-detailers']
  },
  'personal-trainers': {
    slug: 'personal-trainers',
    name: 'Personal Trainer',
    pluralName: 'Personal Trainers',
    title: 'Personal Trainer Booking Software | Client Management for Trainers',
    metaDescription: 'Personal trainer booking software with deposit collection and client management. Reduce cancellations, track client progress, and forecast your income.',
    h1: 'Personal Trainer Booking Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track client sessions, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'Last-minute cancellations are stealing your income', description: 'When clients cancel the night before, you can\'t fill that slot. Deposits reduce cancellations by 80%.' },
      { title: 'You shouldn\'t have to guess what you\'ll make next month', description: 'Who has how many sessions left? Recur tracks client packages and rotations automatically.' },
      { title: 'Income feast or famine is exhausting', description: 'January is packed, February is dead. Forecast your income to plan for slow periods.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Collect deposits for sessions. Clients who pay upfront actually show up.', icon: 'money' },
      { title: 'Package Management', description: 'Track how many sessions each client has remaining. Get alerts when packages run low.', icon: 'users' },
      { title: 'Never Lose a Recurring Client', description: 'Clients book their preferred days and times. Recur suggests their next session automatically.', icon: 'calendar' },
      { title: 'Predictable Income Dashboard', description: 'See projected income from recurring clients. Plan your business with confidence.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Should personal trainers require deposits?', answer: 'Absolutely. A deposit equal to one session (or 50% of a session) dramatically reduces last-minute cancellations.' },
      { question: 'How do I handle clients who buy packages?', answer: 'Enter the package details when you add the client. Recur tracks remaining sessions and alerts you when it\'s time to renew.' },
      { question: 'Can clients book recurring weekly sessions?', answer: 'Yes. Set up a client\'s rotation (e.g., every Tuesday and Thursday) and Recur will track their pattern.' },
      { question: 'How do I handle client cancellations as a personal trainer?', answer: 'Set your cancellation policy in Recur. If a client cancels within 24 hours, you can keep the deposit or apply it to their next session.' },
      { question: 'What deposit percentage should I charge for training sessions?', answer: 'Most trainers charge 50% or one full session price as a deposit. For package deals, require payment upfront for the full package.' },
      { question: 'How do I predict monthly income as a personal trainer?', answer: 'Recur calculates your projected income based on recurring client schedules and package values. You\'ll see exactly what\'s coming each month.' }
    ],
    relatedIndustries: ['massage-therapists', 'therapists', 'consultants']
  },
  'massage-therapists': {
    slug: 'massage-therapists',
    name: 'Massage Therapist',
    pluralName: 'Massage Therapists',
    title: 'Massage Therapist Booking Software with Deposits | Recur',
    metaDescription: 'Spa and massage booking software with deposit collection. Reduce no-shows, manage recurring clients, and forecast revenue. Built for massage therapists.',
    h1: 'Massage Therapist Booking Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track client rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: '90-minute no-shows are devastating', description: 'An empty table for 90 minutes is significant lost income. Deposits ensure clients value your time.' },
      { title: 'You shouldn\'t have to remember every preference', description: 'Pressure preferences, problem areas, allergies. Recur stores it all so you can deliver personalized care.' },
      { title: 'Building a steady practice takes too long', description: 'See which clients are due for their next session and follow up before they forget.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require 50% deposits for longer sessions. Protect your income from no-shows.', icon: 'money' },
      { title: 'Client Preferences', description: 'Store pressure preferences, health notes, and treatment history for each client.', icon: 'users' },
      { title: 'Never Lose a Recurring Client', description: 'Know when clients are overdue. Many clients need gentle reminders to rebook.', icon: 'bell' },
      { title: 'Online Booking', description: 'Clients book through your link. Select service type, duration, and pay deposit.', icon: 'link' }
    ],
    faqs: [
      { question: 'What deposit amount works for massage therapy?', answer: 'Most massage therapists charge 50% of the service or a flat $50 deposit. For 90+ minute sessions, a higher deposit is appropriate.' },
      { question: 'Can I store health intake information?', answer: 'Yes. Recur stores client notes including health considerations, pressure preferences, and areas of focus.' },
      { question: 'How do I handle couples or group bookings?', answer: 'Create a booking for each person. You can note in client profiles that they book together.' },
      { question: 'What\'s the typical rotation for massage clients?', answer: 'Most regular clients benefit from massage every 2-4 weeks. Recur helps you track each client\'s optimal rotation and reminds you when they\'re due.' },
      { question: 'Should I require deposits for existing clients?', answer: 'Yes. Even loyal clients benefit from the commitment a deposit creates. You can set a lower deposit amount for established clients if you prefer.' }
    ],
    relatedIndustries: ['estheticians', 'personal-trainers', 'therapists']
  },
  'estheticians': {
    slug: 'estheticians',
    name: 'Esthetician',
    pluralName: 'Estheticians',
    title: 'Esthetician Booking Software | Skincare Scheduling App',
    metaDescription: 'Esthetician booking software with deposit collection. Manage facials, skin treatments, and recurring skincare clients. Start your free trial.',
    h1: 'Esthetician Booking Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track treatment plans, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'Treatment plans require consistent follow-through', description: 'Skincare results require consistency. Track client treatment plans and remind them when it\'s time for their next session.' },
      { title: 'Product recommendations get forgotten', description: 'Keep notes on what products you recommended so you can follow up on results.' },
      { title: 'Building recurring revenue feels impossible', description: 'Move from one-off facials to recurring skincare clients. Forecast your income based on client rotation.' }
    ],
    features: [
      { title: 'Treatment Tracking', description: 'Record treatment history, products used, and client reactions for each visit.', icon: 'users' },
      { title: 'No-Show Protection', description: 'Require deposits for premium treatments. Protect your income and reduce no-shows.', icon: 'money' },
      { title: 'Never Lose a Recurring Client', description: 'Track optimal treatment intervals. Remind clients when it\'s time for their next facial.', icon: 'calendar' },
      { title: 'Predictable Income Dashboard', description: 'See projected income from your recurring facial and treatment clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How often should esthetician clients return?', answer: 'Most facial clients benefit from treatments every 4-6 weeks. Recur helps you track and optimize each client\'s rotation.' },
      { question: 'Can I track product recommendations?', answer: 'Yes. Store notes on products recommended and sold to each client. Great for follow-up and retail tracking.' },
      { question: 'Do estheticians really need deposits?', answer: 'For premium treatments (peels, LED, microneedling), deposits are increasingly common and expected.' },
      { question: 'How do I build a treatment plan for clients?', answer: 'Note their skin concerns and goals in their profile. Track their treatment history and results to adjust future recommendations.' },
      { question: 'What\'s a fair deposit for chemical peels or advanced treatments?', answer: 'For treatments over $100, most estheticians charge 50% or a flat $50-75 deposit. This protects your time and ensures client commitment.' }
    ],
    relatedIndustries: ['lash-technicians', 'nail-technicians', 'massage-therapists']
  },
  'lash-technicians': {
    slug: 'lash-technicians',
    name: 'Lash Technician',
    pluralName: 'Lash Technicians',
    title: 'Lash Tech Booking App | Lash Artist Scheduling Software',
    metaDescription: 'Lash tech booking software with deposit collection. Manage lash fill rotations, reduce no-shows, and grow your lash business. Start free.',
    h1: 'Lash Tech Booking App',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track fill rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: '3-hour no-shows devastate your day', description: 'Full set appointments are long. A no-show means hours of lost income. Deposits ensure commitment.' },
      { title: 'Fill timing is everything', description: 'Clients need fills every 2-3 weeks. Track who\'s due and send reminders before they let their lashes go.' },
      { title: 'Growing a lash business feels overwhelming', description: 'See your income projection based on your client base. Plan for growth with confidence.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require deposits for full sets and long appointments. No more 3-hour no-shows.', icon: 'money' },
      { title: 'Never Lose a Recurring Client', description: 'Track each client\'s fill schedule. Know who\'s due for a 2-week vs 3-week fill.', icon: 'calendar' },
      { title: 'Client Preferences', description: 'Store lash style preferences, curl type, and length for each client.', icon: 'users' },
      { title: 'Predictable Income Dashboard', description: 'See projected monthly income from your recurring lash clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How much deposit should lash techs charge?', answer: 'Most lash techs charge $25-50 for fills and $50-100 for full sets. The longer the appointment, the higher the deposit.' },
      { question: 'How do I track different lash styles?', answer: 'Store preferences in each client\'s profile: classic vs volume, curl type, length map, and any allergies.' },
      { question: 'What\'s the typical fill rotation?', answer: 'Most clients need fills every 2-3 weeks. Recur lets you set custom rotations for each client.' },
      { question: 'How do I prevent clients from letting their lashes go too long?', answer: 'Recur alerts you when clients are overdue for their fill. You can reach out before they decide to remove their lashes entirely.' },
      { question: 'Should I charge more deposit for first-time clients?', answer: 'Yes. First-time clients are more likely to no-show. Charging a higher deposit ($50-75) for new clients protects your time.' }
    ],
    relatedIndustries: ['estheticians', 'nail-technicians', 'hair-stylists']
  },
  'nail-technicians': {
    slug: 'nail-technicians',
    name: 'Nail Technician',
    pluralName: 'Nail Technicians',
    title: 'Nail Technician Scheduling Software | Nail Salon Booking',
    metaDescription: 'Nail salon booking software with deposit collection. Manage manicure and pedicure appointments, track client preferences, and reduce no-shows.',
    h1: 'Nail Technician Scheduling Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track fill rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows steal your income', description: 'Empty slots can\'t be filled last minute. Deposits ensure clients show up.' },
      { title: 'Remembering preferences takes mental energy', description: 'Gel vs dip, shape preferences, favorite colors. Store it all in client profiles.' },
      { title: 'Income swings seasonally', description: 'Holiday seasons are busy, January is slow. Forecast your income to plan ahead.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require deposits for nail sets and longer appointments. Reduce no-shows significantly.', icon: 'money' },
      { title: 'Client Preferences', description: 'Track nail shape, product preferences, and design history for each client.', icon: 'users' },
      { title: 'Never Lose a Recurring Client', description: 'Know who needs fills every 2 weeks vs 3 weeks. Send reminders when they\'re due.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Clients book through your link, select services, and pay deposits.', icon: 'link' }
    ],
    faqs: [
      { question: 'Should nail techs require deposits?', answer: 'Yes, especially for nail sets and intricate designs. A $15-25 deposit is standard for most services.' },
      { question: 'How do I handle walk-ins with a booking system?', answer: 'Recur is for managing your regular clients. You can still accept walk-ins for open slots.' },
      { question: 'Can clients see my availability?', answer: 'You control what availability you show on your booking page.' },
      { question: 'What\'s the typical rotation for nail fills?', answer: 'Most clients need fills every 2-3 weeks for acrylics/gel extensions, or 2-4 weeks for gel polish. Track each client\'s pattern in Recur.' },
      { question: 'How do I track design preferences?', answer: 'Add notes and photos to each client\'s profile. Reference their previous designs and preferences for personalized service.' }
    ],
    relatedIndustries: ['lash-technicians', 'estheticians', 'hair-stylists']
  },
  'tattoo-artists': {
    slug: 'tattoo-artists',
    name: 'Tattoo Artist',
    pluralName: 'Tattoo Artists',
    title: 'Tattoo Artist Booking Software with Deposits | Recur',
    metaDescription: 'Tattoo shop scheduling software with deposit collection. Protect your time from no-shows, manage consultations, and forecast revenue.',
    h1: 'Tattoo Artist Booking Software with Deposits',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track sessions, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows on big pieces are devastating', description: 'When someone no-shows a 4-hour session, that\'s significant lost income. Deposits ensure commitment.' },
      { title: 'Consultations take valuable time', description: 'Track consultation notes, reference images, and quotes all in one place.' },
      { title: 'Building a waitlist is essential', description: 'When you\'re booked out, capture interested clients and notify them when slots open.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require $50-200 deposits for sessions. Protect your time from no-shows.', icon: 'money' },
      { title: 'Consultation Tracking', description: 'Store reference images, notes, and quotes for each client project.', icon: 'users' },
      { title: 'Session Management', description: 'Track multi-session projects. Know how many hours remain on large pieces.', icon: 'calendar' },
      { title: 'Predictable Income Dashboard', description: 'See projected income from booked sessions and recurring clients.', icon: 'chart' }
    ],
    faqs: [
      { question: 'How much deposit do tattoo artists charge?', answer: 'Most artists charge $50-100 minimum or 20-50% of the quoted price. Larger pieces warrant larger deposits.' },
      { question: 'Are deposits refundable?', answer: 'That\'s your policy to set. Many artists make deposits non-refundable but transferable to rescheduled appointments.' },
      { question: 'Can I track multi-session pieces?', answer: 'Yes. Create notes for ongoing projects and track total hours quoted vs completed.' },
      { question: 'How do I manage consultations vs actual appointments?', answer: 'Create separate service types for consultations (free or paid) and tattoo sessions. Track each client\'s journey from consult to completion.' },
      { question: 'What if a client wants to reschedule?', answer: 'You can transfer deposits to new dates or enforce your cancellation policy. Recur gives you full control over how you handle rescheduling.' }
    ],
    relatedIndustries: ['barbers', 'hair-stylists', 'pet-groomers']
  },
  'pet-groomers': {
    slug: 'pet-groomers',
    name: 'Pet Groomer',
    pluralName: 'Pet Groomers',
    title: 'Pet Grooming Booking Software | Dog Groomer Scheduling',
    metaDescription: 'Pet grooming booking software with deposit collection. Manage grooming appointments, track pet preferences, and reduce no-shows. Start free.',
    h1: 'Pet Grooming Booking Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track grooming rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows disrupt your whole day', description: 'Grooming appointments are tightly scheduled. A no-show throws off everything. Deposits ensure commitment.' },
      { title: 'Remembering every pet is impossible', description: 'Breed, temperament, cut style, health notes. Store it all in pet profiles.' },
      { title: 'Seasonal demand swings are brutal', description: 'Summer is busy, winter slows down. Forecast your income to plan for slow periods.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require deposits for grooming appointments. Reduce no-shows and protect your schedule.', icon: 'money' },
      { title: 'Pet Profiles', description: 'Store breed, temperament, grooming preferences, and health notes for each pet.', icon: 'users' },
      { title: 'Never Lose a Recurring Client', description: 'Track how often each pet needs grooming. Send reminders when they\'re due.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Pet parents book through your link with service selection and deposit payment.', icon: 'link' }
    ],
    faqs: [
      { question: 'Do pet groomers charge deposits?', answer: 'Increasingly yes. A $15-25 deposit for a $50-80 groom is reasonable and dramatically reduces no-shows.' },
      { question: 'How do I handle multiple pets from one owner?', answer: 'Create a profile for each pet. You can note in the profile that they\'re from the same household.' },
      { question: 'What\'s typical grooming rotation?', answer: 'Most dogs need grooming every 4-8 weeks depending on breed and coat type.' },
      { question: 'How do I track pet temperament and special handling needs?', answer: 'Add detailed notes to each pet\'s profile including behavior, health conditions, and special handling requirements.' },
      { question: 'Can I set different deposit amounts for different pet sizes?', answer: 'Yes. Create different services for small, medium, and large dogs with appropriate deposit amounts for each.' }
    ],
    relatedIndustries: ['auto-detailers', 'massage-therapists', 'personal-trainers']
  },
  'therapists': {
    slug: 'therapists',
    name: 'Therapist',
    pluralName: 'Therapists',
    title: 'Therapist Scheduling Software | Private Practice Client Management',
    metaDescription: 'Therapist scheduling software for private practice. Manage appointments, track client sessions, and forecast revenue. HIPAA-friendly booking.',
    h1: 'Therapist Scheduling Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track sessions, manage your caseload, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows affect your livelihood', description: 'Therapy sessions are valuable time. Reduce no-shows with commitment deposits.' },
      { title: 'Tracking sessions manually is tedious', description: 'Who\'s on session 5 of 12? Track client progress and session counts automatically.' },
      { title: 'Building a full caseload takes forever', description: 'Forecast your income based on your current client roster and see where you have capacity.' }
    ],
    features: [
      { title: 'Session Management', description: 'Track session counts, frequency, and client progress over time.', icon: 'users' },
      { title: 'Appointment Deposits', description: 'Optional deposits to reduce no-shows. Particularly useful for new clients.', icon: 'money' },
      { title: 'Recurring Scheduling', description: 'Set up recurring weekly or biweekly appointments automatically.', icon: 'calendar' },
      { title: 'Predictable Income Dashboard', description: 'See projected income from your current caseload.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Should therapists charge deposits?', answer: 'It depends on your practice. Many therapists charge for missed sessions or require card-on-file to reduce no-shows.' },
      { question: 'Is Recur HIPAA compliant?', answer: 'Recur is designed for scheduling and client management. We recommend not storing sensitive health information in the notes field.' },
      { question: 'Can I set up recurring appointments?', answer: 'Yes. Set a client\'s rotation to weekly or biweekly and Recur will track their schedule.' },
      { question: 'How do I handle insurance-based billing?', answer: 'Recur tracks appointments and can help with scheduling. For insurance billing, integrate with your EHR or billing system.' },
      { question: 'Can clients self-schedule?', answer: 'You control whether clients can book directly or need to request appointments that you approve.' }
    ],
    relatedIndustries: ['consultants', 'personal-trainers', 'massage-therapists']
  },
  'consultants': {
    slug: 'consultants',
    name: 'Consultant',
    pluralName: 'Consultants',
    title: 'Consultant Scheduling Software | Business Coach Booking',
    metaDescription: 'Consultant and business coach booking software. Collect deposits, manage client engagements, and forecast revenue. Start your free trial.',
    h1: 'Consultant Scheduling Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track engagements, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows waste your expertise', description: 'Your time is valuable. Deposits ensure clients are committed to scheduled calls.' },
      { title: 'Tracking engagements manually is chaotic', description: 'Multiple clients at different stages. Track where each engagement stands.' },
      { title: 'Revenue fluctuates wildly', description: 'Forecast your income based on ongoing engagements and retainer clients.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require payment upfront for calls and sessions. No more chasing invoices.', icon: 'money' },
      { title: 'Engagement Tracking', description: 'Track project status, hours used, and remaining deliverables for each client.', icon: 'users' },
      { title: 'Online Booking', description: 'Clients book calls through your link. Set available times and let them choose.', icon: 'link' },
      { title: 'Predictable Income Dashboard', description: 'See projected income from retainers and ongoing engagements.', icon: 'chart' }
    ],
    faqs: [
      { question: 'Do consultants require deposits?', answer: 'Many do. For discovery calls, a small deposit ensures serious inquiries. For ongoing work, deposits or retainers are standard.' },
      { question: 'Can I set different rates for different services?', answer: 'Yes. Create different services (strategy call, coaching session, etc.) each with their own price.' },
      { question: 'How does forecasting work for project-based work?', answer: 'Track ongoing engagements and their expected value. Recur helps you see your projected income.' },
      { question: 'How do I manage retainer clients?', answer: 'Set up recurring appointments and track hours used against their retainer. Get alerts when hours run low.' },
      { question: 'Can I offer package pricing?', answer: 'Yes. Create package services (e.g., "10-hour strategy package") and track hours used for each client.' }
    ],
    relatedIndustries: ['therapists', 'personal-trainers', 'auto-detailers']
  },
  'auto-detailers': {
    slug: 'auto-detailers',
    name: 'Auto Detailer',
    pluralName: 'Auto Detailers',
    title: 'Auto Detailing Booking Software | Mobile Detailer Scheduling',
    metaDescription: 'Auto detailing booking software with deposit collection. Schedule appointments, manage recurring clients, and grow your detailing business.',
    h1: 'Auto Detailing Booking Software',
    heroSubtitle: 'The booking system that shows you exactly what you\'ll make next month. Track service rotations, collect deposits, and finally have predictable income.',
    painPoints: [
      { title: 'No-shows on mobile jobs are costly', description: 'Driving to a location for a no-show wastes time and gas. Deposits ensure clients are serious.' },
      { title: 'Managing recurring clients is a mess', description: 'Track who gets monthly washes vs quarterly details. Know who\'s due for service.' },
      { title: 'Seasonal demand swings hurt', description: 'Spring is busy, winter slows down. Forecast your income to plan ahead.' }
    ],
    features: [
      { title: 'No-Show Protection', description: 'Require deposits for detailing appointments. Protect your time from no-shows.', icon: 'money' },
      { title: 'Vehicle Profiles', description: 'Store vehicle type, size, and service history for each client.', icon: 'users' },
      { title: 'Never Lose a Recurring Client', description: 'Track maintenance schedules. Know which clients need monthly vs quarterly service.', icon: 'calendar' },
      { title: 'Online Booking', description: 'Clients book through your link, select services, and pay deposits.', icon: 'link' }
    ],
    faqs: [
      { question: 'How much deposit for auto detailing?', answer: 'Most detailers charge $25-50 deposits for standard details and $50-100 for premium or ceramic coating services.' },
      { question: 'Can I manage mobile detailing routes?', answer: 'Recur helps you manage appointments and client info. You can note locations in client profiles.' },
      { question: 'How do I handle fleet or recurring accounts?', answer: 'Set up recurring rotations for each vehicle. Great for clients who want monthly maintenance.' },
      { question: 'What\'s typical detailing rotation?', answer: 'Most clients benefit from full details every 3-6 months with wash/wax services monthly. Track each client\'s preferences.' },
      { question: 'Should I charge more for mobile service?', answer: 'That\'s up to you. Create separate services for mobile vs shop-based detailing with different pricing and deposits.' }
    ],
    relatedIndustries: ['pet-groomers', 'barbers', 'consultants']
  }
};

interface IndustryLandingPageProps {
  industrySlug: string;
  onSignUp: () => void;
  onDemo: () => void;
  onBack: () => void;
  onNavigateToIndustry?: (slug: string) => void;
  onNavigateToComparison?: (slug: string) => void;
}

const IconComponent: React.FC<{ icon: string; className?: string }> = ({ icon, className = "w-6 h-6" }) => {
  switch (icon) {
    case 'calendar':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Calendar icon</title>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
        </svg>
      );
    case 'money':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Money icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Chart icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Users icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Bell icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'link':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <title>Link icon</title>
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
  onBack,
  onNavigateToIndustry,
  onNavigateToComparison
}) => {
  const config = INDUSTRY_CONFIGS[industrySlug];

  // Update page title, meta description, and inject schema for SEO
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
      // Set robots meta
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.setAttribute('content', 'index, follow');
      }

      // Inject FAQ schema for rich snippets
      const faqSchema = generateFAQSchema(config.faqs);
      injectSchema('faq-schema', faqSchema);

      // Inject breadcrumb schema
      const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://bookrecur.com' },
        { name: `For ${config.pluralName}`, url: `https://bookrecur.com/for/${config.slug}` }
      ]);
      injectSchema('breadcrumb-schema', breadcrumbSchema);

      // Inject service schema
      const featureNames = config.features.map(f => f.title);
      const serviceSchema = generateServiceSchema(config.pluralName, config.slug, featureNames);
      injectSchema('service-schema', serviceSchema);
    }

    // Cleanup schemas on unmount
    return () => {
      removeSchema('faq-schema');
      removeSchema('breadcrumb-schema');
      removeSchema('service-schema');
    };
  }, [config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-serif text-maroon mb-3 sm:mb-4">Page Not Found</h1>
          <p className="text-sm sm:text-base text-maroon/60 mb-5 sm:mb-6">This industry page doesn't exist.</p>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors active:scale-[0.98]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Get related industries for internal linking
  const relatedIndustries = (config.relatedIndustries || [])
    .map(slug => INDUSTRY_CONFIGS[slug])
    .filter(Boolean);

  // Popular comparisons to link to
  const popularComparisons = [
    { slug: 'acuity-scheduling', name: 'Acuity' },
    { slug: 'calendly', name: 'Calendly' },
    { slug: 'vagaro', name: 'Vagaro' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 md:h-20 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 sm:gap-3 text-maroon">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-base sm:text-lg">R</span>
            </div>
            <span className="font-serif text-xl sm:text-2xl hidden sm:inline">Recur</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={onDemo}
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[15px] font-medium text-maroon hover:opacity-70"
          >
            Demo
          </button>
          <button
            onClick={onSignUp}
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-[15px] font-bold shadow-sm hover:bg-maroon/90 transition-colors active:scale-[0.98]"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: onBack },
            { label: `For ${config.pluralName}` }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 text-center bg-cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-maroon/60 mb-3 sm:mb-4">
            For {config.pluralName}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-maroon mb-4 sm:mb-6 leading-tight px-2">
            {config.h1}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-maroon/70 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onSignUp}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-maroon text-white rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-maroon/90 transition-colors active:scale-[0.98]"
            >
              See Your Predicted Income Free
            </button>
            <button
              onClick={onDemo}
              className="text-maroon/60 hover:text-maroon text-sm font-medium underline underline-offset-4 py-2"
            >
              See the demo first
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-8 sm:mb-10 md:mb-12">
            Sound familiar?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {config.painPoints.map((point, index) => (
              <div key={index} className="p-5 sm:p-6 md:p-8 bg-cream rounded-xl sm:rounded-2xl border border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-maroon mb-2 sm:mb-3">{point.title}</h3>
                <p className="text-sm sm:text-base text-maroon/70 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-3 sm:mb-4">
            The Predictable Income System for {config.pluralName.toLowerCase()}
          </h2>
          <p className="text-center text-sm sm:text-base text-maroon/60 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2">
            Track client rotations → Forecast revenue → Protect with deposits
          </p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {config.features.map((feature, index) => (
              <div key={index} className="p-5 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fff38a] rounded-lg sm:rounded-xl flex items-center justify-center text-maroon flex-shrink-0">
                  <IconComponent icon={feature.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-maroon mb-1.5 sm:mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-maroon/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {config.testimonial && (
        <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center px-2">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif text-maroon mb-4 sm:mb-6 italic leading-relaxed">
              "{config.testimonial.quote}"
            </blockquote>
            <div>
              <p className="font-bold text-maroon text-sm sm:text-base">{config.testimonial.author}</p>
              <p className="text-maroon/60 text-xs sm:text-sm">{config.testimonial.role}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-8 sm:mb-10 md:mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {config.faqs.map((faq, index) => (
              <div key={index} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                <h3 className="font-bold text-maroon mb-2 sm:mb-3 text-sm sm:text-base">{faq.question}</h3>
                <p className="text-maroon/70 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Industries Section - Internal Linking */}
      {relatedIndustries.length > 0 && (
        <section className="py-10 sm:py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
              See how Recur helps other professionals
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedIndustries.map((related) => (
                <button
                  key={related.slug}
                  onClick={() => onNavigateToIndustry?.(related.slug)}
                  className="px-4 py-2 bg-cream text-maroon rounded-lg hover:bg-maroon/10 transition-colors text-sm font-medium"
                >
                  For {related.pluralName}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Links Section - Internal Linking */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
            Compare Recur to alternatives
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularComparisons.map((comp) => (
              <button
                key={comp.slug}
                onClick={() => onNavigateToComparison?.(comp.slug)}
                className="px-4 py-2 bg-white text-maroon rounded-lg hover:bg-maroon/5 transition-colors text-sm font-medium border border-slate-200"
              >
                Recur vs {comp.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-maroon text-white text-center">
        <div className="max-w-3xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-serif mb-4 sm:mb-6 leading-snug">
            Ready to know what you'll make next month?
          </h2>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Start your free trial today. No credit card required.
          </p>
          <button
            onClick={onSignUp}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#fff38a] text-maroon rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#fff38a]/90 transition-colors active:scale-[0.98]"
          >
            See Your Predicted Income Free
          </button>
        </div>
      </section>

      {/* Footer with Enhanced Internal Links */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          {/* Industry Quick Links */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-maroon mb-3">Recur for your industry</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
              {Object.values(INDUSTRY_CONFIGS).slice(0, 6).map((industry) => (
                <button
                  key={industry.slug}
                  onClick={() => onNavigateToIndustry?.(industry.slug)}
                  className={`text-maroon/60 hover:text-maroon ${industry.slug === industrySlug ? 'font-bold text-maroon' : ''}`}
                >
                  {industry.pluralName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif text-xs sm:text-sm">R</span>
              </div>
              <span className="text-maroon/60 text-xs sm:text-sm">Recur - Booking software for service professionals</span>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm">
              <button onClick={onBack} className="text-maroon/60 hover:text-maroon py-1">Home</button>
              <a href="/about" className="text-maroon/60 hover:text-maroon py-1">About</a>
              <a href="/privacy" className="text-maroon/60 hover:text-maroon py-1">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndustryLandingPage;
