# Firebase Security Rules

## 🔒 **Настройка безопасности Firebase:**

### **1. Authentication Rules (по умолчанию безопасны):**
```javascript
// В Firebase Console → Authentication → Rules
// По умолчанию безопасно, дополнительная настройка не требуется
```

### **2. Firestore Rules (если используете):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Администраторы имеют полный доступ
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### **3. Storage Rules (если используете):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Пользователи могут загружать только свои файлы
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Публичные изображения продуктов
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🚨 **Дополнительные меры безопасности:**

### **1. Ограничение доменов в Firebase:**
1. **Firebase Console → Authentication → Settings → Authorized domains**
2. **Добавьте только ваши домены:**
   - `localhost` (для разработки)
   - `smarto-one.vercel.app` (production)

### **2. Настройка OAuth consent screen:**
1. **Google Cloud Console → APIs & Services → OAuth consent screen**
2. **Ограничьте доступ только необходимыми данными:**
   - Email
   - Basic profile info
   - Не запрашивайте лишние разрешения

### **3. Мониторинг:**
1. **Firebase Console → Authentication → Users**
2. **Отслеживайте подозрительную активность**
3. **Настройте уведомления о новых входах**

## ✅ **Текущая конфигурация безопасна потому что:**

1. **API ключ Firebase Web SDK** - это нормально, он предназначен для клиентского использования
2. **JWT токены** - подписываются Google, подделать невозможно
3. **RLS политики** - контролируют доступ к данным на уровне базы
4. **HTTPS** - все коммуникации зашифрованы
5. **Ограниченные права** - пользователи видят только свои данные

## 🔍 **Что можно улучшить:**

1. **Добавить rate limiting** для API запросов
2. **Настроить мониторинг** подозрительной активности
3. **Регулярно обновлять** зависимости
4. **Настроить backup** данных
5. **Добавить двухфакторную аутентификацию** (если нужно)

## 📋 **Чек-лист безопасности:**

- [x] JWT токены подписываются Google
- [x] RLS политики настроены
- [x] HTTPS используется везде
- [x] Ограниченные права доступа
- [ ] Настроены Firebase Security Rules
- [ ] Ограничены домены в Firebase
- [ ] Настроен мониторинг
- [ ] Регулярные обновления зависимостей 