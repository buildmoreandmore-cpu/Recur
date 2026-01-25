export enum RotationType {
  PRIORITY = 'Priority',
  STANDARD = 'Standard',
  FLEX = 'Flex',
  CUSTOM = 'Custom'
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'base' | 'addon' | 'event';
}

// Payment method types for appointment tracking
export type PaymentMethod = 'stripe' | 'cash' | 'cashapp' | 'zelle' | 'venmo' | 'check' | 'card' | 'other' | 'unpaid';

// Appointment status types (expanded)
export type AppointmentStatus = 'completed' | 'upcoming' | 'scheduled' | 'event' | 'no-show' | 'cancelled' | 'late-cancel';

// Missed appointment reason types
export type MissedReason = 'no-show' | 'late-cancel' | 'cancelled' | 'rescheduled';

// Appointment with payment tracking
export interface Appointment {
  id?: string;
  date: string;
  service: string;
  price: number;
  status: AppointmentStatus;
  // Payment tracking (new fields)
  completedAt?: string;        // When marked complete
  paymentMethod?: PaymentMethod;
  paymentAmount?: number;      // Actual amount paid (could differ from price)
  paymentNote?: string;        // "Tipped $20", "Paid via Venmo @username"
  arrivedLate?: boolean;       // Client arrived late to appointment
  missedReason?: MissedReason; // For no-shows/cancellations
  updatedAt?: string;          // Audit trail
  updatedBy?: string;          // Who made the update
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  rotation: RotationType;
  rotationWeeks: number;
  baseService: Service | null;
  addOns: { service: Service; frequency: string }[];
  annualValue: number;
  nextAppointment: string;
  clientSince: string;
  preferredDays: string[];
  preferredTime: string;
  contactMethod: string;
  // Lifestyle (universal)
  occupation: string;
  clientFacing: boolean;
  morningTime: string; // Generic: time spent on service prep / routine
  events: { name: string; date: string; service: Service | null }[];
  photographed: string;
  concerns: string; // Generic: concerns, limitations, sensitivities
  // Hair-specific (optional)
  lastColor?: string;
  lastCut?: string;
  whatWorks?: string;
  whatFailed?: string;
  allergies?: string;
  heatTools?: string;
  hairGoal?: string;
  naturalColor?: string;
  currentColor?: string;
  growOutComfort?: string;
  // Generic fields (all industries)
  serviceGoal: string; // Main goal for any industry
  maintenanceLevel: string; // Preference level / secondary choice
  additionalNotes: string; // Tertiary question response
  industryData?: Record<string, string>; // Flexible storage for industry-specific data
  // Service History (updated to use Appointment interface)
  appointments: Appointment[];
  notes: string;
  status: 'confirmed' | 'pending' | 'at-risk';
  // Payment tracking per client
  preferredPaymentMethod?: PaymentMethod; // Most recently used
}

export type IndustryType =
  | 'hair-stylist'
  | 'barber'
  | 'personal-trainer'
  | 'massage-therapist'
  | 'esthetician'
  | 'lash-technician'
  | 'nail-technician'
  | 'tattoo-artist'
  | 'pet-groomer'
  | 'therapist-counselor'
  | 'consultant-coach'
  | 'auto-detailer'
  | 'other';

export interface StylistProfile {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  location: string;
  yearsInBusiness: number;
  specialties: string[];
  services: Service[];
  defaultRotation: number;
  annualGoal: number;
  monthlyGoal: number;
  industry?: IndustryType;
  profilePhoto?: string;
  // Subscription fields
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'none' | 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  subscriptionCurrentPeriodEnd?: string;
  trialEndsAt?: string;
}

export interface DashboardStats {
  annualProjected: number;
  confirmed: number;
  pending: number;
  clientCount: number;
  attentionNeeded: number;
  // Actual revenue tracking (new fields)
  actualYTD: number;           // Sum of completed appointments this year
  missedYTD: number;           // Revenue lost to no-shows/cancels
  collectionRate: number;      // actualYTD / (actualYTD + missedYTD) as percentage
  completedCount: number;      // Number of completed appointments YTD
  missedCount: number;         // Number of missed appointments YTD
}

export type AppScreen = 'landing' | 'onboarding' | 'guided-demo' | 'dashboard' | 'client-intake' | 'client-profile' | 'settings' | 'public-profile' | 'client-booking' | 'about' | 'industry-landing' | 'privacy';

export interface RotationTier {
  type: RotationType;
  weeks: number;
  description: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  overdueAlerts: boolean;
  weeklySummary: boolean;
  paymentConfirmations: boolean;
  currency: 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
  startOfWeek: 'Sunday' | 'Monday';
}

export interface BillingInfo {
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  nextBillingDate: string;
  paymentMethod: string;
  invoices: {
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
  }[];
}

// Booking Link / Public Profile Settings
export interface BookingSettings {
  profileSlug: string;
  bio: string;
  showPrices: boolean;
  takingNewClients: boolean;
  waitlistMode: boolean;
  requireDeposit: boolean;
  depositAmount: number;
  depositType: 'fixed' | 'percentage';
  minimumLeadTime: '24' | '48' | '72' | '168'; // hours
  maximumAdvanceBooking: '14' | '30' | '60' | '90'; // days
  autoConfirmExisting: boolean;
}

// Booking Request from potential client
export interface BookingRequest {
  id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  createdAt: string;
  // Client info
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  referralSource: string;
  contactMethod: string;
  preferredDays: string[];
  preferredTime: string;
  // Lifestyle answers
  occupation: string;
  upcomingEvents: string;
  morningTime: string;
  // Goals
  serviceGoal: string;
  maintenanceLevel: string;
  concerns: string;
  // Hair-specific (optional)
  naturalColor?: string;
  currentColor?: string;
  // Appointment request
  requestedService: Service | null;
  requestedAddOns: Service[];
  requestedDate: string;
  requestedTimeSlot: string;
  additionalNotes: string;
  // Payment
  hasCardOnFile: boolean;
  depositPaid: boolean;
  cardLast4?: string;
  // Industry data
  industryData?: Record<string, string>;
}

// Waitlist entry
export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceInterested: string;
  dateAdded: string;
  notes?: string;
}

// Stripe Connect Types
export interface StripeAccountStatus {
  isConnected: boolean;
  accountId?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}

export interface StripeAccount {
  id: string;
  professionalId: string;
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingRequestId?: string;
  professionalId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  paymentType: 'deposit' | 'full';
  clientEmail?: string;
  cardLast4?: string;
  cardBrand?: string;
  createdAt: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  professionalId: string;
  clientEmail: string;
  bookingRequestId?: string;
  paymentType?: 'deposit' | 'full';
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}
