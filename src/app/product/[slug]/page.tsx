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
    <div style={{ padding: '2.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
          <Link href="/" style={{ color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Catalog
          </Link>
          <span style={{ color: 'var(--color-muted)' }}>/</span>
          <span style={{ color: 'var(--color-dark)', fontWeight: 500 }}>{product.name}</span>
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
              className="editorial-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                marginBottom: '1rem',
                background: 'var(--color-surface)'
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
                background: 'var(--color-dark)',
                color: 'var(--color-light)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase'
              }}>
                Save {product.discountPercentage}%
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
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--color-dark)' : '1px solid var(--color-border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <Image src={img} alt="" fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Dispatch & Packaging Notice */}
            <div className="editorial-card" style={{
              padding: '1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <ShieldCheck size={22} color="var(--color-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--color-dark)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                  Transit Protection & Packaging
                </h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {product.packageDetails.packagingNotice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="editorial-pill">
                {product.category === 'bundle' ? 'Curated Collection' : product.category.toUpperCase()}
              </span>

              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                {product.reviewCount} Verified Orders
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
              color: 'var(--color-dark)',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.03em'
            }}>
              {product.name}
            </h1>

            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.tagline}
            </p>

            {/* Price Row */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              padding: '1.1rem 0',
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '1.75rem'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '1.05rem', color: 'var(--color-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
              <span style={{
                background: 'var(--color-dark)',
                color: 'var(--color-light)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.04em'
              }}>
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Dispatch Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.75rem 1rem',
              marginBottom: '1.75rem',
              fontSize: '0.82rem',
              color: 'var(--color-dark)'
            }}>
              <Clock size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Immediate Dispatch:</strong> {product.packageDetails.dispatchTime}
              </div>
            </div>

            {/* Specifications / Highlights */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--color-dark)', fontSize: '0.82rem', marginBottom: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Specifications & Inclusions
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--color-dark)' }}>
                    <CheckCircle2 size={15} color="var(--color-dark)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ lineHeight: 1.45 }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>QUANTITY:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '2px'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-dark)',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 600, color: 'var(--color-dark)', fontSize: '0.9rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-dark)',
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
                  style={{ padding: '0.95rem', fontSize: '0.82rem' }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ padding: '0.95rem', fontSize: '0.82rem' }}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="editorial-card" style={{ overflow: 'hidden' }}>
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
                    color: 'var(--color-dark)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={16} color="var(--color-dark)" /> Included Pieces ({product.piecesCount} Total)
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'contents' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'contents' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                      {product.packageDetails.contents.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="editorial-card" style={{ overflow: 'hidden' }}>
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
                    color: 'var(--color-dark)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="var(--color-dark)" /> Break-Safe Transit Packaging
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'transit' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {openAccordion === 'transit' && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.6, marginTop: '0.75rem' }}>
                      Earthen clay and molded glass require specialized handling. All items are individually wrapped in cellular air cushioning. In the unexpected event of transit damage, our support team immediately dispatches a replacement parcel upon receiving parcel delivery confirmation.
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
          <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', display: 'block', letterSpacing: '0.04em' }}>
            {product.discountPercentage}% SAVINGS
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-dark)' }}>
            ₹{product.price}
          </span>
        </div>
        <button
          onClick={handleBuyNow}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
