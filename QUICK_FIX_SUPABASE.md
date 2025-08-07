# 🚀 БЫСТРОЕ ИСПРАВЛЕНИЕ SUPABASE

## ⚡ НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ

### 1. Выполните SQL скрипт
```sql
-- Скопируйте и выполните в Supabase Dashboard → SQL Editor
-- Содержимое файла: database/fixed_rls_policies_final.sql
-- 
-- ВАЖНО: Используйте именно этот файл - он:
-- 1. Удалит все существующие политики
-- 2. Работает только с существующими таблицами
-- 3. Не создает новые таблицы (wishlist и др.)
```

### 2. Проверьте переменные окружения
Создайте `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Настройте Supabase Dashboard
1. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

2. **Authentication → Providers**
   - Включите Google OAuth
   - Включите Magic Link

### 4. Запустите тест
```bash
npm run dev
# Откройте http://localhost:3000/test-connection
```

## 🔧 ЕСЛИ ПРОБЛЕМЫ ОСТАЮТСЯ

### Проблема: "Row Level Security policy violation"
**Решение:** Выполните `database/fixed_rls_policies.sql`

### Проблема: "Invalid redirect URI"
**Решение:** Добавьте в Supabase Dashboard:
```
http://localhost:3000/auth/callback
http://your-ip:3000/auth/callback
```

### Проблема: Google OAuth не работает на телефоне
**Решение:** 
1. Запустите `npm run dev:next`
2. Добавьте в Google Cloud Console:
```
http://your-ip:3000/auth/callback
```

## 📱 ТЕСТИРОВАНИЕ НА МОБИЛЬНОМ
```bash
npm run dev:next
# Откройте на телефоне: http://your-ip:3000
```

## ✅ ПРОВЕРКА
1. Откройте http://localhost:3000/test-connection
2. Все тесты должны быть зелеными
3. Попробуйте войти через http://localhost:3000/login

## 🆘 ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ
1. Проверьте логи в браузере (F12 → Console)
2. Проверьте логи в Supabase Dashboard → Logs
3. Убедитесь, что все SQL скрипты выполнены
4. Подождите 5-10 минут после изменений в Supabase 