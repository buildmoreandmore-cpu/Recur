import React, { useState, useEffect } from 'react';
import { Client, RotationType, Service, StylistProfile } from '../types';
import { ICONS } from '../constants';

interface ClientIntakeProps {
  profile: StylistProfile;
  onSave: (client: Client) => void;
  onBack: () => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ClientIntake: React.FC<ClientIntakeProps> = ({ profile, onSave, onBack }) => {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Partial<Client>>({
    id: `client-${Date.now()}`,
    name: '',
    phone: '',
    email: '',
    preferredDays: [],
    preferredTime: 'Morning',
    contactMethod: 'Text',
    occupation: '',
    clientFacing: false,
    morningTime: '15 min',
    events: [],
    photographed: 'Rarely',
    lastColor: '',
    lastCut: '',
    concerns: '',
    whatWorks: '',
    whatFailed: '',
    allergies: '',
    heatTools: 'Few times a week',
    hairGoal: '',
    maintenanceLevel: 'Medium',
    naturalColor: '',
    currentColor: '',
    growOutComfort: '4 weeks',
    rotation: RotationType.STANDARD,
    rotationWeeks: 10,
    baseService: null,
    addOns: [],
    annualValue: 0,
    nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientSince: new Date().toISOString().split('T')[0],
    appointments: [],
    notes: '',
    status: 'pending',
  });

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<{ service: Service; frequency: string }[]>([]);

  const baseServices = profile.services.filter(s => s.category === 'base');
  const addonServices = profile.services.filter(s => s.category === 'addon');
  const eventServices = profile.services.filter(s => s.category === 'event');

  // Calculate annual value
  useEffect(() => {
    let annual = 0;
    const rotationWeeks = client.rotationWeeks || 10;
    const visitsPerYear = 52 / rotationWeeks;

    // Base service
    if (client.baseService) {
      annual += client.baseService.price * visitsPerYear;
    }

    // Add-ons
    selectedAddOns.forEach(addon => {
      let frequency = visitsPerYear;
      if (addon.frequency === 'Every other visit') frequency = visitsPerYear / 2;
      if (addon.frequency === 'Occasionally') frequency = visitsPerYear / 4;
      annual += addon.service.price * frequency;
    });

    // Events
    client.events?.forEach(event => {
      if (event.service) {
        annual += event.service.price;
      }
    });

    setClient(prev => ({ ...prev, annualValue: Math.round(annual), addOns: selectedAddOns }));
  }, [client.baseService, client.rotationWeeks, selectedAddOns, client.events]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Generate appointments for the year
      const appointments = [];
      const rotationWeeks = client.rotationWeeks || 10;
      let currentDate = new Date();
      const visitsPerYear = Math.floor(52 / rotationWeeks);

      for (let i = 0; i < visitsPerYear; i++) {
        appointments.push({
          date: currentDate.toISOString().split('T')[0],
          service: client.baseService?.name || 'Service',
          price: client.baseService?.price || 0,
          status: i === 0 ? 'upcoming' as const : 'scheduled' as const,
        });
        currentDate = new Date(currentDate.getTime() + rotationWeeks * 7 * 24 * 60 * 60 * 1000);
      }

      // Add events
      client.events?.forEach(event => {
        if (event.service && event.date) {
          appointments.push({
            date: event.date,
            service: event.service.name,
            price: event.service.price,
            status: 'event' as const,
          });
        }
      });

      appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      onSave({
        ...client,
        appointments,
        addOns: selectedAddOns,
      } as Client);
    }
  };

  const toggleDay = (day: string) => {
    const days = client.preferredDays || [];
    if (days.includes(day)) {
      setClient({ ...client, preferredDays: days.filter(d => d !== day) });
    } else {
      setClient({ ...client, preferredDays: [...days, day] });
    }
  };

  const toggleAddOn = (service: Service) => {
    const existing = selectedAddOns.find(a => a.service.id === service.id);
    if (existing) {
      setSelectedAddOns(selectedAddOns.filter(a => a.service.id !== service.id));
    } else {
      setSelectedAddOns([...selectedAddOns, { service, frequency: 'Every visit' }]);
    }
  };

