"use client"

import { useState } from "react"
import {
  Menu,
  SlidersHorizontal,
  Fuel,
  Cog,
  Users,
  Snowflake,
  MapPin,
  Navigation,
  ChevronUp,
  Building2,
  Clock,
} from "lucide-react"

type CarPin = {
  id: string
  brand: string
  top: string
  left: string
  minutes: number
}

const carPins: CarPin[] = [
  { id: "1", brand: "Chevrolet", top: "34%", left: "44%", minutes: 3 },
  { id: "2", brand: "Kia", top: "22%", left: "68%", minutes: 6 },
  { id: "3", brand: "Hyundai", top: "58%", left: "28%", minutes: 8 },
  { id: "4", brand: "VW", top: "66%", left: "62%", minutes: 11 },
]

export function MobileApp() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative mx-auto h-[720px] w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-8 border-foreground bg-card shadow-2xl">
      {/* Map layer */}
      <div className="absolute inset-0">
        <img
          src="/map-light.png"
          alt="Карта города с доступными автомобилями"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/[0.02]" />

        {/* User location pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute -inset-4 animate-ping rounded-full bg-primary/20" />
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-card" />
          </span>
        </div>

        {/* Car pins */}
        {carPins.map((car) => (
          <button
            key={car.id}
            style={{ top: car.top, left: car.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            aria-label={`${car.brand}, ${car.minutes} мин ходьбы`}
          >
            <div className="flex items-center gap-1 rounded-full bg-card px-2 py-1 shadow-md ring-1 ring-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Navigation className="h-3.5 w-3.5 -rotate-45" />
              </span>
              <span className="pr-1 text-xs font-semibold text-foreground">{car.minutes} мин</span>
            </div>
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-card ring-1 ring-border" />
          </button>
        ))}
      </div>

      {/* Floating header */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-4">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-md ring-1 ring-border"
          aria-label="Меню"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-md ring-1 ring-border">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">ТехноПром</span>
          <span className="text-sm font-medium text-muted-foreground">· ₽42 800</span>
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-md ring-1 ring-border"
          aria-label="Фильтр"
        >
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 rounded-t-[1.75rem] bg-card shadow-[0_-8px_40px_rgba(17,24,39,0.12)] transition-all duration-300 ${
          expanded ? "h-[70%]" : "h-auto"
        }`}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto flex w-full flex-col items-center pt-3"
          aria-label={expanded ? "Свернуть панель" : "Развернуть панель"}
        >
          <span className="h-1.5 w-10 rounded-full bg-border" />
        </button>

        <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: expanded ? "calc(70% )" : "auto" }}>
          {expanded && (
            <div className="mt-4 overflow-hidden rounded-2xl bg-muted">
              <img
                src="/car-tracker.png"
                alt="Chevrolet Tracker"
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ближайший автомобиль · 3 мин</p>
              <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">Chevrolet Tracker</h2>
            </div>
            <span className="mt-1 rounded-lg bg-secondary px-2.5 py-1 font-mono text-sm font-semibold text-foreground">
              А 123 ВС
            </span>
          </div>

          {/* Specs */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Spec icon={<Fuel className="h-4 w-4" />} label="85%" sub="Топливо" highlight />
            <Spec icon={<Cog className="h-4 w-4" />} label="Автомат" sub="КПП" />
            <Spec icon={<Users className="h-4 w-4" />} label="4 места" sub="Салон" />
            <Spec icon={<Snowflake className="h-4 w-4" />} label="Есть" sub="Климат" />
          </div>

          {/* Corporate tariff */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-accent-foreground/15 bg-accent p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-foreground/10 text-accent-foreground">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-accent-foreground">Корпоративный тариф</p>
              <p className="truncate text-xs text-accent-foreground/80">
                Списание с корпоративного счёта ООО «ТехноПром»
              </p>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>ул. Тверская, 12</span>
              </div>
              <span className="text-lg font-bold text-foreground">₽ 8 / мин</span>
            </div>
          )}

          {/* CTA */}
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]">
            <Clock className="h-5 w-5" />
            Забронировать · 15 мин бесплатно
          </button>

          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-medium text-muted-foreground"
            >
              Подробнее об автомобиле
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Spec({
  icon,
  label,
  sub,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-secondary px-1 py-3 text-center">
      <span className={highlight ? "text-success" : "text-muted-foreground"}>{icon}</span>
      <span className="text-sm font-semibold leading-tight text-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground">{sub}</span>
    </div>
  )
}
