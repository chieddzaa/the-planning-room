import React, { useMemo, useImperativeHandle, forwardRef } from 'react';
import WidgetCard from '../components/WidgetCard';
import AIAssistant from '../components/AIAssistant';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { buildKey } from '../utils/storageKeys';
import { generateMonthlyInsight } from '../utils/aiAssistant';
import Microcopy from '../components/Microcopy';

// Initial state constants
const INITIAL_STATE = {
  monthGoals: Array(5).fill(null).map((_, i) => ({ id: i, text: '', completed: false })),
  habits: Array(6).fill(null).map((_, i) => ({
    id: i,
    name: '',
    weeks: [false, false, false, false] // 4 weeks
  })),
  keyDates: [],
  reflection: {
    wins: ['', '', ''],
    lesson: '',
    change: ''
  },
};

const Monthly = forwardRef(function Monthly({ username, onSavingChange }, ref) {
  // Month Goals (Top 5)
  const [monthGoals, setMonthGoals, , flushMonthGoals] = useLocalStorageState(
    buildKey(username, 'monthly.goals'),
    INITIAL_STATE.monthGoals,
    onSavingChange
  );

  // Habit Tracker (6 habits x 4 weeks)
  const [habits, setHabits, , flushHabits] = useLocalStorageState(
    buildKey(username, 'monthly.habits'),
    INITIAL_STATE.habits,
    onSavingChange
  );

  // Key Dates
  const [keyDates, setKeyDates, , flushKeyDates] = useLocalStorageState(
    buildKey(username, 'monthly.keyDates'),
    INITIAL_STATE.keyDates,
    onSavingChange
  );

  // Monthly Reflection
  const [reflection, setReflection, , flushReflection] = useLocalStorageState(
    buildKey(username, 'monthly.reflection'),
    INITIAL_STATE.reflection,
    onSavingChange
  );

  // Reset function
  const handleReset = () => {
    setMonthGoals(INITIAL_STATE.monthGoals);
    setHabits(INITIAL_STATE.habits);
    setKeyDates(INITIAL_STATE.keyDates);
    setReflection(INITIAL_STATE.reflection);
  };

  // Flush all saves (force immediate save)
  const flushAllSaves = () => {
    flushMonthGoals();
    flushHabits();
    flushKeyDates();
    flushReflection();
  };

  // Expose reset and flushSave functions via ref
  useImperativeHandle(ref, () => ({
    reset: handleReset,
    flushSave: flushAllSaves
  }));

  // Month Goals handlers
  const updateMonthGoal = (index, field, value) => {
    setMonthGoals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleMonthGoal = (index) => {
    setMonthGoals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      return updated;
    });
  };

  // Habit Tracker handlers
  const updateHabitName = (index, name) => {
    setHabits(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const toggleHabitWeek = (habitIndex, weekIndex) => {
    setHabits(prev => {
      const updated = [...prev];
      updated[habitIndex].weeks[weekIndex] = !updated[habitIndex].weeks[weekIndex];
      return updated;
    });
  };

  // Key Dates handlers
  const addKeyDate = () => {
    setKeyDates(prev => [...prev, { id: Date.now(), date: '', label: '' }]);
  };

  const updateKeyDate = (id, field, value) => {
    setKeyDates(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const deleteKeyDate = (id) => {
    setKeyDates(prev => prev.filter(item => item.id !== id));
  };

  // Reflection handlers
  const updateReflection = (field, value, index = null) => {
    setReflection(prev => {
      if (index !== null) {
        // For wins array
        const wins = [...prev.wins];
        wins[index] = value;
        return { ...prev, wins };
      } else {
        // For lesson or change
        return { ...prev, [field]: value };
      }
    });
  };

  // Generate AI insight (read-only)
  const monthlyInsight = useMemo(() => {
    return generateMonthlyInsight({
      monthGoals,
      reflection
    });
  }, [monthGoals, reflection]);

  const handleAIAction = (action, insight) => {
    console.log('AI Action:', action, insight);
  };

  return (
    <div className="space-y-6">
      {/* Selah Insight - Read-only */}
      {monthlyInsight && (
        <div className="md:col-span-2">
          <AIAssistant
            mode="observer"
            insight={monthlyInsight}
            onAction={handleAIAction}
            collapsible={false}
            title="selah"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Month Goals (Top 5) */}
      <WidgetCard title="Month Goals (Top 5)" accent="green">
        <div className="space-y-2">
          {monthGoals.map((goal, index) => (
            <div key={goal.id} className="flex items-center gap-2 p-2 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleMonthGoal(index)}
                className="w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={goal.text}
                onChange={(e) => updateMonthGoal(index, 'text', e.target.value)}
                placeholder={`Goal ${index + 1}...`}
                className={`flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm ${
                  goal.completed ? 'line-through text-gray-500' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Habit Tracker */}
      <WidgetCard title="Habit Tracker" accent="blue">
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 mb-2">
            <div>Habit</div>
            <div className="text-center">W1</div>
            <div className="text-center">W2</div>
            <div className="text-center">W3</div>
            <div className="text-center">W4</div>
          </div>
          {habits.map((habit, habitIndex) => (
            <div key={habit.id} className="grid grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={habit.name}
                onChange={(e) => updateHabitName(habitIndex, e.target.value)}
                placeholder={`Habit ${habitIndex + 1}...`}
                className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-xs"
              />
              {habit.weeks.map((completed, weekIndex) => (
                <button
                  key={weekIndex}
                  onClick={() => toggleHabitWeek(habitIndex, weekIndex)}
                  className={`w-6 h-6 mx-auto border-2 border-windows-border flex items-center justify-center transition-all ${
                    completed
                      ? 'bg-windows-green border-windows-green'
                      : 'bg-white hover:bg-cool-grey'
                  }`}
                  title={`Week ${weekIndex + 1}`}
                >
                  {completed && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Key Dates */}
      <WidgetCard title="Key Dates" accent="orange">
        <div className="space-y-2">
          <button
            onClick={addKeyDate}
            className="button-windows text-xs px-2 py-1 w-full mb-2"
          >
            + Add Date
          </button>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {keyDates.length === 0 ? (
              <p className="text-gray-500 text-sm py-2 text-center">No dates added yet</p>
            ) : (
              keyDates.map((item) => (
                <div key={item.id} className="flex gap-2 items-center p-2 bg-white/50 border border-gray-200">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateKeyDate(item.id, 'date', e.target.value)}
                    className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-orange text-xs flex-shrink-0 w-32"
                  />
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateKeyDate(item.id, 'label', e.target.value)}
                    placeholder="Event label..."
                    className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-orange text-sm"
                  />
                  <button
                    onClick={() => deleteKeyDate(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </WidgetCard>

      {/* Monthly Reflection */}
      <WidgetCard title="Monthly Reflection" accent="green">
        <Microcopy message="A gentle reset." className="mb-3" />
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              3 Wins
            </label>
            <div className="space-y-2">
              {reflection.wins.map((win, index) => (
                <input
                  key={index}
                  type="text"
                  value={win}
                  onChange={(e) => updateReflection('wins', e.target.value, index)}
                  placeholder={`Win ${index + 1}...`}
                  className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              1 Lesson Learned
            </label>
            <textarea
              value={reflection.lesson}
              onChange={(e) => updateReflection('lesson', e.target.value)}
              placeholder="What did you learn this month?"
              rows="2"
              className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              1 Change for Next Month
            </label>
            <textarea
              value={reflection.change}
              onChange={(e) => updateReflection('change', e.target.value)}
              placeholder="What will you do differently next month?"
              rows="2"
              className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm resize-none"
            />
          </div>
        </div>
      </WidgetCard>
      </div>
    </div>
  );
});

export default Monthly;
