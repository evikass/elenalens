'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronLeft, ChevronRight, Info } from 'lucide-react'

const basePath = process.env.NODE_ENV === 'production' ? '/elenalens' : ''

const categories = ['Все', 'Портрет', 'Семья', 'Свадьба', 'Дети', 'Контент'] as const

type Cat = (typeof categories)[number]

interface Shot {
  src: string
  title: string
  cat: Exclude<Cat, 'Все'>
  span?: 'wide' | 'tall'
}

const defaultShots: Shot[] = [
  // Свадьба
  { src: `${basePath}/work-1.jpg`, title: 'Невеста в парке у пруда', cat: 'Свадьба', span: 'tall' },
  { src: `${basePath}/work-2.jpg`, title: 'Свадебная прогулка', cat: 'Свадьба', span: 'wide' },
  { src: `${basePath}/work-4.jpg`, title: 'На мосту у воды', cat: 'Свадьба' },
  { src: `${basePath}/work-20.jpg`, title: 'У окна в интерьере', cat: 'Свадьба' },
  { src: `${basePath}/work-25.jpg`, title: 'У колеса обозрения', cat: 'Свадьба', span: 'tall' },
  // Портрет
  { src: `${basePath}/work-3.jpg`, title: 'Портрет невесты', cat: 'Портрет', span: 'tall' },
  { src: `${basePath}/work-6.jpg`, title: 'Весенний портрет в саду', cat: 'Портрет' },
  { src: `${basePath}/work-7.jpg`, title: 'Голубые глаза', cat: 'Портрет' },
  { src: `${basePath}/work-12.jpg`, title: 'С белыми тюльпанами', cat: 'Портрет' },
  { src: `${basePath}/work-14.jpg`, title: 'Детский портрет с тюльпанами', cat: 'Портрет' },
  { src: `${basePath}/work-24.jpg`, title: 'В саду с гортензиями', cat: 'Портрет' },
  { src: `${basePath}/work-26.jpg`, title: 'Осенний сад', cat: 'Портрет', span: 'tall' },
  // Семья
  { src: `${basePath}/work-8.jpg`, title: 'Мама и дочка', cat: 'Семья' },
  { src: `${basePath}/work-9.jpg`, title: 'Тёплый момент', cat: 'Семья' },
  { src: `${basePath}/work-10.jpg`, title: 'Дома с растениями', cat: 'Семья' },
  { src: `${basePath}/work-13.jpg`, title: 'Мама и ребёнок', cat: 'Семья' },
  { src: `${basePath}/work-15.jpg`, title: 'Семейный портрет', cat: 'Семья' },
  { src: `${basePath}/work-16.jpg`, title: 'На диване с жёлтыми подушками', cat: 'Семья' },
  { src: `${basePath}/work-17.jpg`, title: 'Объятие', cat: 'Семья' },
  { src: `${basePath}/work-18.jpg`, title: 'Тёплый день', cat: 'Семья' },
  { src: `${basePath}/work-19.jpg`, title: 'Поцелуй в щёку', cat: 'Семья' },
  { src: `${basePath}/work-21.jpg`, title: 'На берегу реки', cat: 'Семья', span: 'wide' },
  { src: `${basePath}/work-23.jpg`, title: 'Игра в воде', cat: 'Семья' },
  // Дети
  { src: `${basePath}/work-11.jpg`, title: 'На подоконнике', cat: 'Дети' },
  { src: `${basePath}/work-22.jpg`, title: 'Веночек из ромашек', cat: 'Дети', span: 'tall' },
  // Контент
  { src: `${basePath}/work-5.jpg`, title: 'Показ в шоуруме', cat: 'Контент', span: 'wide' },
]

// Allow admin to override order / titles / visibility via localStorage
interface AdminOverride {
  order: string[] // array of src filenames in desired order
  hidden: string[] // src filenames to hide
  watercolor: string[] // src filenames to apply watercolor filter
  titles: Record<string, string> // custom titles
}

function loadAdminOverride(): AdminOverride {
  if (typeof window === 'undefined')
    return { order: [], hidden: [], watercolor: [], titles: {} }
  try {
    const raw = localStorage.getItem('elenalens-admin')
    if (!raw) return { order: [], hidden: [], watercolor: [], titles: {} }
    const parsed = JSON.parse(raw)
    return {
      order: parsed.order || [],
      hidden: parsed.hidden || [],
      watercolor: parsed.watercolor || [],
      titles: parsed.titles || {},
    }
  } catch {
    return { order: [], hidden: [], watercolor: [], titles: {} }
  }
}

