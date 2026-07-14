'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Send, Check, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function Contact() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || ''),
      contact: String(data.get('contact') || ''),
      service: String(data.get('service') || ''),
      message: String(data.get('message') || ''),
    }

    // Simulate async submission (no backend required for a one-page site).
    await new Promise((r) => setTimeout(r, 900))

    setSubmitting(false)
    setDone(true)
    toast({
      title: 'Заявка отправлена',
      description: 'Елена свяжется с вами в течение 24 часов.',
    })

    form.reset()
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left side: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.3em] uppercase mb-4">
              <span className="h-px w-8 bg-primary" />
              Связаться
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-6">
              Давайте создадим<br />
              <span className="text-gradient-gold italic">что-то ваше</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Напишите мне — отвечаю в течение 24 часов. На первой консультации
              мы обсудим вашу идею, бюджет и удобные даты. Это бесплатно и ни к
              чему не обязывает.
            </p>

            <div className="space-y-4">
              <a
                href="tel:+79097171909"
                className="flex items-center gap-4 group"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Телефон / WhatsApp
                  </div>
                  <div className="text-sm font-medium">+7 909 717-19-09</div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Локация
                  </div>
                  <div className="text-sm font-medium">Нижний Новгород и Киров (Вятка)</div>
                </div>
              </div>

              <a
                href="https://vk.ru/elenapentina"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    ВКонтакте
                  </div>
                  <div className="text-sm font-medium">vk.ru/elenapentina</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right side: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative p-7 sm:p-9 rounded-sm border border-border bg-card"
          >
            <h3 className="font-serif text-2xl mb-2">Заявка на съёмку</h3>
            <p className="text-sm text-muted-foreground mb-7">
              Заполните форму — и я свяжусь с вами, чтобы обсудить детали.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider">
                  Ваше имя
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Как к вам обращаться"
                  className="bg-background border-border focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-xs uppercase tracking-wider">
                  Телефон или мессенджер
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  required
                  placeholder="+7 (___) ___-__-__ или ссылка на ВК"
                  className="bg-background border-border focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-xs uppercase tracking-wider">
                  Тип съёмки
                </Label>
                <select
                  id="service"
                  name="service"
                  className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Выберите формат
                  </option>
                  <option>Женский портрет</option>
                  <option>Семейная съёмка</option>
                  <option>Свадьба</option>
                  <option>Детская съёмка</option>
                  <option>Контент для бизнеса</option>
                  <option>Другое / не уверен(а)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-wider">
                  Комментарий
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Расскажите про идею, желаемые даты, локацию..."
                  className="bg-background border-border focus-visible:ring-primary/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || done}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base font-medium disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Отправляем...
                  </>
                ) : done ? (
                  <>
                    <Check className="h-4 w-4" />
                    Заявка принята
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Отправить заявку
                  </>
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь на обработку персональных
                данных. Я не передаю контакты третьим лицам.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
