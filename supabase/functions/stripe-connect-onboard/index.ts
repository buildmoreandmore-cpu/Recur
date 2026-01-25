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

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    // Get professional profile
    const { data: professional, error: profError } = await supabaseClient
      .from('professionals')
      .select('id, email, name, business_name')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      console.error('Professional lookup failed:', profError);
      throw new Error('Professional profile not found');
    }

    console.log('Found professional:', professional.id, professional.email);

    const { returnUrl, refreshUrl } = await req.json();

    // Check if account already exists
    const { data: existingAccount } = await supabaseClient
      .from('stripe_accounts')
      .select('stripe_account_id')
      .eq('professional_id', professional.id)
      .single();

    let stripeAccountId: string;

    if (existingAccount?.stripe_account_id) {
      // Use existing account
      console.log('Using existing Stripe account:', existingAccount.stripe_account_id);
      stripeAccountId = existingAccount.stripe_account_id;
    } else {
      // Create new Stripe Connect Standard account
      console.log('Creating new Stripe account for:', professional.email);
      const account = await stripe.accounts.create({
        type: 'standard',
        email: professional.email,
        metadata: {
          professional_id: professional.id,
          supabase_user_id: user.id,
        },
      });

      stripeAccountId = account.id;

      // Save to database
      const { error: insertError } = await supabaseClient
        .from('stripe_accounts')
        .insert({
          professional_id: professional.id,
          stripe_account_id: stripeAccountId,
          charges_enabled: false,
          payouts_enabled: false,
          details_submitted: false,
        });

      if (insertError) {
        console.error('Error saving Stripe account:', insertError);
        // Don't throw - account was created in Stripe, we can still proceed
      }
    }

    // Create account link for onboarding
    // Ensure URLs use HTTPS for live mode
    const ensureHttps = (url: string) => url.replace(/^http:/, 'https:');
    const finalRefreshUrl = ensureHttps(refreshUrl || `${req.headers.get('origin')}/settings?tab=integrations&stripe=refresh`);
    const finalReturnUrl = ensureHttps(returnUrl || `${req.headers.get('origin')}/settings?tab=integrations&stripe=success`);

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: finalRefreshUrl,
      return_url: finalReturnUrl,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in stripe-connect-onboard:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
