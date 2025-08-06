# Настройка Google OAuth для Supabase

## 🔧 **Пошаговая настройка:**

### **1. Создание Google OAuth приложения:**

1. **Перейдите на [Google Cloud Console](https://console.cloud.google.com/)**
2. **Создайте новый проект или выберите существующий**
3. **Перейдите в "APIs & Services" → "Credentials"**
4. **Нажмите "Create Credentials" → "OAuth 2.0 Client IDs"**
5. **Выберите "Web application"**
6. **Заполните форму:**
   - **Name:** Smarto OAuth
   - **Authorized JavaScript origins:**
     ```
     https://smarto-one.vercel.app
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     https://qutfumioleqbmjojrpzf.supabase.co/auth/v1/callback
     ```
7. **Нажмите "Create"**
8. **Скопируйте Client ID и Client Secret**

### **2. Настройка в Supabase Dashboard:**

1. **Перейдите в Supabase Dashboard → Authentication → Providers**
2. **Найдите Google и нажмите "Enable"**
3. **Введите данные:**
   - **Client ID:** ваш Google Client ID
   - **Client Secret:** ваш Google Client Secret
4. **Нажмите "Save"**

### **3. Настройка URL в Supabase:**

**Authentication → URL Configuration:**
```
Site URL: https://smarto-one.vercel.app
Redirect URLs: 
- https://smarto-one.vercel.app/auth/callback
- https://smarto-one.vercel.app/account
- http://localhost:3000/auth/callback
- http://localhost:3000/account
```

## 🎯 **Функциональность:**

### **Добавлено в приложение:**

1. **Кнопка "Conectare cu Google"** на странице `/login`
2. **Google авторизация в мобильном меню**
3. **Автоматическое создание пользователя** при первой авторизации
4. **Получение данных пользователя** из Google (имя, email, фото)

### **Как это работает:**

1. **Пользователь нажимает "Conectare cu Google"**
2. **Открывается окно авторизации Google**
3. **После успешной авторизации пользователь перенаправляется на `/account`**
4. **Создается запись в таблице `users`** (если пользователь новый)
5. **Пользователь автоматически входит в систему**

## 🔒 **Безопасность:**

### **Что получаем от Google:**
- **Email** (обязательно)
- **Имя** (если пользователь разрешил)
- **Фото профиля** (если пользователь разрешил)
- **Уникальный ID** пользователя

### **RLS политики:**
- Пользователи могут читать только свои данные
- Администраторы имеют полный доступ
- Автоматическое создание пользователей при первой авторизации

## 🧪 **Тестирование:**

### **Локальное тестирование:**
1. **Добавьте `http://localhost:3000` в Google OAuth origins**
2. **Запустите `npm run dev`**
3. **Перейдите на `/login`**
4. **Нажмите "Conectare cu Google"**

### **Production тестирование:**
1. **Убедитесь, что URL настроены правильно**
2. **Проверьте environment variables в Vercel**
3. **Протестируйте на мобильных устройствах**

## 🚨 **Возможные проблемы:**

### **1. "Invalid redirect URI"**
**Решение:** Проверьте, что redirect URI в Google Console точно совпадает с Supabase URL.

### **2. "Client ID not found"**
**Решение:** Убедитесь, что Client ID правильно скопирован в Supabase Dashboard.

### **3. "OAuth consent screen not configured"**
**Решение:** Настройте OAuth consent screen в Google Cloud Console.

### **4. "Redirect URI mismatch"**
**Решение:** Добавьте все необходимые redirect URIs в Google Console.

## 📋 **Чек-лист:**

- [ ] Создан проект в Google Cloud Console
- [ ] Настроен OAuth 2.0 Client ID
- [ ] Добавлены правильные redirect URIs
- [ ] Включен Google provider в Supabase
- [ ] Введены Client ID и Client Secret
- [ ] Настроены URL в Supabase Authentication
- [ ] Протестирована авторизация локально
- [ ] Протестирована авторизация в production 