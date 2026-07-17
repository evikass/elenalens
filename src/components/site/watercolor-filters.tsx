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
 * APPROACH: CSS clip-path with polygon() — points on a circle with
 * random radial jitter create torn/organic boundary.
 *
 * The overlay is a white div that covers the entire photo. A clip-path
 * polygon removes the center, leaving only a torn rim. The polygon is
 * generated with:
 *   - N points evenly distributed around a circle
 *   - Each point's radius randomly jittered by ±jitter%
 *   - Smaller N + larger jitter = more torn/ragged look
 *
 * This is 100% reliable (clip-path: polygon is supported everywhere)
 * and creates TRUE torn edges because polygon vertices are sharp.
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters
  let innerRadius: number    // base radius of cutout (0-50, 50=full)
  let opacity: number
  let jitter: number         // radial jitter % for torn effect
  let points: number         // number of polygon points

  if (strength <= 33) {
    innerRadius = 38
    opacity = 0.7 + (strength / 33) * 0.2
    jitter = 4
    points = 24
  } else if (strength <= 66) {
    innerRadius = 35
    opacity = 0.8 + ((strength - 33) / 33) * 0.15
    jitter = 6
    points = 28
  } else {
    innerRadius = 32
    opacity = 0.9 + ((strength - 66) / 34) * 0.1
    jitter = 8
    points = 32
  }

  // Generate polygon points: circle with jittered radius.
  // The polygon defines the CUTOUT (center that's removed = photo visible).
  // We use 'evenodd' fill rule so the polygon creates a hole in the div.
  //
  // Actually, clip-path: polygon can only define a single shape, not a
  // shape with a hole. So we need TWO polygons: outer (50% radius = full
  // div) and inner (jittered). CSS doesn't support multi-polygon clip-path
  // directly, but we can use 'evenodd' via SVG clipPath... or simpler:
  // use the polygon as the SHAPE, and the div's background covers everything
  // INSIDE the polygon. We want the opposite: cover OUTSIDE, hole INSIDE.
  //
  // Solution: make the polygon follow a star-like path that goes:
  //   - Outer corner (50% radius)
  //   - Inner point (jittered radius, photo visible)
  //   - Next outer corner
  //   - Next inner point
  //   - ... alternating around the circle
  // This creates a star polygon where the center is excluded.
  //
  // But clip-path removes everything OUTSIDE the polygon. So we need:
  //   - Polygon covers the entire div (outer points at corners/edges)
  //   - With a zigzag inner boundary that creates the torn hole
  //
  // Simpler approach: use a single polygon that traces a torn circle,
  // where points alternate between outer (50%) and inner (jittered).
  // The polygon fill covers everything between — but we want a HOLE.
  //
  // Best approach: TWO divs.
  //   - Bottom div: white, covers everything (clip-path: none)
  //   - Top div: same background as photo (or transparent with mix-blend)
  //     clipped to the inner jittered circle — punches a hole in the white
  //
  // Even simpler: use SVG with <path> using evenodd fill rule.
  // Generate path with two subpaths: outer rectangle + inner jittered circle.
  // Fill with evenodd → inner circle becomes a hole.

  // Generate inner circle points (jittered) — values 0-100 (SVG user units)
  const innerPoints: string[] = []
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI
    // Deterministic pseudo-random jitter (so it doesn't change on re-render)
    const seed = ((i * 7919 + 13) % 1000) / 1000
    const r = innerRadius + (seed - 0.5) * 2 * jitter
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    innerPoints.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }

  // SVG path: outer rectangle (full box) + inner jittered polygon (hole)
  // evenodd fill rule makes the inner polygon a hole — photo visible there
  const innerPath = `M ${innerPoints.join(' L ')} Z`
  const fullPath = `M 0,0 L 100,0 L 100,100 L 0,100 Z ${innerPath}`

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={fullPath}
        fill="rgb(255, 250, 245)"
        fillRule="evenodd"
      />
    </svg>
  )
}
