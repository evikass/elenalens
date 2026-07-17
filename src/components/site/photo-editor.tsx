'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Sparkles, Check, Sun, Contrast, Moon, Thermometer, Brush } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getWatercolorFilterId, WatercolorEdgeOverlay } from './watercolor-filters'

export interface PhotoAdjustments {
  watercolor: number      // 0..100 — сила акварели (растекание краски)
  unpaint: number         // 0..100 — непрокрас краев (белая бумага у края)
  shadows: number         // 0..100 — вытягивание теней
  exposure: number        // -100..+100 — экспозиция
  warmth: number          // -100..+100 — теплый/холодный
  contrast: number        // -100..+100 — контрастность
}

export const defaultAdjustments: PhotoAdjustments = {
  watercolor: 0,
  unpaint: 0,
  shadows: 0,
  exposure: 0,
  warmth: 0,
  contrast: 0,
}

interface PhotoEditorProps {
  open: boolean
  src: string
  filename: string
  initial: PhotoAdjustments
  onClose: () => void
  onApply: (a: PhotoAdjustments) => void
}

// Build CSS filter string from adjustments.
// IMPORTANT: We do NOT use CSS blur for watercolor — it kills edges.
// Real watercolor texture (paint bleeding, paper grain, white spots)
// is done via SVG filter referenced by url(#watercolor-X).
// CSS only handles: saturation, brightness, contrast, sepia, hue-rotate.
export function buildFilterString(a: PhotoAdjustments): string {
  const wc = a.watercolor / 100         // 0..1
  const shadows = a.shadows / 100       // 0..1
  const exposure = a.exposure / 100     // -1..1
  const warmth = a.warmth / 100         // -1..1
  const contrast = a.contrast / 100     // -1..1

  // Watercolor: NO blur. Slight saturation boost + brightness lift.
  // The SVG filter (url(#watercolor-X)) does the real watercolor work:
  //   - paint bleeding (feDisplacementMap with high scale)
  //   - paper grain (feTurbulence + multiply blend)
  //   - white unpainted spots (feComposite)
  const wcSaturate = 1 + wc * 0.20      // up to 1.20
  const wcBrightness = 1 + wc * 0.04    // up to 1.04
  const wcContrast = 1 - wc * 0.05      // down to 0.95

  // Shadows lift: brighten + reduce contrast for shadow detail
  const shBrightness = 1 + shadows * 0.18
  const shContrast = 1 - shadows * 0.12

  // Exposure: linear brightness shift
  const expBrightness = 1 + exposure * 0.35

  // Warmth: positive = warm (sepia + red hue), negative = cool (blue hue)
  const sepia = warmth > 0 ? warmth * 0.35 : 0
  const hueRotate = warmth * 12
  const warmthSat = 1 + Math.abs(warmth) * 0.15

  // User contrast
  const userContrast = 1 + contrast * 0.4

  const filterParts: string[] = [
    `saturate(${(wcSaturate * warmthSat).toFixed(2)})`,
    `contrast(${(wcContrast * shContrast * userContrast).toFixed(2)})`,
    `brightness(${(wcBrightness * shBrightness * expBrightness).toFixed(2)})`,
    `sepia(${sepia.toFixed(2)})`,
    `hue-rotate(${hueRotate.toFixed(1)}deg)`,
  ]

  // Apply SVG watercolor filter if watercolor > 0
  const svgId = getWatercolorFilterId(a.watercolor)
  if (svgId) {
    filterParts.push(`url(#${svgId})`)
  }

  return filterParts.join(' ')
}

