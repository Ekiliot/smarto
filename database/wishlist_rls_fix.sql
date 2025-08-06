-- Wishlist RLS Fix
-- Исправление RLS политик для таблицы wishlist_items

-- Сначала удалим существующие политики
DROP POLICY IF EXISTS "Users can view own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can insert own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete own wishlist items" ON wishlist_items;

-- Убедимся, что RLS включен
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Создаем новые политики с правильными условиями
-- Пользователи могут видеть только свои лайкнутые товары
CREATE POLICY "Users can view own wishlist items" ON wishlist_items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Пользователи могут добавлять товары в свой вишлист
-- Проверяем, что user_id равен текущему пользователю
CREATE POLICY "Users can insert own wishlist items" ON wishlist_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Пользователи могут удалять товары из своего вишлиста
-- Проверяем, что user_id равен текущему пользователю
CREATE POLICY "Users can delete own wishlist items" ON wishlist_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Предоставление прав аутентифицированным пользователям
GRANT SELECT, INSERT, DELETE ON wishlist_items TO authenticated;

-- Проверяем, что политики созданы
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'wishlist_items'; 