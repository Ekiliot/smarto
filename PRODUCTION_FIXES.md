# Исправление проблем в Production

## 🔧 **Проблемы и решения:**

### **1. 404 ошибка на `/categories`**

**Проблема:** Приложение пытается получить данные с `/categories`, но эта страница не существует.

**Решение:** ✅ Убрали ссылки на `/categories` из:
- Header (десктоп и мобильная версия)
- Footer
- Hero компонент

### **2. Shipping methods: 0**

**Проблема:** В базе данных нет методов доставки.

**Решение:** Запустите SQL скрипт в Supabase Dashboard:

1. **Перейдите в Supabase Dashboard → SQL Editor**
2. **Скопируйте содержимое `database/shipping_methods.sql`**
3. **Вставьте и нажмите "Run"**

### **3. Magic Link не работает после перехода**

**Проблема:** После перехода по Magic Link страница не загружается.

**Решение:** Проверьте настройки в Supabase Dashboard:

#### **Authentication → URL Configuration:**
```
Site URL: https://smarto-one.vercel.app
Redirect URLs: 
- https://smarto-one.vercel.app/auth/callback
- https://smarto-one.vercel.app/account
```

#### **Environment Variables в Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL=https://qutfumioleqbmjojrpzf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dGZ1bWlvbGVxYm1qb2pycHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTEyMTEsImV4cCI6MjA2OTY2NzIxMX0.P8bv9Q4FxJzzPEQRLgRh9o9tf6IAdVRSFMxY6ELI19M
```

## 🧪 **Тестирование:**

### **1. Проверьте подключение:**
Откройте `/test-connection` для диагностики всех компонентов.

### **2. Проверьте Magic Link:**
1. Перейдите на `/login`
2. Введите email
3. Нажмите "Trimite link-ul"
4. Проверьте email
5. Перейдите по ссылке

### **3. Проверьте shipping:**
1. Добавьте товар в корзину
2. Перейдите в корзину
3. Убедитесь, что методы доставки отображаются

## 📋 **Чек-лист:**

- [ ] Запущен SQL скрипт для shipping методов
- [ ] Настроены URL в Supabase Dashboard
- [ ] Установлены environment variables в Vercel
- [ ] Убраны ссылки на `/categories`
- [ ] Протестирован Magic Link
- [ ] Проверена страница `/test-connection`

## 🚨 **Если проблемы остаются:**

1. **Проверьте консоль браузера** на ошибки
2. **Проверьте Network tab** в DevTools
3. **Откройте `/test-connection`** для диагностики
4. **Проверьте логи в Vercel Dashboard** 