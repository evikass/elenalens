'use client'

/**
 * SVG filter definitions for real watercolor effect.
 *
 * Real watercolor has:
 *  1. PAINT BLEEDING — colors spread at edges (feDisplacementMap with high scale)
 *  2. PAPER GRAIN — subtle overall texture (feTurbulence + multiply, low opacity)
 *  3. WHITE UNPAINTED EDGES — paper showing through ONLY at photo BORDERS
 *     (NOT in the middle — previous version had 'web-like' haze across photo)
 *  4. SATURATION BOOST — pigments are more saturated than photo
 *  5. SHARP EDGES — NOT overall blur (blur kills watercolor look)
 *
 * KEY FIX: edge mask now has HARD transition — 0-80% radius fully transparent,
 * only 80-100% (outer ~15-20% of photo) gets white unpainted spots.
 * Center stays 100% clean.
 *
 * Usage: <img style={{ filter: 'url(#watercolor-medium) saturate(1.3)' }} />
 */
export function WatercolorFilters() {
  // Inline SVG strings for edge masks — sharp transition, only outer rim.
  // 0-78% radius: black (transparent), 78-100%: white (opaque)
  // This confines white spots to outer ~15-20% of the photo.
  const edgeMaskLight = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='78%25' stop-color='black' stop-opacity='0'/><stop offset='82%25' stop-color='white' stop-opacity='0.5'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>`

  const edgeMaskMedium = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='52%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='76%25' stop-color='black' stop-opacity='0'/><stop offset='80%25' stop-color='white' stop-opacity='0.6'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>`

  const edgeMaskStrong = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='55%25'><stop offset='0%25' stop-color='black' stop-opacity='0'/><stop offset='73%25' stop-color='black' stop-opacity='0'/><stop offset='78%25' stop-color='white' stop-opacity='0.75'/><stop offset='100%25' stop-color='white' stop-opacity='1'/></radialGradient></defs><rect width='100' height='100' fill='url(%23m)'/></svg>`

  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* ============================================================
            LIGHT watercolor — for 1-33% strength
            White spots confined to outer ~20% rim via hard radial mask.
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

          {/* Paper grain texture (overall, very low opacity) */}
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
            result="withPaper"
          />

          {/* EDGE-ONLY white spots — large sparse blobs, masked to rim */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="11"
            result="edgeNoise"
          />
          {/* Higher threshold = fewer, larger spots (less web-like) */}
          <feColorMatrix
            in="edgeNoise"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.55 -0.42"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          {/* Hard radial edge mask — center 0-78% transparent, only rim opaque */}
          <feImage href={edgeMaskLight} result="edgeMask" preserveAspectRatio="none" />
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
                    0 0 0 0.10 0"
            result="paperTextureMed"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureMed"
            mode="multiply"
            result="withPaper"
          />

          {/* Edge-only white spots — larger blobs, harder threshold */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
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
                    0 0 0 0.65 -0.45"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          <feImage href={edgeMaskMedium} result="edgeMask" preserveAspectRatio="none" />
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
                    0 0 0 0.14 0"
            result="paperTextureStrong"
          />
          <feBlend
            in="contrastAdjusted"
            in2="paperTextureStrong"
            mode="multiply"
            result="withPaper"
          />

          {/* Edge-only white spots — large blobs, hard threshold */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013"
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
                    0 0 0 0.75 -0.48"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          <feImage href={edgeMaskStrong} result="edgeMask" preserveAspectRatio="none" />
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
