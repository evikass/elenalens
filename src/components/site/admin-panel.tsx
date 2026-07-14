'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  X,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  GripVertical,
  Save,
  Settings,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

// Admin password — change here if needed
const ADMIN_PASSWORD = 'Elena'

const basePath = process.env.NODE_ENV === 'production' ? '/elenalens' : ''

interface ShotMeta {
  src: string
  filename: string
  title: string
  cat: string
}

// Same list as in portfolio.tsx — keep them in sync
const defaultShots: ShotMeta[] = [
  { src: `${basePath}/work-1.jpg`, filename: 'work-1.jpg', title: 'Невеста в парке у пруда', cat: 'Свадьба' },
  { src: `${basePath}/work-2.jpg`, filename: 'work-2.jpg', title: 'Свадебная прогулка', cat: 'Свадьба' },
  { src: `${basePath}/work-3.jpg`, filename: 'work-3.jpg', title: 'Портрет невесты', cat: 'Портрет' },
  { src: `${basePath}/work-4.jpg`, filename: 'work-4.jpg', title: 'На мосту у воды', cat: 'Свадьба' },
  { src: `${basePath}/work-5.jpg`, filename: 'work-5.jpg', title: 'Показ в шоуруме', cat: 'Контент' },
  { src: `${basePath}/work-6.jpg`, filename: 'work-6.jpg', title: 'Весенний портрет в саду', cat: 'Портрет' },
  { src: `${basePath}/work-7.jpg`, filename: 'work-7.jpg', title: 'Голубые глаза', cat: 'Портрет' },
  { src: `${basePath}/work-8.jpg`, filename: 'work-8.jpg', title: 'Мама и дочка', cat: 'Семья' },
  { src: `${basePath}/work-9.jpg`, filename: 'work-9.jpg', title: 'Тёплый момент', cat: 'Семья' },
  { src: `${basePath}/work-10.jpg`, filename: 'work-10.jpg', title: 'Дома с растениями', cat: 'Семья' },
  { src: `${basePath}/work-11.jpg`, filename: 'work-11.jpg', title: 'На подоконнике', cat: 'Дети' },
  { src: `${basePath}/work-12.jpg`, filename: 'work-12.jpg', title: 'С белыми тюльпанами', cat: 'Портрет' },
  { src: `${basePath}/work-13.jpg`, filename: 'work-13.jpg', title: 'Мама и ребёнок', cat: 'Семья' },
  { src: `${basePath}/work-14.jpg`, filename: 'work-14.jpg', title: 'Детский портрет с тюльпанами', cat: 'Портрет' },
  { src: `${basePath}/work-15.jpg`, filename: 'work-15.jpg', title: 'Семейный портрет', cat: 'Семья' },
  { src: `${basePath}/work-16.jpg`, filename: 'work-16.jpg', title: 'На диване с жёлтыми подушками', cat: 'Семья' },
  { src: `${basePath}/work-17.jpg`, filename: 'work-17.jpg', title: 'Объятие', cat: 'Семья' },
  { src: `${basePath}/work-18.jpg`, filename: 'work-18.jpg', title: 'Тёплый день', cat: 'Семья' },
  { src: `${basePath}/work-19.jpg`, filename: 'work-19.jpg', title: 'Поцелуй в щёку', cat: 'Семья' },
]

interface AdminOverride {
  order: string[]
  hidden: string[]
  watercolor: string[]
  titles: Record<string, string>
}

const defaultOverride: AdminOverride = {
  order: defaultShots.map((s) => s.filename),
  hidden: [],
  watercolor: [],
  titles: {},
}

function loadOverride(): AdminOverride {
  if (typeof window === 'undefined') return defaultOverride
  try {
    const raw = localStorage.getItem('elenalens-admin')
    if (!raw) return defaultOverride
    const parsed = JSON.parse(raw)
    return {
      order: parsed.order?.length ? parsed.order : defaultOverride.order,
      hidden: parsed.hidden || [],
      watercolor: parsed.watercolor || [],
      titles: parsed.titles || {},
    }
  } catch {
    return defaultOverride
  }
}

function saveOverride(o: AdminOverride) {
  localStorage.setItem('elenalens-admin', JSON.stringify(o))
  // Notify portfolio component to reload
  window.dispatchEvent(new Event('elenalens-admin-updated'))
}

