'use client';

import React, { useState, useEffect } from 'react';
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
  Banknote,
  CheckCircle2,
  Sparkles,
  Phone,
  User,
  Home,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const LOCAL_STORAGE_SAVED_ADDRESS_KEY = 'tejasya_saved_address';

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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeVerifiedMsg, setPincodeVerifiedMsg] = useState('');
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Auto-load previously saved address on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_ADDRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone && parsed.pincode) {
          setFormData(parsed);
          setHasSavedAddress(true);
          if (parsed.city && parsed.state) {
            setPincodeVerifiedMsg(`${parsed.city}, ${parsed.state}`);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved address', e);
    }
  }, []);

  // 2. Instant Postal PIN Code Lookup (api.postalpincode.in)
  const lookupPincode = async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return;

    setPincodeLoading(true);
    setPincodeVerifiedMsg('');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const detectedCity = po.District || po.Division || po.Block || '';
        const detectedState = po.State || '';

        setFormData((prev) => ({
          ...prev,
          city: detectedCity || prev.city,
          state: detectedState || prev.state
        }));
        setPincodeVerifiedMsg(`${detectedCity}, ${detectedState} ✓ Verified`);
      }
    } catch (err) {
      console.warn('Postal pincode API lookup error', err);
    } finally {
      setPincodeLoading(false);
    }
  };

  // 3. One-Tap HTML5 Geolocation with Multi-Provider Reverse Geocoding
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationSuccessMsg('');
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let resolved = false;

        // Provider 1: BigDataCloud Reverse Geocoding (CORS friendly, fast, accurate for India)
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const postcode = data.postcode || '';
            const city = data.city || data.locality || data.principalSubdivision || '';
            const state = data.principalSubdivision || '';
            const area = [data.locality, data.localityInfo?.administrative?.[3]?.name]
              .filter(Boolean)
              .join(', ');

            if (city || postcode) {
              setFormData((prev) => ({
                ...prev,
                pincode: postcode || prev.pincode,
                city: city || prev.city,
                state: state || prev.state,
                roadAreaColony: prev.roadAreaColony || area
              }));
              resolved = true;
              setLocationSuccessMsg(`📍 Location Detected: ${area || city}${postcode ? ` (${postcode})` : ''}`);
              if (postcode) {
                lookupPincode(postcode);
              }
            }
          }
        } catch (e) {
          console.warn('BigDataCloud geocode failed, falling back', e);
        }

        // Provider 2: Fallback to OpenStreetMap Nominatim
        if (!resolved) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const postcode = addr.postcode || '';
              const city = addr.city || addr.town || addr.county || addr.suburb || '';
              const state = addr.state || '';
              const area = [addr.suburb, addr.neighbourhood, addr.road].filter(Boolean).join(', ');

              setFormData((prev) => ({
                ...prev,
                pincode: postcode || prev.pincode,
                city: city || prev.city,
                state: state || prev.state,
                roadAreaColony: prev.roadAreaColony || area
              }));
              setLocationSuccessMsg(`📍 Location Detected: ${area || city} (${postcode})`);
              if (postcode) {
                lookupPincode(postcode);
              }
            }
          } catch (err) {
            console.warn('Nominatim geocode failed', err);
            setLocationSuccessMsg('GPS coordinates captured. Please confirm your 6-digit Pincode.');
          }
        }

        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error', err);
        setErrorMsg('Could not detect location automatically. Please enter your Pincode.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Clean non-digits and cap to 10 digits
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }

    if (name === 'pincode') {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, pincode: digits }));
      if (digits.length === 6) {
        lookupPincode(digits);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your festive bag is empty. Please return to catalog.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for courier dispatch updates.');
      return;
    }
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian Pincode.');
      return;
    }
    if (!formData.houseFlatBuilding.trim()) {
      setErrorMsg('Please specify Flat, House No., or Building Name.');
      return;
    }
    if (!formData.roadAreaColony.trim()) {
      setErrorMsg('Please specify Street, Area, Colony or Locality.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrorMsg('Please ensure City and State are provided.');
      return;
    }

    // Persist address in LocalStorage for 1-click returning checkout
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESS_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to cache address', e);
    }

    setIsSubmitting(true);
    const orderId = `TEJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. If Cash on Delivery
    if (paymentMethod === 'COD') {
      try {
        const newOrder: Order = {
          id: orderId,
          customerName: formData.fullName,
          customerPhone: cleanPhone,
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
        setErrorMsg('Failed to load Razorpay payment SDK. Please check your internet connection.');
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
            phone: cleanPhone,
            pincode: formData.pincode,
            city: formData.city
          }
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // Mock Mode (when keys not configured in .env.local)
      if (orderData.isMock) {
        const newOrder: Order = {
          id: orderId,
          customerName: formData.fullName,
          customerPhone: cleanPhone,
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

      // Real Razorpay Checkout with Magic Checkout & Address Prefill
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Tejasya Living',
        description: `Shubh Deepavali Order #${orderId}`,
        image: '/images/shubh_box.png',
        order_id: orderData.id,
        one_click_checkout: true, // Enables Magic Checkout 1-click address autofill
        prefill: {
          name: formData.fullName,
          contact: `+91${cleanPhone}`,
          email: formData.email || undefined
        },
        notes: {
          address: `${formData.houseFlatBuilding}, ${formData.roadAreaColony}`,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state
        },
        theme: {
          color: '#8B1818' // Royal Sindoori Crimson
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          }
        },
        handler: async function (response: any) {
          try {
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

            const newOrder: Order = {
              id: orderId,
              customerName: formData.fullName,
              customerPhone: cleanPhone,
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
            setErrorMsg('Payment verification failed. Please contact WhatsApp support with your payment ID.');
            setIsSubmitting(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setErrorMsg(response?.error?.description || 'Payment failed. Please try another UPI or card method.');
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
    <div style={{ padding: '2rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Navigation Breadcrumb */}
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

        {/* Header Title with Urgency Badge */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--crimson-royal)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em'
            }}>
              1-CLICK EXPRESS CHECKOUT
            </span>
            <span style={{ color: 'var(--forest-green)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} /> Free Express Delivery Included
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
            color: 'var(--crimson-royal)',
            fontWeight: 800,
            marginBottom: '0.25rem'
          }}>
            Doorstep Delivery & Payment
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>
            Orders dispatch within 24 hours in shatter-proof bubble encasement.
          </p>
        </div>

        {/* Error Alert Box */}
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

        {/* Checkout Grid */}
        <form onSubmit={handleSubmitOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.25rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Frictionless Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Step 1: Customer Phone & Name */}
              <div className="festive-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{
                    color: 'var(--text-dark)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Phone size={18} color="var(--crimson-royal)" />
                    <span>Contact Details</span>
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    For courier WhatsApp updates
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Phone Number with +91 Pre-attached */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Mobile Phone Number *
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#FFFFFF',
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden'
                    }}>
                      <span style={{
                        padding: '0.75rem 0.85rem',
                        background: 'var(--bg-festive)',
                        color: 'var(--text-dark)',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        borderRight: '1px solid var(--border-subtle)'
                      }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--text-dark)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Full Name *
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#FFFFFF',
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0 0.85rem'
                    }}>
                      <User size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
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
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.92rem',
                          color: 'var(--text-dark)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Doorstep Delivery Address with 1-Tap Location & Pincode Auto-Fill */}
              <div className="festive-card" style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.65rem'
                }}>
                  <h3 style={{
                    color: 'var(--text-dark)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <MapPin size={18} color="var(--crimson-royal)" />
                    <span>Delivery Address</span>
                  </h3>

                  {/* 1-Tap Location Auto-Detect Button */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 197, 66, 0.25) 100%)',
                      border: '1.5px solid var(--gold-radiant)',
                      color: 'var(--crimson-royal)',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: 'var(--shadow-subtle)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isLocating ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Detecting GPS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} color="var(--crimson-royal)" />
                        <span>Auto-Detect My Location</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Location Detection Banner */}
                {locationSuccessMsg && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#047857',
                    background: 'rgba(4, 120, 87, 0.08)',
                    border: '1px solid rgba(4, 120, 87, 0.2)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '1.15rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Check size={14} />
                    <span>{locationSuccessMsg}</span>
                  </div>
                )}

                {hasSavedAddress && !locationSuccessMsg && (
                  <div style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-festive)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '1.15rem'
                  }}>
                    ✨ <strong>Saved Address Auto-Loaded:</strong> Edit any field below if you want this delivered elsewhere.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Pincode with Auto-Lookup Indicator */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.82rem', color: 'var(--text-dark)', fontWeight: 700 }}>
                        Pincode (6 Digits) *
                      </label>
                      {pincodeLoading && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--crimson-royal)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Loader2 size={12} className="animate-spin" /> Looking up district...
                        </span>
                      )}
                      {pincodeVerifiedMsg && !pincodeLoading && (
                        <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 800 }}>
                          {pincodeVerifiedMsg}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      maxLength={6}
                      placeholder="e.g. 110001, 400001, 560034"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#FFFFFF',
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>

                  {/* House / Flat / Building */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      House No. / Flat / Floor / Building Name *
                    </label>
                    <input
                      type="text"
                      name="houseFlatBuilding"
                      value={formData.houseFlatBuilding}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Flat 304, Tower B, Lotus Heights"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#FFFFFF',
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.92rem',
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>

                  {/* Street / Area / Locality */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Street / Area / Locality / Sector *
                    </label>
                    <input
                      type="text"
                      name="roadAreaColony"
                      value={formData.roadAreaColony}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 14th Main, Indiranagar"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#FFFFFF',
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.92rem',
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>

                  {/* City & State (Auto-filled from Pincode or GPS) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                        City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Auto-filled from Pincode"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: formData.city ? '#F9FBF9' : '#FFFFFF',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: 'var(--text-dark)'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Auto-filled from Pincode"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: formData.state ? '#F9FBF9' : '#FFFFFF',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: 'var(--text-dark)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Collapsible Optional Details (Email / Landmark / Alternate Phone) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--crimson-royal)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '0.35rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>{showOptionalFields ? '- Hide Extra Details' : '+ Add Landmark, Email or Alt Phone (Optional)'}</span>
                      {showOptionalFields ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showOptionalFields && (
                      <div style={{
                        marginTop: '0.85rem',
                        padding: '1rem',
                        background: 'var(--bg-festive)',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Nearby Landmark
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            placeholder="e.g. Near Shiv Mandir / Beside Central Park"
                            style={{
                              width: '100%',
                              padding: '0.65rem',
                              background: '#FFFFFF',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                              Email (for receipt)
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="name@email.com"
                              style={{
                                width: '100%',
                                padding: '0.65rem',
                                background: '#FFFFFF',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-xs)',
                                fontSize: '0.88rem'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                              Alternate Phone
                            </label>
                            <input
                              type="tel"
                              name="alternatePhone"
                              value={formData.alternatePhone}
                              onChange={handleInputChange}
                              placeholder="Family phone"
                              style={{
                                width: '100%',
                                padding: '0.65rem',
                                background: '#FFFFFF',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-xs)',
                                fontSize: '0.88rem'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="festive-card" style={{ padding: '1.5rem' }}>
                <h3 style={{
                  color: 'var(--text-dark)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Lock size={18} color="var(--crimson-royal)" />
                  <span>Payment Method</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Razorpay Online */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-xs)',
                      border: paymentMethod === 'RAZORPAY' ? '2px solid var(--crimson-royal)' : '1px solid var(--border-subtle)',
                      background: paymentMethod === 'RAZORPAY' ? 'rgba(139, 24, 24, 0.05)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        style={{ accentColor: 'var(--crimson-royal)', width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ color: 'var(--text-dark)', fontWeight: 800, fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <CreditCard size={17} color="var(--crimson-royal)" />
                          <span>Pay Online via Razorpay</span>
                        </div>
                        <div style={{ color: 'var(--text-body)', fontSize: '0.78rem', marginTop: '2px' }}>
                          Instant UPI (GPay, PhonePe, Paytm, CRED), Cards & Netbanking
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      color: '#047857',
                      fontWeight: 800,
                      background: 'rgba(4, 120, 87, 0.1)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px'
                    }}>
                      ⚡ FASTEST DISPATCH
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-xs)',
                      border: paymentMethod === 'COD' ? '2px solid var(--crimson-royal)' : '1px solid var(--border-subtle)',
                      background: paymentMethod === 'COD' ? 'rgba(139, 24, 24, 0.05)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        style={{ accentColor: 'var(--crimson-royal)', width: '18px', height: '18px' }}
                      />
                      <div>
                        <div style={{ color: 'var(--text-dark)', fontWeight: 800, fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Banknote size={17} color="var(--gold-warm)" />
                          <span>Cash on Delivery / UPI on Arrival</span>
                        </div>
                        <div style={{ color: 'var(--text-body)', fontSize: '0.78rem', marginTop: '2px' }}>
                          Pay with cash or delivery agent QR code at your doorstep
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      AVAILABLE
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Instant CTA */}
            <div style={{ position: 'sticky', top: '5.5rem' }}>
              <div className="festive-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ color: 'var(--text-dark)', fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 800 }}>
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  marginBottom: '1.5rem',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{
                        position: 'relative',
                        width: '52px',
                        height: '52px',
                        flexShrink: 0,
                        borderRadius: 'var(--radius-xs)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="52px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: 'var(--text-dark)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Qty: {quantity} × ₹{product.price} ({product.piecesCount} Pcs)
                        </div>
                      </div>
                      <div style={{ color: 'var(--crimson-royal)', fontWeight: 800, fontSize: '0.92rem' }}>
                        ₹{product.price * quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Applied Tag */}
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

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
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
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    paddingTop: '0.75rem',
                    borderTop: '1.5px solid var(--border-subtle)',
                    marginTop: '0.35rem'
                  }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--crimson-royal)' }}>₹{total}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    fontSize: '1rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-crimson)'
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </span>
                  ) : paymentMethod === 'RAZORPAY' ? (
                    <span>Pay ₹{total} via Razorpay (1-Click)</span>
                  ) : (
                    <span>Confirm Order • Pay ₹{total} on Delivery</span>
                  )}
                </button>

                {/* Guarantee Banner */}
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
                    <span>256-Bit SSL Encrypted • 100% Free Breakage Replacement Guarantee</span>
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
