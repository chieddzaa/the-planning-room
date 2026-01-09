import React, { useEffect } from 'react';

/**
 * Done for Today Modal
 * Clean, minimal, theme-aware modal for completion confirmation
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onGoToWeekly - Optional callback to navigate to weekly view
 */
export default function DoneForTodayModal({ isOpen, onClose, onGoToWeekly }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="done-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rc-radius)',
            boxShadow: 'var(--rc-shadow), 0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Subtle confetti effect (optional, subtle) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-60"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${15 + (i % 3) * 25}%`,
                  background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'][i % 4],
                  animation: `confetti-fall ${1 + i * 0.2}s ease-out forwards`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Title */}
            <h2
              id="done-modal-title"
              className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3 text-center"
              style={{ color: 'var(--rc-text)' }}
            >
              You're locked in ✅
            </h2>

            {/* Body */}
            <p
              className="text-base sm:text-lg text-gray-600 mb-2 text-center font-light"
              style={{ color: 'var(--rc-muted)' }}
            >
              Proud of you. See you tomorrow.
            </p>

            {/* Secondary line */}
            <p
              className="text-sm text-gray-500 mb-6 text-center font-light"
              style={{ color: 'var(--rc-muted)', opacity: 0.8 }}
            >
              Your plan is saved.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onGoToWeekly && (
                <button
                  onClick={onGoToWeekly}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                    borderRadius: 'var(--rc-radius)',
                    boxShadow: 'var(--rc-shadow)'
                  }}
                >
                  Go to Weekly View
                </button>
              )}
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  onGoToWeekly
                    ? 'bg-white border-2 text-gray-700 hover:bg-gray-50'
                    : 'text-white hover:opacity-90'
                }`}
                style={
                  onGoToWeekly
                    ? {
                        borderColor: 'var(--rc-accent)',
                        borderRadius: 'var(--rc-radius)'
                      }
                    : {
                        background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                        borderRadius: 'var(--rc-radius)',
                        boxShadow: 'var(--rc-shadow)'
                      }
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti animation styles */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

