import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getRecommendations, getRecommendationsSync } from '../utils/dailyRecommendations';

/**
 * AI Recommendations Card for Daily Planner
 * Shows actionable suggestions based on task data
 * Collapsible, theme-aware, warm and supportive
 * Supports both rules-based (default) and server AI (future) modes
 * 
 * @param {Object} props
 * @param {Array} props.tasks - List of tasks
 * @param {Array} props.top3Today - Top 3 priorities
 * @param {Array} props.schedule - Time blocks/appointments
 * @param {Object} props.moodEnergy - { mood: number, energy: number }
 */
export default function DailyRecommendations({ tasks, top3Today, schedule, moodEnergy }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate recommendations when data changes
  useEffect(() => {
    const dailyData = { tasks, top3Today, schedule, moodEnergy };
    
    // Use sync version for rules-based (instant), async for AI (future)
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        // Try async first (for AI mode), fallback to sync (for rules mode)
        const recs = await getRecommendations(dailyData);
        setRecommendations(recs || []);
      } catch (error) {
        console.error('[Recommendations] Error loading recommendations:', error);
        // Fallback to sync rules-based
        const recs = getRecommendationsSync(dailyData);
        setRecommendations(recs || []);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendations();
  }, [tasks, top3Today, schedule, moodEnergy]);
  
  // Don't show if no recommendations or no tasks
  if (recommendations.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <WidgetCard 
      title="Recommendations" 
      accent="gray"
      className="md:col-span-2"
      actions={
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/80 hover:text-white text-xs transition-colors px-2 py-1 rounded"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          style={{
            borderRadius: 'var(--rc-radius)'
          }}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      }
    >
      {!isCollapsed && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-sm text-gray-500 text-center py-2">
              Loading recommendations...
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg transition-colors hover:bg-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--rc-radius)'
                }}
              >
                <span className="text-xs text-gray-400 mt-0.5 flex-shrink-0">•</span>
                <p className="text-sm text-gray-700 font-light leading-relaxed flex-1">
                  {rec}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </WidgetCard>
  );
}

