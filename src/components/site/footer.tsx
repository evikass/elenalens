'use client'

import { Camera, Phone, Mail, MessageCircle, Instagram, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-2 mb-4">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 text-primary">
                <Camera className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <span className="font-serif text-xl tracking-wide">
                Elena<span className="text-primary">Lens</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Фотостудия Елены. Живые портреты, семейные истории и свадебные
              кадры в Москве и области.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Навигация
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'Обо мне', href: '#about' },
                { label: 'Услуги', href: '#services' },
                { label: 'Портфолио', href: '#portfolio' },
                { label: 'Процесс', href: '#process' },
                { label: 'Отзывы', href: '#testimonials' },
                { label: 'Контакты', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Связь
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+79000000000"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" /> +7 (900) 000-00-00
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@elenalens.ru"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" /> hello@elenalens.ru
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/elenalens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Send className="h-4 w-4" /> Telegram @elenalens
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/elenalens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram @elenalens.photo
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/elenalens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> ВКонтакте / elenalens
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} ElenaLens. Все фотографии защищены
            авторским правом.
          </span>
          <span className="flex items-center gap-1.5">
            Сделано с
            <span className="text-primary">♥</span>для тех, кто умеет видеть
          </span>
        </div>
      </div>
    </footer>
  )
}
