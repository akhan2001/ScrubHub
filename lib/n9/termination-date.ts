import type { LeaseType, RentalPeriod } from '@/types/database';

/**
 * Ontario RTA N9 termination date rules:
 * - Monthly tenancy: 60 days notice, must end on last day of a rental period.
 * - Weekly tenancy: 28 days notice, must end on last day of a rental period.
 * - Fixed-term: terminates on lease end date; must give at least 60 days notice.
 */

export interface TerminationDateResult {
  terminationDate: Date;
  explanation: string;
  isValid: boolean;
  error?: string;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getLastDayOfMonthlyPeriod(leaseStartDate: Date, afterDate: Date): Date {
  const startDay = leaseStartDate.getDate();

  const candidateYear = afterDate.getFullYear();
  const candidateMonth = afterDate.getMonth();

  // The rental period ends the day before the anniversary day each month.
  // e.g., lease starts Jan 15 → periods end Feb 14, Mar 14, etc.
  // So last day of period = (start day - 1) of next month.
  let endMonth = candidateMonth;
  let endYear = candidateYear;

  // Find the next period end that falls on or after afterDate
  for (let i = 0; i < 14; i++) {
    const daysInMonth = new Date(endYear, endMonth + 1, 0).getDate();
    const periodEndDay = Math.min(startDay - 1, daysInMonth);

    // If start day is 1, period ends on last day of previous month
    let periodEnd: Date;
    if (startDay <= 1) {
      periodEnd = new Date(endYear, endMonth + 1, 0); // last day of current month
    } else {
      periodEnd = new Date(endYear, endMonth, periodEndDay);
    }

    if (periodEnd >= afterDate) {
      return periodEnd;
    }

    endMonth++;
    if (endMonth > 11) {
      endMonth = 0;
      endYear++;
    }
  }

  // Fallback: shouldn't reach here
  return afterDate;
}

function getLastDayOfWeeklyPeriod(leaseStartDate: Date, afterDate: Date): Date {
  const startDayOfWeek = leaseStartDate.getDay();
  // Period ends on (startDayOfWeek - 1) mod 7, i.e. the day before the start day
  const periodEndDayOfWeek = (startDayOfWeek + 6) % 7;

  const current = new Date(afterDate);
  for (let i = 0; i < 8; i++) {
    if (current.getDay() === periodEndDayOfWeek && current >= afterDate) {
      return current;
    }
    current.setDate(current.getDate() + 1);
  }

  return afterDate;
}

export function calculateTerminationDate(input: {
  leaseStartDate: string;
  rentalPeriod: RentalPeriod;
  leaseType: LeaseType;
  leaseEndDate?: string | null;
  fromDate?: string;
}): TerminationDateResult {
  const today = input.fromDate ? new Date(input.fromDate) : new Date();
  today.setHours(0, 0, 0, 0);

  const leaseStart = new Date(input.leaseStartDate);
  leaseStart.setHours(0, 0, 0, 0);

  if (input.leaseType === 'fixed_term') {
    if (!input.leaseEndDate) {
      return {
        terminationDate: today,
        explanation: '',
        isValid: false,
        error: 'Fixed-term lease requires an end date.',
      };
    }

    const endDate = new Date(input.leaseEndDate);
    endDate.setHours(0, 0, 0, 0);

    const sixtyDaysBefore = addDays(endDate, -60);
    if (today > sixtyDaysBefore) {
      return {
        terminationDate: endDate,
        explanation: '',
        isValid: false,
        error:
          'You must give at least 60 days notice before the end of a fixed-term lease. ' +
          'You may request a mutual agreement to terminate early instead.',
      };
    }

    return {
      terminationDate: endDate,
      explanation: `Your fixed-term lease ends on ${formatDate(endDate)}. The N9 notice will terminate your tenancy on that date.`,
      isValid: true,
    };
  }

  // Periodic tenancy (monthly or weekly)
  const noticeDays = input.rentalPeriod === 'monthly' ? 60 : 28;
  const earliestEnd = addDays(today, noticeDays);

  const terminationDate =
    input.rentalPeriod === 'monthly'
      ? getLastDayOfMonthlyPeriod(leaseStart, earliestEnd)
      : getLastDayOfWeeklyPeriod(leaseStart, earliestEnd);

  const periodLabel = input.rentalPeriod === 'monthly' ? 'monthly' : 'weekly';

  return {
    terminationDate,
    explanation:
      `${noticeDays} days notice is required for a ${periodLabel} tenancy. ` +
      `The earliest valid termination date is ${formatDate(terminationDate)}, ` +
      `the last day of your rental period.`,
    isValid: true,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
