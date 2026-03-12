import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ScrubHub Terms of Service. Rules and guidelines for using the healthcare housing and staffing platform.',
};

export default function TermsPage() {
  return (
    <div
      className="flex-1"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="mx-auto max-w-3xl w-full px-6 py-16">
        <div className="rounded-2xl border border-[#d0d9e8] bg-white p-8 sm:p-12 shadow-sm">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            ← Back to ScrubHub
          </Link>

          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: March 11, 2025
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-[#4a5568]">
            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using ScrubHub (&quot;Platform&quot;), operated by ScrubHub Inc. (&quot;ScrubHub,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">2. Description of Service</h2>
              <p>
                ScrubHub is a marketplace platform that connects healthcare professionals with short-term and long-term housing near medical facilities, and with staffing opportunities at healthcare institutions. We facilitate connections between tenants, landlords, and employers but are not a party to any rental, employment, or other agreements formed through the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">3. Eligibility</h2>
              <p>
                You must be at least 18 years old and legally able to enter into binding contracts to use the Platform. By using ScrubHub, you represent that you meet these requirements and that all information you provide is accurate and complete.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">4. Account Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">5. User Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Post false, misleading, or fraudulent listings or applications</li>
                <li>Harass, discriminate, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the Platform or other accounts</li>
                <li>Use the Platform for any purpose other than its intended use</li>
                <li>Scrape, copy, or distribute content without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">6. Listings and Bookings</h2>
              <p>
                Landlords are responsible for the accuracy of listings and for fulfilling bookings. Tenants are responsible for payment and compliance with rental terms. ScrubHub facilitates the connection but is not responsible for the quality, safety, or legality of listings, or for disputes between users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">7. Staffing and Employment</h2>
              <p>
                Job postings and applications are provided for informational purposes. ScrubHub does not guarantee employment or placement. Employers and applicants are solely responsible for verifying credentials, conducting background checks, and entering into employment agreements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">8. Fees and Payments</h2>
              <p>
                Certain features may be subject to fees. You agree to pay all applicable fees as described at the time of use. Fees are non-refundable unless otherwise stated or required by law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">9. Intellectual Property</h2>
              <p>
                The Platform, including its design, content, and software, is owned by ScrubHub and protected by intellectual property laws. You may not copy, modify, or create derivative works without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">10. Disclaimers</h2>
              <p>
                THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR USER CONDUCT.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">11. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCRUBHUB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">12. Indemnification</h2>
              <p>
                You agree to indemnify and hold ScrubHub harmless from any claims, damages, or expenses arising from your use of the Platform, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">13. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Ontario.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">14. Changes</h2>
              <p>
                We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Continued use of the Platform after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">15. Contact</h2>
              <p>
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@scrubhub.ca" className="text-primary hover:underline font-medium">
                  legal@scrubhub.ca
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              ← Return to homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
