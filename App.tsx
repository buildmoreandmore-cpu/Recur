import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { AppDashboard } from './components/AppDashboard';
import { ClientIntake } from './components/ClientIntake';
import { ClientProfile } from './components/ClientProfile';
import { Client, StylistProfile, RotationType, AppScreen, Service } from './types';
import { ICONS, LOGOS } from './constants';

// Sample clients for demo
const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Jasmine Carter',
    phone: '(555) 123-4567',
    email: 'jasmine@email.com',
    rotation: RotationType.PRIORITY,
    rotationWeeks: 8,
    baseService: { id: 'base-2', name: 'Color + Cut', price: 185, category: 'base' },
    addOns: [
      { service: { id: 'addon-0', name: 'Deep conditioner', price: 30, category: 'addon' }, frequency: 'Every visit' },
      { service: { id: 'addon-2', name: 'Gloss/Toner refresh', price: 45, category: 'addon' }, frequency: 'Every other visit' },
    ],
    annualValue: 1917,
    nextAppointment: '2026-01-14',
    clientSince: '2024-03-15',
    preferredDays: ['Sat'],
    preferredTime: 'Morning',
    contactMethod: 'Text',
    occupation: 'Marketing Director',
    clientFacing: true,
    morningTime: '15 min',
    events: [{ name: 'Wedding (Bridal party)', date: '2026-09-27', service: { id: 'event-1', name: 'Wedding day styling', price: 280, category: 'event' } }],
    photographed: 'Monthly',
    lastColor: '2025-11-15',
    lastCut: '2025-11-15',
    concerns: 'Sensitive scalp',
    whatWorks: 'Balayage, glosses',
    whatFailed: 'Full highlights (too much maintenance)',
    allergies: 'Use X brand only',
    heatTools: 'Few times a week',
    hairGoal: 'Go lighter for summer',
    maintenanceLevel: 'Medium',
    naturalColor: 'Dark brown',
    currentColor: 'Warm brunette with highlights',
    growOutComfort: '4 weeks',
    appointments: [
      { date: '2025-11-15', service: 'Color + Cut', price: 220, status: 'completed' },
      { date: '2026-01-14', service: 'Color + Gloss', price: 185, status: 'upcoming' },
      { date: '2026-03-10', service: 'Color + Cut', price: 220, status: 'scheduled' },
      { date: '2026-05-05', service: 'Pre-vacation color', price: 220, status: 'scheduled' },
      { date: '2026-09-20', service: 'Wedding prep', price: 280, status: 'event' },
    ],
    notes: '',
    status: 'confirmed',
  },
  {
    id: '2',
    name: 'Maya Thompson',
    phone: '(555) 234-5678',
    email: 'maya@email.com',
    rotation: RotationType.STANDARD,
    rotationWeeks: 10,
    baseService: { id: 'base-1', name: 'Cut + Style', price: 85, category: 'base' },
    addOns: [],
    annualValue: 1240,
    nextAppointment: '2026-01-22',
    clientSince: '2023-08-10',
    preferredDays: ['Wed', 'Thu'],
    preferredTime: 'Midday',
    contactMethod: 'Text',
    occupation: 'Teacher',
    clientFacing: true,
    morningTime: '5 min',
    events: [],
    photographed: 'Rarely',
    lastColor: '',
    lastCut: '2025-11-12',
    concerns: '',
    whatWorks: 'Layers, textured ends',
    whatFailed: '',
    allergies: '',
    heatTools: 'Rarely',
    hairGoal: 'Keep it healthy and easy',
    maintenanceLevel: 'Low',
    naturalColor: 'Medium brown',
    currentColor: 'Natural',
    growOutComfort: '8+ weeks',
    appointments: [
      { date: '2025-11-12', service: 'Cut + Style', price: 85, status: 'completed' },
      { date: '2026-01-22', service: 'Cut + Style', price: 85, status: 'upcoming' },
      { date: '2026-04-01', service: 'Cut + Style', price: 85, status: 'scheduled' },
    ],
    notes: '',
    status: 'confirmed',
  },
  {
    id: '3',
    name: 'Nicole Adams',
    phone: '(555) 345-6789',
    email: 'nicole@email.com',
    rotation: RotationType.STANDARD,
    rotationWeeks: 10,
    baseService: { id: 'base-3', name: 'Color + Cut + Gloss', price: 220, category: 'base' },
    addOns: [{ service: { id: 'addon-3', name: 'Olaplex/Bond treatment', price: 50, category: 'addon' }, frequency: 'Every visit' }],
    annualValue: 980,
    nextAppointment: '2026-01-18',
    clientSince: '2024-01-20',
    preferredDays: ['Fri', 'Sat'],
    preferredTime: 'Morning',
    contactMethod: 'Email',
    occupation: 'Nurse',
    clientFacing: true,
    morningTime: '15 min',
    events: [],
    photographed: 'Rarely',
    lastColor: '2025-11-08',
    lastCut: '2025-11-08',
    concerns: 'Color-treated, needs bond repair',
    whatWorks: 'Dimensional color',
    whatFailed: 'Too light blonde',
    allergies: '',
    heatTools: 'Daily',
    hairGoal: 'Maintain healthy color',
    maintenanceLevel: 'Medium',
    naturalColor: 'Light brown',
    currentColor: 'Dimensional brunette',
    growOutComfort: '6 weeks',
    appointments: [
      { date: '2025-11-08', service: 'Color + Cut + Gloss', price: 270, status: 'completed' },
      { date: '2026-01-18', service: 'Color + Cut + Gloss', price: 270, status: 'upcoming' },
      { date: '2026-03-28', service: 'Color + Cut + Gloss', price: 270, status: 'scheduled' },
    ],
    notes: '',
    status: 'confirmed',
  },
  {
    id: '4',
    name: 'Sienna West',
    phone: '(555) 456-7890',
    email: 'sienna@email.com',
    rotation: RotationType.FLEX,
    rotationWeeks: 12,
    baseService: { id: 'base-0', name: 'Shampoo + Style', price: 55, category: 'base' },
    addOns: [],
    annualValue: 720,
    nextAppointment: '2026-01-25',
    clientSince: '2023-11-05',
    preferredDays: ['Sat'],
    preferredTime: 'Evening',
    contactMethod: 'Text',
    occupation: 'Freelance Writer',
    clientFacing: false,
    morningTime: '5 min',
    events: [],
    photographed: 'Rarely',
    lastColor: '',
    lastCut: '2025-10-25',
    concerns: '',
    whatWorks: 'Simple styles',
    whatFailed: '',
    allergies: '',
    heatTools: 'Rarely',
    hairGoal: 'Low maintenance',
    maintenanceLevel: 'Low',
    naturalColor: 'Black',
    currentColor: 'Natural',
    growOutComfort: '8+ weeks',
    appointments: [
      { date: '2025-10-25', service: 'Shampoo + Style', price: 55, status: 'completed' },
      { date: '2026-01-25', service: 'Shampoo + Style', price: 55, status: 'upcoming' },
      { date: '2026-04-18', service: 'Shampoo + Style', price: 55, status: 'scheduled' },
    ],
    notes: '',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Evelyn Gray',
    phone: '(555) 567-8901',
    email: 'evelyn@email.com',
    rotation: RotationType.PRIORITY,
    rotationWeeks: 8,
    baseService: { id: 'base-5', name: 'Full Highlights + Cut', price: 285, category: 'base' },
    addOns: [
      { service: { id: 'addon-2', name: 'Gloss/Toner refresh', price: 45, category: 'addon' }, frequency: 'Every visit' },
    ],
    annualValue: 2100,
    nextAppointment: '2026-01-11',
    clientSince: '2022-06-18',
    preferredDays: ['Tue', 'Wed'],
    preferredTime: 'Morning',
    contactMethod: 'Call',
    occupation: 'Real Estate Agent',
    clientFacing: true,
    morningTime: '30+ min',
    events: [],
    photographed: 'Weekly',
    lastColor: '2025-11-16',
    lastCut: '2025-11-16',
    concerns: 'Keeping blonde bright',
    whatWorks: 'Full foil, toner',
    whatFailed: 'Balayage (not enough coverage)',
    allergies: '',
    heatTools: 'Daily',
    hairGoal: 'Stay bright blonde',
    maintenanceLevel: 'High',
    naturalColor: 'Medium brown',
    currentColor: 'Platinum blonde',
    growOutComfort: '4 weeks',
    appointments: [
      { date: '2025-11-16', service: 'Full Highlights + Cut', price: 330, status: 'completed' },
      { date: '2026-01-11', service: 'Full Highlights + Cut', price: 330, status: 'upcoming' },
      { date: '2026-03-07', service: 'Full Highlights + Cut', price: 330, status: 'scheduled' },
    ],
    notes: '',
    status: 'confirmed',
  },
  {
    id: '6',
    name: 'Tara Mitchell',
    phone: '(555) 678-9012',
    email: 'tara@email.com',
    rotation: RotationType.PRIORITY,
    rotationWeeks: 6,
    baseService: { id: 'base-6', name: 'Balayage + Cut', price: 265, category: 'base' },
    addOns: [
      { service: { id: 'addon-0', name: 'Deep conditioner', price: 30, category: 'addon' }, frequency: 'Every visit' },
    ],
    annualValue: 2550,
    nextAppointment: '2026-01-28',
    clientSince: '2024-06-01',
    preferredDays: ['Tue', 'Wed'],
    preferredTime: 'Afternoon',
    contactMethod: 'Text',
    occupation: 'Interior Designer',
    clientFacing: true,
    morningTime: '20 min',
    events: [],
    photographed: 'Monthly',
    lastColor: '2025-12-17',
    lastCut: '2025-12-17',
    concerns: 'Wants seamless grow-out',
    whatWorks: 'Balayage, lived-in color',
    whatFailed: 'Traditional highlights',
    allergies: '',
    heatTools: 'Daily',
    hairGoal: 'Sun-kissed natural look',
    maintenanceLevel: 'Medium',
    naturalColor: 'Dark blonde',
    currentColor: 'Balayage blonde',
    growOutComfort: '6 weeks',
    appointments: [
      { date: '2025-12-17', service: 'Balayage + Cut', price: 295, status: 'completed' },
      { date: '2026-01-28', service: 'Gloss + Trim', price: 120, status: 'upcoming' },
      { date: '2026-03-11', service: 'Balayage + Cut', price: 295, status: 'scheduled' },
    ],
    notes: '',
    status: 'confirmed',
  },
  {
    id: '7',
    name: 'Rachel Kim',
    phone: '(555) 789-0123',
    email: 'rachel@email.com',
    rotation: RotationType.STANDARD,
    rotationWeeks: 8,
    baseService: { id: 'base-7', name: 'Silk Press', price: 95, category: 'base' },
    addOns: [
      { service: { id: 'addon-1', name: 'Scalp treatment', price: 35, category: 'addon' }, frequency: 'Every visit' },
    ],
    annualValue: 845,
    nextAppointment: '2026-01-15',
    clientSince: '2025-03-10',
    preferredDays: ['Wed', 'Thu'],
    preferredTime: 'Morning',
    contactMethod: 'Text',
    occupation: 'Software Engineer',
    clientFacing: false,
    morningTime: '10 min',
    events: [],
    photographed: 'Rarely',
    lastColor: '',
    lastCut: '2025-11-20',
    concerns: 'Heat damage prevention',
    whatWorks: 'Silk press with heat protectant',
    whatFailed: '',
    allergies: '',
    heatTools: 'Weekly',
    hairGoal: 'Healthy, sleek styles',
    maintenanceLevel: 'Low',
    naturalColor: 'Black',
    currentColor: 'Natural',
    growOutComfort: '8 weeks',
    appointments: [
      { date: '2025-11-20', service: 'Silk Press', price: 130, status: 'completed' },
      { date: '2026-01-15', service: 'Silk Press', price: 130, status: 'upcoming' },
      { date: '2026-03-12', service: 'Silk Press', price: 130, status: 'scheduled' },
    ],
    notes: '',
    status: 'at-risk',
  },
];

