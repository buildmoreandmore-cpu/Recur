import React, { useState } from 'react';
import { StylistProfile, Service, IndustryType, RotationType, UserPreferences, BillingInfo, BookingSettings } from '../types';
import { LOGOS } from '../constants';
import { StripeConnectSection } from './StripeConnectSection';
import { createCheckoutSession, createCustomerPortalSession } from '../lib/stripe';

interface SettingsProps {
  profile: StylistProfile;
  onBack: () => void;
  onUpdateProfile: (profile: StylistProfile) => void;
  onLogoClick?: () => void;
  onPreviewProfile?: () => void;
}

type SettingsTab = 'profile' | 'business' | 'services' | 'rotation' | 'booking' | 'integrations' | 'billing' | 'preferences';

const INDUSTRY_OPTIONS: { value: IndustryType; label: string }[] = [
  { value: 'hair-stylist', label: 'Hair Stylist / Barber' },
  { value: 'personal-trainer', label: 'Personal Trainer' },
  { value: 'massage-therapist', label: 'Massage Therapist' },
  { value: 'therapist-counselor', label: 'Therapist / Counselor' },
  { value: 'esthetician', label: 'Esthetician' },
  { value: 'consultant-coach', label: 'Consultant / Coach' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  emailNotifications: true,
  overdueAlerts: true,
  weeklySummary: true,
  paymentConfirmations: true,
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  startOfWeek: 'Sunday',
};

const DEFAULT_BILLING: BillingInfo = {
  plan: 'Recur Pro',
  status: 'active',
  nextBillingDate: '2026-02-11',
  paymentMethod: 'Visa •••• 4242',
  invoices: [
    { date: '2026-01-11', description: 'Recur Pro — Monthly', amount: 29, status: 'paid' },
    { date: '2025-12-11', description: 'Recur Pro — Monthly', amount: 29, status: 'paid' },
    { date: '2025-11-11', description: 'Recur Pro — Monthly', amount: 29, status: 'paid' },
  ],
};

// Billing Section Component
const BillingSection: React.FC<{
  subscriptionStatus?: string;
  subscriptionCurrentPeriodEnd?: string;
}> = ({ subscriptionStatus, subscriptionCurrentPeriodEnd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { url, error: checkoutError } = await createCheckoutSession();
      if (checkoutError) {
        setError(checkoutError);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError('Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { url, error: portalError } = await createCustomerPortalSession();
      if (portalError) {
        setError(portalError);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError('Failed to open billing portal');
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
  const isPastDue = subscriptionStatus === 'past_due';

  const formatPeriodEnd = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-serif text-maroon">Billing & Subscription</h2>
        </div>
        <div className="p-6">
          {/* Active Subscription */}
          {isActive && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-maroon">Recur Pro</h3>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-2xl font-serif text-maroon">$29<span className="text-sm font-normal text-maroon/60">/month</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Renews on</p>
                <p className="font-medium text-maroon">{formatPeriodEnd(subscriptionCurrentPeriodEnd)}</p>
              </div>
            </div>
          )}

          {/* Past Due */}
          {isPastDue && (
            <div className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-xl mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-maroon">Recur Pro</h3>
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Past Due
                  </span>
                </div>
                <p className="text-sm text-amber-700">Please update your payment method to continue using Recur.</p>
              </div>
            </div>
          )}

          {/* No Subscription */}
          {!isActive && !isPastDue && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-maroon mb-2">Subscribe to Recur Pro</h3>
              <p className="text-maroon/60 mb-6 max-w-sm mx-auto">
                Get full access to client management, booking links, revenue forecasting, and more.
              </p>
              <div className="mb-6">
                <p className="text-3xl font-serif text-maroon">$29<span className="text-lg font-normal text-maroon/60">/month</span></p>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="px-8 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Subscribe Now'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Manage Billing Button */}
          {(isActive || isPastDue) && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleManageBilling}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-100 text-maroon rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Manage Billing & Invoices'}
              </button>
              <p className="text-xs text-slate-400 mt-2">
                Update payment method, view invoices, or cancel subscription
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  profileSlug: '',
  bio: '',
  showPrices: true,
  takingNewClients: true,
  waitlistMode: false,
  requireDeposit: false,
  depositAmount: 50,
  depositType: 'fixed',
  minimumLeadTime: '24',
  maximumAdvanceBooking: '60',
  autoConfirmExisting: false,
};

export const Settings: React.FC<SettingsProps> = ({ profile, onBack, onUpdateProfile, onLogoClick, onPreviewProfile }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [editedProfile, setEditedProfile] = useState<StylistProfile>(profile);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [billing] = useState<BillingInfo>(DEFAULT_BILLING);
  const [showSquarePreview, setShowSquarePreview] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState<{ type: 'base' | 'addon' | 'event'; service?: Service } | null>(null);
  const [showRotationModal, setShowRotationModal] = useState<{ type: RotationType; weeks: number; description: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    ...DEFAULT_BOOKING_SETTINGS,
    profileSlug: profile.businessName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-business',
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    { id: 'business', label: 'Business', icon: <BuildingIcon /> },
    { id: 'services', label: 'Services', icon: <TagIcon /> },
    { id: 'rotation', label: 'Rotation', icon: <RefreshIcon /> },
    { id: 'booking', label: 'Booking Link', icon: <ShareIcon /> },
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon /> },
    { id: 'billing', label: 'Billing', icon: <CreditCardIcon /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon /> },
  ];

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setSaveMessage('Changes saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: preferences.currency, maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const baseServices = editedProfile.services.filter(s => s.category === 'base');
  const addonServices = editedProfile.services.filter(s => s.category === 'addon');
  const eventServices = editedProfile.services.filter(s => s.category === 'event');

  const handleAddService = (service: Service) => {
    setEditedProfile({
      ...editedProfile,
      services: [...editedProfile.services, service],
    });
    setShowServiceModal(null);
  };

  const handleUpdateService = (updatedService: Service) => {
    setEditedProfile({
      ...editedProfile,
      services: editedProfile.services.map(s => s.id === updatedService.id ? updatedService : s),
    });
    setShowServiceModal(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setEditedProfile({
      ...editedProfile,
      services: editedProfile.services.filter(s => s.id !== serviceId),
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all"
          >
            <div className="text-maroon">
              <LOGOS.Main />
            </div>
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 text-maroon/70 hover:text-maroon hover:bg-slate-100 rounded-xl text-sm font-medium transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif text-maroon">Settings</h1>
          <p className="text-maroon/60 text-sm sm:text-base">Manage your account, business, and preferences.</p>
        </div>

        {/* Save Message Toast */}
        {saveMessage && (
          <div className="fixed top-20 right-4 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {saveMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-maroon text-white'
                        : 'text-maroon hover:bg-slate-50'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-white' : 'text-maroon/60'}>{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-xl font-serif text-maroon">Your Profile</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Profile Photo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#c17f59] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {editedProfile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DU'}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-slate-100 text-maroon rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                          Upload Photo
                        </button>
                        <p className="text-xs text-slate-400 mt-1">Max 2MB, JPG or PNG</p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                    <button className="text-[#c17f59] font-medium text-sm hover:underline">
                      Change password →
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Section */}
            {activeTab === 'business' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-xl font-serif text-maroon">Your Business</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={editedProfile.businessName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="Your business name"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Industry *</label>
                    <select
                      value={editedProfile.industry || 'hair-stylist'}
                      onChange={(e) => setEditedProfile({ ...editedProfile, industry: e.target.value as IndustryType })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                    >
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="City, State"
                    />
                  </div>

                  {/* Years in Business */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Years in Business</label>
                    <input
                      type="number"
                      value={editedProfile.yearsInBusiness || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, yearsInBusiness: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialties</label>
                    <input
                      type="text"
                      value={editedProfile.specialties?.join(', ') || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                      placeholder="Color, Cuts, Extensions (comma-separated)"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-maroon mb-4">Invoice Details (Optional)</h3>

                    {/* Business Address */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                        placeholder="123 Main St, Suite 100"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Website</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-serif text-maroon">Your Service Menu</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Base Services */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-maroon">Base Services</h3>
                        <button
                          onClick={() => setShowServiceModal({ type: 'base' })}
                          className="text-sm font-medium text-[#c17f59] hover:underline flex items-center gap-1"
                        >
                          <span>+</span> Add Base Service
                        </button>
                      </div>
                      <div className="space-y-2">
                        {baseServices.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">No base services added yet.</p>
                        ) : (
                          baseServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div>
                                <span className="font-medium text-maroon">{service.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-maroon">{formatCurrency(service.price)}</span>
                                <button
                                  onClick={() => setShowServiceModal({ type: 'base', service })}
                                  className="p-2 text-slate-400 hover:text-maroon hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <PencilIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Add-On Services */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-maroon">Add-On Services</h3>
                        <button
                          onClick={() => setShowServiceModal({ type: 'addon' })}
                          className="text-sm font-medium text-[#c17f59] hover:underline flex items-center gap-1"
                        >
                          <span>+</span> Add Add-On
                        </button>
                      </div>
                      <div className="space-y-2">
                        {addonServices.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">No add-on services added yet.</p>
                        ) : (
                          addonServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div>
                                <span className="font-medium text-maroon">{service.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-maroon">{formatCurrency(service.price)}</span>
                                <button
                                  onClick={() => setShowServiceModal({ type: 'addon', service })}
                                  className="p-2 text-slate-400 hover:text-maroon hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <PencilIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Event Services */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-maroon">Event Services</h3>
                        <button
                          onClick={() => setShowServiceModal({ type: 'event' })}
                          className="text-sm font-medium text-[#c17f59] hover:underline flex items-center gap-1"
                        >
                          <span>+</span> Add Event Service
                        </button>
                      </div>
                      <div className="space-y-2">
                        {eventServices.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">No event services added yet.</p>
                        ) : (
                          eventServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div>
                                <span className="font-medium text-maroon">{service.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-maroon">{formatCurrency(service.price)}</span>
                                <button
                                  onClick={() => setShowServiceModal({ type: 'event', service })}
                                  className="p-2 text-slate-400 hover:text-maroon hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <PencilIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rotation Section */}
            {activeTab === 'rotation' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-xl font-serif text-maroon">Rotation Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Rotation Tiers */}
                  <div className="space-y-4">
                    {/* Priority Tier */}
                    <div className="p-4 bg-[#c17f59]/10 border-2 border-[#c17f59]/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#c17f59] rounded-lg flex items-center justify-center text-white font-bold">P</div>
                          <div>
                            <h4 className="font-bold text-maroon">Priority</h4>
                            <p className="text-sm text-maroon/60">8 weeks</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowRotationModal({ type: RotationType.PRIORITY, weeks: 8, description: 'Your highest-value clients. Frequent visits, consistent revenue.' })}
                          className="px-4 py-2 text-[#c17f59] hover:bg-[#c17f59]/10 rounded-lg font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-maroon/70 mt-2">Your highest-value clients. Frequent visits, consistent revenue.</p>
                    </div>

                    {/* Standard Tier */}
                    <div className="p-4 bg-[#7c9a7e]/10 border-2 border-[#7c9a7e]/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#7c9a7e] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                          <div>
                            <h4 className="font-bold text-maroon">Standard</h4>
                            <p className="text-sm text-maroon/60">10 weeks</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowRotationModal({ type: RotationType.STANDARD, weeks: 10, description: 'Your core clients. Reliable and consistent.' })}
                          className="px-4 py-2 text-[#7c9a7e] hover:bg-[#7c9a7e]/10 rounded-lg font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-maroon/70 mt-2">Your core clients. Reliable and consistent.</p>
                    </div>

                    {/* Flex Tier */}
                    <div className="p-4 bg-[#b5a078]/10 border-2 border-[#b5a078]/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#b5a078] rounded-lg flex items-center justify-center text-white font-bold">F</div>
                          <div>
                            <h4 className="font-bold text-maroon">Flex</h4>
                            <p className="text-sm text-maroon/60">12+ weeks</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowRotationModal({ type: RotationType.FLEX, weeks: 12, description: 'Occasional clients. They come when you have room.' })}
                          className="px-4 py-2 text-[#b5a078] hover:bg-[#b5a078]/10 rounded-lg font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-maroon/70 mt-2">Occasional clients. They come when you have room.</p>
                    </div>
                  </div>

                  {/* Default Rotation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Default Rotation for New Clients</label>
                    <select
                      value={editedProfile.defaultRotation}
                      onChange={(e) => setEditedProfile({ ...editedProfile, defaultRotation: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                    >
                      <option value="8">8 weeks (Priority)</option>
                      <option value="10">10 weeks (Standard)</option>
                      <option value="12">12 weeks (Flex)</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Link Section */}
            {activeTab === 'booking' && (
              <div className="space-y-6">
                {/* Share Link Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-serif text-maroon">Your Booking Link</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-maroon/60 text-sm mb-4">
                      Share this link with potential clients so they can book appointments with you.
                    </p>

                    {/* Link Display */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-mono text-sm text-maroon overflow-hidden">
                        <span className="text-slate-400">bookrecur.com/book/</span>
                        {bookingSettings.profileSlug}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://bookrecur.com/book/${bookingSettings.profileSlug}`);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                          copySuccess
                            ? 'bg-emerald-500 text-white'
                            : 'bg-maroon text-white hover:bg-maroon/90'
                        }`}
                      >
                        {copySuccess ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {/* Share Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => {
                          window.open(`sms:?body=Book your next appointment with me! https://bookrecur.com/book/${bookingSettings.profileSlug}`, '_blank');
                        }}
                        className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Text
                      </button>
                      <button
                        onClick={() => {
                          window.open(`mailto:?subject=Book with ${profile.name || 'me'}&body=Book your next appointment with me! https://bookrecur.com/book/${bookingSettings.profileSlug}`, '_blank');
                        }}
                        className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button
                        onClick={() => {
                          alert('Demo: QR code would be generated and downloaded.');
                        }}
                        className="px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium text-sm hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        QR Code
                      </button>
                      <button
                        onClick={() => {
                          if (onPreviewProfile) {
                            onPreviewProfile();
                          } else {
                            alert('Demo: Would open page preview in new tab.');
                          }
                        }}
                        className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Settings */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-maroon">Profile Settings</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Profile URL Slug</label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">bookrecur.com/book/</span>
                        <input
                          type="text"
                          value={bookingSettings.profileSlug}
                          onChange={(e) => setBookingSettings({ ...bookingSettings, profileSlug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                          className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                          placeholder="your-business-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bio (max 200 characters)</label>
                      <textarea
                        value={bookingSettings.bio}
                        onChange={(e) => setBookingSettings({ ...bookingSettings, bio: e.target.value.slice(0, 200) })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors resize-none"
                        rows={3}
                        placeholder="Tell potential clients about your specialty..."
                      />
                      <p className="text-xs text-slate-400 mt-1">{bookingSettings.bio.length}/200</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-maroon">Show prices on profile</p>
                        <p className="text-sm text-slate-500">Display service prices publicly</p>
                      </div>
                      <Toggle
                        checked={bookingSettings.showPrices}
                        onChange={(checked) => setBookingSettings({ ...bookingSettings, showPrices: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-maroon">Taking new clients</p>
                        <p className="text-sm text-slate-500">Allow new clients to book with you</p>
                      </div>
                      <Toggle
                        checked={bookingSettings.takingNewClients}
                        onChange={(checked) => setBookingSettings({ ...bookingSettings, takingNewClients: checked, waitlistMode: checked ? false : bookingSettings.waitlistMode })}
                      />
                    </div>

                    {!bookingSettings.takingNewClients && (
                      <div className="flex items-center justify-between pl-6 border-l-2 border-slate-200">
                        <div>
                          <p className="font-medium text-maroon">Enable waitlist</p>
                          <p className="text-sm text-slate-500">Let people join a waitlist instead</p>
                        </div>
                        <Toggle
                          checked={bookingSettings.waitlistMode}
                          onChange={(checked) => setBookingSettings({ ...bookingSettings, waitlistMode: checked })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Settings */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-maroon">Booking Settings</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-maroon">Require deposit for new clients</p>
                        <p className="text-sm text-slate-500">Collect payment to hold appointments</p>
                      </div>
                      <Toggle
                        checked={bookingSettings.requireDeposit}
                        onChange={(checked) => setBookingSettings({ ...bookingSettings, requireDeposit: checked })}
                      />
                    </div>

                    {bookingSettings.requireDeposit && (
                      <div className="pl-6 border-l-2 border-slate-200 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deposit Amount</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={bookingSettings.depositAmount}
                              onChange={(e) => setBookingSettings({ ...bookingSettings, depositAmount: parseInt(e.target.value) || 0 })}
                              className="w-24 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
                              min="0"
                            />
                            <select
                              value={bookingSettings.depositType}
                              onChange={(e) => setBookingSettings({ ...bookingSettings, depositType: e.target.value as 'fixed' | 'percentage' })}
                              className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                            >
                              <option value="fixed">$ (Fixed)</option>
                              <option value="percentage">% (Percentage)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Minimum Lead Time</label>
                      <select
                        value={bookingSettings.minimumLeadTime}
                        onChange={(e) => setBookingSettings({ ...bookingSettings, minimumLeadTime: e.target.value as BookingSettings['minimumLeadTime'] })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                      >
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                        <option value="72">72 hours</option>
                        <option value="168">1 week</option>
                      </select>
                      <p className="text-xs text-slate-400 mt-1">Clients must book at least this far in advance</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Maximum Advance Booking</label>
                      <select
                        value={bookingSettings.maximumAdvanceBooking}
                        onChange={(e) => setBookingSettings({ ...bookingSettings, maximumAdvanceBooking: e.target.value as BookingSettings['maximumAdvanceBooking'] })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                      >
                        <option value="14">2 weeks</option>
                        <option value="30">1 month</option>
                        <option value="60">2 months</option>
                        <option value="90">3 months</option>
                      </select>
                      <p className="text-xs text-slate-400 mt-1">How far out clients can book</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-maroon">Auto-confirm existing clients</p>
                        <p className="text-sm text-slate-500">Skip manual review for returning clients</p>
                      </div>
                      <Toggle
                        checked={bookingSettings.autoConfirmExisting}
                        onChange={(checked) => setBookingSettings({ ...bookingSettings, autoConfirmExisting: checked })}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Section */}
            {activeTab === 'integrations' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-xl font-serif text-maroon">Integrations</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Square Integration */}
                  <div className="p-4 border-2 border-slate-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
                          <path d="M7 7h10v10H7V7zm8 8V9H9v6h6z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-maroon">Square</h4>
                        <p className="text-sm text-slate-500">Send invoices and collect payments from your clients.</p>
                      </div>
                      <button
                        onClick={() => setShowSquarePreview(true)}
                        className="px-4 py-2 bg-maroon text-white rounded-xl font-medium text-sm hover:bg-maroon/90 transition-colors"
                      >
                        Connect Square
                      </button>
                    </div>
                  </div>

                  {/* Google Calendar */}
                  <div className="p-4 border-2 border-slate-200 rounded-xl opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15a2.5 2.5 0 01-2.5 2.5zM8 7v10h2v-4h4v4h2V7h-2v4h-4V7H8z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-maroon">Google Calendar</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-500">Coming Soon</span>
                        </div>
                        <p className="text-sm text-slate-500">Sync appointments to your calendar automatically.</p>
                      </div>
                      <button
                        disabled
                        className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm cursor-not-allowed"
                      >
                        Join Waitlist
                      </button>
                    </div>
                  </div>

                  {/* Stripe Connect */}
                  <StripeConnectSection />
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeTab === 'billing' && (
              <BillingSection
                subscriptionStatus={profile.subscriptionStatus}
                subscriptionCurrentPeriodEnd={profile.subscriptionCurrentPeriodEnd}
              />
            )}

            {/* Preferences Section */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-serif text-maroon">Preferences</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-bold text-maroon mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-maroon">Email notifications</p>
                            <p className="text-sm text-slate-500">Receive email updates about your account</p>
                          </div>
                          <Toggle
                            checked={preferences.emailNotifications}
                            onChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-maroon">Overdue client alerts</p>
                            <p className="text-sm text-slate-500">Get notified when clients miss their rotation</p>
                          </div>
                          <Toggle
                            checked={preferences.overdueAlerts}
                            onChange={(checked) => setPreferences({ ...preferences, overdueAlerts: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-maroon">Weekly summary email</p>
                            <p className="text-sm text-slate-500">Receive a weekly business summary</p>
                          </div>
                          <Toggle
                            checked={preferences.weeklySummary}
                            onChange={(checked) => setPreferences({ ...preferences, weeklySummary: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-maroon">Payment confirmations</p>
                            <p className="text-sm text-slate-500">Get notified when payments are received</p>
                          </div>
                          <Toggle
                            checked={preferences.paymentConfirmations}
                            onChange={(checked) => setPreferences({ ...preferences, paymentConfirmations: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <h3 className="font-bold text-maroon mb-4">Display</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Currency</label>
                          <select
                            value={preferences.currency}
                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value as UserPreferences['currency'] })}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD ($)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date Format</label>
                          <select
                            value={preferences.dateFormat}
                            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value as UserPreferences['dateFormat'] })}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start of Week</label>
                          <select
                            value={preferences.startOfWeek}
                            onChange={(e) => setPreferences({ ...preferences, startOfWeek: e.target.value as UserPreferences['startOfWeek'] })}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors bg-white"
                          >
                            <option value="Sunday">Sunday</option>
                            <option value="Monday">Monday</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-maroon">Data</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-maroon">Export Data</p>
                        <p className="text-sm text-slate-500">Download all your client data as CSV</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-100 text-maroon rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">
                        Export Data
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="font-medium text-red-500">Delete Account</p>
                        <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <ServiceModal
          type={showServiceModal.type}
          service={showServiceModal.service}
          onSave={showServiceModal.service ? handleUpdateService : handleAddService}
          onClose={() => setShowServiceModal(null)}
        />
      )}

      {/* Rotation Modal */}
      {showRotationModal && (
        <RotationModal
          tier={showRotationModal}
          onSave={() => setShowRotationModal(null)}
          onClose={() => setShowRotationModal(null)}
        />
      )}

      {/* Square Preview Modal */}
      {showSquarePreview && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSquarePreview(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 bg-gradient-to-r from-black to-gray-800 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
                    <path d="M7 7h10v10H7V7zm8 8V9H9v6h6z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Square Integration</h3>
                  <span className="text-xs text-white/60 uppercase tracking-wider">Preview</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-maroon/70 mb-6">When this feature launches, you'll be able to:</p>
              <ul className="space-y-3 mb-6">
                {['Connect your Square account securely', 'Send invoices to clients after appointments', 'Collect deposits when booking', 'Track payments in client profiles'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-maroon">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSquarePreview(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSquarePreview(false);
                    alert('Thanks for your interest! You\'ll be notified when Square integration launches.');
                  }}
                  className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-maroon text-center mb-2">Delete Account?</h3>
              <p className="text-maroon/70 text-center mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    alert('Demo: Account deletion would be processed here.');
                  }}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-maroon text-center mb-2">Cancel Subscription?</h3>
              <p className="text-maroon/70 text-center mb-6">Your subscription will remain active until the end of your billing period.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    alert('Demo: Subscription cancellation would be processed here.');
                  }}
                  className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Toggle Component
const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition-colors ${checked ? 'bg-[#7c9a7e]' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// Service Modal Component
const ServiceModal: React.FC<{
  type: 'base' | 'addon' | 'event';
  service?: Service;
  onSave: (service: Service) => void;
  onClose: () => void;
}> = ({ type, service, onSave, onClose }) => {
  const [name, setName] = useState(service?.name || '');
  const [price, setPrice] = useState(service?.price?.toString() || '');
  const [duration, setDuration] = useState('60');

  const handleSubmit = () => {
    if (!name || !price) return;
    onSave({
      id: service?.id || `service-${Date.now()}`,
      name,
      price: parseFloat(price),
      category: type,
    });
  };

  const typeLabels = { base: 'Base Service', addon: 'Add-On', event: 'Event Service' };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-maroon text-lg">{service ? 'Edit' : 'Add'} {typeLabels[type]}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
              placeholder="e.g., Cut + Style"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
              placeholder="85"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
              placeholder="60"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rotation Modal Component
const RotationModal: React.FC<{
  tier: { type: RotationType; weeks: number; description: string };
  onSave: () => void;
  onClose: () => void;
}> = ({ tier, onSave, onClose }) => {
  const [weeks, setWeeks] = useState(tier.weeks.toString());
  const [description, setDescription] = useState(tier.description);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-maroon text-lg">Edit {tier.type} Tier</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rotation Period (weeks)</label>
            <input
              type="number"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#c17f59] focus:outline-none transition-colors resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon Components
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