export function AdminPanel() {
  // Lazy initializers — read URL params / sessionStorage once on mount
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('admin') === '1'
  })
  const [authed, setAuthed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('elenalens-authed') === '1'
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Lazy init from localStorage so admin sees their saved settings immediately
  const [override, setOverride] = useState<AdminOverride>(() => loadOverride())
  const { toast } = useToast()
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Secret: 5 quick clicks on logo opens admin
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Look for logo click
      const logo = target.closest('a[href="#top"]')
      if (!logo) return
      e.preventDefault()
      clickCountRef.current += 1
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, 1500)
      if (clickCountRef.current >= 5) {
        clickCountRef.current = 0
        setOpen(true)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Apply override to items — derived value, not state
  const items = (() => {
    const byName = new Map(defaultShots.map((s) => [s.filename, s]))
    const ordered: ShotMeta[] = []
    for (const name of override.order) {
      const s = byName.get(name)
      if (s) ordered.push(s)
    }
    for (const s of defaultShots) {
      if (!override.order.includes(s.filename)) ordered.push(s)
    }
    return ordered
  })()

  const tryAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem('elenalens-authed', '1')
      setOverride(loadOverride())
      toast({ title: 'Добро пожаловать, Елена! 🌸' })
      setPassword('')
    } else {
      toast({
        title: 'Неверный пароль',
        description: 'Попробуйте ещё раз',
        variant: 'destructive',
      })
    }
  }

  const logout = () => {
    setAuthed(false)
    sessionStorage.removeItem('elenalens-authed')
    setOpen(false)
  }

  const persist = (next: AdminOverride) => {
    setOverride(next)
    saveOverride(next)
  }

  // Reorder handler — when items change via drag, update order
  const onReorder = (newItems: ShotMeta[]) => {
    const next: AdminOverride = {
      ...override,
      order: newItems.map((s) => s.filename),
    }
    saveOverride(next)
    setOverride(next)
  }

  const toggleHidden = (filename: string) => {
    const hidden = override.hidden.includes(filename)
      ? override.hidden.filter((f) => f !== filename)
      : [...override.hidden, filename]
    persist({ ...override, hidden })
    toast({
      title: hidden ? 'Фото снова видно' : 'Фото скрыто с сайта',
    })
  }

  const toggleWatercolor = (filename: string) => {
    const watercolor = override.watercolor.includes(filename)
      ? override.watercolor.filter((f) => f !== filename)
      : [...override.watercolor, filename]
    persist({ ...override, watercolor })
    toast({
      title: watercolor ? 'Акварель выключена' : 'Акварельный фильтр включён 🎨',
    })
  }

  const updateTitle = (filename: string, title: string) => {
    const titles = { ...override.titles, [filename]: title }
    persist({ ...override, titles })
  }

  const resetAll = () => {
    if (!confirm('Сбросить все настройки к значениям по умолчанию?')) return
    localStorage.removeItem('elenalens-admin')
    setOverride(defaultOverride)
    toast({ title: 'Настройки сброшены' })
  }

  const visibleCount = items.filter(
    (s) => !override.hidden.includes(s.filename)
  ).length
  const hiddenCount = items.length - visibleCount

  return (
    <>
      {/* Floating admin button (only when authed) */}
      {authed && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-transform"
          aria-label="Открыть админ-панель"
          title="Админ-панель"
        >
          <Settings className="h-5 w-5" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-serif text-lg">
                    {authed ? 'Студия Елены · Управление' : 'Вход для Елены'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {authed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-muted-foreground"
                    >
                      <LogOut className="h-4 w-4 mr-1" /> Выйти
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" /> Закрыть
                  </Button>
                </div>
              </div>
            </div>

            {/* Auth screen */}
            {!authed ? (
              <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={tryAuth}
                  className="w-full max-w-sm p-8 rounded-sm border border-border bg-card"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h2 className="font-serif text-2xl mb-1">Закрытая зона</h2>
                    <p className="text-sm text-muted-foreground">
                      Введите пароль, чтобы войти в админ-панель
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="pwd" className="text-xs uppercase tracking-wider">
                      Пароль
                    </Label>
                    <div className="relative">
                      <Input
                        id="pwd"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        placeholder="••••••"
                        className="bg-background pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Войти
                  </Button>

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    Подсказка: пароль — имя фотографа
                  </p>
                </motion.form>
              </div>
            ) : (
              <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-sm border border-border bg-card">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Всего фото</div>
                    <div className="font-serif text-2xl mt-1">{items.length}</div>
                  </div>
                  <div className="p-4 rounded-sm border border-border bg-card">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Видно на сайте</div>
                    <div className="font-serif text-2xl mt-1 text-primary">{visibleCount}</div>
                  </div>
                  <div className="p-4 rounded-sm border border-border bg-card">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Акварель</div>
                    <div className="font-serif text-2xl mt-1 text-primary">{override.watercolor.length}</div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 mb-6 rounded-sm border border-primary/30 bg-primary/5 text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Как пользоваться:</strong>{' '}
                  перетаскивайте карточки за иконку <GripVertical className="inline h-3 w-3" />, чтобы менять порядок на сайте.
                  Нажмите <Sparkles className="inline h-3 w-3 text-primary" /> «Акварель», чтобы применить мягкий живописный эффект.
                  Нажмите <EyeOff className="inline h-3 w-3" />, чтобы скрыть фото с сайта (не удаляется).
                  Изменения видны только на этом устройстве.
                </div>

                {/* Reset */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Перетаскивайте фото для сортировки
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Сбросить
                  </Button>
                </div>

                {/* Drag-and-drop list */}
                <Reorder.Group
                  axis="y"
                  values={items}
                  onReorder={onReorder}
                  className="space-y-3"
                >
                  {items.map((item) => {
                    const isHidden = override.hidden.includes(item.filename)
                    const isWc = override.watercolor.includes(item.filename)
                    const customTitle =
                      override.titles[item.filename] ?? item.title
                    return (
                      <Reorder.Item
                        key={item.filename}
                        value={item}
                        className="flex items-center gap-4 p-3 rounded-sm border border-border bg-card hover:border-primary/40 transition-colors"
                      >
                        {/* Drag handle */}
                        <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary">
                          <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Thumbnail */}
                        <div className="relative h-16 w-20 sm:w-24 shrink-0 overflow-hidden rounded-sm bg-secondary">
                          <img
                            src={item.src}
                            alt={item.title}
                            className={`h-full w-full object-cover ${
                              isWc ? 'watercolor-filter' : ''
                            } ${isHidden ? 'opacity-30' : ''}`}
                          />
                          {isWc && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] uppercase tracking-wide bg-primary text-primary-foreground rounded-full">
                              Акварель
                            </span>
                          )}
                        </div>

                        {/* Title + cat */}
                        <div className="flex-1 min-w-0">
                          <Input
                            value={customTitle}
                            onChange={(e) =>
                              updateTitle(item.filename, e.target.value)
                            }
                            className="h-8 bg-transparent border-transparent hover:border-border focus-visible:bg-background text-sm"
                          />
                          <div className="flex items-center gap-2 mt-1 px-1">
                            <span className="text-[10px] uppercase tracking-wider text-primary">
                              {item.cat}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              · {item.filename}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleWatercolor(item.filename)}
                            title="Акварельный фильтр"
                            className={`p-2 rounded-sm transition-colors ${
                              isWc
                                ? 'bg-primary/20 text-primary'
                                : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                            }`}
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleHidden(item.filename)}
                            title={isHidden ? 'Показать' : 'Скрыть'}
                            className={`p-2 rounded-sm transition-colors ${
                              isHidden
                                ? 'bg-secondary text-muted-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                          >
                            {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </Reorder.Item>
                    )
                  })}
                </Reorder.Group>

                {/* Telegram config */}
                <div className="mt-12 p-5 rounded-sm border border-border bg-card">
                  <h3 className="font-serif text-xl mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Telegram-бот для заявок
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Если хотите, чтобы заявки с формы приходили прямо в Telegram
                    (а не по email), создайте бота через{' '}
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      @BotFather
                    </a>
                    , получите токен, отправьте боту любое сообщение и узнайте
                    свой chat_id через{' '}
                    <a
                      href="https://t.me/userinfobot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      @userinfobot
                    </a>
                    . Затем вставьте значения ниже — они сохранятся на этом
                    устройстве.
                  </p>
                  <TgConfigForm />
                </div>

                <div className="h-20" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TgConfigForm() {
  // Lazy initializer — runs once on mount, no extra render
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('tg_bot_token') || ''
  })
  const [chatId, setChatId] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('tg_chat_id') || ''
  })
  const { toast } = useToast()

  const save = () => {
    if (token) localStorage.setItem('tg_bot_token', token)
    else localStorage.removeItem('tg_bot_token')
    if (chatId) localStorage.setItem('tg_chat_id', chatId)
    else localStorage.removeItem('tg_chat_id')
    toast({
      title: 'Сохранено',
      description:
        token && chatId
          ? 'Теперь заявки будут приходить в Telegram'
          : 'Настройки очищены — заявки будут отправляться по email',
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs uppercase tracking-wider mb-1.5 block">
          Bot Token
        </Label>
        <Input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456789:ABC-DEF..."
          className="bg-background text-sm font-mono"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider mb-1.5 block">
          Chat ID
        </Label>
        <Input
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="123456789"
          className="bg-background text-sm font-mono"
        />
      </div>
      <Button
        onClick={save}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        <Save className="h-3.5 w-3.5 mr-1" /> Сохранить
      </Button>
    </div>
  )
}
