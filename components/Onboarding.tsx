import React, { useState } from 'react';
import { StylistProfile, Service, IndustryType } from '../types';
import { ICONS, INDUSTRY_TEMPLATES } from '../constants';
import { createCheckoutSession } from '../lib/stripe';

interface OnboardingProps {
  onComplete: (profile: StylistProfile) => void;
  onSaveProfile: (profile: StylistProfile) => Promise<void>;
  onBack: () => void;
}

const DEFAULT_BASE_SERVICES = [
  { name: 'Shampoo + Style', price: 0 },
  { name: 'Cut + Style', price: 0 },
  { name: 'Color + Cut', price: 0 },
  { name: 'Color + Cut + Gloss', price: 0 },
  { name: 'Partial Highlights + Cut', price: 0 },
  { name: 'Full Highlights + Cut', price: 0 },
  { name: 'Balayage + Cut', price: 0 },
  { name: 'Silk Press', price: 0 },
];

const DEFAULT_ADDON_SERVICES = [
  { name: 'Deep conditioner', price: 0 },
  { name: 'Scalp treatment', price: 0 },
  { name: 'Gloss/Toner refresh', price: 0 },
  { name: 'Olaplex/Bond treatment', price: 0 },
  { name: 'Bang trim', price: 0 },
];

const DEFAULT_EVENT_SERVICES = [
  { name: 'Wedding trial', price: 0 },
  { name: 'Wedding day styling', price: 0 },
  { name: 'Photoshoot prep', price: 0 },
  { name: 'Birthday styling', price: 0 },
  { name: 'Other event', price: 0 },
];