// Default stylist profile with services
const DEFAULT_PROFILE: StylistProfile = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  location: '',
  yearsInBusiness: 0,
  specialties: [],
  services: [
    { id: 'base-0', name: 'Shampoo + Style', price: 55, category: 'base' },
    { id: 'base-1', name: 'Cut + Style', price: 85, category: 'base' },
    { id: 'base-2', name: 'Color + Cut', price: 185, category: 'base' },
    { id: 'base-3', name: 'Color + Cut + Gloss', price: 220, category: 'base' },
    { id: 'base-4', name: 'Partial Highlights + Cut', price: 225, category: 'base' },
    { id: 'base-5', name: 'Full Highlights + Cut', price: 285, category: 'base' },
    { id: 'base-6', name: 'Balayage + Cut', price: 265, category: 'base' },
    { id: 'base-7', name: 'Silk Press', price: 95, category: 'base' },
    { id: 'addon-0', name: 'Deep conditioner', price: 30, category: 'addon' },
    { id: 'addon-1', name: 'Scalp treatment', price: 35, category: 'addon' },
    { id: 'addon-2', name: 'Gloss/Toner refresh', price: 45, category: 'addon' },
    { id: 'addon-3', name: 'Olaplex/Bond treatment', price: 50, category: 'addon' },
    { id: 'addon-4', name: 'Bang trim', price: 15, category: 'addon' },
    { id: 'event-0', name: 'Wedding trial', price: 150, category: 'event' },
    { id: 'event-1', name: 'Wedding day styling', price: 280, category: 'event' },
    { id: 'event-2', name: 'Photoshoot prep', price: 120, category: 'event' },
    { id: 'event-3', name: 'Birthday styling', price: 95, category: 'event' },
    { id: 'event-4', name: 'Other event', price: 100, category: 'event' },
  ],
  defaultRotation: 10,
  annualGoal: 120000,
  monthlyGoal: 10000,
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [profile, setProfile] = useState<StylistProfile>(DEFAULT_PROFILE);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setWaitlistLoading(true);
    setWaitlistError('');

    try {
      const response = await fetch('https://formspree.io/f/mnjjavvn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail }),
      });

      if (response.ok) {
        setWaitlistSubmitted(true);
        setWaitlistEmail('');
      } else {
        setWaitlistError('Something went wrong. Please try again.');
      }
    } catch {
      setWaitlistError('Network error. Please try again.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll reveal animation
  useEffect(() => {
    if (screen !== 'landing') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [screen]);

  const handleStartDemo = () => {
    if (hasOnboarded) {
      setScreen('dashboard');
    } else {
      setScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (newProfile: StylistProfile) => {
    setProfile(newProfile);
    setClients(SAMPLE_CLIENTS);
    setHasOnboarded(true);
    setScreen('dashboard');
  };

  const handleAddClient = (client: Client) => {
    setClients([client, ...clients]);
    setScreen('dashboard');
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setScreen('client-profile');
  };

  // Render based on screen
  if (screen === 'onboarding') {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onBack={() => setScreen('landing')}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <AppDashboard
        profile={profile}
        clients={clients}
        onAddClient={() => setScreen('client-intake')}
        onViewClient={handleViewClient}
        onBack={() => setScreen('landing')}
      />
    );
  }

  if (screen === 'client-intake') {
    return (
      <ClientIntake
        profile={profile}
        onSave={handleAddClient}
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'client-profile' && selectedClient) {
    return (
      <ClientProfile
        client={selectedClient}
        onBack={() => {
          setSelectedClient(null);
          setScreen('dashboard');
        }}
      />
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-6 sm:gap-12">
          <div className="cursor-pointer text-maroon" onClick={() => setScreen('landing')}>
            <LOGOS.Main />
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-maroon">
            <button onClick={() => scrollTo('how-it-works')} className="hover:opacity-70 transition-opacity">How It Works</button>
            <button onClick={() => scrollTo('pricing')} className="hover:opacity-70 transition-opacity">Pricing</button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleStartDemo}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-[15px] font-medium text-maroon hover:opacity-70"
          >
            Demo
          </button>
          <button
            onClick={() => setShowWaitlist(true)}
            className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-sm sm:text-[15px] font-bold shadow-sm"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      <main>
        {/* SECTION 1: Hero */}
        <section className="relative pt-12 sm:pt-24 pb-16 sm:pb-32 text-center px-4 sm:px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-[72px] font-serif leading-[1.15] sm:leading-[1.1] text-maroon mb-6 sm:mb-8">
              <span className="hero-animate hero-animate-delay-1 inline-block">Know your </span>
              <span className="hero-animate hero-animate-delay-2 inline-block italic">income</span>
              <br />
              <span className="hero-animate hero-animate-delay-3 inline-block">before the year starts.</span>
            </h1>

            <p className="hero-animate hero-animate-delay-3 text-base sm:text-lg lg:text-xl text-maroon/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              The client management system that maps every rotation, forecasts your revenue, and keeps you ahead of your book.
            </p>

            <div className="hero-animate hero-animate-delay-4 flex flex-col items-center gap-4">
              <button
                onClick={() => setShowWaitlist(true)}
                className="btn-primary inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-maroon text-white rounded-full text-base sm:text-lg font-bold shadow-xl"
              >
                Join the Waitlist
              </button>
              <button
                onClick={handleStartDemo}
                className="text-maroon/60 hover:text-maroon text-sm font-medium underline underline-offset-4 transition-colors"
              >
                or see the demo →
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: The Problem */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-cream">
          <div className="max-w-3xl mx-auto text-center">
            <p className="scroll-reveal text-lg sm:text-xl lg:text-2xl text-maroon/80 leading-relaxed font-medium">
              You check your calendar and see open slots. You check your bank account and wonder why the numbers don't match what you expected. You're working hard, but you're still <span className="italic">guessing</span> what next month looks like.
            </p>
            <p className="scroll-reveal delay-1 mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl text-maroon font-bold">
              It's exhausting. And it doesn't have to be this way.
            </p>
          </div>
        </section>

        {/* SECTION 3: The Solution */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-center text-maroon mb-8 sm:mb-16">
              Three things that change everything
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              <div className="scroll-reveal delay-1 card-hover bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="card-icon w-12 sm:w-16 h-12 sm:h-16 bg-[#fff38a] rounded-xl sm:rounded-2xl flex items-center justify-center text-maroon mb-4 sm:mb-6">
                  <ICONS.Users />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-maroon">Map Your Clients</h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">Capture rotation schedules, preferences, and annual value. Know exactly who's in your chair and when.</p>
              </div>
              <div className="scroll-reveal delay-2 card-hover bg-maroon p-6 sm:p-10 rounded-2xl sm:rounded-[32px] shadow-lg flex flex-col items-center text-center text-white">
                <div className="card-icon w-12 sm:w-16 h-12 sm:h-16 bg-[#fff38a] rounded-xl sm:rounded-2xl flex items-center justify-center text-maroon mb-4 sm:mb-6">
                  <ICONS.TrendingUp />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Forecast Your Income</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">Every rotation has a value. Add them up and you know your year—before January ends.</p>
              </div>
              <div className="scroll-reveal delay-3 card-hover bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="card-icon w-12 sm:w-16 h-12 sm:h-16 bg-[#fff38a] rounded-xl sm:rounded-2xl flex items-center justify-center text-maroon mb-4 sm:mb-6">
                  <ICONS.Alert />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-maroon">Stay Ahead of Churn</h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">See who's overdue and who's at risk. Stop chasing and start managing with confidence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: The Dashboard */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-cream">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-3 sm:mb-4">
                This is Monday morning with Recur.
              </h2>
              <p className="scroll-reveal delay-1 text-base sm:text-lg text-maroon/60">Your year, mapped. Your income, forecasted.</p>
            </div>

            {/* Dashboard Preview */}
            <div className="scroll-reveal delay-2 dashboard-preview bg-white rounded-2xl sm:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
              {/* Mini Header */}
              <div className="border-b border-slate-100 p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-maroon text-sm sm:text-base">Financial Forecast</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">FY 2026 Overview</p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-maroon text-white">
                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2">Annual Forecast</div>
                    <div className="text-2xl sm:text-3xl font-serif number-animate">$127,400</div>
                    <div className="text-emerald-400 text-xs font-bold mt-1">67 clients on rotation</div>
                  </div>
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">Confirmed</div>
                    <div className="text-2xl sm:text-3xl font-serif text-emerald-600 number-animate">$89,200</div>
                    <div className="text-slate-400 text-xs font-bold mt-1">70% of forecast</div>
                  </div>
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#fff38a]">
                    <div className="text-[10px] font-bold text-maroon/50 uppercase tracking-wider mb-1 sm:mb-2">Pending</div>
                    <div className="text-2xl sm:text-3xl font-serif text-maroon number-animate">$38,200</div>
                    <div className="text-maroon/60 text-xs font-bold mt-1">4 need attention this week</div>
                  </div>
                </div>

                {/* Client List Preview */}
                <div className="border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Rotations</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { name: 'Jasmine Carter', tier: 'Priority', amount: '$1,917', date: 'Apr 12', color: '#c17f59' },
                      { name: 'Maya Thompson', tier: 'Standard', amount: '$1,240', date: 'Apr 18', color: '#7c9a7e' },
                      { name: 'Evelyn Gray', tier: 'Priority', amount: '$2,100', date: 'Apr 8', color: '#c17f59' },
                    ].map((client, i) => (
                      <div key={i} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ backgroundColor: client.color }}>
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-maroon text-sm sm:text-base">{client.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase text-white" style={{ backgroundColor: client.color }}>{client.tier}</span>
                              <span className="text-[10px] sm:text-[11px] text-slate-400">{client.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-maroon text-sm sm:text-base">{client.amount}<span className="text-slate-400 font-normal">/yr</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: The Rotation System */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-3 sm:mb-4">
                Map your year with rotations
              </h2>
              <p className="scroll-reveal delay-1 text-base sm:text-lg text-maroon/60 max-w-2xl mx-auto px-2">
                Not all clients are the same. Some come every 8 weeks like clockwork. Others are every 12. Recur tracks every tier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="scroll-reveal delay-1 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-[#c17f59]/10 border-2 border-[#c17f59]/30">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#c17f59] rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
                  <ICONS.TrendingUp />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Priority</h3>
                <p className="text-2xl sm:text-3xl font-serif text-maroon mb-3 sm:mb-4">Every 8 weeks</p>
                <p className="text-sm sm:text-base text-maroon/70">Your VIPs. High frequency, high value. They keep your books full and your income steady.</p>
              </div>

              <div className="scroll-reveal delay-2 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-[#7c9a7e]/10 border-2 border-[#7c9a7e]/30">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#7c9a7e] rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
                  <ICONS.Calendar />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Standard</h3>
                <p className="text-2xl sm:text-3xl font-serif text-maroon mb-3 sm:mb-4">Every 10 weeks</p>
                <p className="text-sm sm:text-base text-maroon/70">Your core clientele. Reliable, consistent. The backbone of your annual forecast.</p>
              </div>

              <div className="scroll-reveal delay-3 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-[#b5a078]/10 border-2 border-[#b5a078]/30">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 bg-[#b5a078] rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
                  <ICONS.Sun />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Flex</h3>
                <p className="text-2xl sm:text-3xl font-serif text-maroon mb-3 sm:mb-4">Every 12+ weeks</p>
                <p className="text-sm sm:text-base text-maroon/70">Seasonal or occasional. They matter too—and now you can track when they're due back.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Pricing */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-cream" id="pricing">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-3 sm:mb-4">
              Simple pricing
            </h2>
            <p className="scroll-reveal delay-1 text-base sm:text-lg text-maroon/60 mb-8 sm:mb-12">
              One plan. Everything you need. No surprises.
            </p>

            <div className="price-card bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] shadow-xl border border-slate-100">
              <div className="text-4xl sm:text-5xl font-serif text-maroon mb-2 number-animate">$29<span className="text-xl sm:text-2xl text-slate-400">/month</span></div>
              <p className="text-slate-400 font-medium mb-6 sm:mb-8 text-sm sm:text-base">Billed monthly. Cancel anytime.</p>

              <ul className="text-left space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {[
                  'Unlimited clients',
                  'Full income dashboard',
                  'Client profiles and intake',
                  'Rotation tracking',
                  'Smart reminders',
                  'Export your data anytime',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <ICONS.Check />
                    </div>
                    <span className="text-maroon font-medium text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowWaitlist(true)}
                className="btn-primary w-full py-3 sm:py-4 bg-maroon text-white rounded-xl font-bold text-base sm:text-lg"
              >
                Join Waitlist for Early Access
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 7: Footer */}
        <footer className="py-10 sm:py-16 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
              <div className="text-maroon">
                <LOGOS.Main />
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-[15px] font-medium text-maroon/60">
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-maroon transition-colors">How It Works</button>
                <button onClick={() => scrollTo('pricing')} className="hover:text-maroon transition-colors">Pricing</button>
                <button className="hover:text-maroon transition-colors">Privacy</button>
                <button className="hover:text-maroon transition-colors">Contact</button>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-400">© 2026 Recur. The income system for stylists.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowWaitlist(false);
            setWaitlistSubmitted(false);
          }}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!waitlistSubmitted ? (
              <>
                {/* Modal Header */}
                <div className="px-6 py-5 bg-maroon text-white text-center">
                  <h3 className="text-xl sm:text-2xl font-serif mb-2">Join the Waitlist</h3>
                  <p className="text-white/70 text-sm">Be the first to know when Recur launches.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleWaitlistSubmit} className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-maroon mb-2">Email Address</label>
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={waitlistLoading}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {waitlistError && (
                    <p className="text-red-600 text-sm mb-4 text-center">{waitlistError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="btn-primary w-full py-3.5 bg-maroon text-white rounded-xl font-bold text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {waitlistLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Joining...
                      </>
                    ) : (
                      'Get Early Access'
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">
                    We'll notify you when we launch. No spam, ever.
                  </p>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-maroon mb-2">You're on the list!</h3>
                <p className="text-maroon/60 mb-6">We'll send you an email when Recur is ready for you.</p>
                <button
                  onClick={() => {
                    setShowWaitlist(false);
                    setWaitlistSubmitted(false);
                    handleStartDemo();
                  }}
                  className="btn-primary px-6 py-3 bg-maroon text-white rounded-xl font-bold"
                >
                  Explore the Demo
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                setShowWaitlist(false);
                setWaitlistSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
