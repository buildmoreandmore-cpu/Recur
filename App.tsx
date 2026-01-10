import React, { useState } from 'react';
import { DashboardView } from './components/DashboardView';
import { ICONS, LOGOS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'landing' | 'demo'>('landing');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Announcement Bar */}
      <div className="bg-[#fff38a] text-maroon text-[13px] font-semibold py-2.5 text-center flex items-center justify-center gap-2 px-4">
        <span>Recur announces $25m Series A to empower the next generation of independent stylists</span>
        <span className="text-lg">→</span>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="cursor-pointer text-maroon" onClick={() => setActiveView('landing')}>
            <LOGOS.Main />
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-maroon">
            <button onClick={() => scrollTo('how-it-works')} className="flex items-center gap-1 hover:opacity-70 transition-opacity">Product <span>▼</span></button>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">Specialties <span>▼</span></button>
            <button onClick={() => scrollTo('pricing')} className="hover:opacity-70 transition-opacity">Pricing</button>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">Resources <span>▼</span></button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[15px] font-medium text-maroon cursor-pointer hover:opacity-70">
            <span className="w-5 h-4 bg-slate-200 rounded-sm"></span>
            US <span>▼</span>
          </div>
          <button className="hidden md:block text-[15px] font-medium text-maroon hover:opacity-70">Contact us</button>
          <button className="px-5 py-2.5 bg-slate-100 rounded-xl text-[15px] font-bold text-maroon hover:bg-slate-200 transition-all">Log in</button>
          <button 
            onClick={() => setActiveView('demo')}
            className="px-5 py-2.5 bg-[#fff38a] rounded-xl text-[15px] font-bold text-maroon shadow-sm hover:opacity-90 transition-all"
          >
            Sign up
          </button>
        </div>
      </nav>

      <main>
        {activeView === 'landing' ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-48 text-center px-6">
              {/* Decorative Side Chevrons */}
              <div className="hero-chevron hero-chevron-left hidden lg:block">
                <svg width="400" height="600" viewBox="0 0 400 600" fill="none">
                   <path d="M0 600L250 300L0 0H100L350 300L100 600H0Z" fill="#2d1212"/>
                </svg>
              </div>
              <div className="hero-chevron hero-chevron-right hidden lg:block scale-x-[-1]">
                <svg width="400" height="600" viewBox="0 0 400 600" fill="none">
                   <path d="M0 600L250 300L0 0H100L350 300L100 600H0Z" fill="#2d1212"/>
                </svg>
              </div>

              <div className="max-w-4xl mx-auto relative z-10">
                <span className="text-slate-400 text-sm font-medium tracking-wide mb-6 block">The income system trusted by stylists</span>
                
                <h1 className="text-6xl lg:text-[88px] font-serif leading-[1.05] text-maroon mb-10">
                  Know your <span className="italic">income</span>.<br />
                  Before the <span className="italic">year starts</span>.
                </h1>
                
                <p className="text-lg lg:text-xl text-maroon/70 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                  The client management system capturing every visit, rotation, and preference. 
                  By your side while your business grows.
                </p>

                <button 
                  onClick={() => setActiveView('demo')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-maroon text-white rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-xl active:scale-95 group"
                >
                  <ICONS.Sparkle />
                  Get Recur free
                </button>

                {/* Floating Decorative Elements */}
                <div className="absolute top-0 left-10 lg:left-40 animate-float text-slate-300">
                  <ICONS.Sparkle />
                </div>
                <div className="absolute top-20 right-10 lg:right-40 animate-float text-slate-300" style={{animationDelay: '1s'}}>
                  <ICONS.Sparkle />
                  <ICONS.Sparkle />
                </div>
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 animate-float text-slate-200" style={{animationDelay: '2s'}}>
                  <ICONS.Sparkle />
                </div>
              </div>
            </section>

            {/* Feature Section Inspired by Heidi Cards */}
            <section className="bg-cream py-32 px-6" id="how-it-works">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-[#fff38a] rounded-2xl flex items-center justify-center text-maroon mb-8 group-hover:scale-110 transition-transform">
                      <ICONS.Layers />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Map Every Rotation</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Capture lifestyle, events, and hair history. Know who needs color before their vacation.</p>
                 </div>
                 <div className="bg-[#fff38a] p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-maroon mb-8 group-hover:scale-110 transition-transform">
                      <ICONS.TrendingUp />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">True Forecasting</h3>
                    <p className="text-maroon/70 font-medium leading-relaxed">Every rotation has a value. Add them up and you know your year—before January ends.</p>
                 </div>
                 <div className="bg-white p-10 rounded-[32px] shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
                    <div className="w-14 h-14 bg-[#fff38a] rounded-2xl flex items-center justify-center text-maroon mb-8 group-hover:scale-110 transition-transform">
                      <ICONS.Alert />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Stay Ahead of Gaps</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">See who's overdue and who's at risk. Stop chasing and start managing with confidence.</p>
                 </div>
              </div>
            </section>

            {/* Floating Quick Actions Section */}
            <section className="py-24 px-6 bg-white">
               <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <ICONS.Sun />
                    </div>
                    <span className="font-bold text-[15px] pr-2">Rotation Template</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                      <ICONS.Layers />
                    </div>
                    <span className="font-bold text-[15px] pr-2">Client Context</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-maroon">
                      <ICONS.Copy />
                    </div>
                    <span className="font-bold text-[15px] pr-2">Service Note</span>
                  </div>
               </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-slate-100">
               <div className="max-w-7xl mx-auto px-6 text-center">
                  <div className="mb-12 flex justify-center text-maroon">
                    <LOGOS.Main />
                  </div>
                  <div className="flex flex-wrap justify-center gap-10 text-[15px] font-medium text-maroon/60 mb-16">
                     <button onClick={() => scrollTo('how-it-works')} className="hover:text-maroon transition-colors">How It Works</button>
                     <button onClick={() => scrollTo('pricing')} className="hover:text-maroon transition-colors">Pricing</button>
                     <button className="hover:text-maroon transition-colors">About Us</button>
                     <button className="hover:text-maroon transition-colors">Careers</button>
                     <button className="hover:text-maroon transition-colors">Privacy</button>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">© 2026 Recur. The income system for stylists who are done guessing.</p>
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

      {/* Floating UI Elements Sidebar */}
      <div className="fixed left-6 bottom-8 z-40 hidden lg:flex flex-col gap-3">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
           <ICONS.Check />
        </div>
        <div className="w-12 h-12 bg-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
           <ICONS.Sparkle />
        </div>
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
           <ICONS.Layers />
        </div>
        <div className="w-12 h-12 bg-slate-500 rounded-2xl shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
           <ICONS.Copy />
        </div>
      </div>
    </div>
  );
};

export default App;