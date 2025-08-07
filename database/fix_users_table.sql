-- Исправление таблицы users для совместимости с Firebase UID
-- Firebase UID имеет формат: v9HNxF5TLJNy4cFQisERZEMOK4i2 (28 символов)
-- Supabase UUID имеет формат: 550e8400-e29b-41d4-a716-446655440000 (36 символов)

-- 1. Создаем новую таблицу users с правильным типом ID
CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY, -- Изменяем с UUID на TEXT для Firebase UID
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Копируем данные из старой таблицы (если она существует)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    -- Копируем данные, конвертируя UUID в TEXT
    INSERT INTO users_new (id, email, name, role, is_active, created_at, updated_at)
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
    
    -- Удаляем старую таблицу
    DROP TABLE users;
  END IF;
END $$;

-- 3. Переименовываем новую таблицу
ALTER TABLE users_new RENAME TO users;

-- 4. Отключаем RLS для users (временно)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. Предоставляем права
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 6. Создаем индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 7. Проверяем структуру
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position; 