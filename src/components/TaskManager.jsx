import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import GlassCard from './GlassCard';

export default function TaskManager() {
  const [tasks, setTasks] = useLocalStorage('planning-room-tasks', []);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard title="Tasks" accent="blue">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-blue text-sm"
            />
            <button
              onClick={addTask}
              className="button-windows text-sm font-medium"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No tasks yet. Add one above!</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


