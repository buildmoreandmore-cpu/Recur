import React, { useState, useEffect } from 'react';
import { Client, RotationType, StylistProfile, BookingRequest, Appointment, PaymentMethod, MissedReason, BookingSettings } from '../types';
import { ICONS, LOGOS, PAYMENT_METHODS, MISSED_REASONS } from '../constants';
import { GettingStartedChecklist } from './GettingStartedChecklist';

// Tooltip component for dashboard feature hints
const Tooltip: React.FC<{ text: string; children: React.ReactNode; position?: 'top' | 'bottom' | 'left' | 'right' }> = ({
  text,
  children,
  position = 'top'
}) => {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}>
          <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal">
            {text}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Sample booking requests for demo
const SAMPLE_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    clientName: 'Sarah Mitchell',
    clientPhone: '(555) 234-5678',
    clientEmail: 'sarah.mitchell@email.com',
    referralSource: 'Instagram',
    contactMethod: 'text',
    preferredDays: ['Tue', 'Thu', 'Sat'],
    preferredTime: 'Morning',
    occupation: 'Marketing Manager',
    upcomingEvents: 'Company retreat in March',
    morningTime: '15 min',
    serviceGoal: 'Looking for a fresh, modern look. Want to go lighter for spring but still low-maintenance.',
    maintenanceLevel: 'Low',
    concerns: 'Sensitive scalp, had a bad bleaching experience years ago',
    naturalColor: 'Dark brown',
    currentColor: 'Virgin hair (no color)',
    requestedService: { id: 'color-cut', name: 'Color + Cut', price: 185, category: 'base' },
    requestedAddOns: [{ id: 'treatment', name: 'Deep Treatment', price: 35, category: 'addon' }],
    requestedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    requestedTimeSlot: 'Morning',
    additionalNotes: 'Very excited to finally find someone who specializes in balayage!',
    hasCardOnFile: true,
    depositPaid: false,
    cardLast4: '4242',
  },
  {
    id: 'req-2',
    status: 'pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    clientName: 'Mike Johnson',
    clientPhone: '(555) 345-6789',
    clientEmail: 'mike.j@email.com',
    referralSource: 'Referral from friend',
    contactMethod: 'email',
    preferredDays: ['Sat'],
    preferredTime: 'Midday',
    occupation: 'Software Engineer',
    upcomingEvents: '',
    morningTime: '5 min',
    serviceGoal: 'Just need a clean cut. Nothing fancy.',
    maintenanceLevel: 'Low',
    concerns: '',
    requestedService: { id: 'cut-style', name: 'Cut + Style', price: 85, category: 'base' },
    requestedAddOns: [],
    requestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    requestedTimeSlot: 'Midday',
    additionalNotes: '',
    hasCardOnFile: false,
    depositPaid: false,
  },
];

interface AppDashboardProps {
  profile: StylistProfile;
  clients: Client[];
  bookingRequests?: BookingRequest[];
  bookingSettings?: BookingSettings;
  onAddClient: () => void;
  onViewClient: (client: Client) => void;
  onBack: () => void;
  onExitDemo?: () => void;
  onLogoClick?: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
  showTutorial?: boolean;
  onTutorialComplete?: () => void;
  onUpdateBookingRequest?: (id: string, status: 'confirmed' | 'declined') => void;
  // New appointment completion handlers
  onCompleteAppointment?: (clientId: string, appointmentDate: string, paymentMethod: PaymentMethod, paymentAmount: number, paymentNote?: string, arrivedLate?: boolean) => void;
  onMissedAppointment?: (clientId: string, appointmentDate: string, missedReason: MissedReason, options?: { chargeFee?: boolean; flagAtRisk?: boolean; sendMessage?: boolean; rescheduleDate?: string }) => void;
}

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Your Dashboard!",
    description: "This is your command center for managing clients and tracking revenue. Let's take a quick tour.",
    highlight: null,
  },
  {
    title: "Financial Forecast",
    description: "See your projected annual revenue at a glance. Track confirmed bookings vs. pending income.",
    highlight: "forecast",
  },
  {
    title: "Client Rotation Calendar",
    description: "Visual overview of your schedule. Click any day to see appointments and manage bookings.",
    highlight: "calendar",
  },
  {
    title: "Needs Attention",
    description: "Clients who are overdue or at risk of churning appear here. Stay proactive with your follow-ups.",
    highlight: "attention",
  },
  {
    title: "Booking Requests",
    description: "New booking requests from your public profile appear here. Review and confirm with one click.",
    highlight: "requests",
  },
  {
    title: "Add Clients",
    description: "Build your roster by adding clients. Track their preferences, visit history, and revenue.",
    highlight: "add-client",
  },
  {
    title: "You're All Set!",
    description: "Explore your dashboard and start building your recurring revenue. You can access Settings anytime from the gear icon.",
    highlight: null,
  },
];

