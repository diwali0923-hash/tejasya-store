'use client';

import React, { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

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
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowLeft size={14} /> Back to Collections
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
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
              className="artisan-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                marginBottom: '1rem'
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
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)'
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
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--crimson-royal)' : '1px solid var(--border-antique)',
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIndex === idx ? 1 : 0.7
                    }}
                  >
                    <Image src={img} alt="" fill sizes="70px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Transit Protection Notice */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-antique)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <ShieldCheck size={26} color="var(--terracotta)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  🛡️ {product.packageDetails.transitAssurance}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {product.packageDetails.packagingNotice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="artisan-pill">
                ✨ {product.category === 'bundle' ? 'Curated Festive Hamper' : product.category}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--haldi-amber)', fontSize: '0.85rem' }}>
                <Star size={15} fill="var(--haldi-amber)" />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount} Reviews)</span>
              </div>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
              fontWeight: 700
            }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {product.tagline}
            </p>

            {/* Price Row */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.85rem',
              padding: '1rem 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
              <span style={{
                background: 'rgba(36, 88, 57, 0.1)',
                color: 'var(--forest-green)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                SAVE ₹{product.originalPrice - product.price} (55% OFF)
              </span>
            </div>

            {/* Dispatch Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-antique)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--terracotta)'
            }}>
              <Clock size={17} style={{ flexShrink: 0 }} />
              <div>
                <strong>Diwali Rush Guarantee:</strong> {product.packageDetails.dispatchTime}
              </div>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                COLLECTION HIGHLIGHTS
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Buy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-antique)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
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
                  style={{ padding: '1rem', fontSize: '0.95rem' }}
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ padding: '1rem', fontSize: '0.95rem' }}
                >
                  <span>Buy Now — Instant Checkout</span>
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="artisan-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'contents' ? null : 'contents')}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={17} color="var(--terracotta)" /> What’s Inside The Set ({product.piecesCount} Pieces)
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordion === 'contents' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'contents' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {product.packageDetails.contents.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="artisan-card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'transit' ? null : 'transit')}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={17} color="var(--terracotta)" /> Packaging & Breakage Replacement Policy
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openAccordion === 'transit' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'transit' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.75rem' }}>
                      We know earthen clay and glass are delicate. To ensure zero heartbreak on Diwali, every item is wrapped in shockproof bubble air cushions. In the rare event that any piece arrives damaged, simply message us on WhatsApp with a photo and we will immediately dispatch a free replacement parcel!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--crimson-royal)', display: 'block', fontWeight: 700 }}>
            SAVE {product.discountPercentage}% TODAY
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{product.price}
          </span>
        </div>
        <button
          onClick={handleBuyNow}
          className="btn-primary"
          style={{ padding: '0.65rem 1.35rem', fontSize: '0.85rem' }}
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
