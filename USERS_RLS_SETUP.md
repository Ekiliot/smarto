# 🔒 Настройка RLS для таблицы users

## 🎯 Цель

Ограничить доступ к таблице `users` только для администраторов, используя Row Level Security (RLS) в Supabase.

## 📋 Политики безопасности

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

#### 🗑️ **Удаление пользователей:**
```sql
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE
    USING (
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
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND (
            -- Users can only update these fields on their own profile
            (OLD.name IS DISTINCT FROM NEW.name) OR
            (OLD.email IS DISTINCT FROM NEW.email) OR
            (OLD.marketing_consent IS DISTINCT FROM NEW.marketing_consent)
        )
        -- Prevent users from changing their role
        AND NEW.role = OLD.role
    );
```

## 🔧 **Вспомогательные функции**

### ✅ **Функция проверки администратора:**
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

### ✅ **Функция получения роли пользователя:**
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
3. Выполните скрипт `database/users_rls_policies.sql`

### 📝 **Шаг 2: Создание первого администратора**
1. В **SQL Editor** выполните скрипт `database/create_admin_user.sql`
2. Замените `admin@smarto.md` на ваш email администратора
3. Проверьте, что администратор создан

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

### ❌ **Тест для обычного пользователя:**
```sql
-- Должно вернуть только собственный профиль
SELECT * FROM users;
```

## 🛡️ **Безопасность**

### ✅ **Что защищено:**
- **Доступ к данным:** Только администраторы могут видеть всех пользователей
- **Создание пользователей:** Только администраторы могут создавать новых пользователей
- **Обновление профилей:** Пользователи могут обновлять только свои данные
- **Изменение ролей:** Пользователи не могут изменить свою роль
- **Удаление пользователей:** Только администраторы могут удалять пользователей

### ✅ **Что разрешено:**
- **Просмотр профиля:** Пользователи могут видеть свой профиль
- **Обновление данных:** Пользователи могут обновлять имя, email, marketing_consent
- **Административные функции:** Администраторы имеют полный доступ

## 🔧 **Обновленные хуки**

### ✅ **useUsers Hook:**
```typescript
const { users, loading, error, isAdmin } = useUsers()
```
- **Проверяет права администратора** перед загрузкой данных
- **Возвращает ошибку** если пользователь не администратор
- **Безопасный доступ** к данным пользователей

### ✅ **useUserRole Hook:**
```typescript
const { role, isAdmin, loading, error } = useUserRole()
```
- **Определяет роль** текущего пользователя
- **Проверяет права администратора**
- **Кэширует результат** для производительности

## 🎯 **Результат**

### ✅ **После настройки:**
- 🔒 **Безопасный доступ** к данным пользователей
- 👑 **Административные привилегии** только для админов
- 👤 **Ограниченный доступ** для обычных пользователей
- 🛡️ **Защита от несанкционированного доступа**
- ⚡ **Высокая производительность** благодаря RLS

### ✅ **Использование в приложении:**
```typescript
// Проверка прав администратора
const { isAdmin } = useUserRole()

if (isAdmin) {
  // Показать административные функции
  const { users } = useUsers()
} else {
  // Показать обычный интерфейс
}
```

## 🎯 **Готово!**

Теперь таблица `users` защищена RLS политиками:
- 🔒 **Только администраторы** могут управлять пользователями
- 👤 **Обычные пользователи** могут редактировать только свой профиль
- 🛡️ **Безопасность на уровне базы данных**
- ⚡ **Автоматическая проверка прав** при каждом запросе 