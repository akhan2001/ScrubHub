import type { AppRole } from '@/types/database';

export function resolveDashboardRoute(role: AppRole): string {
  switch (role) {
    case 'tenant':
      return '/dashboard/tenant';
    case 'landlord':
      return '/dashboard/landlord';
    case 'enterprise':
      return '/dashboard/enterprise';
    default:
      return '/dashboard/onboarding';
  }
}
