import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import GlassCard from './GlassCard';

export default function NotesManager() {
  const [notes, setNotes] = useLocalStorage('planning-room-notes', []);

  const addNote = () => {
    const note = {
      id: Date.now(),
      title: '',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
  };

  const updateNote = (id, field, value) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, [field]: value } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-4">
      <GlassCard title="Notes" accent="green">
        <div className="space-y-3">
          <button
            onClick={addNote}
            className="button-windows text-sm font-medium mb-4"
          >
            + New Note
          </button>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No notes yet. Create one above!</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors"
                >
                  <input
                    type="text"
                    value={note.title || ''}
                    onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                    placeholder="Note title..."
                    className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm font-semibold mb-2"
                  />
                  <textarea
                    value={note.content || ''}
                    onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                    placeholder="Write your note here..."
                    rows="3"
                    className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-green text-sm resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


