import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartDrawer } from "@/components/store/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Royal Tandoor | Authentic Indian Restaurant & Online Ordering",
  description:
    "Order authentic charcoal-grilled kebabs, rich 24-hour dal makhani, and slow-cooked dum biryani directly for home delivery or pickup.",
  keywords: ["restaurant", "food ordering", "indian food", "biryani", "tandoor", "dal makhani", "gurugram delivery"],
  openGraph: {
    title: "The Royal Tandoor | Royal Indian Delicacies",
    description: "Freshly prepared, charcoal-smoked culinary perfection delivered straight to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-canvas text-charcoal selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
