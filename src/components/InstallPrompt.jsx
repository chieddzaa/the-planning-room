import React, { useState, useEffect } from 'react';

/**
 * Install Prompt Component
 * Shows install button when browser supports PWA install
 * Shows iOS instructions for Safari
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed (Android)
    const checkInstalled = async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          // Check localStorage flag
          const wasInstalled = localStorage.getItem('pwa-installed');
          if (!wasInstalled) {
            setShowInstall(true);
          }
        }
      }
    };

    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed recently (24 hours)
  const dismissedTime = localStorage.getItem('pwa-dismissed');
  if (dismissedTime) {
    const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
    if (hoursSinceDismissed < 24) {
      return null;
    }
  }

  if (isInstalled || (!showInstall && !showIOSModal)) {
    return null;
  }

  return (
    <>
      {/* Install Button - Floating bottom right */}
      {showInstall && (
        <div
          style={{
            position: 'fixed',
            bottom: 'clamp(1rem, 4vw, 2rem)',
            right: 'clamp(1rem, 4vw, 2rem)',
            zIndex: 1000,
            animation: 'fade-in 0.3s ease-in'
          }}
        >
          <button
            onClick={handleInstallClick}
            className="pixel-label"
            style={{
              background: 'var(--rc-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--rc-radius)',
              padding: 'clamp(0.625rem, 1.5vw + 0.25rem, 0.75rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
              color: 'var(--rc-accent)',
              fontSize: 'clamp(0.625rem, 1.5vw + 0.125rem, 0.75rem)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              opacity: 0.9
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            }}
          >
            + INSTALL
          </button>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1'
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
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
          onClick={() => setShowIOSModal(false)}
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
              onClick={() => setShowIOSModal(false)}
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
                borderRadius: '50%',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
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
              Add to Home Screen
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw + 0.5rem, 1.25rem)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--rc-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0,
                    fontSize: '0.875rem'
                  }}
                >
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--rc-text)', fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)', margin: 0, lineHeight: '1.5' }}>
                    Tap the <strong>Share</strong> button <span style={{ fontSize: '1.25em' }}>⎋</span> at the bottom of your screen
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--rc-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0,
                    fontSize: '0.875rem'
                  }}
                >
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--rc-text)', fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)', margin: 0, lineHeight: '1.5' }}>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--rc-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0,
                    fontSize: '0.875rem'
                  }}
                >
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--rc-text)', fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)', margin: 0, lineHeight: '1.5' }}>
                    Tap <strong>"Add"</strong> to confirm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

