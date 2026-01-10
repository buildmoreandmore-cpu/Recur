import React, { useState, useEffect } from 'react';
import { DashboardView } from './components/DashboardView';
import { ICONS, LOGOS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'landing' | 'demo'>('landing');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeView]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="cursor-pointer text-maroon" onClick={() => setActiveView('landing')}>
            <LOGOS.Main />
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-maroon">
            <button onClick={() => scrollTo('how-it-works')} className="hover:opacity-70 transition-opacity">How It Works</button>
            <button onClick={() => scrollTo('pricing')} className="hover:opacity-70 transition-opacity">Pricing</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block px-5 py-2.5 text-[15px] font-medium text-maroon hover:opacity-70">Log in</button>
          <button
            onClick={() => setActiveView('demo')}
            className="btn-primary px-5 py-2.5 bg-maroon text-white rounded-xl text-[15px] font-bold shadow-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main>
        {activeView === 'landing' ? (
          <>
            {/* SECTION 1: Hero */}
            <section className="relative pt-24 pb-32 text-center px-6">
              <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="text-5xl lg:text-[72px] font-serif leading-[1.1] text-maroon mb-8">
                  <span className="hero-animate hero-animate-delay-1 inline-block">Know your </span>
                  <span className="hero-animate hero-animate-delay-2 inline-block italic">income</span>
                  <br />
                  <span className="hero-animate hero-animate-delay-3 inline-block">before the year starts.</span>
                </h1>

                <p className="hero-animate hero-animate-delay-3 text-lg lg:text-xl text-maroon/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                  The client management system that maps every rotation, forecasts your revenue, and keeps you ahead of your book.
                </p>

                <div className="hero-animate hero-animate-delay-4">
                  <button
                    onClick={() => setActiveView('demo')}
                    className="btn-primary inline-flex items-center gap-2 px-8 py-4 bg-maroon text-white rounded-full text-lg font-bold shadow-xl"
                  >
                    <ICONS.Sparkle />
                    Start Free Trial
                  </button>

                  <p className="mt-4 text-sm text-slate-400">Free for 14 days. No credit card required.</p>
                </div>
              </div>
            </section>

            {/* SECTION 2: The Problem */}
            <section className="py-20 px-6 bg-cream">
              <div className="max-w-3xl mx-auto text-center">
                <p className="scroll-reveal text-xl lg:text-2xl text-maroon/80 leading-relaxed font-medium">
                  You check your calendar and see open slots. You check your bank account and wonder why the numbers don't match what you expected. You're working hard, but you're still <span className="italic">guessing</span> what next month looks like.
                </p>
                <p className="scroll-reveal delay-1 mt-6 text-xl lg:text-2xl text-maroon font-bold">
                  It's exhausting. And it doesn't have to be this way.
                </p>
              </div>
            </section>

            {/* SECTION 3: The Solution */}
            <section className="py-24 px-6 bg-white" id="how-it-works">
              <div className="max-w-7xl mx-auto">
                <h2 className="scroll-reveal text-3xl lg:text-4xl font-serif text-center text-maroon mb-16">
                  Three things that change everything
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="scroll-reveal delay-1 card-hover bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="card-icon w-16 h-16 bg-[#fff38a] rounded-2xl flex items-center justify-center text-maroon mb-6">
                      <ICONS.Users />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-maroon">Map Your Clients</h3>
                    <p className="text-slate-500 leading-relaxed">Capture rotation schedules, preferences, and annual value. Know exactly who's in your chair and when.</p>
                  </div>
                  <div className="scroll-reveal delay-2 card-hover bg-maroon p-10 rounded-[32px] shadow-lg flex flex-col items-center text-center text-white">
                    <div className="card-icon w-16 h-16 bg-[#fff38a] rounded-2xl flex items-center justify-center text-maroon mb-6">
                      <ICONS.TrendingUp />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Forecast Your Income</h3>
                    <p className="text-white/70 leading-relaxed">Every rotation has a value. Add them up and you know your year—before January ends.</p>
                  </div>
                  <div className="scroll-reveal delay-3 card-hover bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="card-icon w-16 h-16 bg-[#fff38a] rounded-2xl flex items-center justify-center text-maroon mb-6">
                      <ICONS.Alert />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-maroon">Stay Ahead of Churn</h3>
                    <p className="text-slate-500 leading-relaxed">See who's overdue and who's at risk. Stop chasing and start managing with confidence.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: The Dashboard */}
            <section className="py-24 px-6 bg-cream">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="scroll-reveal text-3xl lg:text-4xl font-serif text-maroon mb-4">
                    This is Monday morning with Recur.
                  </h2>
                  <p className="scroll-reveal delay-1 text-lg text-maroon/60">Your year, mapped. Your income, forecasted.</p>
                </div>

                {/* Dashboard Preview */}
                <div className="scroll-reveal delay-2 dashboard-preview bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                  {/* Mini Header */}
                  <div className="border-b border-slate-100 p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-maroon">Financial Forecast</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">FY 2026 Overview</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-maroon text-white">
                        <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-2">Annual Forecast</div>
                        <div className="text-3xl font-serif number-animate">$132,450</div>
                        <div className="text-emerald-400 text-xs font-bold mt-1">+14.2% YoY</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirmed</div>
                        <div className="text-3xl font-serif text-maroon number-animate">$92,240</div>
                        <div className="text-slate-400 text-xs font-bold mt-1">70% of goal</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-[#fff38a]">
                        <div className="text-[10px] font-bold text-maroon/50 uppercase tracking-wider mb-2">Pending</div>
                        <div className="text-3xl font-serif text-maroon number-animate">$40,210</div>
                        <div className="text-maroon/60 text-xs font-bold mt-1">6 clients need attention</div>
                      </div>
                    </div>

                    {/* Client List Preview */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client Rotations</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {[
                          { name: 'Julianne Miller', tier: 'Priority', amount: '$245', status: 'Confirmed' },
                          { name: 'Sienna West', tier: 'Standard', amount: '$165', status: 'Confirmed' },
                          { name: 'Evelyn Gray', tier: 'Flex', amount: '$310', status: 'At Risk' },
                        ].map((client, i) => (
                          <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-bold text-maroon">{client.name}</div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{client.tier}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-maroon">{client.amount}</div>
                              <span className={`text-[10px] font-bold uppercase ${client.status === 'At Risk' ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {client.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: The Rotation System */}
            <section className="py-24 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="scroll-reveal text-3xl lg:text-4xl font-serif text-maroon mb-4">
                    Map your year with rotations
                  </h2>
                  <p className="scroll-reveal delay-1 text-lg text-maroon/60 max-w-2xl mx-auto">
                    Not all clients are the same. Some come every 8 weeks like clockwork. Others are every 12. Recur tracks every tier.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="scroll-reveal delay-1 card-hover p-8 rounded-[28px] bg-indigo-50 border-2 border-indigo-100">
                    <div className="card-icon w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white mb-6">
                      <ICONS.Sparkle />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Priority</h3>
                    <p className="text-3xl font-serif text-indigo-900 mb-4">Every 8 weeks</p>
                    <p className="text-indigo-700/70">Your VIPs. High frequency, high value. They keep your books full and your income steady.</p>
                  </div>

                  <div className="scroll-reveal delay-2 card-hover p-8 rounded-[28px] bg-slate-50 border-2 border-slate-100">
                    <div className="card-icon w-12 h-12 bg-maroon rounded-xl flex items-center justify-center text-white mb-6">
                      <ICONS.Calendar />
                    </div>
                    <h3 className="text-xl font-bold text-maroon mb-2">Standard</h3>
                    <p className="text-3xl font-serif text-maroon mb-4">Every 10 weeks</p>
                    <p className="text-slate-500">Your core clientele. Reliable, consistent. The backbone of your annual forecast.</p>
                  </div>

                  <div className="scroll-reveal delay-3 card-hover p-8 rounded-[28px] bg-amber-50 border-2 border-amber-100">
                    <div className="card-icon w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-6">
                      <ICONS.Sun />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2">Flex</h3>
                    <p className="text-3xl font-serif text-amber-900 mb-4">Every 12+ weeks</p>
                    <p className="text-amber-700/70">Seasonal or occasional. They matter too—and now you can track when they're due back.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: Pricing */}
            <section className="py-24 px-6 bg-cream" id="pricing">
              <div className="max-w-xl mx-auto text-center">
                <h2 className="scroll-reveal text-3xl lg:text-4xl font-serif text-maroon mb-4">
                  Simple pricing
                </h2>
                <p className="scroll-reveal delay-1 text-lg text-maroon/60 mb-12">
                  One plan. Everything you need. No surprises.
                </p>

                <div className="scroll-reveal delay-2 price-card bg-white p-10 rounded-[32px] shadow-xl border border-slate-100">
                  <div className="text-5xl font-serif text-maroon mb-2 number-animate">$29<span className="text-2xl text-slate-400">/month</span></div>
                  <p className="text-slate-400 font-medium mb-8">Billed monthly. Cancel anytime.</p>

                  <ul className="text-left space-y-4 mb-10">
                    {[
                      'Unlimited clients',
                      'Full income dashboard',
                      'Client profiles and intake',
                      'Rotation tracking',
                      'Smart reminders',
                      'Export your data anytime',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                          <ICONS.Check />
                        </div>
                        <span className="text-maroon font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setActiveView('demo')}
                    className="btn-primary w-full py-4 bg-maroon text-white rounded-xl font-bold text-lg"
                  >
                    Start Your Free Trial
                  </button>
                  <p className="mt-4 text-sm text-slate-400">Free for 14 days. No credit card required.</p>
                </div>
              </div>
            </section>

            {/* SECTION 7: Final CTA */}
            <section className="py-32 px-6 bg-maroon text-white text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="scroll-reveal text-4xl lg:text-5xl font-serif mb-6">
                  Know your year before it starts.
                </h2>
                <p className="scroll-reveal delay-1 text-xl text-white/70 mb-10">
                  Your clients, mapped. Your income, forecasted. Your business, finally predictable.
                </p>
                <div className="scroll-reveal delay-2">
                  <button
                    onClick={() => setActiveView('demo')}
                    className="btn-primary cta-glow inline-flex items-center gap-2 px-10 py-5 bg-[#fff38a] text-maroon rounded-full text-lg font-bold shadow-xl"
                  >
                    <ICONS.Sparkle />
                    Get Started Free
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 8: Footer */}
            <footer className="py-16 border-t border-slate-100 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-maroon">
                    <LOGOS.Main />
                  </div>
                  <div className="flex flex-wrap justify-center gap-8 text-[15px] font-medium text-maroon/60">
                    <button onClick={() => scrollTo('how-it-works')} className="hover:text-maroon transition-colors">How It Works</button>
                    <button onClick={() => scrollTo('pricing')} className="hover:text-maroon transition-colors">Pricing</button>
                    <button className="hover:text-maroon transition-colors">Privacy</button>
                    <button className="hover:text-maroon transition-colors">Contact</button>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-400">© 2026 Recur. The income system for stylists.</p>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setActiveView('landing')}
                className="text-sm font-bold text-slate-400 hover:text-maroon flex items-center gap-2 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Landing
              </button>
              <div className="text-xs px-3 py-1 bg-[#fff38a] text-maroon font-bold rounded-full uppercase tracking-tighter">
                Demo Preview
              </div>
            </div>
            <DashboardView />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
