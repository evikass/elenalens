'use client'

import type { CSSProperties } from 'react'

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
 * Get CSS background style for white paper-edge overlay with TORN edges.
 *
 * APPROACH: Layered radial-gradients with RANDOM OFFSET centers.
 * Each gradient is a small ellipse of "transparent" (center) → "white" (edge)
 * placed at a slightly off-center position. Combined via CSS mask-image
 * with mask-composite: subtract — we SUBTRACT the transparent holes
 * (where photo shows) from a fully white overlay.
 *
 * Result: white rim around photo with IRREGULAR, torn edges — no smooth
 * ellipse, looks like a brush that didn't reach the paper edge cleanly.
 *
 * No feDisplacementMap (it created white spots in the center — bug).
 * Pure CSS gradients are 100% reliable across all browsers.
 *
 * Returns null if no watercolor (strength = 0).
 */
export function getWatercolorEdgeOverlay(strength: number): CSSProperties | null {
  if (strength <= 0) return null

  // Per-strength parameters
  let coreSize: number      // % of radius where photo is fully visible
  let fadeWidth: number     // % of transition zone width
  let opacity: number
  let jitter: number        // how much offset positions vary (torn edge)

  if (strength <= 33) {
    coreSize = 72
    fadeWidth = 18
    opacity = 0.7 + (strength / 33) * 0.2 // 0.7 -> 0.9
    jitter = 10
  } else if (strength <= 66) {
    coreSize = 68
    fadeWidth = 22
    opacity = 0.8 + ((strength - 33) / 33) * 0.15 // 0.8 -> 0.95
    jitter = 14
  } else {
    coreSize = 64
    fadeWidth = 26
    opacity = 0.9 + ((strength - 66) / 34) * 0.1 // 0.9 -> 1.0
    jitter = 18
  }

  // Use ONLY 3 gradients with LARGE jitter and HARD transition (no fade).
  // With mask-composite: add (union), overlay is visible where ANY gradient
  // is opaque. The centered gradient creates the base rim. Two offset
  // gradients create torn irregularity — their opaque zones extend into
  // different parts of the rim, making the inner boundary irregular.
  //
  // HARD transition (transparent -> black at same stop) prevents alpha
  // buildup in transition zones that caused white spots in center.
  const fadeStop = coreSize + fadeWidth
  const gradients = [
    // Base centered gradient — creates the main rim
    `radial-gradient(ellipse 50% 50% at 50% 50%, ` +
    `transparent ${coreSize}%, black ${fadeStop}%, black 100%)`,
    // Offset gradient 1 — tears the top-left side
    `radial-gradient(ellipse 50% 50% at ${50 - jitter}% ${50 - jitter}%, ` +
    `transparent ${coreSize}%, black ${fadeStop}%, black 100%)`,
    // Offset gradient 2 — tears the bottom-right side
    `radial-gradient(ellipse 50% 50% at ${50 + jitter}% ${50 + jitter}%, ` +
    `transparent ${coreSize}%, black ${fadeStop}%, black 100%)`,
  ]

  // Combine all gradients — add (union) means overlay is visible where
  // ANY gradient is opaque (black). The inner boundary of the union is
  // determined by the smallest/earliest gradient, creating torn edges
  // because each gradient has a different center/size.
  const maskValue = gradients.join(', ')
  const webkitMaskValue = gradients.join(', ')

  return {
    background: 'rgba(255, 250, 245, 1)',
    maskImage: maskValue,
    WebkitMaskImage: webkitMaskValue,
    maskComposite: 'add',
    WebkitMaskComposite: 'source-over',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    opacity,
  }
}
