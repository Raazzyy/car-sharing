"use client"

import { useState } from "react"
import Link from "next/link"
import { Smartphone, Monitor, CircleParking, ArrowLeft } from "lucide-react"
import { MobileApp } from "@/components/mobile-app"
import { Dashboard } from "@/components/dashboard"

export default function DemoPage() {
  const [view, setView] = useState<"mobile" | "dashboard">("dashboard")

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="На главную"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CircleParking className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold leading-tight text-foreground">FleetGo</p>
              <p className="text-xs text-muted-foreground">Интерактивное демо</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setView("mobile")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Приложение</span>
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Дашборд</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {view === "mobile" ? "Мобильное приложение водителя" : "Дашборд корпоративного администратора"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            {view === "mobile"
              ? "Карта, ближайшие автомобили и бронирование в один тап с оплатой с корпоративного счёта."
              : "Метрики автопарка, динамика расходов и мониторинг текущих поездок сотрудников."}
          </p>
        </div>

        {view === "mobile" ? (
          <div className="flex justify-center py-4">
            <MobileApp />
          </div>
        ) : (
          <Dashboard />
        )}
      </section>
    </main>
  )
}
