import React, { useState } from 'react';
import { Client, RotationType, IndustryType, StylistProfile, Appointment, PaymentMethod, MissedReason } from '../types';
import { ICONS, PAYMENT_METHODS, MISSED_REASONS } from '../constants';
import { generateClientAppointmentsICS, downloadICS } from '../lib/calendar';

interface ClientProfileProps {
  client: Client;
  industry: IndustryType;
  professional?: StylistProfile;
  onBack: () => void;
  onEdit?: () => void;
  onBookAppointment?: () => void;
  onMarkOverdue?: () => void;
  onArchive?: () => void;
  // New appointment management handlers
  onUpdateAppointment?: (appointmentDate: string, updates: Partial<Appointment>) => void;
}

const ROTATION_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]' },
  [RotationType.CUSTOM]: { bg: 'bg-[#6b7c91]/10', text: 'text-[#6b7c91]', badge: 'bg-[#6b7c91]' },
};

const getRotationColor = (rotation: RotationType | string) => {
  return ROTATION_COLORS[rotation] || ROTATION_COLORS[RotationType.STANDARD];
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const ClientProfile: React.FC<ClientProfileProps> = ({ client, industry, professional, onBack, onEdit, onBookAppointment, onMarkOverdue, onArchive, onUpdateAppointment }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarExporting, setCalendarExporting] = useState(false);

  // Edit appointment modal state
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod | null>(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState<string>('');
  const [editPaymentNote, setEditPaymentNote] = useState<string>('');
  const [editStatus, setEditStatus] = useState<Appointment['status']>('completed');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isHairIndustry = industry === 'hair-stylist';
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getAvatarColor = (name: string) => AVATAR_COLORS[name.length % AVATAR_COLORS.length];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-emerald-500">✓</span>;
      case 'upcoming':
        return <span className="text-[#c17f59]">○</span>;
      case 'scheduled':
        return <span className="text-slate-400">○</span>;
      case 'event':
        return <span className="text-[#fff38a]">★</span>;
      case 'no-show':
        return <span className="text-red-500">✗</span>;
      case 'cancelled':
        return <span className="text-slate-400">⊘</span>;
      case 'late-cancel':
        return <span className="text-amber-500">⏰</span>;
      default:
        return <span className="text-slate-400">○</span>;
    }
  };

  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    if (!method) return null;
    const pm = PAYMENT_METHODS.find(m => m.id === method);
    return pm ? `${pm.icon} ${pm.label}` : method;
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return client.appointments?.find(apt => {
      const aptDate = apt.date.split('T')[0];
      return aptDate === dateStr;
    });
  };

  const getEventForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return client.events?.find(event => {
      const eventDate = event.date.split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Calculate future appointments based on rotation
  const getFutureAppointments = () => {
    const appointments: Date[] = [];
    if (!client.nextAppointment) return appointments;

    let nextDate = new Date(client.nextAppointment);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // Show 6 months ahead

    while (nextDate <= endDate) {
      appointments.push(new Date(nextDate));
      nextDate = new Date(nextDate);
      nextDate.setDate(nextDate.getDate() + (client.rotationWeeks * 7));
    }
    return appointments;
  };

  const isFutureAppointment = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getFutureAppointments().some(apt => {
      const aptDate = `${apt.getFullYear()}-${String(apt.getMonth() + 1).padStart(2, '0')}-${String(apt.getDate()).padStart(2, '0')}`;
      return aptDate === dateStr;
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-maroon/60 hover:text-maroon flex items-center gap-2 text-sm font-medium">
            ← Back to Dashboard
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-bold text-maroon hover:bg-slate-100 rounded-xl transition-all"
          >
            Edit
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: getAvatarColor(client.name) }}
            >
              {getInitials(client.name)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif text-maroon">{client.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${getRotationColor(client.rotation).badge}`}>
                  {client.rotation}
                </span>
              </div>
              <p className="text-maroon/60 mb-4">Client since {formatDate(client.clientSince)}</p>
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Value</div>
                  <div className="text-2xl font-serif text-maroon">{formatCurrency(client.annualValue)}</div>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rotation</div>
                  <div className="text-2xl font-serif text-maroon">{client.rotationWeeks} weeks</div>
                </div>
              </div>
              {/* Quick Contact Buttons */}
              {client.phone && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <a
                    href={`tel:${client.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </a>
                  <a
                    href={`sms:${client.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Text
                  </a>
                  <a
                    href={`sms:${client.phone.replace(/[^0-9+]/g, '')}?body=Hi ${client.name.split(' ')[0]}! Just a friendly reminder about your upcoming appointment. Let me know if you need to reschedule.`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#c17f59] text-white rounded-xl text-sm font-bold hover:bg-[#a86b48] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Send Reminder
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Client Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-maroon flex items-center gap-2">
                  <svg className="w-4 h-4 text-maroon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {client.name.split(' ')[0]}'s Calendar
                </h2>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors text-maroon/60 hover:text-maroon"
                  >
                    ←
                  </button>
                  <span className="font-medium text-maroon min-w-[100px] sm:min-w-[130px] text-center text-xs sm:text-sm">{monthName}</span>
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
                    const appointment = getAppointmentForDate(day);
                    const event = getEventForDate(day);
                    const hasFutureAppt = isFutureAppointment(day);
                    const isToday = isCurrentMonth && today.getDate() === day;

                    return (
                      <div
                        key={day}
                        className={`aspect-square p-0.5 sm:p-1 rounded-md sm:rounded-lg transition-colors relative ${
                          isToday ? 'bg-maroon/10 ring-1 sm:ring-2 ring-maroon' : ''
                        } ${appointment ? (appointment.status === 'completed' ? 'bg-emerald-50' : 'bg-[#c17f59]/10') : ''} ${
                          event ? 'bg-amber-50' : ''
                        } ${hasFutureAppt && !appointment ? 'bg-[#7c9a7e]/10' : ''}`}
                      >
                        <div className="h-full flex flex-col items-center">
                          <span className={`text-xs sm:text-sm font-medium ${
                            isToday ? 'text-maroon font-bold' :
                            appointment ? (appointment.status === 'completed' ? 'text-emerald-600' : 'text-[#c17f59]') :
                            event ? 'text-amber-600' :
                            hasFutureAppt ? 'text-[#7c9a7e]' :
                            'text-slate-600'
                          }`}>
                            {day}
                          </span>
                          {/* Indicators */}
                          <div className="flex gap-0.5 mt-0.5">
                            {appointment && (
                              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                appointment.status === 'completed' ? 'bg-emerald-500' : 'bg-[#c17f59]'
                              }`} title={appointment.service} />
                            )}
                            {event && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500" title={event.name} />
                            )}
                            {hasFutureAppt && !appointment && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#7c9a7e]/50 border border-[#7c9a7e]" title="Projected visit" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-500">Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#c17f59]" />
                    <span className="text-slate-500">Upcoming</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#7c9a7e]/50 border border-[#7c9a7e]" />
                    <span className="text-slate-500">Projected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500" />
                    <span className="text-slate-500">Event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Roadmap */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-maroon">Service Roadmap</h2>
                {client.appointments && client.appointments.length > 0 && (
                  <button
                    onClick={() => {
                      setCalendarExporting(true);
                      try {
                        const defaultProfile: StylistProfile = {
                          name: '',
                          businessName: 'Recur',
                          phone: '',
                          email: '',
                          location: '',
                          yearsInBusiness: 0,
                          specialties: [],
                          services: [],
                          defaultRotation: 8,
                          annualGoal: 0,
                          monthlyGoal: 0,
                        };
                        const icsContent = generateClientAppointmentsICS(client, professional || defaultProfile);
                        if (icsContent) {
                          const filename = `${client.name.replace(/\s+/g, '-').toLowerCase()}-appointments.ics`;
                          downloadICS(icsContent, filename);
                        }
                      } catch (err) {
                        console.error('Failed to generate calendar file:', err);
                      }
                      setCalendarExporting(false);
                    }}
                    disabled={calendarExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#7c9a7e] hover:bg-[#7c9a7e]/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2}/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v4m0 0l-2-2m2 2l2-2" />
                    </svg>
                    {calendarExporting ? 'Exporting...' : 'Add to Calendar'}
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-50">
                {client.appointments && client.appointments.length > 0 ? (
                  client.appointments.map((apt, i) => (
                    <div
                      key={i}
                      className={`px-4 sm:px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                        apt.status === 'completed' ? 'bg-slate-50/50' :
                        apt.status === 'no-show' || apt.status === 'cancelled' || apt.status === 'late-cancel' ? 'bg-red-50/30' : ''
                      }`}
                      onClick={() => {
                        setEditingAppointment(apt);
                        setEditPaymentMethod(apt.paymentMethod || null);
                        setEditPaymentAmount((apt.paymentAmount ?? apt.price).toString());
                        setEditPaymentNote(apt.paymentNote || '');
                        setEditStatus(apt.status);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center">
                          {getStatusIcon(apt.status)}
                        </div>
                        <div>
                          <div className="font-bold text-maroon">{formatShortDate(apt.date)}</div>
                          <div className="text-sm text-slate-500">{apt.service}</div>
                          {/* Show payment method for completed appointments */}
                          {apt.status === 'completed' && apt.paymentMethod && (
                            <div className="text-xs text-emerald-600 mt-0.5">
                              Paid: {getPaymentMethodLabel(apt.paymentMethod)}
                              {apt.paymentNote && <span className="text-slate-400"> ({apt.paymentNote})</span>}
                            </div>
                          )}
                          {/* Show missed reason for no-shows */}
                          {(apt.status === 'no-show' || apt.status === 'cancelled' || apt.status === 'late-cancel') && (
                            <div className="text-xs text-red-500 mt-0.5">
                              {MISSED_REASONS.find(r => r.id === apt.missedReason)?.label || apt.status}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className={`font-bold ${
                            apt.status === 'no-show' || apt.status === 'cancelled' ? 'text-slate-400 line-through' : 'text-maroon'
                          }`}>
                            {formatCurrency(apt.paymentAmount ?? apt.price)}
                          </div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'completed' ? 'text-emerald-500' :
                            apt.status === 'upcoming' ? 'text-[#c17f59]' :
                            apt.status === 'event' ? 'text-amber-500' :
                            apt.status === 'no-show' || apt.status === 'cancelled' || apt.status === 'late-cancel' ? 'text-red-500' :
                            'text-slate-400'
                          }`}>
                            {apt.status === 'event' ? 'Event' : apt.status}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 sm:px-6 py-8 text-center text-slate-400">
                    No appointments scheduled yet.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            {client.events && client.events.length > 0 && (
              <div className="bg-[#fff38a]/30 rounded-2xl p-4 sm:p-6">
                <h3 className="font-bold text-maroon mb-4 flex items-center gap-2">
                  <ICONS.Sparkle /> Upcoming Events
                </h3>
                <div className="space-y-3">
                  {client.events.map((event, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-bold text-maroon">{formatShortDate(event.date)}</span>
                      <span className="text-maroon/70">— {event.name}</span>
                      {event.service && (
                        <span className="text-maroon/50">({event.service.name})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Details</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {client.baseService && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Base Service</div>
                    <div className="text-maroon">{client.baseService.name} — {formatCurrency(client.baseService.price)}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rotation</div>
                  <div className="text-maroon">{client.rotationWeeks} weeks ({client.rotation})</div>
                </div>
                {client.addOns && client.addOns.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Regular Add-Ons</div>
                    <div className="text-maroon">{client.addOns.map(a => a.service.name).join(', ')}</div>
                  </div>
                )}
                {client.preferredDays && client.preferredDays.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Days</div>
                    <div className="text-maroon">{client.preferredDays.join(', ')}</div>
                  </div>
                )}
                {client.preferredTime && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Time</div>
                    <div className="text-maroon">{client.preferredTime}</div>
                  </div>
                )}
                {client.contactMethod && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</div>
                    <div className="text-maroon">{client.contactMethod}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Lifestyle Notes</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {client.occupation && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Occupation</div>
                    <div className="text-maroon">{client.occupation}</div>
                  </div>
                )}
                {client.morningTime && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Morning Time</div>
                    <div className="text-maroon">{client.morningTime}</div>
                  </div>
                )}
                {client.photographed && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Photographed</div>
                    <div className="text-maroon">{client.photographed}</div>
                  </div>
                )}
                {client.maintenanceLevel && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Maintenance Level</div>
                    <div className="text-maroon">{client.maintenanceLevel}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Client Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Client Notes</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Hair-specific fields */}
                {isHairIndustry && client.naturalColor && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Natural Color</div>
                    <div className="text-maroon">{client.naturalColor}</div>
                  </div>
                )}
                {isHairIndustry && client.currentColor && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Color</div>
                    <div className="text-maroon">{client.currentColor}</div>
                  </div>
                )}
                {/* Universal fields */}
                {(client.serviceGoal || client.hairGoal) && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Goal</div>
                    <div className="text-maroon">{client.serviceGoal || client.hairGoal}</div>
                  </div>
                )}
                {client.concerns && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {isHairIndustry ? 'Concerns' : 'Notes / Concerns'}
                    </div>
                    <div className="text-maroon">{client.concerns}</div>
                  </div>
                )}
                {client.additionalNotes && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Additional Notes</div>
                    <div className="text-maroon">{client.additionalNotes}</div>
                  </div>
                )}
                {isHairIndustry && client.allergies && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allergies</div>
                    <div className="text-maroon">{client.allergies}</div>
                  </div>
                )}
              </div>
            </div>

            {/* History - only show if there's content */}
            {(isHairIndustry && (client.lastColor || client.lastCut)) || client.whatWorks || client.whatFailed ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-maroon">History</h2>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {isHairIndustry && client.lastColor && (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Color</div>
                      <div className="text-maroon">{formatDate(client.lastColor)}</div>
                    </div>
                  )}
                  {isHairIndustry && client.lastCut && (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Cut</div>
                      <div className="text-maroon">{formatDate(client.lastCut)}</div>
                    </div>
                  )}
                  {client.whatWorks && (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">What Works</div>
                      <div className="text-maroon">{client.whatWorks}</div>
                    </div>
                  )}
                  {client.whatFailed && (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">What Didn't Work</div>
                      <div className="text-maroon">{client.whatFailed}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
            <button
              onClick={onBookAppointment}
              className="btn-primary flex-1 md:flex-none px-4 sm:px-8 py-3 sm:py-4 bg-maroon text-white rounded-xl font-bold text-sm sm:text-base"
            >
              Book Next Appointment
            </button>
            <button
              onClick={onMarkOverdue}
              className="flex-1 md:flex-none px-3 sm:px-6 py-3 sm:py-4 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-all text-sm sm:text-base"
            >
              Mark Overdue
            </button>
            <button
              onClick={onArchive}
              className="flex-1 md:flex-none px-3 sm:px-6 py-3 sm:py-4 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all text-sm sm:text-base"
            >
              Archive Client
            </button>
          </div>

          {/* Payment Actions (Demo Preview) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Actions</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C4B5A4]/30 text-maroon/70">Coming Soon</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                disabled
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                title="Connect Square in settings to enable"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Send Invoice
              </button>
              <button
                disabled
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                title="Connect Square in settings to enable"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Charge Card on File
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Connect Square in settings to enable payments.</p>
          </div>
        </div>
      </main>

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditingAppointment(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-600 to-slate-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl">Edit Appointment</h3>
                  <p className="text-white/80 text-sm">
                    {formatDate(editingAppointment.date)} • {editingAppointment.service}
                  </p>
                </div>
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Status Selection */}
              <div className="mb-6">
                <h4 className="font-bold text-maroon text-sm mb-3">Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'completed', label: 'Completed', icon: '✓', color: 'emerald' },
                    { id: 'no-show', label: 'No-Show', icon: '✗', color: 'red' },
                    { id: 'cancelled', label: 'Cancelled', icon: '⊘', color: 'slate' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setEditStatus(s.id as Appointment['status'])}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                        editStatus === s.id
                          ? `border-${s.color}-500 bg-${s.color}-50`
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-xs font-medium text-maroon">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection (only for completed) */}
              {editStatus === 'completed' && (
                <div className="mb-6">
                  <h4 className="font-bold text-maroon text-sm mb-3">Payment Method</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setEditPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                          editPaymentMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-xs font-medium text-maroon">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount and Note (only for completed) */}
              {editStatus === 'completed' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Amount Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input
                        type="number"
                        value={editPaymentAmount}
                        onChange={(e) => setEditPaymentAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-maroon font-medium"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Note (optional)
                    </label>
                    <input
                      type="text"
                      value={editPaymentNote}
                      onChange={(e) => setEditPaymentNote(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-maroon"
                      placeholder="Tipped $20..."
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="flex-1 py-3 border-2 border-slate-200 text-maroon font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onUpdateAppointment) {
                      const updates: Partial<Appointment> = {
                        status: editStatus,
                        updatedAt: new Date().toISOString(),
                      };
                      if (editStatus === 'completed') {
                        updates.paymentMethod = editPaymentMethod || undefined;
                        updates.paymentAmount = parseFloat(editPaymentAmount) || editingAppointment.price;
                        updates.paymentNote = editPaymentNote || undefined;
                        updates.completedAt = new Date().toISOString();
                      }
                      onUpdateAppointment(editingAppointment.date, updates);
                    }
                    showToast(`Appointment updated to ${editStatus}`);
                    setEditingAppointment(null);
                  }}
                  className="flex-1 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>

              {/* Audit trail */}
              {editingAppointment.updatedAt && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  Last updated: {formatDate(editingAppointment.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-slate-800 text-white'
        }`}>
          {toast.type === 'success' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
};
