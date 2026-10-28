'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ExternalLink, Check } from 'lucide-react';

interface HotspotItem {
  id: string;
  name: string;
  pieces: string;
  price: number;
  slug?: string;
  isExclusive?: boolean;
  image: string;
  badge: string;
  x: number; // percentage from left
  y: number; // percentage from top
  floatingDelay: string;
}

const HOTSPOTS: HotspotItem[] = [
  {
    id: 'spot-blue-pottery',
    name: 'Royal Jaipur Blue Pottery Ceramic Diyas',
    pieces: 'Set of 6',
    price: 799,
    slug: 'handcrafted-jaipur-blue-pottery-ceramic-oil-diyas-set-of-6',
    image: '/images/blue_pottery_hero.png',
    badge: 'GLAZED STONEWARE',
    x: 24,
    y: 58,
    floatingDelay: '0s'
  },
  {
    id: 'spot-clay-diyas',
    name: 'Handpainted Terracotta Mitti Diyas',
    pieces: 'Pack of 24',
    price: 599,
    slug: 'handpainted-terracotta-clay-diyas-gold-border-24-pack',
    image: '/images/clay_diyas_hero.png',
    badge: '3D GOLD BEADED RIM',
    x: 72,
    y: 34,
    floatingDelay: '0.6s'
  },
  {
    id: 'spot-gel-candles',
    name: 'Jewel-Toned Glass Jelly Gel Candles',
    pieces: 'Pack of 12',
    price: 499,
    slug: 'jewel-toned-glass-jelly-gel-tealight-candles-pack-of-12',
    image: '/images/gel_candles_hero.png',
    badge: '100% SMOKELESS',
    x: 68,
    y: 72,
    floatingDelay: '1.2s'
  },
  {
    id: 'spot-floral-wax',
    name: 'Handmade Lotus Floral Wax Clay Diyas',
    pieces: 'Set of 10',
    price: 549,
    isExclusive: true,
    image: '/images/collection_grid.png',
    badge: 'BOX EXCLUSIVE',
    x: 38,
    y: 28,
    floatingDelay: '1.8s'
  }
];

interface Props {
  mainImage?: string;
  alt?: string;
}

