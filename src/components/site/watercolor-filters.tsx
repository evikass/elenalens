'use client'

/**
 * SVG filter definitions for real watercolor effect.
 *
 * Real watercolor has:
 *  1. PAINT BLEEDING — colors spread at edges (feDisplacementMap with high scale)
 *  2. PAPER GRAIN — visible texture from paper (feTurbulence high freq + multiply blend)
 *  3. WHITE UNPAINTED SPOTS — paper showing through where paint didn't reach
 *  4. SATURATION BOOST — pigments are more saturated than photo
 *  5. SHARP EDGES — NOT overall blur (blur kills watercolor look)
 *
 * We define 4 intensity levels so the watercolor slider (0-100%) can pick
 * the right filter. Each level increases displacement scale, paper grain
 * opacity, and white spot density.
 *
 * Usage: <img style={{ filter: 'url(#watercolor-medium) saturate(1.3)' }} />
 *
 * IMPORTANT: This component must be rendered somewhere on the page for the
 * filters to be available. We include it once in page.tsx.
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
            ============================================================ */}
        <filter id="watercolor-light" x="-5%" y="-5%" width="110%" height="110%">
          {/* Paper grain texture */}
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
                    0 0 0 0.18 0"
            result="paperTexture"
          />

          {/* Paint bleeding — displacement with low freq noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="bleeded"
          />

          {/* Slight saturation boost */}
          <feColorMatrix
            in="bleeded"
            type="saturate"
            values="1.25"
            result="saturated"
          />

          {/* Blend paper texture in multiply mode */}
          <feBlend
            in="saturated"
            in2="paperTexture"
            mode="multiply"
            result="withPaper"
          />

          {/* White unpainted spots — paper showing through */}
          <feColorMatrix
            in="bleedNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.4 -0.25"
            result="whiteMask"
          />
          <feComposite
            in="whiteMask"
            in2="withPaper"
            operator="over"
          />
        </filter>

        {/* ============================================================
            MEDIUM watercolor — for 34-66% strength
            ============================================================ */}
        <filter id="watercolor-medium" x="-8%" y="-8%" width="116%" height="116%">
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
                    0 0 0 0.28 0"
            result="paperTexture"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010"
            numOctaves="3"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="14"
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

          <feBlend
            in="contrastAdjusted"
            in2="paperTexture"
            mode="multiply"
            result="withPaper"
          />

          <feColorMatrix
            in="bleedNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.5 -0.30"
            result="whiteMask"
          />
          <feComposite
            in="whiteMask"
            in2="withPaper"
            operator="over"
          />
        </filter>

        {/* ============================================================
            STRONG watercolor — for 67-100% strength
            ============================================================ */}
        <filter id="watercolor-strong" x="-12%" y="-12%" width="124%" height="124%">
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
                    0 0 0 0.38 0"
            result="paperTexture"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008"
            numOctaves="3"
            seed="5"
            result="bleedNoise"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="softSource" />
          <feDisplacementMap
            in="softSource"
            in2="bleedNoise"
            scale="24"
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

          <feBlend
            in="contrastAdjusted"
            in2="paperTexture"
            mode="multiply"
            result="withPaper"
          />

          {/* More white spots at strong intensity */}
          <feColorMatrix
            in="bleedNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.6 -0.35"
            result="whiteMask"
          />
          <feComposite
            in="whiteMask"
            in2="withPaper"
            operator="over"
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
