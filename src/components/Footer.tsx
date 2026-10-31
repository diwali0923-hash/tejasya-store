import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#1A1A1A',
      color: '#FFFFFF',
      marginTop: '3rem',
      padding: '3rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#D4AF37',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              TEJASYA
            </span>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Handcrafted earthen lamps and smokeless candles for modern Indian homes.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              Collections
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <li><Link href="/product/the-royal-deepotsav-52-piece-artisanal-illumination-collection" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>52-Piece Collection Box</Link></li>
              <li><Link href="/product/handcrafted-jaipur-blue-pottery-ceramic-oil-diyas-set-of-6" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Blue Pottery Diyas</Link></li>
              <li><Link href="/product/handpainted-terracotta-clay-diyas-gold-border-24-pack" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Mitti Diyas</Link></li>
              <li><Link href="/product/jewel-toned-glass-jelly-gel-tealight-candles-pack-of-12" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Gel Candles</Link></li>
              <li><Link href="/product/magic-light-festive-duo-water-sensor-led-diyas-3d-reflection-shadow-cups-24-pack" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Magic Light Duo</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              Shipping
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
              <li>Free express delivery</li>
              <li>24-hour dispatch</li>
              <li>Bubble-wrap packaging</li>
              <li>100% replacement guarantee</li>
              <li>Cash on delivery available</li>
            </ul>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.35)'
        }}>
          <span>&copy; {new Date().getFullYear()} Tejasya. Made in India.</span>
          <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
