-- Bundles table
CREATE TABLE IF NOT EXISTS bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundle products table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS bundle_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Bundle suggestions table (where to show bundle offers)
CREATE TABLE IF NOT EXISTS bundle_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Cart bundle items table
CREATE TABLE IF NOT EXISTS cart_bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  original_price DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bundles_active ON bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_bundle_products_bundle_id ON bundle_products(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_products_product_id ON bundle_products(product_id);
CREATE INDEX IF NOT EXISTS idx_bundle_suggestions_bundle_id ON bundle_suggestions(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_suggestions_product_id ON bundle_suggestions(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_bundle_items_user_id ON cart_bundle_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_bundle_items_bundle_id ON cart_bundle_items(bundle_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_bundles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bundles_updated_at
  BEFORE UPDATE ON bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_bundles_updated_at();

CREATE OR REPLACE FUNCTION update_cart_bundle_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_bundle_items_updated_at
  BEFORE UPDATE ON cart_bundle_items
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_bundle_items_updated_at();

-- RLS Policies for bundles
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_bundle_items ENABLE ROW LEVEL SECURITY;

-- Bundles: admins can do everything, users can only read active bundles
CREATE POLICY "Admins can manage bundles" ON bundles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view active bundles" ON bundles
  FOR SELECT USING (is_active = true);

-- Bundle products: admins can do everything, users can only read
CREATE POLICY "Admins can manage bundle products" ON bundle_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view bundle products" ON bundle_products
  FOR SELECT USING (true);

-- Bundle suggestions: admins can do everything, users can only read
CREATE POLICY "Admins can manage bundle suggestions" ON bundle_suggestions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view bundle suggestions" ON bundle_suggestions
  FOR SELECT USING (true);

-- Cart bundle items: users can manage their own, admins can view all
CREATE POLICY "Users can manage their cart bundle items" ON cart_bundle_items
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all cart bundle items" ON cart_bundle_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  ); 