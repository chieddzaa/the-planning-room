import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

/**
 * Sync Status Component - Shows auth status and sync button
 * Minimal, on-brand design
 */
export default function SyncStatus() {
  const { user, signOut, isAuthenticated, isSupabaseConfigured, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Don't render while loading or if Supabase isn't configured
  if (loading || !isSupabaseConfigured) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--rc-radius)',
          background: isAuthenticated ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isAuthenticated ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
        }}
      >
        {isAuthenticated ? (
          <>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)'
              }}
            />
            <span
              className="pixel-label"
              style={{
                color: 'var(--rc-text)',
                fontSize: 'clamp(0.625rem, 1.5vw + 0.125rem, 0.75rem)',
                opacity: 0.8
              }}
            >
              SYNCED
            </span>
            <span
              style={{
                color: 'var(--rc-muted)',
                fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)',
                opacity: 0.7
              }}
            >
              {user?.email}
            </span>
            <button
              onClick={signOut}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--rc-muted)',
                cursor: 'pointer',
                fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              sign out
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fbbf24',
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
              }}
            />
            <span
              className="pixel-label"
              style={{
                color: 'var(--rc-text)',
                fontSize: 'clamp(0.625rem, 1.5vw + 0.125rem, 0.75rem)',
                opacity: 0.8
              }}
            >
              OFFLINE
            </span>
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                marginLeft: 'auto',
                background: 'var(--rc-accent)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--rc-radius)',
                textTransform: 'lowercase',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px color-mix(in srgb, var(--rc-accent) 30%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              sync & save
            </button>
          </>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Optionally refresh data or show success message
        }}
      />
    </>
  );
}


