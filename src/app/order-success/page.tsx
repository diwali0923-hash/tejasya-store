'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Sparkles, Truck, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'TEJ-108291';

  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--crimson-royal)',
          color: '#FFFFFF',
          margin: '0 auto 1.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-crimson)',
          border: '2px solid var(--gold-bright)'
        }}>
          <CheckCircle2 size={40} strokeWidth={2} />
        </div>

        <span className="festive-pill-gold" style={{ marginBottom: '1rem' }}>
          <Sparkles size={13} color="var(--crimson-royal)" />
          <span>ORDER SUCCESSFULLY BOOKED</span>
        </span>

        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', color: 'var(--crimson-royal)', fontWeight: 800, marginBottom: '0.75rem' }}>
          May Your Home Glow With Joy
        </h1>

        <p style={{ color: 'var(--text-body)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Thank you for choosing Tejasya. Your festive collection has been booked in our database and is being packed with extreme care for express dispatch.
        </p>

        <div className="festive-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.06em', fontWeight: 600 }}>ORDER REFERENCE</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--crimson-royal)', fontWeight: 800 }}>{orderId}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1B6A34', fontSize: '0.88rem', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Confirmed</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Truck size={22} color="var(--crimson-royal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-dark)', fontSize: '0.92rem', display: 'block' }}>Pre-Dhanteras Express Dispatch</strong>
                <span style={{ color: 'var(--text-body)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Dispatches within 24 hours. Express air courier tracking link will be sent to your mobile phone via SMS.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={22} color="var(--crimson-royal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-dark)', fontSize: '0.92rem', display: 'block' }}>Zero-Breakage Guarantee</strong>
                <span style={{ color: 'var(--text-body)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Each earthen diya and glass candle is encased in protective cellular cushioning. Free instant replacement if damaged in transit.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">
            <span>Continue Shopping</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--crimson-royal)' }}>Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
