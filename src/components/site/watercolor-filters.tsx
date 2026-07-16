'use client'

/**
 * SVG filter definitions for real watercolor effect.
 *
 * Real watercolor has:
 *  1. PAINT BLEEDING — colors spread at edges (feDisplacementMap with high scale)
 *  2. PAPER GRAIN — visible texture from paper (feTurbulence high freq + multiply blend)
 *  3. WHITE UNPAINTED EDGES — paper showing through at photo BORDERS
 *     (not random spots in the middle — that looks like smoke/fog)
 *  4. SATURATION BOOST — pigments are more saturated than photo
 *  5. SHARP EDGES — NOT overall blur (blur kills watercolor look)
 *
 * KEY FIX: white unpainted spots are masked to EDGES only via radial gradient.
 * Center stays clean, edges get paper texture + white bleed.
 *
 * Usage: <img style={{ filter: 'url(#watercolor-medium) saturate(1.3)' }} />
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
            White spots masked to edges via feImage with inline SVG
            radial gradient (transparent center, opaque edges).
            ============================================================ */}
        <filter id="watercolor-light" x="-5%" y="-5%" width="110%" height="110%">
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

          {/* Saturation boost */}
          <feColorMatrix
            in="bleeded"
            type="saturate"
            values="1.25"
            result="saturated"
          />

          {/* Paper grain texture (overall, low opacity) */}
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
                    0 0 0 0.10 0"
            result="paperTextureLight"
          />
          <feBlend
            in="saturated"
            in2="paperTextureLight"
            mode="multiply"
            result="withPaper"
          />

          {/* Edge-only white spots — masked via radial gradient image */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed="11"
            result="edgeNoise"
          />
          <feColorMatrix
            in="edgeNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.6 -0.30"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          {/* Apply radial edge mask — light version */}
          <feImage href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='55%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='55%25' stop-color='black' stop-opacity='0'/><stop offset='80%25' stop-color='white' stop-opacity='0.4'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>" result="edgeMask" preserveAspectRatio="none" />
          <feComposite
            in="whiteSpotsBounded"
            in2="edgeMask"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            result="whiteSpotsEdgeOnly"
          />
          <feComposite
            in="whiteSpotsEdgeOnly"
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

          {/* Paper grain (medium opacity) */}
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
                    0 0 0 0.16 0"
            result="paperTextureMed"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureMed"
            mode="multiply"
            result="withPaper"
          />

          {/* Edge-only white spots — more visible than light */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="2"
            seed="11"
            result="edgeNoise"
          />
          <feColorMatrix
            in="edgeNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.7 -0.32"
            result="whiteSpotsRaw"
          />
          {/* Composite white spots within photo bounds */}
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          {/* Apply radial edge mask — multiply white spots by mask opacity
              (transparent in center, opaque at edges) */}
          <feImage href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='60%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='50%25' stop-color='black' stop-opacity='0'/><stop offset='78%25' stop-color='white' stop-opacity='0.55'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>" result="edgeMask" preserveAspectRatio="none" />
          <feComposite
            in="whiteSpotsBounded"
            in2="edgeMask"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            result="whiteSpotsEdgeOnly"
          />
          {/* Overlay edge-only white spots */}
          <feComposite
            in="whiteSpotsEdgeOnly"
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

          {/* Paper grain (strong) */}
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
                    0 0 0 0.22 0"
            result="paperTextureStrong"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureStrong"
            mode="multiply"
            result="withPaper"
          />

          {/* Edge-only white spots — most visible */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.030"
            numOctaves="2"
            seed="11"
            result="edgeNoise"
          />
          <feColorMatrix
            in="edgeNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.8 -0.35"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          {/* Stronger edge mask — more white at edges */}
          <feImage href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='65%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='48%25' stop-color='black' stop-opacity='0'/><stop offset='75%25' stop-color='white' stop-opacity='0.7'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>" result="edgeMask" preserveAspectRatio="none" />
          <feComposite
            in="whiteSpotsBounded"
            in2="edgeMask"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            result="whiteSpotsEdgeOnly"
          />
          <feComposite
            in="whiteSpotsEdgeOnly"
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
