-- Полное исправление типов ID для совместимости с Firebase UID
-- Изменяем типы с UUID на TEXT во всех связанных таблицах

-- 1. Проверяем текущую структуру users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Временно отключаем RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Удаляем все RLS политики для users (они будут пересозданы)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins have full access" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- 4. Удаляем внешние ключи (временно)
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE cart_bundle_items DROP CONSTRAINT IF EXISTS cart_bundle_items_user_id_fkey;
ALTER TABLE coupon_usage DROP CONSTRAINT IF EXISTS coupon_usage_user_id_fkey;

-- 5. Изменяем тип колонки ID в таблице users с UUID на TEXT
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;

-- 6. Изменяем тип колонки user_id в связанных таблицах
-- cart_items
ALTER TABLE cart_items ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- orders
ALTER TABLE orders ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- cart_bundle_items
ALTER TABLE cart_bundle_items ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- coupon_usage
ALTER TABLE coupon_usage ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 7. Восстанавливаем внешние ключи с новым типом
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE cart_bundle_items 
ADD CONSTRAINT cart_bundle_items_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE coupon_usage 
ADD CONSTRAINT coupon_usage_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 8. Создаем новые RLS политики для TEXT ID
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Admins have full access" ON users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid()::text AND role = 'admin'
  )
);

CREATE POLICY "Allow user creation" ON users
FOR INSERT WITH CHECK (auth.uid()::text = id);

-- 9. Включаем RLS обратно
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 10. Предоставляем права
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 11. Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_bundle_items_user_id ON cart_bundle_items(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);

-- 12. Проверяем финальную структуру users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 13. Проверяем структуру связанных таблиц
SELECT 
    table_name,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('cart_items', 'orders', 'cart_bundle_items', 'coupon_usage')
    AND column_name = 'user_id'
    AND table_schema = 'public'
ORDER BY table_name;

-- 14. Проверяем внешние ключи
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('cart_items', 'orders', 'cart_bundle_items', 'coupon_usage')
    AND ccu.table_name = 'users'; 