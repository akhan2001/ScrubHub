import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ScrubHub Privacy Policy. How we collect, use, and protect your personal information. PIPEDA and PHIPA compliant.',
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: March 11, 2025
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-[#4a5568]">
            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">1. Introduction</h2>
              <p>
                ScrubHub Inc. (&quot;ScrubHub,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the ScrubHub platform, which connects healthcare professionals with housing near medical facilities and staffing opportunities. We are committed to protecting your privacy and handling your personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and, where applicable, the Personal Health Information Protection Act (PHIPA).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly and information collected automatically:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account information:</strong> Name, email address, password, role (tenant, landlord, enterprise), and profile details</li>
                <li><strong>Listing and booking data:</strong> Property details, availability, booking history, and payment information</li>
                <li><strong>Staffing and employment:</strong> Job applications, credentials, work history, and professional qualifications</li>
                <li><strong>Communications:</strong> Messages sent through the platform and support inquiries</li>
                <li><strong>Usage data:</strong> IP address, device information, pages visited, and interactions with our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Provide, maintain, and improve our platform and services</li>
                <li>Process bookings, applications, and transactions</li>
                <li>Verify identity and credentials</li>
                <li>Send service-related communications and updates</li>
                <li>Respond to inquiries and provide support</li>
                <li>Detect and prevent fraud, abuse, and security incidents</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">4. Data Storage and Security</h2>
              <p>
                Your data is stored on servers located in Canada. We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security assessments to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">5. Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share information with service providers who assist in operating our platform (e.g., hosting, payment processing), with other users as necessary to facilitate bookings or staffing matches, or when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">6. Your Rights</h2>
              <p>
                Under PIPEDA, you have the right to access, correct, or delete your personal information. You may also withdraw consent where applicable. Contact us at privacy@scrubhub.ca to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to maintain sessions, remember preferences, and analyze usage. You can manage cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">8. Changes</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-3">9. Contact</h2>
              <p>
                For privacy-related questions or requests, contact us at{' '}
                <a href="mailto:privacy@scrubhub.ca" className="text-primary hover:underline font-medium">
                  privacy@scrubhub.ca
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
