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
  // Lifestyle
  occupation: string;
  clientFacing: boolean;
  morningTime: string;
  events: { name: string; date: string; service: Service | null }[];
  photographed: string;
  // Hair
  lastColor: string;
  lastCut: string;
  concerns: string;
  whatWorks: string;
  whatFailed: string;
  allergies: string;
  heatTools: string;
  // Goals
  hairGoal: string;
  maintenanceLevel: string;
  naturalColor: string;
  currentColor: string;
  growOutComfort: string;
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
}

export interface DashboardStats {
  annualProjected: number;
  confirmed: number;
  pending: number;
  clientCount: number;
  attentionNeeded: number;
}

export type AppScreen = 'landing' | 'onboarding' | 'dashboard' | 'client-intake' | 'client-profile';
