import React, { useState, useEffect, useCallback } from 'react';
import { Onboarding } from './components/Onboarding';
import { GuidedDemo } from './components/GuidedDemo';
import { AppDashboard } from './components/AppDashboard';
import { ClientIntake } from './components/ClientIntake';
import { ClientProfile } from './components/ClientProfile';
import { Settings } from './components/Settings';
import { PublicProfile } from './components/PublicProfile';
import { ClientBookingFlow } from './components/ClientBookingFlow';
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { IndustryLandingPage, INDUSTRY_CONFIGS } from './components/seo/IndustryLandingPage';
import { ComparisonPage, COMPARISON_CONFIGS } from './components/seo/ComparisonPage';
import { AuthModal } from './components/AuthModal';
import { TrialBanner, Paywall } from './components/TrialBanner';
import { createCheckoutSession } from './lib/stripe';
import { Client, StylistProfile, RotationType, AppScreen, Service, BookingSettings, BookingRequest, PaymentMethod, MissedReason, Appointment } from './types';
import { ICONS, LOGOS, INDUSTRY_SAMPLE_CLIENTS } from './constants';
import { useAuth } from './lib/auth';
import {
  fetchProfile,
  saveProfile,
  fetchClients,
  saveClient as saveClientToDb,
  deleteClient as deleteClientFromDb,
  fetchBookingSettings,
  saveBookingSettings as saveBookingSettingsToDb,
  fetchPublicBookingSettings,
  submitBookingRequest,
  fetchBookingRequests,
  updateBookingRequest
} from './lib/api';

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
    serviceGoal: 'Go lighter for summer',
    maintenanceLevel: 'Medium',
    additionalNotes: 'Prefer seamless grow-out',
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
    name: 'Marcus Rivera',
    phone: '(555) 234-5678',
    email: 'marcus@email.com',
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
    serviceGoal: 'Keep it healthy and easy',
    maintenanceLevel: 'Low',
    additionalNotes: '',
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
    serviceGoal: 'Maintain healthy color',
    maintenanceLevel: 'Medium',
    additionalNotes: '',
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
    serviceGoal: 'Low maintenance',
    maintenanceLevel: 'Low',
    additionalNotes: '',
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
    name: 'Dr. Sarah Chen',
    phone: '(555) 567-8901',
    email: 'sarah.chen@email.com',
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
    serviceGoal: 'Stay bright blonde',
    maintenanceLevel: 'High',
    additionalNotes: 'Very particular about coverage',
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
    serviceGoal: 'Sun-kissed natural look',
    maintenanceLevel: 'Medium',
    additionalNotes: 'Prefers lived-in look',
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
    serviceGoal: 'Healthy, sleek styles',
    maintenanceLevel: 'Low',
    additionalNotes: 'Concerned about heat damage',
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
  // Auth state
  const { user, loading: authLoading, isConfigured: isSupabaseConfigured, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Determine initial screen from URL
  const getInitialScreen = (): AppScreen => {
    const path = window.location.pathname;
    if (path === '/about' || path === '/about/') return 'about';
    if (path === '/privacy' || path === '/privacy/') return 'privacy';
    if (path.startsWith('/book/')) return 'client-booking';
    if (path.startsWith('/for/')) return 'industry-landing';
    if (path.startsWith('/compare/')) return 'comparison';
    return 'landing';
  };
  const [screen, setScreen] = useState<AppScreen>(getInitialScreen);
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>([getInitialScreen()]);
  const [profile, setProfile] = useState<StylistProfile>(DEFAULT_PROFILE);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showDashboardTutorial, setShowDashboardTutorial] = useState(false);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [bookingAddOns, setBookingAddOns] = useState<Service[]>([]);

  // Public booking flow state
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    profileSlug: 'studio-j-hair',
    bio: 'Specializing in balayage, color correction, and lived-in looks. Making hair magic since 2015.',
    showPrices: true,
    takingNewClients: true,
    waitlistMode: false,
    requireDeposit: false,
    depositAmount: 50,
    depositType: 'fixed',
    minimumLeadTime: '48',
    maximumAdvanceBooking: '60',
    autoConfirmExisting: false,
  });
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);

  // Public booking page state (for /book/[slug] URLs)
  const getInitialSlug = (): string | null => {
    const path = window.location.pathname;
    if (path.startsWith('/book/')) {
      return path.split('/')[2] || null;
    }
    return null;
  };
  const [publicBookingSlug, setPublicBookingSlug] = useState<string | null>(getInitialSlug);
  const [publicBookingData, setPublicBookingData] = useState<{
    settings: BookingSettings | null;
    profile: StylistProfile | null;
    professionalId: string | null;
  } | null>(null);
  const [publicBookingLoading, setPublicBookingLoading] = useState(getInitialSlug() !== null);
  const [publicBookingError, setPublicBookingError] = useState<string | null>(null);

  // Industry landing page state (for /for/[industry] URLs)
  const getInitialIndustrySlug = (): string | null => {
    const path = window.location.pathname;
    if (path.startsWith('/for/')) {
      return path.split('/')[2] || null;
    }
    return null;
  };
  const [industrySlug, setIndustrySlug] = useState<string | null>(getInitialIndustrySlug);

  // Comparison page state (for /compare/[competitor] URLs)
  const getInitialComparisonSlug = (): string | null => {
    const path = window.location.pathname;
    if (path.startsWith('/compare/')) {
      return path.split('/')[2] || null;
    }
    return null;
  };
  const [comparisonSlug, setComparisonSlug] = useState<string | null>(getInitialComparisonSlug);

  // Navigate to a new screen (adds to history)
  const navigateTo = useCallback((newScreen: AppScreen) => {
    setScreenHistory(prev => [...prev, newScreen]);
    setScreen(newScreen);
  }, []);

  // Go back to previous screen
  const goBack = useCallback(() => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setScreen(previousScreen);
    } else {
      setScreen('landing');
    }
  }, [screenHistory]);

  // Check URL path on initial load for routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/about' || path === '/about/') {
      setScreen('about');
      setScreenHistory(['about']);
    } else if (path === '/privacy' || path === '/privacy/') {
      setScreen('privacy');
      setScreenHistory(['privacy']);
    } else if (path.startsWith('/book/')) {
      const slug = path.split('/')[2];
      if (slug) {
        setPublicBookingSlug(slug);
        setScreen('client-booking');
        setScreenHistory(['client-booking']);
      }
    } else if (path.startsWith('/for/')) {
      const slug = path.split('/')[2];
      if (slug && INDUSTRY_CONFIGS[slug]) {
        setIndustrySlug(slug);
        setScreen('industry-landing');
        setScreenHistory(['industry-landing']);
      }
    } else if (path.startsWith('/compare/')) {
      const slug = path.split('/')[2];
      if (slug && COMPARISON_CONFIGS[slug]) {
        setComparisonSlug(slug);
        setScreen('comparison');
        setScreenHistory(['comparison']);
      }
    }
  }, []);

  // Fetch public booking data when slug is set
  useEffect(() => {
    if (publicBookingSlug) {
      loadPublicBookingData(publicBookingSlug);
    }
  }, [publicBookingSlug]);

  const loadPublicBookingData = async (slug: string) => {
    setPublicBookingLoading(true);
    setPublicBookingError(null);
    try {
      const data = await fetchPublicBookingSettings(slug);
      if (data.settings && data.profile) {
        setPublicBookingData({
          settings: data.settings,
          profile: data.profile,
          professionalId: data.professionalId,
        });
      } else {
        setPublicBookingError('Professional not found');
      }
    } catch (error) {
      setPublicBookingError('Failed to load booking page');
    } finally {
      setPublicBookingLoading(false);
    }
  };

  // Load user data from Supabase when authenticated
  const loadUserData = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;

    setDataLoading(true);
    try {
      const [loadedProfile, loadedClients, loadedBookingSettings, loadedBookingRequests] = await Promise.all([
        fetchProfile(),
        fetchClients(),
        fetchBookingSettings(),
        fetchBookingRequests(),
      ]);

      if (loadedProfile) {
        // User has a profile - load their data
        setProfile(loadedProfile);
        setHasOnboarded(true);
        setBookingRequests(loadedBookingRequests || []);

        if (loadedClients.length > 0) {
          setClients(loadedClients);
        }

        if (loadedBookingSettings) {
          setBookingSettings(loadedBookingSettings);
        }

        // Go to dashboard if on landing page
        if (screen === 'landing') {
          navigateTo('dashboard');
        }
      } else {
        // New user - needs to complete onboarding
        setHasOnboarded(false);
        if (screen === 'landing') {
          navigateTo('onboarding');
        }
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user, isSupabaseConfigured, screen, navigateTo]);

  // Load data when user logs in
  // Skip if returning from payment (URL param will handle it)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isReturningFromPayment = params.get('onboarding') === 'complete';

    if (user && !dataLoaded && !dataLoading && !isReturningFromPayment) {
      loadUserData();
    }
  }, [user, dataLoaded, dataLoading, loadUserData]);

  // Reset data loaded state when user logs out
  useEffect(() => {
    if (!user) {
      setDataLoaded(false);
    }
  }, [user]);

  // Handle URL parameters (e.g., after Stripe redirect)
  // This effect runs BEFORE loadUserData by setting dataLoaded to prevent race conditions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const onboardingStatus = params.get('onboarding');

    if (onboardingStatus === 'complete' && user) {
      // Payment successful - go to dashboard with tutorial
      // Set dataLoaded first to prevent loadUserData from overwriting our state
      setDataLoaded(true);
      setHasOnboarded(true);
      setScreen('dashboard');
      setScreenHistory(['dashboard']);
      setShowDashboardTutorial(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);

      // Load user data in the background without overwriting screen state
      if (isSupabaseConfigured) {
        Promise.all([
          fetchProfile(),
          fetchClients(),
          fetchBookingSettings(),
          fetchBookingRequests(),
        ]).then(([loadedProfile, loadedClients, loadedBookingSettings, loadedBookingRequests]) => {
          if (loadedProfile) {
            setProfile(loadedProfile);
          }
          if (loadedClients && loadedClients.length > 0) {
            setClients(loadedClients);
          }
          if (loadedBookingSettings) {
            setBookingSettings(loadedBookingSettings);
          }
          if (loadedBookingRequests) {
            setBookingRequests(loadedBookingRequests);
          }
        }).catch(err => console.error('Error loading data after payment:', err));
      }
    } else if (onboardingStatus === 'payment') {
      // Payment was cancelled - stay on onboarding step 6
      setScreen('onboarding');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, isSupabaseConfigured]);

  // Go back to landing (resets history)
  const goToLanding = () => {
    setScreenHistory(['landing']);
    setScreen('landing');
  };

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
      navigateTo('dashboard');
    } else {
      navigateTo('guided-demo');
    }
  };

  const handleGuidedDemoComplete = async (newProfile: StylistProfile, demoClients: Client[], newBookingSettings: BookingSettings) => {
    setProfile(newProfile);
    setClients(demoClients);
    setBookingSettings(newBookingSettings);
    setHasOnboarded(true);

    // Persist to Supabase if user is authenticated
    if (user && isSupabaseConfigured) {
      const { error, profileId } = await saveProfile(newProfile);
      if (error) {
        console.error('Error saving profile:', error);
      } else if (profileId) {
        // Save clients and booking settings
        for (const client of demoClients) {
          await saveClientToDb(client);
        }
        await saveBookingSettingsToDb(newBookingSettings);
      }
    }

    navigateTo('dashboard');
  };

  const handleOnboardingComplete = async (newProfile: StylistProfile) => {
    setProfile(newProfile);

    // Load industry-specific sample clients based on selected industry
    const industry = newProfile.industry || 'hair-stylist';
    const sampleClients = INDUSTRY_SAMPLE_CLIENTS[industry] || SAMPLE_CLIENTS;
    setClients(sampleClients);
    setHasOnboarded(true);

    // Persist to Supabase if user is authenticated
    if (user && isSupabaseConfigured) {
      const { error, profileId } = await saveProfile(newProfile);
      if (error) {
        console.error('Error saving profile:', error);
      } else if (profileId) {
        // Save sample clients to database
        for (const client of sampleClients) {
          await saveClientToDb(client);
        }
      }
    }

    navigateTo('dashboard');
  };

  const handleSaveClient = async (client: Client) => {
    // Check if this is an existing client (update) or new client (add)
    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      // Update existing client
      const updatedClients = [...clients];
      updatedClients[existingIndex] = client;
      setClients(updatedClients);
      setSelectedClient(client);
    } else {
      // Add new client
      setClients([client, ...clients]);
    }

    // Persist to Supabase if user is authenticated
    if (user && isSupabaseConfigured) {
      const { error } = await saveClientToDb(client);
      if (error) {
        console.error('Error saving client:', error);
      }
    }

    goBack(); // Go back to previous screen
  };

  // Handle completing an appointment with payment info
  const handleCompleteAppointment = async (
    clientId: string,
    appointmentDate: string,
    paymentMethod: PaymentMethod,
    paymentAmount: number,
    paymentNote?: string,
    arrivedLate?: boolean
  ) => {
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex < 0) return;

    const updatedClient = { ...clients[clientIndex] };

    // Check if appointment exists for this date
    const existingAppointment = updatedClient.appointments.find(apt => apt.date === appointmentDate);

    if (existingAppointment) {
      // Update existing appointment
      updatedClient.appointments = updatedClient.appointments.map(apt => {
        if (apt.date === appointmentDate) {
          return {
            ...apt,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            paymentMethod,
            paymentAmount,
            paymentNote,
            arrivedLate: arrivedLate || false,
            updatedAt: new Date().toISOString(),
          };
        }
        return apt;
      });
    } else {
      // Create new completed appointment if none exists for this date
      updatedClient.appointments = [
        ...updatedClient.appointments,
        {
          date: appointmentDate,
          service: updatedClient.baseService?.name || 'Service',
          price: updatedClient.baseService?.price || 0,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          paymentMethod,
          paymentAmount,
          paymentNote,
          arrivedLate: arrivedLate || false,
          updatedAt: new Date().toISOString(),
        }
      ];
    }
    // Remember preferred payment method for this client
    updatedClient.preferredPaymentMethod = paymentMethod;

    const updatedClients = [...clients];
    updatedClients[clientIndex] = updatedClient;
    setClients(updatedClients);

    // Persist to Supabase
    if (user && isSupabaseConfigured) {
      await saveClientToDb(updatedClient);
    }
  };

  // Handle marking an appointment as missed
  const handleMissedAppointment = async (
    clientId: string,
    appointmentDate: string,
    missedReason: MissedReason,
    options?: { chargeFee?: boolean; flagAtRisk?: boolean; sendMessage?: boolean; rescheduleDate?: string }
  ) => {
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex < 0) return;

    const updatedClient = { ...clients[clientIndex] };

    // Map missedReason to appointment status
    const statusMap: Record<MissedReason, 'no-show' | 'cancelled' | 'late-cancel'> = {
      'no-show': 'no-show',
      'late-cancel': 'late-cancel',
      'cancelled': 'cancelled',
      'rescheduled': 'cancelled',
    };

    // Find the original appointment to get service/price info for rescheduling
    const originalAppointment = updatedClient.appointments.find(apt => apt.date === appointmentDate);

    updatedClient.appointments = updatedClient.appointments.map(apt => {
      if (apt.date === appointmentDate) {
        return {
          ...apt,
          status: statusMap[missedReason],
          missedReason,
          updatedAt: new Date().toISOString(),
        };
      }
      return apt;
    });

    // If rescheduled with a new date, add a new appointment and update nextAppointment
    if (missedReason === 'rescheduled' && options?.rescheduleDate && originalAppointment) {
      const newAppointment = {
        date: options.rescheduleDate,
        service: originalAppointment.service,
        price: originalAppointment.price,
        status: 'upcoming' as const,
      };
      updatedClient.appointments.push(newAppointment);
      updatedClient.nextAppointment = options.rescheduleDate;
    }

    // Flag as at-risk if option selected
    if (options?.flagAtRisk) {
      updatedClient.status = 'at-risk';
    }

    const updatedClients = [...clients];
    updatedClients[clientIndex] = updatedClient;
    setClients(updatedClients);

    // Persist to Supabase
    if (user && isSupabaseConfigured) {
      await saveClientToDb(updatedClient);
    }
  };

  // Handle updating a past appointment
  const handleUpdateAppointment = async (
    clientId: string,
    appointmentDate: string,
    updates: Partial<Appointment>
  ) => {
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex < 0) return;

    const updatedClient = { ...clients[clientIndex] };
    updatedClient.appointments = updatedClient.appointments.map(apt => {
      if (apt.date === appointmentDate) {
        return {
          ...apt,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return apt;
    });

    const updatedClients = [...clients];
    updatedClients[clientIndex] = updatedClient;
    setClients(updatedClients);

    // Persist to Supabase
    if (user && isSupabaseConfigured) {
      await saveClientToDb(updatedClient);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    navigateTo('client-profile');
  };

  // Save profile without navigating (used in onboarding before Stripe redirect)
  const handleSaveProfile = async (newProfile: StylistProfile) => {
    // Ensure email is set from auth if not provided
    const profileWithEmail = {
      ...newProfile,
      email: newProfile.email || user?.email || '',
    };

    setProfile(profileWithEmail);
    setHasOnboarded(true);

    // Load industry-specific sample clients
    const industry = profileWithEmail.industry || 'hair-stylist';
    const sampleClients = INDUSTRY_SAMPLE_CLIENTS[industry] || SAMPLE_CLIENTS;
    setClients(sampleClients);

    // Persist to Supabase if user is authenticated
    if (user && isSupabaseConfigured) {
      const { error, profileId } = await saveProfile(profileWithEmail);
      if (error) {
        console.error('Error saving profile:', error);
      } else if (profileId) {
        // Save sample clients to database
        for (const client of sampleClients) {
          await saveClientToDb(client);
        }
        await saveBookingSettingsToDb(bookingSettings);
      }
    }
  };

  // Render based on screen
  if (screen === 'onboarding') {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onSaveProfile={handleSaveProfile}
        onBack={goBack}
        onLogout={user ? async () => {
          await signOut();
          setScreenHistory(['landing']);
          setScreen('landing');
          setHasOnboarded(false);
        } : undefined}
      />
    );
  }

  if (screen === 'guided-demo') {
    return (
      <GuidedDemo
        onComplete={handleGuidedDemoComplete}
        onExit={() => {
          setScreenHistory(['landing']);
          setScreen('landing');
        }}
      />
    );
  }

  // Check trial/subscription status
  const isTrialExpired = () => {
    if (!profile.trialEndsAt) return false;
    return new Date(profile.trialEndsAt) < new Date();
  };

  const hasActiveSubscription = () => {
    return profile.subscriptionStatus === 'active' || profile.subscriptionStatus === 'trialing';
  };

  const handleSubscribeFromPaywall = async () => {
    setCheckoutLoading(true);
    try {
      const { url, error } = await createCheckoutSession();
      if (error) {
        console.error('Checkout error:', error);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Show paywall if trial expired and no active subscription
  if (screen === 'dashboard' && user && isTrialExpired() && !hasActiveSubscription()) {
    return (
      <Paywall
        onSubscribe={handleSubscribeFromPaywall}
        isLoading={checkoutLoading}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <>
        {/* Trial Banner */}
        {user && !hasActiveSubscription() && profile.trialEndsAt && (
          <TrialBanner
            trialEndsAt={profile.trialEndsAt}
            subscriptionStatus={profile.subscriptionStatus}
          />
        )}
        <AppDashboard
          profile={profile}
          clients={clients}
          bookingRequests={bookingRequests}
          bookingSettings={bookingSettings}
          onAddClient={() => {
            setSelectedClient(null);
            navigateTo('client-intake');
          }}
          onViewClient={handleViewClient}
          onBack={goBack}
          onExitDemo={user ? undefined : () => setShowWaitlist(true)}
          onLogoClick={() => {
            setScreenHistory(['landing']);
            setScreen('landing');
          }}
          onNavigateToSettings={() => navigateTo('settings')}
          onLogout={user ? async () => {
            await signOut();
            setScreenHistory(['landing']);
            setScreen('landing');
            setHasOnboarded(false);
          } : undefined}
          showTutorial={showDashboardTutorial}
          onTutorialComplete={() => setShowDashboardTutorial(false)}
          onCompleteAppointment={handleCompleteAppointment}
          onMissedAppointment={handleMissedAppointment}
          onUpdateBookingRequest={async (id, status) => {
            const { error } = await updateBookingRequest(id, status);
            if (!error) {
              // Update local state
              setBookingRequests(prev => prev.map(r =>
                r.id === id ? { ...r, status } : r
              ));

              // If confirmed, create a client from the booking request
              if (status === 'confirmed') {
                const request = bookingRequests.find(r => r.id === id);
                if (request) {
                  const newClient: Client = {
                    id: crypto.randomUUID(),
                    name: request.clientName || 'New Client',
                    phone: request.clientPhone || '',
                    email: request.clientEmail || '',
                    rotation: RotationType.STANDARD,
                    rotationWeeks: 6,
                    baseService: request.requestedService || null,
                    addOns: request.requestedAddOns?.map(s => ({ service: s, frequency: 'Every visit' })) || [],
                    annualValue: (request.requestedService?.price || 0) * 8,
                    nextAppointment: request.requestedDate || new Date().toISOString().split('T')[0],
                    clientSince: new Date().toISOString().split('T')[0],
                    preferredDays: request.preferredDays || [],
                    preferredTime: request.preferredTime || '',
                    contactMethod: request.contactMethod || '',
                    occupation: request.occupation || '',
                    clientFacing: false,
                    morningTime: request.morningTime || '',
                    events: [],
                    photographed: '',
                    concerns: request.concerns || '',
                    serviceGoal: request.serviceGoal || '',
                    maintenanceLevel: request.maintenanceLevel || '',
                    additionalNotes: request.additionalNotes || '',
                    naturalColor: request.naturalColor || '',
                    currentColor: request.currentColor || '',
                    appointments: [{
                      date: request.requestedDate || new Date().toISOString().split('T')[0],
                      service: request.requestedService?.name || 'Consultation',
                      price: request.requestedService?.price || 0,
                      status: 'upcoming'
                    }],
                    notes: `Booked via online form. ${request.additionalNotes || ''}`.trim(),
                    status: 'confirmed'
                  };

                  // Add to state and save to database
                  setClients(prev => [...prev, newClient]);
                  if (user && isSupabaseConfigured) {
                    await saveClientToDb(newClient);
                  }
                }
              }
            }
          }}
        />

        {/* Waitlist Modal for Dashboard */}
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
                  <div className="px-6 py-5 bg-maroon text-white text-center">
                    <h3 className="text-xl sm:text-2xl font-serif mb-2">Join the Waitlist</h3>
                    <p className="text-white/70 text-sm">Be the first to know when Recur launches.</p>
                  </div>
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
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon disabled:opacity-50"
                      />
                    </div>
                    {waitlistError && (
                      <p className="text-red-600 text-sm mb-4 text-center">{waitlistError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={waitlistLoading}
                      className="btn-primary w-full py-3.5 bg-maroon text-white rounded-xl font-bold text-base disabled:opacity-70"
                    >
                      {waitlistLoading ? 'Joining...' : 'Get Early Access'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif text-maroon mb-2">You're on the list!</h3>
                  <p className="text-maroon/60 mb-6">We'll send you an email when Recur is ready.</p>
                  <button
                    onClick={() => {
                      setShowWaitlist(false);
                      setWaitlistSubmitted(false);
                    }}
                    className="btn-primary px-6 py-3 bg-maroon text-white rounded-xl font-bold"
                  >
                    Back to Demo
                  </button>
                </div>
              )}
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
      </>
    );
  }

  if (screen === 'settings') {
    return (
      <Settings
        profile={profile}
        bookingSettings={bookingSettings}
        clients={clients}
        onBack={goBack}
        onUpdateProfile={async (updatedProfile) => {
          setProfile(updatedProfile);
          // Persist to Supabase
          if (user && isSupabaseConfigured) {
            await saveProfile(updatedProfile);
          }
        }}
        onUpdateBookingSettings={async (settings) => {
          setBookingSettings(settings);
          if (user && isSupabaseConfigured) {
            const { error } = await saveBookingSettingsToDb(settings);
            if (error) {
              throw error;
            }
          }
        }}
        onLogoClick={() => {
          setScreenHistory(['landing']);
          setScreen('landing');
        }}
        onPreviewProfile={() => navigateTo('public-profile')}
        onLogout={user ? async () => {
          await signOut();
          setScreenHistory(['landing']);
          setScreen('landing');
          setHasOnboarded(false);
        } : undefined}
      />
    );
  }

  if (screen === 'public-profile') {
    return (
      <PublicProfile
        profile={profile}
        bookingSettings={bookingSettings}
        onStartBooking={() => navigateTo('client-booking')}
        onJoinWaitlist={() => {
          alert('Demo: You would be added to the waitlist and notified when a spot opens.');
          goBack();
        }}
        onBack={goBack}
      />
    );
  }

  if (screen === 'about') {
    return (
      <AboutPage
        onBack={() => {
          setScreen('landing');
          setScreenHistory(['landing']);
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  if (screen === 'privacy') {
    return (
      <PrivacyPage
        onBack={() => {
          setScreen('landing');
          setScreenHistory(['landing']);
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  if (screen === 'industry-landing' && industrySlug) {
    return (
      <IndustryLandingPage
        industrySlug={industrySlug}
        onSignUp={() => {
          setAuthModalMode('signup');
          setShowAuthModal(true);
        }}
        onDemo={handleStartDemo}
        onBack={() => {
          setScreen('landing');
          setScreenHistory(['landing']);
          setIndustrySlug(null);
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  if (screen === 'comparison' && comparisonSlug) {
    return (
      <ComparisonPage
        competitorSlug={comparisonSlug}
        onSignUp={() => {
          setAuthModalMode('signup');
          setShowAuthModal(true);
        }}
        onDemo={handleStartDemo}
        onBack={() => {
          setScreen('landing');
          setScreenHistory(['landing']);
          setComparisonSlug(null);
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  if (screen === 'client-booking') {
    // Use public data if coming from /book/[slug] URL
    const isPublicBooking = !!publicBookingSlug;
    const bookingProfile = isPublicBooking && publicBookingData?.profile ? publicBookingData.profile : profile;
    const bookingSettingsData = isPublicBooking && publicBookingData?.settings ? publicBookingData.settings : bookingSettings;
    const profId = isPublicBooking ? (publicBookingData?.professionalId || '') : '';

    // Show loading state for public booking
    if (isPublicBooking && publicBookingLoading) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto mb-4"></div>
            <p className="text-maroon/60">Loading booking page...</p>
          </div>
        </div>
      );
    }

    // Show error state for public booking
    if (isPublicBooking && publicBookingError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-maroon mb-2">Page Not Found</h1>
            <p className="text-maroon/60 mb-6">{publicBookingError}</p>
            <a href="/" className="inline-block px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors">
              Go Home
            </a>
          </div>
        </div>
      );
    }

    return (
      <ClientBookingFlow
        profile={bookingProfile}
        bookingSettings={bookingSettingsData}
        professionalId={profId}
        onSubmit={async (request: BookingRequest) => {
          console.log('New booking request:', request);
          if (isPublicBooking && profId) {
            // Submit to database for public bookings
            const { error } = await submitBookingRequest(profId, request);
            if (error) {
              console.error('Failed to submit booking:', error);
              alert('Failed to submit booking request. Please try again.');
            }
          } else {
            // Demo mode
            alert('Demo: In production, this request would be sent to the professional for review.');
          }
        }}
        onBack={() => {
          if (isPublicBooking) {
            window.location.href = '/';
          } else {
            goBack();
          }
        }}
      />
    );
  }

  if (screen === 'client-intake') {
    return (
      <ClientIntake
        profile={profile}
        industry={profile.industry || 'hair-stylist'}
        onSave={handleSaveClient}
        onBack={goBack}
        clientToEdit={selectedClient || undefined}
      />
    );
  }

  if (screen === 'client-profile' && selectedClient) {
    const handleBookAppointment = () => {
      // Initialize modal with recommendations based on client data
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (selectedClient.rotationWeeks || 10) * 7);
      setBookingDate(nextDate.toISOString().split('T')[0]);
      // Set default time based on client's preference
      const preferredTimeMap: Record<string, string> = {
        'Morning': '10:00 AM',
        'Midday': '12:00 PM',
        'Afternoon': '3:00 PM',
        'Evening': '6:00 PM',
      };
      setBookingTime(preferredTimeMap[selectedClient.preferredTime] || '10:00 AM');
      setBookingService(selectedClient.baseService || null);

      // Pre-select add-ons that are marked as "Every visit"
      const everyVisitAddOns = selectedClient.addOns
        ?.filter(addon => addon.frequency === 'Every visit')
        .map(addon => addon.service) || [];
      setBookingAddOns(everyVisitAddOns);

      setShowBookingModal(true);
    };

    const handleConfirmBooking = async () => {
      if (!bookingService) return;

      const addOnTotal = bookingAddOns.reduce((sum, addon) => sum + addon.price, 0);
      const totalPrice = bookingService.price + addOnTotal;
      const serviceName = bookingAddOns.length > 0
        ? `${bookingService.name} + ${bookingAddOns.map(a => a.name).join(', ')}`
        : bookingService.name;

      const newAppointment = {
        date: bookingDate,
        service: serviceName,
        price: totalPrice,
        status: 'scheduled' as const,
      };
      const updatedClient = {
        ...selectedClient,
        appointments: [...(selectedClient.appointments || []), newAppointment],
        nextAppointment: bookingDate,
      };
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      setSelectedClient(updatedClient);
      setShowBookingModal(false);

      // Persist to Supabase
      if (user && isSupabaseConfigured) {
        await saveClientToDb(updatedClient);
      }
    };

    const handleMarkOverdue = async () => {
      const updatedClient = { ...selectedClient, status: 'at-risk' as const };
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      setSelectedClient(updatedClient);
      alert(`${selectedClient.name} marked as at-risk`);

      // Persist to Supabase
      if (user && isSupabaseConfigured) {
        await saveClientToDb(updatedClient);
      }
    };

    const handleArchive = async () => {
      if (confirm(`Archive ${selectedClient.name}? They will be removed from your active clients.`)) {
        setClients(clients.filter(c => c.id !== selectedClient.id));

        // Delete from Supabase
        if (user && isSupabaseConfigured) {
          await deleteClientFromDb(selectedClient.id);
        }

        setSelectedClient(null);
        goBack();
      }
    };

    const baseServices = profile.services.filter(s => s.category === 'base');
    const addonServices = profile.services.filter(s => s.category === 'addon');
    const bookingTotal = (bookingService?.price || 0) + bookingAddOns.reduce((sum, a) => sum + a.price, 0);

    const toggleBookingAddOn = (service: Service) => {
      if (bookingAddOns.some(a => a.id === service.id)) {
        setBookingAddOns(bookingAddOns.filter(a => a.id !== service.id));
      } else {
        setBookingAddOns([...bookingAddOns, service]);
      }
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
      <>
        <ClientProfile
          client={selectedClient}
          industry={profile.industry || 'hair-stylist'}
          professional={profile}
          onBack={() => {
            setSelectedClient(null);
            goBack();
          }}
          onEdit={() => {
            navigateTo('client-intake');
          }}
          onBookAppointment={handleBookAppointment}
          onMarkOverdue={handleMarkOverdue}
          onArchive={handleArchive}
          onUpdateAppointment={(appointmentDate, updates) => {
            handleUpdateAppointment(selectedClient.id, appointmentDate, updates);
          }}
        />

        {/* Booking Modal */}
        {showBookingModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 bg-maroon text-white">
                <h3 className="text-xl font-serif mb-1">Book Appointment</h3>
                <p className="text-white/70 text-sm">for {selectedClient.name}</p>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                {/* Recommendation Note */}
                <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                  Recommended based on {selectedClient.rotationWeeks}-week rotation
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">
                    Time <span className="font-normal text-slate-400">(prefers {selectedClient.preferredTime})</span>
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none bg-white appearance-none cursor-pointer"
                    style={{ WebkitAppearance: 'menulist' }}
                  >
                    <optgroup label="Morning">
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="9:30 AM">9:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                    </optgroup>
                    <optgroup label="Midday">
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="1:30 PM">1:30 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                    </optgroup>
                    <optgroup label="Afternoon">
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="3:30 PM">3:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="5:30 PM">5:30 PM</option>
                    </optgroup>
                    <optgroup label="Evening">
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                    </optgroup>
                  </select>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Service</label>
                  <select
                    value={bookingService?.id || ''}
                    onChange={(e) => {
                      const service = baseServices.find(s => s.id === e.target.value);
                      setBookingService(service || null);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none bg-white"
                  >
                    <option value="">Select a service</option>
                    {baseServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {formatCurrency(service.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add-ons */}
                {addonServices.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-maroon mb-2">Add-ons</label>
                    <div className="space-y-2">
                      {addonServices.map(service => {
                        const isSelected = bookingAddOns.some(a => a.id === service.id);
                        const isRecommended = selectedClient.addOns?.some(
                          a => a.service.id === service.id && a.frequency === 'Every visit'
                        );
                        return (
                          <label
                            key={service.id}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                              isSelected ? 'bg-maroon/10 border-2 border-maroon' : 'bg-slate-50 border-2 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleBookingAddOn(service)}
                                className="w-5 h-5 rounded border-slate-300 text-maroon focus:ring-maroon"
                              />
                              <span className="font-medium text-maroon">{service.name}</span>
                              {isRecommended && (
                                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                  Usual
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500">+{formatCurrency(service.price)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-maroon">Total</span>
                  <span className="text-2xl font-serif text-maroon">{formatCurrency(bookingTotal)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 text-maroon font-bold hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!bookingService}
                    className="flex-1 px-4 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
          {user ? (
            <button
              onClick={() => navigateTo('dashboard')}
              className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-sm sm:text-[15px] font-bold shadow-sm"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-[15px] font-medium text-maroon hover:opacity-70"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setShowAuthModal(true);
                }}
                className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-sm sm:text-[15px] font-bold shadow-sm"
              >
                Sign Up
              </button>
            </>
          )}
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
              <span className="hero-animate hero-animate-delay-3 inline-block">before you earn it.</span>
            </h1>

            <p className="hero-animate hero-animate-delay-3 text-base sm:text-lg lg:text-xl text-maroon/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              For professionals with recurring clients. Map your rotations, forecast your income, plan with confidence.
            </p>

            <div className="hero-animate hero-animate-delay-4 flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setShowAuthModal(true);
                }}
                className="btn-primary inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-maroon text-white rounded-full text-base sm:text-lg font-bold shadow-xl"
              >
                Get Started Free
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

        {/* SECTION: Who It's For */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-center text-maroon mb-8 sm:mb-12">
              Built for professionals with recurring clients
            </h2>
            <div className="scroll-reveal delay-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {[
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="6" r="3"/>
                      <path d="M8.12 8.12 12 12"/>
                      <path d="M20 4 8.12 15.88"/>
                      <circle cx="6" cy="18" r="3"/>
                      <path d="M14.8 14.8 20 20"/>
                    </svg>
                  ),
                  label: 'Hair stylists & barbers',
                  color: '#C17F59'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B9A7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.4 14.4 9.6 9.6"/>
                      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/>
                      <path d="m2.515 18.657 1.414-1.414"/>
                      <path d="M5.343 21.485a2 2 0 0 1-2.828-2.828l1.767-1.768a2 2 0 0 1 2.829 2.829z"/>
                    </svg>
                  ),
                  label: 'Personal trainers',
                  color: '#8B9A7D'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                      <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                      <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                    </svg>
                  ),
                  label: 'Massage therapists',
                  color: '#C17F59'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2A2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>
                      <path d="M8 12h.01"/>
                      <path d="M12 12h.01"/>
                      <path d="M16 12h.01"/>
                    </svg>
                  ),
                  label: 'Therapists & counselors',
                  color: '#2A2420'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B9A7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                    </svg>
                  ),
                  label: 'Estheticians',
                  color: '#8B9A7D'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2A2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                      <path d="M10 6h4"/>
                      <path d="M10 10h4"/>
                      <path d="M10 14h4"/>
                      <path d="M10 18h4"/>
                    </svg>
                  ),
                  label: 'Consultants & coaches',
                  color: '#2A2420'
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 7v14"/>
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                    </svg>
                  ),
                  label: 'Tutors & instructors',
                  color: '#C17F59'
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-cream p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center border border-slate-100 flex flex-col items-center"
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-maroon">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="scroll-reveal delay-2 text-center text-base sm:text-lg text-maroon/70 italic max-w-xl mx-auto">
              "If your clients come back on a schedule, Recur helps you know what that's worth."
            </p>
          </div>
        </section>

        {/* SECTION 3: The Solution */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-cream" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-center text-maroon mb-8 sm:mb-16">
              What changes when you stop guessing
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
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">Every rotation has a value. Add them up and you'll always know what's coming.</p>
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
                      { name: 'Marcus Rivera', tier: 'Standard', amount: '$1,240', date: 'Apr 18', color: '#7c9a7e' },
                      { name: 'Dr. Sarah Chen', tier: 'Priority', amount: '$2,100', date: 'Apr 8', color: '#c17f59' },
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

            <p className="scroll-reveal delay-3 text-center text-base sm:text-lg text-maroon/60 mt-8 sm:mt-12">
              No anxiety. No guessing. Just your books, organized.
            </p>
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

        {/* SECTION 6: Scheduling */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-cream">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-3 sm:mb-4">
                Scheduling that remembers for you
              </h2>
              <p className="scroll-reveal delay-1 text-base sm:text-lg text-maroon/60 max-w-2xl mx-auto px-2">
                Recur pre-fills appointments based on each client's rotation, preferences, and services — so you're not starting from scratch every time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Pre-filled appointments */}
              <div className="scroll-reveal delay-1 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-white border-2 border-slate-100 shadow-sm">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#C17F5915' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <path d="M9 16l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Pre-filled appointments</h3>
                <p className="text-sm sm:text-base text-maroon/70">Next visit date is calculated from their rotation plan. No manual math, no guessing.</p>
              </div>

              {/* Card 2: Preferences remembered */}
              <div className="scroll-reveal delay-2 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-white border-2 border-slate-100 shadow-sm">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#8B9A7D15' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B9A7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Preferences remembered</h3>
                <p className="text-sm sm:text-base text-maroon/70">Their preferred day, time, and services are pre-selected. Just confirm and book.</p>
              </div>

              {/* Card 3: Overdue alerts */}
              <div className="scroll-reveal delay-3 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-white border-2 border-slate-100 shadow-sm">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#2A242015' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Overdue alerts</h3>
                <p className="text-sm sm:text-base text-maroon/70">When a client misses their rotation window, Recur flags them so you can follow up.</p>
              </div>

              {/* Card 4: Accept payments */}
              <div className="scroll-reveal delay-3 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] bg-white border-2 border-slate-100 shadow-sm">
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#C17F5915' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Accept payments</h3>
                <p className="text-sm sm:text-base text-maroon/70">Connect Stripe to send invoices and collect deposits — without leaving Recur.</p>
              </div>
            </div>

            <p className="scroll-reveal delay-3 text-center text-base sm:text-lg text-maroon/60 mt-8 sm:mt-12 italic">
              You set it up once. Recur handles the rest.
            </p>
          </div>
        </section>

        {/* SECTION 6.5: Client Self-Onboarding */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-3 sm:mb-4">
                Get new clients without the back-and-forth
              </h2>
              <p className="scroll-reveal delay-1 text-base sm:text-lg text-maroon/60 max-w-2xl mx-auto px-2">
                Share your booking link. Clients fill out your intake form, request an appointment, and add payment — before you ever respond.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Shareable booking page */}
              <div className="scroll-reveal delay-1 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border-2 shadow-sm" style={{ backgroundColor: '#C17F5910', borderColor: '#C17F5930' }}>
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#C17F5920' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Shareable booking page</h3>
                <p className="text-sm sm:text-base text-maroon/70">Your own branded profile page with services, availability, and a "Book Now" button. Share it anywhere.</p>
              </div>

              {/* Card 2: Client fills out intake */}
              <div className="scroll-reveal delay-2 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border-2 shadow-sm" style={{ backgroundColor: '#8B9A7D10', borderColor: '#8B9A7D30' }}>
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#8B9A7D20' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B9A7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">Client fills out intake</h3>
                <p className="text-sm sm:text-base text-maroon/70">New clients answer your consultation questions, select services, and pick their preferred time — all before you lift a finger.</p>
              </div>

              {/* Card 3: You confirm on your terms */}
              <div className="scroll-reveal delay-3 card-hover p-6 sm:p-8 rounded-2xl sm:rounded-[28px] border-2 shadow-sm" style={{ backgroundColor: '#2A242008', borderColor: '#2A242020' }}>
                <div className="card-icon w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#2A242015' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-maroon mb-2">You confirm on your terms</h3>
                <p className="text-sm sm:text-base text-maroon/70">Review requests in your dashboard, approve or decline, and the client is added to your book instantly. No phone tag required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Pricing */}
        <section className="py-12 sm:py-24 px-4 sm:px-6 bg-cream" id="pricing">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-serif text-maroon mb-8 sm:mb-12">
              Simple pricing. Serious results.
            </h2>

            <div className="price-card bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[32px] shadow-xl border border-slate-100">
              <div className="text-4xl sm:text-5xl font-serif text-maroon mb-2 number-animate">$29<span className="text-xl sm:text-2xl text-slate-400">/month</span></div>
              <p className="text-slate-400 font-medium mb-6 sm:mb-8 text-sm sm:text-base">Billed monthly. Cancel anytime.</p>

              <ul className="text-left space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {[
                  'Unlimited clients',
                  'Full income dashboard',
                  'Client profiles and intake',
                  'Shareable booking link',
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
                onClick={() => {
                  setAuthModalMode('signup');
                  setShowAuthModal(true);
                }}
                className="btn-primary w-full py-3 sm:py-4 bg-maroon text-white rounded-xl font-bold text-base sm:text-lg"
              >
                Get Started Free
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
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm sm:text-[15px] font-medium text-maroon/60">
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-maroon transition-colors">How It Works</button>
                <button onClick={() => scrollTo('pricing')} className="hover:text-maroon transition-colors">Pricing</button>
                <button className="hover:text-maroon transition-colors">Privacy</button>
                <button className="hover:text-maroon transition-colors">Contact</button>
                <a
                  href="https://www.instagram.com/bookrecur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-maroon transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-400">© 2026 Recur. The income system for recurring clients.</p>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          setDataLoaded(false);
          loadUserData();
        }}
      />
    </div>
  );
};

export default App;
