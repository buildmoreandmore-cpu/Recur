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

    const url = new URL(req.url);
    const professionalId = url.searchParams.get('professionalId');

    let targetProfessionalId: string;
    let supabaseClient;

    if (professionalId) {
      // Public request - use service role to bypass RLS
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      targetProfessionalId = professionalId;
    } else {
      // Authenticated request - use user's auth
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
      );
      // Authenticated request - get current user's professional profile
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('Missing authorization header');
      }

      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      const { data: professional, error: profError } = await supabaseClient
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profError || !professional) {
        throw new Error('Professional profile not found');
      }

      targetProfessionalId = professional.id;
    }

    // Get Stripe account from database
    const { data: stripeAccount, error: accountError } = await supabaseClient
      .from('stripe_accounts')
      .select('*')
      .eq('professional_id', targetProfessionalId)
      .single();

    if (accountError || !stripeAccount) {
      // No account connected
      return new Response(
        JSON.stringify({
          isConnected: false,
          chargesEnabled: false,
          payoutsEnabled: false,
          detailsSubmitted: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get latest status from Stripe
    try {
      const account = await stripe.accounts.retrieve(stripeAccount.stripe_account_id);

      // Update database with latest status
      const { error: updateError } = await supabaseClient
        .from('stripe_accounts')
        .update({
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
        })
        .eq('professional_id', targetProfessionalId);

      if (updateError) {
        console.error('Error updating Stripe account status:', updateError);
      }

      return new Response(
        JSON.stringify({
          isConnected: true,
          accountId: stripeAccount.stripe_account_id,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          detailsSubmitted: account.details_submitted,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (stripeError) {
      console.error('Error retrieving Stripe account:', stripeError);
      // Return cached status from database
      return new Response(
        JSON.stringify({
          isConnected: true,
          accountId: stripeAccount.stripe_account_id,
          chargesEnabled: stripeAccount.charges_enabled,
          payoutsEnabled: stripeAccount.payouts_enabled,
          detailsSubmitted: stripeAccount.details_submitted,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error('Error in stripe-account-status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
