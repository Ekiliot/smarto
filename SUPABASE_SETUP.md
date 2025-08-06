# Supabase Setup для Magic Link

## Настройка Authentication в Supabase Dashboard

### 1. URL Configuration

В Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-domain.vercel.app
```

**Redirect URLs:**
```
https://your-domain.vercel.app/auth/callback
https://your-domain.vercel.app/account
http://localhost:3000/auth/callback
http://localhost:3000/account
```

### 2. Email Templates

В Supabase Dashboard → Authentication → Email Templates:

**Magic Link Template:**
- Используйте файл `email-templates/magic-link.html`
- Замените `{{ .ConfirmationURL }}` на `{{ .ConfirmationURL }}`

### 3. Provider Settings

В Supabase Dashboard → Authentication → Providers:

**Email:**
- ✅ Enable Email Signup
- ✅ Enable Email Confirmations
- ✅ Enable Secure Email Change
- ✅ Enable Double Confirm Changes

### 4. Mobile-Specific Settings

Для мобильных устройств важно:

1. **Cookies должны быть доступны из JavaScript**
2. **SameSite должен быть 'lax'**
3. **Secure cookies только в production**

### 5. Environment Variables

Убедитесь, что в Vercel установлены:

```
NEXT_PUBLIC_SUPABASE_URL=https://qutfumioleqbmjojrpzf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGZ1bWlvbGVxYm1qb2pycHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTEyMTEsImV4cCI6MjA2OTY2NzIxMX0.P8bv9Q4FxJzzPEQRLgRh9o9tf6IAdVRSFMxY6ELI19M
```

### 6. Troubleshooting

#### Проблема: Magic Link не работает на мобильных устройствах

**Возможные причины:**
1. Неправильные URL в Supabase Dashboard
2. Проблемы с cookies на мобильных устройствах
3. Блокировка popup/redirect в мобильных браузерах

**Решение:**
1. Проверьте URL в Supabase Dashboard
2. Убедитесь, что cookies настроены правильно
3. Проверьте консоль браузера на ошибки

#### Проблема: Session не сохраняется

**Решение:**
1. Проверьте localStorage в браузере
2. Убедитесь, что `storageKey` настроен правильно
3. Проверьте middleware.ts

### 7. Debug Page

Используйте `/debug-auth` для отладки:
- Проверка статуса аутентификации
- Информация о сессии
- Тест Magic Link
- Информация о браузере и устройстве

### 8. Mobile Testing

Для тестирования на мобильных устройствах:

1. **Откройте DevTools в браузере**
2. **Включите Device Toolbar**
3. **Выберите мобильное устройство**
4. **Проверьте консоль на ошибки**
5. **Проверьте Network tab**

### 9. Common Issues

1. **"supabaseUrl is required"** - Проверьте environment variables
2. **"Invalid redirect URL"** - Проверьте URL в Supabase Dashboard
3. **"Session expired"** - Проверьте настройки cookies
4. **"Network error"** - Проверьте интернет соединение 