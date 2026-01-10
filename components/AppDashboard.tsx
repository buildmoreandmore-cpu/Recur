import React from 'react';
import { Client, RotationType, StylistProfile } from '../types';
import { ICONS, LOGOS } from '../constants';

interface AppDashboardProps {
  profile: StylistProfile;
  clients: Client[];
  onAddClient: () => void;
  onViewClient: (client: Client) => void;
  onBack: () => void;
}

const ROTATION_COLORS = {
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]' },
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const AppDashboard: React.FC<AppDashboardProps> = ({ profile, clients, onAddClient, onViewClient, onBack }) => {
  const stats = {
    annualProjected: clients.reduce((sum, c) => sum + c.annualValue, 0),
    confirmed: clients.filter(c => c.status === 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
    pending: clients.filter(c => c.status !== 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
  };

  const needsAttention = clients.filter(c => c.status === 'at-risk' || c.status === 'pending');

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getAvatarColor = (name: string) => AVATAR_COLORS[name.length % AVATAR_COLORS.length];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-maroon/60 hover:text-maroon text-sm font-medium">
              ← Exit Demo
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-maroon">
              <LOGOS.Main />
            </div>
          </div>
          <button
            onClick={onAddClient}
            className="btn-primary px-5 py-2.5 bg-maroon text-white rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Client
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-maroon">Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}</h1>
          <p className="text-maroon/60">Here's your business at a glance.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-maroon text-white p-6 rounded-2xl shadow-lg">
            <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-2">Annual Forecast</div>
            <div className="text-3xl font-serif number-animate">{formatCurrency(stats.annualProjected)}</div>
            <div className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
              <ICONS.TrendingUp /> {clients.length} clients on rotation
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirmed</div>
            <div className="text-3xl font-serif text-emerald-600 number-animate">{formatCurrency(stats.confirmed)}</div>
            <div className="text-slate-400 text-xs font-bold mt-2">
              {stats.annualProjected > 0 ? Math.round((stats.confirmed / stats.annualProjected) * 100) : 0}% of forecast
            </div>
          </div>
          <div className="bg-[#fff38a] p-6 rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-maroon/50 uppercase tracking-wider mb-2">Pending</div>
            <div className="text-3xl font-serif text-maroon number-animate">{formatCurrency(stats.pending)}</div>
            <div className="text-maroon/60 text-xs font-bold mt-2 flex items-center gap-1">
              <ICONS.Alert /> {needsAttention.length} need attention
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-maroon">Clients on Rotation</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{clients.length} total</span>
              </div>
              <div className="divide-y divide-slate-50">
                {clients.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <ICONS.Users />
                    </div>
                    <p className="text-maroon font-bold mb-2">No clients yet</p>
                    <p className="text-slate-400 text-sm mb-4">Add your first client to start forecasting.</p>
                    <button
                      onClick={onAddClient}
                      className="btn-primary px-6 py-2.5 bg-maroon text-white rounded-xl text-sm font-bold"
                    >
                      Add Client
                    </button>
                  </div>
                ) : (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => onViewClient(client)}
                      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getAvatarColor(client.name) }}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <div className="font-bold text-maroon group-hover:text-[#c17f59] transition-colors">{client.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${ROTATION_COLORS[client.rotation].badge}`}>
                              {client.rotation}
                            </span>
                            <span className="text-[11px] text-slate-400">{formatDate(client.nextAppointment)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maroon">{formatCurrency(client.annualValue)}<span className="text-slate-400 font-normal">/yr</span></div>
                        <span className={`text-[10px] font-bold uppercase ${
                          client.status === 'confirmed' ? 'text-emerald-500' :
                          client.status === 'at-risk' ? 'text-orange-500' : 'text-slate-400'
                        }`}>
                          {client.status === 'at-risk' ? 'At Risk' : client.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Needs Attention */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon flex items-center gap-2">
                  <ICONS.Alert /> Needs Attention
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {needsAttention.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">All clients are on track!</p>
                ) : (
                  needsAttention.slice(0, 3).map((client) => (
                    <div
                      key={client.id}
                      onClick={() => onViewClient(client)}
                      className="p-4 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-maroon">
                        <span className="font-bold">{client.name}</span>
                        {client.status === 'at-risk' ? ' is overdue. Reach out?' : ' needs a follow-up.'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">This Month</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Projected</span>
                  <span className="font-bold text-maroon">{formatCurrency(Math.round(stats.annualProjected / 12))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Booked</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(Math.round(stats.confirmed / 12))}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.annualProjected > 0 ? Math.min((stats.confirmed / stats.annualProjected) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-maroon text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <ICONS.Sparkle />
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Quick Action</span>
              </div>
              <p className="font-serif text-lg mb-4">Ready to grow your book?</p>
              <button
                onClick={onAddClient}
                className="w-full py-3 bg-[#fff38a] text-maroon rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                Add New Client
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
