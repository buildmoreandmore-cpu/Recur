import React, { useState } from 'react';
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
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]', hex: '#c17f59' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]', hex: '#7c9a7e' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]', hex: '#b5a078' },
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const AppDashboard: React.FC<AppDashboardProps> = ({ profile, clients, onAddClient, onViewClient, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return clients.filter(client => {
      if (client.nextAppointment) {
        const aptDate = client.nextAppointment.split('T')[0];
        return aptDate === dateStr;
      }
      return false;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={onBack} className="text-maroon/60 hover:text-maroon text-xs sm:text-sm font-medium">
              ← <span className="hidden sm:inline">Exit Demo</span><span className="sm:hidden">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="text-maroon hidden sm:block">
              <LOGOS.Main />
            </div>
          </div>
          <button
            onClick={onAddClient}
            className="btn-primary px-3 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2"
          >
            <span className="text-base sm:text-lg">+</span> <span className="hidden sm:inline">Add</span> Client
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-serif text-maroon">Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}</h1>
          <p className="text-maroon/60 text-sm sm:text-base">Here's your business at a glance.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-maroon text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
            <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2">Annual Forecast</div>
            <div className="text-2xl sm:text-3xl font-serif number-animate">{formatCurrency(stats.annualProjected)}</div>
            <div className="text-emerald-400 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
              <ICONS.TrendingUp /> {clients.length} clients on rotation
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">Confirmed</div>
            <div className="text-2xl sm:text-3xl font-serif text-emerald-600 number-animate">{formatCurrency(stats.confirmed)}</div>
            <div className="text-slate-400 text-xs font-bold mt-1 sm:mt-2">
              {stats.annualProjected > 0 ? Math.round((stats.confirmed / stats.annualProjected) * 100) : 0}% of forecast
            </div>
          </div>
          <div className="bg-[#fff38a] p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-maroon/50 uppercase tracking-wider mb-1 sm:mb-2">Pending</div>
            <div className="text-2xl sm:text-3xl font-serif text-maroon number-animate">{formatCurrency(stats.pending)}</div>
            <div className="text-maroon/60 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
              <ICONS.Alert /> {needsAttention.length} need attention
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 sm:mb-10 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-maroon flex items-center gap-2 text-sm sm:text-base">
              <ICONS.Calendar /> <span className="hidden sm:inline">Appointment</span> Calendar
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60 hover:text-maroon"
              >
                ←
              </button>
              <span className="font-medium text-maroon min-w-[100px] sm:min-w-[140px] text-center text-sm sm:text-base">{monthName}</span>
              <button
                onClick={nextMonth}
                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60 hover:text-maroon"
              >
                →
              </button>
            </div>
          </div>
          <div className="p-2 sm:p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1 sm:mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider py-1 sm:py-2">
                  <span className="sm:hidden">{day}</span>
                  <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-0.5 sm:p-1" />
              ))}
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const appointments = getAppointmentsForDate(day);
                const isToday = isCurrentMonth && today.getDate() === day;

                return (
                  <div
                    key={day}
                    className={`aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-colors ${
                      isToday ? 'bg-maroon/10 ring-1 sm:ring-2 ring-maroon' :
                      appointments.length > 0 ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer' : ''
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-maroon font-bold' : 'text-slate-600'}`}>
                        {day}
                      </span>
                      {appointments.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 sm:mt-1">
                          {appointments.slice(0, 2).map((client) => (
                            <div
                              key={client.id}
                              onClick={() => onViewClient(client)}
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                              style={{ backgroundColor: ROTATION_COLORS[client.rotation].hex }}
                              title={client.name}
                            />
                          ))}
                          {appointments.length > 2 && (
                            <span className="text-[6px] sm:text-[8px] text-slate-400">+{appointments.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#c17f59]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Priority</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#7c9a7e]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Standard</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#b5a078]" />
                <span className="text-[10px] sm:text-xs text-slate-500">Flex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Client List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-maroon text-sm sm:text-base">Clients on Rotation</h2>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{clients.length} total</span>
              </div>
              <div className="divide-y divide-slate-50">
                {clients.length === 0 ? (
                  <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-slate-300">
                      <ICONS.Users />
                    </div>
                    <p className="text-maroon font-bold mb-2 text-sm sm:text-base">No clients yet</p>
                    <p className="text-slate-400 text-xs sm:text-sm mb-4">Add your first client to start forecasting.</p>
                    <button
                      onClick={onAddClient}
                      className="btn-primary px-4 sm:px-6 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-xs sm:text-sm font-bold"
                    >
                      Add Client
                    </button>
                  </div>
                ) : (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => onViewClient(client)}
                      className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base"
                          style={{ backgroundColor: getAvatarColor(client.name) }}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <div className="font-bold text-maroon group-hover:text-[#c17f59] transition-colors text-sm sm:text-base">{client.name}</div>
                          <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                            <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white ${ROTATION_COLORS[client.rotation].badge}`}>
                              {client.rotation}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400">{formatDate(client.nextAppointment)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maroon text-sm sm:text-base">{formatCurrency(client.annualValue)}<span className="text-slate-400 font-normal">/yr</span></div>
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${
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
          <div className="space-y-4 sm:space-y-6">
            {/* Needs Attention */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon flex items-center gap-2 text-sm sm:text-base">
                  <ICONS.Alert /> Needs Attention
                </h2>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {needsAttention.length === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-400 text-center py-3 sm:py-4">All clients are on track!</p>
                ) : (
                  needsAttention.slice(0, 3).map((client) => (
                    <div
                      key={client.id}
                      onClick={() => onViewClient(client)}
                      className="p-3 sm:p-4 bg-amber-50 rounded-lg sm:rounded-xl cursor-pointer hover:bg-amber-100 transition-colors"
                    >
                      <p className="text-xs sm:text-sm font-medium text-maroon">
                        <span className="font-bold">{client.name}</span>
                        {client.status === 'at-risk' ? ' is overdue. Reach out?' : ' needs a follow-up.'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon text-sm sm:text-base">This Month</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-500">Projected</span>
                  <span className="font-bold text-maroon text-sm sm:text-base">{formatCurrency(Math.round(stats.annualProjected / 12))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-500">Booked</span>
                  <span className="font-bold text-emerald-600 text-sm sm:text-base">{formatCurrency(Math.round(stats.confirmed / 12))}</span>
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
            <div className="bg-maroon text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ICONS.TrendingUp />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-60">Quick Action</span>
              </div>
              <p className="font-serif text-base sm:text-lg mb-3 sm:mb-4">Ready to grow your book?</p>
              <button
                onClick={onAddClient}
                className="w-full py-2.5 sm:py-3 bg-[#fff38a] text-maroon rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-all"
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
