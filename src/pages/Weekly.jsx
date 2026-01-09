import React, { useMemo, useImperativeHandle, forwardRef } from 'react';
import WidgetCard from '../components/WidgetCard';
import AIAssistant from '../components/AIAssistant';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { buildKey } from '../utils/storageKeys';
import { generateWeeklyReflection } from '../utils/aiAssistant';
import Microcopy from '../components/Microcopy';

// Initial state constants
const INITIAL_STATE = {
  weeklyFocus: '',
  priorities: Array(3).fill(null).map((_, i) => ({ id: i, text: '' })),
  weeklyPlan: {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  },
  weeklyReview: {
    worked: '',
    didntWork: ''
  },
};

const Weekly = forwardRef(function Weekly({ username, onSavingChange }, ref) {
  // Weekly Focus
  const [weeklyFocus, setWeeklyFocus] = useLocalStorageState(
    buildKey(username, 'weekly.focus'),
    INITIAL_STATE.weeklyFocus,
    onSavingChange
  );

  // Top 3 Priorities
  const [priorities, setPriorities] = useLocalStorageState(
    buildKey(username, 'weekly.priorities'),
    INITIAL_STATE.priorities,
    onSavingChange
  );

  // Weekly Plan (Mon-Sun)
  const [weeklyPlan, setWeeklyPlan] = useLocalStorageState(
    buildKey(username, 'weekly.plan'),
    INITIAL_STATE.weeklyPlan,
    onSavingChange
  );

  // Weekly Review
  const [weeklyReview, setWeeklyReview] = useLocalStorageState(
    buildKey(username, 'weekly.review'),
    INITIAL_STATE.weeklyReview,
    onSavingChange
  );

  // Reset function
  const handleReset = () => {
    setWeeklyFocus(INITIAL_STATE.weeklyFocus);
    setPriorities(INITIAL_STATE.priorities);
    setWeeklyPlan(INITIAL_STATE.weeklyPlan);
    setWeeklyReview(INITIAL_STATE.weeklyReview);
  };

  // Expose reset function via ref
  useImperativeHandle(ref, () => ({
    reset: handleReset
  }));

  // Priorities handlers
  const updatePriority = (index, value) => {
    setPriorities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], text: value };
      return updated;
    });
  };

  // Weekly Plan handlers
  const updateDayPlan = (day, value) => {
    setWeeklyPlan(prev => ({ ...prev, [day]: value }));
  };

  // Weekly Review handlers
  const updateReview = (field, value) => {
    setWeeklyReview(prev => ({ ...prev, [field]: value }));
  };

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  // Generate AI reflection (only after user input)
  const weeklyReflection = useMemo(() => {
    return generateWeeklyReflection({
      weeklyReview,
      priorities
    });
  }, [weeklyReview, priorities]);

  const handleAIAction = (action, insight) => {
    console.log('AI Action:', action, insight);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weekly Focus */}
      <WidgetCard title="Weekly Focus" accent="orange">
        <div>
          <Microcopy message="Alignment over adrenaline." className="mb-2" />
          <input
            type="text"
            value={weeklyFocus}
            onChange={(e) => setWeeklyFocus(e.target.value)}
            placeholder="What's your focus for this week?"
            className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-orange text-sm"
          />
        </div>
      </WidgetCard>

      {/* Top 3 Priorities */}
      <WidgetCard title="Top 3 Priorities" accent="blue">
        <div className="space-y-2">
          {priorities.map((priority, index) => (
            <div key={priority.id} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">
                {index + 1}.
              </span>
              <input
                type="text"
                value={priority.text}
                onChange={(e) => updatePriority(index, e.target.value)}
                placeholder={`Priority ${index + 1}...`}
                className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-sm"
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Weekly Plan */}
      <WidgetCard title="Weekly Plan" accent="green" className="md:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {days.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-gray-600 block text-center">
                {label}
              </label>
              <textarea
                value={weeklyPlan[key]}
                onChange={(e) => updateDayPlan(key, e.target.value)}
                placeholder={`${label}...`}
                rows="4"
                className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-xs resize-none"
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Weekly Review */}
      <WidgetCard title="Weekly Review" accent="orange" className="md:col-span-2">
        <Microcopy message="A gentle reset." className="mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              What Worked
            </label>
            <textarea
              value={weeklyReview.worked}
              onChange={(e) => updateReview('worked', e.target.value)}
              placeholder="What went well this week?"
              rows="5"
              className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-orange text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              What Didn't Work
            </label>
            <textarea
              value={weeklyReview.didntWork}
              onChange={(e) => updateReview('didntWork', e.target.value)}
              placeholder="What could be improved?"
              rows="5"
              className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-orange text-sm resize-none"
            />
          </div>
        </div>
      </WidgetCard>
      </div>

      {/* Selah Reflection - Only shows after user input */}
      {weeklyReflection && (
        <div className="md:col-span-2">
          <AIAssistant
            mode="advisor"
            insight={weeklyReflection}
            onAction={handleAIAction}
            collapsible={false}
            title="selah"
          />
        </div>
      )}
    </div>
  );
});

export default Weekly;
