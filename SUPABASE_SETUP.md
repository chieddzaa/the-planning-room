# Supabase Setup Guide

Follow these steps to set up Supabase for cross-device sync in The Planning Room.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key (Settings > API)

## 2. Set Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Create Database Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create planner_entries table
CREATE TABLE IF NOT EXISTS planner_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  page TEXT NOT NULL, -- 'yearly', 'monthly', 'weekly', 'daily'
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, page)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_planner_entries_user_date ON planner_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_planner_entries_user_page ON planner_entries(user_id, page);

-- Enable Row Level Security
ALTER TABLE planner_entries ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only access their own data
CREATE POLICY "Users can view their own planner entries"
  ON planner_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planner entries"
  ON planner_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planner entries"
  ON planner_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planner entries"
  ON planner_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_planner_entries_updated_at
  BEFORE UPDATE ON planner_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 4. Configure Email (for Magic Links)

1. Go to Authentication > Settings in Supabase
2. Configure email templates
3. For development, you can use the default email service
4. For production, configure a custom SMTP server (recommended)

## 5. Build and Deploy

The app will automatically:
- Use Supabase sync when authenticated
- Fall back to localStorage in guest mode
- Show sync status in the UI

## Notes

- Without Supabase configured, the app runs in offline/guest mode (localStorage only)
- Guest data can be migrated to Supabase after sign-in
- All data is encrypted in transit (HTTPS required)
- Row Level Security ensures users only see their own data


