'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { fetchAllOrders, updateFulfillmentStatus } from '@/lib/orderService';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  ExternalLink,
  Copy,
  Check,
  Package,
  Database,
  ArrowLeft,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const DEFAULT_ADMIN_PASSCODE = 'tejasya2026';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [orderId: string]: string }>({});

  // Check session authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('tejasya_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadOrders();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;

    if (enteredPasscode.trim() === targetPasscode.trim()) {
      sessionStorage.setItem('tejasya_admin_auth', 'true');
      setIsAuthenticated(true);
      setPasscodeError(false);
      loadOrders();
    } else {
      setPasscodeError(true);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('tejasya_admin_auth');
    setIsAuthenticated(false);
    setEnteredPasscode('');
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = (order: Order) => {
    const addr = order.shippingAddress;
    const formatted = `Name: ${addr.fullName}
Phone: ${addr.phone}${addr.alternatePhone ? ` (Alt: ${addr.alternatePhone})` : ''}
House/Flat: ${addr.houseFlatBuilding}
Street/Area: ${addr.roadAreaColony}
${addr.landmark ? `Landmark: ${addr.landmark}` : ''}
City: ${addr.city}
State: ${addr.state}
Pincode: ${addr.pincode}`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['fulfillmentStatus']) => {
    await updateFulfillmentStatus(orderId, newStatus);
    loadOrders();
  };

  const handleSaveMeeshoId = async (orderId: string) => {
    const meeshoId = editingNotes[orderId];
    if (meeshoId !== undefined) {
      await updateFulfillmentStatus(orderId, 'ordered_on_meesho', meeshoId);
      loadOrders();
    }
  };

  // Render Passcode Gate if not authenticated
  if (isAuthenticated === false) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem'
      }}>
        <div className="artisan-card" style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-antique)',
            margin: '0 auto 1.25rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={26} color="var(--crimson-royal)" />
          </div>

          <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Operations & Fulfillment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Authorized access only. Enter the master passcode to view orders and Meesho routing.
          </p>

          <form onSubmit={handlePasscodeSubmit}>
            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={enteredPasscode}
                onChange={(e) => {
                  setEnteredPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                required
                placeholder="Enter Passcode"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 1rem',
                  background: '#FFFFFF',
                  border: passcodeError ? '2px solid var(--terracotta)' : '1px solid var(--border-antique)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.1em'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passcodeError && (
              <div style={{
                color: 'var(--terracotta)',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}>
                <AlertCircle size={15} />
                <span>Incorrect passcode. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem' }}
            >
              <KeyRound size={17} />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tejasya Living • Protected Internal Dispatch Center
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const unfulfilledCount = orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length;
  const estimatedProfit = Math.round(totalRevenue * 0.62);

  return (
    <div style={{ padding: '2.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <Link href="/" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={14} /> Back to Storefront
            </Link>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--text-primary)', fontWeight: 700 }}>
              Meesho Reselling <span style={{ color: 'var(--crimson-royal)', fontStyle: 'italic' }}>Fulfillment Center</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage orders, copy customer addresses, and order directly on Meesho in one click.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: isSupabaseConfigured ? 'rgba(36, 88, 57, 0.1)' : 'var(--bg-surface-subtle)',
              border: `1px solid ${isSupabaseConfigured ? 'var(--forest-green)' : 'var(--border-antique)'}`,
              fontSize: '0.8rem',
              color: isSupabaseConfigured ? 'var(--forest-green)' : 'var(--text-secondary)'
            }}>
              <Database size={15} />
              <span>{isSupabaseConfigured ? 'Supabase Live Connected' : 'Local Storage Mode'}</span>
            </div>

            <button
              onClick={loadOrders}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleSignOut}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', color: 'var(--terracotta)' }}
              title="Lock Admin Dashboard"
            >
              <Lock size={14} />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Analytics Top Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="artisan-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {orders.length}
            </div>
          </div>

          <div className="artisan-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING MEESHO PLACEMENT</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: unfulfilledCount > 0 ? 'var(--terracotta)' : 'var(--forest-green)', marginTop: '0.25rem' }}>
              {unfulfilledCount}
            </div>
          </div>

          <div className="artisan-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--crimson-royal)', marginTop: '0.25rem' }}>
              ₹{totalRevenue}
            </div>
          </div>

          <div className="artisan-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTIMATED NET PROFIT (62%)</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--forest-green)', marginTop: '0.25rem' }}>
              +₹{estimatedProfit}
            </div>
          </div>
        </div>

        {/* Orders Queue */}
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Customer Orders Queue ({orders.length})
          </h2>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--crimson-royal)' }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="artisan-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <Package size={44} color="var(--terracotta)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No orders placed yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Place a test order on the storefront to see it appear here with customer address and Meesho forward-shipping links.
              </p>
              <Link href="/" className="btn-primary">
                Go to Storefront & Place Test Order
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((order) => {
                const isUnfulfilled = order.fulfillmentStatus === 'unfulfilled';

                return (
                  <div
                    key={order.id}
                    className="artisan-card"
                    style={{
                      padding: '1.5rem',
                      border: isUnfulfilled ? '1px solid var(--terracotta)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Top Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1rem',
                      marginBottom: '1.25rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--crimson-royal)' }}>
                            {order.id}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-full)',
                            background: order.paymentMethod === 'COD' ? 'var(--terracotta-soft)' : 'rgba(36, 88, 57, 0.1)',
                            color: order.paymentMethod === 'COD' ? 'var(--terracotta)' : 'var(--forest-green)',
                            border: `1px solid ${order.paymentMethod === 'COD' ? 'var(--terracotta)' : 'var(--forest-green)'}`
                          }}>
                            {order.paymentMethod === 'COD' ? 'Cash on Delivery (₹' + order.totalAmount + ')' : 'Paid Online via Razorpay (₹' + order.totalAmount + ')'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          style={{
                            background: '#FFFFFF',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-antique)',
                            borderRadius: 'var(--radius-xs)',
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="unfulfilled">Unfulfilled (Needs Meesho Placement)</option>
                          <option value="ordered_on_meesho">Ordered on Meesho</option>
                          <option value="dispatched">Dispatched by Meesho</option>
                          <option value="delivered">Delivered to Customer</option>
                        </select>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.5rem',
                      alignItems: 'start'
                    }}>
                      {/* Customer Address */}
                      <div style={{
                        background: 'var(--bg-canvas)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-dark)', fontWeight: 700, letterSpacing: '0.04em' }}>
                            CUSTOMER DELIVERY ADDRESS
                          </span>
                          <button
                            onClick={() => handleCopyAddress(order)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--border-antique)',
                              color: copiedId === order.id ? 'var(--forest-green)' : 'var(--text-secondary)',
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            {copiedId === order.id ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedId === order.id ? 'Copied' : 'Copy Full Address'}</span>
                          </button>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                          <div><strong>{order.shippingAddress.fullName}</strong></div>
                          <div>Phone: <strong>{order.shippingAddress.phone}</strong> {order.shippingAddress.alternatePhone && `(Alt: ${order.shippingAddress.alternatePhone})`}</div>
                          {order.customerEmail && <div>Email: {order.customerEmail}</div>}
                          <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                            {order.shippingAddress.houseFlatBuilding}, {order.shippingAddress.roadAreaColony}
                            {order.shippingAddress.landmark && <><br />Landmark: {order.shippingAddress.landmark}</>}
                            <br />
                            <strong>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Items & Meesho SKU Links */}
                      <div style={{
                        background: 'var(--bg-canvas)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-dark)', fontWeight: 700, display: 'block', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                          ORDERED ITEMS & MEESHO FORWARD-LINKS
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
                              <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                {item.quantity} × {item.productName}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Sold for: ₹{item.price} each (Total: ₹{item.price * item.quantity})
                              </div>

                              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {item.meeshoSkus.map((sku, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={`https://www.meesho.com/p/${sku}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{
                                      padding: '0.35rem 0.75rem',
                                      fontSize: '0.75rem',
                                      borderRadius: 'var(--radius-xs)'
                                    }}
                                  >
                                    <span>Open Meesho SKU #{sku}</span>
                                    <ExternalLink size={12} />
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                            Record Meesho Order ID / Tracking Number:
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              defaultValue={order.meeshoOrderIds || ''}
                              onChange={(e) => setEditingNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder="e.g. MSH-9481948291"
                              style={{
                                flex: 1,
                                padding: '0.45rem 0.65rem',
                                background: '#FFFFFF',
                                border: '1px solid var(--border-antique)',
                                borderRadius: 'var(--radius-xs)',
                                color: 'var(--text-primary)',
                                fontSize: '0.82rem'
                              }}
                            />
                            <button
                              onClick={() => handleSaveMeeshoId(order.id)}
                              className="btn-secondary"
                              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
