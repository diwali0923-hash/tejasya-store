'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  pieces: string;
  individualPrice: number;
  mrp: number;
  image: string;
  badge: string;
  highlight: string;
}

const COLLECTION_ITEMS: ComponentItem[] = [
  {
    id: 'blue-pottery',
    name: 'Royal Jaipur Blue Pottery Ceramic Diyas',
    pieces: '6 Pcs',
    individualPrice: 799,
    mrp: 1299,
    image: '/images/blue_pottery_hero.png',
    badge: 'HEIRLOOM GLAZED STONEWARE',
    highlight: 'Glossy indigo floral motifs with leaf beak. Reusable forever.'
  },
  {
    id: 'clay-diyas',
    name: 'Handpainted Terracotta Mitti Diyas',
    pieces: '24 Pcs',
    individualPrice: 599,
    mrp: 999,
    image: '/images/clay_diyas_hero.png',
    badge: '3D BEADED GOLD RIM',
    highlight: 'Natural riverbed clay in 4 vibrant festival hues with raised gold trim.'
  },
  {
    id: 'gel-candles',
    name: 'Jewel-Toned Glass Jelly Gel Candles',
    pieces: '12 Pcs',
    individualPrice: 499,
    mrp: 799,
    image: '/images/gel_candles_hero.png',
    badge: '100% SMOKELESS',
    highlight: 'Translucent jewel gel in glass votives with stained-glass glowing refractions.'
  },
  {
    id: 'floral-wax',
    name: 'Handmade Floral Lotus Wax Diya Candles',
    pieces: '10 Pcs',
    individualPrice: 549,
    mrp: 799,
    image: '/images/collection_grid.png',
    badge: 'BOX EXCLUSIVE',
    highlight: 'Intricately molded lotus clay petals with pre-poured long-burning wax.'
  }
];

