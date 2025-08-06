# Marketing Consent - Согласие на маркетинговые цели

## Описание

Добавлена новая колонка `marketing_consent` в таблицу `users` для отслеживания согласия пользователей на использование их данных в маркетинговых целях.

## Структура базы данных

### Таблица `users`

```sql
ALTER TABLE users 
ADD COLUMN marketing_consent BOOLEAN DEFAULT false NOT NULL;
```

**Поля:**
- `marketing_consent` (BOOLEAN) - согласие на маркетинговые цели
  - `true` - пользователь согласен
  - `false` - пользователь не согласен (по умолчанию)

## TypeScript интерфейсы

### useSupabase.ts
```typescript
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  is_active: boolean
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  marketing_consent: boolean  // ← НОВОЕ ПОЛЕ
  created_at: string
  updated_at: string
}
```

### database.ts
```typescript
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  avatar?: string
  phone?: string
  address?: string
  marketingConsent: boolean  // ← НОВОЕ ПОЛЕ
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### SupabaseAuthProvider.tsx
```typescript
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  isActive: boolean
  marketingConsent?: boolean  // ← НОВОЕ ПОЛЕ
}
```

## Применение SQL-скрипта

1. Подключитесь к базе данных Supabase
2. Выполните SQL-скрипт из файла `database/marketing_consent.sql`
3. Проверьте, что колонка добавлена корректно

## Использование в коде

### Получение пользователей с согласием
```typescript
const { data: usersWithConsent } = await supabase
  .from('users')
  .select('*')
  .eq('marketing_consent', true)
```

### Обновление согласия пользователя
```typescript
const { error } = await supabase
  .from('users')
  .update({ marketing_consent: true })
  .eq('id', userId)
```

### Проверка согласия
```typescript
if (user.marketing_consent) {
  // Пользователь согласен на маркетинговые цели
  // Можно отправлять рекламные материалы
}
```

## GDPR и правовые аспекты

- **По умолчанию** все пользователи имеют `marketing_consent = false`
- **Явное согласие** требуется для отправки маркетинговых материалов
- **Возможность отзыва** согласия в любое время
- **Логирование** изменений согласия для аудита

## Рекомендации по внедрению

1. **Форма регистрации** - добавить чекбокс для согласия
2. **Страница настроек** - возможность изменить согласие
3. **Email-рассылки** - проверять согласие перед отправкой
4. **Аналитика** - отслеживать процент согласий
5. **Документация** - обновить политику конфиденциальности

## Примеры использования

### В форме регистрации
```typescript
const [marketingConsent, setMarketingConsent] = useState(false)

// При регистрации
const { error } = await supabase
  .from('users')
  .insert([{
    id: userId,
    email: email,
    name: name,
    marketing_consent: marketingConsent,
    // ... другие поля
  }])
```

### В настройках аккаунта
```typescript
const handleMarketingConsentChange = async (consent: boolean) => {
  const { error } = await supabase
    .from('users')
    .update({ marketing_consent: consent })
    .eq('id', user.id)
  
  if (!error) {
    // Обновить локальное состояние
    setUser({ ...user, marketing_consent: consent })
  }
}
```

### В email-рассылке
```typescript
const sendMarketingEmail = async (userId: string, content: string) => {
  // Проверяем согласие
  const { data: user } = await supabase
    .from('users')
    .select('marketing_consent')
    .eq('id', userId)
    .single()
  
  if (user?.marketing_consent) {
    // Отправляем email
    await sendEmail(userId, content)
  } else {
    console.log('User has not consented to marketing emails')
  }
}
``` 