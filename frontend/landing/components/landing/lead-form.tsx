"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

export function LeadForm({ selectedTariff, onClose }: { selectedTariff?: string; onClose?: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tariff, setTariff] = useState(selectedTariff || "Общий пул")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="p-8 md:p-12">
      <div>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">Подключение</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground text-balance mt-2">
            Оставить заявку на B2B-доступ
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Заполните форму ниже. Мы свяжемся с вами в течение 15 минут для обсуждения условий сотрудничества и демонстрации платформы.
          </p>
        </div>

        {submitted ? (
          <div className="mt-10 flex flex-col items-center text-center p-8 bg-secondary border border-border rounded-2xl animate-fade-in">
            <CheckCircle2 className="h-14 w-14 text-foreground" />
            <h3 className="mt-4 text-lg font-bold text-foreground">Заявка успешно отправлена!</h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm">
              Наш менеджер уже проверяет данные вашей компании и позвонит вам в ближайшее время. Благодарим за доверие к YOʻLDA!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-bold text-foreground">
                ФИО контактного лица
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Иван Иванов"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-xs font-bold text-foreground">
                Название организации
              </label>
              <input
                id="company"
                type="text"
                required
                placeholder="ООО «Uzum Market»"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-bold text-foreground">
                Номер телефона
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="+998 (__) ___-__-__"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold text-foreground">
                Электронная почта
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="corp@company.uz"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="tariff" className="text-xs font-bold text-foreground">
                Выбранный формат работы
              </label>
              <select
                id="tariff"
                value={tariff}
                onChange={(e) => setTariff(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              >
                <option value="Выделенный парк">Выделенный парк (свои машины на нашей платформе)</option>
                <option value="Общий пул">Общий пул (по поездкам, из общего парка YO'LDA)</option>
                <option value="Тариф «Корпорация»">Тариф «Корпорация» (фикс на месяц + лимиты по отделам)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="fleetSize" className="text-xs font-bold text-foreground">
                Требуемое количество автомобилей (ориентировочно)
              </label>
              <select
                id="fleetSize"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
              >
                <option value="1-5">От 1 до 5 авто</option>
                <option value="5-20">От 5 до 20 авто</option>
                <option value="20-50">От 20 до 50 авто</option>
                <option value="50+">Более 50 авто (выделенный парк)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 sm:col-span-2 w-full rounded-xl bg-foreground py-4 text-sm font-bold text-background shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
