# 🚀 Быстрый деплой Smarto в Vercel

## Шаги для деплоя:

### 1. Подготовка GitHub
- Убедитесь, что код загружен в GitHub репозиторий
- Проверьте, что сборка проходит локально: `npm run build`

### 2. Настройка Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш репозиторий Smarto
5. Нажмите "Import"

### 3. Настройка переменных окружения
В настройках проекта добавьте:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Настройка Supabase
В Supabase Dashboard:
1. **Authentication > URL Configuration:**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/auth/callback`

2. **Settings > API > CORS:**
   - Добавьте: `https://your-domain.vercel.app`

### 5. Деплой
- Нажмите "Deploy"
- Дождитесь завершения сборки
- Проверьте работу сайта

## Проверка после деплоя:
- ✅ Главная страница загружается
- ✅ Регистрация/вход работает
- ✅ Корзина функционирует
- ✅ Изображения отображаются
- ✅ Мобильная версия работает

## Проблемы?
См. подробные инструкции в [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 