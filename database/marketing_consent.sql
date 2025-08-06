-- Добавление колонки для согласия на маркетинговые цели
-- Файл: database/marketing_consent.sql

-- Добавляем новую колонку marketing_consent в таблицу users
ALTER TABLE users 
ADD COLUMN marketing_consent BOOLEAN DEFAULT false;

-- Добавляем комментарий к колонке для документации
COMMENT ON COLUMN users.marketing_consent IS 'Согласие пользователя на использование данных в маркетинговых целях';

-- Создаем индекс для быстрого поиска пользователей с согласием
CREATE INDEX idx_users_marketing_consent ON users(marketing_consent);

-- Обновляем существующих пользователей (по умолчанию false)
UPDATE users 
SET marketing_consent = false 
WHERE marketing_consent IS NULL;

-- Добавляем ограничение NOT NULL после установки значений по умолчанию
ALTER TABLE users 
ALTER COLUMN marketing_consent SET NOT NULL;

-- Проверяем что колонка добавлена корректно
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'marketing_consent'; 