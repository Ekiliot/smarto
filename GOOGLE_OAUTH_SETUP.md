# Настройка Google OAuth 2.0 для Smarto

## 🎯 Обзор

Мы настроим Google OAuth 2.0 напрямую через Supabase, что намного проще и надежнее, чем Firebase.

## 📋 Пошаговая настройка

### **1. Настройка Google Cloud Console**

#### **1.1 Создание проекта**
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Запомните **Project ID**

#### **1.2 Включение Google+ API**
1. Перейдите в **APIs & Services → Library**
2. Найдите **Google+ API** или **Google Identity**
3. Нажмите **Enable**

#### **1.3 Создание OAuth 2.0 Credentials**
1. Перейдите в **APIs & Services → Credentials**
2. Нажмите **Create Credentials → OAuth 2.0 Client IDs**
3. Выберите **Web application**
4. Заполните форму:

**Name:** `Smarto Web App`

**Authorized JavaScript origins:**
```
https://smarto-one.vercel.app
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://qutfumioleqbmjojrpzf.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

5. Нажмите **Create**

#### **1.4 Получение Credentials**
После создания вы получите:
- **Client ID:** `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret:** `GOCSPX-abcdefghijklmnopqrstuvwxyz`

**Сохраните эти данные!**

### **2. Настройка Supabase**

#### **2.1 Включение Google Provider**
1. Перейдите в **Supabase Dashboard → Authentication → Providers**
2. Найдите **Google** в списке
3. Нажмите **Enable**

#### **2.2 Настройка Credentials**
Введите данные из Google Cloud Console:
- **Client ID:** ваш Google Client ID
- **Client Secret:** ваш Google Client Secret

#### **2.3 Настройка Redirect URLs**
Убедитесь, что в **URL Configuration** указано:
- **Site URL:** `https://smarto-one.vercel.app`
- **Redirect URLs:** 
  ```
  https://smarto-one.vercel.app/auth/callback
  http://localhost:3000/auth/callback
  ```

### **3. Тестирование**

#### **3.1 Локальное тестирование**
1. Запустите проект: `npm run dev`
2. Перейдите на `http://localhost:3000/login`
3. Нажмите **Continue with Google**
4. Должен открыться Google OAuth popup

#### **3.2 Продакшн тестирование**
1. Перейдите на `https://smarto-one.vercel.app/login`
2. Нажмите **Continue with Google**
3. Проверьте авторизацию

## 🔧 Устранение проблем

### **Ошибка: "redirect_uri_mismatch"**
- Проверьте **Authorized redirect URIs** в Google Cloud Console
- Убедитесь, что URL точно совпадает

### **Ошибка: "invalid_client"**
- Проверьте **Client ID** и **Client Secret** в Supabase
- Убедитесь, что Google+ API включен

### **Ошибка: "access_denied"**
- Проверьте настройки OAuth consent screen
- Убедитесь, что приложение опубликовано или добавлен тестовый пользователь

## 📱 Мобильная поддержка

Google OAuth 2.0 автоматически работает на мобильных устройствах:
- На мобильных браузерах открывается popup
- На нативных приложениях можно использовать deep links

## 🔒 Безопасность

### **Best Practices:**
1. **Никогда не коммитьте** Client Secret в код
2. Используйте **HTTPS** в продакшне
3. Ограничьте **Authorized JavaScript origins**
4. Регулярно **ротируйте** Client Secret

### **Environment Variables:**
Добавьте в `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

## 🎉 Готово!

После настройки у вас будет:
- ✅ Google OAuth 2.0 авторизация
- ✅ Magic Link авторизация
- ✅ Работа на всех устройствах
- ✅ Безопасная интеграция через Supabase

## 📞 Поддержка

Если возникнут проблемы:
1. Проверьте логи в браузере (F12 → Console)
2. Проверьте логи в Supabase Dashboard
3. Убедитесь, что все URL настроены правильно 