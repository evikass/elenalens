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
 * APPROACH: SVG <mask> with binary noise threshold, limited to edge.
 *
 * Unlike feDisplacementMap (which always produces smooth gradient edges),
 * this generates BINARY torn spots from fractal noise:
 *   1. feTurbulence generates fractal noise
 *   2. feColorMatrix thresholds noise to binary black/white
 *      (alpha > threshold → 1, else → 0) — creates RAGGED torn spots
 *   3. feComposite 'in' with radial gradient limits spots to edge only
 *      (center stays black = photo visible, edge gets torn spots)
 *
 * Result: small torn beige streaks at photo edge, like brush didn't
 * reach — NOT smooth frame, NOT big white rim.
 *
 * Color is muted warm grey-beige at LOW opacity (0.2-0.5).
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters
  let innerStop: number      // where edge zone begins
  let outerStop: number      // where edge zone ends (always 100%)
  let opacity: number
  let noiseScale: number     // turbulence frequency (smaller = bigger spots)
  let threshold: number      // noise threshold for binary spots

  if (strength <= 33) {
    // Light: thin edge, few small spots
    innerStop = 95
    outerStop = 100
    opacity = 0.2 + (strength / 33) * 0.1 // 0.20 → 0.30
    noiseScale = 0.06   // medium spots
    threshold = 0.65    // fewer spots pass
  } else if (strength <= 66) {
    // Medium: more spots
    innerStop = 93
    outerStop = 100
    opacity = 0.3 + ((strength - 33) / 33) * 0.1 // 0.30 → 0.40
    noiseScale = 0.05
    threshold = 0.55
  } else {
    // Strong: dense torn spots
    innerStop = 91
    outerStop = 100
    opacity = 0.4 + ((strength - 66) / 34) * 0.1 // 0.40 → 0.50
    noiseScale = 0.04
    threshold = 0.45
  }

  // Unique IDs
  const uid = `wc${++maskIdCounter}`
  const maskId = `mask-${uid}`
  const filterId = `torn-${uid}`
  const gradId = `grad-${uid}`

  // feColorMatrix threshold formula: alpha_out = alpha_in * k - offset
  // We want: alpha > threshold → 1, else → 0
  // k = 1/(1-threshold), offset = threshold/(1-threshold)
  const k = 1 / (1 - threshold)
  const offset = threshold / (1 - threshold)

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Radial gradient: defines WHERE torn spots are allowed.
            Black center (0-innerStop%) → white edge (outerStop-100%).
            Only the white zone (edge) gets torn spots. */}
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" />
          <stop offset={`${innerStop}%`} stopColor="black" />
          <stop offset={`${outerStop}%`} stopColor="white" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>

        {/* Filter generates BINARY torn spots from noise, limited to edge:
            1. feTurbulence — fractal noise
            2. feColorMatrix — threshold to binary (creates ragged spots)
            3. feComposite 'in' with SourceGraphic (radial gradient) —
               limits spots to edge zone only, center stays black */}
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={noiseScale}
            numOctaves="2"
            seed="5"
            result="noise"
          />
          {/* Threshold noise to BINARY: alpha > threshold → 1, else → 0.
              Creates RAGGED torn spots, not smooth gradient. */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values={`0 0 0 0 1
                     0 0 0 0 1
                     0 0 0 0 1
                     0 0 0 ${k.toFixed(3)} ${(-offset).toFixed(3)}`}
            result="binNoise"
          />
          {/* Limit binary noise to edge zone only (where gradient is white).
              Center (gradient black) → result black (photo visible).
              Edge (gradient white) → result = torn spots. */}
          <feComposite
            in="binNoise"
            in2="SourceGraphic"
            operator="in"
          />
        </filter>

        <mask id={maskId}>
          {/* Rect filled with radial gradient, filtered to torn spots.
              The filter replaces the gradient with binary noise limited
              to the edge zone. */}
          <rect
            width="100"
            height="100"
            fill={`url(#${gradId})`}
            filter={`url(#${filterId})`}
          />
        </mask>
      </defs>
      {/* Muted warm grey-beige rect — NOT white.
          Visible only where mask is white (torn spots at edge),
          hidden in center (photo visible). */}
      <rect
        width="100"
        height="100"
        fill="rgb(215, 205, 185)"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
