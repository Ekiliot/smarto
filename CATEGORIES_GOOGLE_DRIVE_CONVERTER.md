# 🔗 Конвертер ссылок Google Drive для категорий

## 🎯 Добавленная функциональность

### ✅ **1. Автоматическая конвертация ссылок Google Drive**

#### 🔧 **Функция конвертации:**
```typescript
const convertGoogleDriveUrl = (url: string): string => {
  // Handle different Google Drive URL formats
  if (url.includes('drive.google.com/file/d/')) {
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
  } else if (url.includes('drive.google.com/open?id=')) {
    // Format: https://drive.google.com/open?id=FILE_ID
    const match = url.match(/id=([a-zA-Z0-9-_]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
  } else if (url.includes('drive.google.com/uc?export=download&id=')) {
    // Format: https://drive.google.com/uc?export=download&id=FILE_ID
    const match = url.match(/id=([a-zA-Z0-9-_]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
  } else if (url.includes('drive.google.com/uc?export=view&id=')) {
    // Already in correct format
    return url
  }
  
  return url // Return original URL if no pattern matches
}
```

#### 🎯 **Поддерживаемые форматы:**
- **Формат 1:** `https://drive.google.com/file/d/FILE_ID/view`
- **Формат 2:** `https://drive.google.com/open?id=FILE_ID`
- **Формат 3:** `https://drive.google.com/uc?export=download&id=FILE_ID`
- **Формат 4:** `https://drive.google.com/uc?export=view&id=FILE_ID` (уже правильный)

### ✅ **2. Автоматическая конвертация через 2 секунды**

#### ⏱️ **Логика работы:**
```typescript
const handleImageUrlChange = (url: string) => {
  setNewCategory(prev => ({ ...prev, image: url }))
  
  // Auto-convert Google Drive URLs after 2 seconds
  if (url.includes('drive.google.com') && !url.includes('uc?export=view')) {
    setIsConvertingUrl(true)
    setTimeout(() => {
      const convertedUrl = convertGoogleDriveUrl(url)
      setNewCategory(prev => ({ ...prev, image: convertedUrl }))
      setIsConvertingUrl(false)
    }, 2000)
  }
}
```

#### 🔄 **Процесс конвертации:**
1. **Пользователь вставляет ссылку** Google Drive
2. **Проверка формата** - если это Google Drive ссылка
3. **Установка состояния** `isConvertingUrl = true`
4. **Ожидание 2 секунды** для завершения ввода
5. **Конвертация ссылки** в правильный формат
6. **Обновление поля** с новой ссылкой
7. **Сброс состояния** `isConvertingUrl = false`

### ✅ **3. Визуальная обратная связь**

#### 🎨 **Индикатор конвертации:**
- **Спиннер:** Анимированная иконка загрузки
- **Цвет поля:** Оранжевая рамка и фон во время конвертации
- **Текст подсказки:** "Se convertește link-ul Google Drive..."

#### 📸 **Предварительный просмотр изображения:**
- **Размер:** 128x128px (w-32 h-32)
- **Обработка ошибок:** Показ "Imagine invalidă" при ошибке загрузки
- **Отображение:** Только после завершения конвертации

### ✅ **4. Обновленное поле ввода**

#### 🔧 **Новые возможности:**
```typescript
<div className="relative">
  <input
    type="url"
    value={newCategory.image}
    onChange={(e) => handleImageUrlChange(e.target.value)}
    className={`input-field pr-10 ${isConvertingUrl ? 'border-orange-500 bg-orange-50' : ''}`}
    placeholder="https://drive.google.com/file/d/... sau https://example.com/image.jpg"
  />
  {isConvertingUrl && (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
    </div>
  )}
</div>
```

#### 🎯 **Особенности:**
- **Расширенный плейсхолдер** с примерами ссылок
- **Динамические стили** во время конвертации
- **Позиционированный спиннер** справа от поля
- **Отступ справа** для спиннера (`pr-10`)

## 🚀 **Результат**

### ✅ **До обновления:**
- ❌ Нет автоматической конвертации Google Drive ссылок
- ❌ Нет предварительного просмотра изображений
- ❌ Нет визуальной обратной связи
- ❌ Ручная конвертация ссылок

### ✅ **После обновления:**
- ✅ **Автоматическая конвертация** через 2 секунды
- ✅ **Предварительный просмотр** изображений
- ✅ **Визуальная обратная связь** с анимацией
- ✅ **Поддержка всех форматов** Google Drive ссылок
- ✅ **Обработка ошибок** загрузки изображений

## 🔧 **Технические особенности**

### ✅ **Состояния:**
- **`isConvertingUrl`** - индикатор процесса конвертации
- **`newCategory.image`** - текущее значение поля изображения

### ✅ **Функции:**
- **`convertGoogleDriveUrl()`** - конвертация различных форматов ссылок
- **`handleImageUrlChange()`** - обработка изменений с автоконвертацией

### ✅ **UI компоненты:**
- **Спиннер загрузки** с анимацией
- **Предварительный просмотр** изображения
- **Динамические стили** поля ввода
- **Текстовые подсказки** для пользователя

## 🎯 **Примеры использования**

### 📝 **Вставка ссылки Google Drive:**
1. Пользователь вставляет: `https://drive.google.com/file/d/1YMvkjbDCsWAF4MVQrBkHaM5TNAgef2T4/view?usp=drive_link`
2. Через 2 секунды автоматически конвертируется в: `https://drive.google.com/uc?export=view&id=1YMvkjbDCsWAF4MVQrBkHaM5TNAgef2T4`
3. Показывается предварительный просмотр изображения

### 🎨 **Визуальные эффекты:**
- **Во время конвертации:** Оранжевая рамка, спиннер, подсказка
- **После конвертации:** Обычная рамка, предварительный просмотр
- **При ошибке:** Сообщение "Imagine invalidă"

## 🎯 **Готово!**

Теперь в странице категорий есть:
- 🔗 **Автоматический конвертер** Google Drive ссылок
- ⏱️ **Конвертация через 2 секунды** после вставки
- 🎨 **Визуальная обратная связь** с анимацией
- 📸 **Предварительный просмотр** изображений
- 🔧 **Поддержка всех форматов** Google Drive ссылок
- ⚡ **Удобное использование** без ручной конвертации 