'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    total,
    couponCode
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(28, 8, 8, 0.65)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div onClick={() => setIsCartOpen(false)} style={{ flex: 1 }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--bg-festive)',
        borderLeft: '1.5px solid var(--gold-border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(31, 10, 10, 0.25)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <span>Your Festive Bag</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--crimson-royal)', fontWeight: 800 }}>({items.length})</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Free Pan-India Express Delivery</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1.5px solid var(--gold-radiant)',
                margin: '0 auto 1.25rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--crimson-royal)',
                background: 'var(--gold-tint)'
              }}>
                <Tag size={26} strokeWidth={1.8} />
              </div>
              <h4 style={{ color: 'var(--text-dark)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 800 }}>Your Bag is Empty</h4>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Select an authentic handcrafted collection to begin your Deepavali preparation.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                Explore Collections
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0, borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                    <Image src={product.images[0]} alt={product.name} fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        color: 'var(--text-dark)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textDecoration: 'none'
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <span style={{ color: 'var(--crimson-royal)', fontWeight: 800, fontSize: '1rem' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.82rem' }}>
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-festive)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '2px'
                      }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dark)',
                            width: '26px',
                            height: '26px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 0.65rem', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dark)',
                            width: '26px',
                            height: '26px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--gold-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <ShieldCheck size={20} color="var(--crimson-royal)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--crimson-royal)' }}>Pre-Dhanteras Guarantee:</strong> Encased in protective multi-layer bubble cushioning. Free replacement if damaged in transit.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--gold-tint)',
              border: '1px solid var(--gold-radiant)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.6rem 0.85rem',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--crimson-royal)' }}>
                <Tag size={15} />
                <span>Coupon Applied: <strong>{couponCode}</strong></span>
              </div>
              <span style={{ color: 'var(--crimson-royal)', fontWeight: 800 }}>-₹{discount}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--crimson-royal)' }}>
                  <span>Festive Coupon Savings</span>
                  <span style={{ fontWeight: 700 }}>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Express Courier Shipping</span>
                <span style={{ color: 'var(--crimson-royal)', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--text-dark)',
                fontSize: '1.25rem',
                fontWeight: 800,
                marginTop: '0.5rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--crimson-royal)' }}>₹{total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.92rem', padding: '1rem', textAlign: 'center' }}
            >
              <span>Proceed to Express Checkout</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
