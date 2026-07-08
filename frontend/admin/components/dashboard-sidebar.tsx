"use client"

import { LayoutDashboard, Car, Building2, Users, CalendarDays, ReceiptText, ShieldAlert, MessageSquare } from "lucide-react"

const nav = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "fleet", label: "Автопарк", icon: Car },
  { id: "companies", label: "Компании", icon: Building2 },
  { id: "employees", label: "Сотрудники", icon: Users },
  { id: "bookings", label: "Бронирования", icon: CalendarDays },
  { id: "billing", label: "Биллинг", icon: ReceiptText },
  { id: "incidents", label: "Штрафы и ДТП", icon: ShieldAlert },
  { id: "support", label: "Поддержка B2B", icon: MessageSquare },
]


export function DashboardSidebar({
  activeTab,
  onChangeTab,
}: {
  activeTab: string
  onChangeTab: (tab: string) => void
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-4 md:flex">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-turquoise-light text-turquoise">
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <polygon points="20,3 25,14 37,14 27,21 31,33 20,26 9,33 13,21 3,14 15,14" fill="currentColor" />
          </svg>
        </span>
        <div>
          <span className="text-base font-extrabold tracking-wide text-sidebar-accent-foreground block leading-none">YOʻLDA</span>
          <span className="text-[10px] text-[#8C97A8] block mt-0.5 font-mono">Fleet Console</span>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left w-full ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-sidebar-accent p-4">
        <p className="text-xs font-medium text-sidebar-foreground">Лимит на месяц</p>
        <p className="mt-1 text-[13px] font-bold text-sidebar-accent-foreground">4 280 000 сум / 15 000 000 сум</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sidebar/60">
          <div className="h-full w-[29%] rounded-full bg-turquoise" />
        </div>
      </div>
    </aside>
  )
}
