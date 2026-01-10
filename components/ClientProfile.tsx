import React from 'react';
import { Client, RotationType } from '../types';
import { ICONS } from '../constants';

interface ClientProfileProps {
  client: Client;
  onBack: () => void;
  onEdit?: () => void;
  onBookAppointment?: () => void;
  onMarkOverdue?: () => void;
  onArchive?: () => void;
}

const ROTATION_COLORS = {
  [RotationType.PRIORITY]: { bg: 'bg-[#c17f59]/10', text: 'text-[#c17f59]', badge: 'bg-[#c17f59]' },
  [RotationType.STANDARD]: { bg: 'bg-[#7c9a7e]/10', text: 'text-[#7c9a7e]', badge: 'bg-[#7c9a7e]' },
  [RotationType.FLEX]: { bg: 'bg-[#b5a078]/10', text: 'text-[#b5a078]', badge: 'bg-[#b5a078]' },
};

const AVATAR_COLORS = ['#c17f59', '#7c9a7e', '#b5a078', '#6b7c91', '#a67c8e'];

export const ClientProfile: React.FC<ClientProfileProps> = ({ client, onBack, onEdit, onBookAppointment, onMarkOverdue, onArchive }) => {
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
      default:
        return <span className="text-slate-400">○</span>;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${ROTATION_COLORS[client.rotation].badge}`}>
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
          {/* Service Roadmap */}
          <div className="space-y-6">
            {/* Service Roadmap */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Service Roadmap</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {client.appointments && client.appointments.length > 0 ? (
                  client.appointments.map((apt, i) => (
                    <div key={i} className={`px-6 py-4 flex items-center justify-between ${apt.status === 'completed' ? 'bg-slate-50/50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center">
                          {getStatusIcon(apt.status)}
                        </div>
                        <div>
                          <div className="font-bold text-maroon">{formatShortDate(apt.date)}</div>
                          <div className="text-sm text-slate-500">{apt.service}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-maroon">{formatCurrency(apt.price)}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${
                          apt.status === 'completed' ? 'text-emerald-500' :
                          apt.status === 'upcoming' ? 'text-[#c17f59]' :
                          apt.status === 'event' ? 'text-amber-500' :
                          'text-slate-400'
                        }`}>
                          {apt.status === 'event' ? 'Event' : apt.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-slate-400">
                    No appointments scheduled yet.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            {client.events && client.events.length > 0 && (
              <div className="bg-[#fff38a]/30 rounded-2xl p-6">
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
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Details</h2>
              </div>
              <div className="p-6 space-y-4">
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
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Lifestyle Notes</h2>
              </div>
              <div className="p-6 space-y-4">
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

            {/* Hair Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">Hair Notes</h2>
              </div>
              <div className="p-6 space-y-4">
                {client.naturalColor && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Natural Color</div>
                    <div className="text-maroon">{client.naturalColor}</div>
                  </div>
                )}
                {client.currentColor && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Color</div>
                    <div className="text-maroon">{client.currentColor}</div>
                  </div>
                )}
                {client.concerns && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Concerns</div>
                    <div className="text-maroon">{client.concerns}</div>
                  </div>
                )}
                {client.allergies && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allergies</div>
                    <div className="text-maroon">{client.allergies}</div>
                  </div>
                )}
                {client.hairGoal && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Goal</div>
                    <div className="text-maroon">{client.hairGoal}</div>
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-maroon">History</h2>
              </div>
              <div className="p-6 space-y-4">
                {client.lastColor && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Color</div>
                    <div className="text-maroon">{formatDate(client.lastColor)}</div>
                  </div>
                )}
                {client.lastCut && (
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
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">What Failed</div>
                    <div className="text-maroon">{client.whatFailed}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onBookAppointment}
              className="btn-primary flex-1 md:flex-none px-8 py-4 bg-maroon text-white rounded-xl font-bold"
            >
              Book Next Appointment
            </button>
            <button
              onClick={onMarkOverdue}
              className="flex-1 md:flex-none px-6 py-4 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-all"
            >
              Mark Overdue
            </button>
            <button
              onClick={onArchive}
              className="flex-1 md:flex-none px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
            >
              Archive Client
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
