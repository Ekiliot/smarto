-- Исправление проблем с Google OAuth
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- 1. Отключаем RLS для всех таблиц (временно для тестирования)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 2. Предоставляем полные права
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON cart_items TO authenticated;
GRANT ALL ON cart_items TO anon;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON orders TO anon;
GRANT ALL ON products TO authenticated;
GRANT ALL ON products TO anon;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON categories TO anon;

-- 3. Проверяем, что RLS отключен
SELECT 
    schemaname,
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'cart_items', 'orders', 'products', 'categories')
AND schemaname = 'public';

-- 4. Проверяем права
SELECT 
    grantee, 
    table_name,
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('users', 'cart_items', 'orders', 'products', 'categories')
AND table_schema = 'public'
ORDER BY table_name, grantee; 