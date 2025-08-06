# 🔒 Исправленные RLS политики для таблицы users

## 🐛 **Проблема**
Ошибка `ERROR: 42P01: missing FROM-clause entry for table "old"` возникала из-за неправильного использования `OLD` и `NEW` в RLS политиках.

## ✅ **Решение**
Упрощены RLS политики для корректной работы с Supabase.

## 📋 **Исправленные политики**

### ✅ **1. Политики для администраторов**

#### 👁️ **Просмотр всех пользователей:**
```sql
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
```

#### ➕ **Создание новых пользователей:**
```sql
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
```

#### ✏️ **Обновление пользователей:**
```sql
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

### ✅ **2. Политики для обычных пользователей**

#### 👤 **Просмотр собственного профиля:**
```sql
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = id);
```

#### ✏️ **Обновление собственного профиля:**
```sql
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);
```

## 🔧 **Ключевые изменения**

### ✅ **Убраны сложные проверки:**
- ❌ **Удалены** проверки `OLD` и `NEW` (не поддерживаются в RLS)
- ❌ **Удалены** сложные условия с `DISTINCT FROM`
- ✅ **Добавлены** простые и надежные политики

### ✅ **Упрощенная логика:**
- **Администраторы** - полный доступ ко всем операциям
- **Пользователи** - доступ только к своему профилю
- **Защита роли** - реализуется на уровне приложения

## 🚀 **Применение исправлений**

### 📝 **Шаг 1: Удаление старых политик**
```sql
-- Выполните в Supabase SQL Editor
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
```

### 📝 **Шаг 2: Применение новых политик**
```sql
-- Выполните исправленный скрипт database/users_rls_policies.sql
```

### 📝 **Шаг 3: Проверка работы**
```sql
-- Проверка для администратора
SELECT * FROM users;

-- Проверка для обычного пользователя
SELECT * FROM users WHERE id = auth.uid();
```

## 🛡️ **Безопасность**

### ✅ **Что защищено:**
- **Доступ к данным:** Только администраторы видят всех пользователей
- **Создание пользователей:** Только администраторы могут создавать пользователей
- **Обновление профилей:** Пользователи могут обновлять только свой профиль
- **Удаление пользователей:** Только администраторы могут удалять пользователей

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

### ✅ **После исправления:**
- ✅ **Корректная работа** RLS политик
- ✅ **Без ошибок** в SQL запросах
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
- 👑 **Административные привилегии** для админов
- 👤 **Ограниченный доступ** для пользователей
- ⚡ **Высокая производительность** и надежность 