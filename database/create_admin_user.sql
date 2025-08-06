-- Create first admin user
-- Run this script after setting up RLS policies

-- Insert admin user (replace with your actual admin email)
INSERT INTO users (id, email, name, role, is_active, marketing_consent)
VALUES (
    uuid_generate_v4(),
    'admin@smarto.md',  -- Replace with your admin email
    'Administrator',
    'admin',
    true,
    false
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- Verify admin user was created
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    created_at
FROM users 
WHERE role = 'admin'
ORDER BY created_at;

-- Grant admin role to existing user (if needed)
-- Replace 'user@example.com' with the actual email
-- UPDATE users 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'user@example.com'; 