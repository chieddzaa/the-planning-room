import React, { useState, useEffect, useRef } from 'react';
import { getProfilePicture, removeProfilePicture, saveProfilePicture, imageToDataURL, validateImageFile } from '../utils/profilePicture';

export default function TitleBar({ username, themeTint, onThemeChange, theme, onThemeSwitch, onLogout, activeTab }) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showThemeSwitchMenu, setShowThemeSwitchMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [pfp, setPfp] = useState(null);
  const fileInputRef = useRef(null);

  // Load PFP when username changes
  useEffect(() => {
    if (username) {
      const profilePic = getProfilePicture(username);
      setPfp(profilePic);
    } else {
      setPfp(null);
    }
  }, [username]);

  // Get user initials (first letter of first word, first letter of last word if exists)
  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(username);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      setShowAvatarMenu(false);
      return;
    }

    try {
      // Convert to base64
      const dataURL = await imageToDataURL(file);
      // Save PFP
      saveProfilePicture(username, dataURL);
      setPfp(dataURL);
      setShowAvatarMenu(false);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('failed to process image');
      e.target.value = '';
    }
  };

  const handleRemovePfp = () => {
    try {
      removeProfilePicture(username);
      setPfp(null);
      setShowAvatarMenu(false);
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('failed to remove profile picture');
    }
  };

  const themeColors = {
    blue: { 
      bg: 'bg-gradient-to-r from-blue-500/90 to-blue-600/90', 
      hover: 'hover:from-blue-600/90 hover:to-blue-700/90',
      border: 'border-blue-400/30'
    },
    green: { 
      bg: 'bg-gradient-to-r from-green-500/90 to-green-600/90', 
      hover: 'hover:from-green-600/90 hover:to-green-700/90',
      border: 'border-green-400/30'
    },
    orange: { 
      bg: 'bg-gradient-to-r from-orange-500/90 to-orange-600/90', 
      hover: 'hover:from-orange-600/90 hover:to-orange-700/90',
      border: 'border-orange-400/30'
    },
  };

  const currentTheme = themeColors[themeTint] || themeColors.blue;

  return (
    <div 
      className="backdrop-blur-md text-white px-4 py-2 flex items-center justify-between border-b select-none transition-all duration-300 shadow-sm"
      style={{
        background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
        borderColor: `var(--accent)`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="Reality Check" 
          className="h-6 w-auto object-contain flex-shrink-0"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            opacity: 0.95
          }}
          onError={(e) => {
            // Fallback if image doesn't exist
            e.target.style.display = 'none';
          }}
        />
        <div className="h-4 w-px bg-white/20"></div>
        {/* Reality Check Wordmark */}
        <div className="flex flex-col">
          <h1 
            className="text-sm font-semibold tracking-tight leading-none"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.01em'
            }}
          >
            Reality Check
          </h1>
          {activeTab === 'yearly' && (
            <p 
              className="text-xs font-light mt-0.5 leading-tight"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.02em'
              }}
            >
              Tend your garden.
            </p>
          )}
        </div>
        <div className="h-4 w-px bg-white/20"></div>
        <span className="text-xs font-light tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          welcome back, {username.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* User Avatar with hover effect and menu */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 cursor-pointer overflow-hidden"
            style={{
              background: pfp ? 'transparent' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            {pfp ? (
              <img
                src={pfp}
                alt={`${username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </button>
          {showAvatarMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowAvatarMenu(false)}
              />
              <div 
                className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden animate-fade-in"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="p-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pfp-change"
                  />
                  <label
                    htmlFor="pfp-change"
                    className="w-full px-3 py-2 text-xs text-left hover:bg-white/60 transition-all duration-200 rounded-lg flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="text-xs">📷</span>
                    <span>change pfp</span>
                  </label>
                  {pfp && (
                    <button
                      onClick={handleRemovePfp}
                      className="w-full px-3 py-2 text-xs text-left hover:bg-white/60 transition-all duration-200 rounded-lg flex items-center gap-2.5 text-red-600"
                    >
                      <span className="text-xs">🗑️</span>
                      <span>remove pfp</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Theme Switch (pink/ai-lab) */}
        <div className="relative">
          <button
            onClick={() => setShowThemeSwitchMenu(!showThemeSwitchMenu)}
            className="px-2.5 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 flex items-center gap-1"
            title="switch theme"
          >
            <span className="text-xs">🎨</span>
          </button>
          {showThemeSwitchMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowThemeSwitchMenu(false)}
              />
              <div 
                className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden animate-fade-in"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="p-2">
                  {['pink', 'ai-lab'].map((th) => (
                    <button
                      key={th}
                      onClick={() => {
                        onThemeSwitch(th);
                        setShowThemeSwitchMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left hover:bg-white/60 transition-all duration-200 rounded-lg flex items-center gap-2.5 ${
                        theme === th ? 'bg-white/80 font-medium' : ''
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border border-gray-300/50 transition-all duration-200 ${
                        th === 'pink' ? 'bg-pink-400' :
                        'bg-cyan-500'
                      } ${theme === th ? 'scale-110 ring-2 ring-offset-1' : ''}`}></span>
                      <span className="capitalize">{th}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Tint Selector (blue/green/orange) */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="px-2.5 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 flex items-center gap-1"
            title="theme tint"
          >
            <span className="text-xs">🎨</span>
          </button>
          {showThemeMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowThemeMenu(false)}
              />
              <div 
                className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-xl shadow-xl z-20 min-w-[140px] overflow-hidden animate-fade-in"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="p-2">
                  {['blue', 'green', 'orange'].map((tint) => (
                    <button
                      key={tint}
                      onClick={() => {
                        onThemeChange(tint);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left hover:bg-white/60 transition-all duration-200 rounded-lg flex items-center gap-2.5 ${
                        themeTint === tint ? 'bg-white/80 font-medium' : ''
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border border-gray-300/50 transition-all duration-200 ${
                        tint === 'blue' ? 'bg-blue-500' :
                        tint === 'green' ? 'bg-green-500' :
                        'bg-orange-500'
                      } ${themeTint === tint ? 'scale-110 ring-2 ring-offset-1' : ''}`}></span>
                      <span className="capitalize">{tint}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105"
          title="log out"
        >
          log out
        </button>
        <div className="flex gap-1 ml-1">
          <button 
            className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-95`}
            aria-label="Minimize"
          >
            <span className="text-xs">−</span>
          </button>
          <button 
            className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-95`}
            aria-label="Maximize"
          >
            <span className="text-xs">□</span>
          </button>
          <button 
            className="w-6 h-6 flex items-center justify-center rounded transition-all duration-300 hover:bg-red-500/80 active:scale-95 hover:scale-110"
            aria-label="Close"
          >
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
