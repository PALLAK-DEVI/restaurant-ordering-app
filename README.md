# The Royal Tandoor — Single-Restaurant Online Ordering Website & Staff Admin Dashboard

A production-ready, full-stack online ordering web platform designed for a single restaurant, built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Combining Domino's intuitive fast-ordering experience with Zomato's rich dish discovery and presentation, this platform supports the Indian dining market with **INR (₹)** pricing, **Veg/Non-Veg indicators**, **service pincode checks**, **coupon engines**, and **Cash on Delivery (COD) / online payments**.

---

## 🌟 Key Highlights & Capabilities

### 1. Customer Storefront
- **Home Page (`/`)**: Hero banner with appetizing photography, trust strips, category shortcuts, bestsellers, active promotions, why choose us, patron testimonials, live kitchen timings.
- **Interactive Menu (`/menu`)**: Sticky category navigation, live search, pure veg / non-veg toggles, bestseller filters, price sorting.
- **Dish Customization (`/item/[slug]` & Modals)**: Required portion sizes (Half/Full), optional accompaniments (Extra Gravy, Raita, Garlic Butter), live price calculations, special cooking instruction notes.
- **Persistent Cart (`/cart` & Slide-Over)**: Survives browser refreshes, live item steppers, free delivery progress bar, coupon validator, transparent bill breakdown (Subtotal, Packaging, 5% GST, Delivery Fee, Discount, Grand Total).
- **Checkout (`/checkout`)**: Delivery vs. Takeaway selection, delivery pincode validation against service zones, ASAP vs. scheduled delivery slots, COD and online payment simulation.
- **Confirmation & Live Tracking (`/track/[orderId]`)**: Real-time order progress timeline (`Placed → Accepted → Cooking in Tandoor → Out for Delivery → Delivered`), estimated delivery time, printable summary, and restaurant contact link.
- **Customer Account (`/account`)**: Order history with 1-click reordering, saved address book, profile details.
- **Verified Reviews (`/reviews`)**: Star ratings, patron comments, review submission gated to verified completed orders.
- **Offers & Promotions (`/offers`)**: List of active promo codes (`WELCOME50`, `FEAST150`, `TANDOOR20`) with 1-click copy-and-apply.

### 2. Staff Admin Dashboard (`/admin`)
- **Dashboard Overview (`/admin`)**: Real-time sales KPIs, average order value, pending orders count, recent orders table.
- **Live Orders Queue (`/admin/orders`)**: State machine order progression (`placed → accepted → preparing → out_for_delivery / ready_for_pickup → delivered`), with quick status advancement buttons.
- **Order Inspector & KOT (`/admin/orders/[id]`)**: Full itemized customizations, price snapshots, customer notes, status change audit trail, and a thermal-ready **Kitchen Order Ticket (KOT)** print layout (`window.print()`).
- **Menu Management (`/admin/menu`)**: Add, edit, or soft-deactivate dishes; update prices, categories, portion variants, add-ons, and instant 1-click "Sold Out" availability toggles.
- **Coupon Manager (`/admin/coupons`)**: Create promo codes with percentage or flat discounts, min order limits, discount caps, and usage tracking.
- **Review Moderation (`/admin/reviews`)**: Approve or hide customer reviews.
- **Customer Directory (`/admin/customers`)**: Lifetime customer spending, order frequency, and contact details.
- **Analytics (`/admin/analytics`)**: Delivery vs. takeaway volume share, payment method breakdown, top-grossing dishes.
- **Business Settings (`/admin/settings`)**: Live configuration for restaurant contact info, 5% GST rate, packaging fees, minimum order amounts, delivery fees, service pincodes, day-by-day operating hours, and payment gateway switches.

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ (tested on Node v24.12.0)
- **npm** or **pnpm**

### 2. Installation
Clone or navigate to the project directory:
```bash
cd restaurant-ordering-app
npm install
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- **Customer Storefront**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`
  - **Demo Admin Email**: `admin@royaltandoor.sample`
  - **Demo Password**: `admin123`

### 4. Production Build
```bash
npm run build
npm start
```

---

## 🗄️ Database Architecture (Dual-Mode)

The application features a resilient **dual-mode repository architecture**:
1. **Zero-Config Standalone Mode (Default)**: Runs immediately out of the box using a stateful, in-memory and local-storage data engine pre-loaded with realistic Indian dining sample data. All orders, menu edits, coupon changes, reviews, and settings persist across page navigations and reloads.
2. **Supabase PostgreSQL Mode**: When `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided in `.env.local`, the platform can connect directly to PostgreSQL. Full DDL schemas and seed scripts are provided in:
   - `supabase/migrations/20261110000000_init_restaurant_schema.sql`
   - `supabase/seed.sql`

---

## 💳 Payment Gateway Integration

- **Cash on Delivery (COD)**: Functional immediately for delivery and takeaway.
- **Online Payments (UPI / Cards / Net Banking)**:
  - When operating in test mode (default), the checkout simulates instant authorization without live charges.
  - For live Razorpay transactions, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`.
  - Server-side signature verification is implemented in `/api/payments/webhook/route.ts` using SHA256 HMAC.

---

## ⚠️ Sample Content Notice
All restaurant names, dishes, photos, prices, addresses, and customer reviews included in the default installation are sample demonstration data for preview and development purposes. All content and settings can be customized through the Admin Settings panel (`/admin/settings`) and Menu Manager (`/admin/menu`).
