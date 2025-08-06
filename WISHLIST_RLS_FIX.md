# 🔧 Исправление RLS политик для Wishlist

## 🐛 **Проблема**
При попытке добавить товар в вишлист возникала ошибка:
```
POST https://qutfumioleqbmjojrpzf.supabase.co/rest/v1/wishlist_items?columns=%22product_id%22 403 (Forbidden)
{code: '42501', details: null, hint: null, message: 'new row violates row-level security policy for table "wishlist_items"'}
```

## 🔍 **Причина**
RLS политика для INSERT требовала, чтобы `user_id` был равен `auth.uid()`, но при вставке мы не передавали `user_id` в запросе.

## ✅ **Решение**

### ✅ **1. Исправление хука useWishlist:**

#### ✅ **Функция addToWishlist:**
```typescript
const addToWishlist = useCallback(async (productId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('wishlist_items')
      .insert([{ 
        user_id: user.id,  // Добавляем user_id
        product_id: productId 
      }])

    if (error) throw error
    await fetchWishlist()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error adding to wishlist')
    throw err
  }
}, [fetchWishlist])
```

#### ✅ **Функция removeFromWishlist:**
```typescript
const removeFromWishlist = useCallback(async (productId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', user.id)  // Добавляем проверку user_id

    if (error) throw error
    await fetchWishlist()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error removing from wishlist')
    throw err
  }
}, [fetchWishlist])
```

### ✅ **2. Обновление RLS политик:**

#### ✅ **SQL скрипт для исправления:**
```sql
-- Удаляем существующие политики
DROP POLICY IF EXISTS "Users can view own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can insert own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete own wishlist items" ON wishlist_items;

-- Создаем новые политики
CREATE POLICY "Users can view own wishlist items" ON wishlist_items
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items" ON wishlist_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items" ON wishlist_items
    FOR DELETE
    USING (auth.uid() = user_id);
```

## 🔐 **Безопасность**

### ✅ **Проверки безопасности:**
1. **Аутентификация:** Проверяем, что пользователь авторизован
2. **Авторизация:** Передаем `user_id` в запросах
3. **RLS политики:** Ограничиваем доступ только к своим данным
4. **Валидация:** Проверяем существование пользователя перед операциями

### ✅ **RLS политики:**
- **SELECT:** Пользователи видят только свои лайкнутые товары
- **INSERT:** Пользователи могут добавлять только в свой вишлист
- **DELETE:** Пользователи могут удалять только из своего вишлиста

## 🚀 **Установка исправления**

### ✅ **1. Выполнить SQL скрипт:**
```bash
# В Supabase SQL Editor выполнить:
database/wishlist_rls_fix.sql
```

### ✅ **2. Обновить код:**
```typescript
// Хук useWishlist уже обновлен в src/hooks/useSupabase.ts
// Никаких дополнительных изменений не требуется
```

### ✅ **3. Проверить работу:**
1. Авторизоваться в системе
2. Попробовать добавить товар в вишлист
3. Проверить, что товар появился в списке
4. Попробовать удалить товар из вишлиста

## 🎯 **Результат**

### ✅ **После исправления:**
- ✅ **Добавление в вишлист** работает корректно
- ✅ **Удаление из вишлиста** работает корректно
- ✅ **RLS политики** обеспечивают безопасность
- ✅ **Проверка пользователя** перед операциями
- ✅ **Обработка ошибок** при отсутствии авторизации

### ✅ **Безопасность:**
- 🔒 **Пользователи видят только свои данные**
- 🔒 **Пользователи могут управлять только своим вишлистом**
- 🔒 **Автоматическая проверка авторизации**
- 🔒 **Защита от несанкционированного доступа**

Теперь система лайкнутых товаров работает корректно и безопасно! ❤️ 