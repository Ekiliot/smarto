# Настройка Firebase + Supabase интеграции

## 🔧 **Пошаговая настройка:**

### **1. Настройка Firebase:**

1. **Перейдите в [Firebase Console](https://console.firebase.google.com/)**
2. **Выберите проект `smarto-81f1f`**
3. **Перейдите в Authentication → Sign-in method**
4. **Включите Google provider**
5. **Настройте OAuth consent screen в Google Cloud Console**

### **2. Настройка переменных окружения:**

Создайте файл `.env.local` в корне проекта:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMb8VkF_iElreAJZRNakkFMZSZGz2JjcU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smarto-81f1f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smarto-81f1f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smarto-81f1f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=121702492513
NEXT_PUBLIC_FIREBASE_APP_ID=1:121702492513:web:27c09d8bc102312ee77d20
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S0JJ93RRXL

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qutfumioleqbmjojrpzf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGZ1bWlvbGVxYm1qb2pycHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTEyMTEsImV4cCI6MjA2OTY2NzIxMX0.P8bv9Q4FxJzzPEQRLgRh9o9tf6IAdVRSFMxY6ELI19M
```

### **3. Настройка в Vercel:**

1. **Vercel Dashboard → ваш проект → Settings → Environment Variables**
2. **Добавьте все переменные из `.env.local`**

### **4. Настройка Supabase для Firebase:**

1. **В Supabase Dashboard → Authentication → Providers**
2. **Найдите Firebase и нажмите "Enable"**
3. **Введите Firebase Project ID:** `smarto-81f1f`
4. **Сохраните настройки**

### **5. Настройка RLS политик:**

Запустите в SQL Editor Supabase содержимое файла `database/firebase_rls_policies.sql`

## 🎯 **Как это работает:**

### **1. Авторизация через Firebase:**
1. Пользователь нажимает "Conectare cu Google (Firebase)"
2. Открывается popup с Google авторизацией
3. После успешной авторизации получаем Firebase JWT токен
4. Токен передается в Supabase для создания сессии

### **2. Синхронизация с Supabase:**
1. Firebase JWT токен используется для аутентификации в Supabase
2. Создается запись в таблице `users` (если пользователь новый)
3. Пользователь получает доступ к данным через RLS политики

### **3. Управление сессией:**
1. Firebase управляет состоянием авторизации
2. Supabase получает токен для доступа к базе данных
3. RLS политики контролируют доступ к данным

## 🔒 **Безопасность:**

### **RLS политики:**
- Пользователи могут читать только свои данные
- Публичный доступ к продуктам и категориям
- Администраторы имеют полный доступ
- Автоматическое создание пользователей при первой авторизации

### **JWT токены:**
- Firebase генерирует JWT токены
- Supabase использует эти токены для аутентификации
- Токены автоматически обновляются

### **Переменные окружения:**
- Конфигурация Firebase вынесена в `.env.local`
- Файл `.env.local` не попадает в Git
- Разные значения для разных сред (dev/prod)

## 🧪 **Тестирование:**

### **Локальное тестирование:**
1. Создайте файл `.env.local` с переменными
2. Запустите `npm run dev`
3. Перейдите на `/login`
4. Нажмите "Conectare cu Google (Firebase)"

### **Production тестирование:**
1. Настройте переменные в Vercel
2. Проверьте настройки Firebase в production
3. Протестируйте на мобильных устройствах

## 🚨 **Возможные проблемы:**

### **1. "Firebase not initialized"**
**Решение:** Проверьте, что все переменные окружения установлены.

### **2. "Invalid JWT token"**
**Решение:** Убедитесь, что Firebase Project ID правильно настроен в Supabase.

### **3. "RLS policy violation"**
**Решение:** Проверьте, что RLS политики настроены правильно.

### **4. "Popup blocked"**
**Решение:** Разрешите popup-ы для вашего домена.

## 📋 **Чек-лист:**

- [x] Настроен Google provider в Firebase
- [x] Получена Firebase конфигурация
- [ ] Создан файл `.env.local`
- [ ] Настроены переменные в Vercel
- [ ] Включен Firebase provider в Supabase
- [ ] Настроены RLS политики
- [ ] Протестирована авторизация локально
- [ ] Протестирована авторизация в production

## 🔄 **Следующие шаги:**

1. **Создайте файл `.env.local`** с переменными
2. **Настройте переменные в Vercel**
3. **Включите Firebase provider в Supabase Dashboard**
4. **Запустите SQL скрипт `database/firebase_rls_policies.sql`**
5. **Протестируйте авторизацию**
6. **Загрузите изменения на GitHub** 