// Industry SVG icons matching the landing page style
const INDUSTRY_ICONS: Record<IndustryType, { icon: React.ReactNode; color: string }> = {
  'hair-stylist': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <path d="M8.12 8.12 12 12"/>
        <path d="M20 4 8.12 15.88"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M14.8 14.8 20 20"/>
      </svg>
    ),
    color: '#C17F59'
  },
  'personal-trainer': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.4 14.4 9.6 9.6"/>
        <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/>
        <path d="m2.515 18.657 1.414-1.414"/>
        <path d="M5.343 21.485a2 2 0 0 1-2.828-2.828l1.767-1.768a2 2 0 0 1 2.829 2.829z"/>
      </svg>
    ),
    color: '#8B9A7D'
  },
  'massage-therapist': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
        <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
      </svg>
    ),
    color: '#C17F59'
  },
  'therapist-counselor': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>
        <path d="M8 12h.01"/>
        <path d="M12 12h.01"/>
        <path d="M16 12h.01"/>
      </svg>
    ),
    color: '#2A2420'
  },
  'esthetician': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      </svg>
    ),
    color: '#8B9A7D'
  },
  'consultant-coach': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4"/>
        <path d="M10 10h4"/>
        <path d="M10 14h4"/>
        <path d="M10 18h4"/>
      </svg>
    ),
    color: '#2A2420'
  },
  'other': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    ),
    color: '#C4B5A4'
  }
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSaveProfile, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<StylistProfile>>({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    location: '',
    yearsInBusiness: 0,
    services: [],
    defaultRotation: 10,
    annualGoal: 0,
    monthlyGoal: 0,
    industry: undefined,
  });

  const [baseServices, setBaseServices] = useState(DEFAULT_BASE_SERVICES);
  const [addonServices, setAddonServices] = useState(DEFAULT_ADDON_SERVICES);
  const [eventServices, setEventServices] = useState(DEFAULT_EVENT_SERVICES);

  // Load services based on industry selection
  const handleIndustrySelect = (industry: IndustryType) => {
    setSelectedIndustry(industry);
    setProfile(prev => ({ ...prev, industry }));
    const template = INDUSTRY_TEMPLATES[industry];
    setBaseServices(template.baseServices.map(name => ({ name, price: 0 })));
    setAddonServices(template.addonServices.map(name => ({ name, price: 0 })));
    setEventServices(template.eventServices.map(name => ({ name, price: 0 })));
  };

  // Custom service input state
  const [newBaseName, setNewBaseName] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('');
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventPrice, setNewEventPrice] = useState('');

  const addCustomService = (
    type: 'base' | 'addon' | 'event',
    name: string,
    price: string,
    setName: (v: string) => void,
    setPrice: (v: string) => void
  ) => {
    if (!name.trim()) return;
    const priceNum = parseInt(price) || 0;
    const newService = { name: name.trim(), price: priceNum };

    if (type === 'base') {
      setBaseServices([...baseServices, newService]);
    } else if (type === 'addon') {
      setAddonServices([...addonServices, newService]);
    } else {
      setEventServices([...eventServices, newService]);
    }
    setName('');
    setPrice('');
  };

  const removeService = (
    type: 'base' | 'addon' | 'event',
    index: number
  ) => {
    if (type === 'base') {
      setBaseServices(baseServices.filter((_, i) => i !== index));
    } else if (type === 'addon') {
      setAddonServices(addonServices.filter((_, i) => i !== index));
    } else {
      setEventServices(eventServices.filter((_, i) => i !== index));
    }
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else if (step === 5) {
      // Save profile first, then go to payment step
      setIsLoading(true);
      try {
        const allServices: Service[] = [
          ...baseServices.filter(s => s.price > 0).map((s, i) => ({ id: `base-${i}`, name: s.name, price: s.price, category: 'base' as const })),
          ...addonServices.filter(s => s.price > 0).map((s, i) => ({ id: `addon-${i}`, name: s.name, price: s.price, category: 'addon' as const })),
          ...eventServices.filter(s => s.price > 0).map((s, i) => ({ id: `event-${i}`, name: s.name, price: s.price, category: 'event' as const })),
        ];
        await onSaveProfile({ ...profile, services: allServices } as StylistProfile);
        setStep(6);
      } catch (err) {
        console.error('Error saving profile:', err);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 6) {
      // Redirect to Stripe Checkout with 14-day trial
      setIsLoading(true);
      setPaymentError(null);
      try {
        const { url, error } = await createCheckoutSession(
          14, // 14-day trial
          `${window.location.origin}/?onboarding=complete`,
          `${window.location.origin}/?onboarding=payment`
        );
        if (error) {
          setPaymentError(error);
          return;
        }
        if (url) {
          window.location.href = url;
        }
      } catch (err) {
        setPaymentError('Failed to start checkout');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateServicePrice = (
    services: typeof baseServices,
    setServices: typeof setBaseServices,
    index: number,
    price: number
  ) => {
    const updated = [...services];
    updated[index] = { ...updated[index], price };
    setServices(updated);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-maroon/60 hover:text-maroon flex items-center gap-2 text-sm font-medium">
            ← Back
          </button>
          <span className="text-sm font-bold text-maroon">Step {step} of 6</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-maroon rounded-full transition-all duration-500"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">What type of clients do you serve?</h1>
              <p className="text-maroon/60">Select your industry to get started with tailored services.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(Object.keys(INDUSTRY_TEMPLATES) as IndustryType[]).map((industry) => {
                const template = INDUSTRY_TEMPLATES[industry];
                const iconData = INDUSTRY_ICONS[industry];
                const isSelected = selectedIndustry === industry;
                return (
                  <button
                    key={industry}
                    onClick={() => handleIndustrySelect(industry)}
                    className={`p-4 sm:p-5 rounded-xl text-left transition-all border-2 ${
                      isSelected
                        ? 'border-[#C17F59] bg-[#C17F59]/5'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${iconData.color}15`,
                          color: iconData.color
                        }}
                      >
                        {iconData.icon}
                      </div>
                      <span className={`font-bold text-sm sm:text-base ${isSelected ? 'text-maroon' : 'text-slate-700'}`}>
                        {template.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="mt-3 ml-13 text-xs text-maroon/60">
                        {template.baseServices.length} services • {template.addonServices.length} add-ons
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Let's set up your profile</h1>
              <p className="text-maroon/60">Tell us about you and your business.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Business Name <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="Studio or business name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Email *</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Location / City *</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Years in Business</label>
                  <input
                    type="number"
                    value={profile.yearsInBusiness || ''}
                    onChange={(e) => setProfile({ ...profile, yearsInBusiness: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Your Service Menu</h1>
              <p className="text-maroon/60">Optional: Enter your services and pricing, or skip to use demo data.</p>
            </div>

            <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm">
              This step is optional for the demo. Click "Continue" to skip with sample pricing.
            </div>

            <div className="space-y-6">
              {/* Base Services */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-6">Base Services</h3>
                <div className="space-y-4">
                  {baseServices.map((service, index) => (
                    <div key={`base-${index}`} className="flex items-center justify-between gap-2 sm:gap-4">
                      <span className="text-maroon flex-1 text-sm sm:text-base">{service.name}</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={service.price || ''}
                          onChange={(e) => updateServicePrice(baseServices, setBaseServices, index, parseInt(e.target.value) || 0)}
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          placeholder="0"
                        />
                      </div>
                      {index >= DEFAULT_BASE_SERVICES.length && (
                        <button
                          onClick={() => removeService('base', index)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add Custom Base Service */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newBaseName}
                        onChange={(e) => setNewBaseName(e.target.value)}
                        placeholder="Add custom service"
                        className="flex-1 min-w-0 text-sm sm:text-base text-maroon bg-transparent outline-none placeholder:text-slate-400"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={newBasePrice}
                          onChange={(e) => setNewBasePrice(e.target.value)}
                          placeholder="0"
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                        />
                      </div>
                      <button
                        onClick={() => addCustomService('base', newBaseName, newBasePrice, setNewBaseName, setNewBasePrice)}
                        className="flex-shrink-0 w-8 h-8 bg-maroon text-white rounded-lg font-bold text-sm hover:bg-maroon/90 transition-all flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-On Services */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-6">Add-On Services</h3>
                <div className="space-y-4">
                  {addonServices.map((service, index) => (
                    <div key={`addon-${index}`} className="flex items-center justify-between gap-2 sm:gap-4">
                      <span className="text-maroon flex-1 text-sm sm:text-base">{service.name}</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={service.price || ''}
                          onChange={(e) => updateServicePrice(addonServices, setAddonServices, index, parseInt(e.target.value) || 0)}
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          placeholder="0"
                        />
                      </div>
                      {index >= DEFAULT_ADDON_SERVICES.length && (
                        <button
                          onClick={() => removeService('addon', index)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add Custom Add-on Service */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newAddonName}
                        onChange={(e) => setNewAddonName(e.target.value)}
                        placeholder="Add custom add-on"
                        className="flex-1 min-w-0 text-sm sm:text-base text-maroon bg-transparent outline-none placeholder:text-slate-400"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={newAddonPrice}
                          onChange={(e) => setNewAddonPrice(e.target.value)}
                          placeholder="0"
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                        />
                      </div>
                      <button
                        onClick={() => addCustomService('addon', newAddonName, newAddonPrice, setNewAddonName, setNewAddonPrice)}
                        className="flex-shrink-0 w-8 h-8 bg-maroon text-white rounded-lg font-bold text-sm hover:bg-maroon/90 transition-all flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Services */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-6">Event Services</h3>
                <div className="space-y-4">
                  {eventServices.map((service, index) => (
                    <div key={`event-${index}`} className="flex items-center justify-between gap-2 sm:gap-4">
                      <span className="text-maroon flex-1 text-sm sm:text-base">{service.name}</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={service.price || ''}
                          onChange={(e) => updateServicePrice(eventServices, setEventServices, index, parseInt(e.target.value) || 0)}
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          placeholder="0"
                        />
                      </div>
                      {index >= DEFAULT_EVENT_SERVICES.length && (
                        <button
                          onClick={() => removeService('event', index)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add Custom Event Service */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="Add custom event"
                        className="flex-1 min-w-0 text-sm sm:text-base text-maroon bg-transparent outline-none placeholder:text-slate-400"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="number"
                          value={newEventPrice}
                          onChange={(e) => setNewEventPrice(e.target.value)}
                          placeholder="0"
                          className="w-24 sm:w-28 pl-8 pr-2 sm:pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                        />
                      </div>
                      <button
                        onClick={() => addCustomService('event', newEventName, newEventPrice, setNewEventName, setNewEventPrice)}
                        className="flex-shrink-0 w-8 h-8 bg-maroon text-white rounded-lg font-bold text-sm hover:bg-maroon/90 transition-all flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Rotation Settings</h1>
              <p className="text-maroon/60">The rotation system helps you forecast income based on how often clients visit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#c17f59]/10 p-6 rounded-2xl border-2 border-[#c17f59]/30">
                <div className="w-10 h-10 bg-[#c17f59] rounded-xl flex items-center justify-center text-white mb-4">
                  <ICONS.Sparkle />
                </div>
                <h3 className="text-lg font-bold text-maroon mb-1">Priority</h3>
                <p className="text-2xl font-serif text-maroon mb-3">8 Weeks</p>
                <p className="text-sm text-maroon/70">Your highest-value clients. Frequent visits, consistent revenue. They keep your books full.</p>
              </div>

              <div className="bg-[#7c9a7e]/10 p-6 rounded-2xl border-2 border-[#7c9a7e]/30">
                <div className="w-10 h-10 bg-[#7c9a7e] rounded-xl flex items-center justify-center text-white mb-4">
                  <ICONS.Calendar />
                </div>
                <h3 className="text-lg font-bold text-maroon mb-1">Standard</h3>
                <p className="text-2xl font-serif text-maroon mb-3">10 Weeks</p>
                <p className="text-sm text-maroon/70">Your core clients. Reliable and consistent. The backbone of your income.</p>
              </div>

              <div className="bg-[#b5a078]/10 p-6 rounded-2xl border-2 border-[#b5a078]/30">
                <div className="w-10 h-10 bg-[#b5a078] rounded-xl flex items-center justify-center text-white mb-4">
                  <ICONS.Sun />
                </div>
                <h3 className="text-lg font-bold text-maroon mb-1">Flex</h3>
                <p className="text-2xl font-serif text-maroon mb-3">12+ Weeks</p>
                <p className="text-sm text-maroon/70">Occasional clients. They come when you have room. You control the invite.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-maroon mb-3">Default rotation for new clients</label>
              <select
                value={profile.defaultRotation}
                onChange={(e) => setProfile({ ...profile, defaultRotation: parseInt(e.target.value) })}
                className="w-full md:w-64 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all bg-white"
              >
                <option value={8}>8 weeks (Priority)</option>
                <option value={10}>10 weeks (Standard)</option>
                <option value={12}>12 weeks (Flex)</option>
              </select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Set Your Goals</h1>
              <p className="text-maroon/60">Optional: Set income goals to track your progress throughout the year.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Annual Income Goal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                  <input
                    type="number"
                    value={profile.annualGoal || ''}
                    onChange={(e) => {
                      const annual = parseInt(e.target.value) || 0;
                      setProfile({ ...profile, annualGoal: annual, monthlyGoal: Math.round(annual / 12) });
                    }}
                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-2xl font-serif"
                    placeholder="100,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Monthly Income Goal <span className="text-slate-400 font-normal">(auto-calculated)</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                  <input
                    type="number"
                    value={profile.monthlyGoal || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-2xl font-serif text-maroon/60"
                    placeholder="8,333"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-maroon/60">
                  Don't worry—you can always update your goals later from your dashboard settings.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif text-maroon mb-2">You're Almost Done!</h1>
              <p className="text-maroon/60">Start your 14-day free trial to access all features.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 max-w-md mx-auto">
              <div className="text-center mb-6">
                <p className="text-4xl font-serif text-maroon mb-1">$29<span className="text-lg font-normal text-maroon/60">/month</span></p>
                <p className="text-emerald-600 font-medium">14 days free, cancel anytime</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-maroon">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited clients & bookings
                </li>
                <li className="flex items-center gap-3 text-maroon">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Public booking page
                </li>
                <li className="flex items-center gap-3 text-maroon">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Revenue forecasting
                </li>
                <li className="flex items-center gap-3 text-maroon">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Collect deposits with Stripe
                </li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 text-center">
                You won't be charged until your trial ends
              </div>

              {paymentError && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 text-center">
                  {paymentError}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={(step === 1 && !selectedIndustry) || isLoading}
            className="btn-primary px-8 py-4 bg-maroon text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                {step === 6 ? 'Redirecting...' : 'Saving...'}
              </>
            ) : step === 6 ? (
              'Start Free Trial'
            ) : step === 5 ? (
              <>Continue<span>→</span></>
            ) : (
              <>Continue<span>→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
