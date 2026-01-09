import React, { useState, useRef } from 'react';
import { buildKey } from '../utils/storageKeys';
import { imageToDataURL, validateImageFile, saveProfilePicture } from '../utils/profilePicture';
import { getThemeConfig, THEMES } from '../utils/themeConfig';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [themeDisplay, setThemeDisplay] = useState('flux'); // 'blush' or 'flux'
  const [pfpPreview, setPfpPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Map display themes to internal themes
  const themeMap = {
    'blush': 'soft-pink', // Maps to 'pink' internal theme
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
      // Convert to base64
      const dataURL = await imageToDataURL(file);
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
  const currentThemeId = themeDisplay === 'blush' ? 'soft-pink' : 'ai-lab';
  const currentTheme = getThemeConfig(currentThemeId);
  const currentButtonStyle = getButtonStyle(currentThemeId);

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden" data-theme={currentTheme.internalId}>
      {/* Clean minimal background with subtle gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 100%)'
        }}
      />

      {/* Center Card */}
      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Clean Card with glass effect */}
        <div 
          className="overflow-hidden"
          style={{
            background: 'var(--rc-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rc-radius)',
            boxShadow: 'var(--rc-shadow)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Card Body */}
          <div className="px-12 py-20">
            {/* Logo - Larger and more prominent */}
            <div className="mb-16 flex justify-center">
              <img 
                src="/logo.png" 
                alt="Reality Check" 
                className="w-48 h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
                  mixBlendMode: 'normal'
                }}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Heading - ONE headline, ONE supporting line */}
            <div className="mb-14 text-center">
              <h2 
                className="text-3xl font-bold tracking-tight mb-3"
                style={{
                  color: 'var(--rc-text)'
                }}
              >
                the planning room
              </h2>
              <p 
                className="text-sm font-light"
                style={{
                  color: 'var(--rc-muted)'
                }}
              >
                let's make today make sense
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--rc-text)'
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
                  className="w-full px-4 py-3.5 text-base focus:outline-none transition-all duration-200 normal-case"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid color-mix(in srgb, var(--rc-accent) 20%, transparent)',
                    borderRadius: 'var(--rc-radius)',
                    color: 'var(--rc-text)',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rc-accent)';
                    e.currentTarget.style.boxShadow = 'var(--rc-shadow), 0 0 0 3px color-mix(in srgb, var(--rc-accent) 15%, transparent)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--rc-accent) 20%, transparent)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  autoFocus
                  maxLength={20}
                />
                
                {/* Error Message */}
                {error && (
                  <p className="text-xs text-red-600 mt-2">
                    {error}
                  </p>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--rc-text)'
                  }}
                >
                  profile picture <span style={{ color: 'var(--rc-muted)', opacity: 0.7 }} className="font-light">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview Circle */}
                  <div className="flex-shrink-0">
                    {pfpPreview ? (
                      <div className="relative">
                        <img
                          src={pfpPreview}
                          alt="profile preview"
                          className="w-14 h-14 rounded-full object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePfp}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center hover:bg-gray-900 transition-colors"
                          title="remove"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="flex-1">
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
                      className="cursor-pointer inline-block px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-gray-700"
                    >
                      {pfpPreview ? 'change' : 'upload'}
                    </label>
                    <p className="text-xs text-gray-400 mt-1.5 font-light">
                      max 1MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: 'var(--rc-text)'
                  }}
                >
                  theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Blush Mode Card */}
                  <button
                    type="button"
                    onClick={() => setThemeDisplay('blush')}
                    className={`p-4 border transition-all duration-200 text-left rounded-lg ${
                      themeDisplay === 'blush'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">blush</span>
                        {themeDisplay === 'blush' && (
                          <span className="text-xs text-gray-600">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-light">soft</p>
                    </div>
                  </button>

                  {/* Flux Mode Card */}
                  <button
                    type="button"
                    onClick={() => setThemeDisplay('flux')}
                    className={`p-4 border transition-all duration-200 text-left rounded-lg ${
                      themeDisplay === 'flux'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">flux</span>
                        {themeDisplay === 'flux' && (
                          <span className="text-xs text-gray-600">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-light">cool</p>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Submit Button - Theme-colored */}
              <button
                type="submit"
                disabled={!showWelcome}
                className="w-full px-6 py-4 text-base font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg relative"
                style={{
                  background: showWelcome ? currentButtonStyle.default : '#d1d5db',
                  boxShadow: showWelcome ? currentButtonStyle.shadow : 'none',
                  textTransform: 'lowercase',
                  transform: 'translateY(0)'
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
                  }
                }}
                onMouseEnter={(e) => {
                  if (showWelcome) {
                    e.currentTarget.style.background = currentButtonStyle.hover;
                    e.currentTarget.style.boxShadow = currentButtonStyle.hoverShadow;
                    e.currentTarget.style.transform = 'translateY(-1px)';
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

            {/* Scripture Footer - Minimal */}
            <div 
              className="mt-14 pt-10 border-t"
              style={{
                borderColor: 'var(--rc-muted)',
                opacity: 0.2
              }}
            >
              <div className="text-center">
                <p 
                  className="text-xs font-light mb-1"
                  style={{ 
                    color: 'var(--rc-muted)',
                    opacity: 0.7
                  }}
                >
                  "Prosper in all things. Be in health."
                </p>
                <p 
                  className="text-xs font-light"
                  style={{ 
                    color: 'var(--rc-muted)',
                    opacity: 0.7
                  }}
                >
                  — 3 John 1:2
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
