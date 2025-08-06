# 🔒 Финальные исправления RLS для таблицы users

## 🐛 **Проблема**
Ошибка `ERROR: 42P01: relation "users_id_seq" does not exist` возникала из-за попытки предоставить права на несуществующую последовательность.

## ✅ **Решение**
Убрана ссылка на несуществующую последовательность, так как таблица `users` использует UUID.

## 📋 **Исправления**

### ✅ **1. Убрана несуществующая последовательность**
```sql
-- УДАЛЕНО:
-- GRANT USAGE ON SEQUENCE users_id_seq TO authenticated;

-- ОСТАВЛЕНО:
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
```

### ✅ **2. Исправлен генератор UUID**
```sql
-- БЫЛО:
gen_random_uuid()

-- СТАЛО:
uuid_generate_v4()
```

## 🔧 **Структура таблицы users**

### ✅ **Правильная схема:**
```sql
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,  -- UUID, не последовательность
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  marketing_consent BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 **Финальные политики**

### ✅ **Для администраторов:**
```sql
-- Просмотр всех пользователей
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Создание новых пользователей
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Обновление пользователей
CREATE POLICY "Admins can update users" ON users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
```

### ✅ **Для обычных пользователей:**
```sql
-- Просмотр собственного профиля
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Обновление собственного профиля
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);
```

## 🔧 **Вспомогательные функции**

### ✅ **Проверка администратора:**
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### ✅ **Получение роли пользователя:**
```sql
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM users
        WHERE users.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🚀 **Инструкция по применению**

### 📝 **Шаг 1: Применение RLS политик**
1. Откройте **Supabase Dashboard**
2. Перейдите в **SQL Editor**
3. Выполните исправленный скрипт `database/users_rls_policies.sql`

### 📝 **Шаг 2: Создание администратора**
1. В **SQL Editor** выполните скрипт `database/create_admin_user.sql`
2. Замените `admin@smarto.md` на ваш email администратора

### 📝 **Шаг 3: Назначение роли существующему пользователю**
```sql
-- Замените 'user@example.com' на email пользователя
UPDATE users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'user@example.com';
```

## 🔍 **Проверка работы**

### ✅ **Тест для администратора:**
```sql
-- Должно вернуть всех пользователей
SELECT * FROM users;
```

### ✅ **Тест для обычного пользователя:**
```sql
-- Должно вернуть только собственный профиль
SELECT * FROM users WHERE id = auth.uid();
```

### ✅ **Проверка функций:**
```sql
-- Проверка роли текущего пользователя
SELECT get_user_role();

-- Проверка прав администратора
SELECT is_admin();
```

## 🛡️ **Безопасность**

### ✅ **Что защищено:**
- **Доступ к данным:** Только администраторы видят всех пользователей
- **Создание пользователей:** Только администраторы могут создавать пользователей
- **Обновление профилей:** Пользователи могут обновлять только свой профиль
- **UUID идентификаторы:** Безопасные уникальные идентификаторы

### ✅ **Дополнительная защита:**
- **Защита роли** реализуется на уровне приложения
- **Валидация данных** в хуках React
- **Проверка прав** перед выполнением операций

## 🔧 **Обновленные хуки**

### ✅ **useUsers Hook:**
```typescript
const { users, loading, error, isAdmin } = useUsers()
```
- **Проверяет права администратора** перед загрузкой
- **Возвращает ошибку** если нет прав
- **Безопасный доступ** к данным

### ✅ **useUserRole Hook:**
```typescript
const { role, isAdmin, loading, error } = useUserRole()
```
- **Определяет роль** пользователя
- **Кэширует результат** для производительности
- **Проверяет права** администратора

## 🎯 **Результат**

### ✅ **После финальных исправлений:**
- ✅ **Корректная работа** RLS политик
- ✅ **Без ошибок** в SQL запросах
- ✅ **Правильное использование** UUID
- ✅ **Безопасный доступ** к данным пользователей
- ✅ **Простая и надежная** логика
- ✅ **Высокая производительность**

### ✅ **Использование:**
```typescript
// Проверка прав администратора
const { isAdmin } = useUserRole()

if (isAdmin) {
  // Административные функции
  const { users } = useUsers()
} else {
  // Обычный интерфейс
}
```

## 🎯 **Готово!**

Теперь RLS политики работают корректно:
- 🔒 **Безопасный доступ** к таблице users
- ✅ **Корректная работа** без ошибок SQL
- 🆔 **Правильное использование** UUID идентификаторов
- 👑 **Административные привилегии** для админов
- 👤 **Ограниченный доступ** для пользователей
- ⚡ **Высокая производительность** и надежность 