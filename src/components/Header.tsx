'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      {/* Top Banner (Festive Crimson & Gold Urgency) */}
      <div style={{
        background: 'linear-gradient(90deg, #660E0E 0%, #8B1818 50%, #660E0E 100%)',
        color: '#FFFFFF',
        padding: '0.55rem 1rem',
        fontSize: '0.78rem',
        textAlign: 'center',
        letterSpacing: '0.06em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        flexWrap: 'wrap',
        fontWeight: 600,
        borderBottom: '1px solid rgba(212, 175, 55, 0.4)'
      }}>
        <span style={{ color: '#FFE082' }}>PRE-DHANTERAS DISPATCH GUARANTEE</span>
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
        background: 'rgba(250, 246, 239, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid var(--border-subtle)',
        boxShadow: '0 4px 20px rgba(31, 10, 10, 0.04)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.75rem'
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'var(--crimson-royal)',
              display: 'block',
              lineHeight: 1
            }}>
              TEJASYA
            </span>
            <span style={{
              fontSize: '0.64rem',
              letterSpacing: '0.22em',
              color: 'var(--gold-warm)',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '5px',
              fontWeight: 700
            }}>
              Artisanal Deepavali Illumination
            </span>
          </Link>

          {/* Bag Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--crimson-royal)',
                color: 'var(--crimson-royal)',
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingBag size={16} strokeWidth={2.2} />
              <span>Bag</span>
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
    </>
  );
}
