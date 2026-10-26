import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#FFFFFF',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: '5rem',
      padding: '4rem 0 2rem 0'
    }}>
      <div className="container">
        {/* 4 Trust Props */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-antique)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={20} color="var(--terracotta)" />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Shatter-Proof Transit</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Multi-layer bubble and shockproof cushioning. 100% free instant replacement if damaged.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-antique)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Truck size={20} color="var(--terracotta)" />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Express Free Shipping</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Dispatches within 24 hours. Pre-Dhanteras guaranteed delivery across India.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-antique)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RotateCcw size={20} color="var(--terracotta)" />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Hassle-Free Support</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Dedicated WhatsApp and email support for real-time tracking updates.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-antique)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Heart size={20} color="var(--terracotta)" />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Artisan Handcrafted</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Directly uplifting traditional pottery clusters and skilled women artisans.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Details & Footer Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🪔</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.12em'
              }}>
                TEJASYA
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Celebrating the timeless light within every home. Curating authentic Indian craftsmanship, smokeless illumination, and auspicious festive elegance.
            </p>
          </div>

          <div>
            <h5 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>COLLECTIONS</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/product/the-shubh-deepavali-celebration-collection" style={{ color: 'var(--text-secondary)' }}>
                  Shubh Deepavali 66-Piece Set
                </Link>
              </li>
              <li>
                <Link href="/product/grand-mandir-balcony-glow-kit" style={{ color: 'var(--text-secondary)' }}>
                  Grand Mandir & Balcony Glow Kit
                </Link>
              </li>
              <li>
                <Link href="/product/artisanal-jewel-glass-gel-candles" style={{ color: 'var(--text-secondary)' }}>
                  Jewel Glass Gel Candles (12 Pcs)
                </Link>
              </li>
              <li>
                <Link href="/product/heritage-handpainted-mitti-diyas" style={{ color: 'var(--text-secondary)' }}>
                  Heritage Handpainted Diyas (24 Pcs)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>ASSURANCE</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Safe Transit Guaranteed</li>
              <li>Dispatches in 24 Hours</li>
              <li>Zero-Plastic Protective Packaging</li>
              <li>Pan-India Express Logistics</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>ADMIN</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/admin" style={{ color: 'var(--crimson-royal)', fontWeight: 600 }}>
                  📦 Orders & Fulfillment Dashboard
                </Link>
              </li>
              <li style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Store Operations & Meesho Forward Dispatch
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Tejasya Living. All rights reserved. Shubh Deepavali 🪔
          </div>
          <div>
            <span>Crafted with devotion for Indian Festivals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
