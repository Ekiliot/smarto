-- Проверка настроек Google OAuth в Supabase
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- 1. Проверяем, включен ли Google provider
SELECT 
    provider,
    enabled,
    client_id,
    client_secret IS NOT NULL as has_secret
FROM auth.providers 
WHERE provider = 'google';

-- 2. Проверяем настройки URL
SELECT 
    site_url,
    redirect_urls
FROM auth.config;

-- 3. Проверяем последние попытки авторизации
SELECT 
    id,
    user_id,
    provider,
    created_at,
    updated_at
FROM auth.identities 
WHERE provider = 'google'
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Проверяем пользователей
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5; 