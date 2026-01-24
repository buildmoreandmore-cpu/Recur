import React, { useState, useEffect } from 'react';
import { StylistProfile, BookingSettings, BookingRequest, Service, IndustryType } from '../types';
import { LOGOS } from '../constants';
import { StripePaymentForm } from './StripePaymentForm';
import { getProfessionalStripeStatus } from '../lib/stripe';

interface ClientBookingFlowProps {
  profile: StylistProfile;
  bookingSettings: BookingSettings;
  professionalId: string;
  onSubmit: (request: BookingRequest) => void;
  onBack: () => void;
}

type BookingStep = 'about' | 'lifestyle' | 'goals' | 'appointment' | 'payment' | 'confirmation';

const REFERRAL_SOURCES = [
  'Instagram',
  'Facebook',
  'Google Search',
  'Referral from friend',
  'Yelp',
  'Walk-in',
  'Other',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ClientBookingFlow: React.FC<ClientBookingFlowProps> = ({
  profile,
  bookingSettings,
  professionalId,
  onSubmit,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('about');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<BookingRequest | null>(null);
  const [canAcceptPayments, setCanAcceptPayments] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | undefined>();

  // Check if professional can accept Stripe payments
  useEffect(() => {
    const checkStripeStatus = async () => {
      if (bookingSettings.requireDeposit && professionalId) {
        const status = await getProfessionalStripeStatus(professionalId);
        setCanAcceptPayments(status.canAcceptPayments);
        setStripeAccountId(status.stripeAccountId);
      }
    };
    checkStripeStatus();
  }, [professionalId, bookingSettings.requireDeposit]);

  // Form state
  const [formData, setFormData] = useState({
    // About You
    name: '',
    phone: '',
    email: '',
    referralSource: '',
    contactMethod: 'text',
    preferredDays: [] as string[],
    preferredTime: '',
    // Lifestyle
    occupation: '',
    upcomingEvents: '',
    morningTime: '',
    // Goals
    serviceGoal: '',
    maintenanceLevel: '',
    concerns: '',
    naturalColor: '',
    currentColor: '',
    // Appointment
    requestedService: null as Service | null,
    requestedAddOns: [] as Service[],
    requestedDate: '',
    requestedTimeSlot: '',
    additionalNotes: '',
    // Payment
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardZip: '',
    cardLast4: '',
    saveCard: true,
    payDeposit: false,
  });

  // Only show payment step if deposit is required AND professional can accept payments
  const showPaymentStep = bookingSettings.requireDeposit && canAcceptPayments;

  const steps: { id: BookingStep; label: string; number: number }[] = [
    { id: 'about', label: 'About You', number: 1 },
    { id: 'lifestyle', label: 'Your Lifestyle', number: 2 },
    { id: 'goals', label: 'Your Goals', number: 3 },
    { id: 'appointment', label: 'Appointment', number: 4 },
    ...(showPaymentStep
      ? [{ id: 'payment' as BookingStep, label: 'Payment', number: 5 }]
      : []),
  ];

  const totalSteps = steps.length;
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const toggleAddOn = (service: Service) => {
    setFormData((prev) => ({
      ...prev,
      requestedAddOns: prev.requestedAddOns.some((s) => s.id === service.id)
        ? prev.requestedAddOns.filter((s) => s.id !== service.id)
        : [...prev.requestedAddOns, service],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'about':
        return formData.name && formData.phone && formData.email && formData.contactMethod;
      case 'lifestyle':
        return true; // Optional fields
      case 'goals':
        return formData.serviceGoal; // At least main goal
      case 'appointment':
        return formData.requestedService && formData.requestedDate;
      case 'payment':
        return true; // Can skip
      default:
        return true;
    }
  };

  const nextStep = () => {
    const stepOrder: BookingStep[] = ['about', 'lifestyle', 'goals', 'appointment'];
    if (showPaymentStep) stepOrder.push('payment');
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    const stepOrder: BookingStep[] = ['about', 'lifestyle', 'goals', 'appointment'];
    if (showPaymentStep) stepOrder.push('payment');
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const request: BookingRequest = {
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      clientName: formData.name,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      referralSource: formData.referralSource,
      contactMethod: formData.contactMethod,
      preferredDays: formData.preferredDays,
      preferredTime: formData.preferredTime,
      occupation: formData.occupation,
      upcomingEvents: formData.upcomingEvents,
      morningTime: formData.morningTime,
      serviceGoal: formData.serviceGoal,
      maintenanceLevel: formData.maintenanceLevel,
      concerns: formData.concerns,
      naturalColor: formData.naturalColor,
      currentColor: formData.currentColor,
      requestedService: formData.requestedService,
      requestedAddOns: formData.requestedAddOns,
      requestedDate: formData.requestedDate,
      requestedTimeSlot: formData.requestedTimeSlot,
      additionalNotes: formData.additionalNotes,
      hasCardOnFile: !!formData.cardNumber,
      depositPaid: formData.payDeposit,
      cardLast4: formData.cardNumber ? formData.cardNumber.slice(-4) : undefined,
    };

    setSubmittedRequest(request);
    setCurrentStep('confirmation');
    setIsSubmitting(false);
    onSubmit(request);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMinDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + parseInt(bookingSettings.minimumLeadTime));
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(bookingSettings.maximumAdvanceBooking));
    return date.toISOString().split('T')[0];
  };

  const baseServices = profile.services.filter((s) => s.category === 'base');
  const addonServices = profile.services.filter((s) => s.category === 'addon');

  const getIndustryQuestions = () => {
    const industry = profile.industry || 'other';
    switch (industry) {
      case 'hair-stylist':
        return {
          lifestyle: [
            { field: 'occupation', label: 'What do you do for work?', placeholder: 'Marketing manager, nurse, student...' },
            { field: 'upcomingEvents', label: 'Any big events coming up this year?', placeholder: 'Wedding, vacation, photoshoot...' },
          ],
          morningTimeLabel: 'How much time do you spend on your hair each morning?',
          goals: [
            { field: 'serviceGoal', label: "What's your goal for your hair?", placeholder: 'More volume, cover grays, easier maintenance...', required: true },
            { field: 'naturalColor', label: 'What is your natural hair color?', placeholder: 'Dark brown, black, etc.' },
            { field: 'currentColor', label: 'Current color (if any)?', placeholder: 'Balayage, highlights, virgin hair...' },
          ],
          maintenanceLabel: 'Maintenance preference',
          concernsLabel: 'Anything to avoid or concerns?',
          concernsPlaceholder: 'Sensitive scalp, allergies, bad past experiences...',
        };
      case 'personal-trainer':
        return {
          lifestyle: [
            { field: 'occupation', label: 'What do you do for work?', placeholder: 'Office job, active work, student...' },
            { field: 'upcomingEvents', label: 'Any fitness goals or events?', placeholder: 'Marathon, wedding, health improvement...' },
          ],
          morningTimeLabel: 'How much time can you dedicate to workouts?',
          goals: [
            { field: 'serviceGoal', label: 'What are your fitness goals?', placeholder: 'Lose weight, build muscle, improve endurance...', required: true },
          ],
          maintenanceLabel: 'Workout frequency preference',
          concernsLabel: 'Any injuries or limitations?',
          concernsPlaceholder: 'Back issues, knee problems, medical conditions...',
        };
      case 'massage-therapist':
        return {
          lifestyle: [
            { field: 'occupation', label: 'What do you do for work?', placeholder: 'Desk job, physical labor, student...' },
            { field: 'upcomingEvents', label: 'What brings you in today?', placeholder: 'Stress relief, pain management, relaxation...' },
          ],
          morningTimeLabel: 'How active is your daily routine?',
          goals: [
            { field: 'serviceGoal', label: 'What areas need the most attention?', placeholder: 'Back, shoulders, full body...', required: true },
          ],
          maintenanceLabel: 'Pressure preference',
          concernsLabel: 'Any injuries or sensitive areas?',
          concernsPlaceholder: 'Recent surgery, pregnancy, skin conditions...',
        };
      default:
        return {
          lifestyle: [
            { field: 'occupation', label: 'What do you do for work?', placeholder: 'Your profession...' },
            { field: 'upcomingEvents', label: 'What brings you in?', placeholder: 'Your reason for booking...' },
          ],
          morningTimeLabel: 'How much time can you dedicate to this?',
          goals: [
            { field: 'serviceGoal', label: 'What are your main goals?', placeholder: 'Describe what you hope to achieve...', required: true },
          ],
          maintenanceLabel: 'Commitment level',
          concernsLabel: 'Anything we should know?',
          concernsPlaceholder: 'Any relevant information...',
        };
    }
  };

  const industryQuestions = getIndustryQuestions();

  // Confirmation screen
  if (currentStep === 'confirmation' && submittedRequest) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 py-4 flex justify-center">
            <div className="text-maroon opacity-60">
              <LOGOS.Main />
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-serif text-maroon mb-2">Request Submitted!</h1>
            <p className="text-maroon/60 mb-8">
              {profile.name?.split(' ')[0] || 'The professional'} will review your request and
              confirm your appointment soon.
            </p>

            {/* Request Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Requested
              </h3>
              <p className="font-bold text-maroon text-lg">
                {submittedRequest.requestedService?.name}
              </p>
              {submittedRequest.requestedAddOns.length > 0 && (
                <p className="text-maroon/60 text-sm">
                  + {submittedRequest.requestedAddOns.map((a) => a.name).join(', ')}
                </p>
              )}
              <p className="text-maroon/70 mt-2">
                {new Date(submittedRequest.requestedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                • {submittedRequest.requestedTimeSlot || 'Time TBD'}
              </p>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              You'll receive a confirmation via {submittedRequest.contactMethod}.
            </p>

            <button
              onClick={() => {
                // Generate calendar event (demo)
                alert(
                  'Demo: In production, this would add a tentative event to your calendar.'
                );
              }}
              className="w-full py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Add to Calendar (Tentative)
            </button>
          </div>

          <p className="text-slate-400 text-sm mt-8">
            Powered by{' '}
            <a href="/" className="text-maroon hover:underline font-medium">
              Recur
            </a>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevStep}
              className="text-maroon/60 hover:text-maroon transition-colors flex items-center gap-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <div className="text-maroon opacity-60">
              <LOGOS.Main />
            </div>
            <div className="w-16"></div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-maroon rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Step: About You */}
        {currentStep === 'about' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif text-maroon mb-2">About You</h1>
              <p className="text-maroon/60">Let's start with the basics</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors"
                placeholder="First and last name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                How did you hear about {profile.name?.split(' ')[0] || 'us'}?
              </label>
              <select
                value={formData.referralSource}
                onChange={(e) => updateFormData('referralSource', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors bg-white"
              >
                <option value="">Select one...</option>
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Preferred contact method *
              </label>
              <div className="flex gap-3">
                {['text', 'call', 'email'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => updateFormData('contactMethod', method)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.contactMethod === method
                        ? 'bg-maroon text-white'
                        : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Preferred days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      formData.preferredDays.includes(day)
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
              <label className="block text-sm font-bold text-maroon mb-2">
                Preferred time
              </label>
              <div className="flex gap-3">
                {['Morning', 'Midday', 'Evening'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateFormData('preferredTime', time)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.preferredTime === time
                        ? 'bg-maroon text-white'
                        : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Lifestyle */}
        {currentStep === 'lifestyle' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif text-maroon mb-2">Your Lifestyle</h1>
              <p className="text-maroon/60">Help us understand your needs</p>
            </div>

            {industryQuestions.lifestyle.map((q) => (
              <div key={q.field}>
                <label className="block text-sm font-bold text-maroon mb-2">
                  {q.label}
                </label>
                <input
                  type="text"
                  value={(formData as Record<string, unknown>)[q.field] as string || ''}
                  onChange={(e) => updateFormData(q.field, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors"
                  placeholder={q.placeholder}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                {industryQuestions.morningTimeLabel}
              </label>
              <div className="flex gap-3">
                {['5 min', '15 min', '30+ min'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateFormData('morningTime', time)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.morningTime === time
                        ? 'bg-maroon text-white'
                        : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Goals */}
        {currentStep === 'goals' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif text-maroon mb-2">Your Goals</h1>
              <p className="text-maroon/60">What are you hoping to achieve?</p>
            </div>

            {industryQuestions.goals.map((q) => (
              <div key={q.field}>
                <label className="block text-sm font-bold text-maroon mb-2">
                  {q.label} {q.required && '*'}
                </label>
                <textarea
                  value={(formData as Record<string, unknown>)[q.field] as string || ''}
                  onChange={(e) => updateFormData(q.field, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder={q.placeholder}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                {industryQuestions.maintenanceLabel}
              </label>
              <div className="flex gap-3">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateFormData('maintenanceLevel', level)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.maintenanceLevel === level
                        ? 'bg-maroon text-white'
                        : 'bg-slate-100 text-maroon hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                {industryQuestions.concernsLabel}
              </label>
              <textarea
                value={formData.concerns}
                onChange={(e) => updateFormData('concerns', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder={industryQuestions.concernsPlaceholder}
              />
            </div>
          </div>
        )}

        {/* Step: Appointment */}
        {currentStep === 'appointment' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif text-maroon mb-2">Book Your Appointment</h1>
              <p className="text-maroon/60">Select your service and preferred time</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Service you're interested in *
              </label>
              <div className="space-y-2">
                {baseServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => updateFormData('requestedService', service)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex justify-between items-center ${
                      formData.requestedService?.id === service.id
                        ? 'bg-maroon text-white'
                        : 'bg-slate-50 text-maroon hover:bg-slate-100 border-2 border-transparent'
                    }`}
                  >
                    <span className="font-medium">{service.name}</span>
                    <span className={formData.requestedService?.id === service.id ? 'text-white/80' : 'text-maroon/60'}>
                      {formatCurrency(service.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {addonServices.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-maroon mb-2">
                  Add-ons (optional)
                </label>
                <div className="space-y-2">
                  {addonServices.map((service) => {
                    const isSelected = formData.requestedAddOns.some((s) => s.id === service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleAddOn(service)}
                        className={`w-full p-4 rounded-xl text-left transition-all flex justify-between items-center ${
                          isSelected
                            ? 'bg-[#7c9a7e] text-white'
                            : 'bg-slate-50 text-maroon hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-white border-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-[#7c9a7e]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span className={isSelected ? 'text-white/80' : 'text-maroon/60'}>
                          +{formatCurrency(service.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Preferred date *
              </label>
              <input
                type="date"
                value={formData.requestedDate}
                onChange={(e) => updateFormData('requestedDate', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">
                Please allow at least {bookingSettings.minimumLeadTime} hours notice
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Preferred time
              </label>
              <select
                value={formData.requestedTimeSlot}
                onChange={(e) => updateFormData('requestedTimeSlot', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors bg-white"
              >
                <option value="">Select a time...</option>
                <optgroup label="Morning">
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                </optgroup>
                <optgroup label="Midday">
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                </optgroup>
                <optgroup label="Afternoon">
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="3:30 PM">3:30 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="4:30 PM">4:30 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                </optgroup>
                <optgroup label="Evening">
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="6:30 PM">6:30 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Anything else we should know?
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-maroon focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Any additional notes or requests..."
              />
            </div>

            {/* Summary */}
            {formData.requestedService && (
              <div className="bg-slate-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Appointment Summary
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-maroon">{formData.requestedService.name}</p>
                    {formData.requestedAddOns.length > 0 && (
                      <p className="text-sm text-maroon/60">
                        + {formData.requestedAddOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-maroon">
                    {formatCurrency(
                      formData.requestedService.price +
                        formData.requestedAddOns.reduce((sum, a) => sum + a.price, 0)
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Payment */}
        {currentStep === 'payment' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif text-maroon mb-2">Secure Your Appointment</h1>
              <p className="text-maroon/60">Pay the deposit to hold your appointment</p>
            </div>

            <StripePaymentForm
              professionalId={professionalId}
              amount={bookingSettings.depositAmount}
              clientEmail={formData.email}
              paymentType="deposit"
              onSuccess={(paymentIntentId, cardLast4) => {
                updateFormData('payDeposit', true);
                updateFormData('cardLast4', cardLast4 || '');
                // Submit the booking request after successful payment
                setIsSubmitting(true);
                const request: BookingRequest = {
                  id: `req-${Date.now()}`,
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                  clientName: formData.name,
                  clientPhone: formData.phone,
                  clientEmail: formData.email,
                  referralSource: formData.referralSource,
                  contactMethod: formData.contactMethod,
                  preferredDays: formData.preferredDays,
                  preferredTime: formData.preferredTime,
                  occupation: formData.occupation,
                  upcomingEvents: formData.upcomingEvents,
                  morningTime: formData.morningTime,
                  serviceGoal: formData.serviceGoal,
                  maintenanceLevel: formData.maintenanceLevel,
                  concerns: formData.concerns,
                  naturalColor: formData.naturalColor,
                  currentColor: formData.currentColor,
                  requestedService: formData.requestedService,
                  requestedAddOns: formData.requestedAddOns,
                  requestedDate: formData.requestedDate,
                  requestedTimeSlot: formData.requestedTimeSlot,
                  additionalNotes: formData.additionalNotes,
                  hasCardOnFile: true,
                  depositPaid: true,
                  cardLast4: cardLast4,
                };
                setSubmittedRequest(request);
                setCurrentStep('confirmation');
                setIsSubmitting(false);
                onSubmit(request);
              }}
              onError={(error) => {
                console.error('Payment failed:', error);
              }}
              onSkip={() => {
                // Allow skipping payment
                handleSubmit();
              }}
            />
          </div>
        )}

        {/* Navigation */}
        {currentStep !== 'confirmation' && (
          <div className="mt-10">
            <button
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className="w-full py-4 bg-maroon text-white rounded-2xl font-bold text-lg hover:bg-maroon/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : currentStepIndex === totalSteps - 1 ? (
                'Submit Request'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
