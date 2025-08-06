-- Добавление базовых методов доставки
-- Запустите этот скрипт в SQL Editor в Supabase Dashboard

-- Создаем таблицу shipping_methods если её нет
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('home', 'pickup', 'express')),
  min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_order_amount DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2),
  estimated_days INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем базовые методы доставки
INSERT INTO shipping_methods (
  name, 
  type, 
  min_order_amount, 
  shipping_cost, 
  free_shipping_threshold, 
  estimated_days, 
  description, 
  is_active
) VALUES 
  (
    'Livrare la domiciliu',
    'home',
    0,
    25.00,
    220.00,
    3,
    'Livrare standard la adresa dvs. în 1-3 zile lucrătoare',
    true
  ),
  (
    'Ridicare din magazin',
    'pickup',
    0,
    0.00,
    0.00,
    1,
    'Ridicare gratuită din magazinul nostru',
    true
  ),
  (
    'Livrare express',
    'express',
    0,
    45.00,
    300.00,
    1,
    'Livrare rapidă în aceeași zi sau următoarea zi lucrătoare',
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_shipping_methods_type ON shipping_methods(type);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_active ON shipping_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_amount ON shipping_methods(min_order_amount, max_order_amount);

-- Включаем RLS
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Allow public read access to active shipping methods" ON shipping_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to shipping methods" ON shipping_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Предоставляем права
GRANT SELECT ON shipping_methods TO anon;
GRANT SELECT ON shipping_methods TO authenticated;
GRANT ALL ON shipping_methods TO service_role; 