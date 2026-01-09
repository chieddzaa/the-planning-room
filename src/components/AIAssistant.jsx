import React, { useState } from 'react';
import WidgetCard from './WidgetCard';

/**
 * Selah - AI Guide Component
 * Creates space for pause, reflection, and intentional action
 * Speaks gently, briefly, and with wisdom
 * 
 * @param {Object} props
 * @param {string} props.mode - AI mode: 'observer', 'advisor', 'co-pilot'
 * @param {Object} props.insight - The Selah insight object with message, type, and optional suggestion
 * @param {Function} props.onAction - Callback when user takes action (accept/edit/ignore)
 * @param {boolean} props.collapsible - Whether the card can be collapsed
 * @param {string} props.title - Custom title (default: "selah")
 */
export default function AIAssistant({
  mode = 'advisor',
  insight,
  onAction,
  collapsible = false,
  title = 'selah'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);

  if (!insight) {
    return null;
  }

  const handleAction = (action) => {
    setActionTaken(action);
    if (onAction) {
      onAction(action, insight);
    }
  };

  const renderSuggestion = () => {
    if (!insight.suggestion || actionTaken) {
      return null;
    }

    return (
      <div className="mt-3 pt-3 border-t border-gray-200/50">
        <p className="text-sm text-gray-600 mb-3 font-light">
          {insight.suggestion.text}
        </p>
        <div className="flex gap-2">
          {insight.suggestion.actions?.includes('accept') && (
            <button
              onClick={() => handleAction('accept')}
              className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))'
              }}
            >
              accept
            </button>
          )}
          {insight.suggestion.actions?.includes('edit') && (
            <button
              onClick={() => handleAction('edit')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50"
            >
              edit
            </button>
          )}
          {insight.suggestion.actions?.includes('ignore') && (
            <button
              onClick={() => handleAction('ignore')}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-transparent rounded-lg transition-all duration-200 hover:text-gray-700"
            >
              ignore
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isCollapsed && collapsible) {
      return null;
    }

    return (
      <div>
        <p className="text-sm text-gray-700 font-light leading-relaxed">
          {insight.message}
        </p>
        {renderSuggestion()}
        {actionTaken && (
          <p className="text-xs text-gray-400 mt-2 italic">
            {actionTaken === 'accept' && 'noted'}
            {actionTaken === 'edit' && 'ready to edit'}
            {actionTaken === 'ignore' && 'got it'}
          </p>
        )}
      </div>
    );
  };

  return (
    <WidgetCard
      title={title}
      accent="gray"
      actions={
        collapsible ? (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/80 hover:text-white text-xs transition-colors"
            aria-label={isCollapsed ? 'expand' : 'collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        ) : null
      }
    >
      {renderContent()}
    </WidgetCard>
  );
}

