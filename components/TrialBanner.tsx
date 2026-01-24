import React, { useState } from 'react';
import { createCheckoutSession } from '../lib/stripe';

interface TrialBannerProps {
  trialEndsAt?: string;
  subscriptionStatus?: string;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ trialEndsAt, subscriptionStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Don't show if user has active subscription
  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    return null;
  }

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!trialEndsAt) return 0;
    const now = new Date();
    const end = new Date(trialEndsAt);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = daysRemaining === 0;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { url, error } = await createCheckoutSession();
      if (error) {
        console.error('Checkout error:', error);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isExpired) {
    return null; // Paywall will handle expired trials
  }

  // Show trial countdown banner
  return (
    <div className={`px-4 py-2 text-center text-sm font-medium ${
      daysRemaining <= 3
        ? 'bg-amber-500 text-white'
        : 'bg-blue-500 text-white'
    }`}>
      <span>
        {daysRemaining === 1
          ? '1 day left in your free trial'
          : `${daysRemaining} days left in your free trial`}
      </span>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="ml-3 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
      >
        {isLoading ? '...' : 'Subscribe Now'}
      </button>
    </div>
  );
};

interface PaywallProps {
  onSubscribe: () => void;
  isLoading: boolean;
}

export const Paywall: React.FC<PaywallProps> = ({ onSubscribe, isLoading }) => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-serif text-maroon mb-2">Your Free Trial Has Ended</h1>
        <p className="text-maroon/60 mb-8">
          Subscribe to Recur Pro to continue managing your clients, bookings, and revenue.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
          <p className="text-4xl font-serif text-maroon mb-1">$29<span className="text-lg font-normal text-maroon/60">/month</span></p>
          <p className="text-sm text-maroon/60">Cancel anytime</p>
        </div>

        <ul className="text-left space-y-3 mb-8">
          <li className="flex items-center gap-3 text-maroon">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited clients
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

        <button
          onClick={onSubscribe}
          disabled={isLoading}
          className="w-full py-4 bg-maroon text-white rounded-2xl font-bold text-lg hover:bg-maroon/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Subscribe to Recur Pro'}
        </button>

        <p className="text-xs text-slate-400 mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default TrialBanner;
