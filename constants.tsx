import React from 'react';
import { RotationType, IndustryType, Client, Service, PaymentMethod, MissedReason } from './types';

// Payment method options with icons and labels
export const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; color: string }[] = [
  { id: 'cash', label: 'Cash', icon: '💵', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { id: 'card', label: 'Card', icon: '💳', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'zelle', label: 'Zelle', icon: '🏦', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'venmo', label: 'Venmo', icon: '📱', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  { id: 'cashapp', label: 'CashApp', icon: '💲', color: 'bg-lime-100 text-lime-700 border-lime-300' },
  { id: 'check', label: 'Check', icon: '📝', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'stripe', label: 'Stripe', icon: '⚡', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'other', label: 'Other', icon: '📋', color: 'bg-gray-100 text-gray-700 border-gray-300' },
];

// Missed appointment reason options
export const MISSED_REASONS: { id: MissedReason; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'no-show',
    label: 'No-Show',
    description: "Didn't come, no notice",
    icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  },
  {
    id: 'late-cancel',
    label: 'Late Cancel',
    description: 'Cancelled last-minute',
    icon: <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    description: 'Cancelled with notice',
    icon: <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  {
    id: 'rescheduled',
    label: 'Rescheduled',
    description: 'Already rebooked',
    icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
  },
];

export const ROTATION_WEEKS: Record<RotationType, number> = {
  [RotationType.PRIORITY]: 8,
  [RotationType.STANDARD]: 10,
  [RotationType.FLEX]: 12,
  [RotationType.CUSTOM]: 4, // Default custom value
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
    label: 'Hair Stylist',
    icon: '💇‍♀️',
    baseServices: ['Shampoo + Style', 'Cut + Style', 'Color + Cut', 'Color + Cut + Gloss', 'Partial Highlights + Cut', 'Full Highlights + Cut', 'Balayage + Cut', 'Silk Press', 'Color Correction', 'Keratin Treatment', 'Deep Conditioning Treatment'],
    addonServices: ['Deep conditioner', 'Scalp treatment', 'Gloss/Toner refresh', 'Olaplex/Bond treatment', 'Bang trim', 'Blowout upgrade'],
    eventServices: ['Wedding trial', 'Wedding day styling', 'Photoshoot prep', 'Birthday styling', 'Prom/Special event', 'Other event'],
  },
  'barber': {
    label: 'Barber',
    icon: '💈',
    baseServices: ['Fade', 'Taper', 'Buzz Cut', 'Scissor Cut', 'Beard Trim', 'Beard Shape', 'Lineup / Edge Up', 'Hot Towel Shave', 'Kids Cut'],
    addonServices: ['Beard oil treatment', 'Scalp massage', 'Gray blending', 'Eyebrow cleanup', 'Razor line detail', 'Neck shave'],
    eventServices: ['Wedding grooming', 'Prom prep', 'Photoshoot prep', 'Event grooming'],
  },
  'personal-trainer': {
    label: 'Personal Trainer',
    icon: '💪',
    baseServices: ['1-on-1 Session', 'Partner Session', 'Group Session (small)', 'Assessment', 'Program Design'],
    addonServices: ['Nutrition plan', 'Body composition scan', 'Recovery session', 'Video form check'],
    eventServices: ['Competition prep', 'Wedding prep', 'Photoshoot prep', 'Reunion/vacation prep'],
  },
  'massage-therapist': {
    label: 'Massage Therapist',
    icon: '💆',
    baseServices: ['60-min Massage', '90-min Massage', '30-min Focus Session', 'Couples Massage', 'Deep Tissue', 'Swedish Massage'],
    addonServices: ['Hot stones', 'Aromatherapy', 'CBD upgrade', 'Cupping'],
    eventServices: ['Bridal party', 'Corporate event', 'Sports event recovery'],
  },
  'esthetician': {
    label: 'Esthetician',
    icon: '✨',
    baseServices: ['Basic Facial', 'Signature Facial', 'Chemical Peel', 'Microdermabrasion', 'Dermaplaning', 'HydraFacial'],
    addonServices: ['LED therapy', 'Extractions', 'Mask upgrade', 'Eye treatment', 'Lip treatment'],
    eventServices: ['Bridal prep', 'Event prep', 'Photoshoot prep'],
  },
  'lash-technician': {
    label: 'Lash Technician',
    icon: '👁️',
    baseServices: ['Classic Full Set', 'Volume Full Set', 'Hybrid Full Set', 'Classic Fill', 'Volume Fill', 'Hybrid Fill', 'Lash Lift', 'Lash Tint', 'Lash Lift + Tint'],
    addonServices: ['Lash bath', 'Under-eye treatment', 'Colored lashes', 'Bottom lashes'],
    eventServices: ['Bridal lashes', 'Event lashes', 'Photoshoot lashes'],
  },
  'nail-technician': {
    label: 'Nail Technician',
    icon: '💅',
    baseServices: ['Classic Manicure', 'Gel Manicure', 'Acrylic Full Set', 'Acrylic Fill', 'Dip Powder', 'Classic Pedicure', 'Gel Pedicure', 'Spa Pedicure'],
    addonServices: ['Nail art', 'Paraffin treatment', 'Extended massage', 'Cuticle treatment', 'Chrome/specialty finish', 'Nail repair'],
    eventServices: ['Bridal nails', 'Prom nails', 'Event nails', 'Nail party'],
  },
  'tattoo-artist': {
    label: 'Tattoo Artist',
    icon: '🎨',
    baseServices: ['Small Tattoo (1-2 hrs)', 'Medium Tattoo (2-4 hrs)', 'Large Tattoo (4+ hrs)', 'Touch-up', 'Cover-up Consultation', 'Custom Design Session'],
    addonServices: ['Color pack upgrade', 'Fine line detail', 'Aftercare kit', 'Design revision'],
    eventServices: ['Memorial piece', 'Matching tattoos', 'Group booking'],
  },
  'pet-groomer': {
    label: 'Pet Groomer',
    icon: '🐕',
    baseServices: ['Bath & Brush', 'Full Groom', 'Puppy Groom', 'Nail Trim', 'De-shedding Treatment', 'Teeth Brushing', 'Sanitary Trim', 'Face Trim'],
    addonServices: ['Flea treatment', 'De-matting', 'Paw balm', 'Cologne', 'Teeth cleaning', 'Ear cleaning', 'Blueberry facial'],
    eventServices: ['Show prep', 'Holiday styling', 'Photoshoot prep'],
  },
  'therapist-counselor': {
    label: 'Therapist / Counselor',
    icon: '🧠',
    baseServices: ['Individual Session (50 min)', 'Extended Session (80 min)', 'Couples Session', 'Family Session', 'Initial Assessment'],
    addonServices: ['Between-session support', 'Assessment/testing', 'Letter/documentation'],
    eventServices: ['Intensive session', 'Crisis support'],
  },
  'consultant-coach': {
    label: 'Consultant / Coach',
    icon: '💼',
    baseServices: ['Strategy Session (1 hr)', 'Half-day Intensive', 'Full-day Workshop', 'Monthly Retainer'],
    addonServices: ['Rush delivery', 'Additional revisions', 'Travel', 'Async support'],
    eventServices: ['Speaking engagement', 'Team workshop', 'Annual planning'],
  },
  'auto-detailer': {
    label: 'Auto Detailer',
    icon: '🚗',
    baseServices: ['Exterior Wash', 'Interior Clean', 'Full Detail', 'Paint Correction', 'Ceramic Coating', 'Engine Bay Clean', 'Express Detail'],
    addonServices: ['Leather conditioning', 'Headlight restoration', 'Odor removal', 'Pet hair removal', 'Clay bar treatment', 'Wheel coating'],
    eventServices: ['Pre-sale detail', 'Show prep', 'Wedding car prep'],
  },
  'other': {
    label: 'Other (Custom)',
    icon: '📋',
    baseServices: ['Service 1', 'Service 2', 'Service 3'],
    addonServices: ['Add-on 1', 'Add-on 2'],
    eventServices: ['Event 1'],
  },
};

// Industry-specific intake questions for client intake form
export const INDUSTRY_INTAKE_QUESTIONS: Record<IndustryType, {
  lifestyle: {
    timeQuestion: { label: string; placeholder: string };
    concernsLabel: string;
    concernsPlaceholder: string;
    toolsQuestion?: { label: string; options: string[] };
  };
  goals: {
    mainGoalQuestion: string;
    mainGoalPlaceholder: string;
    showColorFields: boolean;
    secondaryQuestion?: { label: string; options: string[] };
    tertiaryQuestion?: { label: string; placeholder: string };
  };
}> = {
  'hair-stylist': {
    lifestyle: {
      timeQuestion: { label: 'How much time on your hair each morning?', placeholder: '15-20 minutes' },
      concernsLabel: 'Concerns / Allergies',
      concernsPlaceholder: 'Sensitive scalp, allergic to PPD...',
      toolsQuestion: { label: 'Heat tools used regularly?', options: ['Blow dryer', 'Flat iron', 'Curling iron', 'Hot rollers', 'None'] },
    },
    goals: {
      mainGoalQuestion: "What's your goal for your hair?",
      mainGoalPlaceholder: 'More volume, cover grays, easier maintenance...',
      showColorFields: true,
      secondaryQuestion: { label: 'Maintenance level preference', options: ['Low - easy upkeep', 'Medium - some effort', 'High - willing to style daily'] },
      tertiaryQuestion: { label: 'How do you feel about grow-out?', placeholder: 'Prefer seamless grow-out, okay with visible roots...' },
    },
  },
  'barber': {
    lifestyle: {
      timeQuestion: { label: 'How often do you currently get cuts?', placeholder: 'Every 2 weeks, monthly...' },
      concernsLabel: 'Scalp / Skin Concerns',
      concernsPlaceholder: 'Sensitive skin, ingrown hairs, razor bumps...',
      toolsQuestion: { label: 'Styling products used?', options: ['Pomade', 'Gel', 'Wax', 'Oil', 'None'] },
    },
    goals: {
      mainGoalQuestion: "What's your go-to style?",
      mainGoalPlaceholder: 'Low fade, skin fade, classic taper, textured top...',
      showColorFields: false,
      secondaryQuestion: { label: 'Beard maintenance', options: ['Full beard', 'Stubble', 'Goatee/partial', 'Clean shaven', 'No beard'] },
      tertiaryQuestion: { label: 'Anything specific for upcoming events?', placeholder: 'Wedding next month, job interview, photoshoot...' },
    },
  },
  'personal-trainer': {
    lifestyle: {
      timeQuestion: { label: 'Current workout frequency?', placeholder: '3x per week, mostly cardio' },
      concernsLabel: 'Injuries / Limitations',
      concernsPlaceholder: 'Bad knee, shoulder injury, back issues...',
      toolsQuestion: { label: 'Equipment access?', options: ['Full gym', 'Home gym', 'Minimal equipment', 'Bodyweight only'] },
    },
    goals: {
      mainGoalQuestion: "What's your primary fitness goal?",
      mainGoalPlaceholder: 'Build muscle, lose weight, improve endurance...',
      showColorFields: false,
      secondaryQuestion: { label: 'Target timeline', options: ['3 months', '6 months', '1 year', 'Ongoing'] },
      tertiaryQuestion: { label: 'Previous training experience?', placeholder: 'Used to lift in college, never had a trainer...' },
    },
  },
  'massage-therapist': {
    lifestyle: {
      timeQuestion: { label: 'Daily stress level (1-10)?', placeholder: '7 - desk job, long hours' },
      concernsLabel: 'Medical Conditions / Sensitivities',
      concernsPlaceholder: 'High blood pressure, pregnancy, skin sensitivity...',
      toolsQuestion: { label: 'Problem areas?', options: ['Neck/shoulders', 'Lower back', 'Full body', 'Legs/feet', 'Headaches'] },
    },
    goals: {
      mainGoalQuestion: 'What brings you in for massage?',
      mainGoalPlaceholder: 'Chronic pain relief, stress management, injury recovery...',
      showColorFields: false,
      secondaryQuestion: { label: 'Pressure preference', options: ['Light - relaxation', 'Medium - balanced', 'Deep - therapeutic', 'Varies by area'] },
      tertiaryQuestion: { label: 'What outcome would make this worthwhile?', placeholder: 'Better sleep, less tension headaches, improved mobility...' },
    },
  },
  'esthetician': {
    lifestyle: {
      timeQuestion: { label: 'Current skincare routine time?', placeholder: '5 minutes AM, 10 minutes PM' },
      concernsLabel: 'Sensitivities / Allergies',
      concernsPlaceholder: 'Retinol sensitivity, fragrance allergies, rosacea...',
      toolsQuestion: { label: 'Current products used?', options: ['Drugstore basics', 'Professional products', 'Prescription', 'Natural/organic', 'Minimal'] },
    },
    goals: {
      mainGoalQuestion: "What's your primary skin goal?",
      mainGoalPlaceholder: 'Clear acne, anti-aging, hydration, even tone...',
      showColorFields: false,
      secondaryQuestion: { label: 'Sun exposure', options: ['Daily outdoor work', 'Moderate - some sun', 'Minimal - mostly indoors', 'Always protected'] },
      tertiaryQuestion: { label: "What have you tried that worked/didn't work?", placeholder: 'Salicylic acid helped, vitamin C caused irritation...' },
    },
  },
  'lash-technician': {
    lifestyle: {
      timeQuestion: { label: 'Current lash routine?', placeholder: 'Mascara daily, strip lashes for events, extensions...' },
      concernsLabel: 'Eye Sensitivities / Allergies',
      concernsPlaceholder: 'Allergic to adhesive, sensitive eyes, contact lens wearer...',
      toolsQuestion: { label: 'Lifestyle factors?', options: ['Active/sweaty workouts', 'Side sleeper', 'Rubs eyes often', 'Wears glasses', 'None'] },
    },
    goals: {
      mainGoalQuestion: 'What lash look are you going for?',
      mainGoalPlaceholder: 'Natural enhancement, wispy, dramatic, cat-eye...',
      showColorFields: false,
      secondaryQuestion: { label: 'Fill frequency preference', options: ['Every 2 weeks', 'Every 3 weeks', 'Monthly', 'As needed'] },
      tertiaryQuestion: { label: 'Any past experiences with lashes?', placeholder: 'Had extensions before, loved the volume but...' },
    },
  },
  'nail-technician': {
    lifestyle: {
      timeQuestion: { label: 'How hard are you on your nails?', placeholder: 'Office work, gardening, typing all day...' },
      concernsLabel: 'Nail / Skin Concerns',
      concernsPlaceholder: 'Brittle nails, peeling, allergies to products...',
      toolsQuestion: { label: 'Current nail type?', options: ['Natural only', 'Gel polish', 'Acrylics', 'Dip powder', 'Press-ons'] },
    },
    goals: {
      mainGoalQuestion: 'What nail look do you prefer?',
      mainGoalPlaceholder: 'Short and natural, long acrylics, trendy designs...',
      showColorFields: false,
      secondaryQuestion: { label: 'Shape preference', options: ['Square', 'Round', 'Oval', 'Almond', 'Coffin/Ballerina', 'Stiletto'] },
      tertiaryQuestion: { label: 'Any special requests or inspiration?', placeholder: 'Matching my wedding colors, minimalist French tips...' },
    },
  },
  'tattoo-artist': {
    lifestyle: {
      timeQuestion: { label: 'Any previous tattoos?', placeholder: 'First tattoo, 5+ existing pieces...' },
      concernsLabel: 'Skin / Health Concerns',
      concernsPlaceholder: 'Keloid scarring, blood thinners, skin conditions...',
      toolsQuestion: { label: 'Pain tolerance?', options: ['Low - first timer nervous', 'Medium - can handle it', 'High - experienced', 'Not sure'] },
    },
    goals: {
      mainGoalQuestion: 'What are you looking to get done?',
      mainGoalPlaceholder: 'Sleeve continuation, memorial piece, cover-up...',
      showColorFields: false,
      secondaryQuestion: { label: 'Style preference', options: ['Traditional', 'Fine line', 'Realism', 'Blackwork', 'Watercolor', 'Mixed'] },
      tertiaryQuestion: { label: 'Placement and size ideas?', placeholder: 'Inner forearm, about 4 inches, flowing with existing...' },
    },
  },
  'pet-groomer': {
    lifestyle: {
      timeQuestion: { label: 'How often is your pet currently groomed?', placeholder: 'Monthly, every 6 weeks, only when matted...' },
      concernsLabel: 'Pet Health / Behavior Notes',
      concernsPlaceholder: 'Anxious around clippers, sensitive skin, recent surgery...',
      toolsQuestion: { label: 'Pet type?', options: ['Small dog', 'Medium dog', 'Large dog', 'Cat', 'Other'] },
    },
    goals: {
      mainGoalQuestion: "What's the ideal look for your pet?",
      mainGoalPlaceholder: 'Breed-specific cut, teddy bear face, short all over...',
      showColorFields: false,
      secondaryQuestion: { label: 'Coat type', options: ['Short/smooth', 'Double coat', 'Curly/wavy', 'Long/silky', 'Wire/rough'] },
      tertiaryQuestion: { label: 'Any special instructions or concerns?', placeholder: 'Extra careful around ears, tends to bite, needs sanitary trim...' },
    },
  },
  'therapist-counselor': {
    lifestyle: {
      timeQuestion: { label: 'Current support system?', placeholder: 'Partner, close friends, family nearby...' },
      concernsLabel: 'Important Context',
      concernsPlaceholder: 'Previous therapy experience, medications, specific triggers...',
    },
    goals: {
      mainGoalQuestion: 'What brings you to therapy?',
      mainGoalPlaceholder: 'Anxiety, relationship issues, life transition, grief...',
      showColorFields: false,
      secondaryQuestion: { label: 'Therapy experience', options: ['First time', 'Some previous', 'Extensive history', 'Returning after break'] },
      tertiaryQuestion: { label: 'What would success look like for you?', placeholder: 'Better coping skills, improved relationships, less anxiety...' },
    },
  },
  'consultant-coach': {
    lifestyle: {
      timeQuestion: { label: 'Business stage?', placeholder: 'Startup, growing, established, pivoting...' },
      concernsLabel: 'Current Challenges',
      concernsPlaceholder: 'Team scaling, revenue plateau, work-life balance...',
      toolsQuestion: { label: 'Team size?', options: ['Solo', '2-5 people', '6-20 people', '20+ people'] },
    },
    goals: {
      mainGoalQuestion: "What's your primary business goal?",
      mainGoalPlaceholder: 'Increase revenue, improve systems, leadership development...',
      showColorFields: false,
      secondaryQuestion: { label: 'Engagement preference', options: ['Intensive sprint', 'Ongoing support', 'As-needed consulting', 'Team workshops'] },
      tertiaryQuestion: { label: 'What does success look like in 6 months?', placeholder: '2x revenue, hired team lead, automated operations...' },
    },
  },
  'auto-detailer': {
    lifestyle: {
      timeQuestion: { label: 'How often do you get your vehicle detailed?', placeholder: 'Monthly, quarterly, only before selling...' },
      concernsLabel: 'Vehicle Concerns',
      concernsPlaceholder: 'Paint scratches, pet hair, smoke smell, leather cracking...',
      toolsQuestion: { label: 'Vehicle type?', options: ['Sedan', 'SUV/Crossover', 'Truck', 'Sports car', 'Luxury', 'Motorcycle'] },
    },
    goals: {
      mainGoalQuestion: 'What are you hoping to achieve with this detail?',
      mainGoalPlaceholder: 'Showroom finish, remove dog smell, prep for sale...',
      showColorFields: false,
      secondaryQuestion: { label: 'Priority area', options: ['Exterior only', 'Interior only', 'Both equally', 'Paint correction focus'] },
      tertiaryQuestion: { label: 'Any specific problem areas?', placeholder: 'Coffee stains on seats, water spots on paint, oxidized headlights...' },
    },
  },
  'other': {
    lifestyle: {
      timeQuestion: { label: 'How often do you currently use this service?', placeholder: 'Weekly, monthly, occasionally...' },
      concernsLabel: 'Important Notes',
      concernsPlaceholder: 'Any relevant health, scheduling, or preference notes...',
    },
    goals: {
      mainGoalQuestion: 'What outcome are you hoping for?',
      mainGoalPlaceholder: 'Describe your ideal result...',
      showColorFields: false,
      tertiaryQuestion: { label: 'Anything else we should know?', placeholder: 'Additional context or preferences...' },
    },
  },
};

// Industry-specific sample clients for demo
const createSampleClient = (
  id: string,
  name: string,
  rotation: RotationType,
  rotationWeeks: number,
  baseService: Service,
  annualValue: number,
  nextAppointment: string,
  status: 'confirmed' | 'pending' | 'at-risk'
): Client => ({
  id,
  name,
  phone: '(555) 123-4567',
  email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
  rotation,
  rotationWeeks,
  baseService,
  addOns: [],
  annualValue,
  nextAppointment,
  clientSince: '2024-03-15',
  preferredDays: ['Mon', 'Wed', 'Fri'],
  preferredTime: 'Morning',
  contactMethod: 'Text',
  occupation: '',
  clientFacing: false,
  morningTime: '',
  events: [],
  photographed: 'Rarely',
  concerns: '',
  serviceGoal: '',
  maintenanceLevel: '',
  additionalNotes: '',
  appointments: [
    { date: nextAppointment, service: baseService.name, price: baseService.price, status: 'upcoming' },
  ],
  notes: '',
  status,
});

export const INDUSTRY_SAMPLE_CLIENTS: Record<IndustryType, Client[]> = {
  'hair-stylist': [
    { ...createSampleClient('1', 'Jasmine Carter', RotationType.PRIORITY, 6, { id: 'base-2', name: 'Color + Cut', price: 185, category: 'base' }, 1603, '2026-01-14', 'confirmed'), occupation: 'Marketing Director', serviceGoal: 'Go lighter for summer' },
    { ...createSampleClient('2', 'Lauren Mitchell', RotationType.STANDARD, 8, { id: 'base-1', name: 'Cut + Style', price: 85, category: 'base' }, 553, '2026-01-22', 'confirmed'), occupation: 'Teacher', serviceGoal: 'Keep it healthy and easy' },
    { ...createSampleClient('3', 'Dr. Sarah Chen', RotationType.PRIORITY, 6, { id: 'base-5', name: 'Full Highlights + Cut', price: 285, category: 'base' }, 2470, '2026-01-11', 'confirmed'), occupation: 'Real Estate Agent', serviceGoal: 'Stay bright blonde' },
    { ...createSampleClient('4', 'Sienna West', RotationType.FLEX, 10, { id: 'base-0', name: 'Shampoo + Style', price: 55, category: 'base' }, 286, '2026-01-25', 'pending'), occupation: 'Freelance Writer', serviceGoal: 'Low maintenance' },
    { ...createSampleClient('5', 'Rachel Kim', RotationType.STANDARD, 8, { id: 'base-7', name: 'Silk Press', price: 95, category: 'base' }, 617, '2026-01-15', 'at-risk'), occupation: 'Software Engineer', serviceGoal: 'Healthy, sleek styles' },
  ],
  'barber': [
    { ...createSampleClient('1', 'Marcus Williams', RotationType.PRIORITY, 2, { id: 'base-0', name: 'Fade', price: 35, category: 'base' }, 910, '2026-01-14', 'confirmed'), occupation: 'Account Executive', serviceGoal: 'Fresh fade every 2 weeks' },
    { ...createSampleClient('2', 'Darnell Jackson', RotationType.PRIORITY, 3, { id: 'base-4', name: 'Beard Shape', price: 25, category: 'base' }, 433, '2026-01-18', 'confirmed'), occupation: 'Entrepreneur', serviceGoal: 'Keep the beard tight' },
    { ...createSampleClient('3', 'Tyler Rodriguez', RotationType.STANDARD, 3, { id: 'base-0', name: 'Fade', price: 35, category: 'base' }, 607, '2026-01-20', 'confirmed'), occupation: 'Personal Trainer', serviceGoal: 'Always camera-ready' },
    { ...createSampleClient('4', 'Chris Thompson', RotationType.STANDARD, 4, { id: 'base-3', name: 'Scissor Cut', price: 30, category: 'base' }, 390, '2026-01-25', 'pending'), occupation: 'Software Developer', serviceGoal: 'Classic professional look' },
    { ...createSampleClient('5', 'Andre Mitchell', RotationType.FLEX, 4, { id: 'base-7', name: 'Hot Towel Shave', price: 40, category: 'base' }, 520, '2026-01-22', 'at-risk'), occupation: 'Lawyer', serviceGoal: 'Clean shave for court' },
  ],
  'personal-trainer': [
    { ...createSampleClient('1', 'Michael Torres', RotationType.PRIORITY, 1, { id: 'base-0', name: '1-on-1 Session', price: 85, category: 'base' }, 4420, '2026-01-13', 'confirmed'), occupation: 'VP of Sales', serviceGoal: 'Lose 20 lbs, build strength' },
    { ...createSampleClient('2', 'Amanda Chen', RotationType.PRIORITY, 1, { id: 'base-1', name: 'Partner Session', price: 120, category: 'base' }, 6240, '2026-01-14', 'confirmed'), occupation: 'Attorney', serviceGoal: 'Marathon prep' },
    { ...createSampleClient('3', 'David Park', RotationType.STANDARD, 2, { id: 'base-0', name: '1-on-1 Session', price: 85, category: 'base' }, 2210, '2026-01-18', 'confirmed'), occupation: 'Teacher', serviceGoal: 'Maintain fitness, reduce stress' },
    { ...createSampleClient('4', 'Lisa Johnson', RotationType.FLEX, 4, { id: 'base-0', name: '1-on-1 Session', price: 85, category: 'base' }, 1105, '2026-01-22', 'pending'), occupation: 'Nurse', serviceGoal: 'Wedding prep' },
    { ...createSampleClient('5', 'James Wilson', RotationType.STANDARD, 2, { id: 'base-2', name: 'Group Session (small)', price: 45, category: 'base' }, 1170, '2026-01-15', 'at-risk'), occupation: 'Retired', serviceGoal: 'Stay active, improve mobility' },
  ],
  'massage-therapist': [
    { ...createSampleClient('1', 'Jennifer Adams', RotationType.PRIORITY, 3, { id: 'base-1', name: '90-min Massage', price: 140, category: 'base' }, 2427, '2026-01-16', 'confirmed'), occupation: 'Executive', serviceGoal: 'Chronic neck pain relief' },
    { ...createSampleClient('2', 'Robert Martinez', RotationType.STANDARD, 4, { id: 'base-0', name: '60-min Massage', price: 95, category: 'base' }, 1235, '2026-01-20', 'confirmed'), occupation: 'Construction Manager', serviceGoal: 'Lower back maintenance' },
    { ...createSampleClient('3', 'Sarah Thompson', RotationType.PRIORITY, 2, { id: 'base-0', name: '60-min Massage', price: 95, category: 'base' }, 2470, '2026-01-12', 'confirmed'), occupation: 'Athlete', serviceGoal: 'Sports recovery' },
    { ...createSampleClient('4', 'Michelle Lee', RotationType.FLEX, 6, { id: 'base-1', name: '90-min Massage', price: 140, category: 'base' }, 1213, '2026-01-28', 'pending'), occupation: 'Writer', serviceGoal: 'Stress management' },
    { ...createSampleClient('5', 'Brian Cooper', RotationType.STANDARD, 4, { id: 'base-2', name: '30-min Focus Session', price: 55, category: 'base' }, 715, '2026-01-19', 'at-risk'), occupation: 'Software Dev', serviceGoal: 'Shoulder tension from desk work' },
  ],
  'esthetician': [
    { ...createSampleClient('1', 'Olivia Martinez', RotationType.PRIORITY, 4, { id: 'base-1', name: 'Signature Facial', price: 145, category: 'base' }, 1885, '2026-01-15', 'confirmed'), occupation: 'TV Host', serviceGoal: 'Anti-aging maintenance' },
    { ...createSampleClient('2', 'Jessica Taylor', RotationType.STANDARD, 6, { id: 'base-2', name: 'Chemical Peel', price: 175, category: 'base' }, 1517, '2026-01-19', 'confirmed'), occupation: 'Lawyer', serviceGoal: 'Reduce hyperpigmentation' },
    { ...createSampleClient('3', 'Ashley Davis', RotationType.PRIORITY, 4, { id: 'base-0', name: 'Basic Facial', price: 85, category: 'base' }, 1105, '2026-01-12', 'confirmed'), occupation: 'Real Estate Agent', serviceGoal: 'Clear skin for showings' },
    { ...createSampleClient('4', 'Brittany Wilson', RotationType.FLEX, 8, { id: 'base-1', name: 'Signature Facial', price: 145, category: 'base' }, 942, '2026-01-26', 'pending'), occupation: 'Accountant', serviceGoal: 'Seasonal maintenance' },
    { ...createSampleClient('5', 'Samantha Lee', RotationType.STANDARD, 6, { id: 'base-4', name: 'Dermaplaning', price: 125, category: 'base' }, 1083, '2026-01-18', 'at-risk'), occupation: 'Teacher', serviceGoal: 'Smooth texture' },
  ],
  'lash-technician': [
    { ...createSampleClient('1', 'Madison Brooks', RotationType.PRIORITY, 2, { id: 'base-0', name: 'Classic Full Set', price: 150, category: 'base' }, 3900, '2026-01-14', 'confirmed'), occupation: 'Influencer', serviceGoal: 'Always photo-ready' },
    { ...createSampleClient('2', 'Sophia Anderson', RotationType.PRIORITY, 2, { id: 'base-3', name: 'Classic Fill', price: 65, category: 'base' }, 1690, '2026-01-18', 'confirmed'), occupation: 'Flight Attendant', serviceGoal: 'Low-maintenance glam' },
    { ...createSampleClient('3', 'Emma Johnson', RotationType.STANDARD, 3, { id: 'base-1', name: 'Volume Full Set', price: 200, category: 'base' }, 3467, '2026-01-20', 'confirmed'), occupation: 'Realtor', serviceGoal: 'Dramatic but professional' },
    { ...createSampleClient('4', 'Chloe Williams', RotationType.STANDARD, 3, { id: 'base-4', name: 'Volume Fill', price: 85, category: 'base' }, 1473, '2026-01-25', 'pending'), occupation: 'Nurse', serviceGoal: 'Natural enhancement' },
    { ...createSampleClient('5', 'Ava Martinez', RotationType.FLEX, 4, { id: 'base-6', name: 'Lash Lift', price: 75, category: 'base' }, 975, '2026-01-22', 'at-risk'), occupation: 'Teacher', serviceGoal: 'No-makeup look' },
  ],
  'nail-technician': [
    { ...createSampleClient('1', 'Taylor Swift', RotationType.PRIORITY, 2, { id: 'base-1', name: 'Gel Manicure', price: 45, category: 'base' }, 1170, '2026-01-14', 'confirmed'), occupation: 'Marketing Manager', serviceGoal: 'Always polished for meetings' },
    { ...createSampleClient('2', 'Nicole Brown', RotationType.PRIORITY, 3, { id: 'base-2', name: 'Acrylic Full Set', price: 85, category: 'base' }, 1473, '2026-01-18', 'confirmed'), occupation: 'Hairstylist', serviceGoal: 'Long nails that last' },
    { ...createSampleClient('3', 'Brittany Davis', RotationType.STANDARD, 3, { id: 'base-5', name: 'Classic Pedicure', price: 40, category: 'base' }, 693, '2026-01-20', 'confirmed'), occupation: 'Yoga Instructor', serviceGoal: 'Clean, healthy feet' },
    { ...createSampleClient('4', 'Jessica Miller', RotationType.STANDARD, 2, { id: 'base-4', name: 'Dip Powder', price: 55, category: 'base' }, 1430, '2026-01-22', 'pending'), occupation: 'Lawyer', serviceGoal: 'Chip-free for court' },
    { ...createSampleClient('5', 'Megan Wilson', RotationType.FLEX, 4, { id: 'base-0', name: 'Classic Manicure', price: 30, category: 'base' }, 390, '2026-01-25', 'at-risk'), occupation: 'Writer', serviceGoal: 'Occasional pampering' },
  ],
  'tattoo-artist': [
    { ...createSampleClient('1', 'Jake Thompson', RotationType.CUSTOM, 8, { id: 'base-1', name: 'Medium Tattoo (2-4 hrs)', price: 400, category: 'base' }, 2600, '2026-01-20', 'confirmed'), occupation: 'Musician', serviceGoal: 'Building a sleeve' },
    { ...createSampleClient('2', 'Ryan Mitchell', RotationType.CUSTOM, 12, { id: 'base-2', name: 'Large Tattoo (4+ hrs)', price: 800, category: 'base' }, 3467, '2026-02-15', 'confirmed'), occupation: 'Chef', serviceGoal: 'Back piece sessions' },
    { ...createSampleClient('3', 'Alyssa Garcia', RotationType.FLEX, 16, { id: 'base-0', name: 'Small Tattoo (1-2 hrs)', price: 200, category: 'base' }, 650, '2026-01-25', 'confirmed'), occupation: 'Nurse', serviceGoal: 'Adding small pieces' },
    { ...createSampleClient('4', 'Derek Wang', RotationType.CUSTOM, 6, { id: 'base-3', name: 'Touch-up', price: 100, category: 'base' }, 867, '2026-01-18', 'pending'), occupation: 'Firefighter', serviceGoal: 'Color refresh' },
    { ...createSampleClient('5', 'Samantha Brown', RotationType.FLEX, 20, { id: 'base-0', name: 'Small Tattoo (1-2 hrs)', price: 200, category: 'base' }, 520, '2026-02-10', 'at-risk'), occupation: 'Teacher', serviceGoal: 'Memorial piece' },
  ],
  'pet-groomer': [
    { ...createSampleClient('1', 'Bella (Golden)', RotationType.PRIORITY, 6, { id: 'base-1', name: 'Full Groom', price: 85, category: 'base' }, 737, '2026-01-15', 'confirmed'), occupation: 'Family Pet', serviceGoal: 'Fluffy and clean' },
    { ...createSampleClient('2', 'Max (Poodle)', RotationType.PRIORITY, 4, { id: 'base-1', name: 'Full Groom', price: 95, category: 'base' }, 1235, '2026-01-18', 'confirmed'), occupation: 'Show Dog', serviceGoal: 'Competition ready' },
    { ...createSampleClient('3', 'Luna (Shih Tzu)', RotationType.STANDARD, 6, { id: 'base-1', name: 'Full Groom', price: 75, category: 'base' }, 650, '2026-01-20', 'confirmed'), occupation: 'Family Pet', serviceGoal: 'Puppy cut maintained' },
    { ...createSampleClient('4', 'Cooper (Lab)', RotationType.STANDARD, 8, { id: 'base-0', name: 'Bath & Brush', price: 55, category: 'base' }, 357, '2026-01-28', 'pending'), occupation: 'Family Pet', serviceGoal: 'De-shedding control' },
    { ...createSampleClient('5', 'Daisy (Yorkie)', RotationType.FLEX, 8, { id: 'base-2', name: 'Puppy Groom', price: 65, category: 'base' }, 423, '2026-01-25', 'at-risk'), occupation: 'Senior Dog', serviceGoal: 'Gentle grooming' },
  ],
  'therapist-counselor': [
    { ...createSampleClient('1', 'Emily Watson', RotationType.PRIORITY, 1, { id: 'base-0', name: 'Individual Session (50 min)', price: 175, category: 'base' }, 9100, '2026-01-14', 'confirmed'), occupation: 'Marketing Manager', serviceGoal: 'Anxiety management' },
    { ...createSampleClient('2', 'The Johnsons', RotationType.STANDARD, 2, { id: 'base-2', name: 'Couples Session', price: 225, category: 'base' }, 5850, '2026-01-17', 'confirmed'), occupation: 'Various', serviceGoal: 'Improve communication' },
    { ...createSampleClient('3', 'Kevin Brown', RotationType.PRIORITY, 1, { id: 'base-0', name: 'Individual Session (50 min)', price: 175, category: 'base' }, 9100, '2026-01-13', 'confirmed'), occupation: 'Teacher', serviceGoal: 'Work-life balance' },
    { ...createSampleClient('4', 'Maria Garcia', RotationType.STANDARD, 2, { id: 'base-0', name: 'Individual Session (50 min)', price: 175, category: 'base' }, 4550, '2026-01-21', 'pending'), occupation: 'Nurse', serviceGoal: 'Processing grief' },
    { ...createSampleClient('5', 'Daniel Kim', RotationType.FLEX, 4, { id: 'base-0', name: 'Individual Session (50 min)', price: 175, category: 'base' }, 2275, '2026-01-28', 'at-risk'), occupation: 'Student', serviceGoal: 'Life transition support' },
  ],
  'consultant-coach': [
    { ...createSampleClient('1', 'TechStart Inc', RotationType.PRIORITY, 4, { id: 'base-0', name: 'Strategy Session (1 hr)', price: 350, category: 'base' }, 4550, '2026-01-16', 'confirmed'), occupation: 'Startup', serviceGoal: 'Scale from 10 to 50 employees' },
    { ...createSampleClient('2', 'Green Leaf Agency', RotationType.STANDARD, 4, { id: 'base-3', name: 'Monthly Retainer', price: 2500, category: 'base' }, 30000, '2026-01-20', 'confirmed'), occupation: 'Marketing Agency', serviceGoal: 'Operations optimization' },
    { ...createSampleClient('3', 'Sarah Mitchell', RotationType.PRIORITY, 2, { id: 'base-0', name: 'Strategy Session (1 hr)', price: 350, category: 'base' }, 9100, '2026-01-14', 'confirmed'), occupation: 'Entrepreneur', serviceGoal: 'Launch new product line' },
    { ...createSampleClient('4', 'Bright Future LLC', RotationType.FLEX, 8, { id: 'base-1', name: 'Half-day Intensive', price: 1200, category: 'base' }, 7800, '2026-01-28', 'pending'), occupation: 'Healthcare', serviceGoal: 'Team alignment' },
    { ...createSampleClient('5', 'James Rodriguez', RotationType.STANDARD, 4, { id: 'base-0', name: 'Strategy Session (1 hr)', price: 350, category: 'base' }, 4550, '2026-01-17', 'at-risk'), occupation: 'Executive', serviceGoal: 'Career transition' },
  ],
  'auto-detailer': [
    { ...createSampleClient('1', 'BMW M5 (Mike)', RotationType.PRIORITY, 4, { id: 'base-2', name: 'Full Detail', price: 250, category: 'base' }, 3250, '2026-01-15', 'confirmed'), occupation: 'Executive', serviceGoal: 'Always showroom condition' },
    { ...createSampleClient('2', 'Tesla Model Y (Sarah)', RotationType.STANDARD, 4, { id: 'base-2', name: 'Full Detail', price: 200, category: 'base' }, 2600, '2026-01-20', 'confirmed'), occupation: 'Realtor', serviceGoal: 'Clean for client drives' },
    { ...createSampleClient('3', 'Ford F-150 (Jake)', RotationType.STANDARD, 6, { id: 'base-1', name: 'Interior Clean', price: 120, category: 'base' }, 1040, '2026-01-22', 'confirmed'), occupation: 'Contractor', serviceGoal: 'Keep work truck presentable' },
    { ...createSampleClient('4', 'Porsche 911 (David)', RotationType.PRIORITY, 4, { id: 'base-4', name: 'Ceramic Coating', price: 800, category: 'base' }, 10400, '2026-02-01', 'pending'), occupation: 'Investor', serviceGoal: 'Paint protection' },
    { ...createSampleClient('5', 'Honda Accord (Lisa)', RotationType.FLEX, 8, { id: 'base-0', name: 'Exterior Wash', price: 50, category: 'base' }, 325, '2026-01-28', 'at-risk'), occupation: 'Teacher', serviceGoal: 'Monthly clean' },
  ],
  'other': [
    { ...createSampleClient('1', 'Client A', RotationType.PRIORITY, 4, { id: 'base-0', name: 'Service 1', price: 100, category: 'base' }, 1300, '2026-01-14', 'confirmed'), serviceGoal: 'Regular maintenance' },
    { ...createSampleClient('2', 'Client B', RotationType.STANDARD, 6, { id: 'base-1', name: 'Service 2', price: 150, category: 'base' }, 1300, '2026-01-18', 'confirmed'), serviceGoal: 'Ongoing support' },
    { ...createSampleClient('3', 'Client C', RotationType.FLEX, 8, { id: 'base-0', name: 'Service 1', price: 100, category: 'base' }, 650, '2026-01-25', 'pending'), serviceGoal: 'Occasional service' },
  ],
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