  const updateAddOnFrequency = (serviceId: string, frequency: string) => {
    setSelectedAddOns(selectedAddOns.map(a =>
      a.service.id === serviceId ? { ...a, frequency } : a
    ));
  };

  const addEvent = () => {
    if (eventName && eventDate) {
      setClient({
        ...client,
        events: [...(client.events || []), { name: eventName, date: eventDate, service: null }]
      });
      setEventName('');
      setEventDate('');
    }
  };

  const setRotation = (rotation: RotationType, weeks: number) => {
    setClient({ ...client, rotation, rotationWeeks: weeks });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-maroon/60 hover:text-maroon flex items-center gap-2 text-sm font-medium">
            ← Cancel
          </button>
          <span className="text-sm font-bold text-maroon">Step {step} of 5</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-maroon rounded-full transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Client Basics</h1>
              <p className="text-maroon/60">Start with the essentials.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Client Name *</label>
                <input
                  type="text"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Phone</label>
                  <input
                    type="tel"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Email</label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Preferred Contact Method</label>
                <select
                  value={client.contactMethod}
                  onChange={(e) => setClient({ ...client, contactMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all bg-white"
                >
                  <option value="Text">Text</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">Preferred Days</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        client.preferredDays?.includes(day)
                          ? 'bg-maroon text-white'
                          : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Preferred Time</label>
                <select
                  value={client.preferredTime}
                  onChange={(e) => setClient({ ...client, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all bg-white"
                >
                  <option value="Morning">Morning</option>
                  <option value="Midday">Midday</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Lifestyle</h1>
              <p className="text-maroon/60">Understanding their life helps you serve them better.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="block text-sm font-bold text-maroon mb-2">What do you do for work?</label>
                <input
                  type="text"
                  value={client.occupation}
                  onChange={(e) => setClient({ ...client, occupation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  placeholder="Job title or industry"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">Do you have client-facing meetings regularly?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setClient({ ...client, clientFacing: true })}
                    className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                      client.clientFacing ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setClient({ ...client, clientFacing: false })}
                    className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                      !client.clientFacing ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">How much time on your hair each morning?</label>
                <div className="flex flex-wrap gap-3">
                  {['5 min', '15 min', '30+ min'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setClient({ ...client, morningTime: time })}
                      className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        client.morningTime === time ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">How often are you photographed or on camera?</label>
                <div className="flex flex-wrap gap-3">
                  {['Rarely', 'Monthly', 'Weekly'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setClient({ ...client, photographed: freq })}
                      className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        client.photographed === freq ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-maroon mb-3">Any big events this year?</label>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="Event name (e.g., Wedding)"
                  />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  />
                  <button
                    onClick={addEvent}
                    className="px-4 py-3 bg-slate-100 rounded-xl text-maroon font-bold hover:bg-slate-200 transition-all"
                  >
                    Add
                  </button>
                </div>
                {client.events && client.events.length > 0 && (
                  <div className="space-y-2">
                    {client.events.map((event, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#fff38a]/30 rounded-xl">
                        <ICONS.Calendar />
                        <span className="font-medium text-maroon">{event.name}</span>
                        <span className="text-maroon/60">— {new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Hair History</h1>
              <p className="text-maroon/60">What's worked, what hasn't, and what to watch out for.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Last color service</label>
                  <input
                    type="date"
                    value={client.lastColor}
                    onChange={(e) => setClient({ ...client, lastColor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Last cut</label>
                  <input
                    type="date"
                    value={client.lastCut}
                    onChange={(e) => setClient({ ...client, lastCut: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Any current damage or concerns?</label>
                <textarea
                  value={client.concerns}
                  onChange={(e) => setClient({ ...client, concerns: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Breakage, dryness, sensitive scalp..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">What's worked well in the past?</label>
                <textarea
                  value={client.whatWorks}
                  onChange={(e) => setClient({ ...client, whatWorks: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Techniques, products, styles..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">What's failed or you'd never do again?</label>
                <textarea
                  value={client.whatFailed}
                  onChange={(e) => setClient({ ...client, whatFailed: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Bad experiences, styles to avoid..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-2">Any allergies or sensitivities?</label>
                <input
                  type="text"
                  value={client.allergies}
                  onChange={(e) => setClient({ ...client, allergies: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                  placeholder="Products, ingredients..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">How often do you use heat tools?</label>
                <div className="flex flex-wrap gap-3">
                  {['Daily', 'Few times a week', 'Rarely'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setClient({ ...client, heatTools: freq })}
                      className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        client.heatTools === freq ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Goals</h1>
              <p className="text-maroon/60">What does success look like for their hair?</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
              <div>
                <label className="block text-sm font-bold text-maroon mb-2">What's your goal for your hair this year?</label>
                <textarea
                  value={client.hairGoal}
                  onChange={(e) => setClient({ ...client, hairGoal: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Grow it out, go blonde, maintain health..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">Maintenance level preference</label>
                <div className="flex flex-wrap gap-3">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setClient({ ...client, maintenanceLevel: level })}
                      className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        client.maintenanceLevel === level ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Natural hair color</label>
                  <input
                    type="text"
                    value={client.naturalColor}
                    onChange={(e) => setClient({ ...client, naturalColor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="Dark brown, black, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maroon mb-2">Current color</label>
                  <input
                    type="text"
                    value={client.currentColor}
                    onChange={(e) => setClient({ ...client, currentColor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c17f59] focus:ring-2 focus:ring-[#c17f59]/20 outline-none transition-all"
                    placeholder="Balayage, highlights, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maroon mb-3">How much grow-out are you comfortable with?</label>
                <div className="flex flex-wrap gap-3">
                  {['2 weeks', '4 weeks', '6 weeks', '8+ weeks'].map((weeks) => (
                    <button
                      key={weeks}
                      onClick={() => setClient({ ...client, growOutComfort: weeks })}
                      className={`px-4 sm:px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                        client.growOutComfort === weeks ? 'bg-maroon text-white' : 'bg-slate-100 text-maroon hover:bg-slate-200'
                      }`}
                    >
                      {weeks}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-serif text-maroon mb-2">Service & Rotation</h1>
              <p className="text-maroon/60">Assign services and see the annual projection.</p>
            </div>

            <div className="space-y-6">
              {/* Base Service */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-4">Base Service</h3>
                {baseServices.length === 0 ? (
                  <p className="text-slate-400">No base services set up. Go back to add services.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {baseServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setClient({ ...client, baseService: service })}
                        className={`p-4 rounded-xl text-left transition-all ${
                          client.baseService?.id === service.id
                            ? 'bg-maroon text-white'
                            : 'bg-slate-50 text-maroon hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold">{service.name}</div>
                        <div className={client.baseService?.id === service.id ? 'text-white/70' : 'text-slate-400'}>
                          {formatCurrency(service.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add-Ons */}
              {addonServices.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-maroon mb-4">Regular Add-Ons</h3>
                  <div className="space-y-3">
                    {addonServices.map((service) => {
                      const isSelected = selectedAddOns.some(a => a.service.id === service.id);
                      const addon = selectedAddOns.find(a => a.service.id === service.id);
                      return (
                        <div key={service.id} className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAddOn(service)}
                              className="w-5 h-5 rounded border-slate-300 text-maroon focus:ring-[#c17f59]"
                            />
                            <span className="font-medium text-maroon">{service.name}</span>
                            <span className="text-slate-400">{formatCurrency(service.price)}</span>
                          </label>
                          {isSelected && (
                            <select
                              value={addon?.frequency || 'Every visit'}
                              onChange={(e) => updateAddOnFrequency(service.id, e.target.value)}
                              className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                            >
                              <option>Every visit</option>
                              <option>Every other visit</option>
                              <option>Occasionally</option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Events */}
              {client.events && client.events.length > 0 && eventServices.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-maroon mb-4">Scheduled Events</h3>
                  <div className="space-y-4">
                    {client.events.map((event, i) => (
                      <div key={i} className="p-4 bg-[#fff38a]/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <ICONS.Sparkle />
                          <span className="font-bold text-maroon">{event.name}</span>
                          <span className="text-maroon/60">— {new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <select
                          value={event.service?.id || ''}
                          onChange={(e) => {
                            const service = eventServices.find(s => s.id === e.target.value) || null;
                            const updated = [...client.events!];
                            updated[i] = { ...updated[i], service };
                            setClient({ ...client, events: updated });
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="">Select service for this event</option>
                          {eventServices.map(s => (
                            <option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rotation Assignment */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-maroon mb-4">Rotation Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setRotation(RotationType.PRIORITY, 8)}
                    className={`p-6 rounded-xl text-left transition-all ${
                      client.rotation === RotationType.PRIORITY
                        ? 'bg-[#c17f59] text-white'
                        : 'bg-[#c17f59]/10 text-maroon hover:bg-[#c17f59]/20'
                    }`}
                  >
                    <div className="font-bold text-lg">Priority</div>
                    <div className={`text-2xl font-serif ${client.rotation === RotationType.PRIORITY ? 'text-white' : ''}`}>8 weeks</div>
                    <div className={`text-sm mt-2 ${client.rotation === RotationType.PRIORITY ? 'text-white/70' : 'text-maroon/60'}`}>6-7 visits/year</div>
                  </button>
                  <button
                    onClick={() => setRotation(RotationType.STANDARD, 10)}
                    className={`p-6 rounded-xl text-left transition-all ${
                      client.rotation === RotationType.STANDARD
                        ? 'bg-[#7c9a7e] text-white'
                        : 'bg-[#7c9a7e]/10 text-maroon hover:bg-[#7c9a7e]/20'
                    }`}
                  >
                    <div className="font-bold text-lg">Standard</div>
                    <div className={`text-2xl font-serif ${client.rotation === RotationType.STANDARD ? 'text-white' : ''}`}>10 weeks</div>
                    <div className={`text-sm mt-2 ${client.rotation === RotationType.STANDARD ? 'text-white/70' : 'text-maroon/60'}`}>5-6 visits/year</div>
                  </button>
                  <button
                    onClick={() => setRotation(RotationType.FLEX, 12)}
                    className={`p-6 rounded-xl text-left transition-all ${
                      client.rotation === RotationType.FLEX
                        ? 'bg-[#b5a078] text-white'
                        : 'bg-[#b5a078]/10 text-maroon hover:bg-[#b5a078]/20'
                    }`}
                  >
                    <div className="font-bold text-lg">Flex</div>
                    <div className={`text-2xl font-serif ${client.rotation === RotationType.FLEX ? 'text-white' : ''}`}>12+ weeks</div>
                    <div className={`text-sm mt-2 ${client.rotation === RotationType.FLEX ? 'text-white/70' : 'text-maroon/60'}`}>4-5 visits/year</div>
                  </button>
                </div>
              </div>

              {/* Annual Projection */}
              <div className="bg-maroon text-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4">Annual Projection</h3>
                <div className="space-y-3 mb-6">
                  {client.baseService && (
                    <div className="flex justify-between">
                      <span className="text-white/70">{client.baseService.name} × {Math.round(52 / (client.rotationWeeks || 10))} visits</span>
                      <span className="font-bold">{formatCurrency(client.baseService.price * Math.round(52 / (client.rotationWeeks || 10)))}</span>
                    </div>
                  )}
                  {selectedAddOns.map(addon => {
                    const visits = addon.frequency === 'Every visit' ? 52 / (client.rotationWeeks || 10) :
                                   addon.frequency === 'Every other visit' ? 52 / (client.rotationWeeks || 10) / 2 :
                                   52 / (client.rotationWeeks || 10) / 4;
                    return (
                      <div key={addon.service.id} className="flex justify-between">
                        <span className="text-white/70">{addon.service.name} × {Math.round(visits)}</span>
                        <span className="font-bold">{formatCurrency(addon.service.price * Math.round(visits))}</span>
                      </div>
                    );
                  })}
                  {client.events?.filter(e => e.service).map((event, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-white/70">{event.name} ({event.service?.name})</span>
                      <span className="font-bold">{formatCurrency(event.service?.price || 0)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Annual Value</span>
                  <span className="text-3xl font-serif">{formatCurrency(client.annualValue || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 sm:px-6 py-3 text-maroon font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !client.name}
            className="btn-primary ml-auto px-8 py-4 bg-maroon text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 5 ? 'Save Client' : 'Continue'}
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
