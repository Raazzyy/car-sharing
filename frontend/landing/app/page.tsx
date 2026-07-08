"use client"

import { useState } from "react"
import { SiteNav } from "@/components/landing/site-nav"
import { Hero } from "@/components/landing/hero"
import { Logos } from "@/components/landing/logos"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Stats } from "@/components/landing/stats"
import { Pricing } from "@/components/landing/pricing"
import { LeadForm } from "@/components/landing/lead-form"
import { CtaFooter } from "@/components/landing/cta-footer"

export default function Page() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("Общий пул")

  const handleOpenForm = (planName?: string) => {
    setSelectedPlan(planName || "Общий пул")
    setIsFormOpen(true)
  }

  return (
    <main className="min-h-screen bg-background relative">
      <SiteNav onOpenForm={() => handleOpenForm()} />
      <Hero onOpenForm={() => handleOpenForm()} />
      <Logos />
      <Features />
      <HowItWorks />
      <Stats />
      <Pricing onOpenForm={(planName) => handleOpenForm(planName)} />
      <CtaFooter onOpenForm={() => handleOpenForm()} />

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors z-10 font-bold"
              aria-label="Закрыть"
            >
              ✕
            </button>
            <LeadForm selectedTariff={selectedPlan} onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </main>
  )
}
