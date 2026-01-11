import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Collaborate Modal - Team workspace management
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.teamState - Current team state
 * @param {Function} props.onCreateTeam - Callback to create a team
 * @param {Function} props.onJoinTeam - Callback to join a team
 * @param {Function} props.onLeaveTeam - Callback to leave team
 */
export default function CollaborateModal({
  isOpen,
  onClose,
  teamState,
  onCreateTeam,
  onJoinTeam,
  onLeaveTeam
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const teamNameInputRef = useRef(null);
  const inviteLinkInputRef = useRef(null);
  const previousActiveElement = useRef(null);

  const [teamName, setTeamName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [view, setView] = useState('main'); // 'main' | 'create' | 'join'

  const isInTeam = teamState.mode === 'team';
  const inviteLinkUrl = isInTeam 
    ? `${window.location.origin}/?team=${teamState.teamId}&mode=work`
    : '';

  // Track element that had focus before modal opened
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      setView('main');
      setTeamName('');
      setInviteLink('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (view === 'main') {
          onClose();
        } else {
          setView('main');
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, view, onClose]);

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
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    
    // Focus first element when modal opens
    const firstFocusable = closeButtonRef.current;
    firstFocusable?.focus();

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, view]);

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

  const handleCreateTeam = () => {
    if (teamName.trim()) {
      onCreateTeam(teamName.trim());
      setView('main');
      setTeamName('');
    }
  };

  const handleJoinTeam = () => {
    // Parse teamId from invite link
    try {
      const url = new URL(inviteLink);
      const teamId = url.searchParams.get('team');
      if (teamId) {
        onJoinTeam(teamId, teamName.trim() || undefined);
        setView('main');
        setInviteLink('');
        setTeamName('');
      } else {
        alert('Invalid invite link. Please check the link and try again.');
      }
    } catch (e) {
      // Try parsing as just the teamId
      if (inviteLink.trim().length > 0) {
        onJoinTeam(inviteLink.trim(), teamName.trim() || undefined);
        setView('main');
        setInviteLink('');
        setTeamName('');
      } else {
        alert('Invalid invite link. Please check the link and try again.');
      }
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLinkUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: select text
      inviteLinkInputRef.current?.select();
    }
  };

  const handleClose = useCallback(() => {
    setView('main');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--rc-card, #ffffff)',
          border: '1px solid var(--rc-border, rgba(51, 65, 85, 0.15))',
          borderRadius: 'var(--rc-radius, 8px)',
          boxShadow: 'var(--rc-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--rc-border, rgba(51, 65, 85, 0.15))' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--rc-text, #334155)' }}>
            Collaborate
          </h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {view === 'main' && (
            <>
              {isInTeam ? (
                <>
                  {/* Team Info */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--rc-text, #334155)' }}>
                      Team: <span className="font-normal">{teamState.teamName}</span>
                    </p>
                    <p className="text-xs" style={{ color: 'var(--rc-muted, #64748b)' }}>
                      Team ID: {teamState.teamId}
                    </p>
                  </div>

                  {/* Copy Invite Link */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium block" style={{ color: 'var(--rc-text, #334155)' }}>
                      Invite Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        ref={inviteLinkInputRef}
                        type="text"
                        readOnly
                        value={inviteLinkUrl}
                        className="flex-1 px-3 py-2 text-sm border rounded"
                        style={{
                          borderColor: 'var(--rc-border, rgba(51, 65, 85, 0.15))',
                          background: 'var(--rc-bg, #fefefe)',
                          color: 'var(--rc-text, #334155)',
                          borderRadius: 'var(--rc-radius, 8px)',
                        }}
                      />
                      <button
                        onClick={handleCopyInviteLink}
                        className="px-4 py-2 text-sm font-medium text-white rounded transition-all"
                        style={{
                          background: 'var(--rc-accent, #f5a8b8)',
                          borderRadius: 'var(--rc-radius, 8px)',
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    {showToast && (
                      <p className="text-xs" style={{ color: 'var(--rc-accent, #f5a8b8)' }}>
                        Invite link copied!
                      </p>
                    )}
                  </div>

                  {/* Leave Team */}
                  <button
                    onClick={() => {
                      onLeaveTeam();
                      handleClose();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium rounded transition-all"
                    style={{
                      border: '1px solid var(--rc-border, rgba(51, 65, 85, 0.15))',
                      color: 'var(--rc-text, #334155)',
                      borderRadius: 'var(--rc-radius, 8px)',
                    }}
                  >
                    Leave Team
                  </button>
                </>
              ) : (
                <>
                  {/* Create Team */}
                  <button
                    onClick={() => setView('create')}
                    className="w-full px-4 py-2 text-sm font-medium text-white rounded transition-all"
                    style={{
                      background: 'var(--rc-accent, #f5a8b8)',
                      borderRadius: 'var(--rc-radius, 8px)',
                    }}
                  >
                    Create Team
                  </button>

                  {/* Join Team */}
                  <button
                    onClick={() => setView('join')}
                    className="w-full px-4 py-2 text-sm font-medium rounded transition-all"
                    style={{
                      border: '1px solid var(--rc-border, rgba(51, 65, 85, 0.15))',
                      color: 'var(--rc-text, #334155)',
                      borderRadius: 'var(--rc-radius, 8px)',
                    }}
                  >
                    Join Team
                  </button>
                </>
              )}

              {/* Beta Notice */}
              <p className="text-xs text-center" style={{ color: 'var(--rc-muted, #64748b)' }}>
                Team sync is in beta — link joins the same team workspace. Real-time syncing will be added next.
              </p>
            </>
          )}

          {view === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--rc-text, #334155)' }}>
                  Team Name
                </label>
                <input
                  ref={teamNameInputRef}
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-3 py-2 text-sm border rounded"
                  style={{
                    borderColor: 'var(--rc-border, rgba(51, 65, 85, 0.15))',
                    background: 'var(--rc-bg, #fefefe)',
                    color: 'var(--rc-text, #334155)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTeam();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('main')}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded transition-all"
                  style={{
                    border: '1px solid var(--rc-border, rgba(51, 65, 85, 0.15))',
                    color: 'var(--rc-text, #334155)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!teamName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--rc-accent, #f5a8b8)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {view === 'join' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--rc-text, #334155)' }}>
                  Invite Link
                </label>
                <input
                  type="text"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  placeholder="Paste invite link or team ID"
                  className="w-full px-3 py-2 text-sm border rounded"
                  style={{
                    borderColor: 'var(--rc-border, rgba(51, 65, 85, 0.15))',
                    background: 'var(--rc-bg, #fefefe)',
                    color: 'var(--rc-text, #334155)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinTeam();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--rc-text, #334155)' }}>
                  Team Name (optional)
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Local display name"
                  className="w-full px-3 py-2 text-sm border rounded"
                  style={{
                    borderColor: 'var(--rc-border, rgba(51, 65, 85, 0.15))',
                    background: 'var(--rc-bg, #fefefe)',
                    color: 'var(--rc-text, #334155)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinTeam();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('main')}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded transition-all"
                  style={{
                    border: '1px solid var(--rc-border, rgba(51, 65, 85, 0.15))',
                    color: 'var(--rc-text, #334155)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinTeam}
                  disabled={!inviteLink.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--rc-accent, #f5a8b8)',
                    borderRadius: 'var(--rc-radius, 8px)',
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

