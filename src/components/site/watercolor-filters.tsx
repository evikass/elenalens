'use client'

/**
 * SVG filter definitions for real watercolor effect.
 *
 * APPROACH — split work between SVG filter and reliable techniques:
 *
 *  1. Paint bleeding — feDisplacementMap with SMALL scale (2-6, not 14-24).
 *     Large scale warps faces like a funhouse mirror — that was the bug.
 *
 *  2. Paper grain — feTurbulence + feBlend multiply, low opacity.
 *
 *  3. White unpainted edges — feTurbulence + feColorMatrix (threshold)
 *     + feComposite with feImage data: URI containing radial gradient.
 *     The gradient is BLACK in center (0 alpha white spots) and WHITE
 *     at edges (full alpha white spots). feComposite operator="arithmetic"
 *     multiplies the white spots by this gradient, so spots only appear
 *     at photo rim.
 *
 *     The data: URI is carefully encoded:
 *       - '#' is encoded as %23
 *       - '%' in stop offsets is encoded as %25
 *       - We use single quotes inside to avoid HTML attribute escaping
 *
 *  4. Saturation boost — pigments are more saturated.
 *
 *  5. NO CSS blur — it kills edges (looked like foggy glass).
 */
export function WatercolorFilters() {
  // Radial gradient edge mask as inline SVG data URI.
  // Center (0-75% radius): black = alpha 0 = no white spots
  // 78-82%: transition to white (alpha 1)
  // 82-100%: white = alpha 1 = white spots fully visible
  // The '#' is encoded as %23, '%' in stop offsets as %25.
  // The radial gradient stretches to fill the photo bounding box.
  const edgeMaskLight = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='black'/><stop offset='75%25' stop-color='black'/><stop offset='82%25' stop-color='white' stop-opacity='0.6'/><stop offset='100%25' stop-color='white'/></radialGradient></defs><rect width='200' height='200' fill='url(%23m)'/></svg>"

  const edgeMaskMedium = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='black'/><stop offset='73%25' stop-color='black'/><stop offset='80%25' stop-color='white' stop-opacity='0.7'/><stop offset='100%25' stop-color='white'/></radialGradient></defs><rect width='200' height='200' fill='url(%23m)'/></svg>"

  const edgeMaskStrong = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><radialGradient id='m' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='black'/><stop offset='70%25' stop-color='black'/><stop offset='78%25' stop-color='white' stop-opacity='0.85'/><stop offset='100%25' stop-color='white'/></radialGradient></defs><rect width='200' height='200' fill='url(%23m)'/></svg>"

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
        <filter id="watercolor-light" x="-5%" y="-5%" width="110%" height="110%" filterUnits="objectBoundingBox">
          {/* Paint bleeding — scale=2 (was 6). No face warping. */}
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

          {/* Paper grain (very low opacity) */}
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

          {/* White spots — threshold noise into sparse white blobs */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
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
                    0 0 0 1.0 -0.50"
            result="whiteSpotsRaw"
          />
          <feComposite
            in="whiteSpotsRaw"
            in2="SourceAlpha"
            operator="in"
            result="whiteSpotsBounded"
          />
          {/* Multiply white spots by radial edge mask.
              k1=0, k2=1, k3=0, k4=0: result = (in * in2) — wait,
              arithmetic formula is: k1*i1*i2 + k2*i1 + k3*i2 + k4.
              With k1=0, k2=1, k3=0, k4=0: result = in1 (the white spots).
              We need k1=1 to multiply. Let's use k1=1, k2=0, k3=0, k4=0:
              result = whiteSpots * edgeMask.
              But this darkens — we want to KEEP white spots only where
              mask is white. So k1=1, others 0 is correct. */}
          <feImage href={edgeMaskLight} result="edgeMask" preserveAspectRatio="none" />
          <feComposite
            in="whiteSpotsBounded"
            in2="edgeMask"
            operator="arithmetic"
            k1="1"
            k2="0"
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
            result="withPaper"
          />

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
                    0 0 0 1.1 -0.52"
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
            k1="1"
            k2="0"
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
            result="withPaper"
          />

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
                    0 0 0 1.2 -0.55"
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
            k1="1"
            k2="0"
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
