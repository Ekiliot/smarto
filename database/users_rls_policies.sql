-- Remove RLS from users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Drop helper functions
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS get_user_role();

-- Grant all permissions back to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;

-- Comment: RLS has been disabled - all authenticated users have full access to users table 