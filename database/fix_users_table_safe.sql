-- Безопасное исправление таблицы users для совместимости с Firebase UID
-- Сохраняем все внешние ключи и RLS политики

-- 1. Создаем временную таблицу с правильной структурой
CREATE TABLE IF NOT EXISTS users_temp (
  id TEXT PRIMARY KEY, -- Изменяем с UUID на TEXT для Firebase UID
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Копируем данные из существующей таблицы (если она существует)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    -- Копируем данные, конвертируя UUID в TEXT
    INSERT INTO users_temp (id, email, name, role, is_active, created_at, updated_at)
    SELECT 
      id::text, 
      email, 
      name, 
      role, 
      is_active, 
      created_at, 
      updated_at
    FROM users
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 3. Удаляем старую таблицу с CASCADE (удалит все зависимости)
DROP TABLE IF EXISTS users CASCADE;

-- 4. Переименовываем временную таблицу
ALTER TABLE users_temp RENAME TO users;

-- 5. Отключаем RLS для users (временно)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 6. Предоставляем права
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 7. Создаем индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 8. Восстанавливаем внешние ключи (если таблицы существуют)
DO $$ 
BEGIN
  -- Восстанавливаем внешний ключ для cart_items
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
    ALTER TABLE cart_items 
    ADD CONSTRAINT cart_items_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Восстанавливаем внешний ключ для orders
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
    ALTER TABLE orders 
    ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Восстанавливаем внешний ключ для cart_bundle_items
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_bundle_items') THEN
    ALTER TABLE cart_bundle_items 
    ADD CONSTRAINT cart_bundle_items_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Восстанавливаем внешний ключ для coupon_usage
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'coupon_usage') THEN
    ALTER TABLE coupon_usage 
    ADD CONSTRAINT coupon_usage_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 9. Восстанавливаем RLS политики для users
DO $$ 
BEGIN
  -- Политика для чтения собственных данных
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own data') THEN
    CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id);
  END IF;

  -- Политика для обновления собственных данных
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data') THEN
    CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id);
  END IF;

  -- Политика для админов (полный доступ)
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins have full access') THEN
    CREATE POLICY "Admins have full access" ON users
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text AND role = 'admin'
      )
    );
  END IF;

  -- Политика для создания новых пользователей
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow user creation') THEN
    CREATE POLICY "Allow user creation" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);
  END IF;
END $$;

-- 10. Включаем RLS обратно
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 11. Проверяем структуру
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 12. Проверяем внешние ключи
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
    AND tc.table_name='users'; 