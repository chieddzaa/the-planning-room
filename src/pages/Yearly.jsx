import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import WidgetCard from '../components/WidgetCard';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { buildKey } from '../utils/storageKeys';
import Microcopy from '../components/Microcopy';

// Initial state constants
const INITIAL_STATE = {
  yearTheme: '',
  yearScripture: '',
  goals: Array(10).fill(null).map((_, i) => ({ id: i, text: '', completed: false })),
  lifeAreas: {
    faith: 5,
    health: 5,
    career: 5,
    money: 5,
    relationships: 5,
  },
  milestones: [],
  visionNotes: '',
};

const Yearly = forwardRef(function Yearly({ username, onSavingChange }, ref) {
  // Year Theme
  const [yearTheme, setYearTheme, , flushYearTheme] = useLocalStorageState(
    buildKey(username, 'yearly.theme'),
    INITIAL_STATE.yearTheme,
    onSavingChange
  );
  const [yearScripture, setYearScripture, , flushYearScripture] = useLocalStorageState(
    buildKey(username, 'yearly.scripture'),
    INITIAL_STATE.yearScripture,
    onSavingChange
  );

  // Top 10 Goals
  const [goals, setGoals, , flushGoals] = useLocalStorageState(
    buildKey(username, 'yearly.goals'),
    INITIAL_STATE.goals,
    onSavingChange
  );

  // Life Areas
  const [lifeAreas, setLifeAreas, , flushLifeAreas] = useLocalStorageState(
    buildKey(username, 'yearly.lifeAreas'),
    INITIAL_STATE.lifeAreas,
    onSavingChange
  );

  // Milestones
  const [milestones, setMilestones, , flushMilestones] = useLocalStorageState(
    buildKey(username, 'yearly.milestones'),
    INITIAL_STATE.milestones,
    onSavingChange
  );

  // Vision Notes
  const [visionNotes, setVisionNotes, , flushVisionNotes] = useLocalStorageState(
    buildKey(username, 'yearly.visionNotes'),
    INITIAL_STATE.visionNotes,
    onSavingChange
  );

  // Reset function
  const handleReset = () => {
    setYearTheme(INITIAL_STATE.yearTheme);
    setYearScripture(INITIAL_STATE.yearScripture);
    setGoals(INITIAL_STATE.goals);
    setLifeAreas(INITIAL_STATE.lifeAreas);
    setMilestones(INITIAL_STATE.milestones);
    setVisionNotes(INITIAL_STATE.visionNotes);
  };

  // Flush all saves (force immediate save)
  const flushAllSaves = () => {
    flushYearTheme();
    flushYearScripture();
    flushGoals();
    flushLifeAreas();
    flushMilestones();
    flushVisionNotes();
  };

  // Expose reset and flushSave functions via ref
  useImperativeHandle(ref, () => ({
    reset: handleReset,
    flushSave: flushAllSaves
  }));

  // Goal handlers
  const updateGoal = (index, field, value) => {
    setGoals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleGoal = (index) => {
    setGoals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      return updated;
    });
  };

  // Life Area handlers
  const updateLifeArea = (area, value) => {
    setLifeAreas(prev => ({ ...prev, [area]: parseInt(value) }));
  };

  // Milestone handlers
  const addMilestone = () => {
    setMilestones(prev => [...prev, { month: '', text: '', id: Date.now() }]);
  };

  const updateMilestone = (id, field, value) => {
    setMilestones(prev =>
      prev.map(m => m.id === id ? { ...m, [field]: value } : m)
    );
  };

  const deleteMilestone = (id) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Year Theme */}
      <WidgetCard title="year theme" accent="blue">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              what matters this year?
            </label>
            <input
              type="text"
              value={yearTheme}
              onChange={(e) => setYearTheme(e.target.value)}
              placeholder="growth, balance, adventure..."
              className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-blue text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              a word or quote to carry with you
            </label>
            <textarea
              value={yearScripture}
              onChange={(e) => setYearScripture(e.target.value)}
              placeholder="something that inspires you..."
              rows="3"
              className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-blue text-sm resize-none"
            />
          </div>
        </div>
      </WidgetCard>

      {/* Top 10 Goals */}
      <WidgetCard title="top 10 goals" accent="green">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <Microcopy message="Tend what matters." className="mb-2" />
          {goals.map((goal, index) => (
            <div key={goal.id} className="flex items-center gap-2 p-2 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(index)}
                className="w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={goal.text}
                onChange={(e) => updateGoal(index, 'text', e.target.value)}
                placeholder={`what do you want to achieve?`}
                className={`flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm ${
                  goal.completed ? 'line-through text-gray-500' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Life Areas */}
      <WidgetCard title="life areas" accent="orange">
        <div className="space-y-4">
          {[
            { key: 'faith', label: 'faith' },
            { key: 'health', label: 'health' },
            { key: 'career', label: 'career' },
            { key: 'money', label: 'money' },
            { key: 'relationships', label: 'relationships' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-xs text-gray-600 w-8 text-right">{lifeAreas[key]}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={lifeAreas[key]}
                onChange={(e) => updateLifeArea(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Milestones */}
      <WidgetCard title="milestones" accent="blue">
        <div className="space-y-3">
          <button
            onClick={addMilestone}
            className="button-windows text-xs px-2 py-1 w-full"
          >
            + add milestone
          </button>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {milestones.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center italic">this space is yours — add milestones as they come</p>
            ) : (
              milestones.map((milestone) => (
                <div key={milestone.id} className="flex gap-2 items-start p-2 bg-white/50 border border-gray-200">
                  <select
                    value={milestone.month}
                    onChange={(e) => updateMilestone(milestone.id, 'month', e.target.value)}
                    className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-xs flex-shrink-0 w-24"
                  >
                    <option value="">month</option>
                    {monthOptions.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={milestone.text}
                    onChange={(e) => updateMilestone(milestone.id, 'text', e.target.value)}
                    placeholder="what are you celebrating?"
                    className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-sm"
                  />
                  <button
                    onClick={() => deleteMilestone(milestone.id)}
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

      {/* Vision Notes */}
      <WidgetCard title="vision notes" accent="green" className="md:col-span-2">
        <div>
          <textarea
            value={visionNotes}
            onChange={(e) => setVisionNotes(e.target.value)}
            placeholder="let's plan gently... what do you want to achieve? how do you want to grow? what legacy do you want to build?"
            rows="6"
            className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-green text-sm resize-none"
          />
        </div>
      </WidgetCard>
    </div>
  );
});

export default Yearly;
