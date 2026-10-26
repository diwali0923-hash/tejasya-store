'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      {/* Top Banner (Strict Editorial) */}
      <div style={{
        background: 'var(--color-dark)',
        color: 'var(--color-light)',
        padding: '0.45rem 1rem',
        fontSize: '0.75rem',
        textAlign: 'center',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        fontWeight: 500
      }}>
        <span>Diwali Delivery Guarantee: Orders placed today arrive before Dhanteras</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Use Code <strong>SHUBH300</strong> for INR 300 Off</span>
      </div>

      {/* Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247, 244, 238, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem'
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: 'var(--color-dark)',
              display: 'block',
              lineHeight: 1
            }}>
              TEJASYA
            </span>
            <span style={{
              fontSize: '0.62rem',
              letterSpacing: '0.25em',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              display: 'block',
              marginTop: '4px',
              fontWeight: 500
            }}>
              Light & Form • Edition 2026
            </span>
          </Link>

          {/* Bag Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-dark)',
                color: 'var(--color-dark)',
                padding: '0.5rem 1.15rem',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <ShoppingBag size={15} />
              <span>Bag</span>
              {totalItems > 0 && (
                <span style={{
                  background: 'var(--color-dark)',
                  color: 'var(--color-light)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
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
