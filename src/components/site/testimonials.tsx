'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Мария Д.',
    role: 'Семейная съёмка',
    rating: 5,
    text: 'Пришли с мужем и двумя детьми — оба боялись камеры до дрожи. Елена за пять минут всех рассмешила, и в итоге мы получили кадры, на которых реально нас узнаём. Не «глянцевая» семья, а живая. Спасибо огромное!',
  },
  {
    name: 'Анна и Игорь',
    role: 'Свадьба',
    rating: 5,
    text: 'Елена снимала нашу свадьбу от росписи до вечера. Мы даже не замечали камеру — а на фото оказалось всё самое важное: и слёзы, и смех, и танцы. Отдельное спасибо за клип — пересматриваем до сих пор.',
  },
  {
    name: 'Светлана К.',
    role: 'Женский портрет',
    rating: 5,
    text: 'Мне 41, я никогда не любила свои фотографии. После съёмки у Елены впервые захотелось повесить портрет дома. Она умеет показать женщину красивой без всякого «шопа» — просто правильным светом и углом.',
  },
  {
    name: 'Дмитрий П.',
    role: 'Контент для Wildberries',
    rating: 5,
    text: 'Заказывал съёмку кардиналов для магазина на ВБ. Сделали 50+ кадров за 3 часа, из них 30 точно пойдут в карточки. Елена сразу поняла, что нужно для маркетплейса — фон, ракурсы, композиция. Будем работать снова.',
  },
  {
    name: 'Ольга В.',
    role: 'Детская съёмка',
    rating: 5,
    text: 'Снимали годик дочки. Ребёнок капризничал, но Елена нашла к ней подход за пару минут — какие-то игры, игрушки. Получились очень тёплые кадры, не «вынужденная улыбка», а настоящая радость.',
  },
  {
    name: 'Елена и Михаил',
    role: 'Love story',
    rating: 5,
    text: 'Снимали love story в парке перед свадьбой. Получилось настолько круто, что часть кадров мы использовали для пригласительных. Елена подсказала позы, место, время — нам оставалось только быть собой.',
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
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
            Отзывы клиентов
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
            Что говорят <span className="text-gradient-gold italic">люди</span>
          </h2>
          <div className="mt-6 inline-flex items-center gap-3">
            <div className="flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.9 / 5 — 87 отзывов на Авито и в соцсетях
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.figure
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative p-7 rounded-sm border border-border bg-card hover:border-primary/40 transition-colors"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/15 fill-primary/10" />

              <div className="flex items-center gap-1 text-primary mb-4">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-primary" />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6">
                «{review.text}»
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-serif text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {review.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {review.role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
