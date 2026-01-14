import React, { useState } from 'react';
import { IndustryType, StylistProfile, Service, Client, RotationType, BookingSettings } from '../types';
import { LOGOS } from '../constants';

// Industry-specific demo data
const INDUSTRY_DATA: Record<IndustryType, {
  label: string;
  icon: string;
  services: Service[];
  suggestedGoal: number;
  rotations: { priority: number; standard: number; flex: number };
  sampleClient: {
    name: string;
    phone: string;
    email: string;
    occupation: string;
    lifestyle: string;
    goals: string;
    upcomingEvent: string;
    notes: string;
    preferredDays: string[];
    preferredTime: string;
  };
  specialties: string[];
  bio: string;
}> = {
  'hair-stylist': {
    label: 'Hair Stylist',
    icon: '💇',
    services: [
      { id: 'color-cut', name: 'Color + Cut', price: 185, category: 'base' },
      { id: 'cut-style', name: 'Cut + Style', price: 85, category: 'base' },
      { id: 'color-only', name: 'Full Color', price: 120, category: 'base' },
      { id: 'highlights', name: 'Highlights', price: 200, category: 'base' },
      { id: 'treatment', name: 'Deep Treatment', price: 35, category: 'addon' },
      { id: 'gloss', name: 'Gloss Refresh', price: 45, category: 'addon' },
      { id: 'blowout', name: 'Blowout', price: 55, category: 'addon' },
    ],
    suggestedGoal: 120000,
    rotations: { priority: 6, standard: 8, flex: 12 },
    sampleClient: {
      name: 'Jessica Chen',
      phone: '(555) 234-5678',
      email: 'jessica.chen@email.com',
      occupation: 'Marketing Director',
      lifestyle: 'Busy professional, limited morning time',
      goals: 'Cover grays, add volume, low-maintenance color',
      upcomingEvent: "Daughter's wedding - September 15",
      notes: 'Sensitive scalp - use gentle products',
      preferredDays: ['Tue', 'Sat'],
      preferredTime: 'Morning',
    },
    specialties: ['Balayage', 'Color Correction', 'Curly Hair', 'Bridal'],
    bio: 'Creating personalized color and cuts that fit your lifestyle.',
  },
  'personal-trainer': {
    label: 'Personal Trainer',
    icon: '💪',
    services: [
      { id: '1on1', name: '1:1 Training Session', price: 120, category: 'base' },
      { id: 'pairs', name: 'Pairs Training', price: 90, category: 'base' },
      { id: 'assessment', name: 'Fitness Assessment', price: 150, category: 'base' },
      { id: 'nutrition', name: 'Nutrition Consult', price: 80, category: 'addon' },
      { id: 'meal-plan', name: 'Custom Meal Plan', price: 100, category: 'addon' },
    ],
    suggestedGoal: 95000,
    rotations: { priority: 1, standard: 2, flex: 4 },
    sampleClient: {
      name: 'Marcus Rivera',
      phone: '(555) 345-6789',
      email: 'marcus.r@email.com',
      occupation: 'Software Engineer',
      lifestyle: 'Desk job, works from home, flexible schedule',
      goals: 'Lose 20 lbs, build core strength, improve posture',
      upcomingEvent: 'Beach vacation - August 1',
      notes: 'Previous knee injury - avoid high impact',
      preferredDays: ['Mon', 'Wed', 'Fri'],
      preferredTime: 'Morning',
    },
    specialties: ['Weight Loss', 'Strength Training', 'Injury Rehab', 'HIIT'],
    bio: 'Helping you build strength and confidence, one session at a time.',
  },
  'massage-therapist': {
    label: 'Massage Therapist',
    icon: '💆',
    services: [
      { id: 'deep-tissue-60', name: 'Deep Tissue 60min', price: 120, category: 'base' },
      { id: 'deep-tissue-90', name: 'Deep Tissue 90min', price: 150, category: 'base' },
      { id: 'swedish-60', name: 'Swedish 60min', price: 100, category: 'base' },
      { id: 'hot-stone', name: 'Hot Stone Add-on', price: 30, category: 'addon' },
      { id: 'aromatherapy', name: 'Aromatherapy', price: 20, category: 'addon' },
    ],
    suggestedGoal: 85000,
    rotations: { priority: 2, standard: 4, flex: 6 },
    sampleClient: {
      name: 'Sarah Mitchell',
      phone: '(555) 456-7890',
      email: 'sarah.m@email.com',
      occupation: 'Registered Nurse',
      lifestyle: 'Long shifts, on feet all day, high stress',
      goals: 'Chronic lower back pain relief, stress reduction',
      upcomingEvent: 'Running a marathon - October 10',
      notes: 'Prefers firm pressure, focus on shoulders and lower back',
      preferredDays: ['Sun', 'Wed'],
      preferredTime: 'Evening',
    },
    specialties: ['Sports Massage', 'Chronic Pain', 'Prenatal', 'Relaxation'],
    bio: 'Therapeutic massage tailored to your body and goals.',
  },
  'esthetician': {
    label: 'Esthetician',
    icon: '✨',
    services: [
      { id: 'facial-signature', name: 'Signature Facial', price: 150, category: 'base' },
      { id: 'facial-express', name: 'Express Facial', price: 85, category: 'base' },
      { id: 'peel', name: 'Chemical Peel', price: 175, category: 'base' },
      { id: 'microderm', name: 'Microdermabrasion', price: 140, category: 'base' },
      { id: 'led', name: 'LED Light Therapy', price: 40, category: 'addon' },
      { id: 'eye-treatment', name: 'Eye Treatment', price: 35, category: 'addon' },
    ],
    suggestedGoal: 100000,
    rotations: { priority: 4, standard: 6, flex: 8 },
    sampleClient: {
      name: 'Emma Thompson',
      phone: '(555) 567-8901',
      email: 'emma.t@email.com',
      occupation: 'Real Estate Agent',
      lifestyle: 'Client-facing role, lots of photos, image-conscious',
      goals: 'Clear adult acne, anti-aging, even skin tone',
      upcomingEvent: 'High school reunion - November 20',
      notes: 'Sensitive skin, avoid fragrances',
      preferredDays: ['Mon', 'Thu'],
      preferredTime: 'Midday',
    },
    specialties: ['Acne Treatment', 'Anti-Aging', 'Sensitive Skin', 'Peels'],
    bio: 'Customized skincare treatments for healthy, glowing skin.',
  },
  'therapist-counselor': {
    label: 'Therapist',
    icon: '🧠',
    services: [
      { id: 'individual-50', name: 'Individual Session 50min', price: 180, category: 'base' },
      { id: 'individual-80', name: 'Extended Session 80min', price: 260, category: 'base' },
      { id: 'couples', name: 'Couples Session', price: 220, category: 'base' },
      { id: 'intake', name: 'Initial Intake', price: 200, category: 'base' },
    ],
    suggestedGoal: 140000,
    rotations: { priority: 1, standard: 2, flex: 4 },
    sampleClient: {
      name: 'David Park',
      phone: '(555) 678-9012',
      email: 'david.p@email.com',
      occupation: 'Financial Analyst',
      lifestyle: 'High-pressure job, long hours, limited personal time',
      goals: 'Manage work anxiety, improve work-life balance',
      upcomingEvent: 'Starting new job - January 15',
      notes: 'Prefers evening sessions, values confidentiality',
      preferredDays: ['Tue', 'Thu'],
      preferredTime: 'Evening',
    },
    specialties: ['Anxiety', 'Depression', 'Career Transitions', 'CBT'],
    bio: 'A safe space to explore, heal, and grow.',
  },
  'consultant-coach': {
    label: 'Consultant/Coach',
    icon: '📈',
    services: [
      { id: 'coaching-60', name: 'Coaching Session 60min', price: 200, category: 'base' },
      { id: 'strategy', name: 'Strategy Session 90min', price: 350, category: 'base' },
      { id: 'vip-day', name: 'VIP Day', price: 1500, category: 'base' },
      { id: 'email-support', name: 'Email Support (weekly)', price: 100, category: 'addon' },
    ],
    suggestedGoal: 150000,
    rotations: { priority: 2, standard: 4, flex: 8 },
    sampleClient: {
      name: 'Amanda Foster',
      phone: '(555) 789-0123',
      email: 'amanda.f@email.com',
      occupation: 'Startup Founder',
      lifestyle: 'Building a business, wearing many hats, needs accountability',
      goals: 'Scale business to 7 figures, build team, improve delegation',
      upcomingEvent: 'Investor pitch - February 28',
      notes: 'Fast-paced thinker, appreciates direct feedback',
      preferredDays: ['Mon', 'Wed'],
      preferredTime: 'Morning',
    },
    specialties: ['Business Strategy', 'Leadership', 'Scaling', 'Mindset'],
    bio: 'Helping ambitious professionals achieve breakthrough results.',
  },
  'other': {
    label: 'Other Professional',
    icon: '🎯',
    services: [
      { id: 'session-60', name: 'Session 60min', price: 100, category: 'base' },
      { id: 'session-90', name: 'Session 90min', price: 140, category: 'base' },
      { id: 'consultation', name: 'Consultation', price: 75, category: 'base' },
    ],
    suggestedGoal: 80000,
    rotations: { priority: 4, standard: 6, flex: 10 },
    sampleClient: {
      name: 'Alex Johnson',
      phone: '(555) 890-1234',
      email: 'alex.j@email.com',
      occupation: 'Professional',
      lifestyle: 'Regular schedule, values consistency',
      goals: 'Maintain regular appointments, see consistent progress',
      upcomingEvent: '',
      notes: 'Reliable client, always on time',
      preferredDays: ['Tue', 'Thu'],
      preferredTime: 'Afternoon',
    },
    specialties: [],
    bio: 'Professional services tailored to your needs.',
  },
};

