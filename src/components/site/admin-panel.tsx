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
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  PhotoEditor,
  defaultAdjustments,
  buildFilterString,
  type PhotoAdjustments,
} from './photo-editor'
import { getWatercolorFilterId, WatercolorEdgeOverlay } from './watercolor-filters'

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
  { src: `${basePath}/work-20.jpg`, filename: 'work-20.jpg', title: 'У окна в интерьере', cat: 'Свадьба' },
  { src: `${basePath}/work-21.jpg`, filename: 'work-21.jpg', title: 'На берегу реки', cat: 'Семья' },
  { src: `${basePath}/work-22.jpg`, filename: 'work-22.jpg', title: 'Веночек из ромашек', cat: 'Дети' },
  { src: `${basePath}/work-23.jpg`, filename: 'work-23.jpg', title: 'Игра в воде', cat: 'Семья' },
  { src: `${basePath}/work-24.jpg`, filename: 'work-24.jpg', title: 'В саду с гортензиями', cat: 'Портрет' },
  { src: `${basePath}/work-25.jpg`, filename: 'work-25.jpg', title: 'У колеса обозрения', cat: 'Свадьба' },
  { src: `${basePath}/work-26.jpg`, filename: 'work-26.jpg', title: 'Осенний сад', cat: 'Портрет' },
  { src: `${basePath}/work-27.jpg`, filename: 'work-27.jpg', title: 'Съёмка для ЦУМ', cat: 'Контент' },
  { src: `${basePath}/work-28.jpg`, filename: 'work-28.jpg', title: 'Деловой образ с чашкой', cat: 'Контент' },
  { src: `${basePath}/work-29.jpg`, filename: 'work-29.jpg', title: 'С камерой в снегу', cat: 'Портрет' },
  { src: `${basePath}/work-30.jpg`, filename: 'work-30.jpg', title: 'В кофейне', cat: 'Контент' },
  { src: `${basePath}/work-31.jpg`, filename: 'work-31.jpg', title: 'У фиолетовой двери', cat: 'Портрет' },
  { src: `${basePath}/work-32.jpg`, filename: 'work-32.jpg', title: 'Бизнес-портрет в офисе', cat: 'Контент' },
  { src: `${basePath}/work-33.jpg`, filename: 'work-33.jpg', title: 'У цветущего куста', cat: 'Портрет' },
  { src: `${basePath}/work-34.jpg`, filename: 'work-34.jpg', title: 'Сердечко в зеркале', cat: 'Портрет' },
  { src: `${basePath}/work-35.jpg`, filename: 'work-35.jpg', title: 'Команда tsamkirov.ru', cat: 'Контент' },
  { src: `${basePath}/work-36.jpg`, filename: 'work-36.jpg', title: 'Деловой портрет на диване', cat: 'Контент' },
  { src: `${basePath}/work-37.jpg`, filename: 'work-37.jpg', title: 'Мальчик с цветком', cat: 'Дети' },
  { src: `${basePath}/work-38.jpg`, filename: 'work-38.jpg', title: 'Девушка в осеннем лесу', cat: 'Выставка' },
  { src: `${basePath}/work-39.jpg`, filename: 'work-39.jpg', title: 'С оранжевым цветком у озера', cat: 'Выставка' },
  { src: `${basePath}/work-40.jpg`, filename: 'work-40.jpg', title: 'На фоне сухих цветов', cat: 'Портрет' },
  { src: `${basePath}/work-41.jpg`, filename: 'work-41.jpg', title: 'Туманное утро над рекой', cat: 'Выставка' },
  { src: `${basePath}/work-42.jpg`, filename: 'work-42.jpg', title: 'В цветочном платье на закате', cat: 'Выставка' },
  { src: `${basePath}/work-43.jpg`, filename: 'work-43.jpg', title: 'Макро: насекомое на цветке', cat: 'Выставка' },
  { src: `${basePath}/work-44.jpg`, filename: 'work-44.jpg', title: 'Восход над туманным озером', cat: 'Выставка' },
  { src: `${basePath}/work-45.jpg`, filename: 'work-45.jpg', title: 'С цветком в парке', cat: 'Портрет' },
  { src: `${basePath}/work-46.jpg`, filename: 'work-46.jpg', title: 'Лодка на закате', cat: 'Выставка' },
  { src: `${basePath}/work-47.jpg`, filename: 'work-47.jpg', title: 'Поле фиолетовых цветов на рассвете', cat: 'Выставка' },
  { src: `${basePath}/work-48.jpg`, filename: 'work-48.jpg', title: 'Девочка в цветочном поле', cat: 'Дети' },
  { src: `${basePath}/work-49.jpg`, filename: 'work-49.jpg', title: 'С цветком в волосах', cat: 'Дети' },
  { src: `${basePath}/work-50.jpg`, filename: 'work-50.jpg', title: 'Макро: жук на мхе', cat: 'Выставка' },
  { src: `${basePath}/work-51.jpg`, filename: 'work-51.jpg', title: 'В высокой траве', cat: 'Дети' },
  { src: `${basePath}/work-52.jpg`, filename: 'work-52.jpg', title: 'С подсолнухами в золотом платье', cat: 'Портрет' },
  { src: `${basePath}/work-53.jpg`, filename: 'work-53.jpg', title: 'Бежит по мосту в венке', cat: 'Дети' },
  { src: `${basePath}/work-54.jpg`, filename: 'work-54.jpg', title: 'Осенние листья в парке', cat: 'Осенняя серия' },
  { src: `${basePath}/work-55.jpg`, filename: 'work-55.jpg', title: 'У кирпичной стены', cat: 'Осенняя серия' },
  { src: `${basePath}/work-56.jpg`, filename: 'work-56.jpg', title: 'В берете с листьями', cat: 'Осенняя серия' },
  { src: `${basePath}/work-57.jpg`, filename: 'work-57.jpg', title: 'С осенними листьями', cat: 'Осенняя серия' },
  { src: `${basePath}/work-58.jpg`, filename: 'work-58.jpg', title: 'У кирпича на набережной', cat: 'Осенняя серия' },
  { src: `${basePath}/work-59.jpg`, filename: 'work-59.jpg', title: 'На ограждении в берете', cat: 'Осенняя серия' },
  { src: `${basePath}/work-60.jpg`, filename: 'work-60.jpg', title: 'С листьями в лесу', cat: 'Осенняя серия' },
  { src: `${basePath}/work-61.jpg`, filename: 'work-61.jpg', title: 'В прыжке на аллее', cat: 'Осенняя серия' },
  { src: `${basePath}/work-62.jpg`, filename: 'work-62.jpg', title: 'На ограждении в парке', cat: 'Осенняя серия' },
  { src: `${basePath}/work-63.jpg`, filename: 'work-63.jpg', title: 'В коляске с осенними листьями', cat: 'Осенняя семья' },
  { src: `${basePath}/work-64.jpg`, filename: 'work-64.jpg', title: 'Мама с девочкой на руках', cat: 'Осенняя семья' },
  { src: `${basePath}/work-65.jpg`, filename: 'work-65.jpg', title: 'С букетом осенних листьев', cat: 'Осенняя семья' },
  { src: `${basePath}/work-66.jpg`, filename: 'work-66.jpg', title: 'В розовом платье на тропинке', cat: 'Осенняя семья' },
  { src: `${basePath}/work-67.jpg`, filename: 'work-67.jpg', title: 'Объятие в осеннем лесу', cat: 'Осенняя семья' },
  { src: `${basePath}/work-68.jpg`, filename: 'work-68.jpg', title: 'Мама с двумя дочерьми', cat: 'Осенняя семья' },
  { src: `${basePath}/work-69.jpg`, filename: 'work-69.jpg', title: 'Две девочки с яблоками', cat: 'Осенняя семья' },
  { src: `${basePath}/work-70.jpg`, filename: 'work-70.jpg', title: 'Мама поднимает смеющуюся девочку', cat: 'Осенняя семья' },
  { src: `${basePath}/work-71.jpg`, filename: 'work-71.jpg', title: 'Малышка в осеннем парке', cat: 'Осенняя семья' },
  { src: `${basePath}/work-72.jpg`, filename: 'work-72.jpg', title: 'Девушка в летнем поле', cat: 'Портрет' },
  { src: `${basePath}/work-73.jpg`, filename: 'work-73.jpg', title: 'С корзиной яблок', cat: 'Осенняя семья' },
  { src: `${basePath}/work-74.jpg`, filename: 'work-74.jpg', title: 'На листьях с яблоками', cat: 'Осенняя семья' },
  { src: `${basePath}/work-75.jpg`, filename: 'work-75.jpg', title: 'С цветами на осенней тропинке', cat: 'Осенняя семья' },
  { src: `${basePath}/work-76.jpg`, filename: 'work-76.jpg', title: 'Мама и две дочки с яблоками', cat: 'Осенняя семья' },
  { src: `${basePath}/work-77.jpg`, filename: 'work-77.jpg', title: 'Улыбающаяся девочка в розовом', cat: 'Осенняя семья' },
  { src: `${basePath}/work-78.jpg`, filename: 'work-78.jpg', title: 'Сердечко у ёлки', cat: 'Дети' },
  { src: `${basePath}/work-79.jpg`, filename: 'work-79.jpg', title: 'В студии с цветочными декорациями', cat: 'Дети' },
  { src: `${basePath}/work-80.jpg`, filename: 'work-80.jpg', title: 'Деловой портрет за столом', cat: 'Контент' },
  { src: `${basePath}/work-81.jpg`, filename: 'work-81.jpg', title: 'На голубом стуле в студии', cat: 'Контент' },
  { src: `${basePath}/work-82.jpg`, filename: 'work-82.jpg', title: 'На розовом фоне с шарами', cat: 'Дети' },
  { src: `${basePath}/work-83.jpg`, filename: 'work-83.jpg', title: 'На стуле с цветочным мольбертом', cat: 'Дети' },
  { src: `${basePath}/work-84.jpg`, filename: 'work-84.jpg', title: 'Семья у новогодней ёлки', cat: 'Семья' },
  { src: `${basePath}/work-85.jpg`, filename: 'work-85.jpg', title: 'Элегантная уверенность в студии', cat: 'Контент' },
  { src: `${basePath}/work-86.jpg`, filename: 'work-86.jpg', title: 'На розовом фоне с прозрачными шарами', cat: 'Дети' },
  { src: `${basePath}/work-87.jpg`, filename: 'work-87.jpg', title: 'Зимняя свадебная прогулка', cat: 'Свадьба' },
  { src: `${basePath}/work-88.jpg`, filename: 'work-88.jpg', title: 'С цветочной рамой в студии', cat: 'Портрет' },
  { src: `${basePath}/work-89.jpg`, filename: 'work-89.jpg', title: 'Деловой костюм в гостиной', cat: 'Контент' },
  { src: `${basePath}/work-90.jpg`, filename: 'work-90.jpg', title: 'Семья с игрушкой у ёлки', cat: 'Семья' },
  { src: `${basePath}/work-91.jpg`, filename: 'work-91.jpg', title: 'С журналом Vogue на синем стуле', cat: 'Контент' },
  { src: `${basePath}/work-92.jpg`, filename: 'work-92.jpg', title: 'В шубе у новогодних огней', cat: 'Портрет' },
  { src: `${basePath}/work-93.jpg`, filename: 'work-93.jpg', title: 'На сером кресле в интерьере', cat: 'Контент' },
  { src: `${basePath}/work-94.jpg`, filename: 'work-94.jpg', title: 'С цветами и картиной', cat: 'Дети' },
  { src: `${basePath}/work-95.jpg`, filename: 'work-95.jpg', title: 'В розовом топе с шарами', cat: 'Контент' },
  { src: `${basePath}/work-96.jpg`, filename: 'work-96.jpg', title: 'На розовом фоне в студии', cat: 'Дети' },
  { src: `${basePath}/work-97.jpg`, filename: 'work-97.jpg', title: 'Чёрный костюм с змеиным принтом', cat: 'Контент' },
  { src: `${basePath}/work-98.jpg`, filename: 'work-98.jpg', title: 'Зимняя уютная композиция', cat: 'Выставка' },
  { src: `${basePath}/work-99.jpg`, filename: 'work-99.jpg', title: 'В голубом платье на диване', cat: 'Дети' },
  { src: `${basePath}/work-100.jpg`, filename: 'work-100.jpg', title: 'Строгий костюм на голубом кресле', cat: 'Контент' },
]

