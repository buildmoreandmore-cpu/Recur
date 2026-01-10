import React, { useState } from 'react';
import { StylistProfile, Service } from '../types';
import { ICONS } from '../constants';

interface OnboardingProps {
  onComplete: (profile: StylistProfile) => void;
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

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
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
  });

  const [baseServices, setBaseServices] = useState(DEFAULT_BASE_SERVICES);
  const [addonServices, setAddonServices] = useState(DEFAULT_ADDON_SERVICES);
  const [eventServices, setEventServices] = useState(DEFAULT_EVENT_SERVICES);

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

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Compile services
      const allServices: Service[] = [
        ...baseServices.filter(s => s.price > 0).map((s, i) => ({ id: `base-${i}`, name: s.name, price: s.price, category: 'base' as const })),
        ...addonServices.filter(s => s.price > 0).map((s, i) => ({ id: `addon-${i}`, name: s.name, price: s.price, category: 'addon' as const })),
        ...eventServices.filter(s => s.price > 0).map((s, i) => ({ id: `event-${i}`, name: s.name, price: s.price, category: 'event' as const })),
      ];
      onComplete({ ...profile, services: allServices } as StylistProfile);
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
          <span className="text-sm font-bold text-maroon">Step {step} of 4</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-maroon rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {step === 1 && (
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

        {step === 2 && (
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
                    <p className="text-xs text-slate-400 mb-2">Add custom service:</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newBaseName}
                        onChange={(e) => setNewBaseName(e.target.value)}
                        placeholder="Service name"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-sm sm:text-base text-maroon"
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:flex-none">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={newBasePrice}
                            onChange={(e) => setNewBasePrice(e.target.value)}
                            placeholder="0"
                            className="w-full sm:w-24 pl-8 pr-2 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          />
                        </div>
                        <button
                          onClick={() => addCustomService('base', newBaseName, newBasePrice, setNewBaseName, setNewBasePrice)}
                          className="flex-shrink-0 w-10 h-10 bg-maroon text-white rounded-xl font-bold text-lg hover:bg-maroon/90 transition-all flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
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
                    <p className="text-xs text-slate-400 mb-2">Add custom add-on:</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newAddonName}
                        onChange={(e) => setNewAddonName(e.target.value)}
                        placeholder="Add-on name"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-sm sm:text-base text-maroon"
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:flex-none">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={newAddonPrice}
                            onChange={(e) => setNewAddonPrice(e.target.value)}
                            placeholder="0"
                            className="w-full sm:w-24 pl-8 pr-2 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          />
                        </div>
                        <button
                          onClick={() => addCustomService('addon', newAddonName, newAddonPrice, setNewAddonName, setNewAddonPrice)}
                          className="flex-shrink-0 w-10 h-10 bg-maroon text-white rounded-xl font-bold text-lg hover:bg-maroon/90 transition-all flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
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
                    <p className="text-xs text-slate-400 mb-2">Add custom event:</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <input
                        type="text"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="Event name"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-sm sm:text-base text-maroon"
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:flex-none">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={newEventPrice}
                            onChange={(e) => setNewEventPrice(e.target.value)}
                            placeholder="0"
                            className="w-full sm:w-24 pl-8 pr-2 py-2 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all text-right text-sm"
                          />
                        </div>
                        <button
                          onClick={() => addCustomService('event', newEventName, newEventPrice, setNewEventName, setNewEventPrice)}
                          className="flex-shrink-0 w-10 h-10 bg-maroon text-white rounded-xl font-bold text-lg hover:bg-maroon/90 transition-all flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
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
                <p className="text-sm text-maroon/70">Your color-dependent, event-driven clients. They keep your books full.</p>
              </div>

              <div className="bg-[#7c9a7e]/10 p-6 rounded-2xl border-2 border-[#7c9a7e]/30">
                <div className="w-10 h-10 bg-[#7c9a7e] rounded-xl flex items-center justify-center text-white mb-4">
                  <ICONS.Calendar />
                </div>
                <h3 className="text-lg font-bold text-maroon mb-1">Standard</h3>
                <p className="text-2xl font-serif text-maroon mb-3">10 Weeks</p>
                <p className="text-sm text-maroon/70">Consistent and reliable. The backbone of your business.</p>
              </div>

              <div className="bg-[#b5a078]/10 p-6 rounded-2xl border-2 border-[#b5a078]/30">
                <div className="w-10 h-10 bg-[#b5a078] rounded-xl flex items-center justify-center text-white mb-4">
                  <ICONS.Sun />
                </div>
                <h3 className="text-lg font-bold text-maroon mb-1">Flex</h3>
                <p className="text-2xl font-serif text-maroon mb-3">12+ Weeks</p>
                <p className="text-sm text-maroon/70">Low-maintenance clients. You offer slots when it works for you.</p>
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

        {step === 4 && (
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

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="btn-primary px-8 py-4 bg-maroon text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2"
          >
            {step === 4 ? 'Complete Setup' : 'Continue'}
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
