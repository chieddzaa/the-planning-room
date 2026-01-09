# The Planning Room

A Windows-retro inspired planning and productivity application built with React and Tailwind CSS.

## Features

- **Windows-retro UI**: Classic title bar, sidebar tabs, and status bar
- **Glassmorphism Cards**: Modern glass-effect cards with color accents
- **LocalStorage Persistence**: All user inputs are automatically saved
- **Multiple Views**: Tasks, Notes, Calendar, and Projects
- **Clean Typography**: Readable fonts with proper spacing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  components/
    TitleBar.jsx      # Windows-style title bar
    Sidebar.jsx       # Navigation sidebar with tabs
    StatusBar.jsx     # Bottom status bar
    GlassCard.jsx     # Reusable glassmorphism card
    TaskManager.jsx   # Task management component
    NotesManager.jsx  # Notes management component
    CalendarView.jsx  # Calendar view component
    ProjectsView.jsx  # Projects management component
  hooks/
    useLocalStorage.js # LocalStorage persistence hook
  App.jsx             # Main application component
  main.jsx            # Application entry point
  index.css           # Global styles and Tailwind imports
```

## Color Scheme

- **Windows Blue**: #0078d4 (primary accent)
- **Windows Green**: #107c10 (secondary accent)
- **Windows Orange**: #ff8c00 (tertiary accent)
- **Cool Grey**: #f3f3f3 (base background)

## Technologies

- React 18
- Vite
- Tailwind CSS
- LocalStorage API


