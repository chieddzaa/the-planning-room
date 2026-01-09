import React, { useState, useRef } from 'react';
import { buildKey } from '../utils/storageKeys';
import { imageToDataURL, validateImageFile, saveProfilePicture, compressImage } from '../utils/profilePicture';
import { getThemeConfig, THEMES } from '../utils/themeConfig';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [themeDisplay, setThemeDisplay] = useState('flux'); // 'blush' or 'flux'
  const [pfpPreview, setPfpPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Map display themes to canonical theme keys
  const themeMap = {
    'blush': 'pink', // Maps to 'pink' theme key
    'flux': 'ai-lab'
  };
  
  // Get theme config for button styling
  const getButtonStyle = (themeId) => {
    const theme = getThemeConfig(themeId);
    return {
      default: theme.buttonGradient.default,
      hover: theme.buttonGradient.hover,
      shadow: theme.buttonShadow,
      hoverShadow: theme.buttonHoverShadow,
      focusRing: theme.buttonFocusRing
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      e.target.value = ''; // Reset file input
      return;
    }

    // Clear any previous errors
    setError('');

    try {
      // Compress image if it's large (iPhone photos)
      let processedFile = file;
      if (file.size > 1024 * 1024) { // If larger than 1MB, compress it
        processedFile = await compressImage(file, 800, 800, 0.85);
      }
      
      // Convert to base64
      const dataURL = await imageToDataURL(processedFile);
      setPfpPreview(dataURL);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('oops, couldn\'t process that image—try another one');
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemovePfp = () => {
    setPfpPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('hey, we need something to call you');
      return;
    }

    if (trimmedUsername.length < 2) {
      setError('a bit too short—try at least 2 characters');
      return;
    }

    if (trimmedUsername.length > 20) {
      setError('just a little too long—max 20 characters please');
      return;
    }

    // Save username, theme (mapped to internal ID), and PFP if present
    try {
      const themeConfig = getThemeConfig(currentThemeId);
      const internalTheme = themeConfig.internalId; // Use internal theme ID (pink or ai-lab)
      window.localStorage.setItem('planning-room.user', trimmedUsername);
      window.localStorage.setItem(buildKey(trimmedUsername, 'theme'), internalTheme);
      
      // Save PFP if uploaded
      if (pfpPreview) {
        saveProfilePicture(trimmedUsername, pfpPreview);
      }
    } catch (error) {
      console.error('Error saving login data:', error);
      setError('something went wrong saving your profile—try again?');
      return;
    }

    // Valid username, proceed with login (pass internal theme)
    const themeConfig = getThemeConfig(currentThemeId);
    onLogin(trimmedUsername, themeConfig.internalId);
  };

  const trimmedUsername = username.trim();
  const isValidLength = trimmedUsername.length >= 2 && trimmedUsername.length <= 20;
  const showWelcome = trimmedUsername && isValidLength;

  // Get current theme config
  const currentThemeId = themeDisplay === 'blush' ? 'pink' : 'ai-lab';
  const currentTheme = getThemeConfig(currentThemeId);
  const currentButtonStyle = getButtonStyle(currentThemeId);

  return (
    <div 
      className="flex items-center justify-center relative overflow-auto"
      style={{
        minHeight: '100dvh',
        padding: 'clamp(1rem, 4vw, 2rem)',
      }}
      data-theme={currentTheme.internalId}
    >
      {/* Clean minimal background with subtle gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Center Card */}
      <div 
        className="relative w-full z-10"
        style={{
          maxWidth: 'clamp(320px, 90vw, 520px)',
        }}
      >
        {/* Premium Netflix-style Card with pixel accent */}
        <div 
          className="overflow-hidden"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rc-radius)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            position: 'relative'
          }}
        >
          {/* Pixel border accent - subtle 8-bit style at low opacity */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--rc-radius)',
              border: '1px solid transparent',
              backgroundImage: `
                linear-gradient(to right, transparent 0%, transparent calc(100% - 6px), rgba(0, 0, 0, 0.03) calc(100% - 6px), rgba(0, 0, 0, 0.03) calc(100% - 2px), transparent calc(100% - 2px)),
                linear-gradient(to bottom, transparent 0%, transparent calc(100% - 6px), rgba(0, 0, 0, 0.03) calc(100% - 6px), rgba(0, 0, 0, 0.03) calc(100% - 2px), transparent calc(100% - 2px))
              `,
              pointerEvents: 'none',
              opacity: 0.4
            }}
          />
          {/* Pixel corner accents - 8-bit style */}
          <div 
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '4px',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1px',
              pointerEvents: 'none',
              opacity: 0.4
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '4px',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1px',
              pointerEvents: 'none',
              opacity: 0.4
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '4px',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1px',
              pointerEvents: 'none',
              opacity: 0.4
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '4px',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.08)',
              borderRadius: '1px',
              pointerEvents: 'none',
              opacity: 0.4
            }}
          />
          {/* Card Body */}
          <div 
            style={{
              padding: 'clamp(1.5rem, 5vw + 0.5rem, 3rem) clamp(1rem, 3vw + 0.5rem, 2rem)',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Logo - Responsive with clamp() + gentle float animation */}
            <div 
              className="flex flex-col items-center"
              style={{
                marginBottom: 'clamp(1.5rem, 4vw + 0.5rem, 3rem)',
                position: 'relative'
              }}
            >
              {/* Subtle WELCOME tag in pixel font - only shown when username is valid */}
              {showWelcome && (
                <span 
                  className="pixel-label"
                  style={{
                    color: 'var(--rc-accent)',
                    opacity: 0.65,
                    marginBottom: 'clamp(0.5rem, 1.5vw + 0.25rem, 0.75rem)',
                    fontSize: 'clamp(0.625rem, 1.5vw + 0.125rem, 0.75rem)',
                    letterSpacing: '0.15em',
                    animation: 'fade-in 0.4s ease-in',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  WELCOME
                </span>
              )}
              <img 
                src="/logo.png" 
                alt="Reality Check" 
                className="h-auto object-contain login-logo"
                style={{
                  width: 'clamp(120px, 25vw, 192px)',
                  maxWidth: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
                  mixBlendMode: 'normal',
                  animation: 'login-logo-float 4s ease-in-out infinite'
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Heading - ONE headline, ONE supporting line */}
            <div 
              className="text-center"
              style={{
                marginBottom: 'clamp(1.25rem, 3vw + 0.5rem, 2.5rem)',
              }}
            >
              <h2 
                className="font-bold tracking-tight"
                style={{
                  color: 'var(--rc-text)',
                  fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 1.875rem)',
                  lineHeight: '1.2',
                  marginBottom: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)',
                }}
              >
                the planning room
              </h2>
              <p 
                className="font-light"
                style={{
                  color: 'var(--rc-muted)',
                  fontSize: 'clamp(0.75rem, 2vw + 0.25rem, 0.875rem)',
                  lineHeight: '1.5',
                }}
              >
                let's make today make sense
              </p>
            </div>

            {/* Scripture - Subtle 1-2 line block under heading */}
            <div 
              className="text-center"
              style={{
                marginBottom: 'clamp(1.5rem, 4vw + 0.5rem, 2.5rem)',
                paddingTop: 'clamp(0.5rem, 1.5vw + 0.25rem, 1rem)',
              }}
            >
              <p 
                className="font-light"
                style={{ 
                  color: 'var(--rc-muted)',
                  opacity: 0.75,
                  fontSize: 'clamp(0.6875rem, 1.75vw + 0.25rem, 0.8125rem)',
                  lineHeight: '1.6',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
                  paddingRight: 'clamp(0.5rem, 2vw, 1rem)',
                }}
              >
                "Prosper in all things. Be in health." — 3 John 1:2
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw + 0.5rem, 2rem)' }}>
              {/* Username Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)' }}>
                <label 
                  htmlFor="username" 
                  className="block font-medium"
                  style={{
                    color: 'var(--rc-text)',
                    fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
                    marginBottom: '0.5rem',
                  }}
                >
                  name
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="enter your name"
                  className="w-full focus:outline-none transition-all duration-200 normal-case login-input"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                    borderRadius: 'var(--rc-radius)',
                    color: 'var(--rc-text)',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    padding: 'clamp(0.75rem, 2vw + 0.25rem, 0.875rem) clamp(1rem, 2.5vw + 0.5rem, 1.25rem)',
                    fontSize: 'clamp(0.9375rem, 2.5vw + 0.25rem, 1rem)',
                    boxShadow: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rc-accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rc-accent) 20%, transparent), 0 4px 12px color-mix(in srgb, var(--rc-accent) 12%, transparent)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  autoFocus
                  maxLength={20}
                />
                
                {/* Error Message */}
                {error && (
                  <p 
                    className="text-red-600"
                    style={{
                      fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 0.8125rem)',
                      marginTop: '0.5rem',
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)' }}>
                <label 
                  className="block font-medium"
                  style={{
                    color: 'var(--rc-text)',
                    fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
                    marginBottom: '0.5rem',
                  }}
                >
                  profile picture <span style={{ color: 'var(--rc-muted)', opacity: 0.7 }} className="font-light">(optional)</span>
                </label>
                <div 
                  className="flex items-center"
                  style={{
                    gap: 'clamp(0.75rem, 2vw + 0.5rem, 1rem)',
                  }}
                >
                  {/* Preview Circle */}
                  <div className="flex-shrink-0">
                    {pfpPreview ? (
                      <div className="relative">
                        <img
                          src={pfpPreview}
                          alt="profile preview"
                          className="rounded-full object-cover border border-gray-200"
                          style={{
                            width: 'clamp(3rem, 8vw + 1rem, 3.5rem)',
                            height: 'clamp(3rem, 8vw + 1rem, 3.5rem)',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemovePfp}
                          className="absolute -top-1 -right-1 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
                          style={{
                            width: 'clamp(1.125rem, 3vw + 0.5rem, 1.25rem)',
                            height: 'clamp(1.125rem, 3vw + 0.5rem, 1.25rem)',
                            fontSize: 'clamp(0.75rem, 2vw + 0.25rem, 0.8125rem)',
                          }}
                          title="remove"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"
                        style={{
                          width: 'clamp(3rem, 8vw + 1rem, 3.5rem)',
                          height: 'clamp(3rem, 8vw + 1rem, 3.5rem)',
                          fontSize: 'clamp(0.75rem, 2vw + 0.25rem, 0.8125rem)',
                        }}
                      >
                        —
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="flex-1 min-w-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pfp-upload"
                    />
                    <label
                      htmlFor="pfp-upload"
                      className="cursor-pointer inline-block bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-gray-700"
                      style={{
                        padding: 'clamp(0.5rem, 1.5vw + 0.25rem, 0.625rem) clamp(0.75rem, 2vw + 0.5rem, 1rem)',
                        fontSize: 'clamp(0.8125rem, 2vw + 0.25rem, 0.875rem)',
                      }}
                    >
                      {pfpPreview ? 'change' : 'upload'}
                    </label>
                    <p 
                      className="text-gray-400 font-light"
                      style={{
                        fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)',
                        marginTop: 'clamp(0.375rem, 1vw + 0.25rem, 0.5rem)',
                      }}
                    >
                      max 10MB (auto-compressed)
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw + 0.25rem, 0.75rem)' }}>
                <label 
                  className="block font-medium"
                  style={{
                    color: 'var(--rc-text)',
                    fontSize: 'clamp(0.875rem, 2vw + 0.25rem, 0.9375rem)',
                    marginBottom: '0.5rem',
                  }}
                >
                  theme
                </label>
                <div 
                  className="grid grid-cols-2"
                  style={{
                    gap: 'clamp(0.5rem, 1.5vw + 0.25rem, 0.75rem)',
                  }}
                >
                  {/* Blush Mode Card */}
                  <button
                    type="button"
                    onClick={() => setThemeDisplay('blush')}
                    className={`border transition-all duration-200 text-left rounded-lg ${
                      themeDisplay === 'blush'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{
                      padding: 'clamp(0.75rem, 2vw + 0.5rem, 1rem)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.25rem, 0.75vw + 0.125rem, 0.375rem)' }}>
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-medium text-gray-800"
                          style={{ fontSize: 'clamp(0.8125rem, 2vw + 0.25rem, 0.875rem)' }}
                        >
                          blush
                        </span>
                        {themeDisplay === 'blush' && (
                          <span 
                            className="text-gray-600"
                            style={{ fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)' }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <p 
                        className="text-gray-500 font-light"
                        style={{ fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)' }}
                      >
                        soft
                      </p>
                    </div>
                  </button>

                  {/* Flux Mode Card */}
                  <button
                    type="button"
                    onClick={() => setThemeDisplay('flux')}
                    className={`border transition-all duration-200 text-left rounded-lg ${
                      themeDisplay === 'flux'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{
                      padding: 'clamp(0.75rem, 2vw + 0.5rem, 1rem)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.25rem, 0.75vw + 0.125rem, 0.375rem)' }}>
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-medium text-gray-800"
                          style={{ fontSize: 'clamp(0.8125rem, 2vw + 0.25rem, 0.875rem)' }}
                        >
                          flux
                        </span>
                        {themeDisplay === 'flux' && (
                          <span 
                            className="text-gray-600"
                            style={{ fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)' }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <p 
                        className="text-gray-500 font-light"
                        style={{ fontSize: 'clamp(0.6875rem, 1.5vw + 0.25rem, 0.75rem)' }}
                      >
                        cool
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Submit Button - Theme-colored with premium micro-interactions */}
              <button
                type="submit"
                disabled={!showWelcome}
                className="w-full font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-lg relative login-button"
                style={{
                  background: showWelcome ? currentButtonStyle.default : '#d1d5db',
                  boxShadow: showWelcome ? currentButtonStyle.shadow : 'none',
                  textTransform: 'lowercase',
                  transform: 'translateY(0)',
                  padding: 'clamp(0.875rem, 2.5vw + 0.5rem, 1rem) clamp(1.25rem, 3vw + 0.5rem, 1.5rem)',
                  fontSize: 'clamp(0.9375rem, 2.5vw + 0.25rem, 1rem)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: showWelcome ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  if (showWelcome) {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = `${currentButtonStyle.focusRing}, ${currentButtonStyle.shadow}`;
                  }
                }}
                onBlur={(e) => {
                  if (showWelcome) {
                    e.currentTarget.style.boxShadow = currentButtonStyle.shadow;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
                onMouseEnter={(e) => {
                  if (showWelcome) {
                    e.currentTarget.style.background = currentButtonStyle.hover;
                    e.currentTarget.style.boxShadow = `${currentButtonStyle.hoverShadow}, 0 8px 24px color-mix(in srgb, var(--rc-accent) 18%, transparent)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (showWelcome) {
                    e.currentTarget.style.background = currentButtonStyle.default;
                    e.currentTarget.style.boxShadow = currentButtonStyle.shadow;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
