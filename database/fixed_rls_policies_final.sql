-- Fixed RLS Policies for Smarto Database (Final Version)
-- Запустите этот скрипт в SQL Editor в Supabase Dashboard
-- Этот скрипт работает только с существующими таблицами

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
DROP POLICY IF EXISTS "Only admins can modify metadata_types" ON metadata_types;

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

-- 9. BUNDLES TABLE - Публичный доступ для чтения (если таблица существует)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bundles') THEN
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
  END IF;
END $$;

-- 10. BUNDLE_PRODUCTS TABLE - Публичный доступ для чтения (если таблица существует)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bundle_products') THEN
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
  END IF;
END $$;

-- 11. COUPONS TABLE - Публичный доступ для чтения активных купонов (если таблица существует)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'coupons') THEN
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
  END IF;
END $$;

-- 12. COUPON_USAGE TABLE - Пользователи видят только свои использования (если таблица существует)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'coupon_usage') THEN
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
  END IF;
END $$;

-- 13. METADATA_TYPES TABLE - Публичный доступ для чтения (если таблица существует)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'metadata_types') THEN
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
  END IF;
END $$;

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

-- Показываем статус RLS для всех таблиц
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename; 