const STEPS = [
  { id: 'industry', title: 'Your Industry', subtitle: 'What type of professional are you?' },
  { id: 'profile', title: 'Your Profile', subtitle: 'Set up your business identity' },
  { id: 'services', title: 'Service Menu', subtitle: 'Your services and pricing' },
  { id: 'rotations', title: 'Rotation Settings', subtitle: 'The core of client tracking' },
  { id: 'goal', title: 'Annual Goal', subtitle: 'Set your income target' },
  { id: 'booking', title: 'Booking Link', subtitle: 'Get new clients online' },
  { id: 'preview-public', title: 'Your Public Page', subtitle: 'What clients will see' },
  { id: 'add-client', title: 'Add a Client', subtitle: 'See the client intelligence' },
  { id: 'schedule', title: 'Schedule Appointment', subtitle: 'Intelligent booking in action' },
  { id: 'rebook-preview', title: 'Rebooking Flow', subtitle: 'The automation magic' },
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Your business at a glance' },
];

interface GuidedDemoProps {
  onComplete: (profile: StylistProfile, clients: Client[], bookingSettings: BookingSettings) => void;
  onExit: () => void;
}

export const GuidedDemo: React.FC<GuidedDemoProps> = ({ onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [profile, setProfile] = useState<StylistProfile>({
    id: 'demo-profile',
    name: '',
    businessName: '',
    industry: 'hair-stylist',
    services: [],
    specialties: [],
    location: '',
    annualGoal: 0,
  });
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    profileSlug: '',
    bio: '',
    showPrices: true,
    takingNewClients: true,
    waitlistMode: false,
    requireDeposit: false,
    depositAmount: 50,
    depositType: 'fixed',
    minimumLeadTime: '24',
    maximumAdvanceBooking: '60',
    autoConfirmExisting: true,
  });
  const [demoClient, setDemoClient] = useState<Client | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  const industryData = selectedIndustry ? INDUSTRY_DATA[selectedIndustry] : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleIndustrySelect = (industry: IndustryType) => {
    setSelectedIndustry(industry);
    const data = INDUSTRY_DATA[industry];
    setProfile(prev => ({
      ...prev,
      industry,
      services: data.services,
      specialties: data.specialties,
      annualGoal: data.suggestedGoal,
    }));
    setBookingSettings(prev => ({
      ...prev,
      bio: data.bio,
      profileSlug: 'yourname',
    }));
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      // Final step - complete demo
      if (demoClient) {
        onComplete(profile, [demoClient], bookingSettings);
      }
    } else {
      // Special handling for add-client step
      if (STEPS[currentStep].id === 'add-client' && industryData && !demoClient) {
        const client = industryData.sampleClient;
        const baseService = industryData.services.find(s => s.category === 'base');
        const rotationWeeks = industryData.rotations.standard;
        const nextAppointment = new Date();
        nextAppointment.setDate(nextAppointment.getDate() + 3); // 3 days from now

        setDemoClient({
          id: 'demo-client-1',
          name: client.name,
          phone: client.phone,
          email: client.email,
          rotation: RotationType.STANDARD,
          rotationWeeks,
          status: 'confirmed',
          nextAppointment: nextAppointment.toISOString(),
          annualValue: baseService ? baseService.price * Math.floor(52 / rotationWeeks) : 0,
          baseService,
          preferredDays: client.preferredDays,
          preferredTime: client.preferredTime,
          goals: client.goals,
          notes: client.notes,
          upcomingEvent: client.upcomingEvent,
          occupation: client.occupation,
        });
      }

      // Schedule step
      if (STEPS[currentStep].id === 'schedule' && !scheduledDate) {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        setScheduledDate(date);
      }

      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case 'industry':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">What type of professional are you?</h2>
              <p className="text-maroon/60">We'll customize everything based on your industry.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {(Object.keys(INDUSTRY_DATA) as IndustryType[]).filter(k => k !== 'other').map((industry) => {
                const data = INDUSTRY_DATA[industry];
                const isSelected = selectedIndustry === industry;
                return (
                  <button
                    key={industry}
                    onClick={() => handleIndustrySelect(industry)}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-maroon bg-maroon/5 shadow-lg'
                        : 'border-slate-200 hover:border-maroon/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{data.icon}</div>
                    <div className="font-bold text-maroon text-sm sm:text-base">{data.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Set up your profile</h2>
              <p className="text-maroon/60 text-sm sm:text-base">This appears on your public booking page.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Name (optional)</label>
                <input
                  type="text"
                  value={profile.businessName || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Studio Alex"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  value={bookingSettings.bio}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell clients about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!profile.name) {
                  setProfile(prev => ({ ...prev, name: 'Alex Johnson', location: 'San Francisco, CA' }));
                }
              }}
              className="text-sm text-maroon/60 hover:text-maroon underline"
            >
              Use demo data
            </button>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Your service menu</h2>
              <p className="text-maroon/60 text-sm sm:text-base">Pre-filled based on your industry. You can customize these anytime.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-maroon text-sm">Base Services</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {profile.services.filter(s => s.category === 'base').map((service) => (
                  <div key={service.id} className="px-4 py-3 flex items-center justify-between">
                    <span className="font-medium text-maroon">{service.name}</span>
                    <span className="font-bold text-maroon">{formatCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {profile.services.some(s => s.category === 'addon') && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-maroon text-sm">Add-ons</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {profile.services.filter(s => s.category === 'addon').map((service) => (
                    <div key={service.id} className="px-4 py-3 flex items-center justify-between">
                      <span className="font-medium text-maroon">{service.name}</span>
                      <span className="font-bold text-slate-500">+{formatCurrency(service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-sm text-slate-400">
              You can edit these in Settings after the demo.
            </p>
          </div>
        );

      case 'rotations':
        return (
          <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">The rotation system</h2>
              <p className="text-maroon/60 text-sm sm:text-base">This is the magic of Recur. Clients are categorized by how often they should return.</p>
            </div>

            <div className="bg-[#c17f59]/10 border-2 border-[#c17f59]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 bg-[#c17f59] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{industryData?.rotations.priority || 6}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#c17f59] text-sm sm:text-base">Priority Rotation</h3>
                  <p className="text-xs sm:text-sm text-maroon/60">{industryData?.rotations.priority || 6} weeks - Your most frequent clients</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-maroon/70">
                These clients need regular appointments to maintain their results. They're your bread and butter.
              </p>
            </div>

            <div className="bg-[#7c9a7e]/10 border-2 border-[#7c9a7e]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 bg-[#7c9a7e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{industryData?.rotations.standard || 8}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#7c9a7e] text-sm sm:text-base">Standard Rotation</h3>
                  <p className="text-xs sm:text-sm text-maroon/60">{industryData?.rotations.standard || 8} weeks - Your typical client</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-maroon/70">
                Most clients fall here. They book on a regular schedule with some flexibility.
              </p>
            </div>

            <div className="bg-[#b5a078]/10 border-2 border-[#b5a078]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 bg-[#b5a078] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{industryData?.rotations.flex || 12}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#b5a078] text-sm sm:text-base">Flex Rotation</h3>
                  <p className="text-xs sm:text-sm text-maroon/60">{industryData?.rotations.flex || 12} weeks - Occasional clients</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-maroon/70">
                Seasonal or occasional clients. They still matter - and Recur tracks when they're due back.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700">
                <span className="font-bold">How it works:</span> When a client passes their rotation window without booking, Recur alerts you to reach out.
              </p>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Set your annual goal</h2>
              <p className="text-maroon/60 text-sm sm:text-base">Recur will track your progress and project when you'll hit it.</p>
            </div>

            <div className="bg-maroon text-white rounded-2xl p-6 text-center">
              <div className="text-4xl sm:text-5xl font-serif mb-2">{formatCurrency(profile.annualGoal || 0)}</div>
              <div className="text-white/60 text-xs sm:text-sm">{new Date().getFullYear()} Income Goal</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annual Goal</label>
              <input
                type="range"
                min="50000"
                max="250000"
                step="5000"
                value={profile.annualGoal || industryData?.suggestedGoal || 100000}
                onChange={(e) => setProfile(prev => ({ ...prev, annualGoal: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$50K</span>
                <span>$250K</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-700">
                <span className="font-bold">Suggested for {industryData?.label}:</span> {formatCurrency(industryData?.suggestedGoal || 100000)}/year
              </p>
            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Your booking link</h2>
              <p className="text-maroon/60 text-sm sm:text-base">Share this link to get new clients without the back-and-forth.</p>
            </div>

            <div className="bg-slate-100 rounded-xl p-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Link</label>
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-slate-200">
                <span className="text-slate-400">recur.app/</span>
                <input
                  type="text"
                  value={bookingSettings.profileSlug}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, profileSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  placeholder="yourname"
                  className="flex-1 font-bold text-maroon focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={bookingSettings.takingNewClients}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, takingNewClients: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-maroon focus:ring-maroon"
                />
                <div>
                  <span className="font-medium text-maroon">Taking new clients</span>
                  <p className="text-xs text-slate-400">Show "Book Now" button on your page</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={bookingSettings.showPrices}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, showPrices: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-300 text-maroon focus:ring-maroon"
                />
                <div>
                  <span className="font-medium text-maroon">Show prices</span>
                  <p className="text-xs text-slate-400">Display service prices publicly</p>
                </div>
              </label>
            </div>
          </div>
        );

      case 'preview-public':
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Your public booking page</h2>
              <p className="text-maroon/60 text-sm sm:text-base">This is what potential clients will see.</p>
            </div>

            {/* Mini preview of public page */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-br from-maroon to-[#1a1512] px-6 py-8 text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {getInitials(profile.name || 'YN')}
                </div>
                <h3 className="text-xl font-serif mb-1">{profile.name || 'Your Name'}</h3>
                {profile.businessName && <p className="text-white/70 text-sm">{profile.businessName}</p>}
                <div className="mt-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{industryData?.label}</span>
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    Taking new clients
                  </span>
                </div>
              </div>
              <div className="p-6">
                {bookingSettings.bio && (
                  <p className="text-maroon/70 text-center text-sm italic mb-4">"{bookingSettings.bio}"</p>
                )}
                <div className="space-y-2 mb-4">
                  {profile.services.filter(s => s.category === 'base').slice(0, 3).map((service) => (
                    <div key={service.id} className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm">
                      <span className="text-maroon">{service.name}</span>
                      {bookingSettings.showPrices && <span className="font-bold text-maroon">{formatCurrency(service.price)}</span>}
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 bg-maroon text-white rounded-xl font-bold">
                  Book with {profile.name?.split(' ')[0] || 'Me'}
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-slate-400">
              Clients fill out an intake form and request appointments through this page.
            </p>
          </div>
        );

      case 'add-client':
        const sampleClient = industryData?.sampleClient;
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Meet your first client</h2>
              <p className="text-maroon/60 text-sm sm:text-base">See how Recur captures client intelligence.</p>
            </div>

            {sampleClient && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Client Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#c17f59] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(sampleClient.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-maroon text-lg">{sampleClient.name}</h3>
                    <p className="text-sm text-slate-400">{sampleClient.occupation}</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-maroon font-medium">{sampleClient.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-maroon font-medium text-sm">{sampleClient.email}</p>
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Lifestyle</h4>
                    <p className="text-sm text-maroon">{sampleClient.lifestyle}</p>
                  </div>

                  {/* Goals */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Goals</h4>
                    <p className="text-sm text-maroon">{sampleClient.goals}</p>
                  </div>

                  {/* Upcoming Event */}
                  {sampleClient.upcomingEvent && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Upcoming Event</h4>
                      <p className="text-sm text-maroon">{sampleClient.upcomingEvent}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {sampleClient.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Important Notes</h4>
                      <p className="text-sm text-maroon">{sampleClient.notes}</p>
                    </div>
                  )}

                  {/* Preferences */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Preferred Days</p>
                      <div className="flex flex-wrap gap-1">
                        {sampleClient.preferredDays.map(day => (
                          <span key={day} className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-maroon">{day}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Preferred Time</p>
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-maroon">{sampleClient.preferredTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-slate-400">
              All this information is captured through the intake form when clients book.
            </p>
          </div>
        );

      case 'schedule':
        const service = profile.services.find(s => s.category === 'base');
        const suggestedDate = new Date();
        suggestedDate.setDate(suggestedDate.getDate() + 3);
        const rotationWeeks = industryData?.rotations.standard || 8;
        const annualVisits = Math.floor(52 / rotationWeeks);
        const annualValue = service ? service.price * annualVisits : 0;

        return (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">Intelligent scheduling</h2>
              <p className="text-maroon/60 text-sm sm:text-base">Recur pre-fills everything based on client data.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#7c9a7e] to-[#6b8a6d] text-white">
                <div className="text-white/80 text-xs font-medium mb-1">Smart Scheduling</div>
                <h3 className="font-bold text-base sm:text-lg">Book {industryData?.sampleClient.name.split(' ')[0]}'s Appointment</h3>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Pre-calculated Date */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-700">
                        {suggestedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Pre-filled from preferences
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-selected Service */}
                {service && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service</label>
                    <div className="flex items-center justify-between p-3 bg-[#c17f59]/10 border-2 border-[#c17f59]/30 rounded-xl">
                      <span className="font-medium text-maroon">{service.name}</span>
                      <span className="font-bold text-[#c17f59]">{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                )}

                {/* Annual Value Calculation */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">The Math</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-maroon/70">Service price</span>
                      <span className="text-maroon">{formatCurrency(service?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maroon/70">× Visits per year ({rotationWeeks}-week rotation)</span>
                      <span className="text-maroon">× {annualVisits}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                      <span className="text-maroon">Annual value</span>
                      <span className="text-emerald-600">{formatCurrency(annualValue)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400 italic">
                  One client. {formatCurrency(annualValue)}/year. Now imagine 50 clients.
                </p>
              </div>
            </div>
          </div>
        );

      case 'rebook-preview':
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">The rebooking flow</h2>
              <p className="text-maroon/60 text-sm sm:text-base">After each appointment, Recur prompts you to book the next one.</p>
            </div>

            {/* Mock completion modal */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-1">Appointment Complete!</h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  {industryData?.sampleClient.name} • {profile.services.find(s => s.category === 'base')?.name}
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <h4 className="font-bold text-maroon text-base sm:text-lg mb-4 text-center">
                  Book {industryData?.sampleClient.name.split(' ')[0]}'s next appointment?
                </h4>

                {/* Suggested Date */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-700">
                        {(() => {
                          const d = new Date();
                          d.setDate(d.getDate() + (industryData?.rotations.standard || 8) * 7);
                          return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        })()}
                      </div>
                      <div className="text-sm text-emerald-600">
                        {industryData?.rotations.standard || 8} weeks from today
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl">
                    Book Suggested Date
                  </button>
                  <button className="w-full py-2.5 border-2 border-slate-200 text-maroon font-bold rounded-xl">
                    Pick Different Date
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-400">
              Never let a client walk out without their next appointment booked.
            </p>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-maroon mb-2">You're all set!</h2>
              <p className="text-maroon/60 text-sm sm:text-base">Let's see your dashboard with everything you've set up.</p>
            </div>

            <div className="bg-maroon text-white rounded-2xl p-6 sm:p-8">
              <div className="text-white/60 text-xs sm:text-sm mb-2">Your {new Date().getFullYear()} Forecast</div>
              <div className="text-3xl sm:text-5xl font-serif mb-3 sm:mb-4">{formatCurrency(demoClient?.annualValue || 0)}</div>
              <p className="text-white/70 text-xs sm:text-sm">
                Starting with 1 client. Add more to grow your forecast.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200">
                <div className="text-xl sm:text-2xl font-serif text-maroon">1</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Client</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200">
                <div className="text-xl sm:text-2xl font-serif text-maroon">{industryData?.rotations.standard || 8}wk</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Rotation</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200">
                <div className="text-lg sm:text-2xl font-serif text-emerald-600">{formatCurrency(profile.annualGoal)}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Goal</div>
              </div>
            </div>

            <p className="text-slate-400 text-sm">
              Tap "Enter Dashboard" to explore the full experience.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case 'industry':
        return selectedIndustry !== null;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-maroon opacity-60">
            <LOGOS.Main />
          </div>
          <button
            onClick={onExit}
            className="text-sm text-maroon/60 hover:text-maroon"
          >
            Exit Demo
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-maroon font-medium">{STEPS[currentStep].title}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-maroon rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-24 sm:pb-28">
        {renderStepContent()}
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-colors ${
              currentStep === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-maroon hover:bg-slate-100 active:bg-slate-200'
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl font-bold transition-colors text-center ${
              canProceed()
                ? 'bg-maroon text-white hover:bg-maroon/90 active:bg-maroon/80'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentStep === STEPS.length - 1 ? 'Enter Dashboard' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
