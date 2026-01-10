import React from 'react';
import { RotationType, IndustryType } from './types';

export const ROTATION_WEEKS: Record<RotationType, number> = {
  [RotationType.PRIORITY]: 8,
  [RotationType.STANDARD]: 10,
  [RotationType.FLEX]: 12,
};

// Industry templates for services
export const INDUSTRY_TEMPLATES: Record<IndustryType, {
  label: string;
  icon: string;
  baseServices: string[];
  addonServices: string[];
  eventServices: string[];
}> = {
  'hair-stylist': {
    label: 'Hair Stylist / Barber',
    icon: '💇',
    baseServices: ['Shampoo + Style', 'Cut + Style', 'Color + Cut', 'Color + Cut + Gloss', 'Partial Highlights + Cut', 'Full Highlights + Cut', 'Balayage + Cut', 'Silk Press'],
    addonServices: ['Deep conditioner', 'Scalp treatment', 'Gloss/Toner refresh', 'Olaplex/Bond treatment', 'Bang trim'],
    eventServices: ['Wedding trial', 'Wedding day styling', 'Photoshoot prep', 'Birthday styling', 'Other event'],
  },
  'personal-trainer': {
    label: 'Personal Trainer / Fitness Coach',
    icon: '💪',
    baseServices: ['1-on-1 Session', 'Partner Session', 'Group Session (small)', 'Assessment', 'Program Design'],
    addonServices: ['Nutrition plan', 'Body composition scan', 'Recovery session', 'Video form check'],
    eventServices: ['Competition prep', 'Wedding prep', 'Photoshoot prep', 'Reunion/vacation prep'],
  },
  'massage-therapist': {
    label: 'Massage Therapist',
    icon: '💆',
    baseServices: ['60-min Massage', '90-min Massage', '30-min Focus Session', 'Couples Massage'],
    addonServices: ['Hot stones', 'Aromatherapy', 'CBD upgrade', 'Cupping'],
    eventServices: ['Bridal party', 'Corporate event', 'Sports event recovery'],
  },
  'therapist-counselor': {
    label: 'Therapist / Counselor',
    icon: '🧠',
    baseServices: ['Individual Session (50 min)', 'Extended Session (80 min)', 'Couples Session', 'Family Session', 'Initial Assessment'],
    addonServices: ['Between-session support', 'Assessment/testing', 'Letter/documentation'],
    eventServices: ['Intensive session', 'Crisis support'],
  },
  'esthetician': {
    label: 'Esthetician / Skincare',
    icon: '✨',
    baseServices: ['Basic Facial', 'Signature Facial', 'Chemical Peel', 'Microdermabrasion', 'Dermaplaning'],
    addonServices: ['LED therapy', 'Extractions', 'Mask upgrade', 'Eye treatment'],
    eventServices: ['Bridal prep', 'Event prep', 'Photoshoot prep'],
  },
  'consultant-coach': {
    label: 'Consultant / Coach',
    icon: '💼',
    baseServices: ['Strategy Session (1 hr)', 'Half-day Intensive', 'Full-day Workshop', 'Monthly Retainer'],
    addonServices: ['Rush delivery', 'Additional revisions', 'Travel', 'Async support'],
    eventServices: ['Speaking engagement', 'Team workshop', 'Annual planning'],
  },
  'other': {
    label: 'Other (Custom)',
    icon: '📋',
    baseServices: ['Service 1', 'Service 2', 'Service 3'],
    addonServices: ['Add-on 1', 'Add-on 2'],
    eventServices: ['Event 1'],
  },
};

export const COLORS = {
  primary: '#2d1212', 
  accent: '#fff38a',
  success: '#10b981',
};

// Solar Duotone Bold Style Icons
export const ICONS = {
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2"/>
      <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Alert: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2"/>
      <path d="M12 7V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="12" cy="16.5" r="1.25" fill="currentColor"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="15" rx="4" fill="currentColor" fillOpacity="0.2"/>
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 3V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 3V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2"/>
      <path d="M7 15L10 12L12 14L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 9H17V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="currentColor"/>
    </svg>
  ),
  Layers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sun: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Copy: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="12" height="12" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
};

export const LOGOS = {
  // Elegant cursive R logo mark
  RMark: ({ size = 32, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M30 75 C30 75, 30 45, 30 35 C30 25, 35 15, 50 15 C65 15, 70 25, 65 35 C60 45, 45 45, 40 45 C40 45, 55 55, 75 80"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 15 C50 5, 60 0, 65 10 C70 20, 60 25, 55 22"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  Main: () => (
    <div className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 75 C30 75, 30 45, 30 35 C30 25, 35 15, 50 15 C65 15, 70 25, 65 35 C60 45, 45 45, 40 45 C40 45, 55 55, 75 80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M50 15 C50 5, 60 0, 65 10 C70 20, 60 25, 55 22"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight uppercase">Recur</span>
    </div>
  )
};