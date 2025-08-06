-- Update shipping_methods table for Smarto Marketplace
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

-- Add new columns to shipping_methods table
ALTER TABLE shipping_methods 
ADD COLUMN IF NOT EXISTS min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_order_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS free_shipping_threshold DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Rename price column to shipping_cost if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shipping_methods' AND column_name = 'price') THEN
        ALTER TABLE shipping_methods RENAME COLUMN price TO shipping_cost;
    END IF;
END $$;

-- Update existing shipping methods with new data
UPDATE shipping_methods SET 
  min_order_amount = 0,
  shipping_cost = 50.00,
  free_shipping_threshold = 500.00,
  description = 'Livrare standard la adresa dvs.'
WHERE name = 'Livrare la domiciliu';

UPDATE shipping_methods SET 
  min_order_amount = 0,
  shipping_cost = 0.00,
  free_shipping_threshold = NULL,
  description = 'Ridicare gratuită din magazinul nostru'
WHERE name = 'Ridicare din magazin';

UPDATE shipping_methods SET 
  min_order_amount = 0,
  shipping_cost = 100.00,
  free_shipping_threshold = 1000.00,
  description = 'Livrare rapidă în 24 de ore'
WHERE name = 'Livrare express'; 