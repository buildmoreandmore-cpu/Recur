import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create admin Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(
          JSON.stringify({ error: 'Webhook signature verification failed' }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      // For development without webhook secret
      event = JSON.parse(body);
    }

    console.log('Processing webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);

        // Get payment method details
        let cardLast4: string | undefined;
        let cardBrand: string | undefined;

        if (paymentIntent.payment_method) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntent.payment_method as string,
              {},
              { stripeAccount: event.account }
            );
            if (paymentMethod.card) {
              cardLast4 = paymentMethod.card.last4;
              cardBrand = paymentMethod.card.brand;
            }
          } catch (e) {
            console.error('Error retrieving payment method:', e);
          }
        }

        // Update payment record
        const { error: paymentError } = await supabaseAdmin
          .from('payments')
          .update({
            status: 'succeeded',
            card_last4: cardLast4,
            card_brand: cardBrand,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentError) {
          console.error('Error updating payment:', paymentError);
        }

        // Update booking request if linked
        const bookingRequestId = paymentIntent.metadata?.booking_request_id;
        if (bookingRequestId) {
          const { error: bookingError } = await supabaseAdmin
            .from('booking_requests')
            .update({
              payment_status: 'paid',
              deposit_paid: true,
              card_last4: cardLast4,
            })
            .eq('id', bookingRequestId);

          if (bookingError) {
            console.error('Error updating booking request:', bookingError);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);

        // Update payment record
        const { error: paymentError } = await supabaseAdmin
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentError) {
          console.error('Error updating payment:', paymentError);
        }

        // Update booking request if linked
        const bookingRequestId = paymentIntent.metadata?.booking_request_id;
        if (bookingRequestId) {
          await supabaseAdmin
            .from('booking_requests')
            .update({ payment_status: 'failed' })
            .eq('id', bookingRequestId);
        }
        break;
      }

      case 'account.updated': {
        // Handle Connect account updates
        const account = event.data.object as Stripe.Account;
        console.log('Account updated:', account.id);

        const { error: updateError } = await supabaseAdmin
          .from('stripe_accounts')
          .update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
          })
          .eq('stripe_account_id', account.id);

        if (updateError) {
          console.error('Error updating Stripe account:', updateError);
        }
        break;
      }

      // Subscription events for platform billing
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id, subscription.status);

        const customerId = subscription.customer as string;

        // Find professional by customer ID
        const { data: professional } = await supabaseAdmin
          .from('professionals')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (professional) {
          await supabaseAdmin
            .from('professionals')
            .update({
              subscription_status: subscription.status,
              subscription_id: subscription.id,
              subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', professional.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);

        const customerId = subscription.customer as string;

        const { data: professional } = await supabaseAdmin
          .from('professionals')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (professional) {
          await supabaseAdmin
            .from('professionals')
            .update({
              subscription_status: 'canceled',
              subscription_id: null,
            })
            .eq('id', professional.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice paid:', invoice.id);
        // Subscription is automatically updated by Stripe
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', invoice.id);

        const customerId = invoice.customer as string;

        const { data: professional } = await supabaseAdmin
          .from('professionals')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (professional) {
          await supabaseAdmin
            .from('professionals')
            .update({
              subscription_status: 'past_due',
            })
            .eq('id', professional.id);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
