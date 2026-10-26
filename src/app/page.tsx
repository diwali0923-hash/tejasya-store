'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle2,
  ArrowRight,
  Flame,
  Gift,
  Clock,
  HeartHandshake
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '3.5rem 0 4.5rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            {/* Left: Editorial Copy */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="artisan-pill">
                  <Sparkles size={13} color="var(--terracotta)" />
                  <span>Diwali 2026 Artisan Series</span>
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                fontWeight: 700
              }}>
                Where Sacred Tradition Meets <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Artisanal Warmth</span>
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                Handcrafted terracotta deepaks, jewel-toned smokeless candles, and grand mandir collections — sculpted to fill your home with auspicious light.
              </p>

              {/* 4 Trust Points */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.85rem',
                marginBottom: '2.25rem',
                maxWidth: '480px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={18} color="var(--terracotta)" style={{ flexShrink: 0 }} />
                  <span>Shatter-Proof Packaging</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Truck size={18} color="var(--terracotta)" style={{ flexShrink: 0 }} />
                  <span>Free Express Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Star size={18} color="var(--haldi-amber)" fill="var(--haldi-amber)" style={{ flexShrink: 0 }} />
                  <span>4.9/5 (14,200+ Homes Lit)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Flame size={18} color="var(--terracotta)" style={{ flexShrink: 0 }} />
                  <span>100% Smokeless Gel</span>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#collections" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                  <span>Shop Curated Collections</span>
                  <ArrowRight size={17} />
                </a>
                <a href="#why-tejasya" className="btn-secondary">
                  <span>Our Heritage Story</span>
                </a>
              </div>

              {/* Stock Notice */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.75rem',
                padding: '0.55rem 0.95rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-antique)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--terracotta)'
              }}>
                <Clock size={15} />
                <span><strong>Pre-Diwali Dispatch:</strong> Order today for guaranteed arrival before Dhanteras.</span>
              </div>
            </div>

            {/* Right: Featured Hamper Showcase */}
            <div>
              <div
                className="artisan-card"
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  padding: '0.85rem'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  <Image
                    src="/images/shubh_box.jpg"
                    alt="The Shubh Deepavali 66-Piece Artisanal Lighting Collection"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 550px"
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--crimson-royal)',
                    color: '#fff',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(122, 30, 34, 0.3)'
                  }}>
                    SAVE 55%
                  </span>
                </div>

                <div style={{ padding: '1.25rem 0.5rem 0.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>The Shubh Deepavali 66-Piece Set</h3>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--crimson-royal)' }}>₹1,499</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹3,299</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    24 Handpainted Diyas + 12 Jewel Glass Gel Candles + 30 Smokeless LED Tealights
                  </p>
                  <button
                    onClick={() => addToCart(PRODUCTS[0])}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.9rem' }}
                  >
                    <span>Add to Bag — Instant Dispatch</span>
                    <Gift size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PRODUCTS CATALOG */}
      <section id="collections" style={{ padding: '4rem 0', background: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="artisan-pill" style={{ marginBottom: '0.75rem' }}>
              <Flame size={13} color="var(--terracotta)" />
              <span>THE 2026 FESTIVE COLLECTION</span>
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              fontWeight: 700
            }}>
              Curated Festive <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Illuminations</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Crafted for modern homes that celebrate heritage. Every piece is wrapped in shatter-proof bubble air cushions to guarantee zero-breakage arrival.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2rem'
          }}>
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="artisan-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    display: 'block'
                  }}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-antique)',
                    color: 'var(--text-primary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    {product.category === 'bundle' ? '✨ Best Value Set' : product.category}
                  </span>

                  <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'var(--crimson-royal)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    SAVE {product.discountPercentage}%
                  </span>
                </Link>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--haldi-amber)' }}>
                      <Star size={14} fill="var(--haldi-amber)" />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount})</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {product.piecesCount} Pieces
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      textDecoration: 'none',
                      lineHeight: 1.3
                    }}
                  >
                    {product.name}
                  </Link>

                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.tagline}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '1.25rem'
                  }}>
                    <ShieldCheck size={14} color="var(--terracotta)" style={{ flexShrink: 0 }} />
                    <span>Multi-layer bubble transit packaging</span>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--forest-green)', fontWeight: 700 }}>
                        Free Delivery
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="btn-secondary"
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 4 PILLARS */}
      <section id="why-tejasya" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <span className="artisan-pill" style={{ marginBottom: '0.75rem' }}>
              <HeartHandshake size={13} color="var(--terracotta)" />
              <span>THE TEJASYA DIFFERENCE</span>
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              Sacred Sanctity, <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Zero Compromise</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Why thousands of discerning Indian households choose Tejasya for their festive illumination.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="artisan-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🏺</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Rural Clay Potter Karigars</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Every single terracotta diya is hand-thrown and kiln-fired by artisan pottery clusters across Rajasthan & Uttar Pradesh, carrying authentic blessings.
              </p>
            </div>

            <div className="artisan-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>100% Smokeless Crystal Gel</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Our jewel glass gel candles burn with zero soot and zero black smoke, keeping modern apartment walls and ceilings spotless.
              </p>
            </div>

            <div className="artisan-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Shatter-Proof Transit Guarantee</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Earthen pottery is delicate. We use multi-layer bubble wrap cushions. In the rare case of any breakage, we dispatch an instant free replacement.
              </p>
            </div>

            <div className="artisan-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Express Courier Dispatch</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                All orders dispatch within 24 hours via express logistics partners with live SMS/WhatsApp tracking for pre-Dhanteras peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED REVIEWS */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="artisan-pill" style={{ marginBottom: '0.75rem' }}>
              <Star size={13} color="var(--haldi-amber)" fill="var(--haldi-amber)" />
              <span>VERIFIED BUYERS</span>
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', fontWeight: 700 }}>
              Illuminating Homes <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Across India</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="artisan-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--haldi-amber)', marginBottom: '0.75rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--haldi-amber)" />
                ))}
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                &ldquo;Ordered the 66-Piece Shubh Deepavali set for my Gurgaon apartment. The gel candles looked like glowing jewels during Lakshmi Pooja! Not a single Diya was broken thanks to the thick bubble packaging.&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Pooja Sharma, Gurgaon</span>
              </div>
            </div>

            <div className="artisan-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--haldi-amber)', marginBottom: '0.75rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--haldi-amber)" />
                ))}
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                &ldquo;The handpainted mitti diyas with gold borders are so stunning. My balcony looked like a royal courtyard. Also loved that cotton wicks were already included!&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Aditya Kulkarni, Pune</span>
              </div>
            </div>

            <div className="artisan-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--haldi-amber)', marginBottom: '0.75rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--haldi-amber)" />
                ))}
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                &ldquo;The 112-Piece Mandir Kit was an absolute lifesaver. Usually on Diwali night we run out of tealights and oil diyas. This kit covered our entire 3BHK and rangoli with lights to spare!&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Meera Nambiar, Bengaluru</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STICKY MOBILE CTA BAR */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--crimson-royal)', display: 'block', fontWeight: 700 }}>
            🪔 SHUBH DEEPAVALI OFFER
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            From ₹499 • Free Delivery
          </span>
        </div>
        <a href="#collections" className="btn-primary" style={{ padding: '0.65rem 1.35rem', fontSize: '0.85rem' }}>
          <span>Shop Now</span>
          <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}
