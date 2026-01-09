import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Done Modal - Global completion modal
 * Clean, minimal, theme-aware modal for completion confirmation
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onGoToDashboard - Optional callback to navigate to dashboard/home
 * @param {Function} props.onPlanTomorrow - Optional callback to navigate to daily/tomorrow planning
 * @param {Function} props.onWeeklyReset - Optional callback to reset weekly view
 * @param {Function} props.onViewProgress - Optional callback to navigate to yearly/progress view
 * @param {Function} props.onReturnFocus - Callback to return focus to Done button
 */
export default function DoneModal({ 
  isOpen, 
  onClose, 
  onGoToDashboard,
  onPlanTomorrow,
  onWeeklyReset,
  onViewProgress,
  onReturnFocus 
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dashboardButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Track which quick action buttons are available
  const hasQuickActions = onPlanTomorrow || onWeeklyReset || onViewProgress;

  // Track element that had focus before modal opened
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
    }
  }, [isOpen]);

  // Handle close - onClose callback will handle returning focus
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    
    // Focus first element when modal opens
    const firstFocusable = dashboardButtonRef.current || closeButtonRef.current;
    firstFocusable?.focus();

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle dashboard navigation
  const handleGoToDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    }
    handleClose();
  };

  // Handle quick actions
  const handlePlanTomorrow = () => {
    if (onPlanTomorrow) {
      onPlanTomorrow();
    }
    handleClose();
  };

  const handleWeeklyReset = () => {
    if (onWeeklyReset) {
      onWeeklyReset();
    }
    handleClose();
  };

  const handleViewProgress = () => {
    if (onViewProgress) {
      onViewProgress();
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="done-modal-title"
        aria-describedby="done-modal-description"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rc-radius)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            /* Subtle retro glow */
            boxShadow: `
              var(--rc-shadow), 
              0 20px 60px rgba(0, 0, 0, 0.15),
              0 0 20px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 10%, transparent),
              0 0 40px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 5%, transparent)
            `
          }}
        >
          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Title */}
            <h2
              id="done-modal-title"
              className="text-2xl sm:text-3xl font-semibold mb-3 text-center"
              style={{ 
                color: 'var(--rc-text)',
                /* Subtle retro glow on title */
                textShadow: '0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 15%, transparent)'
              }}
            >
              You're locked in ✅
            </h2>

            {/* Body */}
            <p
              id="done-modal-description"
              className="text-base sm:text-lg mb-6 text-center font-light"
              style={{ color: 'var(--rc-muted)' }}
            >
              Proud of you. See you soon.
            </p>

            {/* What's next? Section - Optional, minimal */}
            {hasQuickActions && (
              <div className="mb-6 pt-4 border-t" style={{ borderColor: 'var(--rc-muted)', opacity: 0.2 }}>
                <p className="text-xs font-medium mb-3 text-center" style={{ color: 'var(--rc-muted)', opacity: 0.8 }}>
                  What's next?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {onPlanTomorrow && (
                    <button
                      onClick={handlePlanTomorrow}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                        borderRadius: 'var(--rc-radius)',
                        color: 'var(--rc-text)',
                        boxShadow: '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--rc-accent)';
                        e.target.style.boxShadow = '0 0 8px color-mix(in srgb, var(--rc-accent) 15%, transparent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                        e.target.style.boxShadow = '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)';
                      }}
                    >
                      Plan tomorrow
                    </button>
                  )}
                  {onWeeklyReset && (
                    <button
                      onClick={handleWeeklyReset}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                        borderRadius: 'var(--rc-radius)',
                        color: 'var(--rc-text)',
                        boxShadow: '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--rc-accent)';
                        e.target.style.boxShadow = '0 0 8px color-mix(in srgb, var(--rc-accent) 15%, transparent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                        e.target.style.boxShadow = '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)';
                      }}
                    >
                      Weekly reset
                    </button>
                  )}
                  {onViewProgress && (
                    <button
                      onClick={handleViewProgress}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                        borderRadius: 'var(--rc-radius)',
                        color: 'var(--rc-text)',
                        boxShadow: '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--rc-accent)';
                        e.target.style.boxShadow = '0 0 8px color-mix(in srgb, var(--rc-accent) 15%, transparent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                        e.target.style.boxShadow = '0 0 4px color-mix(in srgb, var(--rc-accent) 8%, transparent)';
                      }}
                    >
                      View progress
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onGoToDashboard && (
                <button
                  ref={dashboardButtonRef}
                  onClick={handleGoToDashboard}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                    borderRadius: 'var(--rc-radius)',
                    boxShadow: `
                      var(--rc-shadow),
                      0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                      0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                    `
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `
                      var(--rc-shadow),
                      0 0 0 3px color-mix(in srgb, var(--rc-focus, var(--rc-accent)) 20%, transparent),
                      0 0 12px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 25%, transparent),
                      0 0 20px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 15%, transparent)
                    `;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `
                      var(--rc-shadow),
                      0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                      0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                    `;
                  }}
                >
                  Go to Dashboard
                </button>
              )}
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  onGoToDashboard
                    ? 'bg-white border-2 text-gray-700 hover:bg-gray-50'
                    : 'text-white hover:opacity-90'
                }`}
                style={
                  onGoToDashboard
                    ? {
                        borderColor: 'var(--rc-accent)',
                        borderRadius: 'var(--rc-radius)',
                        /* Subtle retro glow on secondary button */
                        boxShadow: '0 0 4px color-mix(in srgb, var(--rc-accent) 15%, transparent)'
                      }
                    : {
                        background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                        borderRadius: 'var(--rc-radius)',
                        boxShadow: `
                          var(--rc-shadow),
                          0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                          0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                        `
                      }
                }
                onFocus={(e) => {
                  if (onGoToDashboard) {
                    e.target.style.boxShadow = `
                      0 0 0 3px color-mix(in srgb, var(--rc-focus, var(--rc-accent)) 20%, transparent),
                      0 0 8px color-mix(in srgb, var(--rc-accent) 20%, transparent)
                    `;
                  } else {
                    e.target.style.boxShadow = `
                      var(--rc-shadow),
                      0 0 0 3px color-mix(in srgb, var(--rc-focus, var(--rc-accent)) 20%, transparent),
                      0 0 12px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 25%, transparent),
                      0 0 20px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 15%, transparent)
                    `;
                  }
                }}
                onBlur={(e) => {
                  if (onGoToDashboard) {
                    e.target.style.boxShadow = '0 0 4px color-mix(in srgb, var(--rc-accent) 15%, transparent)';
                  } else {
                    e.target.style.boxShadow = `
                      var(--rc-shadow),
                      0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent),
                      0 0 16px color-mix(in srgb, var(--rc-glow, var(--rc-accent)) 10%, transparent)
                    `;
                  }
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
