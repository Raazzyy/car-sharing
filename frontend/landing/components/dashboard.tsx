"use client"

import { Bell, Search, Building2, CarFront, Wallet, Gauge, TriangleAlert, TrendingUp, TrendingDown } from "lucide-react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { SpendChart } from "./spend-chart"

const kpis = [
  { label: "Активные аренды", value: "12", delta: "+3", up: true, icon: CarFront },
  { label: "Траты за месяц", value: "₽42 800", delta: "+18%", up: true, icon: Wallet },
  { label: "Пробег автопарка", value: "8 240 км", delta: "+6%", up: true, icon: Gauge },
  { label: "Количество штрафов", value: "2", delta: "-1", up: false, icon: TriangleAlert },
]

type Trip = {
  driver: string
  initials: string
  car: string
  plate: string
  status: "moving" | "done"
  start: string
  cost: string
}

const trips: Trip[] = [
  { driver: "Анна Смирнова", initials: "АС", car: "Chevrolet Tracker", plate: "А 123 ВС", status: "moving", start: "09:24", cost: "₽ 640" },
  { driver: "Игорь Волков", initials: "ИВ", car: "Kia Rio", plate: "О 456 КМ", status: "moving", start: "09:10", cost: "₽ 420" },
  { driver: "Мария Козлова", initials: "МК", car: "Hyundai Solaris", plate: "Т 789 РН", status: "done", start: "08:45", cost: "₽ 1 180" },
  { driver: "Дмитрий Орлов", initials: "ДО", car: "VW Polo", plate: "Е 321 АА", status: "done", start: "08:12", cost: "₽ 960" },
  { driver: "Елена Титова", initials: "ЕТ", car: "Kia Rio", plate: "У 654 ВВ", status: "moving", start: "07:58", cost: "₽ 1 540" },
]

export function Dashboard() {
  return (
    <div className="flex h-[720px] w-full overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-base font-bold leading-tight text-foreground">ООО «ТехноПром»</h1>
              <p className="text-xs text-muted-foreground">Корпоративный аккаунт</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 lg:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Поиск поездок, сотрудников…"
                className="w-48 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="hidden rounded-xl bg-accent px-3 py-2 text-right sm:block">
              <p className="text-[11px] font-medium text-accent-foreground/80">Бюджет месяца</p>
              <p className="text-sm font-bold text-accent-foreground">₽107 200 осталось</p>
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background" aria-label="Уведомления">
              <Bell className="h-4.5 w-4.5 text-foreground" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              АП
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Дашборд</h2>
              <p className="text-sm text-muted-foreground">Обзор автопарка за октябрь 2025</p>
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-xs font-semibold ${
                        kpi.up ? "text-success" : "text-destructive"
                      }`}
                    >
                      {kpi.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {kpi.delta}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{kpi.label}</p>
                </div>
              )
            })}
          </div>

          {/* Chart */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Расходы по дням</h3>
                <p className="text-sm text-muted-foreground">Динамика списаний с корпоративного счёта</p>
              </div>
              <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">Октябрь</span>
            </div>
            <div className="mt-4">
              <SpendChart />
            </div>
          </div>

          {/* Trips table */}
          <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="font-semibold text-foreground">Текущие поездки</h3>
              <a href="#" className="text-sm font-medium text-primary">
                Все поездки
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-y border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Водитель</th>
                    <th className="px-5 py-2.5 font-medium">Автомобиль</th>
                    <th className="px-5 py-2.5 font-medium">Статус</th>
                    <th className="px-5 py-2.5 font-medium">Старт</th>
                    <th className="px-5 py-2.5 text-right font-medium">Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                            {t.initials}
                          </span>
                          <span className="font-medium text-foreground">{t.driver}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-foreground">{t.car}</div>
                        <div className="font-mono text-xs text-muted-foreground">{t.plate}</div>
                      </td>
                      <td className="px-5 py-3">
                        {t.status === "moving" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            В пути
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            Завершено
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{t.start}</td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">{t.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
