import React, { useState } from 'react';
import { Client, RotationType, StylistProfile } from '../types';
import { ICONS, LOGOS } from '../constants';

interface AppDashboardProps {
  profile: StylistProfile;
  clients: Client[];
  onAddClient: () => void;
  onViewClient: (client: Client) => void;
  onBack: () => void;
  onExitDemo?: () => void;
  onLogoClick?: () => void;
}

const ROTATION_COLORS = {
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]', hex: '#c17f59' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]', hex: '#7c9a7e' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]', hex: '#b5a078' },
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const AppDashboard: React.FC<AppDashboardProps> = ({ profile, clients, onAddClient, onViewClient, onBack, onExitDemo, onLogoClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ day: number; appointments: Client[] } | null>(null);
  const [bookingClient, setBookingClient] = useState<Client | null>(null);

  const stats = {
    annualProjected: clients.reduce((sum, c) => sum + c.annualValue, 0),
    confirmed: clients.filter(c => c.status === 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
    pending: clients.filter(c => c.status !== 'confirmed').reduce((sum, c) => sum + c.annualValue, 0),
  };

  const needsAttention = clients.filter(c => c.status === 'at-risk' || c.status === 'pending');

  // Intelligent scheduling helpers
  const getNextSuggestedDate = (client: Client) => {
    const lastAppointment = new Date(client.nextAppointment);
    const suggestedDate = new Date(lastAppointment);
    suggestedDate.setDate(suggestedDate.getDate() + (client.rotationWeeks * 7));

    // Adjust to preferred day if set
    if (client.preferredDays && client.preferredDays.length > 0) {
      const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
      const preferredDayNum = dayMap[client.preferredDays[0]];
      if (preferredDayNum !== undefined) {
        const currentDay = suggestedDate.getDay();
        const daysToAdd = (preferredDayNum - currentDay + 7) % 7;
        if (daysToAdd > 0) suggestedDate.setDate(suggestedDate.getDate() + daysToAdd);
      }
    }
    return suggestedDate;
  };

  const isOverdue = (client: Client) => {
    const lastAppointment = new Date(client.nextAppointment);
    const dueDate = new Date(lastAppointment);
    dueDate.setDate(dueDate.getDate() + (client.rotationWeeks * 7));
    return new Date() > dueDate;
  };

  const overdueClients = clients.filter(c => isOverdue(c));

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
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:opacity-80 transition-all"
          >
            <div className="text-maroon">
              <LOGOS.Main />
            </div>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onExitDemo || onBack}
              className="px-3 sm:px-4 py-2 text-maroon/70 hover:text-maroon hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-medium transition-all"
            >
              Exit Demo
            </button>
            <button
              onClick={onAddClient}
              className="btn-primary px-3 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2"
            >
              <span className="text-base sm:text-lg">+</span> <span className="hidden sm:inline">Add</span> Client
            </button>
          </div>
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
            {profile.annualGoal && profile.annualGoal > 0 ? (
              <>
                <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2">Goal Progress</div>
                <div className="text-2xl sm:text-3xl font-serif number-animate">{formatCurrency(stats.annualProjected)}</div>
                <div className="mt-2 sm:mt-3">
                  <div className="flex justify-between text-[10px] font-bold opacity-70 mb-1">
                    <span>Goal: {formatCurrency(profile.annualGoal)}</span>
                    <span>{Math.round((stats.annualProjected / profile.annualGoal) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${Math.min((stats.annualProjected / profile.annualGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1 sm:mb-2">Annual Forecast</div>
                <div className="text-2xl sm:text-3xl font-serif number-animate">{formatCurrency(stats.annualProjected)}</div>
                <div className="text-emerald-400 text-xs font-bold mt-1 sm:mt-2 flex items-center gap-1">
                  <ICONS.TrendingUp /> {clients.length} clients on rotation
                </div>
              </>
            )}
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
                const hasAppointments = appointments.length > 0;

                return (
                  <div
                    key={day}
                    onClick={() => hasAppointments && setSelectedDay({ day, appointments })}
                    className={`aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-colors ${
                      isToday ? 'bg-maroon/10 ring-1 sm:ring-2 ring-maroon' : ''
                    } ${hasAppointments ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer' : ''}`}
                  >
                    <div className="h-full flex flex-col">
                      <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-maroon font-bold' : 'text-slate-600'}`}>
                        {day}
                      </span>
                      {hasAppointments && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 sm:mt-1">
                          {appointments.slice(0, 2).map((client) => (
                            <div
                              key={client.id}
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
                  clients.map((client) => {
                    const clientOverdue = isOverdue(client);
                    return (
                      <div
                        key={client.id}
                        className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group ${clientOverdue ? 'bg-orange-50/50' : ''}`}
                      >
                        <div
                          className="flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer"
                          onClick={() => onViewClient(client)}
                        >
                          <div className="relative">
                            <div
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base"
                              style={{ backgroundColor: getAvatarColor(client.name) }}
                            >
                              {getInitials(client.name)}
                            </div>
                            {clientOverdue && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-maroon group-hover:text-[#c17f59] transition-colors text-sm sm:text-base">{client.name}</div>
                            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white ${ROTATION_COLORS[client.rotation].badge}`}>
                                {client.rotation}
                              </span>
                              {clientOverdue ? (
                                <span className="text-[10px] sm:text-[11px] text-orange-500 font-bold">Overdue</span>
                              ) : (
                                <span className="text-[10px] sm:text-[11px] text-slate-400">{formatDate(client.nextAppointment)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingClient(client);
                            }}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#7c9a7e] text-white rounded-lg text-xs font-bold hover:bg-[#6b8a6d] transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                              <path d="M9 16l2 2 4-4"/>
                            </svg>
                            Quick Book
                          </button>
                          <div className="text-right">
                            <div className="font-bold text-maroon text-sm sm:text-base">{formatCurrency(client.annualValue)}<span className="text-slate-400 font-normal">/yr</span></div>
                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${
                              clientOverdue ? 'text-orange-500' :
                              client.status === 'confirmed' ? 'text-emerald-500' :
                              client.status === 'at-risk' ? 'text-orange-500' : 'text-slate-400'
                            }`}>
                              {clientOverdue ? 'Overdue' : client.status === 'at-risk' ? 'At Risk' : client.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Overdue Alerts */}
            {overdueClients.length > 0 && (
              <div className="bg-orange-50 rounded-xl sm:rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-200 bg-orange-100">
                  <h2 className="font-bold text-orange-700 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Overdue Alerts
                    <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{overdueClients.length}</span>
                  </h2>
                </div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {overdueClients.slice(0, 3).map((client) => (
                    <div
                      key={client.id}
                      className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-orange-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-maroon text-sm">{client.name}</span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          {client.rotationWeeks}wk rotation
                        </span>
                      </div>
                      <p className="text-xs text-maroon/60 mb-3">
                        Last visit: {formatDate(client.nextAppointment)}
                      </p>
                      <button
                        onClick={() => setBookingClient(client)}
                        className="w-full py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                          <path d="M9 16l2 2 4-4"/>
                        </svg>
                        Schedule Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

      {/* Day Appointments Modal */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white w-full sm:w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-cream">
              <div>
                <h3 className="font-bold text-maroon text-lg">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long' })} {selectedDay.day}
                </h3>
                <p className="text-sm text-maroon/60">{selectedDay.appointments.length} appointment{selectedDay.appointments.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-maroon/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Appointments List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {selectedDay.appointments.map((client) => (
                <div key={client.id} className="p-4 sm:p-5 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(client.name) }}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-maroon text-base sm:text-lg truncate">{client.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase text-white"
                          style={{ backgroundColor: ROTATION_COLORS[client.rotation].hex }}
                        >
                          {client.rotation}
                        </span>
                        <span className="text-sm text-slate-500">{client.baseService?.name}</span>
                      </div>
                      <p className="text-sm text-maroon/60 mt-1">{formatCurrency(client.baseService?.price || 0)}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {client.phone && (
                    <div className="flex gap-2 mt-3">
                      <a
                        href={`tel:${client.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                      <a
                        href={`sms:${client.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Text
                      </a>
                      <a
                        href={`sms:${client.phone.replace(/[^0-9+]/g, '')}?body=Hi ${client.name.split(' ')[0]}! Just a reminder about your appointment on ${currentMonth.toLocaleDateString('en-US', { month: 'long' })} ${selectedDay.day}. See you soon!`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#c17f59] text-white rounded-xl text-sm font-bold hover:bg-[#a86b48] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Remind
                      </a>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <button
                    onClick={() => {
                      setSelectedDay(null);
                      onViewClient(client);
                    }}
                    className="w-full mt-3 py-2.5 text-maroon font-medium text-sm hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                  >
                    View Full Profile →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Booking Modal */}
      {bookingClient && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setBookingClient(null)}
        >
          <div
            className="bg-white w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#7c9a7e] to-[#6b8a6d]">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                      <path d="M9 16l2 2 4-4"/>
                    </svg>
                    Smart Scheduling
                  </div>
                  <h3 className="font-bold text-lg">Book {bookingClient.name.split(' ')[0]}'s Next Visit</h3>
                </div>
                <button
                  onClick={() => setBookingClient(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh] p-4 sm:p-6 space-y-5">
              {/* Pre-calculated Date */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Date (based on {bookingClient.rotationWeeks}-week rotation)
                </label>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-700 text-lg">
                        {getNextSuggestedDate(bookingClient).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Auto-calculated from last visit + {bookingClient.rotationWeeks} weeks
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remembered Preferences */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Remembered Preferences
                </label>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 font-medium">Preferred Time</div>
                      <div className="font-bold text-blue-700">{bookingClient.preferredTime || 'Any time'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 font-medium">Preferred Days</div>
                      <div className="font-bold text-blue-700">
                        {bookingClient.preferredDays?.length > 0 ? bookingClient.preferredDays.join(', ') : 'Any day'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-selected Services */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pre-selected Services
                </label>
                <div className="space-y-2">
                  {bookingClient.baseService && (
                    <div className="flex items-center justify-between p-3 bg-[#c17f59]/10 border-2 border-[#c17f59]/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#c17f59] rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-maroon">{bookingClient.baseService.name}</span>
                      </div>
                      <span className="font-bold text-[#c17f59]">{formatCurrency(bookingClient.baseService.price)}</span>
                    </div>
                  )}
                  {bookingClient.addOns?.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-400 rounded-md flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-maroon">{addon.service.name}</span>
                        <span className="text-xs text-slate-400">({addon.frequency})</span>
                      </div>
                      <span className="font-bold text-slate-600">{formatCurrency(addon.service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Estimated Total</span>
                  <span className="font-bold text-maroon text-lg">
                    {formatCurrency(
                      (bookingClient.baseService?.price || 0) +
                      (bookingClient.addOns?.reduce((sum, a) => sum + a.service.price, 0) || 0)
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic">
                  All preferences pre-filled from client profile. Just confirm to book.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setBookingClient(null)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Demo: Appointment booked for ${bookingClient.name} on ${getNextSuggestedDate(bookingClient).toLocaleDateString()}`);
                    setBookingClient(null);
                  }}
                  className="flex-1 py-3 bg-[#7c9a7e] text-white font-bold rounded-xl hover:bg-[#6b8a6d] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
