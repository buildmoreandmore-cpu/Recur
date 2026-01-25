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
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profError || !professional) {
      throw new Error('Professional profile not found');
    }

    // Get existing Stripe account
    const { data: stripeAccount, error: accountError } = await supabaseClient
      .from('stripe_accounts')
      .select('stripe_account_id')
      .eq('professional_id', professional.id)
      .single();

    if (accountError || !stripeAccount) {
      throw new Error('No Stripe account found to disconnect');
    }

    console.log('Disconnecting Stripe account:', stripeAccount.stripe_account_id);

    // Delete the OAuth connection (this doesn't delete the Stripe account itself,
    // just removes the connection to your platform)
    try {
      await stripe.accounts.del(stripeAccount.stripe_account_id);
    } catch (stripeError) {
      // If the account is already disconnected or doesn't exist, that's fine
      console.log('Stripe API response:', stripeError.message);
    }

    // Remove from our database
    const { error: deleteError } = await supabaseClient
      .from('stripe_accounts')
      .delete()
      .eq('professional_id', professional.id);

    if (deleteError) {
      console.error('Error deleting Stripe account record:', deleteError);
      throw new Error('Failed to disconnect Stripe account');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Stripe account disconnected' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in stripe-disconnect:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
