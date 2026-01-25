import React, { useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateComparisonSchema,
  injectSchema,
  removeSchema
} from './schemaHelpers';
import { INDUSTRY_CONFIGS } from './IndustryLandingPage';

export interface ComparisonConfig {
  slug: string;
  competitorName: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  whySwitch: {
    title: string;
    description: string;
  }[];
  comparisonTable: {
    feature: string;
    recur: string | boolean;
    competitor: string | boolean;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Comparison configurations
export const COMPARISON_CONFIGS: Record<string, ComparisonConfig> = {
  'acuity-scheduling': {
    slug: 'acuity-scheduling',
    competitorName: 'Acuity Scheduling',
    title: 'Acuity Scheduling Alternative | Recur vs Acuity',
    metaDescription: 'Looking for an Acuity Scheduling alternative? Recur offers deposit collection, revenue forecasting, and client rotation tracking. Compare features and pricing.',
    h1: 'Acuity Scheduling Alternative',
    heroSubtitle: 'Recur is built specifically for service professionals with recurring clients. Compare Acuity Scheduling vs Recur and see why independent professionals are switching.',
    whySwitch: [
      { title: 'Built for recurring clients', description: 'Acuity treats every booking the same. Recur understands that your regulars are your business—track rotation schedules, predict rebooking, and never lose a client.' },
      { title: 'Revenue forecasting included', description: 'See your projected income based on client rotation patterns. Know what next month looks like before it happens.' },
      { title: 'Deposit collection that works', description: 'Collect deposits seamlessly through Stripe. Payments go directly to your account with lower fees than Acuity\'s payment processing.' },
      { title: 'Simpler pricing', description: 'No complicated tiers or hidden fees. One plan with everything you need to run your service business.' }
    ],
    comparisonTable: [
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: false },
      { feature: 'Overdue client alerts', recur: true, competitor: false },
      { feature: 'Online booking page', recur: true, competitor: true },
      { feature: 'Stripe integration', recur: 'Direct (lower fees)', competitor: 'Via Square' },
      { feature: 'Calendar sync', recur: 'Coming soon', competitor: true },
      { feature: 'Starting price', recur: '$19/mo', competitor: '$20/mo' }
    ],
    faqs: [
      { question: 'Can I import my clients from Acuity?', answer: 'Yes. Export your client list from Acuity as a CSV and import it into Recur. We\'ll help you set up rotation schedules for your recurring clients.' },
      { question: 'Does Recur have all the features Acuity has?', answer: 'Recur focuses on what service professionals with recurring clients need most: deposits, revenue forecasting, and client management. We don\'t have some features like classes or group booking.' },
      { question: 'What about calendar integrations?', answer: 'Calendar sync with Google and Apple Calendar is coming soon. For now, Recur provides its own scheduling system.' }
    ]
  },
  'calendly': {
    slug: 'calendly',
    competitorName: 'Calendly',
    title: 'Calendly Alternative for Service Businesses | Recur vs Calendly',
    metaDescription: 'Need a Calendly alternative for your service business? Recur offers deposit collection, revenue forecasting, and recurring client management. Built for professionals.',
    h1: 'Calendly Alternative for Service Businesses',
    heroSubtitle: 'Calendly is great for meetings. Recur is built for service professionals who need to collect deposits, track recurring clients, and forecast revenue.',
    whySwitch: [
      { title: 'Collect deposits, not just bookings', description: 'Calendly is designed for scheduling meetings. Recur lets you collect deposits when clients book, protecting your income from no-shows.' },
      { title: 'Track recurring clients', description: 'Know which clients come every 4 weeks vs every 8 weeks. Get alerts when regulars are overdue for their next appointment.' },
      { title: 'Forecast your revenue', description: 'See projected income based on your client base. Plan your business with confidence instead of guessing.' },
      { title: 'Built for service professionals', description: 'Hair stylists, trainers, massage therapists—Recur understands your business model.' }
    ],
    comparisonTable: [
      { feature: 'Deposit collection', recur: true, competitor: 'Paid add-on' },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: false },
      { feature: 'Service menu', recur: true, competitor: 'Limited' },
      { feature: 'Online booking page', recur: true, competitor: true },
      { feature: 'Stripe payments', recur: 'Direct integration', competitor: 'Via Stripe' },
      { feature: 'Team scheduling', recur: 'Solo-focused', competitor: true },
      { feature: 'Starting price', recur: '$19/mo', competitor: '$12/mo' }
    ],
    faqs: [
      { question: 'Is Recur more expensive than Calendly?', answer: 'Recur starts at $19/mo compared to Calendly\'s $12/mo basic plan. However, Calendly\'s payment collection requires their $20/mo plan, making Recur competitive when you need deposits.' },
      { question: 'Can Calendly track recurring clients?', answer: 'Calendly treats every booking as a one-time event. Recur tracks client patterns, rotation schedules, and alerts you when regulars are overdue.' },
      { question: 'What if I just need simple scheduling?', answer: 'If you don\'t have recurring clients or need deposits, Calendly might be sufficient. Recur is designed for service professionals with repeat business.' }
    ]
  },
  'vagaro': {
    slug: 'vagaro',
    competitorName: 'Vagaro',
    title: 'Vagaro Alternative | Recur vs Vagaro for Independent Professionals',
    metaDescription: 'Looking for a Vagaro alternative without the complexity? Recur offers simple booking, deposits, and revenue forecasting for independent service professionals.',
    h1: 'Vagaro Alternative for Independent Professionals',
    heroSubtitle: 'Vagaro is built for salons and spas. Recur is built for independent professionals who want simplicity without sacrificing powerful features.',
    whySwitch: [
      { title: 'Simpler interface', description: 'Vagaro has hundreds of features you\'ll never use. Recur focuses on what independent professionals actually need: booking, deposits, and client management.' },
      { title: 'No marketplace fees', description: 'Vagaro\'s marketplace takes a cut when clients find you there. With Recur, all payments go directly to your Stripe account.' },
      { title: 'Revenue forecasting built-in', description: 'See your projected income based on client rotations. Vagaro requires expensive add-ons for business insights.' },
      { title: 'Transparent pricing', description: 'One simple price. No add-ons, no transaction fees on card-on-file, no surprises.' }
    ],
    comparisonTable: [
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Revenue forecasting', recur: true, competitor: 'Paid add-on' },
      { feature: 'Client rotation tracking', recur: true, competitor: 'Limited' },
      { feature: 'Marketplace listing', recur: false, competitor: true },
      { feature: 'POS system', recur: false, competitor: true },
      { feature: 'Payment processing fees', recur: 'Stripe rates', competitor: '2.75%+' },
      { feature: 'Payroll', recur: false, competitor: 'Paid add-on' },
      { feature: 'Starting price', recur: '$19/mo', competitor: '$30/mo' }
    ],
    faqs: [
      { question: 'Is Recur cheaper than Vagaro?', answer: 'Yes. Vagaro starts at $30/month and many features require add-ons. Recur is $19/month with everything included.' },
      { question: 'What about the Vagaro marketplace?', answer: 'Vagaro\'s marketplace can bring new clients but takes a fee. Recur helps you build your own client base through your booking page and referrals.' },
      { question: 'Does Recur have a POS system?', answer: 'No. Recur focuses on booking and client management. If you need point-of-sale features, Vagaro or Square might be better fits.' }
    ]
  },
  'square-appointments': {
    slug: 'square-appointments',
    competitorName: 'Square Appointments',
    title: 'Square Appointments Alternative | Recur vs Square',
    metaDescription: 'Need a Square Appointments alternative with better client management? Recur offers revenue forecasting, client rotation tracking, and deposit collection.',
    h1: 'Square Appointments Alternative',
    heroSubtitle: 'Square Appointments is free to start but limited on features. Recur helps service professionals forecast revenue and manage recurring clients.',
    whySwitch: [
      { title: 'Revenue forecasting', description: 'Square shows you what happened. Recur shows you what\'s coming—projected income based on your client rotation patterns.' },
      { title: 'Client rotation tracking', description: 'Know when each client is due for their next appointment. Get alerts when regulars are overdue.' },
      { title: 'Deposit flexibility', description: 'Set deposit amounts by service, percentage, or flat rate. More control than Square\'s basic deposit options.' },
      { title: 'Lower payment processing', description: 'Stripe\'s rates are often lower than Square\'s 2.6% + $0.10 per transaction.' }
    ],
    comparisonTable: [
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: false },
      { feature: 'Free tier available', recur: 'Free trial', competitor: true },
      { feature: 'POS integration', recur: false, competitor: true },
      { feature: 'Payment processing', recur: 'Stripe', competitor: 'Square only' },
      { feature: 'Contract/no-show protection', recur: true, competitor: 'Limited' },
      { feature: 'Starting price', recur: '$19/mo', competitor: 'Free (limited)' }
    ],
    faqs: [
      { question: 'Is Square Appointments really free?', answer: 'The free plan is limited to one user and basic features. To get deposits, no-show protection, and team features, you need the Plus plan at $29/month.' },
      { question: 'Can I use a different payment processor?', answer: 'Square Appointments requires Square for payments. Recur uses Stripe, which often has lower rates and is more widely accepted.' },
      { question: 'What about Square POS?', answer: 'If you need point-of-sale hardware integration, Square is a better fit. Recur focuses on service professionals who primarily need booking and client management.' }
    ]
  },
  'fresha': {
    slug: 'fresha',
    competitorName: 'Fresha',
    title: 'Fresha Alternative | Recur vs Fresha for Service Professionals',
    metaDescription: 'Looking for a Fresha alternative? Recur offers deposit collection, revenue forecasting, and client management without marketplace commissions.',
    h1: 'Fresha Alternative Without Commissions',
    heroSubtitle: 'Fresha is "free" but takes a cut of marketplace bookings. Recur is straightforward pricing with no commissions on any bookings.',
    whySwitch: [
      { title: 'No marketplace commissions', description: 'Fresha charges 20% on new client bookings from their marketplace. With Recur, 100% of your revenue stays yours.' },
      { title: 'Revenue forecasting', description: 'See projected income based on your recurring clients. Plan your business instead of hoping for the best.' },
      { title: 'Client rotation tracking', description: 'Know which clients are due when. Fresha treats every booking as a new transaction.' },
      { title: 'Transparent pricing', description: 'Pay $19/month. No hidden fees, no commissions, no surprises on your invoice.' }
    ],
    comparisonTable: [
      { feature: 'Base software cost', recur: '$19/mo', competitor: 'Free' },
      { feature: 'Marketplace commission', recur: 'None', competitor: '20% on new clients' },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: false },
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Payment processing fees', recur: 'Stripe rates', competitor: '2.19% + $0.20' },
      { feature: 'Inventory management', recur: false, competitor: true },
      { feature: 'Marketplace exposure', recur: false, competitor: true }
    ],
    faqs: [
      { question: 'Is Fresha really free?', answer: 'The software is free, but Fresha takes 20% commission on bookings from their marketplace. They also charge for payment processing and optional add-ons.' },
      { question: 'What about getting new clients from the marketplace?', answer: 'Fresha\'s marketplace can bring new clients, but at 20% commission. Recur helps you build your own client base through your booking page, social media, and referrals.' },
      { question: 'Does Recur have inventory management?', answer: 'No. Recur focuses on booking and client management. If you sell significant retail products, Fresha or a dedicated retail system might be better.' }
    ]
  },
  'booksy': {
    slug: 'booksy',
    competitorName: 'Booksy',
    title: 'Booksy Alternative Without Commission | Recur vs Booksy',
    metaDescription: 'Need a Booksy alternative without commissions? Recur offers booking, deposits, and revenue forecasting with straightforward pricing.',
    h1: 'Booksy Alternative Without Commission',
    heroSubtitle: 'Booksy charges commissions on marketplace bookings. Recur offers powerful features with transparent, commission-free pricing.',
    whySwitch: [
      { title: 'No commission on bookings', description: 'Booksy takes a cut of marketplace bookings. Recur charges a flat monthly fee—your revenue is yours.' },
      { title: 'Revenue forecasting', description: 'Predict your income based on client rotation patterns. Know what\'s coming before it arrives.' },
      { title: 'Client-focused features', description: 'Track rotation schedules, get overdue alerts, and never lose a regular client.' },
      { title: 'Simpler pricing', description: 'One price, all features. No marketplace fees, no surprise charges.' }
    ],
    comparisonTable: [
      { feature: 'Monthly subscription', recur: '$19/mo', competitor: '$29.99/mo' },
      { feature: 'Marketplace commission', recur: 'None', competitor: 'Yes (varies)' },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: 'Limited' },
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Marketplace listing', recur: false, competitor: true },
      { feature: 'Social media booking', recur: 'Via link', competitor: true },
      { feature: 'Message blast', recur: 'Coming soon', competitor: true }
    ],
    faqs: [
      { question: 'Is Booksy more expensive than Recur?', answer: 'Booksy starts at $29.99/month plus commissions on marketplace bookings. Recur is $19/month with no commissions.' },
      { question: 'What about Booksy\'s marketplace?', answer: 'Booksy\'s marketplace can bring new clients but charges commission. Recur helps you build your own client base through your booking link.' },
      { question: 'Does Recur have marketing features?', answer: 'Recur focuses on client management and forecasting. Message blasts and marketing features are coming soon.' }
    ]
  },
  'mindbody': {
    slug: 'mindbody',
    competitorName: 'Mindbody',
    title: 'Mindbody Alternative | Cheaper Booking Software for Independents',
    metaDescription: 'Looking for a cheaper Mindbody alternative? Recur offers booking, deposits, and revenue forecasting at a fraction of the cost. Built for independent professionals.',
    h1: 'Mindbody Alternative for Independents',
    heroSubtitle: 'Mindbody is powerful but expensive and complex. Recur gives independent service professionals what they need without the enterprise price tag.',
    whySwitch: [
      { title: 'Fraction of the cost', description: 'Mindbody starts at $139/month. Recur is $19/month. That\'s $1,440/year back in your pocket.' },
      { title: 'Built for independents', description: 'Mindbody is designed for studios and gyms. Recur is designed for solo professionals and small teams.' },
      { title: 'Simple to use', description: 'No training required. Recur is intuitive from day one, not a complex system to master.' },
      { title: 'Revenue forecasting included', description: 'See projected income without paying for Mindbody\'s expensive analytics add-ons.' }
    ],
    comparisonTable: [
      { feature: 'Monthly price', recur: '$19/mo', competitor: '$139+/mo' },
      { feature: 'Revenue forecasting', recur: true, competitor: 'Paid add-on' },
      { feature: 'Client rotation tracking', recur: true, competitor: 'Limited' },
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Class scheduling', recur: false, competitor: true },
      { feature: 'Membership management', recur: false, competitor: true },
      { feature: 'Marketplace listing', recur: false, competitor: true },
      { feature: 'Setup complexity', recur: 'Simple', competitor: 'Complex' }
    ],
    faqs: [
      { question: 'Why is Mindbody so expensive?', answer: 'Mindbody is built for studios, gyms, and spas with complex needs like class scheduling, memberships, and staff management. If you\'re independent, you\'re paying for features you don\'t need.' },
      { question: 'What features does Recur not have?', answer: 'Recur doesn\'t have class scheduling, membership management, or marketplace listings. If you run group classes, Mindbody might be necessary.' },
      { question: 'Can I switch from Mindbody to Recur?', answer: 'Yes. Export your client list and import it into Recur. We\'ll help you set up rotation schedules for your recurring clients.' }
    ]
  },
  'schedulicity': {
    slug: 'schedulicity',
    competitorName: 'Schedulicity',
    title: 'Schedulicity Alternative | Recur vs Schedulicity',
    metaDescription: 'Need a Schedulicity alternative? Recur offers revenue forecasting, client rotation tracking, and deposits. Compare features and pricing.',
    h1: 'Schedulicity Alternative',
    heroSubtitle: 'Schedulicity is a solid booking tool. Recur goes further with revenue forecasting and client rotation tracking for service professionals.',
    whySwitch: [
      { title: 'Revenue forecasting', description: 'See projected income based on your recurring clients. Schedulicity only shows past performance.' },
      { title: 'Client rotation tracking', description: 'Know when each client is due for their next appointment. Get alerts when regulars go overdue.' },
      { title: 'Modern interface', description: 'Recur\'s clean, intuitive design makes managing your business a pleasure, not a chore.' },
      { title: 'Transparent pricing', description: 'One plan with everything included. No feature tiers or confusing pricing.' }
    ],
    comparisonTable: [
      { feature: 'Monthly price', recur: '$19/mo', competitor: '$34.99/mo' },
      { feature: 'Revenue forecasting', recur: true, competitor: false },
      { feature: 'Client rotation tracking', recur: true, competitor: false },
      { feature: 'Deposit collection', recur: true, competitor: true },
      { feature: 'Marketing tools', recur: 'Basic', competitor: true },
      { feature: 'Class scheduling', recur: false, competitor: true },
      { feature: 'Gift certificates', recur: 'Coming soon', competitor: true },
      { feature: 'Free tier', recur: 'Free trial', competitor: true }
    ],
    faqs: [
      { question: 'Is Recur cheaper than Schedulicity?', answer: 'Yes. Schedulicity\'s Unlimited plan is $34.99/month. Recur is $19/month with revenue forecasting and client rotation tracking included.' },
      { question: 'Does Recur have class scheduling?', answer: 'No. Recur is focused on one-on-one service appointments. If you run group classes, Schedulicity might be a better fit.' },
      { question: 'What about Schedulicity\'s marketplace?', answer: 'Schedulicity\'s marketplace can bring new clients. Recur helps you build your own client base through your booking page and social media.' }
    ]
  }
};

