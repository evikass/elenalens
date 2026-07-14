'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  MapPin,
  Send,
  Check,
  MessageCircle,
  Loader2,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

// VK username — Elena's page
const VK_USERNAME = 'elenapentina'

// Telegram bot config — filled in via admin panel
const DEFAULT_TG_TOKEN = ''
const DEFAULT_TG_CHAT_ID = ''

interface FormPayload {
  name: string
  contact: string
  service: string
  message: string
}

function buildMessageText(p: FormPayload): string {
  return (
    `📸 Новая заявка с сайта ElenaLens\n\n` +
    `👤 Имя: ${p.name}\n` +
    `📞 Контакт: ${p.contact}\n` +
    `🎯 Услуга: ${p.service}\n` +
    (p.message ? `💬 Комментарий: ${p.message}\n` : '')
  )
}

async function sendToTelegram(
  payload: FormPayload
): Promise<{ ok: boolean; error?: string }> {
  let token = DEFAULT_TG_TOKEN
  let chatId = DEFAULT_TG_CHAT_ID

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tg_bot_token') || token
    chatId = localStorage.getItem('tg_chat_id') || chatId
  }

  // If Telegram is not configured, treat as "skipped" (not error)
  if (!token || !chatId) {
    return { ok: false, error: 'not_configured' }
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessageText(payload),
        }),
      }
    )
    const data = await res.json()
    if (!data.ok) {
      return { ok: false, error: data.description || 'Telegram error' }
    }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'network error' }
  }
}

// VK doesn't allow direct API calls from browser (CORS blocked).
// We use a workaround: copy text to clipboard + open vk.me dialog
async function sendViaVk(payload: FormPayload): Promise<{ ok: boolean }> {
  const text = buildMessageText(payload)
  // Try to copy to clipboard
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {}
    document.body.removeChild(ta)
  }
  // Open VK dialog in new tab
  window.open(`https://vk.me/${VK_USERNAME}`, '_blank', 'noopener,noreferrer')
  return { ok: true }
}

export function Contact() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [sendVkToo, setSendVkToo] = useState(false)
  const [lastPayload, setLastPayload] = useState<FormPayload | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)
    const payload: FormPayload = {
      name: String(data.get('name') || ''),
      contact: String(data.get('contact') || ''),
      service: String(data.get('service') || ''),
      message: String(data.get('message') || ''),
    }
    setLastPayload(payload)

    // 1. Try Telegram first (if configured)
    const tgResult = await sendToTelegram(payload)
    let tgSent = tgResult.ok
    let tgSkipped = tgResult.error === 'not_configured'

    // 2. If user wants VK copy too, do it
    let vkSent = false
    if (sendVkToo || tgSkipped) {
      const vkResult = await sendViaVk(payload)
      vkSent = vkResult.ok
    }

    setSubmitting(false)

    // Build toast message based on what happened
    if (tgSent && vkSent) {
      setDone(true)
      toast({
        title: 'Готово! Заявка отправлена',
        description:
          'Уведомление ушло в Telegram, а текст скопирован в ВК — просто вставьте его в открывшемся окне.',
      })
    } else if (tgSent) {
      setDone(true)
      toast({
        title: 'Заявка отправлена в Telegram',
        description: 'Елена свяжется с вами в течение 24 часов.',
      })
    } else if (vkSent) {
      setDone(true)
      toast({
        title: 'Открываем ВК',
        description:
          'Текст заявки скопирован в буфер обмена. Вставьте его (Ctrl+V) в открывшемся окне ВК и отправьте Елене.',
      })
    } else {
      toast({
        title: 'Не удалось отправить',
        description:
          'Произошла ошибка. Пожалуйста, напишите Елене напрямую в ВК или позвоните.',
        variant: 'destructive',
      })
    }

    if (tgSent || vkSent) {
      form.reset()
      setSendVkToo(false)
      setTimeout(() => setDone(false), 5000)
    }
  }

  // Manual "also send via VK" button (shown after Telegram success)
  const handleSendVk = async () => {
    if (!lastPayload) return
    await sendViaVk(lastPayload)
    toast({
      title: 'Открываем ВК',
      description:
        'Текст заявки скопирован. Вставьте его (Ctrl+V) в открывшемся окне ВК.',
    })
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

              {/* VK copy checkbox */}
              <label
                htmlFor="send-vk"
                className="flex items-start gap-3 p-3 rounded-sm border border-border bg-background/50 hover:border-primary/40 cursor-pointer transition-colors"
              >
                <input
                  id="send-vk"
                  type="checkbox"
                  checked={sendVkToo}
                  onChange={(e) => setSendVkToo(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    Также отправить в ВК Елене
                  </span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Текст заявки скопируется в буфер и откроется диалог с Еленой
                    в ВК — останется только вставить и отправить.
                  </span>
                </span>
              </label>

              <Button
                type="submit"
                disabled={submitting || done}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base font-medium disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
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
                    {sendVkToo ? 'Отправить в Telegram + ВК' : 'Отправить заявку'}
                  </>
                )}
              </Button>

              {/* Manual VK send button (shown after Telegram success) */}
              {done && lastPayload && !sendVkToo && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-xs text-center text-muted-foreground">
                    Хотите также продублировать заявку в ВК?
                  </p>
                  <Button
                    type="button"
                    onClick={handleSendVk}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/40 text-primary hover:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Отправить копию в ВК
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </motion.div>
              )}

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
