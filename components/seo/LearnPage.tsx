import React, { useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  injectSchema,
  removeSchema
} from './schemaHelpers';
import { INDUSTRY_CONFIGS } from './IndustryLandingPage';

export interface LearnArticle {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: {
    heading: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedIndustries: string[];
  cta: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

// Learn article configurations
export const LEARN_ARTICLES: Record<string, LearnArticle> = {
  'deposit-policy': {
    slug: 'deposit-policy',
    title: 'How Much Deposit for Appointments? | Complete Guide',
    metaDescription: 'Learn how much to charge for appointment deposits. Best practices for salons, trainers, therapists, and service professionals. Reduce no-shows effectively.',
    h1: 'How Much Should You Charge for Appointment Deposits?',
    intro: 'Deposits are one of the most effective ways to reduce no-shows and protect your income. But how much should you charge? This guide covers deposit best practices for service professionals across industries.',
    sections: [
      {
        heading: 'Why Deposits Work',
        content: 'When clients put money down, they\'re committing to show up. Studies show deposits reduce no-shows by 80% or more. The psychological commitment of paying in advance makes clients value the appointment more and take their booking seriously. Even a small deposit creates accountability that dramatically improves show rates.'
      },
      {
        heading: 'Deposit Amount Guidelines by Industry',
        content: `**Hair Stylists & Barbers:** 20-50% of service price or $25-50 flat fee. For color services (2+ hours), charge 50% or $50-75.

**Personal Trainers:** 50% of session cost or one full session price. For packages, require full payment upfront.

**Massage Therapists:** 50% of service price or $50 flat fee. For 90+ minute sessions, increase to $75-100.

**Estheticians:** $50-75 for premium treatments (peels, LED therapy). Standard facials: $25-50.

**Lash Technicians:** $25-50 for fills, $50-100 for full sets. The longer the appointment, the higher the deposit.

**Tattoo Artists:** $50-100 minimum or 20-50% of quoted price. Larger pieces warrant larger deposits.

**Pet Groomers:** $15-25 for standard grooms. Larger dogs or specialized services: $25-50.`
      },
      {
        heading: 'Fixed Amount vs Percentage',
        content: `**Fixed deposits** work well when your services have similar values. A flat $50 deposit is simple to communicate and easy for clients to understand.

**Percentage deposits** work better when service prices vary widely. Charging 50% ensures higher-value services are adequately protected.

**Hybrid approach:** Use a minimum deposit (e.g., $25 minimum or 25%, whichever is greater) to ensure small services still have meaningful deposits while larger services scale appropriately.`
      },
      {
        heading: 'How to Communicate Your Deposit Policy',
        content: `Be upfront about deposits from the start:

1. **On your booking page:** Clearly state deposit requirements before clients start booking
2. **In confirmation messages:** Remind clients their deposit is non-refundable with less than 24-48 hour notice
3. **On social media:** When sharing your booking link, mention the deposit requirement

Frame deposits positively: "We require a deposit to reserve your spot and ensure you get the time you need."

Most clients understand and appreciate that you value your time. The clients who won't pay deposits are often the ones who wouldn't show up anyway.`
      },
      {
        heading: 'Handling Refunds and Cancellations',
        content: `Set clear policies and stick to them:

**Recommended policy:**
- Full refund if cancelled 48+ hours in advance
- No refund within 48 hours, but credit toward future appointment
- Transfer deposits to rescheduled appointments within 30 days

**For emergencies:** Use your judgment. Life happens, and showing grace for genuine emergencies builds loyalty. But don't let "emergencies" become a pattern.

**New vs. existing clients:** Consider stricter policies for new clients (who have higher no-show rates) and slightly more flexibility for proven regulars.`
      }
    ],
    faqs: [
      {
        question: 'Will I lose clients by requiring deposits?',
        answer: 'You may see fewer bookings initially, but your actual revenue typically increases because you\'ll have almost zero no-shows. The clients who won\'t pay deposits often weren\'t going to show up anyway.'
      },
      {
        question: 'Should I require deposits from existing clients?',
        answer: 'Yes. Even loyal clients benefit from the commitment a deposit creates. You can set a lower deposit amount for established clients if you prefer, but the psychological commitment still helps.'
      },
      {
        question: 'What if a client has an emergency?',
        answer: 'Use your judgment. For genuine emergencies, offer to credit the deposit toward a rescheduled appointment. Build goodwill while still protecting your time.'
      },
      {
        question: 'How do I handle clients who complain about deposits?',
        answer: 'Explain that deposits protect your time and ensure you can reserve their preferred slot. Most clients understand once you explain it. Those who strongly object were likely higher no-show risks anyway.'
      }
    ],
    relatedIndustries: ['hair-stylists', 'personal-trainers', 'massage-therapists'],
    cta: {
      heading: 'Start Collecting Deposits Today',
      description: 'Recur makes it easy to collect deposits when clients book. Payments go directly to your Stripe account.',
      buttonText: 'See Your Predicted Income Free'
    }
  },
  'reduce-no-shows': {
    slug: 'reduce-no-shows',
    title: 'How to Reduce No-Shows for Service Businesses | Proven Strategies',
    metaDescription: 'Reduce no-shows by 80% or more with these proven strategies for service businesses. Deposits, reminders, and policies that actually work.',
    h1: 'How to Reduce No-Shows for Your Service Business',
    intro: 'No-shows cost service professionals thousands of dollars every year. A single missed appointment can\'t be recovered—that time is lost forever. Here\'s how to dramatically reduce no-shows and protect your income.',
    sections: [
      {
        heading: 'The True Cost of No-Shows',
        content: `If you have 2 no-shows per week at $75 average service value, that's:
- **$150/week** in lost revenue
- **$600/month** walking out the door
- **$7,200/year** you can never get back

And that doesn't count the time spent waiting, the inability to book other clients, or the frustration of an empty schedule.`
      },
      {
        heading: 'Strategy 1: Require Deposits',
        content: `Deposits are the single most effective way to reduce no-shows. When clients have money on the line, they show up.

**Why it works:** The psychological commitment of paying in advance makes clients value the appointment. A $25 deposit might seem small, but it changes behavior dramatically.

**How much:** 20-50% of service price or a flat $25-50 depending on your industry.

**The data:** Service professionals who switch to deposits typically see no-show rates drop from 10-20% to under 2%.`
      },
      {
        heading: 'Strategy 2: Send Smart Reminders',
        content: `Automated reminders catch forgetful clients before they miss appointments.

**Timing:**
- 48 hours before: Initial reminder
- 24 hours before: Confirmation request
- 2 hours before: Final reminder (especially for new clients)

**Include:** Date, time, location, and your cancellation policy. Make it easy to reschedule instead of just not showing up.`
      },
      {
        heading: 'Strategy 3: Make Rescheduling Easy',
        content: `Clients who can't make their appointment often no-show because rescheduling feels like too much effort.

**Solutions:**
- Include a reschedule link in reminders
- Respond quickly to reschedule requests
- Don't make clients feel guilty about needing to change

**Frame it:** "We understand plans change. Click here to reschedule your appointment."

Better a rescheduled client than a no-show.`
      },
      {
        heading: 'Strategy 4: Enforce Consequences',
        content: `Your no-show policy only works if you enforce it consistently.

**Recommended policy:**
- First no-show: Lose deposit, require larger deposit for future bookings
- Second no-show: Require full prepayment for all future appointments
- Third no-show: Consider whether this client is worth keeping

**Document everything:** Track no-shows and late cancellations in your client records. Patterns become clear over time.`
      },
      {
        heading: 'Strategy 5: Build Relationships',
        content: `Clients who value your relationship are less likely to no-show.

- Remember their preferences
- Follow up after appointments
- Send birthday or holiday messages
- Make them feel valued as regulars

People don't stand up people they care about.`
      }
    ],
    faqs: [
      {
        question: 'What\'s a normal no-show rate?',
        answer: 'Without deposits, most service businesses see 10-20% no-show rates. With deposits and good policies, you can reduce this to under 2%.'
      },
      {
        question: 'How do I implement deposits without losing clients?',
        answer: 'Be confident and straightforward. Explain that deposits ensure you can reserve their preferred time. Most clients understand and appreciate that you value your time.'
      },
      {
        question: 'Should I charge a no-show fee instead of deposits?',
        answer: 'Deposits work better. No-show fees require chasing payment after the fact, and clients may dispute charges. Deposits prevent no-shows rather than trying to recover after.'
      },
      {
        question: 'What about last-minute cancellations?',
        answer: 'Treat cancellations within 24-48 hours the same as no-shows. A last-minute cancellation can\'t be filled, so the impact on your business is the same.'
      }
    ],
    relatedIndustries: ['hair-stylists', 'barbers', 'lash-technicians'],
    cta: {
      heading: 'Stop Losing Money to No-Shows',
      description: 'Recur helps you collect deposits, send reminders, and track no-show patterns. Protect your income automatically.',
      buttonText: 'See Your Predicted Income Free'
    }
  },
  'recurring-clients': {
    slug: 'recurring-clients',
    title: 'How to Track Recurring Clients | Build Predictable Income',
    metaDescription: 'Learn how to track recurring client patterns and build predictable income. Client rotation tracking for service professionals.',
    h1: 'How to Track Recurring Clients and Build Predictable Income',
    intro: 'Your recurring clients are the foundation of your business. When you track their patterns and rotation schedules, you can predict your income months in advance. Here\'s how to turn irregular bookings into predictable revenue.',
    sections: [
      {
        heading: 'Why Recurring Clients Matter',
        content: `The math is simple:
- **New client acquisition** costs 5-7x more than keeping existing clients
- **Recurring clients** have predictable value you can count on
- **Client rotation tracking** lets you forecast income months ahead

A stylist with 100 clients at 6-week rotations averaging $120/visit has $104,000 in predictable annual revenue. That's the power of understanding your client base.`
      },
      {
        heading: 'Understanding Client Rotation Patterns',
        content: `Every client has a natural rhythm:

**High-frequency (2-4 weeks):**
- Barber clients
- Lash fills
- Nail maintenance
- Weekly training sessions

**Standard (4-8 weeks):**
- Haircuts
- Facials
- Massage therapy
- Monthly training packages

**Extended (8-12+ weeks):**
- Color services
- Deep treatments
- Quarterly check-ins

Track each client's actual pattern, not just what they say they'll do. Their booking history reveals their true rotation.`
      },
      {
        heading: 'Calculating Client Annual Value',
        content: `Each recurring client has a calculable annual value:

**Formula:** (Average Service Value) × (Visits Per Year) = Annual Value

**Example:**
- Client gets color + cut ($180) every 8 weeks
- 52 weeks ÷ 8 weeks = 6.5 visits/year
- 6.5 × $180 = **$1,170 annual value**

When you know each client's value, you can:
- Prioritize your best clients
- Identify when valuable clients are overdue
- Forecast total revenue by month`
      },
      {
        heading: 'Identifying At-Risk Clients',
        content: `Clients become "at-risk" when they go beyond their normal rotation:

**Warning signs:**
- 2+ weeks past their usual booking window
- Cancelled last appointment without rebooking
- Hasn't responded to outreach

**Actions to take:**
- Send a friendly check-in message
- Offer to book their next appointment
- Ask if there's anything you can do better

Catching clients before they lapse entirely is much easier than winning them back later.`
      },
      {
        heading: 'Building Predictable Monthly Income',
        content: `With client rotation data, you can forecast each month:

**Step 1:** List all clients with their rotation schedules
**Step 2:** Project when each client should book
**Step 3:** Calculate expected revenue by month
**Step 4:** Identify gaps where you have capacity

This transforms your business from "hoping for bookings" to "knowing what's coming."

**Bonus:** When you can predict slow periods, you can:
- Plan vacations around them
- Run promotions to fill gaps
- Budget for lower-income months`
      }
    ],
    faqs: [
      {
        question: 'How do I start tracking client rotations?',
        answer: 'Begin by recording when each client books and the gap between appointments. After 3-4 visits, their pattern becomes clear. Use booking software that tracks this automatically.'
      },
      {
        question: 'What if clients don\'t book on a regular schedule?',
        answer: 'Most clients have a natural pattern even if they don\'t realize it. Look at their history over 6-12 months. Some variation is normal, but the average tells you their true rotation.'
      },
      {
        question: 'How do I encourage more frequent visits?',
        answer: 'First, understand their current pattern. Then, explain the benefits of more frequent service (better results, easier maintenance). Some clients will adjust, but don\'t push—respect their budget and preferences.'
      },
      {
        question: 'What percentage of my revenue should come from recurring clients?',
        answer: 'Healthy service businesses typically get 60-80% of revenue from recurring clients. If you\'re below this, focus on retention and building relationships rather than constantly seeking new clients.'
      }
    ],
    relatedIndustries: ['hair-stylists', 'estheticians', 'pet-groomers'],
    cta: {
      heading: 'Track Your Recurring Clients Automatically',
      description: 'Recur tracks client rotations and calculates their annual value. See your predicted income at a glance.',
      buttonText: 'See Your Predicted Income Free'
    }
  },
  'predict-income': {
    slug: 'predict-income',
    title: 'How to Predict Monthly Income for Service Businesses',
    metaDescription: 'Learn how to forecast your monthly income as a service professional. Revenue prediction strategies for hair stylists, trainers, therapists, and more.',
    h1: 'How to Predict Your Monthly Income as a Service Professional',
    intro: 'Most service professionals have no idea what they\'ll make next month until it happens. But with the right approach, you can forecast your income with surprising accuracy. Here\'s how to move from hoping to knowing.',
    sections: [
      {
        heading: 'Why Income Prediction Matters',
        content: `Predictable income changes everything:

- **Financial planning:** Budget confidently, save consistently
- **Business decisions:** Know when you can invest in growth
- **Stress reduction:** Stop the feast-or-famine anxiety
- **Capacity planning:** See where you have room for more clients

The difference between "I think I'll make around $5,000" and "I have $5,400 projected with $800 buffer for new bookings" is the difference between guessing and running a real business.`
      },
      {
        heading: 'The Revenue Forecasting Formula',
        content: `Your projected income comes from two sources:

**1. Confirmed Bookings**
Appointments already on your calendar with known values.

**2. Expected Recurring Revenue**
Clients who should book based on their rotation patterns.

**Formula:**
Projected Monthly Revenue = Confirmed Bookings + (Expected Recurring Clients × Average Service Value)

**Example:**
- Confirmed: $2,400
- 15 clients expected at avg $150 = $2,250 expected
- **Projected: $4,650**`
      },
      {
        heading: 'Building Your Forecast',
        content: `**Step 1: Know Your Client Base**
List every recurring client with:
- Their rotation schedule (every X weeks)
- Their typical service value
- When they last visited

**Step 2: Project the Month**
For each client, determine if they should book this month based on their rotation.

**Step 3: Calculate Expected Revenue**
Sum up expected values from all clients who should book.

**Step 4: Add Confirmed Bookings**
Include any appointments already scheduled.

**Step 5: Track Accuracy**
Compare projections to actual revenue. Adjust your calculations over time.`
      },
      {
        heading: 'Improving Forecast Accuracy',
        content: `Your forecasts get more accurate when you:

**Track actual patterns:** Don't assume—use real booking history to understand each client's true rotation.

**Account for seasonality:** Most businesses have predictable busy and slow periods. Factor these in.

**Build in buffers:** Assume 10-20% of expected clients won't book as predicted.

**Monitor trends:** Are clients coming more or less frequently? Adjust your projections accordingly.`
      },
      {
        heading: 'Using Forecasts to Grow',
        content: `With reliable forecasts, you can make strategic decisions:

**Identify capacity:** See exactly how many hours you have available for new clients.

**Plan promotions:** Target slow periods with special offers.

**Price strategically:** Know how price changes would affect your projected income.

**Hire smart:** Forecast when you'll need additional help.

The businesses that grow are the ones that can see where they're going.`
      }
    ],
    faqs: [
      {
        question: 'How accurate can income forecasts really be?',
        answer: 'With good client tracking, most service professionals can forecast within 10-15% accuracy. The more historical data you have, the more accurate your predictions become.'
      },
      {
        question: 'What about new clients? Can I forecast those?',
        answer: 'New clients are harder to predict, but you can use historical averages. If you typically get 5 new clients per month, budget for that. Just don\'t rely on new business for core revenue.'
      },
      {
        question: 'How do I forecast during slow seasons?',
        answer: 'Track your revenue by month for at least a year. You\'ll see patterns—January might be 30% below average while December is 20% above. Factor these seasonal adjustments into your forecasts.'
      },
      {
        question: 'Should I share forecasts with my accountant?',
        answer: 'Absolutely. Revenue forecasts help with tax planning, business loans, and financial strategy. Your accountant will love having visibility into expected income.'
      }
    ],
    relatedIndustries: ['consultants', 'personal-trainers', 'therapists'],
    cta: {
      heading: 'See Your Predicted Income Automatically',
      description: 'Recur calculates your projected revenue based on client rotations. Know what you\'ll make before the month begins.',
      buttonText: 'See Your Predicted Income Free'
    }
  },
  'booking-fees': {
    slug: 'booking-fees',
    title: 'Do Booking Apps Take Commission? | Fee Comparison Guide',
    metaDescription: 'Compare booking app fees and commissions. Learn which booking software takes a cut of your revenue and which offers transparent pricing.',
    h1: 'Do Booking Apps Take a Commission? What You Need to Know',
    intro: 'Not all booking software is created equal when it comes to fees. Some apps charge flat monthly rates, others take a percentage of every booking, and some combine both. Here\'s what you need to know to make the right choice for your business.',
    sections: [
      {
        heading: 'Types of Booking Software Fees',
        content: `Booking apps typically charge fees in several ways:

**1. Monthly Subscription**
A flat fee regardless of how much you earn. Predictable and budget-friendly for busy professionals.

**2. Commission/Transaction Fees**
A percentage of each booking or payment. Costs more as you earn more.

**3. Marketplace Fees**
Commissions on clients who find you through the app's marketplace directory.

**4. Payment Processing Fees**
Separate from the software fee—these go to Stripe, Square, or other payment processors.

**5. Feature Add-ons**
Additional charges for features like marketing tools, analytics, or team management.`
      },
      {
        heading: 'Marketplace Commission Models',
        content: `Some booking platforms charge commissions when clients book through their marketplace:

**Fresha:** Software is "free" but takes 20% commission on new clients from their marketplace, plus payment processing fees.

**Booksy:** Monthly subscription plus commissions on marketplace bookings (varies by market).

**Vagaro:** Marketplace fee for clients who find you through their directory.

**The catch:** "Free" software often costs more through commissions than a straightforward monthly fee would.`
      },
      {
        heading: 'Payment Processing: The Hidden Cost',
        content: `Every booking app needs a payment processor. Common rates:

**Stripe:** 2.9% + $0.30 per transaction (standard)
**Square:** 2.6% + $0.10 per transaction
**PayPal:** 2.99% + fixed fee per transaction

**Example on a $100 service:**
- Stripe: $3.20 in processing fees
- Square: $2.70 in processing fees

These fees apply regardless of your booking software. Compare apples to apples when evaluating total costs.`
      },
      {
        heading: 'Cost Comparison Example',
        content: `Let's compare costs for a professional earning $8,000/month:

**Option A: $19/month flat fee (Recur)**
- Software: $19
- Stripe processing (2.9% + $0.30 avg): ~$250
- **Total: ~$269/month**

**Option B: "Free" with 20% marketplace commission (assuming 25% of clients from marketplace)**
- Software: $0
- Marketplace commission (20% of $2,000): $400
- Payment processing: ~$250
- **Total: ~$650/month**

**Option C: $30/month + per-booking fees**
- Software: $30
- Per-booking fees: varies
- Payment processing: ~$250
- **Total: $280+ depending on volume**

The cheapest option depends on your business model and where clients come from.`
      },
      {
        heading: 'Choosing the Right Model for You',
        content: `**Choose flat-fee software if:**
- You have an established client base
- Most clients find you through referrals or social media
- You want predictable monthly costs
- You're earning enough that commissions would exceed subscription costs

**Consider marketplace-based software if:**
- You're just starting and need client discovery help
- You have no existing online presence
- The marketplace commission is worth the exposure

**Avoid if:**
- "Free" software where you can't easily calculate total costs
- Apps with multiple fee types that compound
- Any platform that makes it hard to understand your true costs`
      }
    ],
    faqs: [
      {
        question: 'Which booking software doesn\'t take commission?',
        answer: 'Recur, Acuity Scheduling, Calendly, and Square Appointments (basic plan) charge flat monthly fees without taking a cut of your bookings. You\'ll still pay payment processing fees separately.'
      },
      {
        question: 'Are "free" booking apps really free?',
        answer: 'Rarely. Free apps typically make money through marketplace commissions, payment processing markups, or premium feature upsells. Calculate total costs, not just the base price.'
      },
      {
        question: 'How do I calculate my true booking software costs?',
        answer: 'Add up: monthly subscription + marketplace commissions + payment processing fees + any add-on features. Track this monthly and compare to your total revenue.'
      },
      {
        question: 'Is it worth paying more for better software?',
        answer: 'Often yes. Features like revenue forecasting, client rotation tracking, and automated deposits can increase your actual income more than the software costs. Focus on total business impact, not just software price.'
      }
    ],
    relatedIndustries: ['hair-stylists', 'barbers', 'nail-technicians'],
    cta: {
      heading: 'Transparent Pricing, No Commissions',
      description: 'Recur charges $19/month flat. No commissions on bookings, no marketplace fees. Your revenue stays yours.',
      buttonText: 'See Your Predicted Income Free'
    }
  }
};

interface LearnPageProps {
  articleSlug: string;
  onSignUp: () => void;
  onBack: () => void;
  onNavigateToIndustry?: (slug: string) => void;
  onNavigateToLearn?: (slug: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  articleSlug,
  onSignUp,
  onBack,
  onNavigateToIndustry,
  onNavigateToLearn
}) => {
  const article = LEARN_ARTICLES[articleSlug];

  // Update page title, meta description, and inject schemas for SEO
  useEffect(() => {
    if (article) {
      document.title = article.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.metaDescription);
      }
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://bookrecur.com/learn/${article.slug}`);
      }
      // Set robots meta
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.setAttribute('content', 'index, follow');
      }

