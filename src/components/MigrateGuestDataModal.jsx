import React, { useState } from 'react';
import { migrateGuestData } from '../utils/migrateGuestData';
import { useAuth } from '../hooks/useAuth';

/**
 * Migration Modal - Prompts user to migrate localStorage data to Supabase
 */
export default function MigrateGuestDataModal({ isOpen, onClose, username }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [migrated, setMigrated] = useState(0);
  const [error, setError] = useState('');

  if (!isOpen || !user || !username) return null;

  const handleMigrate = async () => {
    setLoading(true);
    setError('');
    setMigrated(0);

    try {
      const result = await migrateGuestData(user.id, username);
      if (result.success) {
        setMigrated(result.migrated);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.errors.join(', ') || 'Migration failed');
      }
    } catch (err) {
      setError(err.message || 'Migration failed');
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
          Sync Your Data
        </h3>

        <p
          style={{
            color: 'var(--rc-muted)',
            fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
            marginBottom: 'clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
            lineHeight: '1.5'
          }}
        >
          You have local data that isn't synced yet. Would you like to upload it to your account?
        </p>

        {migrated > 0 && (
          <p style={{ color: '#4ade80', fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)', marginBottom: '1rem' }}>
            ✓ Migrated {migrated} items successfully!
          </p>
        )}

        {error && (
          <p style={{ color: '#ef4444', fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={loading || migrated > 0}
            style={{
              padding: 'clamp(0.625rem, 1.5vw + 0.25rem, 0.75rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
              background: 'transparent',
              color: 'var(--rc-text)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--rc-radius)',
              fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
              cursor: loading || migrated > 0 ? 'not-allowed' : 'pointer',
              textTransform: 'lowercase',
              opacity: loading || migrated > 0 ? 0.5 : 1
            }}
          >
            skip
          </button>
          <button
            onClick={handleMigrate}
            disabled={loading || migrated > 0}
            style={{
              padding: 'clamp(0.625rem, 1.5vw + 0.25rem, 0.75rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
              background: loading || migrated > 0 ? '#d1d5db' : 'var(--rc-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--rc-radius)',
              fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
              cursor: loading || migrated > 0 ? 'not-allowed' : 'pointer',
              textTransform: 'lowercase',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'syncing...' : migrated > 0 ? 'done' : 'sync now'}
          </button>
        </div>
      </div>
    </div>
  );
}


