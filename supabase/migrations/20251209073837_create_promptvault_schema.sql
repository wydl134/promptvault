/*
  # PromptVault Database Schema
  
  Creates the complete database structure for PromptVault - an AI prompt library application.
  
  ## New Tables
  
  1. **categories**
     - `id` (uuid, primary key) - Unique identifier for each category
     - `name` (text, unique) - Category name (e.g., "Programming", "Writing")
     - `slug` (text, unique) - URL-friendly version of the name
     - `description` (text) - Brief description of the category
     - `icon` (text) - Lucide icon name for the category
     - `color` (text) - Hex color code for category theming
     - `created_at` (timestamptz) - Creation timestamp
  
  2. **prompts**
     - `id` (uuid, primary key) - Unique identifier for each prompt
     - `user_id` (uuid, foreign key) - References auth.users (creator)
     - `title` (text) - Prompt title
     - `content` (text) - Full prompt content (supports markdown)
     - `category_id` (uuid, foreign key) - References categories
     - `tags` (text[]) - Array of tags for filtering
     - `is_public` (boolean) - Whether prompt is publicly visible
     - `likes_count` (integer) - Cached count of likes
     - `favorites_count` (integer) - Cached count of favorites
     - `views_count` (integer) - Number of times prompt was viewed
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp
  
  3. **user_likes**
     - `id` (uuid, primary key) - Unique identifier
     - `user_id` (uuid, foreign key) - References auth.users
     - `prompt_id` (uuid, foreign key) - References prompts
     - `created_at` (timestamptz) - When the like was created
     - Unique constraint on (user_id, prompt_id)
  
  4. **user_favorites**
     - `id` (uuid, primary key) - Unique identifier
     - `user_id` (uuid, foreign key) - References auth.users
     - `prompt_id` (uuid, foreign key) - References prompts
     - `created_at` (timestamptz) - When the favorite was created
     - Unique constraint on (user_id, prompt_id)
  
  ## Security
  
  - Enable Row Level Security (RLS) on all tables
  - Public read access for public prompts
  - Authenticated users can create prompts
  - Users can only modify/delete their own prompts
  - Users can like/favorite any public prompt
  - Users can view their own private prompts
  
  ## Indexes
  
  - Index on prompts.category_id for fast category filtering
  - Index on prompts.user_id for user's prompts lookup
  - Index on prompts.is_public for public prompts queries
  - Index on prompts.created_at for sorting
  - GIN index on prompts.tags for array searches
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Folder',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON prompts(is_public);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_likes_prompt_id ON user_likes(prompt_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_prompt_id ON user_favorites(prompt_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for prompts
CREATE POLICY "Anyone can view public prompts"
  ON prompts FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create prompts"
  ON prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_likes
CREATE POLICY "Users can view all likes"
  ON user_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON user_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON user_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts
  SET likes_count = likes_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts
  SET likes_count = likes_count - 1
  WHERE id = OLD.prompt_id;
  RETURN OLD;
END;
$$ language 'plpgsql';

-- Triggers for likes count
CREATE TRIGGER trigger_increment_likes
  AFTER INSERT ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER trigger_decrement_likes
  AFTER DELETE ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_count();

-- Function to increment favorites count
CREATE OR REPLACE FUNCTION increment_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts
  SET favorites_count = favorites_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to decrement favorites count
CREATE OR REPLACE FUNCTION decrement_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts
  SET favorites_count = favorites_count - 1
  WHERE id = OLD.prompt_id;
  RETURN OLD;
END;
$$ language 'plpgsql';

-- Triggers for favorites count
CREATE TRIGGER trigger_increment_favorites
  AFTER INSERT ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION increment_favorites_count();

CREATE TRIGGER trigger_decrement_favorites
  AFTER DELETE ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION decrement_favorites_count();