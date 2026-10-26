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
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-antique)',
          margin: '0 auto 1.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          <span style={{ fontSize: '2.8rem' }}>🪔</span>
        </div>

        <span className="artisan-pill" style={{ marginBottom: '1rem' }}>
          <Sparkles size={13} color="var(--terracotta)" />
          <span>ORDER SUCCESSFULLY BOOKED</span>
        </span>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
          May Your Home Glow with <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Joy & Prosperity</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Thank you for choosing Tejasya. Your handcrafted festive collection has been booked in our database and is being prepared with extreme care.
        </p>

        <div className="artisan-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ORDER NUMBER</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--crimson-royal)' }}>{orderId}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--forest-green)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Saved to Database</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Truck size={20} color="var(--terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem', display: 'block' }}>Estimated Pre-Dhanteras Delivery</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Dispatches within 24 hours. Express air courier tracking link will be sent to your mobile phone via SMS/WhatsApp.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem', display: 'block' }}>Zero-Breakage Transit Assurance</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Each earthen diya and glass candle is encased in protective bubble wrap cushions. Free replacement guaranteed if damaged in transit.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
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
