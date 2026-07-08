import { Check } from "lucide-react"

const plans = [
  {
    name: "Выделенный парк",
    price: "Индивидуально",
    period: "",
    desc: "Свои машины на нашей платформе: обслуживание, ТО и штрафы — на нас, доступ — только у ваших сотрудников.",
    features: ["Ваши автомобили на карте", "Гибкая настройка лимитов", "Мониторинг ТО и пробега", "Ручной перевод в сервис"],
    cta: "Подключить парк",
    highlighted: false,
  },
  {
    name: "Общий пул",
    price: "По поездкам",
    period: "",
    desc: "Берёте машину из общего парка YOʻLDA, когда нужно — дешевле такси и без простоя авто на вашем балансе.",
    features: [
      "Общий пул автомобилей",
      "Без абонентской платы",
      "Оплата с корпсчёта по UZS",
      "Зоны по Ташкенту и РУз",
    ],
    cta: "Оставить заявку",
    highlighted: true,
  },
  {
    name: "Тариф «Корпорация»",
    price: "Индивидуально",
    period: "",
    desc: "Фикс на месяц + лимиты по отделам, приоритетная поддержка и персональный менеджер внедрения.",
    features: ["Фикс на месяц + лимиты", "Персональный менеджер", "Интеграция с 1С и ERP", "SLA и API-доступ"],
    cta: "Связаться с нами",
    highlighted: false,
  },
]

export function Pricing({ onOpenForm }: { onOpenForm: (planName: string) => void }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Форматы работы</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl mt-2">
          Выбираете, чем управляете — мы под это подстраиваем биллинг
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          Поездки автоматически списываются напрямую с корпоративного счёта компании.
        </p>
      </div>

      <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-2xl border p-6 min-h-[420px] justify-between ${
              p.highlighted
                ? "border-primary bg-card shadow-lg ring-1 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <div>
              {p.highlighted && (
                <span className="mb-4 w-fit rounded-full bg-foreground px-3 py-1 text-[10px] font-bold text-background">
                  Популярный
                </span>
              )}
              <h3 className="text-base font-bold text-foreground mt-2">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground text-pretty">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.period}</span>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onOpenForm(p.name)}
              className={`mt-8 rounded-xl px-4 py-3 text-center text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer ${
                p.highlighted
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-secondary text-foreground"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Case study banner */}
      <div id="cases" className="mt-16 rounded-3xl bg-secondary p-8 md:p-12 text-foreground grid md:grid-cols-12 gap-8 items-center border border-border shadow-sm select-none">
        <div className="md:col-span-7 text-left">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Кейс</span>
          <p className="mt-4 text-base font-bold leading-relaxed font-display text-foreground text-pretty">
            «Раньше путевые листы сверяли в Excel по вечерам пятницы. Сейчас акт для бухгалтерии готов первого числа сам — мы просто его подписываем».
          </p>
          <div className="mt-6 flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-bold text-sm font-mono">
              DU
            </span>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">Дилноза У.</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-none font-medium">Офис-менеджер, Artel Electronics JV</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 border-t border-border/50 md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8 flex flex-col gap-6 text-left">
          <div>
            <p className="text-3xl font-extrabold text-foreground font-mono leading-none">−34%</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">расходов на нецелевые поездки за 3 месяца</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground font-mono leading-none">6 ч → 20 мин</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">на закрытие месячной отчётности</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground font-mono leading-none">54</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">сотрудника подключено к парку из 40 авто</p>
          </div>
        </div>
      </div>
    </section>
  )
}