export default function InteractiveCollectionHotspots({
  mainImage = '/images/collection_hero.png',
  alt = 'The Royal Deepotsav 52-Piece Luxury Artisanal Lighting Collection'
}: Props) {
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* 1. Main Packshot with Interactive Pulsing Hotspots */}
      <div
        className="festive-card"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'visible', // allow popovers to overflow cleanly
          marginBottom: '1.25rem',
          borderRadius: 'var(--radius-xs)',
          background: '#1F0A0A'
        }}
      >
        {/* The Base Packshot Image */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xs)'
        }}>
          <Image
            src={mainImage}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 550px"
            style={{ objectFit: 'cover' }}
          />

          {/* Subtle Ambient Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 40%, rgba(15, 3, 3, 0.45) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Interactive Hint Badge */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(20, 5, 5, 0.88)',
            border: '1px solid var(--gold-radiant)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '0.35rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#FFE082',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            pointerEvents: 'none',
            zIndex: 4,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <Sparkles size={12} color="var(--gold-bright)" />
            <span>Hover or tap glowing pins to explore items</span>
          </div>

          <span style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'var(--crimson-royal)',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-xs)',
            zIndex: 4
          }}>
            52-PIECE MASTER SUITE
          </span>
        </div>

        {/* 2. Pulsing Interactive Hotspots */}
        {HOTSPOTS.map((spot) => {
          const isActive = activeSpotId === spot.id;

          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 20 : 10
              }}
              onMouseEnter={() => setActiveSpotId(spot.id)}
              onMouseLeave={() => setActiveSpotId(null)}
            >
              {/* Floating Trigger Pin Container */}
              <div
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: `pinLevitate 2.8s ease-in-out infinite`,
                  animationDelay: spot.floatingDelay
                }}
                onClick={() => setActiveSpotId(isActive ? null : spot.id)}
              >
                {/* Outer Golden Expanding Pulse Ring */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '2px solid var(--gold-bright)',
                    animation: 'pinPulseRing 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
                    animationDelay: spot.floatingDelay,
                    pointerEvents: 'none'
                  }}
                />

                {/* Inner Glow Aura */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '2px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 224, 130, 0.9) 0%, rgba(212, 175, 55, 0.4) 70%, transparent 100%)',
                    filter: 'blur(3px)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Main Pin Button */}
                <div
                  style={{
                    position: 'relative',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isActive ? 'var(--gold-bright)' : '#6B1212',
                    border: '2px solid #FFFFFF',
                    color: isActive ? '#3B0909' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(212, 175, 55, 0.6)',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <span style={{ lineHeight: 1 }}>+</span>
                </div>
              </div>

              {/* 3. Animated Popover Card on Hover */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: spot.y > 60 ? 'auto' : '100%',
                    bottom: spot.y > 60 ? '100%' : 'auto',
                    left: spot.x > 60 ? 'auto' : '50%',
                    right: spot.x > 60 ? '-10px' : 'auto',
                    transform: spot.x > 60 ? (spot.y > 60 ? 'translateY(-12px)' : 'translateY(12px)') : 'translateX(-50%) translateY(12px)',
                    width: '270px',
                    maxWidth: 'calc(100vw - 2.5rem)',
                    background: 'rgba(25, 8, 8, 0.96)',
                    border: '1.5px solid var(--gold-radiant)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.9rem',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.35)',
                    animation: 'cardPopup 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    pointerEvents: 'auto',
                    zIndex: 100
                  }}
                >
                  {/* Top Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: 'var(--gold-bright)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}>
                      {spot.badge}
                    </span>
                    <span style={{
                      background: 'rgba(212, 175, 55, 0.2)',
                      color: '#FFE082',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '3px'
                    }}>
                      {spot.pieces}
                    </span>
                  </div>

                  {/* Thumbnail & Title Row */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      flexShrink: 0,
                      background: '#3A1414'
                    }}>
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        sizes="54px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        color: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        margin: 0
                      }}>
                        {spot.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFE082' }}>
                          ₹{spot.price}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#BDB19C' }}>
                          {spot.isExclusive ? 'Box Exclusive' : 'Separate Value'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Button */}
                  {spot.slug ? (
                    <Link
                      href={`/product/${spot.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.55rem 0.85rem',
                        background: 'linear-gradient(90deg, var(--gold-radiant) 0%, var(--gold-bright) 100%)',
                        color: '#3B0909',
                        borderRadius: 'var(--radius-xs)',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <span>Explore This Product Individually</span>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#4ADE80',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '0.3rem 0'
                    }}>
                      <Check size={14} />
                      <span>Included exclusively in this 52-Piece Hamper</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Floating Satellite Capsule Strip (Below Packshot) */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--crimson-royal)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Sparkles size={13} />
          <span>Tap to Inspect Each Included Suite:</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.65rem'
        }}>
          {HOTSPOTS.map((item, idx) => {
            const Content = (
              <div
                key={item.id}
                onMouseEnter={() => setActiveSpotId(item.id)}
                onMouseLeave={() => setActiveSpotId(null)}
                style={{
                  background: activeSpotId === item.id ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface)',
                  border: activeSpotId === item.id ? '1.5px solid var(--gold-bright)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.6rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  animation: `satelliteFloat 3.2s ease-in-out infinite`,
                  animationDelay: `${idx * 0.4}s`,
                  boxShadow: activeSpotId === item.id ? '0 6px 18px rgba(212, 175, 55, 0.25)' : 'var(--shadow-subtle)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  border: '1px solid rgba(212, 175, 55, 0.4)'
                }}>
                  <Image src={item.image} alt={item.name} fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name.replace('Royal Jaipur ', '').replace('Handpainted Terracotta ', '')}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--crimson-royal)', fontWeight: 800 }}>
                    {item.pieces} • ₹{item.price}
                  </span>
                </div>
              </div>
            );

            return item.slug ? (
              <Link key={item.id} href={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                {Content}
              </Link>
            ) : (
              <div key={item.id}>
                {Content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Embedded Animations */}
      <style jsx global>{`
        @keyframes pinLevitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes pinPulseRing {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.75);
            opacity: 0;
          }
          100% {
            transform: scale(1.75);
            opacity: 0;
          }
        }

        @keyframes satelliteFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes cardPopup {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