export default function CollectionComparison() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const collectionProduct = PRODUCTS[0]; // The 52-Piece Box
  const [activeItem, setActiveItem] = useState<ComponentItem>(COLLECTION_ITEMS[0]);
  const [isAdded, setIsAdded] = useState(false);

  const totalIndividualPrice = COLLECTION_ITEMS.reduce((sum, item) => sum + item.individualPrice, 0); // 2446
  const totalMrp = COLLECTION_ITEMS.reduce((sum, item) => sum + item.mrp, 0); // 3896
  const boxPrice = collectionProduct.price; // 1699
  const totalSavings = totalIndividualPrice - boxPrice; // 747

  const handleAddBox = () => {
    addToCart(collectionProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNowBox = () => {
    buyNow(collectionProduct, 1);
    router.push('/checkout');
  };

  return (
    <section
      id="collection-comparison"
      style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, #180808 0%, #2A0E0E 50%, #150505 100%)',
        position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Golden Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224, 43, 43, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <span className="festive-pill-gold" style={{ fontSize: '0.8rem', padding: '0.35rem 1rem' }}>
              <Sparkles size={14} color="var(--crimson-royal)" />
              <span>VALUE BREAKDOWN & PRICE ANCHOR</span>
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 2.9rem)',
            color: '#FFFFFF',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            textShadow: '0 2px 14px rgba(0,0,0,0.5)'
          }}>
            Why the 52-Piece Collection is the Smartest Choice
          </h2>

          <p style={{
            color: '#E8DEC9',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.6
          }}>
            Purchased piece-by-piece, these handcrafted lighting suites retail at{' '}
            <strong style={{ color: '#FFE082' }}>₹{totalIndividualPrice.toLocaleString()}</strong>.
            Packaged as our master ceremonial suite, you save an instant{' '}
            <strong style={{ color: '#4ADE80' }}>₹{totalSavings.toLocaleString()}</strong>.
          </p>
        </div>

        {/* Dual Column Layout: Interactive Explorer & Grand Savings Anchor */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Column 1: The 4 Component Breakdown (Interactive) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(212, 175, 55, 0.25)',
            borderRadius: 'var(--radius-xs)',
            padding: 'clamp(1.2rem, 3vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Option A: Purchased Individually
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, marginTop: '0.2rem' }}>
                  4 Individual Items
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', color: '#A39988', textDecoration: 'line-through', display: 'block' }}>
                  MRP ₹{totalMrp.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.7rem', color: '#FFFFFF', fontWeight: 800 }}>
                  ₹{totalIndividualPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* List of 4 Items with Active Preview Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              {COLLECTION_ITEMS.map((item) => {
                const isSelected = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.14)' : 'rgba(0, 0, 0, 0.35)',
                      border: isSelected ? '1.5px solid var(--gold-radiant)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.9rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      transform: isSelected ? 'translateX(4px)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '4px',
                        background: '#3A1414',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="44px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.92rem' }}>
                            {item.name}
                          </span>
                          <span style={{
                            background: 'rgba(212, 175, 55, 0.25)',
                            color: '#FFE082',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '3px'
                          }}>
                            {item.pieces}
                          </span>
                        </div>
                        <span style={{ color: '#BDB19C', fontSize: '0.78rem', display: 'block', marginTop: '0.2rem' }}>
                          {item.highlight}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'line-through', display: 'block' }}>
                        ₹{item.mrp}
                      </span>
                      <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#F5C542' }}>
                        ₹{item.individualPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note below list */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#A89E8D' }}>
              <Zap size={15} color="#F5C542" />
              <span>Tap any item above to preview its craft and specifications.</span>
            </div>
          </div>

          {/* Column 2: The Master 52-Piece Hamper (Psychological Anchor & Winner) */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(82, 12, 12, 0.85) 0%, rgba(35, 8, 8, 0.95) 100%)',
            border: '2px solid var(--gold-bright)',
            borderRadius: 'var(--radius-xs)',
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.2)'
          }}>
            {/* Top Recommended Banner */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #D4AF37 0%, #FFDF73 50%, #D4AF37 100%)',
              color: '#3B0909',
              fontWeight: 900,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              padding: '0.4rem 1.4rem',
              borderRadius: '20px',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}>
              <Sparkles size={13} />
              <span>RECOMMENDED • BEST VALUE CHOICE</span>
            </div>

            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#FFE082', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Option B: The Complete Suite
              </span>
              <h3 style={{ fontSize: '1.65rem', color: '#FFFFFF', fontWeight: 800, marginTop: '0.3rem', lineHeight: 1.25 }}>
                The Royal Deepotsav 52-Piece Box
              </h3>
              <p style={{ color: '#E8DEC9', fontSize: '0.88rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                Contains all 4 collections seamlessly boxed together in shockproof packaging.
              </p>
            </div>

            {/* Price Contrast Display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 'var(--radius-xs)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 900, color: '#FFE082', lineHeight: 1 }}>
                  ₹{boxPrice.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.2rem', color: '#A39988', textDecoration: 'line-through' }}>
                  ₹{totalIndividualPrice.toLocaleString()}
                </span>
                <span style={{
                  background: 'rgba(74, 222, 128, 0.2)',
                  border: '1px solid #4ADE80',
                  color: '#4ADE80',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  marginLeft: 'auto'
                }}>
                  SAVE ₹{totalSavings.toLocaleString()} EXTRA
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#FDF6E2', marginTop: '0.65rem' }}>
                Anchor MRP: <span style={{ textDecoration: 'line-through' }}>₹{collectionProduct.originalPrice.toLocaleString()}</span> (51% Off) • Dispatches in 24 Hours
              </div>
            </div>

            {/* Benefits Checklist */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#FDF6E2', fontSize: '0.9rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="#3B0909" strokeWidth={3} />
                </div>
                <span><strong>All 52 Pieces Included:</strong> Ceramics, clay mitti, jewel gels, & floral wax</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#FDF6E2', fontSize: '0.9rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="#3B0909" strokeWidth={3} />
                </div>
                <span><strong>Instant ₹747 Cash Savings</strong> vs purchasing separate listings</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#FDF6E2', fontSize: '0.9rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="#3B0909" strokeWidth={3} />
                </div>
                <span><strong>Zero-Breakage Transit Guarantee:</strong> 100% free instant replacements</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#FDF6E2', fontSize: '0.9rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gold-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="#3B0909" strokeWidth={3} />
                </div>
                <span><strong>Complimentary Long-Staple Cotton Wicks</strong> packed with each set</span>
              </li>
            </ul>

            {/* CTAs */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleBuyNowBox}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1rem',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 6px 25px rgba(212, 175, 55, 0.45)'
                }}
              >
                <span>⚡ Buy Now — ₹{boxPrice.toLocaleString()} (Instant Checkout)</span>
              </button>

              <button
                onClick={handleAddBox}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  justifyContent: 'center',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#FFE082',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <ShoppingBag size={16} />
                <span>{isAdded ? '✓ Added to Your Bag!' : 'Add Box to Bag'}</span>
              </button>

              <Link
                href={`/product/${collectionProduct.slug}`}
                style={{
                  color: '#FFE082',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  marginTop: '0.25rem'
                }}
              >
                <span>View Full Specifications & Gallery</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
