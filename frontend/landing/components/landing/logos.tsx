const paymentProviders = ["Payme", "Click", "Uzcard", "Humo"]

export function Logos() {
  return (
    <section id="partners" className="bg-secondary py-10 border-y border-border select-none">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left shrink-0">
          <p className="text-xs text-muted-foreground mb-1">Локальные платежи без интеграции сторонних банков</p>
          <strong className="text-foreground text-base font-extrabold font-display">Оплата напрямую в приложении</strong>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {paymentProviders.map((p) => (
            <span key={p} className="font-mono text-xs font-bold text-foreground border border-border px-5 py-2.5 rounded-2xl bg-card shadow-sm">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
