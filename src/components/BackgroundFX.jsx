import React, { useMemo } from 'react';
import { getFXConfig } from '../utils/fxConfig';

/**
 * Background FX component - renders theme and page-specific animated graphics
 * @param {Object} props
 * @param {"pink" | "rose-quartz" | "ai-lab" | "midnight-ai" | "sage-reset" | "warm-neutral" | "lavender-tech"} props.theme - Current theme key (same as rest of app)
 * @param {"day" | "night"} props.dayNightMode - Current day/night mode
 * @param {"yearly" | "monthly" | "weekly" | "daily"} props.page - Current page
 * @param {boolean} props.isLoginPage - Whether this is the login page (reduced effects)
 */
export default function BackgroundFX({ theme = 'ai-lab', dayNightMode = 'day', page = 'weekly', isLoginPage = false }) {
  // Use single computed themeKey - use theme as-is (same as rest of app, no duplicate mapping)
  const themeKey = theme; // Use theme key directly (same as rest of app)
  
  // Get FX config for this theme and mode combination from fxConfig
  const config = useMemo(() => getFXConfig(themeKey, dayNightMode, page, isLoginPage), [themeKey, dayNightMode, page, isLoginPage]);

  // Generate random number between min and max (seeded by theme+mode+page for consistency)
  const random = useMemo(() => {
    const baseSeed = `${themeKey}-${dayNightMode}-${page}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (min, max, index = 0) => {
      // Simple seeded random using baseSeed + index
      const seed = (baseSeed * 9301 + index * 49297) % 233280;
      const normalized = (seed % 233280) / 233280;
      return min + normalized * (max - min);
    };
  }, [themeKey, dayNightMode, page]);

  // Generate random integer
  const randomInt = useMemo(() => {
    return (min, max, index = 0) => Math.floor(random(min, max + 0.99, index));
  }, [random]);

  // Render Pink theme (hearts + sparkles) - Improved visibility
  const blushElements = useMemo(() => {
    const elements = [];

    // Hearts with improved visibility and staggered animations
    const animationVariants = ['floatUp', 'floatUpSlow', 'floatUpMedium'];
    
    for (let i = 0; i < config.heartCount; i++) {
      const size = randomInt(config.heartSizes.min, config.heartSizes.max, i * 3);
      const duration = random(config.animationDuration.min, config.animationDuration.max, i * 3 + 1);
      // Stagger delays more significantly for natural movement
      const delay = random(0, duration * 0.8, i * 3 + 2);
      const left = random(5, 95, i * 4); // Keep away from edges
      const top = random(0, 100, i * 4 + 1);
      const color = config.heartColors[randomInt(0, config.heartColors.length - 1, i * 2)];
      // Use different animation variants for staggered movement
      const animationVariant = animationVariants[i % animationVariants.length];
      
      // Determine blur based on size (larger hearts less blur, smaller more blur for depth)
      const blurAmount = size < 22 ? 2 : size < 28 ? 1 : 0;
      
      // Soft pink glow effect
      const glowColor = 'rgba(244, 114, 182, 0.15)';
      const glowSize = size * 1.5;

      elements.push(
        <div
          key={`heart-${i}`}
          className="fx-heart"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.88, // Higher base opacity (85-90%)
            animation: `${animationVariant} ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            willChange: 'transform, opacity',
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
            zIndex: -1, // Behind all interactive UI
            pointerEvents: 'none', // Critical: never block clicks
          }}
          aria-hidden="true"
        >
          {/* Soft glow effect */}
          {config.heartGlow && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${glowSize}px`,
                height: `${glowSize}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
                filter: 'blur(4px)',
                pointerEvents: 'none', // Critical: never block clicks
                zIndex: -1,
              }}
              aria-hidden="true"
            />
          )}
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              width: '100%', 
              height: '100%',
              filter: 'drop-shadow(0 0 2px rgba(244, 114, 182, 0.3))', // Subtle shadow for depth
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={color}
            />
          </svg>
        </div>
      );
    }

    // Sparkles
    for (let i = 0; i < config.sparkleCount; i++) {
      const index = config.heartCount + i;
      const size = randomInt(config.sparkleSizes.min, config.sparkleSizes.max, index * 3);
      const duration = random(3, 5, index * 3 + 1);
      const delay = random(0, 2, index * 3 + 2);
      const left = random(0, 100, index * 4);
      const top = random(0, 100, index * 4 + 1);
      const color = config.sparkleColors[randomInt(0, config.sparkleColors.length - 1, index * 2)];

      elements.push(
        <div
          key={`sparkle-${i}`}
          className="fx-sparkle"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.5,
            animation: `twinkle ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 2}px ${color}`,
            willChange: 'transform, opacity',
            zIndex: -1,
            pointerEvents: 'none', // Critical: never block clicks
          }}
          aria-hidden="true"
        />
      );
    }

    return elements;
  }, [config, random, randomInt]);

  // Render Flux theme (electric particles)
  const fluxElements = useMemo(() => {
    const elements = [];

    // Particles (dots)
    for (let i = 0; i < config.particleCount; i++) {
      const size = randomInt(config.particleSizes.min, config.particleSizes.max, i * 3);
      const duration = random(config.animationDuration.min, config.animationDuration.max, i * 3 + 1);
      const delay = random(0, duration * 0.5, i * 3 + 2);
      const left = random(0, 100, i * 4);
      const top = random(-10, 110, i * 4 + 1);
      const color = config.particleColors[randomInt(0, config.particleColors.length - 1, i * 2)];

      elements.push(
        <div
          key={`particle-${i}`}
          className="fx-particle"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.4,
            animation: `drift ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 3}px ${color}`,
            willChange: 'transform, opacity',
            zIndex: -1,
            pointerEvents: 'none', // Critical: never block clicks
          }}
          aria-hidden="true"
        />
      );
    }

    // Lines (electric connections)
    for (let i = 0; i < config.lineCount; i++) {
      const index = config.particleCount + i;
      const length = randomInt(config.lineLengths.min, config.lineLengths.max, index * 3);
      const duration = random(config.animationDuration.min * 0.8, config.animationDuration.max * 0.8, index * 3 + 1);
      const delay = random(0, duration * 0.5, index * 3 + 2);
      const left = random(0, 90, index * 4);
      const top = random(0, 90, index * 4 + 1);
      const rotation = random(0, 360, index * 3);
      const color = config.lineColors[randomInt(0, config.lineColors.length - 1, index * 2)];

      elements.push(
        <div
          key={`line-${i}`}
          className="fx-line"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${length}px`,
            height: '2px',
            opacity: 0.3,
            animation: `drift ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'left center',
            willChange: 'transform, opacity',
            zIndex: -1,
            pointerEvents: 'none', // Critical: never block clicks
          }}
          aria-hidden="true"
        />
      );
    }

    // Glows (electric field effects)
    for (let i = 0; i < config.glowCount; i++) {
      const index = config.particleCount + config.lineCount + i;
      const size = randomInt(config.glowSizes.min, config.glowSizes.max, index * 3);
      const duration = random(config.animationDuration.min * 1.2, config.animationDuration.max * 1.2, index * 3 + 1);
      const delay = random(0, duration * 0.5, index * 3 + 2);
      const left = random(0, 100, index * 4);
      const top = random(0, 100, index * 4 + 1);
      const color = config.glowColors[randomInt(0, config.glowColors.length - 1, index * 2)];

      elements.push(
        <div
          key={`glow-${i}`}
          className="fx-glow"
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.2,
            animation: `floatUp ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(20px)',
            willChange: 'transform, opacity',
            zIndex: -1,
            pointerEvents: 'none', // Critical: never block clicks
          }}
          aria-hidden="true"
        />
      );
    }

    return elements;
  }, [config, random, randomInt]);

  // Hearts should ONLY show in Day Mode Pink + Day Mode Rose Quartz
  const shouldShowHearts = dayNightMode === 'day' && (themeKey === 'pink' || themeKey === 'rose-quartz');

  return (
    <div 
      className="background-fx" 
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none', // Critical: ensure background doesn't block interactions
        zIndex: -1, // Behind all interactive UI
        overflow: 'hidden',
      }}
    >
      {shouldShowHearts ? blushElements : fluxElements}
    </div>
  );
}

