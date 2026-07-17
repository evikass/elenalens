'use client'

import type { CSSProperties } from 'react'

// Counter for unique SVG mask IDs (prevents collisions when multiple
// watercolor overlays are rendered on the same page)
let maskIdCounter = 0

/**
 * Watercolor filter system — split into two reliable parts:
 *
 * PART 1 — SVG filter (handles paint bleeding, paper grain, saturation):
 *   - feDisplacementMap with SMALL scale (2/4/6 for light/medium/strong)
 *     Higher scale warps faces like a funhouse mirror — that was the bug.
 *   - feTurbulence + feBlend multiply for paper grain
 *   - feColorMatrix type="saturate" for pigment boost
 *   NO white spots in SVG filter — they were unreliable (feImage with
 *   data: URI fails silently in Safari and some Chromium versions).
 *
 * PART 2 — CSS overlay div (handles white unpainted edges):
 *   getWatercolorEdgeOverlay(strength) returns CSSProperties for a div
 *   with radial-gradient background: transparent in center, white at
 *   edges. This div is placed over the <img> as a sibling, opacity
 *   scales with watercolor strength.
 *
 *   CSS gradients work reliably in ALL browsers — no feImage dependency.
 *
 * Usage in JSX:
 *   <div className="relative">
 *     <img src={...} style={{ filter: buildFilterString(adj) }} />
 *     {adj.watercolor > 0 && (
 *       <div
 *         className="absolute inset-0 pointer-events-none"
 *         style={getWatercolorEdgeOverlay(adj.watercolor)}
 *       />
 *     )}
 *   </div>
 */
export function WatercolorFilters() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* ============================================================
            LIGHT watercolor — for 1-33% strength
            scale=2 — almost no warping, hint of paint spread.
            ============================================================ */}
        <filter id="watercolor-light" x="-5%" y="-5%" width="110%" height="110%" filterUnits="objectBoundingBox">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bleeded"
          />
          <feColorMatrix
            in="bleeded"
            type="saturate"
            values="1.25"
            result="saturated"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
            result="paperGrain"
          />
          <feColorMatrix
            in="paperGrain"
            type="matrix"
            values="0 0 0 0 0.93
                    0 0 0 0 0.89
                    0 0 0 0 0.82
                    0 0 0 0.06 0"
            result="paperTextureLight"
          />
          <feBlend
            in="saturated"
            in2="paperTextureLight"
            mode="multiply"
          />
        </filter>

        {/* ============================================================
            MEDIUM watercolor — for 34-66% strength
            scale=4 — subtle but visible paint spread.
            ============================================================ */}
        <filter id="watercolor-medium" x="-8%" y="-8%" width="116%" height="116%" filterUnits="objectBoundingBox">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010"
            numOctaves="3"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bleeded"
          />
          <feColorMatrix
            in="bleeded"
            type="saturate"
            values="1.4"
            result="saturated"
          />
          <feColorMatrix
            in="saturated"
            type="matrix"
            values="1.05 0 0 0 0
                    0 1.05 0 0 0
                    0 0 1.05 0 0
                    0 0 0 1 0"
            result="contrastAdjusted"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
            result="paperGrain"
          />
          <feColorMatrix
            in="paperGrain"
            type="matrix"
            values="0 0 0 0 0.92
                    0 0 0 0 0.87
                    0 0 0 0 0.80
                    0 0 0 0.10 0"
            result="paperTextureMed"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureMed"
            mode="multiply"
          />
        </filter>

        {/* ============================================================
            STRONG watercolor — for 67-100% strength
            scale=6 — noticeable paint spread, still no face warping.
            ============================================================ */}
        <filter id="watercolor-strong" x="-12%" y="-12%" width="124%" height="124%" filterUnits="objectBoundingBox">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008"
            numOctaves="3"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bleeded"
          />
          <feColorMatrix
            in="bleeded"
            type="saturate"
            values="1.55"
            result="saturated"
          />
          <feColorMatrix
            in="saturated"
            type="matrix"
            values="1.08 0 0 0 0
                    0 1.08 0 0 0
                    0 0 1.08 0 0
                    0 0 0 1 0"
            result="contrastAdjusted"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.45"
            numOctaves="3"
            seed="3"
            stitchTiles="stitch"
            result="paperGrain"
          />
          <feColorMatrix
            in="paperGrain"
            type="matrix"
            values="0 0 0 0 0.91
                    0 0 0 0 0.85
                    0 0 0 0 0.78
                    0 0 0 0.14 0"
            result="paperTextureStrong"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureStrong"
            mode="multiply"
          />
        </filter>
      </defs>
    </svg>
  )
}

