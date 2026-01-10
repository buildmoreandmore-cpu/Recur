import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ICONS } from '../constants';
import { RotationType } from '../types';

const MOCK_CLIENTS = [
  { id: '1', name: 'Julianne Miller', rotation: RotationType.PRIORITY, status: 'confirmed', amount: 245, label: 'Expected April' },
  { id: '2', name: 'Sienna West', rotation: RotationType.STANDARD, status: 'confirmed', amount: 165, label: 'Expected May' },
  { id: '3', name: 'Evelyn Gray', rotation: RotationType.FLEX, status: 'at-risk', amount: 310, label: 'Overdue' },
  { id: '4', name: 'Clara Thorne', rotation: RotationType.PRIORITY, status: 'pending', amount: 195, label: 'Upcoming' },
];

const REVENUE_DATA = [
  { name: 'Jan', revenue: 9400, forecast: 10500 },
  { name: 'Feb', revenue: 10200, forecast: 11800 },
  { name: 'Mar', revenue: 0, forecast: 12100 },
  { name: 'Apr', revenue: 0, forecast: 11800 },
  { name: 'May', revenue: 0, forecast: 13500 },
  { name: 'Jun', revenue: 0, forecast: 14200 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-2xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-50 p-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-6">
        <div>
          <h2 className="text-3xl font-serif text-maroon mb-1">Financial Forecast</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">FY 2026 Overview</p>
        </div>
        <div className="flex gap-4">
          <button className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
            <ICONS.Calendar />
          </button>
          <button className="px-8 py-4 bg-maroon text-white rounded-2xl text-[15px] font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
            <ICONS.Sparkle /> New Entry
          </button>
        </div>
      </div>

      <div className="p-10">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-10 rounded-[32px] bg-maroon text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-4">Annual Projected</div>
            <div className="text-4xl font-serif mb-2">$132,450</div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ICONS.TrendingUp />
              <span>+14.2% YoY</span>
            </div>
          </div>
          
          <div className="p-10 rounded-[32px] bg-white border border-slate-100 shadow-sm group hover:border-[#fff38a] transition-colors">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Confirmed Revenue</div>
            <div className="text-4xl font-serif text-maroon mb-2">$92,240</div>
            <div className="text-slate-400 text-xs font-bold">70% toward 2026 goal</div>
          </div>

          <div className="p-10 rounded-[32px] bg-[#fff38a] text-maroon border border-transparent shadow-sm">
            <div className="text-[10px] font-bold text-maroon/40 uppercase tracking-[0.2em] mb-4">Pending Outreach</div>
            <div className="text-4xl font-serif mb-2">$40,210</div>
            <div className="text-maroon/60 text-xs font-bold flex items-center gap-1">
              <ICONS.Alert /> 6 clients need attention
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 border border-slate-100 rounded-[32px] h-[400px]">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Revenue Momentum</h4>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div> Forecast
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-maroon"></div> Actual
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="75%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d1212" stopOpacity={0.08}/>
                      <stop offset="95%" stopColor="#2d1212" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="forecast" stroke="#e2e8f0" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="revenue" stroke="#2d1212" strokeWidth={4} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Outreach Table */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Client Rotations</h4>
                <button className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-maroon transition-colors">View All 84 Clients</button>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_CLIENTS.map((client) => (
                  <div key={client.id} className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-extrabold text-slate-300 text-lg">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-maroon text-lg">{client.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            client.rotation === RotationType.PRIORITY ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'
                          }`}>
                            {client.rotation}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Forecast</div>
                        <div className="font-bold text-maroon">${client.amount}</div>
                      </div>
                      <button className="px-6 py-3 bg-slate-50 text-maroon rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-10">
            <div className="p-10 bg-maroon text-white rounded-[40px] shadow-2xl relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-8 opacity-20"><ICONS.Sparkle /></div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-8">Smart Summary</h4>
              <p className="font-serif italic text-3xl leading-[1.3] mb-12">
                "Monday morning is looking light. Booking Julianne and Clara for root touchups would secure <span className="text-[#fff38a]">$440</span> in pending revenue."
              </p>
              <button className="w-full py-5 bg-[#fff38a] text-maroon rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-transform">
                Process Outreach
              </button>
            </div>

            <div className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">Client Mix</h4>
              <div className="space-y-8">
                {[
                  { label: "Priority", count: 24, percent: 45, color: "bg-indigo-500" },
                  { label: "Standard", count: 32, percent: 40, color: "bg-maroon" },
                  { label: "Flex", count: 11, percent: 15, color: "bg-slate-400" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-bold text-maroon">{item.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.count} Clients</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full transition-all`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
