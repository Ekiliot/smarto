# Деплой Smarto в Vercel

## Подготовка к деплою

### 1. Переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Medusa Configuration (если используется)
MEDUSA_BACKEND_URL=http://localhost:9000

# Vercel Configuration
VERCEL_URL=your_vercel_url
```

### 2. Настройка Supabase

1. Перейдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в Settings > API
4. Скопируйте:
   - Project URL
   - anon/public key

### 3. Настройка Vercel

1. Перейдите на [Vercel](https://vercel.com)
2. Войдите в аккаунт или создайте новый
3. Нажмите "New Project"
4. Подключите ваш GitHub репозиторий

### 4. Настройка переменных окружения в Vercel

В настройках проекта Vercel добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Настройка доменов в Supabase

В Supabase Dashboard перейдите в Authentication > URL Configuration и добавьте:

- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs: 
  - `https://your-vercel-domain.vercel.app/auth/callback`
  - `https://your-vercel-domain.vercel.app/account`

### 6. Настройка CORS в Supabase

В Supabase Dashboard перейдите в Settings > API и добавьте в CORS:

```
https://your-vercel-domain.vercel.app
```

### 7. Деплой

1. Нажмите "Deploy" в Vercel
2. Дождитесь завершения сборки
3. Проверьте работу сайта

## Возможные проблемы

### 1. Ошибки сборки

Если возникают ошибки TypeScript, исправьте их перед деплоем:

```bash
npm run build
```

### 2. Проблемы с изображениями

Убедитесь, что в `next.config.js` настроены правильные домены:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-image-domain.com',
    },
  ],
},
```

### 3. Проблемы с аутентификацией

Проверьте:
- Правильность URL в Supabase
- Настройки CORS
- Переменные окружения в Vercel

## Проверка после деплоя

1. Проверьте главную страницу
2. Протестируйте регистрацию/вход
3. Проверьте работу корзины
4. Протестируйте на мобильных устройствах
5. Проверьте загрузку изображений

## Обновления

Для обновления сайта просто запушьте изменения в GitHub - Vercel автоматически пересоберет проект. 