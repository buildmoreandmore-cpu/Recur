import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup' | 'reset';

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setMessage('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess?.();
          onClose();
        }
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email to confirm your account!');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for a password reset link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-maroon text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white text-xl"
          >
            &times;
          </button>
          <h3 className="text-xl sm:text-2xl font-serif mb-1">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h3>
          <p className="text-white/70 text-sm">
            {mode === 'login' && 'Sign in to access your dashboard'}
            {mode === 'signup' && 'Start managing your clients today'}
            {mode === 'reset' && "We'll send you a reset link"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-maroon mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon disabled:opacity-50"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-bold text-maroon mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-maroon focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon disabled:opacity-50"
              />
              {mode === 'signup' && (
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 bg-maroon text-white rounded-xl font-bold text-base disabled:opacity-70 hover:bg-maroon/90 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="px-6 pb-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('reset')}
                className="text-sm text-maroon/70 hover:text-maroon"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-maroon font-bold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-maroon font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => switchMode('login')}
              className="text-sm text-maroon font-bold hover:underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
