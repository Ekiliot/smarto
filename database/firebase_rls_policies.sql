-- Настройка RLS политик для Firebase + Supabase интеграции
-- Запустите этот скрипт в SQL Editor в Supabase Dashboard

-- Включаем RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики (если есть)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow admin full access to products" ON products;
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to shipping methods" ON shipping_methods;
DROP POLICY IF EXISTS "Allow admin full access to shipping methods" ON shipping_methods;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can insert own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete own wishlist" ON wishlist_items;

-- Политики для пользователей (users)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admin full access to users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для продуктов (products) - публичный доступ для чтения
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для категорий (categories) - публичный доступ для чтения
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для методов доставки (shipping_methods) - публичный доступ для чтения
CREATE POLICY "Allow public read access to shipping methods" ON shipping_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin full access to shipping methods" ON shipping_methods FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для избранного (wishlist_items)
CREATE POLICY "Users can view own wishlist" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist" ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- Политики для корзины (cart_items)
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Политики для заказов (orders)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow admin full access to orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для элементов заказов (order_items)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Allow admin full access to order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Политики для купонов (coupons) - только админы
CREATE POLICY "Allow admin full access to coupons" ON coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Предоставляем права доступа
GRANT SELECT ON users TO anon;
GRANT SELECT ON users TO authenticated;
GRANT UPDATE ON users TO authenticated;
GRANT ALL ON users TO service_role;

GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT ALL ON products TO service_role;

GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;
GRANT ALL ON categories TO service_role;

GRANT SELECT ON shipping_methods TO anon;
GRANT SELECT ON shipping_methods TO authenticated;
GRANT ALL ON shipping_methods TO service_role;

GRANT SELECT, INSERT, DELETE ON wishlist_items TO authenticated;
GRANT ALL ON wishlist_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;
GRANT ALL ON cart_items TO service_role;

GRANT SELECT, INSERT ON orders TO authenticated;
GRANT ALL ON orders TO service_role;

GRANT SELECT, INSERT ON order_items TO authenticated;
GRANT ALL ON order_items TO service_role;

GRANT ALL ON coupons TO service_role;

-- Создаем функцию для автоматического создания пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'user',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер для автоматического создания пользователя
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Проверяем, что все политики созданы
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
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 