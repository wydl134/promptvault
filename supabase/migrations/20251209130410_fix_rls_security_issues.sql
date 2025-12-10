/*
  # Fix Security Issues

  This migration addresses multiple security and performance concerns:

  ## 1. RLS Performance Optimization
  - Replace all `auth.uid()` calls with `(select auth.uid())` in RLS policies
  - This prevents re-evaluation for each row, improving query performance at scale
  
  ## 2. Policy Consolidation
  - Combine multiple permissive SELECT policies on prompts table into a single policy
  - This prevents confusion and ensures consistent behavior
  
  ## 3. Function Security Hardening
  - Add immutable search_path to all functions
  - Prevents potential security vulnerabilities from search path manipulation
  
  ## 4. Remove Unused Indexes
  - Drop indexes that are not being utilized by queries
  - Reduces storage overhead and improves write performance
  
  ## Changes Made
  
  ### Prompts Table
  - Replaced 2 SELECT policies with 1 combined policy
  - Updated INSERT, UPDATE, DELETE policies with optimized auth checks
  
  ### User Likes Table
  - Updated INSERT and DELETE policies with optimized auth checks
  
  ### User Favorites Table
  - Updated SELECT, INSERT, DELETE policies with optimized auth checks
  
  ### Functions
  - Added `SET search_path = ''` to all trigger functions for security
  
  ### Indexes
  - Removed idx_prompts_is_public (unused)
  - Removed idx_prompts_tags (unused GIN index)
  - Removed idx_user_favorites_prompt_id (unused)
*/

-- Drop old RLS policies for prompts
DROP POLICY IF EXISTS "Anyone can view public prompts" ON prompts;
DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Authenticated users can create prompts" ON prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts;

-- Create optimized RLS policies for prompts
-- Combine the two SELECT policies into one for better performance
CREATE POLICY "Users can view public prompts or their own prompts"
  ON prompts FOR SELECT
  USING (
    is_public = true 
    OR (select auth.uid()) = user_id
  );

CREATE POLICY "Authenticated users can create their own prompts"
  ON prompts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop and recreate user_likes policies with optimized auth checks
DROP POLICY IF EXISTS "Users can create their own likes" ON user_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON user_likes;

CREATE POLICY "Users can create their own likes"
  ON user_likes FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own likes"
  ON user_likes FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop and recreate user_favorites policies with optimized auth checks
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can create their own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;

CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Recreate functions with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE prompts
  SET likes_count = likes_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE prompts
  SET likes_count = likes_count - 1
  WHERE id = OLD.prompt_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_favorites_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE prompts
  SET favorites_count = favorites_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_favorites_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE prompts
  SET favorites_count = favorites_count - 1
  WHERE id = OLD.prompt_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_prompts_is_public;
DROP INDEX IF EXISTS idx_prompts_tags;
DROP INDEX IF EXISTS idx_user_favorites_prompt_id;