      // Inject FAQ schema for rich snippets
      const faqSchema = generateFAQSchema(article.faqs);
      injectSchema('learn-faq-schema', faqSchema);

      // Inject breadcrumb schema
      const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://bookrecur.com' },
        { name: 'Learn', url: 'https://bookrecur.com/learn' },
        { name: article.h1.substring(0, 50), url: `https://bookrecur.com/learn/${article.slug}` }
      ]);
      injectSchema('learn-breadcrumb-schema', breadcrumbSchema);
    }

    // Cleanup schemas on unmount
    return () => {
      removeSchema('learn-faq-schema');
      removeSchema('learn-breadcrumb-schema');
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-serif text-maroon mb-3 sm:mb-4">Article Not Found</h1>
          <p className="text-sm sm:text-base text-maroon/60 mb-5 sm:mb-6">This article doesn't exist.</p>
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

  // Get related industries for internal linking
  const relatedIndustries = article.relatedIndustries
    .map(slug => INDUSTRY_CONFIGS[slug])
    .filter(Boolean);

  // Get other learn articles for internal linking
  const otherArticles = Object.values(LEARN_ARTICLES)
    .filter(a => a.slug !== articleSlug)
    .slice(0, 3);

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Handle bold text
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-4 last:mb-0">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold text-maroon">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

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
            onClick={onSignUp}
            className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-[15px] font-bold shadow-sm hover:bg-maroon/90 transition-colors active:scale-[0.98]"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: onBack },
            { label: 'Learn' },
            { label: article.h1.substring(0, 30) + '...' }
          ]}
        />
      </div>

      {/* Article Header */}
      <header className="py-10 sm:py-16 px-4 sm:px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-maroon/60 mb-3 sm:mb-4">
            Learn
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-maroon mb-4 sm:mb-6 leading-tight">
            {article.h1}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-maroon/70 leading-relaxed">
            {article.intro}
          </p>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {article.sections.map((section, index) => (
            <section key={index} className="mb-10 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-serif text-maroon mb-4 sm:mb-6">
                {section.heading}
              </h2>
              <div className="text-maroon/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {renderContent(section.content)}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-maroon mb-8 sm:mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {article.faqs.map((faq, index) => (
              <div key={index} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-slate-100">
                <h3 className="font-bold text-maroon mb-2 sm:mb-3 text-sm sm:text-base">{faq.question}</h3>
                <p className="text-maroon/70 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Industries Section */}
      {relatedIndustries.length > 0 && (
        <section className="py-10 sm:py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
              See how this applies to your industry
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedIndustries.map((industry) => (
                <button
                  key={industry.slug}
                  onClick={() => onNavigateToIndustry?.(industry.slug)}
                  className="px-4 py-2 bg-cream text-maroon rounded-lg hover:bg-maroon/10 transition-colors text-sm font-medium"
                >
                  For {industry.pluralName}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More Articles Section */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-serif text-maroon mb-4 sm:mb-6">
            More guides for service professionals
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherArticles.map((otherArticle) => (
              <button
                key={otherArticle.slug}
                onClick={() => onNavigateToLearn?.(otherArticle.slug)}
                className="px-4 py-2 bg-white text-maroon rounded-lg hover:bg-maroon/5 transition-colors text-sm font-medium border border-slate-200"
              >
                {otherArticle.h1.length > 40 ? otherArticle.h1.substring(0, 40) + '...' : otherArticle.h1}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-maroon text-white text-center">
        <div className="max-w-3xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-serif mb-4 sm:mb-6 leading-snug">
            {article.cta.heading}
          </h2>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            {article.cta.description}
          </p>
          <button
            onClick={onSignUp}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#fff38a] text-maroon rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#fff38a]/90 transition-colors active:scale-[0.98]"
          >
            {article.cta.buttonText}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
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
      </footer>
    </div>
  );
};

export default LearnPage;
