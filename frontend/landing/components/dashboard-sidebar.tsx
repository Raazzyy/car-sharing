"use client"

import { LayoutDashboard, Car, Users, Route, ReceiptText, Settings, CircleParking } from "lucide-react"

const nav = [
  { label: "Дашборд", icon: LayoutDashboard, active: true },
  { label: "Автопарк", icon: Car },
  { label: "Сотрудники", icon: Users },
  { label: "История поездок", icon: Route },
  { label: "Биллинг", icon: ReceiptText },
  { label: "Настройки", icon: Settings },
]

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-4 md:flex">
      <div className="flex items-center gap-2 px-2 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <CircleParking className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-sidebar-accent-foreground">FleetGo</span>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-sidebar-accent p-4">
        <p className="text-xs font-medium text-sidebar-foreground">Лимит на месяц</p>
        <p className="mt-1 text-lg font-bold text-sidebar-accent-foreground">₽42 800 / ₽150 000</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sidebar/60">
          <div className="h-full w-[29%] rounded-full bg-sidebar-primary" />
        </div>
      </div>
    </aside>
  )
}
