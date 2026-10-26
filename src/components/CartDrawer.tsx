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
      background: 'rgba(28, 22, 20, 0.6)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div onClick={() => setIsCartOpen(false)} style={{ flex: 1 }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'var(--color-light)',
        borderLeft: '1px solid var(--color-border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(18, 16, 14, 0.1)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, letterSpacing: '0.04em' }}>
              <span>Cart</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 400 }}>({items.length})</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Complimentary Express Courier</span>
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
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                margin: '0 auto 1.25rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-dark)'
              }}>
                <Tag size={24} strokeWidth={1.5} />
              </div>
              <h4 style={{ color: 'var(--color-dark)', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 500, letterSpacing: '0.04em' }}>Your Bag is Empty</h4>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Select a collection from our catalog to begin your festive preparation.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                View Catalog
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
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0, borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                    <Image src={product.images[0]} alt={product.name} fill sizes="70px" style={{ objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textDecoration: 'none'
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{ color: 'var(--crimson-royal)', fontWeight: 700, fontSize: '0.95rem' }}>
                        ₹{product.price}
                      </span>
                      <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-antique)',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px'
                      }}>
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <ShieldCheck size={18} color="var(--color-dark)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                  Dispatched in custom cellular foam cushioning to ensure arrival in pristine condition.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-light)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.5rem 0.75rem',
              marginBottom: '1rem',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-dark)' }}>
                <Tag size={14} />
                <span>Promotion: <strong>{couponCode}</strong></span>
              </div>
              <span style={{ color: 'var(--color-dark)', fontWeight: 700 }}>-₹{discount}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--color-dark)' }}>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                  <span>Discount</span>
                  <span style={{ color: 'var(--color-dark)' }}>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>Complimentary</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--color-dark)',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginTop: '0.5rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--color-border)'
              }}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
