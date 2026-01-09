# Setup Commands for Planning Room

## Step 1: Create Vite + React Project

```bash
npm create vite@latest planning-room -- --template react
```

## Step 2: Navigate to Project Directory

```bash
cd planning-room
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Install Tailwind CSS and Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Step 5: Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

## Step 6: Run Development Server

```bash
npm run dev
```

---

## Required Configuration Files

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'windows-blue': '#0078d4',
        'windows-blue-hover': '#106ebe',
        'windows-green': '#107c10',
        'windows-orange': '#ff8c00',
        'cool-grey': '#f3f3f3',
        'cool-grey-dark': '#e1e1e1',
        'windows-border': '#c0c0c0',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cool-grey font-sans antialiased;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/70 backdrop-blur-md border border-white/50 shadow-lg;
  }
  
  .window-border {
    @apply border-2 border-windows-border;
  }
  
  .window-shadow {
    box-shadow: 
      inset -1px -1px 0px #000000,
      inset 1px 1px 0px #ffffff,
      2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .button-windows {
    @apply px-3 py-1 border-2 border-windows-border bg-cool-grey-dark 
           hover:bg-cool-grey active:border-t-cool-grey active:border-b-windows-border
           active:border-l-cool-grey active:border-r-windows-border
           transition-all duration-75;
    box-shadow: 
      inset -1px -1px 0px #000000,
      inset 1px 1px 0px #ffffff;
  }
  
  .button-windows:active {
    box-shadow: 
      inset 1px 1px 0px #000000,
      inset -1px -1px 0px #ffffff;
  }
}
```

---

## All Commands in One Block (Copy & Paste)

```bash
npm create vite@latest planning-room -- --template react
cd planning-room
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

Then replace the contents of `tailwind.config.js` and `src/index.css` with the configurations above.


