import { Building2, MapPin, Wallet, Database } from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Онбординг и KYB",
    text: "Регистрация юрлица по ИНН, загрузка устава, ручная проверка Super Admin — доступ компании открывается за 1 рабочий день.",
  },
  {
    icon: MapPin,
    title: "Автопарк на карте",
    text: "Геолокация машин в реальном времени, статусы ТО и пробег, ручной перевод авто в сервисный режим.",
  },
  {
    icon: Wallet,
    title: "Биллинг в сумах",
    text: "Лимиты на сотрудника, автосчёт по отделам, акты в PDF/Excel, приём Payme, Click, Uzcard/Humo.",
  },
  {
    icon: Database,
    title: "Данные в Узбекистане",
    text: "Персональные данные хранятся на серверах внутри страны — по Закону РУз «О персональных данных».",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Что внутри</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl mt-2">
          Всё, что нужно АХО и водителям — в одном кабинете
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          Четыре модуля закрывают путь от регистрации юрлица до месячного акта.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground leading-tight">{f.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
