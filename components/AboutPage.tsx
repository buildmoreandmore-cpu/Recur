import React from 'react';

interface AboutPageProps {
  onBack?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-sage/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-maroon mb-6">
            The Booking Platform for Service Professionals
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Recur helps stylists, personal trainers, massage therapists, and other service professionals
            manage their clients, forecast revenue, and collect payments seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-maroon text-white rounded-xl font-medium hover:bg-maroon/90 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="px-6 py-3 border-2 border-maroon text-maroon rounded-xl font-medium hover:bg-maroon/5 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-maroon text-center mb-12">
            Everything You Need to Run Your Business
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Online Booking"
              description="Share your personalized booking page with clients. They can request appointments 24/7 without back-and-forth messaging."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Collect Deposits"
              description="Require deposits when clients book to reduce no-shows. Payments go directly to your Stripe account."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Revenue Forecasting"
              description="See projected income based on your client rotation schedule. Plan ahead and hit your financial goals."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Client Management"
              description="Keep track of client preferences, service history, and notes. Build lasting relationships with personalized service."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              title="Smart Rotation"
              description="Automatically suggest when clients should return based on their service type. Never lose touch with regulars."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Mobile Friendly"
              description="Access your dashboard, manage bookings, and view clients from any device. Your business in your pocket."
            />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-maroon text-center mb-4">
            Secure Payment Processing
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Recur integrates with Stripe to provide secure, reliable payment processing.
            Deposits go directly to your connected Stripe account.
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-maroon to-maroon/80 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-2xl">R</span>
              </div>
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="w-16 h-16 bg-[#635BFF] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-maroon text-center mb-4">How It Works</h3>
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-maroon text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Connect your Stripe account in Settings &rarr; Integrations</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-maroon text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Enable deposit requirements in your booking settings</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-maroon text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Clients pay deposits when booking - funds go directly to your Stripe account</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-maroon text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>View transactions and manage payouts in your Stripe Dashboard</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-maroon text-center mb-4">
            Built for Service Professionals
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Whether you're a solo practitioner or running a team, Recur adapts to your workflow.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '✂️', label: 'Hair Stylists' },
              { icon: '💪', label: 'Personal Trainers' },
              { icon: '💆', label: 'Massage Therapists' },
              { icon: '💅', label: 'Nail Technicians' },
              { icon: '🧘', label: 'Yoga Instructors' },
              { icon: '🎨', label: 'Makeup Artists' },
              { icon: '🐕', label: 'Pet Groomers' },
              { icon: '📸', label: 'Photographers' },
            ].map((industry) => (
              <div key={industry.label} className="bg-cream/50 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">{industry.icon}</span>
                <span className="text-sm font-medium text-maroon">{industry.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-maroon mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-maroon text-white rounded-xl font-medium text-lg hover:bg-maroon/90 transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-lg">R</span>
              </div>
              <span className="font-serif text-2xl">Recur</span>
            </div>
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} Recur. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-cream/30 rounded-xl p-6 hover:bg-cream/50 transition-colors">
    <div className="w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center text-maroon mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-maroon mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default AboutPage;