function filenameFromSrc(src: string): string {
  return src.split('/').pop() || src
}

export function Portfolio() {
  const [active, setActive] = useState<Cat>('Все')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [override, setOverride] = useState<AdminOverride>({
    order: [],
    hidden: [],
    watercolor: [],
    titles: {},
  })

  // Load admin override from localStorage (so changes made in /admin reflect here)
  useEffect(() => {
    const update = () => setOverride(loadAdminOverride())
    update()
    window.addEventListener('storage', update)
    window.addEventListener('elenalens-admin-updated', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('elenalens-admin-updated', update)
    }
  }, [])

  // Build the final shot list applying admin overrides
  const buildShots = useCallback((): Shot[] => {
    let shots = [...defaultShots]
    // Apply custom order
    if (override.order.length > 0) {
      const byName = new Map(defaultShots.map((s) => [filenameFromSrc(s.src), s]))
      const reordered: Shot[] = []
      for (const name of override.order) {
        const s = byName.get(name)
        if (s) reordered.push(s)
      }
      // Append any missing ones (e.g. newly added)
      for (const s of defaultShots) {
        if (!override.order.includes(filenameFromSrc(s.src))) reordered.push(s)
      }
      shots = reordered
    }
    // Filter out hidden
    shots = shots.filter((s) => !override.hidden.includes(filenameFromSrc(s.src)))
    // Apply custom titles
    if (override.titles && Object.keys(override.titles).length > 0) {
      shots = shots.map((s) => {
        const filename = filenameFromSrc(s.src)
        const customTitle = override.titles[filename]
        return customTitle ? { ...s, title: customTitle } : s
      })
    }
    return shots
  }, [override])

  const allShots = buildShots()
  const filtered =
    active === 'Все' ? allShots : allShots.filter((s) => s.cat === active)

  // Lightbox navigation
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  }, [filtered.length])
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))
  }, [filtered.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    // lock scroll
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = orig
    }
  }, [lightboxIndex, closeLightbox, prev, next])

  return (
    <section
      id="portfolio"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.3em] uppercase mb-4">
            <span className="h-px w-8 bg-primary" />
            Портфолио
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
            Кадры, которые <span className="text-gradient-gold italic">говорят</span>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
            Подборка работ — свадебные съёмки, портреты, семейные истории и
            детские кадры. Нажмите на любое фото, чтобы рассмотреть в полный
            размер.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const count =
              cat === 'Все'
                ? allShots.length
                : allShots.filter((s) => s.cat === cat).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all ${
                  active === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border'
                }`}
              >
                {cat} <span className="opacity-60 text-xs">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Gallery */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[260px] gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((shot, idx) => {
              const isWatercolor = override.watercolor.includes(
                filenameFromSrc(shot.src)
              )
              return (
                <motion.button
                  key={shot.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightboxIndex(idx)}
                  className={`group relative overflow-hidden rounded-sm bg-card text-left cursor-zoom-in ${
                    shot.span === 'wide'
                      ? 'col-span-2'
                      : shot.span === 'tall'
                        ? 'row-span-2'
                        : ''
                  }`}
                >
                  <img
                    src={shot.src}
                    alt={shot.title}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      isWatercolor ? 'watercolor-filter' : ''
                    }`}
                  />
                  {/* Watercolor badge */}
                  {isWatercolor && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-primary">
                      Акварель
                    </span>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-primary text-[10px] uppercase tracking-wider mb-1">
                      <Camera className="h-3 w-3" />
                      {shot.cat}
                    </div>
                    <div className="font-serif text-sm sm:text-base text-foreground">
                      {shot.title}
                    </div>
                  </figcaption>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Закрыть"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 rounded-full bg-background/60 hover:bg-background text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Предыдущее"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 hover:bg-background text-foreground transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Следующее"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-background/60 hover:bg-background text-foreground transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <motion.figure
              key={filtered[lightboxIndex].src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center"
            >
              <img
                src={filtered[lightboxIndex].src.replace(
                  /\/work-/,
                  '/work-'
                )}
                alt={filtered[lightboxIndex].title}
                className={`max-w-full max-h-[78vh] object-contain rounded-sm shadow-2xl ${
                  override.watercolor.includes(
                    filenameFromSrc(filtered[lightboxIndex].src)
                  )
                    ? 'watercolor-filter'
                    : ''
                }`}
              />
              <figcaption className="mt-4 flex items-center gap-2 text-center">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-wider text-primary">
                  {filtered[lightboxIndex].cat}
                </span>
                <span className="text-sm text-foreground font-serif">
                  {filtered[lightboxIndex].title}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
