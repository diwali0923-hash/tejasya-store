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
  Loader2
} from 'lucide-react';

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

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE_TEST'>('COD');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 📍 HTML5 Geolocation + Reverse Geocoding
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
            setLocationSuccessMsg('📍 Location detected! Pincode, City & State auto-filled.');
          }
        } catch (err) {
          console.error('Failed to reverse geocode', err);
          setLocationSuccessMsg('📍 Coordinates found. Please confirm City and Pincode.');
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

    try {
      const orderId = `TEJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

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
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE_TEST' ? 'completed' : 'pending',
        fulfillmentStatus: 'unfulfilled',
        createdAt: new Date().toISOString()
      };

      await saveOrder(newOrder);
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err: unknown) {
      console.error('Failed to submit order', err);
      setErrorMsg((err as Error)?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪔</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Please add a festive collection to your bag before proceeding to checkout.
        </p>
        <Link href="/" className="btn-primary">
          Return to Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={15} /> Back to Store
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>
            Express Delivery <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Checkout</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter your exact address to ensure doorstep delivery before Dhanteras.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--terracotta-soft)',
            border: '1px solid var(--terracotta)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--terracotta)',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
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
              <div className="artisan-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={18} color="var(--terracotta)" />
                    <span>Doorstep Delivery Address</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-antique)',
                      color: 'var(--text-primary)',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                  >
                    {isLocating ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} color="var(--crimson-royal)" />}
                    <span>{isLocating ? 'Detecting Location...' : '📍 Use My Current Location'}</span>
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

              {/* Payment Method */}
              <div className="artisan-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--terracotta)" />
                  <span>Select Payment Method</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
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
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                          Cash on Delivery / UPI upon Arrival (COD)
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          Pay directly to delivery agent via Cash or Google Pay/PhonePe QR
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green)', fontWeight: 700 }}>AVAILABLE</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'ONLINE_TEST' ? '2px solid var(--crimson-royal)' : '1px solid var(--border-antique)',
                      background: paymentMethod === 'ONLINE_TEST' ? 'var(--crimson-subtle)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE_TEST"
                        checked={paymentMethod === 'ONLINE_TEST'}
                        onChange={() => setPaymentMethod('ONLINE_TEST')}
                        style={{ accentColor: 'var(--crimson-royal)' }}
                      />
                      <div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                          Prepaid / Instant Order Test Mode
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          Instant mock prepaid confirmation (Ready for Razorpay keys)
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--brass-antique)', fontWeight: 700 }}>INSTANT</span>
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
                      <span>Confirming Order in Database...</span>
                    </span>
                  ) : (
                    <span>Confirm Order • {paymentMethod === 'COD' ? 'Pay ₹' + total + ' on Delivery' : 'Pay ₹' + total}</span>
                  )}
                </button>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} color="var(--terracotta)" />
                    <span>Protected by Shatter-Proof Transit Guarantee</span>
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
