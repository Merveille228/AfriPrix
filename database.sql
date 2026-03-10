-- Script SQL pour la base de données AfriPrix
-- À exécuter dans l'éditeur SQL de Supabase

-- Extension UUID si non déjà présente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'Autre',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des magasins
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    quartier VARCHAR(255),
    type VARCHAR(100) DEFAULT 'market',
    latitude DECIMAL(10, 8) DEFAULT 0,
    longitude DECIMAL(11, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des prix
CREATE TABLE IF NOT EXISTS prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des votes/signalements
CREATE TABLE IF NOT EXISTS price_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    price_id UUID NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_store_id ON prices(store_id);
CREATE INDEX IF NOT EXISTS idx_prices_user_id ON prices(user_id);
CREATE INDEX IF NOT EXISTS idx_prices_updated_at ON prices(updated_at);
CREATE INDEX IF NOT EXISTS idx_price_reports_price_id ON price_reports(price_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table products
CREATE POLICY "Les produits sont visibles par tout le monde" ON products
    FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des produits" ON products
    FOR INSERT WITH CHECK (true);

-- Politiques pour la table stores
CREATE POLICY "Les magasins sont visibles par tout le monde" ON stores
    FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des magasins" ON stores
    FOR INSERT WITH CHECK (true);

-- Politiques pour la table prices
CREATE POLICY "Les prix sont visibles par tout le monde" ON prices
    FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des prix" ON prices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres prix" ON prices
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour la table price_reports
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des signalements" ON price_reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs peuvent voir leurs propres signalements" ON price_reports
    FOR SELECT USING (auth.uid() = user_id);

-- Données de démonstration (optionnel)
INSERT INTO products (name) VALUES 
('Riz'),
('Huile de tournesol'),
('iPhone 15'),
('Lait'),
('Pain'),
('Sucre'),
('Farine'),
('Tomates'),
('Oignons'),
('Poulet')
ON CONFLICT DO NOTHING;

INSERT INTO stores (name, city, latitude, longitude) VALUES 
('Marché de Tokoin',       'Lomé',     6.1522,  1.2221),
('Score Supermarché',       'Lomé',     6.1376,  1.2123),
('Espace Kaba',              'Lomé',     6.1461,  1.2265),
('Marché Central de Kara',  'Kara',     9.5510,  1.1868),
('Grand Marché de Sokodé',  'Sokodé',   8.9820,  1.1446)
ON CONFLICT DO NOTHING;

-- Quelques prix de démonstration
INSERT INTO prices (product_id, store_id, price, user_id) VALUES 
((SELECT id FROM products WHERE name = 'Riz' LIMIT 1), 
 (SELECT id FROM stores WHERE name = 'Carrefour' LIMIT 1), 
 2.50, 
 (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM products WHERE name = 'Huile de tournesol' LIMIT 1), 
 (SELECT id FROM stores WHERE name = 'Casino' LIMIT 1), 
 3.20, 
 (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM products WHERE name = 'iPhone 15' LIMIT 1), 
 (SELECT id FROM stores WHERE name = 'Auchan' LIMIT 1), 
 899.99, 
 (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION — à exécuter si la base existe déjà
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajouter image_url si elle n'existe pas encore
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Ajouter type et quartier à stores si absents
ALTER TABLE stores ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'market';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS quartier VARCHAR(255);

-- Nettoyer les URLs Unsplash dépréciées
UPDATE products SET image_url = NULL WHERE image_url LIKE '%source.unsplash.com%';

-- ── Politiques admin (rôle défini dans app_metadata) ──────────────────────
-- Pour activer le rôle admin sur votre compte, exécutez :
-- UPDATE auth.users
--   SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--   WHERE email = 'VOTRE_EMAIL';

CREATE POLICY "Admin peut supprimer des produits" ON products
  FOR DELETE USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin peut supprimer des prix" ON prices
  FOR DELETE USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin peut modifier tous les prix" ON prices
  FOR UPDATE USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admin peut supprimer des magasins" ON stores
  FOR DELETE USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
