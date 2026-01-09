import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Auth Modal Component - Email magic link sign-in
 * Minimal, on-brand design
 */
export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { signIn, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  if (!isSupabaseConfigured) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: 'clamp(1rem, 4vw, 2rem)',
          animation: 'fade-in 0.2s ease-in'
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rc-radius)',
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            maxWidth: 'clamp(320px, 90vw, 420px)',
            width: '100%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ color: 'var(--rc-text)', margin: 0, textAlign: 'center' }}>
            Sync is not configured. Contact support for setup.
          </p>
          <button
            onClick={onClose}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              background: 'var(--rc-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--rc-radius)',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await signIn(email);
      setMessage(result.message);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 'clamp(1rem, 4vw, 2rem)',
        animation: 'fade-in 0.2s ease-in'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--rc-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--rc-radius)',
          padding: 'clamp(1.5rem, 4vw, 2rem)',
          maxWidth: 'clamp(320px, 90vw, 420px)',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--rc-muted)',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          aria-label="Close"
        >
          ×
        </button>

        <h3
          style={{
            color: 'var(--rc-text)',
            fontSize: 'clamp(1.125rem, 3vw + 0.5rem, 1.25rem)',
            fontWeight: '600',
            marginBottom: 'clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
            marginTop: 0
          }}
        >
          Sync & Save
        </h3>

        <p
          style={{
            color: 'var(--rc-muted)',
            fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
            marginBottom: 'clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
            lineHeight: '1.5'
          }}
        >
          Sign in with your email to sync your planner across all devices.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              htmlFor="auth-email"
              style={{
                display: 'block',
                color: 'var(--rc-text)',
                fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
                marginBottom: '0.5rem'
              }}
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading || !!message}
              style={{
                width: '100%',
                padding: 'clamp(0.75rem, 2vw + 0.25rem, 0.875rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                borderRadius: 'var(--rc-radius)',
                color: 'var(--rc-text)',
                fontSize: 'clamp(0.9375rem, 2.5vw + 0.25rem, 1rem)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--rc-accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rc-accent) 20%, transparent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 0.8125rem)', margin: 0 }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: 'var(--rc-accent)', fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 0.8125rem)', margin: 0 }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !!message}
            style={{
              width: '100%',
              padding: 'clamp(0.875rem, 2.5vw + 0.5rem, 1rem) clamp(1.25rem, 3vw + 0.5rem, 1.5rem)',
              background: loading || message ? '#d1d5db' : 'var(--rc-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--rc-radius)',
              fontSize: 'clamp(0.9375rem, 2.5vw + 0.25rem, 1rem)',
              cursor: loading || message ? 'not-allowed' : 'pointer',
              textTransform: 'lowercase',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'sending...' : message ? 'check your email' : 'send magic link'}
          </button>
        </form>
      </div>
    </div>
  );
}

