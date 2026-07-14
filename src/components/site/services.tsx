'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Crown, Baby, Camera, Sparkles, Clock, Image as ImageIcon } from 'lucide-react'

const services = [
  {
    icon: Crown,
    title: 'Женский портрет',
    description:
      'Авторская съёмка, в которой вы раскроетесь с новой стороны. Подбор образа, помощь стилиста, ретушь.',
    duration: '2 часа',
    photos: '15–20 кадров в ретуши',
    price: 'от 12 000 ₽',
    accent: true,
  },
  {
    icon: Users,
    title: 'Семейная история',
    description:
      'Живая съёмка вашей семьи — дома, на прогулке или в студии. Никаких «встали-улыбнулись», только настоящие моменты.',
    duration: '1.5 часа',
    photos: '25–30 кадров в ретуши',
    price: 'от 9 000 ₽',
  },
  {
    icon: Heart,
    title: 'Свадебная съёмка',
    description:
      'От росписи в ЗАГСе до вечернего банкета. Документальный репортаж + красивые постановочные кадры.',
    duration: '6–10 часов',
    photos: '300+ кадров, фильм-клип',
    price: 'от 35 000 ₽',
  },
  {
    icon: Baby,
    title: 'Детская съёмка',
    description:
      'Первые дни жизни, годик, утренники. Терпение, игрушки и куча идей, чтобы ребёнку было интересно.',
    duration: '1–2 часа',
    photos: '20+ кадров в ретуши',
    price: 'от 7 000 ₽',
  },
  {
    icon: Camera,
    title: 'Контент для бизнеса',
    description:
      'Съёмка для селлеров Wildberries, экспертов, блогеров. Готовый набор фотографий для соцсетей на месяц.',
    duration: '3 часа',
    photos: '40+ кадров',
    price: 'от 15 000 ₽',
  },
  {
    icon: Sparkles,
    title: 'Локация и студия',
    description:
      'Помогу подобрать студию или локацию под ваш запрос. У меня есть проверенные площадки в Москве.',
    duration: '—',
    photos: '—',
    price: 'в подарок',
  },
]

export function Services() {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.3em] uppercase mb-4">
            <span className="h-px w-8 bg-primary" />
            Услуги и цены
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
            Выберите свой <span className="text-gradient-gold italic">формат</span>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
            Все съёмки включают предсъёмочную консультацию, помощь в подготовке
            образов и ретушь в авторском стиле. Финальная стоимость зависит от
            длительности и количества кадров.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`hover-lift group relative p-7 rounded-sm border transition-colors ${
                service.accent
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {service.accent && (
                <span className="absolute top-5 right-5 px-2.5 py-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                  Хит
                </span>
              )}

              <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="h-5 w-5" strokeWidth={1.6} />
              </div>

              <h3 className="font-serif text-2xl mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="space-y-2 pb-5 border-b border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {service.duration}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {service.photos}
                </div>
              </div>

              <div className="pt-5 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Цена
                </span>
                <span className="font-serif text-xl text-primary">
                  {service.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Не нашли подходящий формат?{' '}
            <a
              href="#contact"
              className="text-primary underline-offset-4 hover:underline"
            >
              Напишите мне
            </a>{' '}
            — обсудим индивидуальные условия.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
