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
 * HYBRID APPROACH — combines reliable CSS with SVG noise for torn effect:
 *
 * 1. Outer div: white background (rgba(255,250,245)) with CSS radial-gradient
 *    as mask-image. Gradient: black center (overlay hidden = photo visible)
 *    to white edges (overlay visible = white paper). SHARP transition.
 *    This creates clean white rim with photo visible in center.
 *
 * 2. CSS mask-image ALSO includes an SVG noise layer (via url() with inline
 *    SVG data: URI). The noise is thresholded to binary black/white and
 *    composited with the radial gradient via mask-composite: intersect.
 *    This tears the gradient boundary — white areas of noise that fall
 *    in the gradient's black zone (center) REMAIN black (no white leak),
 *    but the boundary itself becomes irregular.
 *
 * Unlike feDisplacementMap (which always produces smooth fade because it
 * works on gradient pixels), this approach uses BINARY noise threshold
 * for true torn edges.
 */
export function WatercolorEdgeOverlay({ strength }: { strength: number }) {
  if (strength <= 0) return null

  // Per-strength parameters
  let innerStop: number      // where white STARTS (overlay begins)
  let outerStop: number      // where white is FULLY opaque
  let opacity: number
  let noiseScale: number     // SVG turbulence frequency for torn edge

  if (strength <= 33) {
    innerStop = 72
    outerStop = 80
    opacity = 0.7 + (strength / 33) * 0.2
    noiseScale = 0.025
  } else if (strength <= 66) {
    innerStop = 68
    outerStop = 78
    opacity = 0.8 + ((strength - 33) / 33) * 0.15
    noiseScale = 0.020
  } else {
    innerStop = 64
    outerStop = 76
    opacity = 0.9 + ((strength - 66) / 34) * 0.1
    noiseScale = 0.018
  }

  // SVG noise pattern as data: URI — threshold to binary black/white
  // This will be used as a SECOND mask layer, intersected with the radial gradient.
  const noiseSvg =
    `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>` +
    `<defs>` +
    `<filter id='n'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${noiseScale}' numOctaves='2' seed='5' result='noise'/>` +
    `<feColorMatrix in='noise' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.5 -0.6' result='bin'/>` +
    `</filter>` +
    `</defs>` +
    `<rect width='400' height='400' fill='black' filter='url(%23n)'/>` +
    `</svg>`

  // CSS mask: radial gradient (overlay visible at edges) + noise (torn effect)
  // mask-composite: intersect — overlay visible only where BOTH gradients are white
  const gradientMask = `radial-gradient(ellipse at center, transparent ${innerStop}%, black ${outerStop}%, black 100%)`
  const noiseMask = `url("${noiseSvg}")`

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'rgb(255, 250, 245)',
        maskImage: `${gradientMask}, ${noiseMask}`,
        WebkitMaskImage: `${gradientMask}, ${noiseMask}`,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: '100% 100%, 100% 100%',
        WebkitMaskSize: '100% 100%, 100% 100%',
        opacity,
      }}
    />
  )
}
