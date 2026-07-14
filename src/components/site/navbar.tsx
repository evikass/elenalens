'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Обо мне', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Процесс', href: '#process' },
  { label: 'Отзывы', href: '#testimonials' },
  { label: 'Контакты', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 text-primary">
              <Camera className="h-4 w-4" strokeWidth={1.6} />
              <span className="absolute -inset-1 rounded-full border border-primary/20 group-hover:scale-110 transition-transform" />
            </span>
            <span className="font-serif text-xl tracking-wide">
              Elena<span className="text-primary">Lens</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
            >
              <a href="#contact">Записаться</a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-3 -mr-3 text-foreground active:scale-95 transition-transform"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            aria-expanded={open}
            style={{ touchAction: 'manipulation' }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay — tap to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-background/40 backdrop-blur-sm"
              style={{ touchAction: 'manipulation' }}
              aria-hidden="true"
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                touchAction: 'manipulation',
                pointerEvents: 'auto',
              }}
              className="md:hidden fixed top-16 sm:top-20 inset-x-0 z-50 bg-background/98 backdrop-blur-md border-b border-border shadow-2xl"
            >
              <ul className="px-4 py-3 flex flex-col gap-0 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scroll">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block min-h-[48px] px-4 py-3 text-base text-foreground hover:text-primary hover:bg-secondary/60 rounded-md transition-colors active:bg-secondary"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-3 px-4 pb-2">
                  <Button
                    asChild
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    <a
                      href="#contact"
                      onClick={() => setOpen(false)}
                      style={{ touchAction: 'manipulation' }}
                    >
                      Записаться на съёмку
                    </a>
                  </Button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
