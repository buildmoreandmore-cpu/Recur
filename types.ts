export enum RotationType {
  PRIORITY = 'Priority',
  STANDARD = 'Standard',
  FLEX = 'Flex'
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'base' | 'addon' | 'event';
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
  // Service History
  appointments: {
    date: string;
    service: string;
    price: number;
    status: 'completed' | 'upcoming' | 'scheduled' | 'event';
  }[];
  notes: string;
  status: 'confirmed' | 'pending' | 'at-risk';
}

export type IndustryType =
  | 'hair-stylist'
  | 'personal-trainer'
  | 'massage-therapist'
  | 'therapist-counselor'
  | 'esthetician'
  | 'consultant-coach'
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
}

export interface DashboardStats {
  annualProjected: number;
  confirmed: number;
  pending: number;
  clientCount: number;
  attentionNeeded: number;
}

export type AppScreen = 'landing' | 'onboarding' | 'dashboard' | 'client-intake' | 'client-profile' | 'settings';

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
