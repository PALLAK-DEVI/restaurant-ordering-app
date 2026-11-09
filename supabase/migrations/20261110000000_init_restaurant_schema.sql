-- ====================================================================
-- THE ROYAL TANDOOR RESTAURANT - DATABASE SCHEMA MIGRATION
-- Relational schema for Single-Restaurant Online Ordering System
-- All currency stored as integer minor units (paise) to prevent float inaccuracies
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Customer Saved Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    line1 TEXT NOT NULL,
    line2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL DEFAULT 'Gurugram',
    state TEXT NOT NULL DEFAULT 'Haryana',
    pincode TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Products (Dishes)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    base_price INTEGER NOT NULL CHECK (base_price >= 0), -- in paise
    image_url TEXT NOT NULL,
    dietary_type TEXT NOT NULL CHECK (dietary_type IN ('veg', 'non-veg', 'vegan', 'egg')),
    spice_level SMALLINT NOT NULL DEFAULT 1 CHECK (spice_level BETWEEN 0 AND 3),
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    preparation_time_minutes INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Product Variants (Portions / Sizes)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_delta INTEGER NOT NULL DEFAULT 0, -- in paise
    is_required BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Addons & Accompaniments
CREATE TABLE IF NOT EXISTS public.addons (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0), -- in paise
    selection_group TEXT NOT NULL DEFAULT 'Accompaniments',
    min_select INTEGER DEFAULT 0,
    max_select INTEGER DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT,
    fulfilment_type TEXT NOT NULL CHECK (fulfilment_type IN ('delivery', 'pickup')),
    status TEXT NOT NULL CHECK (
        status IN ('placed', 'accepted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'rejected', 'cancelled')
    ),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'upi', 'card', 'netbanking')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    subtotal INTEGER NOT NULL,
    discount_total INTEGER NOT NULL DEFAULT 0,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    tax_total INTEGER NOT NULL DEFAULT 0,
    packaging_fee INTEGER NOT NULL DEFAULT 0,
    grand_total INTEGER NOT NULL,
    coupon_code TEXT,
    address_snapshot JSONB,
    customer_notes TEXT,
    guest_tracking_token_hash TEXT NOT NULL,
    estimated_delivery_minutes INTEGER,
    placed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Order Item Snapshots
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL,
    line_total INTEGER NOT NULL,
    variant_snapshot JSONB,
    addons_snapshot JSONB,
    item_notes TEXT
);

-- 9. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL CHECK (discount_value > 0),
    max_discount INTEGER,
    min_order_value INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER NOT NULL DEFAULT 0,
    per_customer_limit INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT NOT NULL
);

-- 10. Coupon Redemptions
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id TEXT NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    discount_amount INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Customer Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'hidden')),
    food_items_liked TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Order Status Audit History
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    note TEXT
);

-- 13. Restaurant Settings
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON public.orders(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(moderation_status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read active categories, products, and approved reviews
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view available products" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (moderation_status = 'approved');
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Customers can view/update own profiles and addresses
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Staff/Admins have full access via service-role / claims
CREATE POLICY "Staff can manage orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
);
CREATE POLICY "Staff can manage menu" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
);
