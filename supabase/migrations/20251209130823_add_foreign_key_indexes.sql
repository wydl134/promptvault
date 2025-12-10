/*
  # Add Foreign Key Indexes

  This migration addresses the unindexed foreign key issue:

  ## 1. Foreign Key Index Optimization
  - Add index on user_favorites.prompt_id to support the foreign key constraint
  - Improves query performance when joining or filtering by prompt_id
  - Prevents table scans when enforcing referential integrity
  
  ## Changes Made
  
  ### User Favorites Table
  - Added idx_user_favorites_prompt_id index on prompt_id column
  - Supports foreign key constraint user_favorites_prompt_id_fkey
  - Improves JOIN performance and DELETE CASCADE operations
  
  ## Note
  
  The previous migration removed this index as "unused", but it's actually needed
  for optimal foreign key constraint performance. Foreign key columns should
  always be indexed to prevent performance issues during:
  - JOIN operations
  - CASCADE deletes
  - Referential integrity checks
*/

-- Add index for foreign key on user_favorites.prompt_id
CREATE INDEX IF NOT EXISTS idx_user_favorites_prompt_id ON user_favorites(prompt_id);
