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
 * PURE SVG APPROACH — generates torn mask from noise, no gradient:
 *
 * The mask is built from TWO sources composited together:
 *   1. Radial gradient (black center → white edges) — defines WHERE
 *      overlay is allowed (edges only, center stays clean)
 *   2. Fractal noise thresholded to binary — defines the TORN texture
 *
 * Composited via feComposite operator="arithmetic" k1=1 k2=0 k3=0 k4=0:
 *   result = noise * gradient
 *
 * This means:
 *   - Where gradient is black (center) → result is black (photo visible)
 *     regardless of noise — center STAYS clean
 *   - Where gradient is white (edges) → result = noise → torn white patches
 *   - Transition zone → torn boundary between black and white
 *
 * Unlike feDisplacementMap (smooth fade), this gives BINARY torn edges.
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters
  let innerStop: number      // where white STARTS (overlay begins)
  let outerStop: number      // where white is FULLY opaque
  let opacity: number
  let noiseScale: number     // SVG turbulence frequency

  if (strength <= 33) {
    innerStop = 72
    outerStop = 82
    opacity = 0.7 + (strength / 33) * 0.2
    noiseScale = 0.020
  } else if (strength <= 66) {
    innerStop = 68
    outerStop = 80
    opacity = 0.8 + ((strength - 33) / 33) * 0.15
    noiseScale = 0.016
  } else {
    innerStop = 64
    outerStop = 78
    opacity = 0.9 + ((strength - 66) / 34) * 0.1
    noiseScale = 0.014
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
      aria-hidden="true"
    >
      <defs>
        {/* Radial gradient: black center → white edges (WHERE overlay allowed) */}
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" />
          <stop offset={`${innerStop}%`} stopColor="black" />
          <stop offset={`${outerStop}%`} stopColor="white" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>

        {/* Filter: generate noise, threshold to binary, multiply by gradient */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          {/* Generate fractal noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency={noiseScale}
            numOctaves="2"
            seed="5"
            result="noise"
          />
          {/* Threshold noise to BINARY: alpha > 0.5 → 1, else → 0
              This creates RAGGED torn shapes, not smooth gradient. */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1.8 -0.7"
            result="binNoise"
          />
          {/* Multiply binary noise by the radial gradient:
              - Center (gradient=0): result=0 → black (photo visible)
              - Edges (gradient=1): result=noise → torn white patches
              - Transition: torn boundary */}
          <feComposite
            in="binNoise"
            in2="SourceGraphic"
            operator="arithmetic"
            k1="1"
            k2="0"
            k3="0"
            k4="0"
          />
        </filter>

        {/* Mask: rect filled with gradient, filtered to torn noise*gradient */}
        <mask id={maskId}>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${gradId})`}
            filter={`url(#${filterId})`}
          />
        </mask>
      </defs>

      {/* White paper rectangle — visible where mask is white (torn edges),
          hidden where mask is black (center) */}
      <rect
        width="100%"
        height="100%"
        fill="rgb(255, 250, 245)"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
