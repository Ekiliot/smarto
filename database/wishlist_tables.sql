-- Wishlist Tables
-- Таблица для лайкнутых товаров пользователей

-- Создание таблицы wishlist_items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Уникальный индекс для предотвращения дублирования
  UNIQUE(user_id, product_id)
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON wishlist_items(created_at);

-- Включение RLS для безопасности
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Политики RLS для wishlist_items
-- Пользователи могут видеть только свои лайкнутые товары
CREATE POLICY "Users can view own wishlist items" ON wishlist_items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Пользователи могут добавлять товары в свой вишлист
CREATE POLICY "Users can insert own wishlist items" ON wishlist_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Пользователи могут удалять товары из своего вишлиста
CREATE POLICY "Users can delete own wishlist items" ON wishlist_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Предоставление прав аутентифицированным пользователям
GRANT SELECT, INSERT, DELETE ON wishlist_items TO authenticated;

-- Комментарии для документации
COMMENT ON TABLE wishlist_items IS 'Таблица для хранения лайкнутых товаров пользователей';
COMMENT ON COLUMN wishlist_items.user_id IS 'ID пользователя';
COMMENT ON COLUMN wishlist_items.product_id IS 'ID товара';
COMMENT ON COLUMN wishlist_items.created_at IS 'Дата добавления в вишлист'; 