interface ComparisonPageProps {
  competitorSlug: string;
  onSignUp: () => void;
  onDemo: () => void;
  onBack: () => void;
  onNavigateToIndustry?: (slug: string) => void;
  onNavigateToComparison?: (slug: string) => void;
}

const CheckIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>Feature available</title>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <title>Feature not available</title>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  competitorSlug,
  onSignUp,
  onDemo,
  onBack,
  onNavigateToIndustry,
  onNavigateToComparison
}) => {
  const config = COMPARISON_CONFIGS[competitorSlug];

  // Update page title, meta description, and inject schemas for SEO
  useEffect(() => {
    if (config) {
      document.title = config.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', config.metaDescription);
      }
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://bookrecur.com/compare/${config.slug}`);
      }
      // Set robots meta
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.setAttribute('content', 'index, follow');
      }

      // Inject FAQ schema for rich snippets
      const faqSchema = generateFAQSchema(config.faqs);
      injectSchema('comparison-faq-schema', faqSchema);

      // Inject breadcrumb schema
      const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://bookrecur.com' },
        { name: 'Compare', url: 'https://bookrecur.com/compare' },
        { name: `vs ${config.competitorName}`, url: `https://bookrecur.com/compare/${config.slug}` }
      ]);
      injectSchema('comparison-breadcrumb-schema', breadcrumbSchema);

      // Inject comparison/software schema
      const comparisonSchema = generateComparisonSchema(config.competitorName, config.comparisonTable);
      injectSchema('comparison-software-schema', comparisonSchema);
    }

    // Cleanup schemas on unmount
    return () => {
      removeSchema('comparison-faq-schema');
      removeSchema('comparison-breadcrumb-schema');
      removeSchema('comparison-software-schema');
    };
  }, [config]);

  if (!config) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-serif text-maroon mb-3 sm:mb-4">Page Not Found</h1>
          <p className="text-sm sm:text-base text-maroon/60 mb-5 sm:mb-6">This comparison page doesn't exist.</p>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-maroon text-white rounded-xl font-bold hover:bg-maroon/90 transition-colors active:scale-[0.98]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const renderCellValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? <CheckIcon /> : <XIcon />;
    }
    return <span className="text-xs sm:text-sm">{value}</span>;
  };

  // Get other comparison options for internal linking
  const otherComparisons = Object.values(COMPARISON_CONFIGS)
    .filter(c => c.slug !== competitorSlug)
    .slice(0, 4);

  // Popular industries to link to
  const popularIndustries = Object.values(INDUSTRY_CONFIGS).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 md:h-20 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 sm:gap-3 text-maroon">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-base sm:text-lg">R</span>
            </div>
            <span className="font-serif text-xl sm:text-2xl hidden sm:inline">Recur</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={onDemo}
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[15px] font-medium text-maroon hover:opacity-70"
          >
            Demo
          </button>
          <button
            onClick={onSignUp}
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-[15px] font-bold shadow-sm hover:bg-maroon/90 transition-colors active:scale-[0.98]"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: onBack },
            { label: 'Compare' },
            { label: `vs ${config.competitorName}` }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 text-center bg-cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-maroon/60 mb-3 sm:mb-4">
            Recur vs {config.competitorName}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-maroon mb-4 sm:mb-6 leading-tight px-2">
            {config.h1}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-maroon/70 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onSignUp}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-maroon text-white rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-maroon/90 transition-colors active:scale-[0.98]"
            >
              See Your Predicted Income Free
            </button>
            <button
              onClick={onDemo}
              className="text-maroon/60 hover:text-maroon text-sm font-medium underline underline-offset-4 py-2"
            >
              See the demo first
            </button>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-8 sm:mb-10 md:mb-12">
            Why switch from {config.competitorName}?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {config.whySwitch.map((item, index) => (
              <div key={index} className="p-5 sm:p-6 md:p-8 bg-cream rounded-xl sm:rounded-2xl border border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-maroon mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-maroon/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section - Using Semantic HTML Table */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-8 sm:mb-10 md:mb-12">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full" role="grid" aria-label={`Feature comparison between Recur and ${config.competitorName}`}>
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th scope="col" className="p-3 sm:p-4 md:p-5 font-bold text-maroon text-left text-xs sm:text-sm md:text-base">
                    Feature
                  </th>
                  <th scope="col" className="p-3 sm:p-4 md:p-5 font-bold text-maroon text-center text-xs sm:text-sm md:text-base">
                    Recur
                  </th>
                  <th scope="col" className="p-3 sm:p-4 md:p-5 font-bold text-maroon/60 text-center text-xs sm:text-sm md:text-base">
                    {config.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {config.comparisonTable.map((row, index) => (
                  <tr
                    key={index}
                    className={index !== config.comparisonTable.length - 1 ? 'border-b border-slate-100' : ''}
                  >
                    <td className="p-3 sm:p-4 md:p-5 text-maroon/80 text-xs sm:text-sm md:text-base">
                      {row.feature}
                    </td>
                    <td className="p-3 sm:p-4 md:p-5 text-center text-maroon">
                      <span className="inline-flex items-center justify-center">
                        {renderCellValue(row.recur)}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 md:p-5 text-center text-maroon/60">
                      <span className="inline-flex items-center justify-center">
                        {renderCellValue(row.competitor)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-maroon mb-8 sm:mb-10 md:mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {config.faqs.map((faq, index) => (
              <div key={index} className="bg-cream p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                <h3 className="font-bold text-maroon mb-2 sm:mb-3 text-sm sm:text-base">{faq.question}</h3>
                <p className="text-maroon/70 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Industries Section - Internal Linking */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
            Popular industries using Recur
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularIndustries.map((industry) => (
              <button
                key={industry.slug}
                onClick={() => onNavigateToIndustry?.(industry.slug)}
                className="px-4 py-2 bg-white text-maroon rounded-lg hover:bg-maroon/5 transition-colors text-sm font-medium border border-slate-200"
              >
                {industry.pluralName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Other Comparisons Section - Internal Linking */}
      <section className="py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
            Compare Recur to other alternatives
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherComparisons.map((comp) => (
              <button
                key={comp.slug}
                onClick={() => onNavigateToComparison?.(comp.slug)}
                className="px-4 py-2 bg-cream text-maroon rounded-lg hover:bg-maroon/10 transition-colors text-sm font-medium"
              >
                vs {comp.competitorName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-maroon text-white text-center">
        <div className="max-w-3xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-serif mb-4 sm:mb-6 leading-snug">
            Ready to know what you'll make next month?
          </h2>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Start your free trial today. No credit card required.
          </p>
          <button
            onClick={onSignUp}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#fff38a] text-maroon rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#fff38a]/90 transition-colors active:scale-[0.98]"
          >
            See Your Predicted Income Free
          </button>
        </div>
      </section>

      {/* Footer with Enhanced Internal Links */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          {/* Comparison Quick Links */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-maroon mb-3">Compare Recur</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
              {Object.values(COMPARISON_CONFIGS).slice(0, 6).map((comp) => (
                <button
                  key={comp.slug}
                  onClick={() => onNavigateToComparison?.(comp.slug)}
                  className={`text-maroon/60 hover:text-maroon ${comp.slug === competitorSlug ? 'font-bold text-maroon' : ''}`}
                >
                  vs {comp.competitorName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-maroon to-maroon/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif text-xs sm:text-sm">R</span>
              </div>
              <span className="text-maroon/60 text-xs sm:text-sm">Recur - Booking software for service professionals</span>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm">
              <button onClick={onBack} className="text-maroon/60 hover:text-maroon py-1">Home</button>
              <a href="/about" className="text-maroon/60 hover:text-maroon py-1">About</a>
              <a href="/privacy" className="text-maroon/60 hover:text-maroon py-1">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComparisonPage;
