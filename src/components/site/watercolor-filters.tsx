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
 * React component that renders a THIN TORN paper-edge overlay.
 *
 * APPROACH: SVG <mask> with radial gradient + feDisplacementMap.
 *
 * The mask is a radial gradient with VERY NARROW transition (1-2%),
 * then feDisplacementMap distorts the boundary by fractal noise —
 * creating IRREGULAR TORN edge.
 *
 * Color is WARM BEIGE at LOW OPACITY (0.3-0.6) — looks like subtle
 * watercolor paper edge, not stark white frame.
 *
 * SVG uses viewBox + preserveAspectRatio='none' so the gradient
 * stretches to any aspect ratio. Displacement scale is in user units
 * (0-100 viewBox space) so it's consistent across photo sizes.
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters — VERY THIN rim (1-2%) with TORN edge
  let innerStop: number
  let outerStop: number
  let opacity: number
  let displacement: number

  if (strength <= 33) {
    // Light: 2% rim, subtle
    innerStop = 97
    outerStop = 99.5
    opacity = 0.3 + (strength / 33) * 0.15 // 0.30 → 0.45
    displacement = 4
  } else if (strength <= 66) {
    // Medium: 1.5% rim, more visible
    innerStop = 98
    outerStop = 99.7
    opacity = 0.4 + ((strength - 33) / 33) * 0.15 // 0.40 → 0.55
    displacement = 5
  } else {
    // Strong: 1% rim, prominent
    innerStop = 98.5
    outerStop = 99.8
    opacity = 0.5 + ((strength - 66) / 34) * 0.15 // 0.50 → 0.65
    displacement = 6
  }

  // Unique IDs
  const uid = `wc${++maskIdCounter}`
  const maskId = `mask-${uid}`
  const filterId = `torn-${uid}`
  const gradId = `grad-${uid}`

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Radial gradient: black center → white edge.
            VERY NARROW transition (1-2% at outer edge). */}
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" />
          <stop offset={`${innerStop}%`} stopColor="black" />
          <stop offset={`${outerStop}%`} stopColor="white" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>
        {/* feDisplacementMap distorts gradient boundary by fractal noise.
            scale 4-6 in viewBox units (100x100) = visible torn effect
            on the narrow 1-2% transition zone. */}
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            seed="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={displacement}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <mask id={maskId}>
          <rect
            width="100"
            height="100"
            fill={`url(#${gradId})`}
            filter={`url(#${filterId})`}
          />
        </mask>
      </defs>
      {/* Warm beige paper rect — NOT pure white.
          Visible only at thin torn rim (outer 1-2%), hidden in center. */}
      <rect
        width="100"
        height="100"
        fill="rgb(245, 238, 225)"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
