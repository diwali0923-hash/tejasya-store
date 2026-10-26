'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ArrowRight, Star, Clock, ShieldCheck, CheckCircle2, Sparkles, Truck } from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const featuredProduct = PRODUCTS[0]; // 66-piece hamper

  return (
    <div style={{ background: 'var(--bg-festive)' }}>
      {/* 1. FULL-BLEED MOBILE & DESKTOP HERO SECTION */}
      <section className="mobile-hero-wrapper">
        {/* Full-Bleed Background Image */}
        <Image
          src="/images/hero_cover.png"
          alt="Tejasya Handcrafted Earthen Festive Diyas and Ghee Flame Illumination"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* Ambient Warm Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Seamless Bottom Gradient Blend (Eliminates the sharp cutoff) */}
        <div className="hero-blend-bottom" />

        {/* Hero Content Overlay */}
        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: '820px', margin: '0 auto 0 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="festive-pill-gold">
              <Sparkles size={13} color="var(--crimson-royal)" />
              <span>LIMITED DIWALI 2026 EDITION</span>
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.25rem)',
            lineHeight: 1.08,
            color: '#FFFFFF',
            marginBottom: '1.25rem',
            fontWeight: 800,
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)'
          }}>
            Sacred Light, Hand-Sculpted for Your Home
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            color: '#FDF6E2',
            lineHeight: 1.55,
            marginBottom: '2rem',
            maxWidth: '620px',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)'
          }}>
            Handcrafted mitti diyas, smokeless jewel gel candles, and grand mandir illumination sets. Bring authentic festive radiance to your home without cheap plastic or toxic soot.
          </p>

          {/* Factual Dispatch Urgency Badge */}
          <div style={{
            background: 'rgba(31, 10, 10, 0.88)',
            border: '1.5px solid var(--gold-radiant)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.85rem 1.25rem',
            marginBottom: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            maxWidth: '600px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
          }}>
            <Truck size={22} color="var(--gold-bright)" style={{ flexShrink: 0 }} />
            <div style={{ color: '#FFFFFF', fontSize: '0.88rem', lineHeight: 1.45 }}>
              <strong style={{ color: '#FFE082', display: 'block' }}>Pre-Dhanteras Dispatch Guarantee:</strong>
              Dispatches within 24 hours via express air couriers. Every piece encased in bubble cushions.
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href={`/product/${featuredProduct.slug}`}
              className="btn-gold"
              style={{ fontSize: '0.95rem', padding: '1.1rem 2.25rem' }}
            >
              <span>Get 66-Piece Hamper — ₹1,499</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#collections"
              className="btn-secondary"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.65)',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(6px)',
                padding: '1.05rem 1.85rem'
              }}
            >
              <span>Explore All 4 Sets</span>
            </a>
          </div>

          {/* Quick Pillars in Warm Gold */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
            color: '#F5C542',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> 100% Pure Terracotta Clay
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> Smokeless Clean Gel Wax
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> Zero-Breakage Assurance
            </span>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BESTSELLER SHOWCASE */}
      <section style={{ padding: '4.5rem 0 5rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span className="festive-pill-crimson" style={{ marginBottom: '0.75rem' }}>
              TOP SELLER FOR DIWALI 2026
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.85rem)', color: 'var(--crimson-royal)', marginBottom: '0.75rem', fontWeight: 800 }}>
              The Shubh Deepavali 66-Piece Hamper
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '1rem', lineHeight: 1.6 }}>
              A complete ceremonial lighting suite. Combines heritage handpainted earthen diyas with jewel-toned crystal gel candles and safe balcony LED tealights.
            </p>
          </div>

          <div className="festive-card" style={{
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left: Packshot Image */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)'
            }}>
              <Image
                src="/images/shubh_box.png"
                alt="The Shubh Deepavali 66-Piece Artisanal Lighting Collection"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                style={{ objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'var(--crimson-royal)',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.06em'
              }}>
                SAVE 55% TODAY
              </span>
            </div>

            {/* Right: Breakdown & Value */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
                <span style={{ fontWeight: 800, color: 'var(--text-dark)', marginLeft: '0.25rem' }}>4.9</span>
                <span style={{ color: 'var(--text-muted)' }}>(384 Verified Reviews)</span>
              </div>

              <h3 style={{ fontSize: '1.85rem', color: 'var(--text-dark)', marginBottom: '0.75rem', fontWeight: 800 }}>
                Everything You Need for Diwali Night
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                padding: '1.25rem 0',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '1.75rem'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                  ₹1,499
                </span>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹3,299
                </span>
                <span style={{
                  background: 'rgba(139, 24, 24, 0.1)',
                  color: 'var(--crimson-royal)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  You Save ₹1,800
                </span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={18} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
                  <span><strong>24 Handpainted Mitti Diyas</strong> with raised gold filigree borders</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={18} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
                  <span><strong>12 Jewel-Toned Glass Gel Candles</strong> (100% Smokeless & Long-burning)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={18} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
                  <span><strong>30 Warm-Glow LED Tealights</strong> for wind-prone balconies & flower rangolis</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={18} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
                  <span><strong>Complimentary Cotton Wicks</strong> included in the box</span>
                </li>
              </ul>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => addToCart(featuredProduct)}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '1rem', fontSize: '0.9rem' }}
                >
                  Add to Bag
                </button>
                <Link
                  href={`/product/${featuredProduct.slug}`}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', textAlign: 'center' }}
                >
                  <span>Buy Now — ₹1,499</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL 4 CURATED OFFERINGS GRID */}
      <section id="collections" style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span className="festive-pill-gold" style={{ marginBottom: '0.75rem' }}>
              OUR 4 CURATED COLLECTIONS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-dark)', marginBottom: '0.75rem', fontWeight: 800 }}>
              Handcrafted for Dhanteras & Deepavali
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '1rem', lineHeight: 1.6 }}>
              Directly sourced from generational pottery clusters. Every parcel is dispatched in shock-resistant bubble air cushions for guaranteed safe arrival.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2.5rem'
          }}>
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="festive-card"
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
                    sizes="(max-width: 768px) 100vw, 320px"
                    style={{ objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: 'var(--crimson-royal)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    letterSpacing: '0.04em'
                  }}>
                    SAVE {product.discountPercentage}%
                  </span>
                </Link>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D4AF37' }}>
                      <Star size={14} fill="currentColor" />
                      <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{product.rating}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount})</span>
                    </div>
                    <span style={{ color: 'var(--crimson-royal)', fontWeight: 700, fontSize: '0.82rem' }}>
                      {product.piecesCount} Pieces
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    style={{
                      color: 'var(--text-dark)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      textDecoration: 'none',
                      lineHeight: 1.35
                    }}
                  >
                    {product.name}
                  </Link>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.tagline}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-secondary"
                        style={{ padding: '0.75rem', fontSize: '0.82rem' }}
                      >
                        Add to Bag
                      </button>
                      <Link
                        href={`/product/${product.slug}`}
                        className="btn-primary"
                        style={{ padding: '0.75rem', fontSize: '0.82rem', textAlign: 'center' }}
                      >
                        <span>Buy Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ARTISAN CRAFT & MATERIAL SANCTITY */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, var(--bg-festive) 0%, rgba(246, 239, 227, 0.7) 50%, var(--bg-festive) 100%)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-royal)', fontWeight: 800, display: 'block', marginBottom: '0.75rem' }}>
                01 • RURAL POTTERY CLUSTERS
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>Hand-Pressed Terracotta Clay</h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every single diya is hand-thrown on potters&apos; wheels using pure earthen clay, sun-dried, and kiln-fired to withstand long burning hours with natural ghee and mustard oil.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-royal)', fontWeight: 800, display: 'block', marginBottom: '0.75rem' }}>
                02 • APARTMENT CEILING CARE
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>100% Smokeless Crystal Gel</h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Formulated with high-clarity translucent jelly gel wax that burns soot-free. Safe for modern indoor living rooms, dining tables, and mandir alcoves without wall discoloration.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-royal)', fontWeight: 800, display: 'block', marginBottom: '0.75rem' }}>
                03 • ZERO HEARTBREAK GUARANTEE
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>Reinforced Bubble Encasement</h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Earthen pottery and glassware are protected by multi-layer cellular foam cushions. If any piece chips during courier transit, we immediately dispatch a replacement parcel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CLIENT REVIEWS */}
      <section style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="festive-pill-gold" style={{ marginBottom: '0.75rem' }}>
              VERIFIED BUYER EXPERIENCES
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-dark)', fontWeight: 800 }}>
              Illuminating Homes Across India
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="festive-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#D4AF37', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;Ordered the 66-Piece Shubh Deepavali set for my Gurgaon flat. The gel candles looked like glowing jewels during Lakshmi Pooja, and every single diya arrived intact.&rdquo;
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--crimson-royal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pooja Sharma • Gurgaon
              </div>
            </div>

            <div className="festive-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#D4AF37', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;The handpainted mitti diyas with gold borders are so stunning. My balcony looked like a royal temple courtyard. Loved the included cotton wicks.&rdquo;
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--crimson-royal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Aditya Kulkarni • Pune
              </div>
            </div>

            <div className="festive-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#D4AF37', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;The 112-Piece Mandir Kit was a lifesaver. On Diwali night we usually run out of oil diyas. This covered our main entrance, flower rangoli, and living room effortlessly.&rdquo;
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--crimson-royal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Meera Nambiar • Bengaluru
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STICKY MOBILE CTA */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--crimson-royal)', display: 'block', fontWeight: 700 }}>
            DIWALI LIMITED EDITION
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            From ₹499 • Free Delivery
          </span>
        </div>
        <a href="#collections" className="btn-primary" style={{ padding: '0.75rem 1.35rem', fontSize: '0.85rem' }}>
          <span>Shop Now</span>
        </a>
      </div>
    </div>
  );
}
