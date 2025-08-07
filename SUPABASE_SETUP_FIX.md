# 🔧 ИСПРАВЛЕНИЕ ПРОБЛЕМ С SUPABASE

## 🚨 ПРОБЛЕМЫ, КОТОРЫЕ МЫ ИСПРАВЛЯЕМ:
1. **Не загружаются данные из БД** - проблемы с RLS политиками
2. **Не работает Google OAuth на телефоне** - неправильная конфигурация
3. **Не работает Magic Link** - проблемы с редиректами

---

## 📋 ПОШАГОВОЕ ИСПРАВЛЕНИЕ

### 1. НАСТРОЙКА SUPABASE DASHBOARD

#### 1.1. Перейдите в Supabase Dashboard
- Откройте https://supabase.com/dashboard
- Выберите ваш проект

#### 1.2. Настройте Authentication
1. **Settings → Authentication → URL Configuration**
   - Site URL: `http://localhost:3000` (для разработки)
   - Redirect URLs: 
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/account
     https://your-domain.com/auth/callback
     https://your-domain.com/account
     ```

2. **Settings → Authentication → Providers**
   - **Google**: Включите и настройте OAuth
   - **Email**: Включите "Enable email confirmations"
   - **Magic Link**: Включите "Enable magic links"

#### 1.3. Настройте Google OAuth
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials
5. Добавьте разрешенные редиректы:
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
6. Скопируйте Client ID и Client Secret в Supabase

### 2. ИСПОЛНЕНИЕ SQL СКРИПТОВ

#### 2.1. Выполните исправленные RLS политики
1. Перейдите в **SQL Editor** в Supabase Dashboard
2. Скопируйте содержимое файла `database/fixed_rls_policies.sql`
3. Выполните скрипт

#### 2.2. Проверьте права доступа
```sql
-- Проверьте, что все таблицы доступны
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Проверьте RLS статус
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 3. НАСТРОЙКА ОКРУЖЕНИЯ

#### 3.1. Проверьте переменные окружения
Создайте файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Для продакшена
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 3.2. Получите правильные ключи
1. В Supabase Dashboard → Settings → API
2. Скопируйте:
   - Project URL
   - anon/public key

### 4. ТЕСТИРОВАНИЕ

#### 4.1. Тест подключения к БД
```bash
npm run dev
```
Откройте http://localhost:3000/test-connection

#### 4.2. Тест аутентификации
1. Откройте http://localhost:3000/login
2. Попробуйте войти через Google
3. Попробуйте Magic Link

#### 4.3. Тест на мобильном устройстве
1. Запустите `npm run dev:next`
2. Откройте на телефоне: `http://your-ip:3000`
3. Попробуйте аутентификацию

---

## 🔍 ДИАГНОСТИКА ПРОБЛЕМ

### Проблема: "Cannot read properties of undefined"
**Решение:** Проверьте переменные окружения

### Проблема: "Row Level Security policy violation"
**Решение:** Выполните `database/fixed_rls_policies.sql`

### Проблема: "Invalid redirect URI"
**Решение:** Добавьте правильные redirect URLs в Supabase

### Проблема: "Google OAuth not working on mobile"
**Решение:** 
1. Проверьте настройки Google Cloud Console
2. Добавьте мобильные редиректы
3. Используйте `npm run dev:next` для тестирования

---

## 📱 ОСОБЕННОСТИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ

### 1. Настройка для локальной сети
```bash
# Запуск для доступа из локальной сети
npm run dev:next
```

### 2. Настройка Google OAuth для мобильных
В Google Cloud Console добавьте:
```
http://your-ip:3000/auth/callback
https://your-project.supabase.co/auth/v1/callback
```

### 3. Настройка cookies для мобильных
В `middleware.ts` уже настроены правильные заголовки.

---

## ✅ ПРОВЕРКА РАБОТЫ

### 1. Проверьте подключение к БД
```javascript
// В браузере консоли
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(1)
console.log('Test query:', { data, error })
```

### 2. Проверьте аутентификацию
```javascript
// В браузере консоли
const { data: { session }, error } = await supabase.auth.getSession()
console.log('Session:', { session, error })
```

### 3. Проверьте создание пользователя
После входа проверьте таблицу `users` в Supabase Dashboard.

---

## 🚀 ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ

### 1. Добавьте мониторинг ошибок
```javascript
// В SupabaseAuthProvider.tsx
if (error) {
  logger.error('Auth error:', error)
  // Отправьте в сервис мониторинга
}
```

### 2. Добавьте fallback для мобильных
```javascript
// Если Google OAuth не работает, покажите email форму
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
```

### 3. Кэширование данных
Используйте созданный хук `useOptimizedQuery` для кэширования.

---

## 📞 ПОДДЕРЖКА

Если проблемы остаются:
1. Проверьте логи в браузере (F12 → Console)
2. Проверьте логи в Supabase Dashboard → Logs
3. Проверьте настройки в Google Cloud Console
4. Убедитесь, что все SQL скрипты выполнены

**Важно:** После каждого изменения в Supabase Dashboard может потребоваться несколько минут для применения изменений. 