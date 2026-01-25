import React from 'react';

interface PrivacyPageProps {
  onBack?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-maroon to-maroon/80 rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-lg">R</span>
            </div>
            <span className="font-serif text-2xl text-maroon">Recur</span>
          </div>
          {onBack ? (
            <button
              onClick={onBack}
              className="px-4 py-2 text-maroon hover:bg-maroon/5 rounded-xl font-medium transition-colors"
            >
              Back to App
            </button>
          ) : (
            <a
              href="/"
              className="px-4 py-2 bg-maroon text-white rounded-xl font-medium hover:bg-maroon/90 transition-colors"
            >
              Get Started
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-serif text-maroon mb-2">Privacy Policy</h1>
        <p className="text-maroon/60 mb-8">Last updated: January 25, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">1. Introduction</h2>
            <p className="text-maroon/80 mb-4">
              Welcome to Recur ("we," "our," or "us"). We are committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our booking and client management platform.
            </p>
            <p className="text-maroon/80">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
              please do not access the application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-maroon mb-2">Personal Information</h3>
            <p className="text-maroon/80 mb-4">
              We collect personal information that you voluntarily provide to us when you register for an account,
              express interest in obtaining information about us or our products, or otherwise contact us. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Business information (business name, industry, location)</li>
              <li>Account credentials (email and password)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Client data you choose to store in the platform</li>
            </ul>

            <h3 className="text-lg font-semibold text-maroon mb-2">Automatically Collected Information</h3>
            <p className="text-maroon/80 mb-4">
              When you access our platform, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">3. How We Use Your Information</h2>
            <p className="text-maroon/80 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li>Provide, operate, and maintain our platform</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to inquiries and offer customer support</li>
              <li>Analyze usage to improve our platform and services</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">4. How We Share Your Information</h2>
            <p className="text-maroon/80 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li><strong>Service Providers:</strong> We share data with third-party vendors who perform services on our behalf, including payment processing (Stripe), hosting (Vercel), and database services (Supabase).</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of all or a portion of our assets.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process.</li>
              <li><strong>With Your Consent:</strong> We may share your information for other purposes with your explicit consent.</li>
            </ul>
            <p className="text-maroon/80">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">5. Data Security</h2>
            <p className="text-maroon/80 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information.
              However, no electronic transmission over the internet or information storage technology can be guaranteed
              to be 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
            <p className="text-maroon/80">
              Payment information is processed securely through Stripe and is never stored on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">6. Data Retention</h2>
            <p className="text-maroon/80">
              We retain your personal information for as long as your account is active or as needed to provide you services.
              We will retain and use your information as necessary to comply with our legal obligations, resolve disputes,
              and enforce our agreements. You may request deletion of your account and associated data at any time by
              contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">7. Your Privacy Rights</h2>
            <p className="text-maroon/80 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format.</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications at any time.</li>
            </ul>
            <p className="text-maroon/80">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">8. Cookies and Tracking</h2>
            <p className="text-maroon/80 mb-4">
              We use cookies and similar tracking technologies to collect and store information. Cookies are small
              data files stored on your device. We use both session cookies (which expire when you close your browser)
              and persistent cookies (which remain until deleted).
            </p>
            <p className="text-maroon/80">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              However, some features of our platform may not function properly without cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">9. Third-Party Services</h2>
            <p className="text-maroon/80 mb-4">Our platform integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4 text-maroon/80 space-y-2">
              <li><strong>Stripe:</strong> For payment processing. See <a href="https://stripe.com/privacy" className="text-maroon underline" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a>.</li>
              <li><strong>Supabase:</strong> For database and authentication services. See <a href="https://supabase.com/privacy" className="text-maroon underline" target="_blank" rel="noopener noreferrer">Supabase's Privacy Policy</a>.</li>
              <li><strong>Vercel:</strong> For hosting services. See <a href="https://vercel.com/legal/privacy-policy" className="text-maroon underline" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a>.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">10. Children's Privacy</h2>
            <p className="text-maroon/80">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">11. Changes to This Policy</h2>
            <p className="text-maroon/80">
              We may update this privacy policy from time to time. The updated version will be indicated by an updated
              "Last updated" date. We encourage you to review this privacy policy periodically. Your continued use of
              the platform after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-maroon mb-4">12. Contact Us</h2>
            <p className="text-maroon/80 mb-4">
              If you have questions or concerns about this privacy policy or our data practices, please contact us at:
            </p>
            <div className="bg-cream p-6 rounded-xl">
              <p className="text-maroon font-semibold">Recur</p>
              <p className="text-maroon/80">
                Email: <a href="mailto:buildmoreandmore@gmail.com" className="text-maroon underline">buildmoreandmore@gmail.com</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-sm">R</span>
            </div>
            <span className="text-maroon/60 text-sm">Recur - Booking software for service professionals</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/" className="text-maroon/60 hover:text-maroon">Home</a>
            <a href="/about" className="text-maroon/60 hover:text-maroon">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
