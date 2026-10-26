'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CustomerAddress, Order } from '@/types';
import { saveOrder } from '@/lib/orderService';
import {
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Tag,
  AlertCircle,
  Loader2,
  CreditCard,
  Banknote
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
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, total, couponCode, clearCart } = useCart();

  const [formData, setFormData] = useState<CustomerAddress>({
    fullName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    pincode: '',
    houseFlatBuilding: '',
    roadAreaColony: '',
    landmark: '',
    city: '',
    state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // HTML5 Geolocation + Reverse Geocoding
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationSuccessMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            setFormData((prev) => ({
              ...prev,
              pincode: addr.postcode || prev.pincode,
              city: addr.city || addr.town || addr.county || addr.suburb || prev.city,
              state: addr.state || prev.state,
              roadAreaColony: [addr.suburb, addr.neighbourhood, addr.road].filter(Boolean).join(', ') || prev.roadAreaColony
            }));
            setLocationSuccessMsg('Location detected: Pincode, City and State auto-filled.');
          }
        } catch (err) {
          console.error('Failed to reverse geocode', err);
          setLocationSuccessMsg('Coordinates detected. Please verify City and Pincode.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        alert('Could not access current location. Please enter your address manually.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your bag is empty.');
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name for delivery.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for courier delivery updates.');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian postal Pincode.');
      return;
    }
    if (!formData.houseFlatBuilding.trim()) {
      setErrorMsg('Please specify Flat, House No., or Building Name.');
      return;
    }
    if (!formData.roadAreaColony.trim()) {
      setErrorMsg('Please specify Street, Road or Area.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrorMsg('Please provide City and State.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `TEJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. If Cash on Delivery
    if (paymentMethod === 'COD') {
      try {
        const newOrder: Order = {
          id: orderId,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          shippingAddress: formData,
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
          paymentMethod: 'COD',
          paymentStatus: 'pending',
          fulfillmentStatus: 'unfulfilled',
          createdAt: new Date().toISOString()
        };

        await saveOrder(newOrder);
        clearCart();
        router.push(`/order-success?orderId=${orderId}`);
      } catch (err: any) {
        console.error('Failed to submit COD order', err);
        setErrorMsg(err?.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    // 2. If Razorpay Online Payment (UPI / Cards / Netbanking)
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setErrorMsg('Failed to load Razorpay payment SDK. Please check your connection.');
        setIsSubmitting(false);
        return;
      }

      // Create Razorpay Order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          receipt: orderId,
          notes: {
            customerName: formData.fullName,
            phone: formData.phone
          }
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // If in Mock / Test Mode (no keys yet configured in .env.local)
      if (orderData.isMock) {
        const newOrder: Order = {
          id: orderId,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          shippingAddress: formData,
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

        await saveOrder(newOrder);
        clearCart();
        router.push(`/order-success?orderId=${orderId}`);
        return;
      }

      // Open Real Razorpay Standard Checkout Popup
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Tejasya Living',
        description: `Shubh Deepavali Order #${orderId}`,
        image: '/images/shubh_box.png',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment signature
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

            // Save verified order to Supabase
            const newOrder: Order = {
              id: orderId,
              customerName: formData.fullName,
              customerPhone: formData.phone,
              customerEmail: formData.email,
              shippingAddress: formData,
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
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString()
            };

            await saveOrder(newOrder);
            clearCart();
            router.push(`/order-success?orderId=${orderId}`);
          } catch (err: any) {
            console.error('Error verifying payment', err);
            setErrorMsg('Payment verification failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
          email: formData.email || undefined
        },
        theme: {
          color: '#7A1E22' // Tejasya Sindoori Crimson Brand Color
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setErrorMsg(response?.error?.description || 'Payment failed. Please try another method.');
        setIsSubmitting(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay initialization error', err);
      setErrorMsg(err?.message || 'Failed to initiate payment.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '1px solid var(--color-border)',
          margin: '0 auto 1.25rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-dark)'
        }}>
          <Tag size={24} strokeWidth={1.5} />
        </div>
        <h2 style={{ color: 'var(--color-dark)', marginBottom: '0.5rem', fontWeight: 500 }}>Your bag is empty</h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Please add a collection to your bag before proceeding to checkout.
        </p>
        <Link href="/" className="btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Return to Store
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', color: 'var(--color-dark)', fontWeight: 500, marginBottom: '0.35rem', letterSpacing: '0.03em' }}>
            Express Delivery Checkout
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>
            Provide complete doorstep delivery details to ensure uninterrupted courier transit.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-dark)',
            borderRadius: 'var(--radius-xs)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--color-dark)',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}>
            {/* Left: Address & Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="editorial-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ color: 'var(--color-dark)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <MapPin size={17} color="var(--color-dark)" />
                    <span>Doorstep Delivery Address</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    style={{
                      background: 'var(--color-light)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-dark)',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    {isLocating ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} color="var(--color-dark)" />}
                    <span>{isLocating ? 'Detecting Location...' : 'Use My Current Location'}</span>
                  </button>
                </div>

                {locationSuccessMsg && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--forest-green)',
                    background: 'rgba(36, 88, 57, 0.08)',
                    border: '1px solid rgba(36, 88, 57, 0.2)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '1rem'
                  }}>
                    {locationSuccessMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Ramesh Verma"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        10-Digit Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Alternate Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        placeholder="e.g. Family member phone"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Email (for tracking receipt)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@email.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                      Flat / House No. / Apartment / Building Name *
                    </label>
                    <input
                      type="text"
                      name="houseFlatBuilding"
                      value={formData.houseFlatBuilding}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Flat 402, Tower B, Lotus Apartments"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-antique)',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                      Street / Area / Sector / Colony *
                    </label>
                    <input
                      type="text"
                      name="roadAreaColony"
                      value={formData.roadAreaColony}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. MG Road, Sector 14"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-antique)',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Famous Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="e.g. Near Shiv Mandir"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        Pincode (6 Digits) *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        maxLength={6}
                        placeholder="e.g. 110001"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Mumbai"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Maharashtra"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-antique)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="artisan-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--terracotta)" />
                  <span>Select Payment Method</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Razorpay Online Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'RAZORPAY' ? '2px solid var(--crimson-royal)' : '1px solid var(--border-antique)',
                      background: paymentMethod === 'RAZORPAY' ? 'var(--crimson-subtle)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        style={{ accentColor: 'var(--crimson-royal)' }}
                      />
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <CreditCard size={17} color="var(--crimson-royal)" />
                          <span>Pay Online via Razorpay (Instant Dispatch)</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                          UPI (Google Pay, PhonePe, Paytm, CRED), Cards, Netbanking
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--forest-green)', fontWeight: 700, background: 'rgba(36, 88, 57, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)' }}>
                      RECOMMENDED
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'COD' ? '2px solid var(--crimson-royal)' : '1px solid var(--border-antique)',
                      background: paymentMethod === 'COD' ? 'var(--crimson-subtle)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        style={{ accentColor: 'var(--crimson-royal)' }}
                      />
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Banknote size={17} color="var(--terracotta)" />
                          <span>Cash on Delivery / UPI on Arrival</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                          Pay with cash or delivery agent QR code at your doorstep
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AVAILABLE</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="artisan-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0, borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                        <Image src={product.images[0]} alt="" fill sizes="50px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {quantity} × ₹{product.price}
                        </div>
                      </div>
                      <div style={{ color: 'var(--crimson-royal)', fontWeight: 700, fontSize: '0.9rem' }}>
                        ₹{product.price * quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {couponCode && discount > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(36, 88, 57, 0.08)',
                    border: '1px dashed var(--forest-green)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.6rem 0.85rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--forest-green)' }}>
                      <Tag size={15} />
                      <span>Coupon <strong>{couponCode}</strong> applied</span>
                    </div>
                    <span style={{ color: 'var(--forest-green)', fontWeight: 700 }}>-₹{discount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--forest-green)' }}>
                      <span>Festive Coupon Savings</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Pan-India Express Courier</span>
                    <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'var(--text-primary)',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--crimson-royal)' }}>₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </span>
                  ) : paymentMethod === 'RAZORPAY' ? (
                    <span>Pay ₹{total} via Razorpay (UPI / Cards)</span>
                  ) : (
                    <span>Confirm Order • Pay ₹{total} on Delivery</span>
                  )}
                </button>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} color="var(--terracotta)" />
                    <span>Protected by 256-Bit SSL & Shatter-Proof Transit Guarantee</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