/**
 * Pick the right SVG filter id based on watercolor strength.
 * Returns empty string for 0% (no filter).
 */
export function getWatercolorFilterId(strength: number): string {
  if (strength <= 0) return ''
  if (strength <= 33) return 'watercolor-light'
  if (strength <= 66) return 'watercolor-medium'
  return 'watercolor-strong'
}

/**
 * React component that renders a white paper-edge overlay with TORN edges.
 *
 * APPROACH: SVG <mask> defines where the white overlay is VISIBLE.
 *
 * The mask contains:
 *   - Black background (overlay HIDDEN = photo visible)
 *   - White jittered polygon ring (overlay VISIBLE = white paper)
 *
 * The polygon ring is generated as a star-like shape:
 *   - Outer points at the box edges (50% radius, where overlay covers corners)
 *   - Inner points jittered around innerRadius (where photo shows through)
 *   - Alternating outer/inner points create a torn zigzag boundary
 *
 * The SVG has a white rect covering everything, masked by the ring shape.
 * Where mask is white (ring) → white paper visible.
 * Where mask is black (center + outside box) → photo visible.
 *
 * Result: photo visible in torn oval center, white paper at edges with
 * torn organic boundary between them.
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters
  let innerRadius: number    // base radius of photo-visible area (0-50)
  let opacity: number
  let jitter: number         // radial jitter % for torn effect
  let points: number         // number of polygon points

  if (strength <= 33) {
    innerRadius = 45
    opacity = 0.7 + (strength / 33) * 0.2
    jitter = 8
    points = 24
  } else if (strength <= 66) {
    innerRadius = 42
    opacity = 0.8 + ((strength - 33) / 33) * 0.15
    jitter = 10
    points = 28
  } else {
    innerRadius = 40
    opacity = 0.9 + ((strength - 66) / 34) * 0.1
    jitter = 12
    points = 32
  }

  // Generate jittered polygon points for the INNER boundary (photo area).
  // This polygon defines where the photo is VISIBLE (mask = black = hole).
  // The rest of the mask is white = white paper visible at edges.
  const holePoints: string[] = []
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI
    // Deterministic pseudo-random jitter
    const seed = ((i * 7919 + 13) % 1000) / 1000
    const r = innerRadius + (seed - 0.5) * 2 * jitter
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    holePoints.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }

  // Unique IDs
  const uid = `wc${++maskIdCounter}`
  const maskId = `mask-${uid}`

  // The mask: white background (paper visible) with black jittered polygon
  // hole in the center (photo visible through the hole).
  // TORN EDGES come from the jittered polygon vertices.
  const holePath = `M ${holePoints.join(' L ')} Z`

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          {/* White background = overlay VISIBLE (white paper at edges/corners) */}
          <rect width="100" height="100" fill="white" />
          {/* Black jittered polygon = overlay HIDDEN (photo visible in center) */}
          <path d={holePath} fill="black" />
        </mask>
      </defs>
      {/* White paper rect — visible everywhere EXCEPT the jittered hole
          (where photo shows through with torn organic boundary) */}
      <rect
        width="100"
        height="100"
        fill="rgb(255, 250, 245)"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
