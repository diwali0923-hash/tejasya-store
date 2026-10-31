'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Clean minimal top banner */}
      <div style={{
        background: 'var(--crimson-royal)',
        color: '#FFFFFF',
        padding: '0.45rem 1rem',
        fontSize: '0.72rem',
        textAlign: 'center',
        letterSpacing: '0.06em',
        fontWeight: 600
      }}>
        Free Express Shipping + Pre-Dhanteras Delivery Guaranteed
      </div>

      {/* Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.75rem',
          gap: '0.75rem'
        }}>
          {/* Left: Burger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="mobile-burger-btn"
              style={{
                background: 'transparent',
                border: 'none',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-dark)',
                padding: 0
              }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.3rem, 3.5vw, 1.65rem)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--crimson-royal)',
                lineHeight: 1
              }}>
                TEJASYA
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/#collections" style={{
              color: 'var(--text-body)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              Collections
            </Link>
            <Link href={`/product/${PRODUCTS[0].slug}`} style={{
              color: 'var(--crimson-royal)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              52-Piece Box
            </Link>
          </nav>

          {/* Right: Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              padding: '0.5rem',
              position: 'relative'
            }}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '-2px',
                background: 'var(--crimson-royal)',
                color: '#FFF',
                fontSize: '0.62rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          display: 'flex'
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Drawer */}
          <div style={{
            position: 'relative',
            width: '85%',
            maxWidth: '340px',
            background: '#FFFFFF',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 95,
            overflowY: 'auto',
            animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: 'var(--crimson-royal)'
              }}>
                TEJASYA
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-dark)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Products */}
            <div style={{ flex: 1, padding: '1rem' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.75rem'
              }}>
                COLLECTIONS
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PRODUCTS.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={handleLinkClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: prod.category === 'bundle' ? 'var(--bg-surface-warm)' : 'transparent',
                      textDecoration: 'none',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        sizes="44px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-dark)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {prod.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                          ₹{prod.price}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{prod.originalPrice}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.88rem' }}
              >
                <ShoppingBag size={16} />
                <span>View Bag ({totalItems})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
