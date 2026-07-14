'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera } from 'lucide-react'

const basePath = process.env.NODE_ENV === 'production' ? '/elenalens' : ''

const categories = ['Все', 'Портрет', 'Свадьба', 'Контент'] as const

type Cat = (typeof categories)[number]

interface Shot {
  src: string
  title: string
  cat: Exclude<Cat, 'Все'>
  span?: 'wide' | 'tall'
}

const shots: Shot[] = [
  {
    src: `${basePath}/work-1.jpg`,
    title: 'Невеста в парке у пруда',
    cat: 'Свадьба',
    span: 'tall',
  },
  {
    src: `${basePath}/work-5.jpg`,
    title: 'Показ в шоуруме',
    cat: 'Контент',
    span: 'wide',
  },
  {
    src: `${basePath}/work-6.jpg`,
    title: 'Весенний портрет в саду',
    cat: 'Портрет',
  },
  {
    src: `${basePath}/work-2.jpg`,
    title: 'Свадебная прогулка',
    cat: 'Свадьба',
  },
  {
    src: `${basePath}/work-3.jpg`,
    title: 'Портрет невесты',
    cat: 'Портрет',
    span: 'tall',
  },
  {
    src: `${basePath}/work-4.jpg`,
    title: 'На мосту у воды',
    cat: 'Свадьба',
    span: 'wide',
  },
]

export function Portfolio() {
  const [active, setActive] = useState<Cat>('Все')

  const filtered = active === 'Все' ? shots : shots.filter((s) => s.cat === active)

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
            Подборка свежих работ — свадебные съёмки, портреты и контент для
            бизнеса. Полное портфолио покажу на личной встрече или в ВК.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                active === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[260px] gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((shot) => (
              <motion.figure
                key={shot.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-sm bg-card ${
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
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
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
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
