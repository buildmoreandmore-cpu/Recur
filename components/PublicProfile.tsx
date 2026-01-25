import React from 'react';
import { StylistProfile, BookingSettings, IndustryType } from '../types';
import { LOGOS } from '../constants';

interface PublicProfileProps {
  profile: StylistProfile;
  bookingSettings: BookingSettings;
  onStartBooking: () => void;
  onJoinWaitlist: () => void;
  onBack?: () => void;
}

const INDUSTRY_LABELS: Record<IndustryType, string> = {
  'hair-stylist': 'Hair Stylist',
  'barber': 'Barber',
  'personal-trainer': 'Personal Trainer',
  'massage-therapist': 'Massage Therapist',
  'esthetician': 'Esthetician',
  'lash-technician': 'Lash Technician',
  'nail-technician': 'Nail Technician',
  'tattoo-artist': 'Tattoo Artist',
  'pet-groomer': 'Pet Groomer',
  'therapist-counselor': 'Therapist',
  'consultant-coach': 'Consultant',
  'auto-detailer': 'Auto Detailer',
  'other': 'Professional',
};

export const PublicProfile: React.FC<PublicProfileProps> = ({
  profile,
  bookingSettings,
  onStartBooking,
  onJoinWaitlist,
  onBack,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const baseServices = profile.services.filter((s) => s.category === 'base');
  const addonServices = profile.services.filter((s) => s.category === 'addon');

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-2 text-maroon/60 hover:text-maroon hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="w-9" />
          )}
          <div className="text-maroon opacity-60">
            <LOGOS.Main />
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-maroon to-[#1a1512] px-6 py-10 sm:py-14 text-center text-white">
            {/* Avatar */}
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.name || profile.businessName || 'Profile'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover mx-auto mb-5 border-2 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl sm:text-4xl font-bold backdrop-blur-sm">
                {getInitials(profile.name || profile.businessName || 'DP')}
              </div>
            )}

            {/* Name & Business */}
            <h1 className="text-2xl sm:text-3xl font-serif mb-2">
              {profile.name || profile.businessName}
            </h1>
            {profile.businessName && profile.name && (
              <p className="text-white/70 text-sm mb-3">{profile.businessName}</p>
            )}

            {/* Industry & Location */}
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <span className="px-3 py-1 bg-white/10 rounded-full">
                {INDUSTRY_LABELS[profile.industry || 'other']}
              </span>
              {profile.location && (
                <>
                  <span className="text-white/40">•</span>
                  <span>{profile.location}</span>
                </>
              )}
            </div>

            {/* Availability Badge */}
            <div className="mt-5">
              {bookingSettings.takingNewClients ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Taking new clients
                </span>
              ) : bookingSettings.waitlistMode ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  Waitlist only
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-500/20 text-slate-300 rounded-full text-sm font-medium">
                  Not taking new clients
                </span>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {/* Bio */}
            {bookingSettings.bio && (
              <div className="mb-8">
                <p className="text-maroon/80 text-center leading-relaxed italic">
                  "{bookingSettings.bio}"
                </p>
              </div>
            )}

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                  Specialties
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {profile.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#c17f59]/10 text-[#c17f59] rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {baseServices.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                  Services
                </h2>
                <div className="space-y-2">
                  {baseServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <span className="font-medium text-maroon">{service.name}</span>
                      {bookingSettings.showPrices && (
                        <span className="font-bold text-maroon">
                          {formatCurrency(service.price)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add-ons */}
                {addonServices.length > 0 && bookingSettings.showPrices && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Add-ons available
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {addonServices.map((service) => (
                        <span
                          key={service.id}
                          className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                        >
                          {service.name} +{formatCurrency(service.price)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4">
              {bookingSettings.takingNewClients ? (
                <button
                  onClick={onStartBooking}
                  className="w-full py-4 bg-maroon text-white rounded-2xl font-bold text-lg hover:bg-maroon/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book with {profile.name?.split(' ')[0] || 'Me'}
                </button>
              ) : bookingSettings.waitlistMode ? (
                <button
                  onClick={onJoinWaitlist}
                  className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg"
                >
                  Join Waitlist
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-slate-200 text-slate-400 rounded-2xl font-bold text-lg cursor-not-allowed"
                >
                  Not Currently Booking
                </button>
              )}
            </div>

            {/* Booking Info */}
            {bookingSettings.takingNewClients && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                  {bookingSettings.requireDeposit && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Deposit required
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {bookingSettings.minimumLeadTime}h notice required
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Powered by{' '}
            <a href="/" className="text-maroon hover:underline font-medium">
              Recur
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
