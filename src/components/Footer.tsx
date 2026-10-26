import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#140505',
      color: '#FFFFFF',
      marginTop: '5rem',
      padding: '4.5rem 0 2.5rem 0',
      borderTop: '2px solid var(--gold-border)'
    }}>
      <div className="container">
        {/* Editorial Brand & Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--gold-radiant)',
              display: 'block',
              marginBottom: '1rem'
            }}>
              TEJASYA
            </span>
            <p style={{ fontSize: '0.88rem', color: '#E8DEC9', lineHeight: 1.65, maxWidth: '280px' }}>
              Handcrafted earthen lamps and smokeless jewel light for contemporary Indian spaces. Partnered with generational pottery clusters across Rajasthan and Uttar Pradesh.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: '#FFE082', fontWeight: 700 }}>
              Curated Collections
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <Link href="/product/the-shubh-deepavali-celebration-collection" style={{ color: '#E8DEC9', textDecoration: 'none' }}>
                  Shubh Deepavali 66-Piece Set
                </Link>
              </li>
              <li>
                <Link href="/product/grand-mandir-balcony-glow-kit" style={{ color: '#E8DEC9', textDecoration: 'none' }}>
                  Grand Mandir 112-Piece Kit
                </Link>
              </li>
              <li>
                <Link href="/product/artisanal-jewel-glass-gel-candles" style={{ color: '#E8DEC9', textDecoration: 'none' }}>
                  Jewel Glass Gel Candles (12 Pcs)
                </Link>
              </li>
              <li>
                <Link href="/product/heritage-handpainted-mitti-diyas" style={{ color: '#E8DEC9', textDecoration: 'none' }}>
                  Handpainted Mitti Diyas (24 Pcs)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: '#FFE082', fontWeight: 700 }}>
              Dispatch & Logistics
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#E8DEC9' }}>
              <li>Dispatches within 24 Hours</li>
              <li>Guaranteed Pre-Dhanteras Delivery</li>
              <li>Multi-layer Bubble Cushion Packaging</li>
              <li>100% Transit Damage Replacement Policy</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem', color: '#FFE082', fontWeight: 700 }}>
              Client Care
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#E8DEC9', lineHeight: 1.65 }}>
              For order modifications, live tracking status, or courier assistance, please contact our dispatch team with your order reference.
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
          fontSize: '0.8rem',
          color: 'rgba(232, 222, 201, 0.6)'
        }}>
          <div>
            © {new Date().getFullYear()} Tejasya Living. Handcrafted in India for Deepavali.
          </div>
          <div style={{ color: 'var(--gold-radiant)' }}>
            Free Express Pan-India Shipping on All Pre-Dhanteras Orders
          </div>
        </div>
      </div>
    </footer>
  );
}
