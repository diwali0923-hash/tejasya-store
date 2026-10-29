'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Order, CustomerAddress } from '@/types';
import { saveOrder } from '@/lib/orderService';
import { trackInitiateCheckout, trackPurchase } from '@/lib/metaPixel';
import {
  ShieldCheck,
  ArrowLeft,
  Tag,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Lock,
  Truck,
  Package
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/magic-checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, total, couponCode, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fire-and-forget sale notification to owner
  const notifySale = (order: Order) => {
    fetch('/api/notify/sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        items: order.items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress
          ? { city: order.shippingAddress.city, state: order.shippingAddress.state, pincode: order.shippingAddress.pincode }
          : undefined
      })
    }).catch(() => {}); // silent -- don't block checkout
  };

  const handleCheckout = async () => {
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your festive bag is empty. Please return to catalog.');
      return;
    }

    // Meta Pixel: InitiateCheckout -- fires on button click, not page load
    trackInitiateCheckout({
      contentIds: items.map((i) => i.product.id),
      numItems: items.reduce((sum, i) => sum + i.quantity, 0),
      value: total
    });

    setIsSubmitting(true);
    const orderId = `TEJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setErrorMsg('Failed to load payment SDK. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // Build Magic Checkout line_items from cart
      const lineItems = items.map(({ product, quantity }) => ({
        sku: product.id,
        variant_id: product.id,
        price: Math.round(product.originalPrice * 100),
        offer_price: Math.round(product.price * 100),
        quantity,
        name: product.name,
        description: product.tagline || product.name,
        image_url: product.images[0] ? `${window.location.origin}${product.images[0]}` : undefined
      }));

      // Create Razorpay order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: orderId,
          notes: { source: 'tejasya_magic_checkout' },
          line_items: lineItems
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment.');
      }

      // Mock mode (keys not configured)
      if (orderData.isMock) {
        const mockOrder: Order = {
          id: orderId,
          customerName: 'Test Customer',
          customerPhone: '0000000000',
          shippingAddress: {
            fullName: 'Test Customer',
            phone: '0000000000',
            pincode: '000000',
            houseFlatBuilding: 'Mock Mode',
            roadAreaColony: 'Mock Mode',
            city: 'Mock',
            state: 'Mock'
          },
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            meeshoSkus: i.product.meeshoMapping.map((m) => m.sku)
          })),
          subtotal,
          discount,
          shippingFee: 0,
          totalAmount: total,
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'completed',
          fulfillmentStatus: 'unfulfilled',
          razorpayOrderId: orderData.id,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        await saveOrder(mockOrder);
        notifySale(mockOrder);
        trackPurchase({
          contentIds: items.map((i) => i.product.id),
          numItems: items.reduce((sum, i) => sum + i.quantity, 0),
          value: total
        });
        clearCart();
        router.push(`/order-success?orderId=${orderId}`);
        return;
      }

      // Open Magic Checkout -- Razorpay handles address, phone, payment, coupons
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Tejasya Living',
        description: `Shubh Deepavali Order #${orderId}`,
        image: '/images/shubh_box.png',
        order_id: orderData.id,
        one_click_checkout: true,
        show_coupons: true,
        theme: {
          color: '#8B1818'
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        },
        handler: async function (response: any) {
          try {
            // 1. Verify payment signature
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.verified) {
              throw new Error('Payment verification failed.');
            }

            // 2. Fetch full order from Razorpay to get customer address
            let customerName = 'Customer';
            let customerPhone = '';
            let customerEmail = '';
            let shippingAddress: CustomerAddress = {
              fullName: 'Customer',
              phone: '',
              pincode: '',
              houseFlatBuilding: '',
              roadAreaColony: '',
              city: '',
              state: ''
            };
            let paymentMethod: 'RAZORPAY' | 'COD' = 'RAZORPAY';

            try {
              const orderRes = await fetch('/api/razorpay/fetch-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id })
              });
              const rzpOrder = await orderRes.json();

              // Magic Checkout returns customer_details with shipping_address
              const cd = rzpOrder.customer_details || {};
              const sa = cd.shipping_address || {};

              customerName = cd.name || sa.name || 'Customer';
              customerPhone = (cd.contact || sa.contact || '').replace('+91', '').replace(/\D/g, '');
              customerEmail = cd.email || '';

              shippingAddress = {
                fullName: sa.name || customerName,
                phone: (sa.contact || customerPhone).replace('+91', '').replace(/\D/g, ''),
                pincode: sa.zipcode || '',
                houseFlatBuilding: sa.line1 || '',
                roadAreaColony: sa.line2 || '',
                landmark: sa.landmark || '',
                city: sa.city || '',
                state: sa.state || ''
              };

              // Check if COD
              if (rzpOrder.payment_method === 'cod' || rzpOrder.status === 'placed') {
                paymentMethod = 'COD';
              }
            } catch (fetchErr) {
              console.warn('Could not fetch Razorpay order details, saving with limited info:', fetchErr);
            }

            // 3. Save order to Supabase
            const newOrder: Order = {
              id: orderId,
              customerName,
              customerPhone,
              customerEmail,
              shippingAddress,
              items: items.map((i) => ({
                productId: i.product.id,
                productName: i.product.name,
                quantity: i.quantity,
                price: i.product.price,
                meeshoSkus: i.product.meeshoMapping.map((m) => m.sku)
              })),
              subtotal,
              discount,
              shippingFee: 0,
              totalAmount: total,
              paymentMethod,
              paymentStatus: paymentMethod === 'COD' ? 'pending' : 'completed',
              fulfillmentStatus: 'unfulfilled',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString()
            };

            await saveOrder(newOrder);
            notifySale(newOrder);
            trackPurchase({
              contentIds: items.map((i) => i.product.id),
              numItems: items.reduce((sum, i) => sum + i.quantity, 0),
              value: total
            });
            clearCart();
            router.push(`/order-success?orderId=${orderId}`);
          } catch (err: any) {
            console.error('Post-payment error:', err);
            setErrorMsg('Payment received but order processing failed. Please contact support with your payment ID.');
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMsg(response?.error?.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '1.5px solid var(--gold-radiant)',
          background: 'var(--gold-tint)',
          margin: '0 auto 1.25rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--crimson-royal)'
        }}>
          <Tag size={26} strokeWidth={1.8} />
        </div>
        <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 800 }}>Your Bag is Empty</h2>
        <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
          Please select a festive illumination collection before proceeding to checkout.
        </p>
        <Link href="/" className="btn-primary">
          Explore Diwali Offerings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* Back link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            href="/"
            style={{
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.84rem',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--crimson-royal)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em'
            }}>
              MAGIC CHECKOUT
            </span>
            <span style={{ color: 'var(--forest-green)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} /> Free Express Delivery
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            color: 'var(--crimson-royal)',
            fontWeight: 800,
            marginBottom: '0.35rem'
          }}>
            Order Summary
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.88rem' }}>
            Review your items, then proceed to secure checkout.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{
            background: 'rgba(139, 24, 24, 0.08)',
            border: '1.5px solid var(--crimson-royal)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.95rem 1.15rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--crimson-royal)',
            fontSize: '0.88rem',
            fontWeight: 600
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Card */}
        <div className="festive-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-dark)', fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 800 }}>
            <Package size={18} color="var(--crimson-royal)" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
            {items.length} {items.length === 1 ? 'Item' : 'Items'} in Your Bag
          </h3>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  flexShrink: 0,
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: 'var(--text-dark)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Qty: {quantity} x ₹{product.price} ({product.piecesCount} Pcs)
                  </div>
                </div>
                <div style={{ color: 'var(--crimson-royal)', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                  ₹{product.price * quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon applied */}
          {couponCode && discount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--gold-tint)',
              border: '1px solid var(--gold-radiant)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--crimson-royal)', fontWeight: 700 }}>
                <Tag size={15} />
                <span>Festive Coupon <strong>{couponCode}</strong> applied</span>
              </div>
              <span style={{ color: 'var(--crimson-royal)', fontWeight: 800 }}>-₹{discount}</span>
            </div>
          )}

          {/* Price breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--crimson-royal)' }}>
                <span>Festive Discount</span>
                <span style={{ fontWeight: 700 }}>-₹{discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
              <span>Express Courier Shipping</span>
              <span style={{ color: '#047857', fontWeight: 800 }}>FREE</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--text-dark)',
              fontSize: '1.4rem',
              fontWeight: 800,
              paddingTop: '0.85rem',
              borderTop: '1.5px solid var(--border-subtle)',
              marginTop: '0.35rem'
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--crimson-royal)' }}>₹{total}</span>
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1.15rem',
              fontSize: '1.05rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: 'var(--shadow-crimson)'
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" />
                <span>Opening Secure Checkout...</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Lock size={17} />
                <span>Proceed to Pay ₹{total}</span>
              </span>
            )}
          </button>

          {/* Trust badges */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <span style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              lineHeight: 1.4
            }}>
              <ShieldCheck size={16} color="var(--crimson-royal)" />
              <span>256-Bit SSL Encrypted • UPI, Cards, COD Available</span>
            </span>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div style={{
            background: 'var(--bg-festive)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <Truck size={22} color="var(--crimson-royal)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>Free Express Delivery</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Dispatches within 24 hours</div>
          </div>
          <div style={{
            background: 'var(--bg-festive)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <Sparkles size={22} color="var(--crimson-royal)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>100% Replacement</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Free if damaged in transit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