interface AdminOverride {
  order: string[]
  hidden: string[]
  watercolor: string[]
  titles: Record<string, string>
  adjustments: Record<string, PhotoAdjustments> // per-photo adjustment settings
}

const defaultOverride: AdminOverride = {
  order: defaultShots.map((s) => s.filename),
  hidden: [],
  watercolor: [],
  titles: {},
  adjustments: {},
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
      adjustments: parsed.adjustments || {},
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
  // Photo editor state
  const [editorFilename, setEditorFilename] = useState<string | null>(null)
  const editorShot = editorFilename
    ? defaultShots.find((s) => s.filename === editorFilename)
    : null
  const editorInitial = editorFilename
    ? override.adjustments[editorFilename] || {
        ...defaultAdjustments,
        // If photo was marked as watercolor via old toggle, pre-set strength to 70%
        watercolor: override.watercolor.includes(editorFilename) ? 70 : 0,
      }
    : defaultAdjustments
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
    // Legacy quick-toggle: opens editor with watercolor pre-set to 70%
    const existing = override.adjustments[filename]
    if (existing && existing.watercolor > 0) {
      // If has adjustments with watercolor, clear them
      const adjustments = { ...override.adjustments }
      delete adjustments[filename]
      const watercolor = override.watercolor.filter((f) => f !== filename)
      persist({ ...override, adjustments, watercolor })
      toast({ title: 'Акварель выключена' })
    } else {
      // Open editor for fine-tuning
      setEditorFilename(filename)
    }
  }

  const applyAdjustments = (filename: string, a: PhotoAdjustments) => {
    const adjustments = { ...override.adjustments, [filename]: a }
    // Sync legacy watercolor flag (for backwards compat with portfolio.tsx)
    // Now considers both watercolor AND unpaint as "has filter"
    const hasFilter = a.watercolor > 0 || a.unpaint > 0
    const watercolor = hasFilter
      ? [...override.watercolor.filter((f) => f !== filename), filename]
      : override.watercolor.filter((f) => f !== filename)
    persist({ ...override, adjustments, watercolor })
    setEditorFilename(null)
    toast({
      title: hasFilter
        ? `Фильтр применён${a.watercolor > 0 ? ` (акварель ${a.watercolor}%${a.unpaint > 0 ? `, непрокрас ${a.unpaint}%` : ''})` : ` (непрокрас ${a.unpaint}%)`} 🎨`
        : 'Настройки сохранены',
    })
  }

  const openEditor = (filename: string) => {
    setEditorFilename(filename)
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
                  Нажмите <Sliders className="inline h-3 w-3 text-primary" /> «Редактор», чтобы открыть фоторедактор с ползунками: акварель, тени, экспозиция, теплота, контраст — с превью оригинала рядом для сравнения.
                  Нажмите <Sparkles className="inline h-3 w-3 text-primary" /> для быстрой акварели.
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
                    const adj = override.adjustments[item.filename]
                    const hasAdj = !!adj && (adj.watercolor > 0 || adj.unpaint > 0 || adj.shadows > 0 || adj.exposure !== 0 || adj.warmth !== 0 || adj.contrast !== 0)
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
                        <button
                          onClick={() => openEditor(item.filename)}
                          className="relative h-16 w-20 sm:w-24 shrink-0 overflow-hidden rounded-sm bg-secondary group cursor-pointer"
                          title="Открыть редактор фото"
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${
                              isHidden ? 'opacity-30' : ''
                            }`}
                            style={hasAdj && adj ? {
                              filter: buildFilterString(adj),
                            } : undefined}
                          />
                          {/* White paper-edge overlay for watercolor unpaint */}
                          {hasAdj && adj && adj.unpaint > 0 && (
                            <WatercolorEdgeOverlay strength={adj.unpaint} />
                          )}
                          {isWc && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] uppercase tracking-wide bg-primary text-primary-foreground rounded-full">
                              {adj?.watercolor ? `${adj.watercolor}%` : 'Акварель'}
                            </span>
                          )}
                          {hasAdj && (
                            <span className="absolute bottom-1 right-1 p-1 rounded-full bg-background/80 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <Sliders className="h-3 w-3" />
                            </span>
                          )}
                        </button>

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
                            {hasAdj && (
                              <span className="text-[10px] text-primary/70 flex items-center gap-0.5">
                                · <Sliders className="h-2.5 w-2.5" /> фильтр
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditor(item.filename)}
                            title="Редактировать фото (фильтры)"
                            className={`p-2 rounded-sm transition-colors ${
                              hasAdj
                                ? 'bg-primary/20 text-primary'
                                : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                            }`}
                          >
                            <Sliders className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleWatercolor(item.filename)}
                            title="Быстрая акварель"
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

      {/* Photo Editor modal — opened from list */}
      {editorShot && (
        <PhotoEditor
          key={editorShot.filename}
          open={!!editorFilename}
          src={editorShot.src}
          filename={editorShot.filename}
          initial={editorInitial}
          onClose={() => setEditorFilename(null)}
          onApply={(a) => applyAdjustments(editorShot.filename, a)}
        />
      )}
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
