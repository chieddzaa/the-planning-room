import React, { useMemo, useImperativeHandle, forwardRef, useState } from 'react';
import WidgetCard from '../components/WidgetCard';
import AIAssistant from '../components/AIAssistant';
import DailyRecommendations from '../components/DailyRecommendations';
import DoneForTodayModal from '../components/DoneForTodayModal';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { buildKey } from '../utils/storageKeys';
import { generateDailyInsight } from '../utils/aiAssistant';
import Microcopy from '../components/Microcopy';

// Initial state constants
const INITIAL_STATE = {
  schedule: [],
  top3Today: Array(3).fill(null).map((_, i) => ({ id: i, text: '' })),
  tasks: [],
  notes: '',
  moodEnergy: { mood: 3, energy: 3 },
};

const Daily = forwardRef(function Daily({ username, onSavingChange, onNavigateToWeekly }, ref) {
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);

  // Schedule (time blocks)
  const [schedule, setSchedule, , flushSchedule] = useLocalStorageState(
    buildKey(username, 'daily.schedule'),
    INITIAL_STATE.schedule,
    onSavingChange
  );

  // Top 3 Today
  const [top3Today, setTop3Today, , flushTop3] = useLocalStorageState(
    buildKey(username, 'daily.top3'),
    INITIAL_STATE.top3Today,
    onSavingChange
  );

  // Tasks
  const [tasks, setTasks, , flushTasks] = useLocalStorageState(
    buildKey(username, 'daily.tasks'),
    INITIAL_STATE.tasks,
    onSavingChange
  );

  // Notes
  const [notes, setNotes, , flushNotes] = useLocalStorageState(
    buildKey(username, 'daily.notes'),
    INITIAL_STATE.notes,
    onSavingChange
  );

  // Mood/Energy
  const [moodEnergy, setMoodEnergy, , flushMoodEnergy] = useLocalStorageState(
    buildKey(username, 'daily.moodEnergy'),
    INITIAL_STATE.moodEnergy,
    onSavingChange
  );

  // Reset function
  const handleReset = () => {
    setSchedule(INITIAL_STATE.schedule);
    setTop3Today(INITIAL_STATE.top3Today);
    setTasks(INITIAL_STATE.tasks);
    setNotes(INITIAL_STATE.notes);
    setMoodEnergy(INITIAL_STATE.moodEnergy);
  };

  // Flush all saves (force immediate save)
  const flushAllSaves = () => {
    flushSchedule();
    flushTop3();
    flushTasks();
    flushNotes();
    flushMoodEnergy();
  };

  // Expose reset and flushSave functions via ref
  useImperativeHandle(ref, () => ({
    reset: handleReset,
    flushSave: flushAllSaves
  }));

  // Schedule handlers
  const addTimeBlock = () => {
    setSchedule(prev => [...prev, { 
      id: Date.now(), 
      startTime: '', 
      endTime: '', 
      label: '' 
    }]);
  };

  const updateTimeBlock = (id, field, value) => {
    setSchedule(prev =>
      prev.map(block => block.id === id ? { ...block, [field]: value } : block)
    );
  };

  const deleteTimeBlock = (id) => {
    setSchedule(prev => prev.filter(block => block.id !== id));
  };

  // Top 3 Today handlers
  const updateTop3 = (index, value) => {
    setTop3Today(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], text: value };
      return updated;
    });
  };

  // Tasks handlers
  const addTask = () => {
    setTasks(prev => [...prev, { 
      id: Date.now(), 
      text: '', 
      completed: false, 
      dueTime: '' 
    }]);
  };

  const updateTask = (id, field, value) => {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, [field]: value } : task)
    );
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Mood/Energy handlers
  const updateMoodEnergy = (type, value) => {
    setMoodEnergy(prev => ({ ...prev, [type]: parseInt(value) }));
  };

  const moodLabels = ['😞', '😐', '🙂', '😊', '😄'];
  const energyLabels = ['😴', '😑', '😌', '😃', '⚡'];

  // Generate AI insight
  const dailyInsight = useMemo(() => {
    return generateDailyInsight({
      schedule,
      top3Today,
      tasks,
      moodEnergy
    });
  }, [schedule, top3Today, tasks, moodEnergy]);

  const handleAIAction = (action, insight) => {
    // Handle AI action (accept/edit/ignore)
    // For now, just log - can be extended to actually make changes
    console.log('AI Action:', action, insight);
  };

  // Check if daily planner has any content
  const hasContent = () => {
    const hasSchedule = schedule.some(block => block.label?.trim() || block.startTime);
    const hasTop3 = top3Today.some(item => item.text?.trim());
    const hasTasks = tasks.some(task => task.text?.trim());
    const hasNotes = notes?.trim();
    return hasSchedule || hasTop3 || hasTasks || hasNotes;
  };


  // Handle "Done for Today" button click
  const handleDoneForToday = () => {
    // Ensure all current state is saved immediately (flush any pending debounced saves)
    flushAllSaves();
    
    if (!hasContent()) {
      // Show confirmation if nothing is filled
      setShowConfirmEmpty(true);
    } else {
      // Show success modal
      setShowDoneModal(true);
    }
  };

  // Handle confirmation for empty planner
  const handleConfirmEmpty = () => {
    // Ensure all state is saved before showing modal
    flushAllSaves();
    setShowConfirmEmpty(false);
    setShowDoneModal(true);
  };

  // Handle navigation to weekly view
  const handleGoToWeekly = () => {
    setShowDoneModal(false);
    if (onNavigateToWeekly) {
      onNavigateToWeekly();
    }
  };

  return (
    <div className="space-y-6">
      {/* Selah Insight Card - Collapsible */}
      {dailyInsight && (
        <div className="md:col-span-2">
          <AIAssistant
            mode="advisor"
            insight={dailyInsight}
            onAction={handleAIAction}
            collapsible={true}
            title="selah"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Schedule */}
      <WidgetCard title="Schedule" accent="blue">
        <div className="space-y-2">
          <button
            onClick={addTimeBlock}
            className="button-windows text-xs px-2 py-1 w-full mb-2"
          >
            + Add Time Block
          </button>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {schedule.length === 0 ? (
              <p className="text-gray-500 text-sm py-2 text-center">No time blocks yet</p>
            ) : (
              schedule.map((block) => (
                <div key={block.id} className="flex gap-2 items-center p-2 bg-white/50 border border-gray-200">
                  <input
                    type="time"
                    value={block.startTime}
                    onChange={(e) => updateTimeBlock(block.id, 'startTime', e.target.value)}
                    className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-xs flex-shrink-0 w-24"
                  />
                  <span className="text-xs text-gray-400">-</span>
                  <input
                    type="time"
                    value={block.endTime}
                    onChange={(e) => updateTimeBlock(block.id, 'endTime', e.target.value)}
                    className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-xs flex-shrink-0 w-24"
                  />
                  <input
                    type="text"
                    value={block.label}
                    onChange={(e) => updateTimeBlock(block.id, 'label', e.target.value)}
                    placeholder="Activity..."
                    className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-sm"
                  />
                  <button
                    onClick={() => deleteTimeBlock(block.id)}
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

      {/* Top 3 Today */}
      <WidgetCard title="Top 3 Today" accent="green">
        <div className="space-y-2">
          <Microcopy message="Tend what matters." className="mb-1" />
          {top3Today.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">
                {index + 1}.
              </span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateTop3(index, e.target.value)}
                placeholder={`Priority ${index + 1}...`}
                className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm"
              />
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Tasks */}
      <WidgetCard title="Tasks" accent="orange">
        <div className="space-y-2">
          <button
            onClick={addTask}
            className="button-windows text-xs px-2 py-1 w-full mb-2"
          >
            + Add Task
          </button>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="py-4 text-center space-y-1">
                <p className="text-gray-500 text-sm">No tasks yet</p>
                <Microcopy message="Small steps count." />
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 p-2 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 cursor-pointer flex-shrink-0 mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => updateTask(task.id, 'text', e.target.value)}
                      placeholder="Task description..."
                      className={`w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-orange text-sm ${
                        task.completed ? 'line-through text-gray-500' : ''
                      }`}
                    />
                    <input
                      type="time"
                      value={task.dueTime}
                      onChange={(e) => updateTask(task.id, 'dueTime', e.target.value)}
                      placeholder="Due time (optional)"
                      className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-orange text-xs"
                    />
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
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
      
      {/* AI Recommendations - Shows when tasks exist */}
      {tasks.length > 0 && (
        <DailyRecommendations
          tasks={tasks}
          top3Today={top3Today}
          schedule={schedule}
          moodEnergy={moodEnergy}
        />
      )}

      {/* Notes */}
      <WidgetCard title="Notes" accent="blue">
        <div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Daily notes, thoughts, reminders..."
            rows="8"
            className="w-full px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-blue text-sm resize-none"
          />
        </div>
      </WidgetCard>

      {/* Mood/Energy */}
      <WidgetCard title="Mood/Energy" accent="green" className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-3">
              Mood
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={moodEnergy.mood}
                onChange={(e) => updateMoodEnergy('mood', e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[120px]">
                <span className="text-2xl">{moodLabels[moodEnergy.mood - 1]}</span>
                <span className="text-xs text-gray-600 ml-1">{moodEnergy.mood}/5</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-3">
              Energy
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={moodEnergy.energy}
                onChange={(e) => updateMoodEnergy('energy', e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[120px]">
                <span className="text-2xl">{energyLabels[moodEnergy.energy - 1]}</span>
                <span className="text-xs text-gray-600 ml-1">{moodEnergy.energy}/5</span>
              </div>
            </div>
          </div>
        </div>
      </WidgetCard>
      </div>

      {/* Done for Today Button */}
      <div className="mt-8 pb-4 flex justify-center">
        <button
          onClick={handleDoneForToday}
          className="px-8 py-4 text-base sm:text-lg font-medium text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
            borderRadius: 'var(--rc-radius)',
            boxShadow: 'var(--rc-shadow), 0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            minHeight: '48px'
          }}
        >
          Done for Today
        </button>
      </div>

      {/* Done Modal */}
      <DoneForTodayModal
        isOpen={showDoneModal}
        onClose={() => setShowDoneModal(false)}
        onGoToWeekly={onNavigateToWeekly ? handleGoToWeekly : null}
      />

      {/* Empty Confirmation Modal */}
      {showConfirmEmpty && (
        <>
          <div
            onClick={() => setShowConfirmEmpty(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] transition-opacity duration-300"
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
              style={{
                background: 'var(--rc-glass)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 'var(--rc-radius)',
                boxShadow: 'var(--rc-shadow), 0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center" style={{ color: 'var(--rc-text)' }}>
                Are you sure you're done?
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center font-light" style={{ color: 'var(--rc-muted)' }}>
                You haven't added anything to your plan today.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmEmpty(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white border-2 text-gray-700 hover:bg-gray-50"
                  style={{
                    borderColor: 'var(--rc-accent)',
                    borderRadius: 'var(--rc-radius)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEmpty}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, var(--rc-accent), var(--rc-accent-2))',
                    borderRadius: 'var(--rc-radius)',
                    boxShadow: 'var(--rc-shadow)'
                  }}
                >
                  Yes, I'm done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Daily;
