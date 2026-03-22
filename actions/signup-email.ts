'use server';

import { createClient } from '@supabase/supabase-js';
import {
  voidSendWelcomeEmail,
  voidSendSignupPendingVerificationEmail,
} from '@/lib/email/send-transactional';
import { emailAppPath } from '@/lib/email/urls';

/**
 * Branded Resend follow-up after email/password signup.
 * Uses the service role to load the user and match state (verified vs pending).
 * Supabase still sends the actual confirm link; this email summarizes next steps.
 */
export async function sendSignupFollowUpEmail(userId: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.warn('[email] signup follow-up skipped (set SUPABASE_SERVICE_ROLE_KEY to enable)');
    return;
  }

  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return;

  const user = data.user;
  const meta = user.user_metadata as { full_name?: string } | undefined;
  const userName = meta?.full_name ?? user.email;
  const dashboardUrl = emailAppPath('/dashboard');
  const loginUrl = emailAppPath('/login');

  if (user.email_confirmed_at) {
    voidSendWelcomeEmail({
      userId: user.id,
      email: user.email,
      userName,
      dashboardUrl,
    });
  } else {
    voidSendSignupPendingVerificationEmail({
      userId: user.id,
      email: user.email,
      userName,
      loginUrl,
    });
  }
}
