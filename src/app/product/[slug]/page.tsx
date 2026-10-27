'use client';

import React, { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  Clock,
  ArrowLeft,
  ChevronDown,
  Star,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import CollectionComparison from '@/components/CollectionComparison';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const product = getProductBySlug(slug);

  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'contents' | 'transit' | null>('contents');

  if (!product) {
    notFound();
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div style={{ padding: '2.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Catalog
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>/</span>
          <span style={{ color: 'var(--crimson-royal)', fontWeight: 700 }}>{product.name}</span>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start'
        }}>
          {/* Left Gallery */}
          <div>
            <div
              className="festive-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                marginBottom: '1rem',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
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
                letterSpacing: '0.04em',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-xs)'
              }}>
                SAVE {product.discountPercentage}%
              </span>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      position: 'relative',
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--crimson-royal)' : '1px solid var(--border-subtle)',
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <Image src={img} alt="" fill sizes="74px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Dispatch & Packaging Notice */}
            <div className="festive-card" style={{
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              gap: '1rem',
              background: 'var(--bg-surface-warm)'
            }}>
              <ShieldCheck size={24} color="var(--crimson-royal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--crimson-royal)', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Reinforced Transit Cushioning
                </h4>
                <p style={{ color: 'var(--text-body)', fontSize: '0.82rem', lineHeight: 1.55 }}>
                  {product.packageDetails.packagingNotice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="festive-pill-gold">
                {product.category === 'bundle' ? 'Curated Festive Hamper' : product.category.toUpperCase()}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.88rem' }}>
                <Star size={15} fill="currentColor" />
                <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount} Reviews)</span>
              </div>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 2.65rem)',
              color: 'var(--text-dark)',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              fontWeight: 800
            }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.tagline}
            </p>

            {/* Price Row */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem'
            }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
              <span style={{
                background: 'rgba(139, 24, 24, 0.1)',
                color: 'var(--crimson-royal)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                SAVE ₹{product.originalPrice - product.price} ({product.discountPercentage}% OFF)
              </span>
            </div>

            {/* Price Anchor Callout for Collection Box */}
            {product.category === 'bundle' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(82, 12, 12, 0.08) 0%, rgba(212, 175, 55, 0.15) 100%)',
                border: '1.5px solid var(--gold-radiant)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.1rem 1.25rem',
                marginBottom: '1.75rem',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--crimson-royal)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} /> BUNDLE SAVINGS & PRICE ANCHOR
                  </span>
                  <span style={{
                    background: '#047857',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.74rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '3px'
                  }}>
                    SAVE ₹747 EXTRA
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: 1.5 }}>
                  <div>Purchased separately: <strong style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹2,446</strong> (4 Individual Listings)</div>
                  <div style={{ marginTop: '0.25rem' }}>
                    Master Box Offer: <strong style={{ color: 'var(--crimson-royal)', fontSize: '1.15rem' }}>₹1,699</strong>
                    <span style={{ color: '#047857', fontWeight: 700, marginLeft: '0.5rem' }}>• 31% Cheaper than buying separately!</span>
                  </div>
                </div>
                <a
                  href="#collection-comparison"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.75rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--crimson-royal)',
                    textDecoration: 'underline'
                  }}
                >
                  <span>See full product comparison & savings breakdown ↓</span>
                </a>
              </div>
            )}

            {/* Upsell for Individual Products */}
            {product.category !== 'bundle' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(82, 12, 12, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)',
                border: '1.5px solid var(--gold-radiant)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.9rem 1.15rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--crimson-royal)', textTransform: 'uppercase' }}>
                    PART OF THE ROYAL DEEPOTSAV COLLECTION
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', margin: '0.2rem 0 0 0' }}>
                    Get this plus 3 more curated lighting suites (52 Pcs total) for just <strong>₹1,699</strong>.
                  </p>
                </div>
                <Link
                  href="/product/the-royal-deepotsav-52-piece-artisanal-illumination-collection"
                  className="btn-gold"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  <span>Upgrade to Box (Save ₹747)</span>
                </Link>
              </div>
            )}

            {/* Dispatch Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--gold-radiant)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.85rem 1rem',
              marginBottom: '1.75rem',
              fontSize: '0.88rem',
              color: 'var(--text-dark)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <Clock size={18} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--crimson-royal)' }}>Pre-Dhanteras Guarantee:</strong> {product.packageDetails.dispatchTime}
              </div>
            </div>

            {/* Specifications / Highlights */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--crimson-royal)', fontSize: '0.85rem', marginBottom: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>
                Specifications & Inclusions
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-body)' }}>
                    <CheckCircle2 size={16} color="var(--crimson-royal)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ lineHeight: 1.45 }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-body)', fontWeight: 600 }}>QUANTITY:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '2px'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dark)',
                      width: '34px',
                      height: '34px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.95rem', fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dark)',
                      width: '34px',
                      height: '34px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="btn-secondary"
                  style={{ padding: '1rem', fontSize: '0.9rem' }}
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ padding: '1rem', fontSize: '0.9rem' }}
                >
                  Buy Now — Instant Checkout
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="festive-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'contents' ? null : 'contents')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--text-dark)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={17} color="var(--crimson-royal)" /> What’s Inside The Set ({product.piecesCount} Pieces)
                  </span>
                  <ChevronDown
                    size={17}
                    style={{
                      transform: openAccordion === 'contents' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'contents' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                      {product.packageDetails.contents.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="festive-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'transit' ? null : 'transit')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--text-dark)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={17} color="var(--crimson-royal)" /> Packaging & Breakage Replacement Policy
                  </span>
                  <ChevronDown
                    size={17}
                    style={{
                      transform: openAccordion === 'transit' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'transit' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.6, marginTop: '0.75rem' }}>
                      Earthen clay and glass are delicate sacred crafts. Every item is wrapped in shockproof bubble air cushions. In the rare event that any piece arrives damaged, simply message our support with parcel proof and we will immediately dispatch a free replacement parcel!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Value Comparison Section for Collection Box */}
      {product.category === 'bundle' && (
        <div style={{ marginTop: '4rem' }}>
          <CollectionComparison />
        </div>
      )}

      {/* Sticky Mobile Buy Bar */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--crimson-royal)', display: 'block', fontWeight: 800 }}>
            SAVE {product.discountPercentage}% TODAY
          </span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            ₹{product.price}
          </span>
        </div>
        <button
          onClick={handleBuyNow}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.88rem' }}
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
