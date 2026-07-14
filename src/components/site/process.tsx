'use client'

import { motion } from 'framer-motion'
import { MessageCircle, CalendarHeart, Camera, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Знакомство и бриф',
    text: 'Вы пишете мне в мессенджере или через форму на сайте. Обсуждаем идею, формат, образы, локацию. Я задаю вопросы, чтобы понять, какой результат вы хотите получить.',
  },
  {
    icon: CalendarHeart,
    step: '02',
    title: 'Подготовка и дата',
    text: 'Подбираем удобную дату и студию. Я присылаю мудборд с референсами, помогаю с выбором одежды, при необходимости — рекомендую визажиста и стилиста.',
  },
  {
    icon: Camera,
    step: '03',
    title: 'Съёмка',
    text: 'В день съёмки я приезжаю заранее, помогаю расслабиться перед камерой. Снимаю в лёгком темпе, показываю кадры по ходу, чтобы вы видели результат сразу.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Готовый результат',
    text: 'В течение 7–14 дней присылаю готовую подборку с авторской ретушью в онлайн-галерее. Кадры можно скачать в полном разрешении — без водяных знаков.',
  },
]

export function Process() {
  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.3em] uppercase mb-4">
            <span className="h-px w-8 bg-primary" />
            Как мы работаем
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
            Простой путь от <span className="text-gradient-gold italic">идеи</span> до кадра
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[60%] right-[-20%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}

              <div className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background">
                    <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="font-serif text-5xl text-primary/20">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-serif text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
