
export enum RotationType {
  PRIORITY = 'Priority',
  STANDARD = 'Standard',
  FLEX = 'Flex'
}

export interface Client {
  id: string;
  name: string;
  rotation: RotationType;
  lastVisit: string;
  avgTicket: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'at-risk';
}

export interface DashboardStats {
  annualProjected: number;
  confirmed: number;
  pending: number;
  clientCount: number;
  attentionNeeded: number;
}
