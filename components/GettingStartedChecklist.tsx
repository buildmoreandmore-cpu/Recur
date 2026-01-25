import React, { useState, useEffect } from 'react';
import { StylistProfile, Client } from '../types';

interface GettingStartedChecklistProps {
  profile: StylistProfile;
  clients: Client[];
  onSetupProfile?: () => void;
  onSetupServices?: () => void;
  onAddClient?: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

const STORAGE_KEY = 'recur_checklist_dismissed';

export const GettingStartedChecklist: React.FC<GettingStartedChecklistProps> = ({
  profile,
  clients,
  onSetupProfile,
  onSetupServices,
  onAddClient,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  // Determine completion status
  const hasProfile = Boolean(profile.name && profile.businessName);
  const hasServices = profile.services && profile.services.length > 0;
  const hasClients = clients.length > 0;
  const hasAppointment = clients.some(c => c.appointments && c.appointments.length > 0);

  const items: ChecklistItem[] = [
    {
      id: 'profile',
      label: 'Complete your profile',
      completed: hasProfile,
      action: onSetupProfile,
      actionLabel: 'Set up',
    },
    {
      id: 'services',
      label: 'Set up your services',
      completed: hasServices,
      action: onSetupServices,
      actionLabel: 'Add services',
    },
    {
      id: 'client',
      label: 'Add your first client',
      completed: hasClients,
      action: onAddClient,
      actionLabel: 'Add client',
    },
    {
      id: 'appointment',
      label: 'Book your first appointment',
      completed: hasAppointment,
    },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const allComplete = completedCount === items.length;

  // Don't show if dismissed or all complete
  if (dismissed || allComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-maroon/5 to-transparent hover:from-maroon/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-maroon">Getting Started</h3>
            <p className="text-xs text-maroon/60">{completedCount} of {items.length} complete</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-1">
            {items.map((item, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
          <svg
            className={`w-5 h-5 text-maroon/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                item.completed ? 'bg-emerald-50' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-300'
                  }`}
                >
                  {item.completed && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    item.completed ? 'text-emerald-700 line-through' : 'text-maroon'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {!item.completed && item.action && (
                <button
                  onClick={item.action}
                  className="text-xs font-bold text-maroon hover:text-maroon/70 px-3 py-1.5 bg-white rounded-lg border border-slate-200 hover:border-maroon/30 transition-colors"
                >
                  {item.actionLabel}
                </button>
              )}
            </div>
          ))}

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="w-full mt-2 text-xs text-slate-400 hover:text-slate-600 py-2 transition-colors"
          >
            Dismiss checklist
          </button>
        </div>
      )}
    </div>
  );
};
