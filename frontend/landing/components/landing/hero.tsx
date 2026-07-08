import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Zap } from "lucide-react"

export function Hero({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-foreground" />
            Для отдела АХО и автопарка компаний
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl leading-[1.08]">
            Корпоративный автопарк, который сам считает расходы
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Подключаете свои машины или пул YOʻLDA, раздаёте доступ сотрудникам по лимитам — а бухгалтерия получает акт в сумах и Excel, а не гору бумажных путевых листов.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenForm}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90 shadow-md cursor-pointer"
            >
              Подключить компанию →
            </button>
            <a
              href="http://localhost:3000"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Смотреть демо
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-border/70 pt-6 w-full max-w-lg select-none">
            <div>
              <p className="text-xl font-extrabold text-foreground font-mono">420+</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">автомобилей в пуле</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground font-mono">68</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">компаний-клиентов</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground font-mono">3</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">города присутствия</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground font-mono">99.6%</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">доступность</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <Image
              src="/fleet-hero.png"
              alt="Корпоративный автопарк FleetGo"
              width={720}
              height={540}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
            <p className="text-xs text-muted-foreground">Автомобилей в пуле</p>
            <p className="text-2xl font-bold text-foreground">420+</p>
          </div>
          <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
            <p className="text-xs text-muted-foreground">Экономия бюджета</p>
            <p className="text-2xl font-bold text-turquoise">−34%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
