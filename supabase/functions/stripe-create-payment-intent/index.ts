import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create admin Supabase client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { professionalId, amount, clientEmail, bookingRequestId, paymentType = 'deposit' } = await req.json();

    if (!professionalId || !amount || !clientEmail) {
      throw new Error('Missing required fields: professionalId, amount, clientEmail');
    }

    // Get professional's Stripe account
    const { data: stripeAccount, error: accountError } = await supabaseAdmin
      .from('stripe_accounts')
      .select('stripe_account_id, charges_enabled')
      .eq('professional_id', professionalId)
      .single();

    if (accountError || !stripeAccount) {
      throw new Error('Professional does not have a connected Stripe account');
    }

    if (!stripeAccount.charges_enabled) {
      throw new Error('Professional\'s Stripe account cannot accept payments yet');
    }

    // Get professional info for payment description
    const { data: professional } = await supabaseAdmin
      .from('professionals')
      .select('name, business_name')
      .eq('id', professionalId)
      .single();

    const businessName = professional?.business_name || professional?.name || 'Service Provider';

    // Check for existing customer in connected account
    let customerId: string | undefined;
    const { data: existingCustomer } = await supabaseAdmin
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('professional_id', professionalId)
      .eq('client_email', clientEmail)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create customer in connected account
      const customer = await stripe.customers.create(
        {
          email: clientEmail,
          metadata: {
            professional_id: professionalId,
          },
        },
        {
          stripeAccount: stripeAccount.stripe_account_id,
        }
      );
      customerId = customer.id;

      // Save customer to database
      await supabaseAdmin
        .from('stripe_customers')
        .insert({
          professional_id: professionalId,
          client_email: clientEmail,
          stripe_customer_id: customerId,
        });
    }

    // Create PaymentIntent on connected account
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        description: `${paymentType === 'deposit' ? 'Deposit' : 'Payment'} for ${businessName}`,
        metadata: {
          professional_id: professionalId,
          booking_request_id: bookingRequestId || '',
          payment_type: paymentType,
          client_email: clientEmail,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        stripeAccount: stripeAccount.stripe_account_id,
      }
    );

    // Create payment record
    await supabaseAdmin
      .from('payments')
      .insert({
        booking_request_id: bookingRequestId || null,
        professional_id: professionalId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: Math.round(amount * 100),
        currency: 'usd',
        status: 'pending',
        payment_type: paymentType,
        client_email: clientEmail,
      });

    // Update booking request if provided
    if (bookingRequestId) {
      await supabaseAdmin
        .from('booking_requests')
        .update({
          stripe_payment_intent_id: paymentIntent.id,
          payment_status: 'pending',
        })
        .eq('id', bookingRequestId);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in stripe-create-payment-intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
