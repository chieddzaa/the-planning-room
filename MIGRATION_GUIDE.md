# Migration Guide: Adding Supabase Sync to Pages

To enable cross-device sync for a page, replace `useLocalStorageState` with `useSyncedState`.

## Before (localStorage only)

```jsx
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const [yearTheme, setYearTheme] = useLocalStorageState(
  buildKey(username, 'yearly.theme'),
  INITIAL_STATE.yearTheme,
  onSavingChange
);
```

## After (localStorage + Supabase sync)

```jsx
import { useSyncedState } from '../hooks/useSyncedState';

const [yearTheme, setYearTheme] = useSyncedState(
  buildKey(username, 'yearly.theme'),
  INITIAL_STATE.yearTheme,
  onSavingChange
);
```

## How it works

- **Not authenticated**: Works exactly like `useLocalStorageState` (localStorage only)
- **Authenticated**: 
  - Loads from Supabase on mount
  - Saves to both Supabase and localStorage
  - Syncs across devices automatically

## Migration Steps

1. Import `useSyncedState` instead of `useLocalStorageState`
2. Replace all `useLocalStorageState` calls with `useSyncedState`
3. No other changes needed - it's a drop-in replacement!

## Example: Migrating Yearly Page

```jsx
// Before
import { useLocalStorageState } from '../hooks/useLocalStorageState';

// After
import { useSyncedState } from '../hooks/useSyncedState';

// Then replace all instances:
const [yearTheme, setYearTheme] = useSyncedState(/* same params */);
const [yearScripture, setYearScripture] = useSyncedState(/* same params */);
// etc.
```

Pages can be migrated incrementally - you don't need to migrate all at once!

