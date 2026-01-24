import React, { useState, useEffect } from 'react';
import { getStripeAccountStatus, startStripeOnboarding, isStripeConfigured } from '../lib/stripe';
import type { StripeAccountStatus } from '../types';

interface StripeConnectSectionProps {
  onStatusChange?: (status: StripeAccountStatus) => void;
}

export const StripeConnectSection: React.FC<StripeConnectSectionProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<StripeAccountStatus>({
    isConnected: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();

    // Check URL params for Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    const stripeParam = urlParams.get('stripe');
    if (stripeParam === 'success' || stripeParam === 'refresh') {
      // Refresh status after returning from Stripe
      loadStatus();
      // Clean up URL
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const loadStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accountStatus = await getStripeAccountStatus();
      setStatus(accountStatus);
      onStatusChange?.(accountStatus);
    } catch (err) {
      console.error('Error loading Stripe status:', err);
      setError('Failed to load Stripe account status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const { url, error: connectError } = await startStripeOnboarding();
      if (connectError) {
        setError(connectError);
        return;
      }
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Error starting Stripe onboarding:', err);
      setError('Failed to connect to Stripe');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinueOnboarding = async () => {
    // Same as connect - will generate a new onboarding link
    await handleConnect();
  };

  if (!isStripeConfigured) {
    return (
      <div className="p-4 border-2 border-slate-200 rounded-xl opacity-60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <StripeIcon />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-maroon">Stripe</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-500">
                Not Configured
              </span>
            </div>
            <p className="text-sm text-slate-500">Stripe publishable key not configured.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 border-2 border-slate-200 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#635BFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <StripeIcon />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-maroon">Stripe</h4>
            <p className="text-sm text-slate-500">Loading account status...</p>
          </div>
          <div className="animate-spin w-5 h-5 border-2 border-slate-300 border-t-[#635BFF] rounded-full" />
        </div>
      </div>
    );
  }

  // Connected and fully set up
  if (status.isConnected && status.chargesEnabled && status.detailsSubmitted) {
    return (
      <div className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-maroon">Stripe</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white">
                Connected
              </span>
            </div>
            <p className="text-sm text-emerald-700">
              You can collect payments from clients.
              {status.payoutsEnabled ? ' Payouts are enabled.' : ' Complete payout setup in Stripe Dashboard.'}
            </p>
          </div>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium text-sm transition-colors"
          >
            Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Connected but setup incomplete
  if (status.isConnected && !status.detailsSubmitted) {
    return (
      <div className="p-4 border-2 border-amber-200 bg-amber-50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-maroon">Stripe</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">
                Setup Incomplete
              </span>
            </div>
            <p className="text-sm text-amber-700">
              Complete your Stripe account setup to accept payments.
            </p>
          </div>
          <button
            onClick={handleContinueOnboarding}
            disabled={isConnecting}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {isConnecting ? 'Loading...' : 'Continue Setup'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  // Not connected
  return (
    <div className="p-4 border-2 border-slate-200 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#635BFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <StripeIcon />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-maroon">Stripe</h4>
          <p className="text-sm text-slate-500">Collect deposits when clients book with you.</p>
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-[#635BFF] text-white rounded-xl font-medium text-sm hover:bg-[#5046e5] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Connecting...
            </>
          ) : (
            'Connect Stripe'
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
};

const StripeIcon = () => (
  <svg className="w-6 h-6 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
  </svg>
);

export default StripeConnectSection;
