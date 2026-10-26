import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-dark)',
      color: 'var(--color-light)',
      marginTop: '5rem',
      padding: '4.5rem 0 2.5rem 0'
    }}>
      <div className="container">
        {/* Editorial Brand & Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(247, 244, 238, 0.15)'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              display: 'block',
              marginBottom: '1rem'
            }}>
              TEJASYA
            </span>
            <p style={{ fontSize: '0.85rem', color: 'rgba(247, 244, 238, 0.65)', lineHeight: 1.6, maxWidth: '280px' }}>
              Handcrafted earthen lamps and smokeless jewel light for contemporary Indian spaces. Built with artisanal pottery clusters across Rajasthan and Uttar Pradesh.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: 'rgba(247, 244, 238, 0.9)' }}>
              Collections
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/product/the-shubh-deepavali-celebration-collection" style={{ color: 'rgba(247, 244, 238, 0.65)' }}>
                  Shubh Deepavali 66-Piece Set
                </Link>
              </li>
              <li>
                <Link href="/product/grand-mandir-balcony-glow-kit" style={{ color: 'rgba(247, 244, 238, 0.65)' }}>
                  Grand Mandir 112-Piece Kit
                </Link>
              </li>
              <li>
                <Link href="/product/artisanal-jewel-glass-gel-candles" style={{ color: 'rgba(247, 244, 238, 0.65)' }}>
                  Jewel Glass Gel Candles (12 Pcs)
                </Link>
              </li>
              <li>
                <Link href="/product/heritage-handpainted-mitti-diyas" style={{ color: 'rgba(247, 244, 238, 0.65)' }}>
                  Handpainted Mitti Diyas (24 Pcs)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: 'rgba(247, 244, 238, 0.9)' }}>
              Dispatch & Logistics
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(247, 244, 238, 0.65)' }}>
              <li>Dispatches within 24 Hours</li>
              <li>Guaranteed Pre-Dhanteras Delivery</li>
              <li>Multi-layer Bubble Cushion Packaging</li>
              <li>Transit Damage Replacement Policy</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: 'rgba(247, 244, 238, 0.9)' }}>
              Client Care
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'rgba(247, 244, 238, 0.65)', lineHeight: 1.6 }}>
              For order modifications, tracking status, or courier assistance, please contact our dispatch team with your order reference.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'rgba(247, 244, 238, 0.45)'
        }}>
          <div>
            © {new Date().getFullYear()} Tejasya Living. All rights reserved.
          </div>
          <div>
            <span>Festive Edition • Pan-India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
