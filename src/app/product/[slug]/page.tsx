'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { trackViewContent, trackAddToCart } from '@/lib/metaPixel';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const product = getProductBySlug(slug);

  const { addToCart, buyNow } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'contents' | 'transit' | null>('contents');

  // Live viewers
  const [viewers, setViewers] = useState(0);
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 15) + 22);
    const interval = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(12, Math.min(45, v + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!product) {
    notFound();
  }

  const images = product.images;

  // Meta Pixel: ViewContent
  useEffect(() => {
    trackViewContent({
      contentName: product.name,
      contentId: product.id,
      contentType: 'product',
      value: product.price
    });
  }, [product.id, product.name, product.price]);

  const handleAddToCart = (qty: number = quantity) => {
    addToCart(product, qty);
    trackAddToCart({
      contentName: product.name,
      contentId: product.id,
      contentType: 'product',
      value: product.price * qty
    });
  };

  const handleBuyNow = () => {
    buyNow(product, quantity);
    trackAddToCart({
      contentName: product.name,
      contentId: product.id,
      contentType: 'product',
      value: product.price * quantity
    });
    router.push('/checkout');
  };

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % images.length);
  const prevSlide = () => setCurrentSlide((s) => (s - 1 + images.length) % images.length);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Trust Bar */}
      <div className="trust-bar">
        <span className="trust-bar-item">
          <Truck size={14} /> Free Shipping
        </span>
        <span className="trust-bar-item">
          <ShieldCheck size={14} /> Replacement Guarantee
        </span>
        <span className="trust-bar-item">
          COD Available
        </span>
      </div>

      <div className="container" style={{ paddingTop: '1rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/" style={{
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            textDecoration: 'none',
            fontSize: '0.82rem'
          }}>
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        {/* Product Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* IMAGE SLIDESHOW */}
          <div style={{ maxWidth: '550px', margin: '0 auto', width: '100%' }}>
            <div className="slideshow-container">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="slideshow-image"
                  style={{ opacity: currentSlide === idx ? 1 : 0 }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, 550px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}

              {images.length > 1 && (
                <>
                  <button onClick={prevSlide} className="slideshow-arrow slideshow-arrow-left" aria-label="Previous">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextSlide} className="slideshow-arrow slideshow-arrow-right" aria-label="Next">
                    <ChevronRight size={20} />
                  </button>
                  <div className="slideshow-dots">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        className={`slideshow-dot ${currentSlide === idx ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Discount badge */}
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'var(--crimson-royal)',
                color: '#FFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                zIndex: 5
              }}>
                SAVE {product.discountPercentage}%
              </span>

              {/* Image counter */}
              <span style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.5)',
                color: '#FFF',
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                zIndex: 5
              }}>
                {currentSlide + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div style={{ maxWidth: '550px', margin: '0 auto', width: '100%' }}>
            {/* Live viewers */}
            <div className="live-indicator" style={{ marginBottom: '0.65rem' }}>
              <span className="live-dot" />
              <span>{viewers} people viewing this</span>
            </div>

            {/* Category pill */}
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.4rem'
            }}>
              {product.category === 'bundle' ? 'BESTSELLER - CURATED HAMPER' : product.category.toUpperCase()}  |  {product.piecesCount} PIECES
            </span>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              fontWeight: 800
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
              <span style={{
                background: 'rgba(139, 24, 24, 0.08)',
                color: 'var(--crimson-royal)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.2rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Trust badges row */}
            <div className="trust-badges" style={{ marginBottom: '1.25rem' }}>
              <div className="trust-badge">
                <span className="trust-badge-icon">💵</span>
                <span className="trust-badge-label">Cash on Delivery</span>
                <span className="trust-badge-sub">Pay at doorstep</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge-icon">🚚</span>
                <span className="trust-badge-label">Free Shipping</span>
                <span className="trust-badge-sub">Express pan-India</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge-icon">🔄</span>
                <span className="trust-badge-label">Free Replacement</span>
                <span className="trust-badge-sub">If damaged in transit</span>
              </div>
            </div>

            {/* Dispatch info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 0.85rem',
              background: 'var(--bg-surface-warm)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              fontSize: '0.82rem'
            }}>
              <Truck size={16} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
              <span><strong>Dispatches within 24 hours.</strong> Delivery before Dhanteras guaranteed.</span>
            </div>

            {/* Upsell for individual products */}
            {product.category !== 'bundle' && (
              <Link
                href={`/product/${PRODUCTS[0].slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.85rem',
                  background: 'var(--gold-tint)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  textDecoration: 'none',
                  color: 'var(--text-dark)',
                  fontSize: '0.82rem'
                }}
              >
                <span>Get this + 3 more sets (52 pcs) for just <strong>₹1,699</strong></span>
                <ChevronRight size={16} />
              </Link>
            )}

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-body)' }}>Qty:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-dark)'
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-dark)'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <button
                onClick={handleBuyNow}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800 }}
              >
                BUY NOW — ₹{product.price * quantity}
              </button>
              <button
                onClick={() => handleAddToCart(quantity)}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}
              >
                Add to Bag
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Cash on Delivery available. Free shipping across India.
              </p>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-body)',
              lineHeight: 1.65,
              marginBottom: '1.5rem'
            }}>
              {product.tagline}
            </p>

            {/* Features */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Highlights
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {product.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
                    <CheckCircle2 size={15} color="var(--crimson-royal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.45 }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'contents' ? null : 'contents')}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Package size={15} /> What&apos;s in the Box ({product.piecesCount} pcs)
                  </span>
                  <ChevronDown size={15} style={{ transform: openAccordion === 'contents' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {openAccordion === 'contents' && (
                  <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                      {product.packageDetails.contents.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'transit' ? null : 'transit')}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={15} /> Packaging & Replacement Policy
                  </span>
                  <ChevronDown size={15} style={{ transform: openAccordion === 'transit' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {openAccordion === 'transit' && (
                  <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.6, marginTop: '0.65rem' }}>
                      Every item is wrapped in shockproof bubble air cushions. If any piece arrives damaged, message our support with a photo and we will immediately dispatch a free replacement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-mobile-cta">
        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>
            COD Available
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            ₹{product.price * quantity}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleAddToCart(quantity)}
            className="btn-secondary"
            style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', minHeight: '40px' }}
          >
            + Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="btn-primary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.82rem', minHeight: '40px' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
