import React from 'react';
import GlassCard from './GlassCard';

export default function CalendarView() {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const isToday = (day) => day === today.getDate();

  return (
    <div className="space-y-4">
      <GlassCard title="Calendar" accent="orange">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentMonth}</h3>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center text-sm border border-gray-200 ${
                  day
                    ? isToday(day)
                      ? 'bg-windows-blue text-white font-semibold'
                      : 'bg-white/50 hover:bg-white/70 cursor-pointer'
                    : 'bg-transparent'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white/50 border border-gray-200">
            <p className="text-sm text-gray-600">
              Click on a date to add events or reminders.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


