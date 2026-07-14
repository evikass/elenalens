'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Image from 'next/image'

const basePath = process.env.NODE_ENV === 'production' ? '/elenalens' : ''

export function About() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-4 border border-primary/30 rounded-sm" />
              <Image
                src={`${basePath}/elena-portrait.jpg`}
                alt="Елена Пентина — фотограф ElenaLens"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="relative h-full w-full object-cover rounded-sm grayscale-[15%]"
                priority
              />
              <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-background border border-border p-5 rounded-sm shadow-2xl max-w-[200px]">
                <div className="font-serif text-3xl text-primary">12+</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">
                  лет профессиональной съёмки
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.3em] uppercase mb-4">
              <span className="h-px w-8 bg-primary" />
              Обо мне
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-6">
              Фотография — это<br />
              <span className="text-gradient-gold italic">про людей</span>,
              а не про камеру
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Меня зовут Елена Пентина, и уже более двенадцати лет я держу
                камеру в руках. За это время через мою студию прошли сотни
                людей — новорождённые, выпускники, невесты, семьи,
                предприниматели. И каждый раз я заново учусь видеть.
              </p>
              <p>
                Я не люблю постановочные кадры с натянутыми улыбками. Мне
                интереснее поймать момент, когда вы забыли про камеру — когда
                смеётесь по-настоящему, когда смотрите на ребёнка, когда
                поправляете волосы. Такие кадры потом пересматривают годами.
              </p>
              <p>
                Работаю в Москве и области, выезжаю на локации, принимаю у себя
                в студии. Со мной спокойно — я знаю, как поставить даже самого
                «нефотогеничного» клиента, и в итоге он удивляется своему
                портрету.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-8 relative pl-6 border-l-2 border-primary/40">
              <Quote className="absolute -left-3 top-0 h-5 w-5 text-primary fill-primary/20" />
              <p className="font-serif italic text-lg text-foreground/90">
                «Хороший портрет — это не про внешность. Это про то, каким
                человек на самом деле является, когда никто не смотрит».
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {[
                'Canon EOS R5',
                'Sigma 35mm f/1.4 Art',
                'Profoto B10',
                'Lightroom + Capture One',
              ].map((tool) => (
                <span key={tool} className="text-muted-foreground">
                  · {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
