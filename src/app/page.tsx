'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div>
      {/* 1. HERO SECTION (MINIMALIST EDITORIAL) */}
      <section style={{
        position: 'relative',
        padding: '4rem 0 5rem 0',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left: Copy */}
            <div>
              <div style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '1rem',
                fontWeight: 600
              }}>
                Artisanal Festival Illumination
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 1.1,
                color: 'var(--color-dark)',
                marginBottom: '1.5rem',
                fontWeight: 500
              }}>
                Sacred light, sculpted by hand.
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'var(--color-muted)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '520px'
              }}>
                Hand-thrown terracotta deepaks, jewel-toned clean-burning candles, and complete mandir collections. Crafted for homes that appreciate quiet sacred luxury.
              </p>

              {/* Factual Dispatch Notice (No filler badges) */}
              <div style={{
                borderLeft: '2px solid var(--color-dark)',
                paddingLeft: '1rem',
                marginBottom: '2.5rem',
                fontSize: '0.85rem',
                color: 'var(--color-dark)',
                lineHeight: 1.5
              }}>
                <strong>Diwali Rush Guarantee:</strong> Orders dispatch within 24 hours via express couriers. Each piece is encased in multi-layer bubble cushioning for zero transit damage.
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#collections" className="btn-primary">
                  <span>Explore Collections</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right: Featured Hamper */}
            <div>
              <div
                className="editorial-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '1rem'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  overflow: 'hidden'
                }}>
                  <Image
                    src="/images/shubh_box.png"
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
                    background: 'var(--color-dark)',
                    color: 'var(--color-light)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    Featured Set
                  </span>
                </div>

                <div style={{ padding: '1.25rem 0.5rem 0.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark)' }}>The Shubh Deepavali 66-Piece Set</h3>
                    <div>
                      <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-dark)' }}>₹1,499</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹3,299</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                    24 Handpainted Diyas, 12 Jewel Glass Gel Candles, and 30 Smokeless LED Tealights
                  </p>
                  <button
                    onClick={() => addToCart(PRODUCTS[0])}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.9rem' }}
                  >
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PRODUCTS CATALOG */}
      <section id="collections" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: 600
            }}>
              Curated Edition
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
              color: 'var(--color-dark)',
              marginBottom: '0.75rem',
              fontWeight: 500
            }}>
              The 2026 Collection
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Crafted in collaboration with rural pottery artisans. Wrapped in shock-absorbing bubble air cushions to guarantee flawless arrival.
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
                className="editorial-card"
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
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-dark)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    {product.category === 'bundle' ? 'Grand Set' : product.category}
                  </span>
                </Link>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-dark)' }}>
                      <Star size={13} fill="currentColor" />
                      <span style={{ fontWeight: 600 }}>{product.rating}</span>
                      <span style={{ color: 'var(--color-muted)' }}>({product.reviewCount})</span>
                    </div>
                    <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>
                      {product.piecesCount} Pieces
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    style={{
                      color: 'var(--color-dark)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      textDecoration: 'none',
                      lineHeight: 1.3
                    }}
                  >
                    {product.name}
                  </Link>

                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.tagline}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-dark)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        Free Express Shipping
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="btn-secondary"
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.78rem' }}
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{ padding: '0.65rem 0.5rem', fontSize: '0.78rem' }}
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

      {/* 3. CRAFT & INTEGRITY (CONCISE, NO FILLER) */}
      <section id="why-tejasya" style={{
        padding: '5rem 0',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem' }}>
                01 • Material Sanctity
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Generational Clay Potter Clusters</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Every earthen diya is hand-thrown on wheels and kiln-fired by artisanal pottery families across Rajasthan and Uttar Pradesh.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem' }}>
                02 • Modern Interior Care
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>100% Smokeless Crystal Gel</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Formulated with high-clarity translucent wax that burns without soot or black smoke, keeping apartment ceilings and interior walls pristine.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem' }}>
                03 • Safe Logistics
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Reinforced Bubble Cushioning</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Earthen pottery and glass are encased in shock-absorbing air cushions. In the rare event of transit breakage, we dispatch immediate replacements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED CLIENT REVIEWS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem' }}>
              Verified Client Notes
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-dark)', fontWeight: 500 }}>
              Illuminating Spaces Across India
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-dark)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--color-dark)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;Ordered the 66-Piece Shubh Deepavali set for my Gurgaon apartment. The gel candles looked like glowing jewels during Lakshmi Pooja, and not a single piece chipped in transit.&rdquo;
              </p>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pooja Sharma • Gurgaon
              </div>
            </div>

            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-dark)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--color-dark)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;The handpainted mitti diyas with gold borders are so stunning. My balcony looked like a royal courtyard. Appreciated the cotton wicks included in the box.&rdquo;
              </p>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Aditya Kulkarni • Pune
              </div>
            </div>

            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-dark)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: 'var(--color-dark)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                &ldquo;The 112-Piece Mandir Kit was an absolute lifesaver. On Diwali night we usually run out of oil diyas. This covered our entrance, living room, and rangoli with ease.&rdquo;
              </p>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Meera Nambiar • Bengaluru
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STICKY MOBILE CTA */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block' }}>
            Diwali Edition
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            From ₹499 • Free Express Delivery
          </span>
        </div>
        <a href="#collections" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}>
          <span>Shop</span>
        </a>
      </div>
    </div>
  );
}
