'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      {/* Festive Urgency Top Bar */}
      <div style={{
        background: '#7A1E22',
        color: '#FAF7F2',
        padding: '0.5rem 1rem',
        fontSize: '0.8rem',
        textAlign: 'center',
        letterSpacing: '0.03em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        fontWeight: 500
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#F4D8A8', fontWeight: 600 }}>
          <Sparkles size={14} /> DIWALI DISPATCH GUARANTEE:
        </span>
        <span>Guaranteed delivery before Dhanteras on all orders placed today.</span>
        <span style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '4px',
          padding: '0.1rem 0.5rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#FFF'
        }}>
          CODE: SHUBH300 (₹300 OFF)
        </span>
      </div>

      {/* Main Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(250, 247, 242, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem'
        }}>
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#F4EFE7',
              border: '1px solid var(--border-antique)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🪔
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#1C1614',
                display: 'block',
                lineHeight: 1
              }}>
                TEJASYA
              </span>
              <span style={{
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                color: 'var(--brass-antique)',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '3px',
                fontWeight: 600
              }}>
                SACRED LIVING • INDIA
              </span>
            </div>
          </Link>

          {/* Core Trust Pillars (Desktop) */}
          <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-perks">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={16} color="var(--terracotta)" />
              <span>Free Express Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="var(--terracotta)" />
              <span>Shatter-Proof Bubble Packaging</span>
            </div>
          </div>

          {/* Admin link + Bag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-antique)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.85rem',
              textDecoration: 'none',
              background: 'var(--bg-surface)'
            }}>
              Fulfillment Admin
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-antique)',
                color: 'var(--text-primary)',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              <ShoppingBag size={17} color="var(--crimson-royal)" />
              <span>Bag</span>
              {totalItems > 0 && (
                <span style={{
                  background: 'var(--crimson-royal)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
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
