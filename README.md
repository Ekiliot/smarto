# 🏠 Smarto - Маркетплейс техники умного дома

Маркетплейс техники умного дома Smarto в Молдове, построенный на Next.js 14 и Supabase.

## 🚀 Особенности

- **Адаптивный дизайн** - оптимизирован для мобильных и десктопных устройств
- **Современный UI/UX** - красивый интерфейс с анимациями и переходами
- **Supabase** - мощная backend-as-a-service платформа
- **Next.js 14** - современный React фреймворк
- **Tailwind CSS** - утилитарный CSS фреймворк
- **TypeScript** - типизированный JavaScript
- **Framer Motion** - библиотека анимаций

## 🛠 Технологии

- **Backend**: Supabase (PostgreSQL), Node.js
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL (через Supabase)
- **Authentication**: Supabase Auth

## 📋 Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт Supabase (бесплатно)

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd smarto
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

1. **Создайте проект** на [supabase.com](https://supabase.com)
2. **Скопируйте ключи** из Settings → API
3. **Создайте файл `.env.local`**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Запустите SQL скрипт** из `database/schema.sql` в Supabase SQL Editor

### 4. Запуск приложения

```bash
npm run dev
```

### 5. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 6. Демо-аккаунты

- **Администратор**: admin@smarto.md / admin123

## 🚀 Деплой в Vercel

### Быстрый деплой

1. **Fork** этот репозиторий на GitHub
2. Перейдите на [Vercel](https://vercel.com)
3. Нажмите "New Project"
4. Подключите ваш GitHub репозиторий
5. Добавьте переменные окружения:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Нажмите "Deploy"

### Подробные инструкции

См. файл [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) для подробных инструкций по настройке.

## 💾 Управление данными

### Режим разработки (localStorage)
Приложение может работать с **localStorage** для быстрой разработки:
- ✅ Все данные сохраняются локально в браузере
- ✅ Не требуется настройка базы данных
- ✅ Идеально для демонстрации и тестирования

### Продакшн режим (Supabase)
Для реального использования настроен **Supabase**:
- ✅ PostgreSQL база данных
- ✅ RESTful API
- ✅ Аутентификация
- ✅ Файловое хранилище
- ✅ Реальное время

## 📁 Структура проекта

```
smarto/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Админ панель
│   │   ├── globals.css     # Глобальные стили
│   │   ├── layout.tsx      # Корневой layout
│   │   └── page.tsx        # Главная страница
│   ├── components/         # React компоненты
│   │   ├── Header.tsx      # Шапка сайта
│   │   ├── Footer.tsx      # Подвал сайта
│   │   ├── Hero.tsx        # Hero секция
│   │   ├── ProductCard.tsx # Карточка товара
│   │   └── AdminPanel.tsx  # Админ панель
│   ├── hooks/              # Custom React hooks
│   │   ├── useData.ts      # localStorage хуки (legacy)
│   │   └── useSupabase.ts  # Supabase хуки (новые)
│   ├── lib/                # Утилиты и конфигурации
│   │   ├── database.ts     # localStorage API (legacy)
│   │   └── supabase.ts     # Supabase клиент
│   └── types/              # TypeScript типы
├── database/
│   └── schema.sql          # SQL схема для Supabase
├── next.config.js          # Конфигурация Next.js
├── tailwind.config.js      # Конфигурация Tailwind
├── tsconfig.json           # Конфигурация TypeScript
└── package.json            # Зависимости и скрипты
```

## 🎨 Дизайн система

### Цвета

- **Primary**: Smarto Blue (#0ea5e9)
- **Secondary**: Orange (#f2751a)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Типографика

- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

## 📱 Адаптивность

Сайт полностью адаптивен и оптимизирован для:
- Мобильные устройства (320px+)
- Планшеты (768px+)
- Десктопы (1024px+)
- Большие экраны (1280px+)

## 🔧 Доступные скрипты

```bash
# Разработка
npm run dev              # Запуск Next.js в режиме разработки

# Сборка
npm run build            # Сборка Next.js приложения

# Продакшн
npm run start            # Запуск Next.js в продакшн режиме

# Линтинг
npm run lint             # Проверка кода ESLint
```

## 🛍 Функциональность

### Для покупателей:
- Просмотр товаров по категориям
- Поиск товаров
- Добавление в корзину
- Избранное
- Оформление заказа
- Отслеживание заказа

### Для администраторов:
- Управление товарами (CRUD)
- Управление категориями
- Управление метаданными
- Управление пользователями
- Настройки доставки и оплаты
- Статистика и аналитика

## 🚀 Деплой

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Supabase (Backend)
- Автоматически настроен при создании проекта
- Не требует дополнительной настройки

## 💰 Стоимость

### Supabase (Бесплатный план)
- ✅ 500MB база данных
- ✅ 50,000 запросов/месяц
- ✅ 2GB файловое хранилище
- ✅ Неограниченные пользователи

## 📚 Документация

- **Настройка Supabase**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Миграция данных**: [MIGRATION.md](./MIGRATION.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 📞 Контакты

- **Email**: info@smarto.md
- **Телефон**: +373 22 123 456
- **Адрес**: Chișinău, Moldova

## 🙏 Благодарности

- [Supabase](https://supabase.com/) - за отличную backend-as-a-service платформу
- [Next.js](https://nextjs.org/) - за современный React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) - за утилитарный CSS фреймворк
- [Framer Motion](https://www.framer.com/motion/) - за библиотеку анимаций 