const ROTATION_COLORS = {
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]', hex: '#c17f59' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]', hex: '#7c9a7e' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]', hex: '#b5a078' },
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const AppDashboard: React.FC<AppDashboardProps> = ({ profile, clients, bookingRequests: bookingRequestsProp, bookingSettings, onAddClient, onViewClient, onBack, onExitDemo, onLogoClick, onNavigateToSettings, onLogout, showTutorial, onTutorialComplete, onUpdateBookingRequest, onCompleteAppointment, onMissedAppointment }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ day: number; appointments: Client[] } | null>(null);
  const [bookingClient, setBookingClient] = useState<Client | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSquarePreview, setShowSquarePreview] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const bookingUrl = bookingSettings?.profileSlug
    ? `bookrecur.com/book/${bookingSettings.profileSlug}`
    : null;

  const copyBookingLink = () => {
    if (bookingUrl) {
      navigator.clipboard.writeText(`https://${bookingUrl}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };
  // Use prop if provided, otherwise use sample data for demo users
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(
    bookingRequestsProp || (onExitDemo ? SAMPLE_BOOKING_REQUESTS : [])
  );
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [expandedBriefs, setExpandedBriefs] = useState<Set<string>>(new Set());
  const [completedClient, setCompletedClient] = useState<Client | null>(null);
  const [showGapFillerModal, setShowGapFillerModal] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(showTutorial || false);

  // NEW: Payment tracking state for appointment completion
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [arrivedLate, setArrivedLate] = useState(false);

  // NEW: Missed appointment modal state
  const [missedClient, setMissedClient] = useState<Client | null>(null);
  const [selectedMissedReason, setSelectedMissedReason] = useState<MissedReason | null>(null);
  const [missedOptions, setMissedOptions] = useState({
    chargeFee: false,
    flagAtRisk: false,
    sendMessage: false,
    rescheduleDate: ''
  });

  // NEW: End-of-day unmarked appointments prompt
  const [showUnmarkedPrompt, setShowUnmarkedPrompt] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Update booking requests when prop changes
  useEffect(() => {
    if (bookingRequestsProp) {
      setBookingRequests(bookingRequestsProp);
    }
  }, [bookingRequestsProp]);

  const handleNextStep = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setIsTutorialActive(false);
      onTutorialComplete?.();
    }
  };

  const handleSkipTutorial = () => {
    setIsTutorialActive(false);
    onTutorialComplete?.();
  };

  // Calculate actual revenue from completed appointments this year
  const currentYear = new Date().getFullYear();
  const getActualRevenueStats = () => {
    let actualYTD = 0;
    let missedYTD = 0;
    let completedCount = 0;
    let missedCount = 0;

    clients.forEach(client => {
      if (client.appointments) {
        client.appointments.forEach(apt => {
          const aptYear = new Date(apt.date).getFullYear();
          if (aptYear === currentYear) {
            if (apt.status === 'completed') {
              actualYTD += apt.paymentAmount ?? apt.price;
              completedCount++;
            } else if (apt.status === 'no-show' || apt.status === 'cancelled' || apt.status === 'late-cancel') {
              missedYTD += apt.price;
              missedCount++;
            }
          }
        });
      }
    });

    const total = actualYTD + missedYTD;
    const collectionRate = total > 0 ? Math.round((actualYTD / total) * 100) : 100;

    return { actualYTD, missedYTD, completedCount, missedCount, collectionRate };
  };

  const actualStats = getActualRevenueStats();

  const stats = {
    annualProjected: clients.reduce((sum, c) => sum + c.annualValue, 0),
    confirmed: clients.filter(c => c.status === 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
    pending: clients.filter(c => c.status !== 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
    ...actualStats,
  };

  const needsAttention = clients.filter(c => c.status === 'at-risk' || c.status === 'pending');

  // Intelligent scheduling helpers
  const getNextSuggestedDate = (client: Client) => {
    const lastAppointment = new Date(client.nextAppointment);
    const suggestedDate = new Date(lastAppointment);
    suggestedDate.setDate(suggestedDate.getDate() + (client.rotationWeeks * 7));

    // Adjust to preferred day if set
    if (client.preferredDays && client.preferredDays.length > 0) {
      const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
      const preferredDayNum = dayMap[client.preferredDays[0]];
      if (preferredDayNum !== undefined) {
        const currentDay = suggestedDate.getDay();
        const daysToAdd = (preferredDayNum - currentDay + 7) % 7;
        if (daysToAdd > 0) suggestedDate.setDate(suggestedDate.getDate() + daysToAdd);
      }
    }
    return suggestedDate;
  };

  const isOverdue = (client: Client) => {
    const lastAppointment = new Date(client.nextAppointment);
    const dueDate = new Date(lastAppointment);
    dueDate.setDate(dueDate.getDate() + (client.rotationWeeks * 7));
    return new Date() > dueDate;
  };

  const overdueClients = clients.filter(c => isOverdue(c));

  // Coming due: clients whose next appointment is within 14 days (and not overdue)
  const isComingDue = (client: Client) => {
    const nextAppt = new Date(client.nextAppointment);
    const today = new Date();
    const daysUntilDue = Math.ceil((nextAppt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue > 0 && daysUntilDue <= 14 && !isOverdue(client);
  };

  const getDaysUntilDue = (client: Client) => {
    const nextAppt = new Date(client.nextAppointment);
    const today = new Date();
    return Math.ceil((nextAppt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const comingDueClients = clients.filter(c => isComingDue(c));

  // Today's appointments
  const getTodaysAppointments = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return clients.filter(client => {
      if (client.nextAppointment) {
        const aptDate = client.nextAppointment.split('T')[0];
        return aptDate === todayStr;
      }
      return false;
    });
  };

  const todaysAppointments = getTodaysAppointments();

  // Get weeks since last visit
  const getWeeksSinceLastVisit = (client: Client) => {
    const lastVisit = new Date(client.nextAppointment);
    lastVisit.setDate(lastVisit.getDate() - (client.rotationWeeks * 7)); // Approximate last visit
    const today = new Date();
    const diffMs = today.getTime() - lastVisit.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
  };

  // Goal projection calculation
  const getGoalProjection = () => {
    if (!profile.annualGoal || profile.annualGoal <= 0) return null;

    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysSoFar = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

    const runRate = daysSoFar > 0 ? stats.actualYTD / daysSoFar : 0;
    const remaining = profile.annualGoal - stats.actualYTD;

    if (remaining <= 0) return { onTrack: true, projectedDate: 'Goal reached!' };

    const daysToGoal = runRate > 0 ? Math.ceil(remaining / runRate) : 365;
    const projectedDate = new Date(today);
    projectedDate.setDate(projectedDate.getDate() + daysToGoal);

    return {
      onTrack: projectedDate.getFullYear() === today.getFullYear(),
      projectedDate: projectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      daysToGoal
    };
  };

  const goalProjection = getGoalProjection();

  // Open slots calculation (mock for demo)
  const getOpenSlots = () => {
    const slots = [];
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate some mock open slots for next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];

      // Skip Sundays
      if (date.getDay() === 0) continue;

      // Random chance of having an open slot
      if (Math.random() > 0.5 || i <= 3) {
        const times = ['10:00 AM', '2:00 PM', '3:30 PM'];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        slots.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          time: randomTime,
          fullDate: date
        });
      }

      if (slots.length >= 3) break;
    }
    return slots;
  };

  const openSlots = getOpenSlots();

  // Get days overdue for a client
  const getDaysOverdue = (client: Client) => {
    const lastAppointment = new Date(client.nextAppointment);
    const dueDate = new Date(lastAppointment);
    dueDate.setDate(dueDate.getDate() + (client.rotationWeeks * 7));
    const today = new Date();
    const diffMs = today.getTime() - dueDate.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const toggleBrief = (clientId: string) => {
    setExpandedBriefs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getAvatarColor = (name: string) => AVATAR_COLORS[name.length % AVATAR_COLORS.length];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date selected';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'No date selected';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return clients.filter(client => {
      if (client.nextAppointment) {
        const aptDate = client.nextAppointment.split('T')[0];
        return aptDate === dateStr;
      }
      return false;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:opacity-80 transition-all"
          >
            <div className="text-maroon">
              <LOGOS.Main />
            </div>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigateToSettings ? onNavigateToSettings() : setShowSettings(true)}
              className="p-3 text-maroon/60 hover:text-maroon hover:bg-slate-100 rounded-xl transition-all focus:ring-2 focus:ring-maroon/50 focus:outline-none"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {bookingUrl && (
              <Tooltip text="Your booking link - click to copy" position="bottom">
                <button
                  onClick={copyBookingLink}
                  className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    linkCopied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-maroon/70 hover:bg-slate-200 hover:text-maroon'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {linkCopied ? 'Copied!' : bookingUrl}
                </button>
              </Tooltip>
            )}
            {onLogout ? (
              <button
                onClick={onLogout}
                className="px-3 sm:px-4 py-2 text-maroon/70 hover:text-maroon hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onExitDemo || onBack}
                className="px-3 sm:px-4 py-2 text-maroon/70 hover:text-maroon hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                Exit Demo
              </button>
            )}
            <Tooltip text="Add a new client to track their appointments, preferences, and annual value. Each client contributes to your revenue forecast." position="bottom">
              <button
                onClick={onAddClient}
                className="btn-primary px-3 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 focus:ring-2 focus:ring-maroon/50 focus:outline-none"
              >
                <span className="text-base sm:text-lg">+</span> <span className="hidden sm:inline">Add</span> Client
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-serif text-maroon">Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}</h1>
          <p className="text-maroon/60 text-sm sm:text-base">Here's your business at a glance.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <Tooltip text="Your total projected annual revenue based on all clients' rotation schedules and service prices. Set a goal in Settings to track your progress." position="bottom">
            <div className="bg-maroon text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg cursor-help">
              {profile.annualGoal && profile.annualGoal > 0 ? (
                <>
                  <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1">
                    {new Date().getFullYear()} Goal Progress
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  </div>
                <div className="text-2xl sm:text-3xl font-serif number-animate">{formatCurrency(stats.actualYTD)}</div>
                <div className="mt-2 sm:mt-3">
                  <div className="flex justify-between text-[10px] font-bold opacity-70 mb-1">
                    <span>Goal: {formatCurrency(profile.annualGoal)}</span>
                    <span>{Math.round((stats.actualYTD / profile.annualGoal) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c17f59] rounded-full transition-all"
                      style={{ width: `${Math.min((stats.actualYTD / profile.annualGoal) * 100, 100)}%` }}
                    />
                  </div>
                  {goalProjection && (
                    <div className={`text-[10px] font-medium mt-2 ${goalProjection.onTrack ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {goalProjection.projectedDate === 'Goal reached!'
                        ? '🎉 Goal reached!'
                        : `On track to hit goal by ${goalProjection.projectedDate}`
                      }
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1">
                  Annual Forecast
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </div>
                <div className="text-2xl sm:text-3xl font-serif number-animate">{formatCurrency(stats.annualProjected)}</div>
                <div className="text-emerald-400 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
                  <ICONS.TrendingUp /> {clients.length} clients on rotation
                </div>
              </>
            )}
            </div>
          </Tooltip>
          <Tooltip text="Actual revenue collected from completed appointments this year. This is money you've already earned." position="bottom">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm cursor-help">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1">
                {currentYear} Actual
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              <div className="text-2xl sm:text-3xl font-serif text-emerald-600 number-animate">{formatCurrency(stats.actualYTD)}</div>
              <div className="text-slate-400 text-xs font-bold mt-1 sm:mt-2">
                {stats.completedCount} appointments • {stats.collectionRate}% collection
              </div>
            </div>
          </Tooltip>
          <Tooltip text="Revenue lost to no-shows, late cancels, and missed appointments this year." position="bottom">
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm cursor-help ${stats.missedYTD > 0 ? 'bg-red-50 border border-red-100' : 'bg-[#fff38a]'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1 ${stats.missedYTD > 0 ? 'text-red-400' : 'text-maroon/50'}`}>
                {stats.missedYTD > 0 ? 'Missed Revenue' : 'Pending'}
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              {stats.missedYTD > 0 ? (
                <>
                  <div className="text-2xl sm:text-3xl font-serif text-red-600 number-animate">{formatCurrency(stats.missedYTD)}</div>
                  <div className="text-red-500/70 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {stats.missedCount} no-shows YTD
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-serif text-maroon number-animate">{formatCurrency(stats.pending)}</div>
                  <div className="text-maroon/60 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
                    <ICONS.Alert /> {needsAttention.length} need attention
                  </div>
                </>
              )}
            </div>
          </Tooltip>
        </div>

        {/* Getting Started Checklist for new users */}
        <GettingStartedChecklist
          profile={profile}
          clients={clients}
          onSetupProfile={onNavigateToSettings}
          onSetupServices={onNavigateToSettings}
          onAddClient={onAddClient}
        />

        {/* Today's Appointments - Pre-Appointment Client Briefs */}
        {todaysAppointments.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm mb-6 sm:mb-10 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between">
              <h2 className="font-bold text-emerald-700 flex items-center gap-2 text-sm sm:text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Today's Appointments
                <span className="ml-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {todaysAppointments.length}
                </span>
              </h2>
              <span className="text-xs text-emerald-600 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {todaysAppointments.map((client) => {
                const isExpanded = expandedBriefs.has(client.id);
                const weeksSince = getWeeksSinceLastVisit(client);
                return (
                  <div key={client.id} className="p-4 sm:p-5">
                    {/* Client Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: getAvatarColor(client.name) }}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-maroon text-base sm:text-lg">{client.name}</h4>
                          <p className="text-sm text-maroon/60">
                            {client.preferredTime || '10:00 AM'} • {client.baseService?.name} • {formatCurrency(client.baseService?.price || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-white"
                          style={{ backgroundColor: ROTATION_COLORS[client.rotation].hex }}
                        >
                          {client.rotation}
                        </span>
                        <button
                          onClick={() => toggleBrief(client.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60"
                        >
                          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Client Brief */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {/* Client Brief Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Client Brief
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                              <span className="text-sm text-maroon">
                                <span className="font-medium">Last visit:</span> ~{weeksSince} weeks ago
                              </span>
                            </div>
                            {client.goals && (
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M12 8v8M8 12h8"/>
                                </svg>
                                <span className="text-sm text-maroon">
                                  <span className="font-medium">Goal:</span> {client.goals}
                                </span>
                              </div>
                            )}
                            {client.notes && (
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm text-maroon">
                                  <span className="font-medium">Note:</span> {client.notes}
                                </span>
                              </div>
                            )}
                            {client.upcomingEvent && (
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="text-sm text-maroon">
                                  <span className="font-medium">Event:</span> {client.upcomingEvent}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Suggested Add-ons */}
                        {client.addOns && client.addOns.length > 0 && (
                          <div className="bg-[#c17f59]/10 border border-[#c17f59]/30 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-[#c17f59] uppercase tracking-wider mb-2">
                              Suggested Add-ons
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {client.addOns.map((addon, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-[#c17f59]/30 rounded-full text-sm text-maroon">
                                  {addon.service.name} +{formatCurrency(addon.service.price)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onViewClient(client)}
                            className="flex-1 py-2.5 bg-slate-100 text-maroon font-medium rounded-xl text-sm hover:bg-slate-200 transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              setCompletedClient(client);
                              setSelectedPaymentMethod(client.preferredPaymentMethod || null);
                              setPaymentAmount((client.baseService?.price || 0).toString());
                              setPaymentNote('');
                    setArrivedLate(false);
                            }}
                            className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => {
                              setMissedClient(client);
                              setSelectedMissedReason(null);
                              setMissedOptions({ chargeFee: false, flagAtRisk: false, sendMessage: false, rescheduleDate: '' });
                            }}
                            className="py-2.5 px-4 bg-red-100 text-red-600 font-medium rounded-xl text-sm hover:bg-red-200 transition-colors"
                          >
                            Didn't Show
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 sm:mb-10 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
            <Tooltip text="Visual overview of client appointments. Click any day to see who's scheduled. Colored dots show each client's rotation tier." position="right">
              <h2 className="font-bold text-maroon flex items-center gap-2 text-sm sm:text-base cursor-help">
                <ICONS.Calendar /> <span className="hidden sm:inline">Appointment</span> Calendar
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </h2>
            </Tooltip>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60 hover:text-maroon"
              >
                ←
              </button>
              <span className="font-medium text-maroon min-w-[100px] sm:min-w-[140px] text-center text-sm sm:text-base">{monthName}</span>
              <button
                onClick={nextMonth}
                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60 hover:text-maroon"
              >
                →
              </button>
            </div>
          </div>
          <div className="p-2 sm:p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1 sm:mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider py-1 sm:py-2">
                  <span className="sm:hidden">{day}</span>
                  <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-0.5 sm:p-1" />
              ))}
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const appointments = getAppointmentsForDate(day);
                const isToday = isCurrentMonth && today.getDate() === day;
                const hasAppointments = appointments.length > 0;

                return (
                  <div
                    key={day}
                    onClick={() => hasAppointments && setSelectedDay({ day, appointments })}
                    className={`aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-colors ${
                      isToday ? 'bg-maroon/10 ring-1 sm:ring-2 ring-maroon' : ''
                    } ${hasAppointments ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer' : ''}`}
                  >
                    <div className="h-full flex flex-col">
                      <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-maroon font-bold' : 'text-slate-600'}`}>
                        {day}
                      </span>
                      {hasAppointments && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 sm:mt-1">
                          {appointments.slice(0, 2).map((client) => (
                            <div
                              key={client.id}
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                              style={{ backgroundColor: ROTATION_COLORS[client.rotation].hex }}
                              title={client.name}
                            />
                          ))}
                          {appointments.length > 2 && (
                            <span className="text-[6px] sm:text-[8px] text-slate-400">+{appointments.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#c17f59]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Priority</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#7c9a7e]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Standard</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#b5a078]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Flex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Client List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-maroon text-sm sm:text-base">Clients on Rotation</h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{clients.length} total</span>
              </div>
              <div className="divide-y divide-slate-50">
                {clients.length === 0 ? (
                  <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-maroon/5 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-maroon/40">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-maroon font-bold mb-2 text-sm sm:text-base">Add Your First Client</p>
                    <p className="text-slate-400 text-xs sm:text-sm mb-4 max-w-xs mx-auto">
                      Start building your client roster to forecast revenue and track appointments.
                    </p>
                    <button
                      onClick={onAddClient}
                      className="btn-primary px-4 sm:px-6 py-2.5 sm:py-3 bg-maroon text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 hover:bg-maroon/90 transition-colors"
                    >
                      <span className="text-lg">+</span> Add Client
                    </button>
                  </div>
                ) : (
                  clients.map((client) => {
                    const clientOverdue = isOverdue(client);
                    return (
                      <div
                        key={client.id}
                        className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group ${clientOverdue ? 'bg-orange-50/50' : ''}`}
                      >
                        <div
                          className="flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer"
                          onClick={() => onViewClient(client)}
                        >
                          <div className="relative">
                            <div
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base"
                              style={{ backgroundColor: getAvatarColor(client.name) }}
                            >
                              {getInitials(client.name)}
                            </div>
                            {clientOverdue && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-maroon group-hover:text-[#c17f59] transition-colors text-sm sm:text-base">{client.name}</div>
                            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white ${ROTATION_COLORS[client.rotation].badge}`}>
                                {client.rotation}
                              </span>
                              {clientOverdue ? (
                                <span className="text-[10px] sm:text-[11px] text-orange-500 font-bold">Overdue</span>
                              ) : (
                                <span className="text-[10px] sm:text-[11px] text-slate-400">{formatDate(client.nextAppointment)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingClient(client);
                            }}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#7c9a7e] text-white rounded-lg text-xs font-bold hover:bg-[#6b8a6d] transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                              <path d="M9 16l2 2 4-4"/>
                            </svg>
                            Quick Book
                          </button>
                          <div className="text-right">
                            <div className="font-bold text-maroon text-sm sm:text-base">{formatCurrency(client.annualValue)}<span className="text-slate-400 font-normal">/yr</span></div>
                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${
                              clientOverdue ? 'text-orange-500' :
                              client.status === 'confirmed' ? 'text-emerald-500' :
                              client.status === 'at-risk' ? 'text-orange-500' : 'text-slate-400'
                            }`}>
                              {clientOverdue ? 'Overdue' : client.status === 'at-risk' ? 'At Risk' : client.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pending Booking Requests */}
            {bookingRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-100">
                  <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    New Requests
                    <span className="ml-auto bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {bookingRequests.filter(r => r.status === 'pending').length}
                    </span>
                  </h2>
                </div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {bookingRequests.filter(r => r.status === 'pending').slice(0, 3).map((request) => {
                    const timeAgo = getTimeAgo(request.createdAt);
                    return (
                      <div
                        key={request.id}
                        className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-bold text-maroon text-sm block">{request.clientName}</span>
                            <span className="text-[10px] text-slate-600">{timeAgo}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        </div>
                        <p className="text-xs text-maroon/70 mb-1">
                          {request.requestedService?.name} • {formatCurrency(request.requestedService?.price || 0)}
                        </p>
                        <p className="text-xs text-maroon/60 mb-3">
                          {formatDate(request.requestedDate)} • {request.requestedTimeSlot}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-maroon/50 mb-3">
                          <span>via {request.referralSource}</span>
                          {request.hasCardOnFile && (
                            <span className="flex items-center gap-0.5 text-emerald-600">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              ••{request.cardLast4}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex-1 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => {
                              if (onUpdateBookingRequest) {
                                onUpdateBookingRequest(request.id, 'confirmed');
                              } else {
                                setBookingRequests(prev => prev.map(r =>
                                  r.id === request.id ? { ...r, status: 'confirmed' as const } : r
                                ));
                              }
                            }}
                            className="flex-1 py-2 bg-slate-600 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unified Client Alerts */}
            {(comingDueClients.length > 0 || overdueClients.length > 0) && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50">
                  <Tooltip text="Clients approaching their next visit (Coming Due) or past their rotation schedule (Overdue). Click a client to view their profile and reach out." position="bottom">
                    <h2 className="font-bold text-maroon flex items-center gap-2 text-sm sm:text-base cursor-help">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Client Alerts
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    </h2>
                  </Tooltip>
                </div>
                <div className="p-3 sm:p-4 space-y-4">
                  {/* Coming Due */}
                  {comingDueClients.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Coming Due ({comingDueClients.length})
                      </h4>
                      <div className="space-y-1.5">
                        {comingDueClients.slice(0, 3).map((client) => {
                          const daysUntil = getDaysUntilDue(client);
                          return (
                            <div
                              key={client.id}
                              onClick={() => onViewClient(client)}
                              className="flex items-center justify-between text-sm bg-blue-50 px-3 py-3 rounded-lg cursor-pointer hover:bg-blue-100 active:bg-blue-200 transition-colors"
                            >
                              <span className="font-medium text-maroon">{client.name}</span>
                              <span className="text-xs text-blue-600 font-bold">
                                {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Overdue */}
                  {overdueClients.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Overdue ({overdueClients.length})
                      </h4>
                      <div className="space-y-1.5">
                        {overdueClients.slice(0, 3).map((client) => (
                          <div
                            key={client.id}
                            onClick={() => onViewClient(client)}
                            className="flex items-center justify-between text-sm bg-orange-50 px-3 py-3 rounded-lg cursor-pointer hover:bg-orange-100 active:bg-orange-200 transition-colors"
                          >
                            <span className="font-medium text-maroon">{client.name}</span>
                            <span className="text-xs text-orange-600 font-bold">{getDaysOverdue(client)} days overdue</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Open Slots Info */}
                  {openSlots.length > 0 && (
                    <p className="text-xs text-slate-500 text-center py-1">
                      You have {openSlots.length} open slot{openSlots.length !== 1 ? 's' : ''} this week
                    </p>
                  )}

                  {/* Single CTA */}
                  {overdueClients.length > 0 && (
                    <button
                      onClick={() => setShowGapFillerModal(true)}
                      className="w-full py-3 bg-maroon text-white rounded-xl text-sm font-bold hover:bg-maroon/90 active:bg-maroon/80 transition-colors"
                    >
                      Reach Out to {overdueClients.length} Overdue Client{overdueClients.length !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* This Month */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <Tooltip text="Monthly breakdown of your revenue. Projected is your annual forecast divided by 12. Booked shows confirmed appointments for this month." position="left">
                  <h2 className="font-bold text-maroon text-sm sm:text-base cursor-help flex items-center gap-1">
                    This Month
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  </h2>
                </Tooltip>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-500">Projected</span>
                  <span className="font-bold text-maroon text-sm sm:text-base">{formatCurrency(Math.round(stats.annualProjected / 12))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-500">Booked</span>
                  <span className="font-bold text-emerald-600 text-sm sm:text-base">{formatCurrency(Math.round(stats.confirmed / 12))}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.annualProjected > 0 ? Math.min((stats.confirmed / stats.annualProjected) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-maroon text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ICONS.TrendingUp />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-60">Quick Action</span>
              </div>
              <p className="font-serif text-base sm:text-lg mb-3 sm:mb-4">Ready to grow your book?</p>
              <button
                onClick={onAddClient}
                className="w-full py-2.5 sm:py-3 bg-[#fff38a] text-maroon rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all"
              >
                Add New Client
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Day Appointments Modal */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white w-full sm:w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-cream">
              <div>
                <h3 className="font-bold text-maroon text-lg">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long' })} {selectedDay.day}
                </h3>
                <p className="text-sm text-maroon/60">{selectedDay.appointments.length} appointment{selectedDay.appointments.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors text-maroon/60 focus:ring-2 focus:ring-maroon/50 focus:outline-none"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Appointments List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {selectedDay.appointments.map((client) => (
                <div key={client.id} className="p-4 sm:p-5 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(client.name) }}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-maroon text-base sm:text-lg truncate">{client.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase text-white"
                          style={{ backgroundColor: ROTATION_COLORS[client.rotation].hex }}
                        >
                          {client.rotation}
                        </span>
                        <span className="text-sm text-slate-500">{client.baseService?.name}</span>
                      </div>
                      <p className="text-sm text-maroon/60 mt-1">{formatCurrency(client.baseService?.price || 0)}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {client.phone && (
                    <div className="flex gap-2 mt-3">
                      <a
                        href={`tel:${client.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                      <a
                        href={`sms:${client.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Text
                      </a>
                      <a
                        href={`sms:${client.phone.replace(/[^0-9+]/g, '')}?body=Hi ${client.name.split(' ')[0]}! Just a reminder about your appointment on ${currentMonth.toLocaleDateString('en-US', { month: 'long' })} ${selectedDay.day}. See you soon!`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#c17f59] text-white rounded-xl text-sm font-bold hover:bg-[#a86b48] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Remind
                      </a>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <button
                    onClick={() => {
                      setSelectedDay(null);
                      onViewClient(client);
                    }}
                    className="w-full mt-3 py-2.5 text-maroon font-medium text-sm hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                  >
                    View Full Profile →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Booking Modal */}
      {bookingClient && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setBookingClient(null)}
        >
          <div
            className="bg-white w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#7c9a7e] to-[#6b8a6d]">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                      <path d="M9 16l2 2 4-4"/>
                    </svg>
                    Smart Scheduling
                  </div>
                  <h3 className="font-bold text-lg">Book {bookingClient.name.split(' ')[0]}'s Next Visit</h3>
                </div>
                <button
                  onClick={() => setBookingClient(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh] p-4 sm:p-6 space-y-5">
              {/* Pre-calculated Date */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Date (based on {bookingClient.rotationWeeks}-week rotation)
                </label>
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
                      <div className="font-bold text-emerald-700 text-lg">
                        {getNextSuggestedDate(bookingClient).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Auto-calculated from last visit + {bookingClient.rotationWeeks} weeks
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remembered Preferences */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Remembered Preferences
                </label>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 font-medium">Preferred Time</div>
                      <div className="font-bold text-blue-700">{bookingClient.preferredTime || 'Any time'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 font-medium">Preferred Days</div>
                      <div className="font-bold text-blue-700">
                        {bookingClient.preferredDays?.length > 0 ? bookingClient.preferredDays.join(', ') : 'Any day'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-selected Services */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pre-selected Services
                </label>
                <div className="space-y-2">
                  {bookingClient.baseService && (
                    <div className="flex items-center justify-between p-3 bg-[#c17f59]/10 border-2 border-[#c17f59]/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#c17f59] rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-maroon">{bookingClient.baseService.name}</span>
                      </div>
                      <span className="font-bold text-[#c17f59]">{formatCurrency(bookingClient.baseService.price)}</span>
                    </div>
                  )}
                  {bookingClient.addOns?.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-400 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-maroon">{addon.service.name}</span>
                        <span className="text-xs text-slate-400">({addon.frequency})</span>
                      </div>
                      <span className="font-bold text-slate-600">{formatCurrency(addon.service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Estimated Total</span>
                  <span className="font-bold text-maroon text-lg">
                    {formatCurrency(
                      (bookingClient.baseService?.price || 0) +
                      (bookingClient.addOns?.reduce((sum, a) => sum + a.service.price, 0) || 0)
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic">
                  All preferences pre-filled from client profile. Just confirm to book.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setBookingClient(null)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(`Appointment booked for ${bookingClient.name} on ${getNextSuggestedDate(bookingClient).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
                    setBookingClient(null);
                  }}
                  className="flex-1 py-3 bg-[#7c9a7e] text-white font-bold rounded-xl hover:bg-[#6b8a6d] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-white w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-cream flex items-center justify-between">
              <h3 id="settings-title" className="font-bold text-maroon text-lg">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors text-maroon/60 focus:ring-2 focus:ring-maroon/50 focus:outline-none"
                aria-label="Close settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh] p-4 sm:p-6 space-y-6">
              {/* Quick Settings */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preferences</h4>
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-maroon">Default Rotation</span>
                      <p className="text-xs text-slate-400">For new clients</p>
                    </div>
                    <span className="text-sm font-bold text-maroon">{profile.defaultRotation || 10} weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-maroon">Annual Goal</span>
                      <p className="text-xs text-slate-400">Track your progress</p>
                    </div>
                    <span className="text-sm font-bold text-maroon">{profile.annualGoal ? formatCurrency(profile.annualGoal) : 'Not set'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {onNavigateToSettings ? 'Go to full Settings to edit your profile, services, and goals.' : 'Create an account to access full settings.'}
                </p>
              </div>

              {/* Account */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {onLogout ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-maroon">Signed in</span>
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          onLogout();
                        }}
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center">
                      Create an account to save your data and access more features.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Square Preview Modal */}
      {showSquarePreview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSquarePreview(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-black to-gray-800 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
                    <path d="M7 7h10v10H7V7zm8 8V9H9v6h6z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Square Integration</h3>
                  <span className="text-xs text-white/60 uppercase tracking-wider">Preview</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-maroon/70 mb-6">
                When this feature launches, you'll be able to:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-maroon">Connect your Square account securely</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-maroon">Send invoices to clients after appointments</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-maroon">Collect deposits when booking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-maroon">Track payments in client profiles</span>
                </li>
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSquarePreview(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSquarePreview(false);
                    // Scroll to waitlist or show waitlist modal
                    showToast('You\'ll be notified when Square integration launches!', 'info');
                  }}
                  className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Request Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full mb-1 inline-block">
                  NEW REQUEST
                </span>
                <h2 className="text-xl font-serif text-maroon">{selectedRequest.clientName}</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-maroon/40 hover:text-maroon hover:bg-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="text-maroon font-medium">{selectedRequest.clientPhone || '-'}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-maroon font-medium text-sm truncate" title={selectedRequest.clientEmail}>{selectedRequest.clientEmail || '-'}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Prefers</p>
                  <p className="text-maroon font-medium capitalize">{selectedRequest.contactMethod || '-'}</p>
                </div>
              </div>

              {/* Appointment Request */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Appointment Request</h3>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-maroon text-lg">{selectedRequest.requestedService?.name}</p>
                    {selectedRequest.requestedAddOns.length > 0 && (
                      <p className="text-sm text-maroon/60">
                        + {selectedRequest.requestedAddOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-maroon">
                    {formatCurrency((selectedRequest.requestedService?.price || 0) + selectedRequest.requestedAddOns.reduce((sum, a) => sum + a.price, 0))}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-maroon/70">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formatDate(selectedRequest.requestedDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {selectedRequest.requestedTimeSlot}
                  </span>
                </div>
                {selectedRequest.preferredDays.length > 0 && (
                  <p className="text-xs text-maroon/50 mt-2">
                    Prefers: {selectedRequest.preferredDays.join(', ')}
                  </p>
                )}
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-4 mb-6">
                {selectedRequest.hasCardOnFile ? (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Card on file (••{selectedRequest.cardLast4})
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    No card on file
                  </span>
                )}
                <span className="text-sm text-maroon/60">via {selectedRequest.referralSource}</span>
              </div>

              {/* Client Info Sections */}
              <div className="space-y-4">
                {/* Lifestyle */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lifestyle</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedRequest.occupation && (
                      <div>
                        <span className="text-xs text-slate-400">Occupation</span>
                        <p className="text-maroon">{selectedRequest.occupation}</p>
                      </div>
                    )}
                    {selectedRequest.upcomingEvents && (
                      <div>
                        <span className="text-xs text-slate-400">Upcoming Events</span>
                        <p className="text-maroon">{selectedRequest.upcomingEvents}</p>
                      </div>
                    )}
                    {selectedRequest.morningTime && (
                      <div>
                        <span className="text-xs text-slate-400">Morning Routine Time</span>
                        <p className="text-maroon">{selectedRequest.morningTime}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Goals */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goals & Preferences</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedRequest.serviceGoal && (
                      <div>
                        <span className="text-xs text-slate-400">What they want</span>
                        <p className="text-maroon">{selectedRequest.serviceGoal}</p>
                      </div>
                    )}
                    {selectedRequest.maintenanceLevel && (
                      <div>
                        <span className="text-xs text-slate-400">Maintenance Level</span>
                        <p className="text-maroon">{selectedRequest.maintenanceLevel}</p>
                      </div>
                    )}
                    {selectedRequest.naturalColor && (
                      <div>
                        <span className="text-xs text-slate-400">Natural Color</span>
                        <p className="text-maroon">{selectedRequest.naturalColor}</p>
                      </div>
                    )}
                    {selectedRequest.currentColor && (
                      <div>
                        <span className="text-xs text-slate-400">Current Color</span>
                        <p className="text-maroon">{selectedRequest.currentColor}</p>
                      </div>
                    )}
                    {selectedRequest.concerns && (
                      <div>
                        <span className="text-xs text-slate-400">Concerns / To Avoid</span>
                        <p className="text-maroon">{selectedRequest.concerns}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedRequest.additionalNotes && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</h4>
                    </div>
                    <div className="p-4">
                      <p className="text-maroon italic">"{selectedRequest.additionalNotes}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rotation Info */}
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">What happens when you confirm:</p>
                  <ul className="text-xs space-y-1 text-blue-600">
                    <li>• Client is added to your roster with a <strong>Standard rotation</strong> (every 6 weeks)</li>
                    <li>• Their next appointment appears on your calendar</li>
                    <li>• You can adjust rotation (Priority/Standard/Flex) in their profile later</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (onUpdateBookingRequest) {
                      onUpdateBookingRequest(selectedRequest.id, 'declined');
                    } else {
                      setBookingRequests(prev => prev.map(r =>
                        r.id === selectedRequest.id ? { ...r, status: 'declined' as const } : r
                      ));
                    }
                    setSelectedRequest(null);
                  }}
                  className="sm:flex-1 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors order-3 sm:order-1"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    // For now, just confirm - edit functionality can be added later
                    if (onUpdateBookingRequest) {
                      onUpdateBookingRequest(selectedRequest.id, 'confirmed');
                    } else {
                      setBookingRequests(prev => prev.map(r =>
                        r.id === selectedRequest.id ? { ...r, status: 'confirmed' as const } : r
                      ));
                    }
                    setSelectedRequest(null);
                  }}
                  className="sm:flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-white transition-colors order-2"
                >
                  Edit & Confirm
                </button>
                <button
                  onClick={() => {
                    if (onUpdateBookingRequest) {
                      onUpdateBookingRequest(selectedRequest.id, 'confirmed');
                    } else {
                      setBookingRequests(prev => prev.map(r =>
                        r.id === selectedRequest.id ? { ...r, status: 'confirmed' as const } : r
                      ));
                    }
                    setSelectedRequest(null);
                  }}
                  className="sm:flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors order-1 sm:order-3"
                  title="Confirms appointment and adds client to your roster with Standard rotation (6 weeks). You can adjust their rotation schedule later."
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Appointment Complete Modal with Payment Tracking */}
      {completedClient && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setCompletedClient(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-1">Appointment Complete!</h3>
              <p className="text-white/80 text-sm">
                {completedClient.name} • {completedClient.baseService?.name} • {formatCurrency(completedClient.baseService?.price || 0)}
              </p>
            </div>

            <div className="p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h4 className="font-bold text-maroon text-sm mb-3">How was payment collected?</h4>
                <div className="grid grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex-shrink-0">{method.icon}</span>
                      <span className="text-xs font-medium text-maroon">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount and Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-maroon font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-maroon"
                    placeholder="Tipped $20..."
                  />
                </div>
              </div>

              {/* Late Arrival Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={arrivedLate}
                  onChange={(e) => setArrivedLate(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-maroon">Client arrived late</span>
                </div>
              </label>

              <hr className="border-slate-200 my-6" />

              <h4 className="font-bold text-maroon text-lg mb-4 text-center">
                Book {completedClient.name.split(' ')[0]}'s next appointment?
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
                      {getNextSuggestedDate(completedClient).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-emerald-600">
                      {completedClient.rotationWeeks} weeks from today
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const suggestedDate = getNextSuggestedDate(completedClient);
                    // Call the completion handler with payment info
                    if (onCompleteAppointment && selectedPaymentMethod) {
                      onCompleteAppointment(
                        completedClient.id,
                        completedClient.nextAppointment,
                        selectedPaymentMethod,
                        parseFloat(paymentAmount) || completedClient.baseService?.price || 0,
                        paymentNote || undefined,
                        arrivedLate
                      );
                    }
                    showToast(`Appointment completed! Next visit booked for ${suggestedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
                    setCompletedClient(null);
                    setSelectedPaymentMethod(null);
                    setPaymentAmount('');
                    setPaymentNote('');
                    setArrivedLate(false);
                  }}
                  className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <path d="M9 16l2 2 4-4"/>
                  </svg>
                  Complete & Book {getNextSuggestedDate(completedClient).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </button>
                <button
                  onClick={() => {
                    // Save payment and go to manual booking
                    if (onCompleteAppointment && selectedPaymentMethod) {
                      onCompleteAppointment(
                        completedClient.id,
                        completedClient.nextAppointment,
                        selectedPaymentMethod,
                        parseFloat(paymentAmount) || completedClient.baseService?.price || 0,
                        paymentNote || undefined,
                        arrivedLate
                      );
                    }
                    setCompletedClient(null);
                    setBookingClient(completedClient);
                    setSelectedPaymentMethod(null);
                    setPaymentAmount('');
                    setPaymentNote('');
                    setArrivedLate(false);
                  }}
                  className="w-full py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Complete & Pick Different Date
                </button>
                <button
                  onClick={() => {
                    // Save payment only
                    if (onCompleteAppointment && selectedPaymentMethod) {
                      onCompleteAppointment(
                        completedClient.id,
                        completedClient.nextAppointment,
                        selectedPaymentMethod,
                        parseFloat(paymentAmount) || completedClient.baseService?.price || 0,
                        paymentNote || undefined,
                        arrivedLate
                      );
                    }
                    showToast('Appointment marked complete');
                    setCompletedClient(null);
                    setSelectedPaymentMethod(null);
                    setPaymentAmount('');
                    setPaymentNote('');
                    setArrivedLate(false);
                  }}
                  className="w-full py-3 text-slate-400 font-medium rounded-xl hover:text-maroon hover:bg-slate-50 transition-colors text-sm"
                >
                  Skip Rebooking
                </button>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 mt-4 text-sm text-maroon/70 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Send confirmation to client</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Gap Filler Confirmation Modal */}
      {showGapFillerModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowGapFillerModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#c17f59] to-[#a86b48] text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Send Availability</h3>
                  <p className="text-white/80 text-sm">Reach out to overdue clients</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-maroon/70 mb-4">
                Send a message to <span className="font-bold text-maroon">{overdueClients.length} overdue client{overdueClients.length !== 1 ? 's' : ''}</span> with your available slots this week?
              </p>

              {/* Preview */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Message Preview</p>
                <p className="text-sm text-maroon italic">
                  "Hi [Name]! I have some openings this week and wanted to check if you're ready to book your next appointment. Let me know what works for you!"
                </p>
              </div>

              {/* Client list */}
              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Recipients</p>
                <div className="space-y-1">
                  {overdueClients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-[#c17f59] rounded-full"></div>
                      <span className="text-maroon">{client.name}</span>
                      <span className="text-slate-400">({getDaysOverdue(client)} days overdue)</span>
                    </div>
                  ))}
                  {overdueClients.length > 5 && (
                    <p className="text-xs text-slate-400 pl-4">+{overdueClients.length - 5} more</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGapFillerModal(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast(`Availability sent to ${overdueClients.length} client${overdueClients.length !== 1 ? 's' : ''}`, 'info');
                    setShowGapFillerModal(false);
                  }}
                  className="flex-1 py-3 bg-[#c17f59] text-white font-bold rounded-xl hover:bg-[#a86b48] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missed Appointment Modal */}
      {missedClient && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setMissedClient(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-1">Appointment Missed</h3>
              <p className="text-white/80 text-sm">
                {missedClient.name} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="p-6">
              <h4 className="font-bold text-maroon text-sm mb-3">What happened?</h4>

              {/* Missed Reason Options */}
              <div className="space-y-2 mb-6">
                {MISSED_REASONS.map(reason => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedMissedReason(reason.id)}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      selectedMissedReason === reason.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="flex-shrink-0">{reason.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-maroon">{reason.label}</div>
                      <div className="text-xs text-slate-500">{reason.description}</div>
                    </div>
                    {selectedMissedReason === reason.id && (
                      <svg className="w-5 h-5 text-red-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Reschedule Date Picker - shows when "rescheduled" is selected */}
              {selectedMissedReason === 'rescheduled' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    New appointment date
                  </label>
                  <input
                    type="date"
                    value={missedOptions.rescheduleDate}
                    onChange={(e) => setMissedOptions({ ...missedOptions, rescheduleDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  {!missedOptions.rescheduleDate && (
                    <p className="text-xs text-blue-600 mt-1">Select the new appointment date</p>
                  )}
                </div>
              )}

              <hr className="border-slate-200 my-4" />

              {/* Follow-up Options */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={missedOptions.chargeFee}
                    onChange={(e) => setMissedOptions({ ...missedOptions, chargeFee: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-maroon">Charge late cancel fee ($25)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={missedOptions.flagAtRisk}
                    onChange={(e) => setMissedOptions({ ...missedOptions, flagAtRisk: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-maroon">Flag client as at-risk</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={missedOptions.sendMessage}
                    onChange={(e) => setMissedOptions({ ...missedOptions, sendMessage: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-maroon">Send "We missed you" message</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMissedClient(null);
                    setSelectedMissedReason(null);
                    setMissedOptions({ chargeFee: false, flagAtRisk: false, sendMessage: false, rescheduleDate: '' });
                  }}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedMissedReason && onMissedAppointment) {
                      onMissedAppointment(
                        missedClient.id,
                        missedClient.nextAppointment,
                        selectedMissedReason,
                        missedOptions
                      );
                    }
                    const reasonLabel = MISSED_REASONS.find(r => r.id === selectedMissedReason)?.label || 'Missed';
                    const rescheduleMsg = selectedMissedReason === 'rescheduled' && missedOptions.rescheduleDate
                      ? `. Rescheduled to ${new Date(missedOptions.rescheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : '';
                    showToast(`Appointment marked as ${reasonLabel}${rescheduleMsg}${missedOptions.flagAtRisk ? '. Client flagged.' : ''}`, 'info');
                    setMissedClient(null);
                    setSelectedMissedReason(null);
                    setMissedOptions({ chargeFee: false, flagAtRisk: false, sendMessage: false, rescheduleDate: '' });
                  }}
                  disabled={!selectedMissedReason || (selectedMissedReason === 'rescheduled' && !missedOptions.rescheduleDate)}
                  className={`flex-1 py-3 font-bold rounded-xl transition-colors ${
                    selectedMissedReason && !(selectedMissedReason === 'rescheduled' && !missedOptions.rescheduleDate)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {selectedMissedReason === 'rescheduled' ? 'Reschedule' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End-of-Day Unmarked Appointments Prompt */}
      {showUnmarkedPrompt && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUnmarkedPrompt(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Unmarked Appointments</h3>
                  <p className="text-white/80 text-sm">You have {todaysAppointments.length} from today</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-maroon/70 mb-4">
                Would you like to update the status of today's appointments?
              </p>

              {/* Appointments List */}
              <div className="space-y-2 mb-6">
                {todaysAppointments.slice(0, 3).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: getAvatarColor(client.name) }}
                      >
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <div className="font-medium text-maroon">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.baseService?.name}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setShowUnmarkedPrompt(false);
                          setCompletedClient(client);
                          setSelectedPaymentMethod(client.preferredPaymentMethod || null);
                          setPaymentAmount((client.baseService?.price || 0).toString());
                        }}
                        className="px-2 py-1 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-200"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          setShowUnmarkedPrompt(false);
                          setMissedClient(client);
                        }}
                        className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200"
                      >
                        Missed
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnmarkedPrompt(false)}
                  className="flex-1 py-3 text-slate-400 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Remind Me Later
                </button>
                <button
                  onClick={() => setShowUnmarkedPrompt(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {isTutorialActive && (
        <div className="fixed inset-0 z-50">
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Tutorial Card */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === tutorialStep ? 'bg-maroon' : i < tutorialStep ? 'bg-maroon/40' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {tutorialStep === 0 ? (
                  <span className="text-3xl">👋</span>
                ) : tutorialStep === TUTORIAL_STEPS.length - 1 ? (
                  <span className="text-3xl">🎉</span>
                ) : (
                  <span className="text-3xl">
                    {tutorialStep === 1 && '📊'}
                    {tutorialStep === 2 && '📅'}
                    {tutorialStep === 3 && '⚠️'}
                    {tutorialStep === 4 && '📬'}
                    {tutorialStep === 5 && '👥'}
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-serif text-maroon text-center mb-2">
                {TUTORIAL_STEPS[tutorialStep].title}
              </h3>
              <p className="text-maroon/70 text-center mb-8 leading-relaxed">
                {TUTORIAL_STEPS[tutorialStep].description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkipTutorial}
                  className="flex-1 py-3 text-maroon/60 hover:text-maroon font-medium rounded-xl transition-colors"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
                >
                  {tutorialStep === TUTORIAL_STEPS.length - 1 ? "Let's Go!" : 'Next'}
                </button>
              </div>

              {/* Step counter */}
              <p className="text-center text-xs text-slate-400 mt-4">
                {tutorialStep + 1} of {TUTORIAL_STEPS.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-slate-800 text-white'
        }`}>
          {toast.type === 'success' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.type === 'info' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
};
