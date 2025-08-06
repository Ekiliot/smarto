# 🚀 Настройка Supabase для Smarto

## 📋 Пошаговая инструкция

### **Шаг 1: Создание проекта Supabase**

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Создайте аккаунт** (бесплатно)
3. **Создайте новый проект:**
   - Название: `smarto-marketplace`
   - Пароль БД: придумайте сложный пароль (запишите!)
   - Регион: выберите ближайший (например, West Europe)

4. **Дождитесь создания проекта** (2-3 минуты)

### **Шаг 2: Получение ключей**

1. **В проекте перейдите в Settings → API**
2. **Скопируйте:**
   - **Project URL** (например: `https://xyz.supabase.co`)
   - **anon public key** (начинается с `eyJ...`)

### **Шаг 3: Настройка переменных окружения**

1. **Создайте файл `.env.local` в корне проекта**
2. **Добавьте ваши ключи:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Шаг 4: Создание таблиц**

1. **В Supabase Dashboard перейдите в SQL Editor**
2. **Скопируйте содержимое файла `database/schema.sql`**
3. **Вставьте в SQL Editor и нажмите "Run"**

### **Шаг 5: Проверка подключения**

1. **Запустите проект:** `npm run dev`
2. **Откройте админ панель:** `http://localhost:3000/admin`
3. **Попробуйте добавить товар**

## 🔧 Структура базы данных

### **Таблицы:**
- **`products`** - товары
- **`categories`** - категории
- **`metadata_types`** - типы метаданных
- **`users`** - пользователи
- **`shipping_methods`** - методы доставки
- **`payment_methods`** - методы оплаты

### **Связи:**
- Товары связаны с категориями через `category_id`
- Метаданные хранятся как JSON в поле `metadata`

## 🛠️ Миграция с localStorage

### **Автоматическая миграция:**
1. **Откройте админ панель**
2. **Перейдите в "Setări"**
3. **Нажмите "Migrate to Database"**

### **Ручная миграция:**
1. **Экспортируйте данные из localStorage**
2. **Импортируйте в Supabase через SQL**

## 🔒 Безопасность

### **RLS (Row Level Security):**
```sql
-- Включить RLS для всех таблиц
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- и т.д.
```

### **Политики доступа:**
```sql
-- Разрешить чтение всем
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Разрешить запись только админам
CREATE POLICY "Allow admin write access" ON products FOR ALL USING (
  auth.role() = 'admin'
);
```

## 📊 Мониторинг

### **Supabase Dashboard:**
- **Database** - просмотр таблиц и данных
- **Logs** - логи запросов
- **API** - тестирование API
- **Storage** - файловое хранилище

### **Метрики:**
- **Запросы в день:** 50,000 (бесплатно)
- **Размер БД:** 500MB (бесплатно)
- **Пользователи:** неограниченно

## 🚀 Развертывание

### **Vercel:**
1. **Добавьте переменные окружения в Vercel**
2. **Загрузите код на GitHub**
3. **Подключите к Vercel**

### **Другие платформы:**
- **Netlify** - аналогично Vercel
- **Railway** - встроенная поддержка Supabase
- **Heroku** - через add-on

## 🆘 Устранение неполадок

### **Ошибка подключения:**
- Проверьте URL и ключ в `.env.local`
- Убедитесь, что проект активен в Supabase

### **Ошибки SQL:**
- Проверьте синтаксис в `database/schema.sql`
- Убедитесь, что таблицы созданы

### **CORS ошибки:**
- Добавьте домен в Supabase Settings → API → CORS

## 💰 Стоимость

### **Бесплатный план:**
- ✅ 500MB база данных
- ✅ 50,000 запросов/месяц
- ✅ 2GB файловое хранилище
- ✅ Неограниченные пользователи

### **Платные планы:**
- **Pro:** $25/месяц (8GB БД, 250K запросов)
- **Team:** $599/месяц (100GB БД, 2M запросов)

## 📞 Поддержка

- **Документация:** [supabase.com/docs](https://supabase.com/docs)
- **Discord:** [supabase.com/discord](https://supabase.com/discord)
- **GitHub:** [github.com/supabase/supabase](https://github.com/supabase/supabase) 