-- ====================================================================
-- SEED DATA FOR THE ROYAL TANDOOR (SAMPLE / DEMO CONTENT)
-- ====================================================================

-- Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active) VALUES
('cat-starters', 'Tandoori Starters', 'tandoori-starters', 'Charcoal-grilled kebabs, tikkas, and appetisers.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80', 1, true),
('cat-curries', 'Royal Curries', 'royal-curries', 'Rich slow-simmered gravies with cream and butter.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80', 2, true),
('cat-biryanis', 'Dum Biryani & Rice', 'dum-biryani', 'Long-grain basmati sealed on dum with saffron.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 3, true),
('cat-breads', 'Clay Oven Breads', 'tandoori-breads', 'Crispy naans, parathas, and rotis baked in clay.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 4, true),
('cat-combos', 'Value Combos & Thalis', 'combos-thalis', 'Curated meals with curries, breads, rice & dessert.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80', 5, true),
('cat-desserts-beverages', 'Desserts & Beverages', 'desserts-beverages', 'Traditional sweets and lassis.', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, category_id, name, slug, description, base_price, image_url, dietary_type, spice_level, tags, is_bestseller, is_available, display_order) VALUES
('prod-paneer-tikka', 'cat-starters', 'Smoked Paneer Tikka', 'smoked-paneer-tikka', 'Cubes of fresh malai paneer marinated in Kashmiri chili and ajwain yogurt.', 28900, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80', 'veg', 1, '{"Bestseller","Tandoor Hit"}', true, true, 1),
('prod-tandoori-chicken', 'cat-starters', 'Royal Tandoori Chicken', 'royal-tandoori-chicken', 'Whole chicken steeped in curd, roasted mustard oil, and ground spices.', 34900, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 'non-veg', 2, '{"Must Try","Signature"}', true, true, 2),
('prod-dal-makhani', 'cat-curries', 'Signature Dal Makhani (24-Hour Dum)', 'signature-dal-makhani', 'Black urad lentils and kidney beans slow-simmered over live charcoal for 24 hours with butter and cream.', 27900, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', 'veg', 1, '{"Legendary","Bestseller"}', true, true, 3),
('prod-butter-chicken', 'cat-curries', 'Classic Butter Chicken (Murgh Makhani)', 'classic-butter-chicken', 'Tandoori chicken submerged in satin tomato-cashew gravy with kasoori methi.', 38900, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80', 'non-veg', 1, '{"All-Time Favorite","Bestseller"}', true, true, 4),
('prod-chicken-dum-biryani', 'cat-biryanis', 'Awadhi Chicken Dum Biryani', 'awadhi-chicken-dum-biryani', 'Aged basmati rice cooked on sealed handi with chicken, mint, and pure saffron.', 36900, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', 'non-veg', 2, '{"Chef Special","Bestseller"}', true, true, 5),
('prod-garlic-naan', 'cat-breads', 'Butter Garlic Naan', 'butter-garlic-naan', 'Leavened bread baked in tandoor with minced garlic, coriander and butter.', 8500, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', 'veg', 0, '{"Popular"}', true, true, 6)
ON CONFLICT (id) DO NOTHING;

-- Product Variants
INSERT INTO public.product_variants (id, product_id, name, price_delta, is_required, display_order) VALUES
('var-tc-half', 'prod-tandoori-chicken', 'Half (4 Pcs)', 0, true, 1),
('var-tc-full', 'prod-tandoori-chicken', 'Full (8 Pcs)', 27000, true, 2),
('var-bc-bone', 'prod-butter-chicken', 'With Bone', 0, true, 1),
('var-bc-boneless', 'prod-butter-chicken', '100% Boneless Chicken Breast', 4000, true, 2),
('var-cb-regular', 'prod-chicken-dum-biryani', 'Regular (Serves 1-2)', 0, true, 1),
('var-cb-pot', 'prod-chicken-dum-biryani', 'Handi Feast (Serves 3-4)', 31000, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, max_discount, min_order_value, starts_at, expires_at, usage_limit, usage_count, is_active, description) VALUES
('coup-welcome50', 'WELCOME50', 'percentage', 50, 10000, 24900, '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z', 10000, 423, true, '50% OFF up to ₹100 on orders above ₹249'),
('coup-feast150', 'FEAST150', 'fixed', 15000, NULL, 69900, '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z', 5000, 184, true, 'Flat ₹150 OFF on family & group feasts above ₹699'),
('coup-tandoor20', 'TANDOOR20', 'percentage', 20, 12000, 39900, '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z', 8000, 512, true, '20% OFF up to ₹120 on delicious Biryanis & Curries')
ON CONFLICT (id) DO NOTHING;
