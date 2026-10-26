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
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-dark)',
          color: 'var(--color-light)',
          margin: '0 auto 1.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <CheckCircle2 size={36} strokeWidth={1.75} />
        </div>

        <span className="editorial-pill" style={{ marginBottom: '1rem' }}>
          CONFIRMED ORDER
        </span>

        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--color-dark)', fontWeight: 500, marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
          Your Order is Confirmed
        </h1>

        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Thank you for choosing Tejasya. Your order has been registered and is being prepared for immediate dispatch.
        </p>

        <div className="editorial-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', letterSpacing: '0.06em' }}>ORDER REFERENCE</span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--color-dark)', letterSpacing: '0.04em' }}>{orderId}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-dark)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Registered in System</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Truck size={20} color="var(--color-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--color-dark)', fontSize: '0.9rem', display: 'block' }}>Estimated Dispatch</strong>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Dispatches within 24 hours. Express air courier tracking link will be sent to your mobile phone via SMS.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--color-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--color-dark)', fontSize: '0.9rem', display: 'block' }}>Individual Cushion Packaging</strong>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Each clay diya and glass tumbler is encased in custom cellular cushioning for safe arrival.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">
            <span>Return to Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-dark)' }}>Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
