"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"

const links = [
  { label: "Продукт", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Для партнёров", href: "#partners" },
  { label: "Кейсы", href: "#cases" },
]

export function SiteNav({ onOpenForm }: { onOpenForm: () => void }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null
    const initial = saved || "light"
    setTheme(initial)
    if (initial === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("theme", next)
    if (next === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/10 text-foreground">
            <svg viewBox="0 0 40 40" className="h-6 w-6">
              <polygon points="20,3 25,14 37,14 27,21 31,33 20,26 9,33 13,21 3,14 15,14" fill="currentColor" />
            </svg>
          </span>
          <span className="text-base font-extrabold text-foreground tracking-wide">YOʻLDA</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex select-none">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary cursor-pointer"
            aria-label="Переключить тему"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>
          
          <a
            href="http://localhost:3000"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Смотреть демо
          </a>
          <button
            onClick={onOpenForm}
            className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 cursor-pointer"
          >
            Оставить заявку
          </button>
        </div>
      </nav>
    </header>
  )
}
