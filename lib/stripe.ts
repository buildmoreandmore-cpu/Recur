import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase, isSupabaseConfigured } from './supabase';
import type { StripeAccountStatus, CreatePaymentIntentResponse } from '../types';

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export const isStripeConfigured = !!stripePublishableKey;

// Get Supabase URL for Edge Functions
const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || '';
};

// ============ STRIPE CONNECT FUNCTIONS ============

/**
 * Get the current user's Stripe Connect account status
 */
export async function getStripeAccountStatus(): Promise<StripeAccountStatus> {
  if (!isSupabaseConfigured) {
    return {
      isConnected: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: false,
    };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        isConnected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      };
    }

    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-account-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to get Stripe account status:', response.statusText);
      return {
        isConnected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting Stripe account status:', error);
    return {
      isConnected: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: false,
    };
  }
}

/**
 * Start the Stripe Connect onboarding flow
 * Returns the URL to redirect the user to Stripe's hosted onboarding
 */
export async function startStripeOnboarding(): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase not configured' };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { url: null, error: 'Not authenticated' };
    }

    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-connect-onboard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/settings?tab=integrations&stripe=success`,
        refreshUrl: `${window.location.origin}/settings?tab=integrations&stripe=refresh`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { url: null, error: errorData.error || 'Failed to start onboarding' };
    }

    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error starting Stripe onboarding:', error);
    return { url: null, error: 'Failed to connect to Stripe' };
  }
}

/**
 * Disconnect the Stripe Connect account
 */
export async function disconnectStripeAccount(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase not configured' };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || 'Failed to disconnect' };
    }

    return { error: null };
  } catch (error) {
    console.error('Error disconnecting Stripe account:', error);
    return { error: 'Failed to disconnect Stripe account' };
  }
}

// ============ PAYMENT FUNCTIONS ============

/**
 * Create a PaymentIntent for collecting a deposit
 * This is called by the booking flow when the client is ready to pay
 */
export async function createPaymentIntent(
  professionalId: string,
  amount: number,
  clientEmail: string,
  bookingRequestId?: string,
  paymentType: 'deposit' | 'full' = 'deposit'
): Promise<{ data: CreatePaymentIntentResponse | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        professionalId,
        amount,
        clientEmail,
        bookingRequestId,
        paymentType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.error || 'Failed to create payment' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { data: null, error: 'Failed to process payment' };
  }
}

/**
 * Get the Stripe account status for a professional (public - used in booking flow)
 * Returns whether the professional can accept payments
 */
export async function getProfessionalStripeStatus(professionalId: string): Promise<{
  canAcceptPayments: boolean;
  stripeAccountId?: string;
}> {
  if (!isSupabaseConfigured) {
    return { canAcceptPayments: false };
  }

  try {
    const response = await fetch(
      `${getSupabaseUrl()}/functions/v1/stripe-account-status?professionalId=${professionalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { canAcceptPayments: false };
    }

    const data = await response.json();
    return {
      canAcceptPayments: data.chargesEnabled && data.detailsSubmitted,
      stripeAccountId: data.accountId,
    };
  } catch (error) {
    console.error('Error getting professional Stripe status:', error);
    return { canAcceptPayments: false };
  }
}

// ============ SUBSCRIPTION FUNCTIONS ============

/**
 * Create a Stripe Checkout session for subscription
 * @param trialDays - Number of trial days (e.g., 14 for onboarding)
 * @param successUrl - Custom success URL
 * @param cancelUrl - Custom cancel URL
 */
export async function createCheckoutSession(
  trialDays?: number,
  successUrl?: string,
  cancelUrl?: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase not configured' };
  }

  try {
    // Refresh session to ensure valid token
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
    if (sessionError || !session) {
      // Fallback to getting current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.error('No session found:', sessionError);
        return { url: null, error: 'Not authenticated - please sign in again' };
      }
    }

    const activeSession = session || (await supabase.auth.getSession()).data.session;
    if (!activeSession) {
      return { url: null, error: 'Not authenticated' };
    }

    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-create-checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeSession.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        successUrl: successUrl || `${window.location.origin}/settings?tab=billing&success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/settings?tab=billing&canceled=true`,
        trialDays,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { url: null, error: errorData.error || 'Failed to create checkout session' };
    }

    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { url: null, error: 'Failed to start checkout' };
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createCustomerPortalSession(): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase not configured' };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { url: null, error: 'Not authenticated' };
    }

    const response = await fetch(`${getSupabaseUrl()}/functions/v1/stripe-customer-portal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/settings?tab=billing`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { url: null, error: errorData.error || 'Failed to open billing portal' };
    }

    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return { url: null, error: 'Failed to open billing portal' };
  }
}
