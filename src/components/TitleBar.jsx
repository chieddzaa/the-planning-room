import React, { useState, useEffect, useRef } from 'react';
import { getProfilePicture, removeProfilePicture, saveProfilePicture, imageToDataURL, validateImageFile, compressImage } from '../utils/profilePicture';
import { getEnabledThemes, getThemeConfig } from '../utils/themeConfig';

export default function TitleBar({ username, themeTint, onThemeChange, theme, onThemeSwitch, dayNightMode = 'day', onToggleDayNight, onLogout, activeTab, onMenuClick, onDone, onDoneButtonRef, plannerMode = 'personal', onPlannerModeChange, onCollaborateClick }) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showThemeSwitchMenu, setShowThemeSwitchMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [pfp, setPfp] = useState(null);
  const fileInputRef = useRef(null);
  const doneButtonRef = useRef(null);

  // Expose doneButtonRef to parent via callback (so parent can return focus)
  useEffect(() => {
    if (onDoneButtonRef) {
      onDoneButtonRef(doneButtonRef);
    }
  }, [onDoneButtonRef]);

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
      // Compress image if it's large (iPhone photos)
      let processedFile = file;
      if (file.size > 1024 * 1024) { // If larger than 1MB, compress it
        processedFile = await compressImage(file, 800, 800, 0.85);
      }
      
      // Convert to base64
      const dataURL = await imageToDataURL(processedFile);
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
      className="backdrop-blur-md text-white px-3 sm:px-4 py-2 flex items-center justify-between border-b select-none transition-all duration-300 shadow-sm"
      style={{
        background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
        borderColor: `var(--accent)`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/20 transition-colors touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        
        {/* Logo - Hidden on very small screens */}
        <img 
          src="/logo.png" 
          alt="Reality Check" 
          className="h-5 sm:h-6 w-auto object-contain flex-shrink-0 hidden xs:block"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            opacity: 0.95
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
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
        <div className="flex flex-col min-w-0">
          <h1 
            className="text-xs sm:text-sm font-semibold tracking-tight leading-none truncate"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.01em'
            }}
          >
            Reality Check
          </h1>
          {activeTab === 'yearly' && (
            <p 
              className="text-[10px] sm:text-xs font-light mt-0.5 leading-tight hidden sm:block"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.02em'
              }}
            >
              Tend your garden.
            </p>
          )}
        </div>
        <div className="h-4 w-px bg-white/20 hidden md:block"></div>
        <span className="text-[10px] sm:text-xs font-light tracking-wide hidden sm:inline" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          welcome back, {username.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* User Avatar with hover effect and menu */}
        <div className="relative">
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            className="w-8 h-8 sm:w-7 sm:h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 cursor-pointer overflow-hidden touch-manipulation"
            style={{
              background: pfp ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
              minWidth: '44px',
              minHeight: '44px'
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
        
        {/* Day/Night Mode Toggle */}
        <div className="relative">
          <button
            onClick={onToggleDayNight}
            className="px-2.5 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 flex items-center gap-1 touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
            title={dayNightMode === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
            aria-label={dayNightMode === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
          >
            <span className="text-xs">
              {dayNightMode === 'day' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
        
        {/* Theme Switch - All themes from THEME_CONFIG */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowThemeSwitchMenu(!showThemeSwitchMenu)}
            className="px-2.5 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 flex items-center gap-1 touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
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
                className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-xl shadow-xl z-20 min-w-[180px] max-h-[400px] overflow-y-auto overflow-x-hidden animate-fade-in"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="p-2">
                  {getEnabledThemes().map((themeConfig) => {
                    const isSelected = theme === themeConfig.internalId;
                    // Get color for theme indicator - extract from button gradient
                    const getThemeColor = (gradient) => {
                      if (!gradient) return '#06b6d4'; // Default cyan
                      // Extract RGB values from gradient string
                      if (gradient.includes('244, 114, 182') || gradient.includes('f472b6')) return '#f472b6'; // Pink
                      if (gradient.includes('232, 121, 249') || gradient.includes('e879f9')) return '#e879f9'; // Purple/Rose
                      if (gradient.includes('59, 130, 246') || gradient.includes('3b82f6')) return '#3b82f6'; // Blue
                      if (gradient.includes('74, 222, 128') || gradient.includes('4ade80')) return '#4ade80'; // Green
                      if (gradient.includes('192, 132, 82') || gradient.includes('c08452')) return '#c08452'; // Amber
                      if (gradient.includes('167, 139, 250') || gradient.includes('a78bfa')) return '#a78bfa'; // Purple
                      if (gradient.includes('139, 92, 246') || gradient.includes('8b5cf6')) return '#8b5cf6'; // Purple
                      return '#06b6d4'; // Default cyan
                    };
                    const themeColor = getThemeColor(themeConfig.buttonGradient?.default);
                    
                    return (
                      <button
                        key={themeConfig.id}
                        onClick={() => {
                          // Use internalId (canonical key) for CSS compatibility
                          // This is the same key used in data-theme attribute
                          onThemeSwitch(themeConfig.internalId);
                          setShowThemeSwitchMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-xs text-left transition-all duration-200 rounded-lg flex items-center gap-2.5 hover:bg-white/60 ${
                          isSelected ? 'bg-white/80 font-medium' : ''
                        }`}
                        title={themeConfig.description || themeConfig.name}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-gray-300/50 transition-all duration-200 flex items-center justify-center"
                          style={{
                            backgroundColor: themeColor,
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: isSelected ? '0 0 0 2px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(255, 255, 255, 0.5)' : 'none'
                          }}
                        />
                        <span className="flex-1 text-left">
                          {/* User-friendly label: theme.name (e.g., "Rose Quartz") but key is canonical (e.g., "rose-quartz") */}
                          {themeConfig.name}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-gray-600">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Tint Selector (blue/green/orange) */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="px-2.5 py-1 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 flex items-center gap-1 touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
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

        {/* Planner Mode Toggle - Personal / Work */}
        {onPlannerModeChange && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-white/30 backdrop-blur-sm">
            <button
              onClick={() => onPlannerModeChange('personal')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                plannerMode === 'personal'
                  ? 'text-white bg-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Personal
            </button>
            <span className="text-white/40 text-xs">/</span>
            <button
              onClick={() => onPlannerModeChange('work')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                plannerMode === 'work'
                  ? 'text-white bg-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Work
            </button>
          </div>
        )}

        {/* Collaborate Button - Work Mode Only */}
        {plannerMode === 'work' && (
          <button
            onClick={() => {
              if (onCollaborateClick) {
                onCollaborateClick();
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 relative z-10 touch-manipulation"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--rc-radius, 8px)',
              color: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.outlineOffset = '2px';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
            }}
          >
            {/* Users/Team Icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M5.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM10.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 11.5c0-1.5 1-2.5 2.5-2.5h5c1.5 0 2.5 1 2.5 2.5V13H3v-1.5Z"
                fill="currentColor"
                fillOpacity="0.9"
              />
            </svg>
            <span>Collaborate</span>
          </button>
        )}

        {/* Done Button - Desktop */}
        {onDone && (
          <div className="relative hidden sm:block">
            <button
              ref={doneButtonRef}
              onClick={onDone}
              className="px-3 py-1.5 text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 touch-manipulation font-medium"
              style={{ 
                minWidth: '44px', 
                minHeight: '44px',
                /* Subtle retro glow on Done button */
                boxShadow: '0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 15%, transparent)'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `
                  0 0 0 3px color-mix(in srgb, var(--rc-focus, var(--rc-accent)) 25%, transparent),
                  0 0 12px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 20%, transparent)
                `;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 0 8px color-mix(in srgb, var(--rc-primary, var(--rc-accent)) 15%, transparent)';
              }}
              title="Done - lock in your progress"
              aria-label="Done - lock in your progress"
            >
              done
            </button>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs border border-white/30 hover:bg-white/20 active:bg-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 touch-manipulation"
          style={{ minWidth: '44px', minHeight: '44px' }}
          title="log out"
        >
          <span className="hidden sm:inline">log out</span>
          <span className="sm:hidden">out</span>
        </button>
        <div className="hidden md:flex gap-1 ml-1">
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
