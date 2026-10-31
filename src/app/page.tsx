'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Star, Truck, ShieldCheck, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { trackAddToCart } from '@/lib/metaPixel';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const featuredProduct = PRODUCTS[0]; // 52-piece collection
  const otherProducts = PRODUCTS.slice(1);

  // Live viewers simulation
  const [viewers, setViewers] = useState(0);
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 28);
    const interval = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(18, Math.min(55, v + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Hero slideshow for featured product
  const [heroSlide, setHeroSlide] = useState(0);
  const heroImages = featuredProduct.images;

  const nextSlide = () => setHeroSlide((s) => (s + 1) % heroImages.length);
  const prevSlide = () => setHeroSlide((s) => (s - 1 + heroImages.length) % heroImages.length);

  // Auto-advance hero slideshow
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div>
      {/* TRUST BAR */}
      <div className="trust-bar">
        <span className="trust-bar-item">
          <Truck size={14} /> Free Express Shipping
        </span>
        <span className="trust-bar-item">
          <ShieldCheck size={14} /> 100% Replacement Guarantee
        </span>
        <span className="trust-bar-item">
          COD Available
        </span>
      </div>

      {/* HERO: Featured Product Showcase */}
      <section style={{ padding: '2rem 0 0 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Image Slideshow -- links to product page */}
            <Link href={`/product/${featuredProduct.slug}`} style={{ display: 'block', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
              <div className="slideshow-container">
                {heroImages.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: heroSlide === idx ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: heroSlide === idx ? 'auto' : 'none'
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${featuredProduct.name} - Image ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 600px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}

                {heroImages.length > 1 && (
                  <>
                    <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="slideshow-arrow slideshow-arrow-left" aria-label="Previous image">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="slideshow-arrow slideshow-arrow-right" aria-label="Next image">
                      <ChevronRight size={20} />
                    </button>
                    <div className="slideshow-dots">
                      {heroImages.map((_, idx) => (
                        <button
                          key={idx}
                          className={`slideshow-dot ${heroSlide === idx ? 'active' : ''}`}
                          onClick={(e) => { e.preventDefault(); setHeroSlide(idx); }}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Save badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--crimson-royal)',
                  color: '#FFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  zIndex: 5,
                  letterSpacing: '0.03em'
                }}>
                  SAVE {featuredProduct.discountPercentage}%
                </span>
              </div>
            </Link>

            {/* Product Info */}
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              {/* Live viewers */}
              <div className="live-indicator" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
                <span className="live-dot" />
                <span>{viewers} people viewing this right now</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                marginBottom: '0.5rem',
                fontWeight: 800,
                lineHeight: 1.15
              }}>
                {featuredProduct.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#D4AF37' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{featuredProduct.rating}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({featuredProduct.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                  ₹{featuredProduct.price}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{featuredProduct.originalPrice}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Inclusive of all taxes. Free delivery.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button
                  onClick={() => {
                    buyNow(featuredProduct, 1);
                    router.push('/checkout');
                  }}
                  className="btn-primary"
                  style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 800, minWidth: '220px' }}
                >
                  BUY NOW — ₹{featuredProduct.price}
                </button>
                <button
                  onClick={() => {
                    addToCart(featuredProduct);
                    trackAddToCart({ contentName: featuredProduct.name, contentId: featuredProduct.id, contentType: 'product', value: featuredProduct.price });
                  }}
                  className="btn-secondary"
                  style={{ padding: '1rem 2rem' }}
                >
                  Add to Bag
                </button>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Cash on Delivery available. Ships within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section">
        <div className="container" style={{ maxWidth: '650px' }}>
          <h2 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700 }}>
            52 Pieces Inside the Box
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { count: '6', name: 'Jaipur Blue Pottery Ceramic Diyas', detail: 'Reusable glazed stoneware' },
              { count: '24', name: 'Handpainted Mitti Diyas', detail: '4 colors with gold beaded rim' },
              { count: '12', name: 'Jewel Glass Gel Candles', detail: '100% smokeless, 6+ hrs burn' },
              { count: '10', name: 'Floral Lotus Wax Diyas', detail: 'Handcrafted, ready to light' },
            ].map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{
                  background: 'var(--crimson-royal)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.count}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
              </div>
            ))}
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              + Free cotton wicks included
            </p>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={{ padding: '0 0 3rem 0' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            textAlign: 'center'
          }}>
            {[
              { icon: '🏺', title: 'Handcrafted', desc: 'By rural Indian artisans' },
              { icon: '📦', title: 'Bubble-Wrapped', desc: 'Zero breakage guaranteed' },
              { icon: '🚚', title: '24hr Dispatch', desc: 'Pre-Dhanteras delivery' },
            ].map((item) => (
              <div key={item.title} style={{
                padding: '1.25rem 0.5rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.15rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS GRID */}
      <section id="collections" className="section" style={{ background: 'var(--bg-surface-warm)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 800, marginBottom: '0.4rem' }}>
              All Festive Collections
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Handcrafted diyas, candles, and lighting sets for every corner of your home
            </p>
          </div>

          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-card-image">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {product.category === 'bundle' && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'var(--crimson-royal)',
                      color: '#FFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      zIndex: 2
                    }}>
                      BESTSELLER
                    </span>
                  )}
                </div>
                <div className="product-card-body">
                  <div style={{ display: 'flex', gap: '2px', color: '#D4AF37', marginBottom: '0.3rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>
                      ({product.reviewCount})
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: '0.35rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                      ₹{product.price}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {product.piecesCount} pieces  |  COD available
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '1.75rem', fontWeight: 700 }}>
            What Our Customers Say
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'Pooja S.', city: 'Gurgaon', text: 'The gel candles looked like glowing jewels during Lakshmi Pooja. Every single diya arrived intact. Absolutely love it.' },
              { name: 'Aditya K.', city: 'Pune', text: 'My balcony looked like a royal temple courtyard. The gold borders on the mitti diyas are stunning. Will order again next year.' },
              { name: 'Meera N.', city: 'Bengaluru', text: 'Covered our main entrance, flower rangoli, and living room effortlessly. Best Diwali purchase we made this year.' },
            ].map((review) => (
              <div key={review.name} style={{
                padding: '1.25rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', gap: '2px', color: '#D4AF37', marginBottom: '0.65rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {review.name} — {review.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
            52-Piece Collection
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            ₹{featuredProduct.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{featuredProduct.originalPrice}</span>
          </span>
        </div>
        <button
          onClick={() => {
            buyNow(featuredProduct, 1);
            router.push('/checkout');
          }}
          className="btn-primary"
          style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
        >
          Buy Now — COD
        </button>
      </div>
    </div>
  );
}
