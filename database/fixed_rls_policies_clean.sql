-- Fixed RLS Policies for Smarto Database (Clean Version)
-- Запустите этот скрипт в SQL Editor в Supabase Dashboard
-- Этот скрипт сначала удалит все существующие политики, затем создаст новые

-- =====================================================
-- 1. ОЧИСТКА СУЩЕСТВУЮЩИХ ПОЛИТИК
-- =====================================================

-- Удаляем все существующие политики для всех таблиц
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Only admins can modify categories" ON categories;

DROP POLICY IF EXISTS "Published products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Only admins can modify products" ON products;

DROP POLICY IF EXISTS "Active shipping methods are viewable by everyone" ON shipping_methods;
DROP POLICY IF EXISTS "Only admins can modify shipping methods" ON shipping_methods;

DROP POLICY IF EXISTS "Active payment methods are viewable by everyone" ON payment_methods;
DROP POLICY IF EXISTS "Only admins can modify payment methods" ON payment_methods;

DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist;

DROP POLICY IF EXISTS "Active bundles are viewable by everyone" ON bundles;
DROP POLICY IF EXISTS "Only admins can modify bundles" ON bundles;

DROP POLICY IF EXISTS "Bundle products are viewable by everyone" ON bundle_products;
DROP POLICY IF EXISTS "Only admins can modify bundle products" ON bundle_products;

DROP POLICY IF EXISTS "Active coupons are viewable by everyone" ON coupons;
DROP POLICY IF EXISTS "Only admins can modify coupons" ON coupons;

DROP POLICY IF EXISTS "Users can view their own coupon usage" ON coupon_usage;
DROP POLICY IF EXISTS "Users can create coupon usage" ON coupon_usage;
DROP POLICY IF EXISTS "Admins can view all coupon usage" ON coupon_usage;

DROP POLICY IF EXISTS "Metadata types are viewable by everyone" ON metadata_types;
DROP POLICY IF EXISTS "Only admins can modify metadata types" ON metadata_types;

-- =====================================================
-- 2. НАСТРОЙКА ТАБЛИЦ
-- =====================================================

-- 1. USERS TABLE - Отключаем RLS для упрощения
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- 2. CATEGORIES TABLE - Публичный доступ для чтения
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения категорий
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Только админы могут изменять категории
CREATE POLICY "Only admins can modify categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 3. PRODUCTS TABLE - Публичный доступ для чтения
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения опубликованных продуктов
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published');

-- Пользователи могут видеть все продукты (включая черновики) если они админы
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Только админы могут изменять продукты
CREATE POLICY "Only admins can modify products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 4. CART_ITEMS TABLE - Пользователи работают только со своей корзиной
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои товары в корзине
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут добавлять товары в свою корзину
CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять свои товары в корзине
CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Пользователи могут удалять свои товары из корзины
CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- 5. ORDERS TABLE - Пользователи работают только со своими заказами
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои заказы
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут создавать заказы
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять свои заказы
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Админы могут видеть все заказы
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Админы могут обновлять все заказы
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 6. ORDER_ITEMS TABLE - Пользователи работают только со своими заказами
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть товары своих заказов
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Пользователи могут создавать товары для своих заказов
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Админы могут видеть все товары заказов
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 7. SHIPPING_METHODS TABLE - Публичный доступ для чтения
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения активных методов доставки
CREATE POLICY "Active shipping methods are viewable by everyone" ON shipping_methods
  FOR SELECT USING (is_active = true);

-- Только админы могут изменять методы доставки
CREATE POLICY "Only admins can modify shipping methods" ON shipping_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 8. PAYMENT_METHODS TABLE - Публичный доступ для чтения
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения активных методов оплаты
CREATE POLICY "Active payment methods are viewable by everyone" ON payment_methods
  FOR SELECT USING (is_active = true);

-- Только админы могут изменять методы оплаты
CREATE POLICY "Only admins can modify payment methods" ON payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 9. WISHLIST TABLE (если есть)
-- Создаем таблицу wishlist если её нет
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои избранные товары
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут добавлять товары в избранное
CREATE POLICY "Users can add to wishlist" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Пользователи могут удалять товары из избранного
CREATE POLICY "Users can remove from wishlist" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- 10. BUNDLES TABLE - Публичный доступ для чтения
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения активных бандлов
CREATE POLICY "Active bundles are viewable by everyone" ON bundles
  FOR SELECT USING (is_active = true);

-- Только админы могут изменять бандлы
CREATE POLICY "Only admins can modify bundles" ON bundles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 11. BUNDLE_PRODUCTS TABLE - Публичный доступ для чтения
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения
CREATE POLICY "Bundle products are viewable by everyone" ON bundle_products
  FOR SELECT USING (true);

-- Только админы могут изменять
CREATE POLICY "Only admins can modify bundle products" ON bundle_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 12. COUPONS TABLE - Публичный доступ для чтения активных купонов
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения активных купонов
CREATE POLICY "Active coupons are viewable by everyone" ON coupons
  FOR SELECT USING (is_active = true);

-- Только админы могут изменять купоны
CREATE POLICY "Only admins can modify coupons" ON coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 13. COUPON_USAGE TABLE - Пользователи видят только свои использования
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои использования купонов
CREATE POLICY "Users can view their own coupon usage" ON coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Пользователи могут создавать записи использования
CREATE POLICY "Users can create coupon usage" ON coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Админы могут видеть все использования
CREATE POLICY "Admins can view all coupon usage" ON coupon_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 14. METADATA_TYPES TABLE - Публичный доступ для чтения
ALTER TABLE metadata_types ENABLE ROW LEVEL SECURITY;

-- Публичный доступ для чтения
CREATE POLICY "Metadata types are viewable by everyone" ON metadata_types
  FOR SELECT USING (true);

-- Только админы могут изменять
CREATE POLICY "Only admins can modify metadata_types" ON metadata_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- 3. ПРЕДОСТАВЛЕНИЕ ПРАВ
-- =====================================================

-- Предоставляем права на все таблицы
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- 4. ПРОВЕРКА РЕЗУЛЬТАТА
-- =====================================================

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