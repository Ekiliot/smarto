# Настройка переменных окружения

## 🔧 **Создайте файл `.env.local` в корне проекта:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMb8VkF_iElreAJZRNakkFMZSZGz2JjcU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smarto-81f1f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smarto-81f1f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smarto-81f1f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=121702492513
NEXT_PUBLIC_FIREBASE_APP_ID=1:121702492513:web:27c09d8bc102312ee77d20
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S0JJ93RRXL

# Supabase Configuration (уже должны быть настроены)
NEXT_PUBLIC_SUPABASE_URL=https://qutfumioleqbmjojrpzf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGZ1bWlvbGVxYm1qb2pycHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTEyMTEsImV4cCI6MjA2OTY2NzIxMX0.P8bv9Q4FxJzzPEQRLgRh9o9tf6IAdVRSFMxY6ELI19M
```

## 🚀 **Настройка в Vercel:**

1. **Перейдите в Vercel Dashboard → ваш проект → Settings → Environment Variables**
2. **Добавьте все переменные из `.env.local`**

### **Firebase переменные для Vercel:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMb8VkF_iElreAJZRNakkFMZSZGz2JjcU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smarto-81f1f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smarto-81f1f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smarto-81f1f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=121702492513
NEXT_PUBLIC_FIREBASE_APP_ID=1:121702492513:web:27c09d8bc102312ee77d20
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S0JJ93RRXL
```

## 🔒 **Безопасность:**

### **Почему это безопаснее:**
1. **Переменные окружения** не попадают в Git
2. **Разные значения** для разных сред (dev/prod)
3. **Легче управлять** секретами
4. **Соответствует best practices**

### **Важно:**
- Файл `.env.local` уже в `.gitignore`
- Переменные с `NEXT_PUBLIC_` доступны в браузере (это нормально для Firebase)
- Никогда не коммитьте `.env.local` в Git

## 📋 **Чек-лист:**

- [ ] Создан файл `.env.local`
- [ ] Добавлены все Firebase переменные
- [ ] Добавлены Supabase переменные
- [ ] Настроены переменные в Vercel
- [ ] Протестирована работа локально
- [ ] Протестирована работа в production

## 🧪 **Тестирование:**

1. **Локально:** `npm run dev`
2. **Проверьте:** Консоль браузера на ошибки
3. **Протестируйте:** Google авторизацию
4. **Production:** Проверьте после деплоя на Vercel 