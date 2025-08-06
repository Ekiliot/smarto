-- Shipping Methods with Price Ranges
-- Запустите этот скрипт в SQL Editor в Supabase Dashboard

-- Drop existing table if exists
DROP TABLE IF EXISTS shipping_methods CASCADE;

-- Create shipping methods table with price ranges
CREATE TABLE shipping_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('home', 'pickup', 'express')),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_order_amount DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2),
  estimated_days INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_shipping_methods_type ON shipping_methods(type);
CREATE INDEX idx_shipping_methods_is_active ON shipping_methods(is_active);
CREATE INDEX idx_shipping_methods_amount_range ON shipping_methods(min_order_amount, max_order_amount);

-- Add trigger for updated_at
CREATE TRIGGER update_shipping_methods_updated_at 
  BEFORE UPDATE ON shipping_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default shipping methods
INSERT INTO shipping_methods (
  name, 
  type, 
  min_order_amount, 
  max_order_amount, 
  shipping_cost, 
  free_shipping_threshold, 
  estimated_days, 
  description
) VALUES
-- Livrare la domiciliu cu intervale de preț
('Livrare standard', 'home', 0, 200, 30.00, 500, 2, 'Livrare standard la domiciliu în 2 zile lucrătoare'),
('Livrare standard', 'home', 200, 500, 20.00, 500, 2, 'Livrare standard la domiciliu în 2 zile lucrătoare'),
('Livrare standard', 'home', 500, 1000, 10.00, 500, 2, 'Livrare standard la domiciliu în 2 zile lucrătoare'),
('Livrare standard', 'home', 1000, NULL, 0.00, 500, 2, 'Livrare gratuită pentru comenzi peste 1000 MDL'),

-- Livrare express cu intervale de preț
('Livrare express', 'express', 0, 300, 50.00, 1000, 1, 'Livrare express în ziua următoare'),
('Livrare express', 'express', 300, 800, 40.00, 1000, 1, 'Livrare express în ziua următoare'),
('Livrare express', 'express', 800, NULL, 30.00, 1000, 1, 'Livrare express în ziua următoare'),

-- Ridicare din magazin (gratuită)
('Ridicare din magazin', 'pickup', 0, NULL, 0.00, 0, 0, 'Ridicare gratuită din magazinul nostru');

-- Create a view for easy shipping calculation
CREATE OR REPLACE VIEW shipping_calculator AS
SELECT 
  id,
  name,
  type,
  min_order_amount,
  max_order_amount,
  shipping_cost,
  free_shipping_threshold,
  estimated_days,
  description,
  is_active
FROM shipping_methods 
WHERE is_active = true
ORDER BY type, min_order_amount; 