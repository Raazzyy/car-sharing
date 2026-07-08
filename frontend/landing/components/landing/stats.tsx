const stats = [
  { value: "2 400+", label: "автомобилей в сети" },
  { value: "500+", label: "компаний-клиентов" },
  { value: "−32%", label: "средняя экономия на транспорте" },
  { value: "15 сек", label: "среднее время бронирования" },
]

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 rounded-3xl border border-border bg-secondary px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 select-none">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-4xl font-extrabold text-foreground font-mono">{s.value}</p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground text-pretty">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