// Slider helper component
function Slider({
  label,
  icon: Icon,
  value,
  min,
  max,
  onChange,
  format,
}: {
  label: string
  icon: any
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {label}
        </label>
        <span className="text-sm font-mono text-foreground tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        className="wc-slider"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export function PhotoEditor({
  open,
  src,
  filename,
  initial,
  onClose,
  onApply,
}: PhotoEditorProps) {
  const [adj, setAdj] = useState<PhotoAdjustments>(initial)
  const [showOriginal, setShowOriginal] = useState(false)

  const filter = useMemo(() => buildFilterString(adj), [adj])

  // Apply SVG watercolor filter only if watercolor > 0
  // SVG watercolor filter id (light/medium/strong based on watercolor strength)
  // The SVG filter definitions live in <WatercolorFilters /> which is rendered once in page.tsx
  const svgFilterId = getWatercolorFilterId(adj.watercolor)

  const update = (key: keyof PhotoAdjustments) => (v: number) => {
    setAdj((prev) => ({ ...prev, [key]: v }))
  }

  const reset = () => setAdj(defaultAdjustments)

  const isDirty = JSON.stringify(adj) !== JSON.stringify(defaultAdjustments)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-background/98 backdrop-blur-md overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-serif text-lg">Редактор фото</span>
                  <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                    {filename}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  disabled={!isDirty}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Сбросить
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApply(adj)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  <Check className="h-4 w-4 mr-1" /> Применить
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid lg:grid-cols-2 gap-8">
            {/* Left: Side-by-side preview */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Original */}
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground text-center">
                    Оригинал
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-secondary">
                    <img
                      src={src}
                      alt="Оригинал"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                {/* With filter */}
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-primary text-center flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    С фильтром
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-primary/40 bg-secondary">
                    <img
                      src={src}
                      alt="С фильтром"
                      className="h-full w-full object-cover"
                      style={{ filter }}
                    />
                    {/* White paper-edge overlay for watercolor unpainted rim */}
                    <WatercolorEdgeOverlay strength={adj.unpaint} />
                  </div>
                </div>
              </div>

              {/* Hold-to-compare button */}
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={(e) => { e.preventDefault(); setShowOriginal(true) }}
                onTouchEnd={() => setShowOriginal(false)}
                className="w-full py-2.5 rounded-full border border-border text-xs uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors select-none"
              >
                {showOriginal ? '← Показываю оригинал' : 'Удерживайте для сравнения'}
              </button>

              {/* Full-width preview when holding */}
              <AnimatePresence>
                {showOriginal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-sm border-2 border-primary/60 shadow-2xl"
                  >
                    <img
                      src={src}
                      alt="Сравнение"
                      className="h-full w-full object-cover"
                      style={{ filter }}
                    />
                    {/* White paper-edge overlay */}
                    <WatercolorEdgeOverlay strength={adj.unpaint} />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/80 text-[10px] uppercase tracking-wider text-primary">
                      Текущий фильтр
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Sliders */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl mb-1">Параметры</h3>
                <p className="text-xs text-muted-foreground">
                  Настройки сохранятся для этого фото и применятся на сайте.
                </p>
              </div>

              <div className="p-5 rounded-sm border border-primary/30 bg-primary/5 space-y-5">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <strong>Акварельный эффект</strong>
                </div>
                <Slider
                  label="Сила акварели (растекание краски)"
                  icon={Sparkles}
                  value={adj.watercolor}
                  min={0}
                  max={100}
                  onChange={update('watercolor')}
                  format={(v) => `${v}%`}
                />
                <Slider
                  label="Непрокрас краёв (белая бумага)"
                  icon={Brush}
                  value={adj.unpaint}
                  min={0}
                  max={100}
                  onChange={update('unpaint')}
                  format={(v) => `${v}%`}
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <strong>Сила акварели</strong> — растекание краски, насыщенность, бумажная текстура.
                  <br />
                  <strong>Непрокрас краёв</strong> — мягкая белая бумага у самого края, как будто кисть не достала.
                  Можно использовать отдельно или вместе.
                </p>
              </div>

              <div className="p-5 rounded-sm border border-border bg-card space-y-5">
                <Slider
                  label="Вытягивание теней"
                  icon={Moon}
                  value={adj.shadows}
                  min={0}
                  max={100}
                  onChange={update('shadows')}
                  format={(v) => `+${v}`}
                />
                <Slider
                  label="Экспозиция"
                  icon={Sun}
                  value={adj.exposure}
                  min={-100}
                  max={100}
                  onChange={update('exposure')}
                  format={(v) => v > 0 ? `+${v}` : `${v}`}
                />
                <Slider
                  label="Теплый / Холодный"
                  icon={Thermometer}
                  value={adj.warmth}
                  min={-100}
                  max={100}
                  onChange={update('warmth')}
                  format={(v) => {
                    if (v === 0) return '0'
                    if (v > 0) return `+${v} теплее`
                    return `${v} холоднее`
                  }}
                />
                <Slider
                  label="Контрастность"
                  icon={Contrast}
                  value={adj.contrast}
                  min={-100}
                  max={100}
                  onChange={update('contrast')}
                  format={(v) => v > 0 ? `+${v}` : `${v}`}
                />
              </div>

              <div className="text-[11px] text-muted-foreground leading-relaxed">
                Подсказка: для классической акварели поставьте <strong>Сила акварели 60-80%</strong> +
                <strong> Непрокрас 30-50%</strong>. Для лёгкого эффекта — только <strong>Акварель 40%</strong>
                без непрокраса. Для тёплой осенней атмосферы добавьте <strong>Теплый +20</strong>.
              </div>
            </div>
          </div>

          {/* SVG watercolor filter definitions are rendered once globally
              via <WatercolorFilters /> in page.tsx, so they're available
              in both the editor preview and the public portfolio gallery. */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
