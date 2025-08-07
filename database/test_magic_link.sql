-- Тестирование Magic Link без Firebase
-- Отключаем RLS для users и проверяем работу

-- 1. Отключаем RLS для таблицы users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Предоставляем полные права
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 3. Проверяем, что RLS отключен
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- 4. Проверяем права
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' 
AND table_schema = 'public';

-- 5. Проверяем структуру таблицы users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position; 