import type { LucideIcon } from 'lucide-react';
import { Stethoscope, Building2, Landmark } from 'lucide-react';
import type { AppRole } from '@/types/database';

export interface RoleConfig {
  id: AppRole;
  icon: LucideIcon;
  title: string;
  description: string;
  pricing: string;
  pricingMuted: boolean;
  accent: string;
  iconBg: string;
  iconColor: string;
  ring: string;
  border: string;
}

export const ROLES: readonly RoleConfig[] = [
  {
    id: 'tenant',
    icon: Stethoscope,
    title: 'Healthcare Professional',
    description:
      'Find housing near your facility. Browse verified listings, apply directly, and move in faster.',
    pricing: 'Free to apply',
    pricingMuted: false,
    accent: 'bg-teal-50 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    ring: 'ring-teal-500/30',
    border: 'border-teal-500',
  },
  {
    id: 'landlord',
    icon: Landmark,
    title: 'Property Owner',
    description:
      'List and manage properties for healthcare workers. Screen tenants, automate approvals.',
    pricing: 'From $29/mo',
    pricingMuted: true,
    accent: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    ring: 'ring-blue-500/30',
    border: 'border-blue-500',
  },
  {
    id: 'enterprise',
    icon: Building2,
    title: 'Enterprise',
    description:
      'Manage portfolios, post jobs, and place staff at scale. Housing and recruitment in one platform.',
    pricing: 'From $99/mo',
    pricingMuted: true,
    accent: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    ring: 'ring-violet-500/30',
    border: 'border-violet-500',
  },
] as const;
