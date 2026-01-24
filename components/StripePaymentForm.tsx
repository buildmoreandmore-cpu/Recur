import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, createPaymentIntent, isStripeConfigured } from '../lib/stripe';

interface StripePaymentFormProps {
  professionalId: string;
  amount: number;
  clientEmail: string;
  bookingRequestId?: string;
  paymentType?: 'deposit' | 'full';
  onSuccess: (paymentIntentId: string, cardLast4?: string) => void;
  onError: (error: string) => void;
  onSkip?: () => void;
}

const PaymentFormContent: React.FC<{
  amount: number;
  onSuccess: (paymentIntentId: string, cardLast4?: string) => void;
  onError: (error: string) => void;
  onSkip?: () => void;
  paymentIntentId: string;
}> = ({ amount, onSuccess, onError, onSkip, paymentIntentId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Card details will be retrieved by the webhook
        onSuccess(paymentIntentId, undefined);
      }
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p>Your card will be charged {formatCurrency(amount)} to secure your appointment.</p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full py-4 bg-maroon text-white rounded-2xl font-bold text-lg hover:bg-maroon/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            Processing...
          </>
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </button>

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          disabled={isProcessing}
          className="w-full py-3 text-maroon/60 hover:text-maroon font-medium text-sm transition-colors"
        >
          Skip for Now
        </button>
      )}

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <LockIcon />
        Secured by Stripe
      </p>
    </form>
  );
};

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  professionalId,
  amount,
  clientEmail,
  bookingRequestId,
  paymentType = 'deposit',
  onSuccess,
  onError,
  onSkip,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePayment();
  }, [professionalId, amount, clientEmail]);

  const initializePayment = async () => {
    if (!isStripeConfigured) {
      setError('Stripe is not configured');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resolvedPaymentType: 'deposit' | 'full' = paymentType === 'full' ? 'full' : 'deposit';
      const { data, error: createError } = await createPaymentIntent(
        professionalId,
        amount,
        clientEmail,
        bookingRequestId,
        resolvedPaymentType
      );

      if (createError) {
        setError(createError);
        onError(createError);
        return;
      }

      if (data) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      }
    } catch (err: any) {
      const message = err.message || 'Failed to initialize payment';
      setError(message);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isStripeConfigured) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <p>Payment processing is not available at this time.</p>
        </div>
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full py-4 bg-maroon text-white rounded-2xl font-bold text-lg hover:bg-maroon/90 transition-all"
          >
            Continue Without Payment
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="animate-spin w-8 h-8 border-3 border-slate-300 border-t-maroon rounded-full mb-4" />
          <p className="text-maroon/60">Preparing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <p>{error}</p>
        </div>
        <button
          onClick={initializePayment}
          className="w-full py-3 border-2 border-slate-200 text-maroon font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          Try Again
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full py-3 text-maroon/60 hover:text-maroon font-medium text-sm transition-colors"
          >
            Skip for Now
          </button>
        )}
      </div>
    );
  }

  if (!clientSecret || !paymentIntentId) {
    return null;
  }

  const stripePromise = getStripe();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#4a2c2a',
            colorBackground: '#ffffff',
            colorText: '#4a2c2a',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '12px',
          },
          rules: {
            '.Input': {
              border: '2px solid #e2e8f0',
              boxShadow: 'none',
            },
            '.Input:focus': {
              border: '2px solid #c17f59',
              boxShadow: 'none',
            },
          },
        },
      }}
    >
      <PaymentFormContent
        amount={amount * 100}
        onSuccess={onSuccess}
        onError={onError}
        onSkip={onSkip}
        paymentIntentId={paymentIntentId}
      />
    </Elements>
  );
};

const LockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export default StripePaymentForm;
