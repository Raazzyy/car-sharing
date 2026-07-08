const steps = [
  {
    step: "01",
    title: "Регистрируете компанию",
    text: "ИНН, реквизиты, устав — Super Admin проверяет вручную и открывает кабинет.",
  },
  {
    step: "02",
    title: "Настраиваете лимиты",
    text: "Указываете, сколько сотрудников, какой бюджет на человека и отдел, какие авто доступны.",
  },
  {
    step: "03",
    title: "Приглашаете сотрудников",
    text: "По телефону или email; водительские права проверяются автоматически при загрузке.",
  },
  {
    step: "04",
    title: "Получаете акт в конце месяца",
    text: "Расходы по отделам и сотрудникам собраны сами — бухгалтерии остаётся только подписать.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Как это устроено</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl mt-2">
            От заявки до первой поездки сотрудника — 4 шага
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="relative rounded-2xl bg-background border border-border p-5 shadow-sm">
              <span className="text-3xl font-extrabold text-foreground/15 font-mono">{s.step}</span>
              <h3 className="mt-2 text-sm font-bold text-foreground leading-tight">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
