import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800']
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'TEJASYA 🪔 | Luxury Handcrafted Diwali Diyas, Candle Hampers & Festive Decor',
  description: 'Bring the divine glow to your home with Tejasya. Handcrafted mitti diyas, smokeless jewel gel candles, and grand mandir illumination kits with guaranteed pre-Dhanteras delivery.',
  keywords: [
    'Diwali diyas',
    'gel candles',
    'handpainted clay diyas',
    'Diwali decoration kit',
    'smokeless candles',
    'festive home decor India',
    'Tejasya'
  ],
  openGraph: {
    title: 'TEJASYA 🪔 | Luxury Handcrafted Diwali Diyas & Candle Sets',
    description: 'Transform your home with authentic earthen craftsmanship and smokeless jewel light. Dispatches in 24 hours with free express delivery.',
    images: ['/images/shubh_box.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${plusJakarta.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
