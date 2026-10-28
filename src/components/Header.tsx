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
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
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
      {/* Top Banner (Festive Crimson & Gold Urgency) */}
      <div style={{
        background: 'linear-gradient(90deg, #660E0E 0%, #8B1818 50%, #660E0E 100%)',
        color: '#FFFFFF',
        padding: '0.55rem 1rem',
        fontSize: '0.78rem',
        textAlign: 'center',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        fontWeight: 600,
        borderBottom: '1px solid rgba(212, 175, 55, 0.4)'
      }}>
        <span style={{ color: '#FFE082', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Flame size={14} fill="#F5C542" color="#F5C542" /> PRE-DHANTERAS DISPATCH GUARANTEE
        </span>
        <span style={{ opacity: 0.5, color: '#D4AF37' }}>•</span>
        <span>Orders Dispatch in 24 Hours with Free Express Delivery Across India</span>
        <span style={{ opacity: 0.5, color: '#D4AF37' }}>•</span>
        <span style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid #D4AF37', padding: '0.1rem 0.5rem', borderRadius: '3px', color: '#FFF' }}>
          Code SHUBH300 Applied
        </span>
      </div>

      {/* Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(250, 246, 239, 0.98)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid var(--border-subtle)',
        boxShadow: '0 4px 20px rgba(31, 10, 10, 0.04)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
          gap: '1rem'
        }}>
          {/* Left: Mobile Burger Button & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--crimson-royal)',
                padding: 0
              }}
              className="mobile-burger-btn"
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
            </button>

            {/* Brand Logo */}
            <Link href="/" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: 'var(--crimson-royal)',
                display: 'block',
                lineHeight: 1
              }}>
                TEJASYA
              </span>
              <span style={{
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                color: 'var(--gold-warm)',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '4px',
                fontWeight: 700
              }}>
                Artisanal Deepavali Illumination
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <Link
              href="/#collections"
              style={{
                color: 'var(--text-dark)',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                transition: 'color 0.2s'
              }}
            >
              All 5 Offerings
            </Link>
            <Link
              href="/#collection-comparison"
              style={{
                color: 'var(--text-dark)',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                transition: 'color 0.2s'
              }}
            >
              Compare Offerings
            </Link>
            <Link
              href="/product/the-royal-deepotsav-52-piece-artisanal-illumination-collection"
              style={{
                color: 'var(--crimson-royal)',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={14} color="var(--gold-bright)" />
              <span>52-Pc Master Box</span>
            </Link>
          </nav>

          {/* Right: Bag Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--crimson-royal)',
                color: 'var(--crimson-royal)',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'all 0.2s ease',
                minHeight: '42px'
              }}
            >
              <ShoppingBag size={17} strokeWidth={2.2} />
              <span className="bag-text">Bag</span>
              {totalItems > 0 && (
                <span style={{
                  background: 'var(--crimson-royal)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '2px'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Burger Menu Overlay Drawer */}
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
              background: 'rgba(20, 5, 5, 0.75)',
              backdropFilter: 'blur(8px)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Sliding Drawer */}
          <div style={{
            position: 'relative',
            width: '88%',
            maxWidth: '380px',
            background: 'var(--bg-festive)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '10px 0 40px rgba(0, 0, 0, 0.5)',
            borderRight: '1.5px solid var(--gold-border)',
            zIndex: 95,
            overflowY: 'auto',
            animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--crimson-royal)',
                  display: 'block'
                }}>
                  TEJASYA
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  color: 'var(--gold-warm)',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  Festive Navigation
                </span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Navigation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Urgency Pill */}
            <div style={{
              margin: '1rem 1.25rem 0.5rem 1.25rem',
              padding: '0.75rem 0.95rem',
              background: 'linear-gradient(135deg, rgba(139, 24, 24, 0.08) 0%, rgba(212, 175, 55, 0.15) 100%)',
              border: '1px solid var(--gold-radiant)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.78rem',
              color: 'var(--crimson-royal)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <Flame size={15} fill="var(--crimson-royal)" />
              <span>Guaranteed Delivery Before Diwali & Dhanteras</span>
            </div>

            {/* Drawer Navigation Content */}
            <div style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Product Catalog List */}
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.65rem'
                }}>
                  CURATED FESTIVE OFFERINGS
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                        borderRadius: 'var(--radius-xs)',
                        background: prod.category === 'bundle' ? 'rgba(212, 175, 55, 0.12)' : 'var(--bg-surface)',
                        border: prod.category === 'bundle' ? '1.5px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
                        textDecoration: 'none',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid rgba(212, 175, 55, 0.3)'
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
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {prod.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--crimson-royal)' }}>
                            ₹{prod.price}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{prod.originalPrice}
                          </span>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            color: '#047857',
                            background: 'rgba(4, 120, 87, 0.1)',
                            padding: '1px 4px',
                            borderRadius: '2px'
                          }}>
                            {prod.piecesCount} Pcs
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Section Shortcuts */}
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.65rem'
                }}>
                  QUICK NAVIGATION
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link
                    href="/#collections"
                    onClick={handleLinkClick}
                    style={{
                      padding: '0.75rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-dark)',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>View All 5 Offerings Grid</span>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </Link>

                  <Link
                    href="/#collection-comparison"
                    onClick={handleLinkClick}
                    style={{
                      padding: '0.75rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-dark)',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Price Comparison & Savings Breakdown</span>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </Link>
                </div>
              </div>

              {/* Trust & WhatsApp Support */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  <ShieldCheck size={16} color="var(--crimson-royal)" />
                  <span>100% Free Replacement for transit breakage</span>
                </div>
                <a
                  href="https://wa.me/919999999999?text=Hi%20Tejasya,%20I%20have%20a%20question%20about%20Diwali%20order%20dispatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#047857',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp (Priority Support)</span>
                </a>
              </div>
            </div>

            {/* Bottom Drawer Action */}
            <div style={{
              padding: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)'
            }}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '0.9rem' }}
              >
                <ShoppingBag size={17} />
                <span>Open Festive Bag ({totalItems} items)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
