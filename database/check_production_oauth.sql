-- Проверка настроек OAuth для продакшена
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- 1. Проверяем настройки Google provider
SELECT 
    provider,
    enabled,
    client_id IS NOT NULL as has_client_id,
    client_secret IS NOT NULL as has_client_secret,
    created_at,
    updated_at
FROM auth.providers 
WHERE provider = 'google';

-- 2. Проверяем конфигурацию URL
SELECT 
    site_url,
    redirect_urls,
    created_at,
    updated_at
FROM auth.config;

-- 3. Проверяем последние попытки авторизации (последние 10)
SELECT 
    id,
    user_id,
    provider,
    created_at,
    updated_at,
    last_sign_in_at
FROM auth.users 
WHERE provider = 'google' OR email LIKE '%@gmail.com'
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Проверяем все провайдеры
SELECT 
    provider,
    enabled,
    created_at
FROM auth.providers 
ORDER BY provider;

-- 5. Проверяем настройки RLS
SELECT 
    schemaname,
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'cart_items', 'orders', 'products', 'categories')
AND schemaname = 'public'
ORDER BY tablename; 