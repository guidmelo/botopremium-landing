export interface LeadFormData {
  name: string;
  whatsapp: string;
  neighborhood: string;
  goal: string;
}

export interface LeadPayload extends LeadFormData {
  timestamp: string;
  source: string;
  device: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  page: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Procedure {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  category: 'facial' | 'body';
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  procedure: string;
  initials: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}
