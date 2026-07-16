import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { About } from '@/components/site/about'
import { Services } from '@/components/site/services'
import { Portfolio } from '@/components/site/portfolio'
import { Process } from '@/components/site/process'
import { Testimonials } from '@/components/site/testimonials'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { AdminPanel } from '@/components/site/admin-panel'
import { WatercolorFilters } from '@/components/site/watercolor-filters'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Hidden SVG with watercolor filter definitions (light/medium/strong).
          Rendered once globally so both Portfolio gallery and PhotoEditor
          can reference the filters via url(#watercolor-X). */}
      <WatercolorFilters />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <AdminPanel />
    </div>
  )
}
