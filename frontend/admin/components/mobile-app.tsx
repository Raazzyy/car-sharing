"use client"

import { useState, useEffect } from "react"
import { Fuel, Cog, Users as UsersIcon, Snowflake, Navigation, Check } from "lucide-react"

export function MobileApp() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0) // 0: initial, 1: car selected, 2: active trip, 3: completed
  const [tripSeconds, setTripSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (step === 2) {
      interval = setInterval(() => {
        setTripSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [step])

  const formatTimer = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
    const secs = String(totalSeconds % 60).padStart(2, "0")
    return `${hrs}:${mins}:${secs}`
  }

  const handleSelectCar = () => {
    if (step === 0) {
      setStep(1)
    }
  }

  const handleConfirmLease = () => {
    if (step === 1) {
      setStep(2)
      setTripSeconds(0)
    }
  }

  const handleEndTrip = () => {
    if (step === 2) {
      setStep(3)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 bg-paper-2 rounded-3xl p-6 border border-border shadow-md">
      <div className="text-center max-w-[340px]">
        <h3 className="font-extrabold text-foreground text-lg leading-tight">Интерактивный симулятор</h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Протестируйте бронирование автомобиля в два тапа. Нажмите на Cobalt в симуляторе, затем подтвердите аренду.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
        {/* iOS Shell - Booking Flow */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-mono text-ink-soft uppercase tracking-wide">iOS · Бронирование в два тапа</p>
          <div className="w-[300px] h-[620px] bg-ink rounded-[42px] p-3 shadow-xl border border-white/10 relative shrink-0">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-ink rounded-b-2xl z-30" />
            
            {/* Screen */}
            <div className="w-full h-full bg-paper rounded-[32px] overflow-hidden relative flex flex-col z-10 select-none">
              
              {/* Statusbar */}
              <div className="flex justify-between items-center px-6 pt-3.5 pb-1.5 font-mono text-xs text-ink shrink-0">
                <span>09:41</span>
                <div className="flex gap-1.5 items-center font-bold">
                  <span className="text-[9px]">5G</span>
                  <span className="text-[10px]">🔋</span>
                </div>
              </div>

              {/* Conditional views */}
              {step <= 1 ? (
                <>
                  {/* App Header */}
                  <div className="px-5 pt-1.5 pb-3 shrink-0">
                    <h4 className="font-extrabold text-lg text-ink font-display leading-tight">Привет, Алишер</h4>
                    <div className="inline-flex items-center gap-2 mt-2 bg-card border border-border rounded-full py-1 px-3 text-[11px] text-ink-soft shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-cobalt" />
                      IT Solutions · 1 500 000 сум
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2 px-5 pb-3 shrink-0 text-xs">
                    <span className="bg-navy text-paper font-semibold px-3 py-1 rounded-full border border-navy">Все</span>
                    <span className="bg-card text-ink-soft px-3 py-1 rounded-full border border-border">Седан</span>
                    <span className="bg-card text-ink-soft px-3 py-1 rounded-full border border-border">Внедорожник</span>
                  </div>

                  {/* Map grid stub */}
                  <div className="mx-4 bg-paper-2 rounded-2xl h-44 overflow-hidden relative border border-border shrink-0 flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 300 190">
                      <g stroke="rgba(24,27,32,0.07)" strokeWidth="1">
                        <line x1="0" y1="45" x2="300" y2="45"/><line x1="0" y1="95" x2="300" y2="95"/>
                        <line x1="70" y1="0" x2="70" y2="190"/><line x1="150" y1="0" x2="150" y2="190"/>
                      </g>
                      <circle cx="130" cy="85" r="8" fill="var(--color-cobalt)"/>
                      <circle cx="130" cy="85" r="18" fill="var(--color-cobalt)" opacity="0.18"/>
                      <circle cx="90" cy="40" r="5" fill="var(--color-turquoise)"/>
                      <circle cx="210" cy="120" r="5" fill="var(--color-turquoise)"/>
                    </svg>
                    <span className="text-[10px] font-mono text-ink-soft relative z-10">Map View</span>
                  </div>

                  {/* Bottom sheet */}
                  <div className="bg-card rounded-t-3xl mt-[-22px] flex-1 p-4 shadow-t-lg flex flex-col justify-between z-20 border-t border-border">
                    <div className="w-9 h-1 bg-border rounded-full mx-auto mb-3 shrink-0" />
                    
                    {/* Car Card target */}
                    <button 
                      onClick={handleSelectCar}
                      className={`flex gap-3 items-center border rounded-2xl p-3 w-full text-left transition-all ${
                        step === 1 ? "bg-cobalt/10 border-cobalt shadow-sm" : "border-border hover:bg-muted/10 bg-card"
                      }`}
                    >
                      <span className="w-10 h-10 rounded-xl bg-turquoise-light text-turquoise flex items-center justify-center shrink-0">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="10" width="18" height="6" rx="2"/><circle cx="7.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/>
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-ink leading-tight">Cobalt LT</p>
                        <p className="font-mono text-[10px] text-ink-soft mt-0.5">01 A 774 BB · 150 м</p>
                      </div>
                      <span className="font-bold text-xs text-cobalt shrink-0">25К сум/ч</span>
                    </button>

                    {/* Book CTA */}
                    {step === 0 ? (
                      <div className="bg-navy/50 text-paper/70 font-semibold py-3.5 rounded-xl text-center text-[13px] cursor-not-allowed select-none mt-3">
                        Тап 1: Выберите Cobalt
                      </div>
                    ) : (
                      <button 
                        onClick={handleConfirmLease}
                        className="bg-turquoise text-navy font-bold py-3.5 rounded-xl text-center text-[13px] mt-3 hover:opacity-90 active:scale-[0.98] transition-transform"
                      >
                        Тап 2: Подтвердить аренду →
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center px-6 text-center bg-card">
                  <span className="w-14 h-14 bg-teal-50 text-turquoise rounded-full flex items-center justify-center mb-4">
                    <Check className="h-7 w-7" strokeWidth={3} />
                  </span>
                  <h4 className="font-extrabold text-ink text-base">Аренда подтверждена!</h4>
                  <p className="text-xs text-ink-soft mt-2 leading-relaxed">
                    Машина разблокирована. Перейдите к симулятору активной поездки на Android-устройстве справа.
                  </p>
                  <button 
                    onClick={() => { setStep(0); setTripSeconds(0); }} 
                    className="mt-6 text-xs text-cobalt font-semibold border-b border-cobalt leading-none pb-0.5"
                  >
                    Сбросить симулятор
                  </button>
                </div>
              )}

              {/* iOS Home Indicator Bar */}
              <div className="w-[110px] h-[4px] bg-ink rounded-full mx-auto mb-2 shrink-0 opacity-50 z-30" />
            </div>
          </div>
        </div>

        {/* Android Shell - Active Trip Status */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-mono text-ink-soft uppercase tracking-wide">Android · Активная поездка</p>
          <div className="w-[300px] h-[620px] bg-ink rounded-[30px] p-3 shadow-xl border border-white/10 relative shrink-0">
            {/* Camera punchhole */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-ink rounded-full z-30" />
            
            {/* Screen */}
            <div className="w-full h-full bg-paper rounded-[20px] overflow-hidden relative flex flex-col z-10 select-none">
              
              {/* Statusbar */}
              <div className="flex justify-between items-center px-5 pt-3.5 pb-1.5 font-mono text-xs text-ink shrink-0">
                <span>09:41</span>
                <div className="flex gap-1 items-center font-bold">
                  <span className="text-[9px]">LTE</span>
                  <span className="text-[10px]">🔋</span>
                </div>
              </div>

              {/* Main Content Area */}
              {step >= 2 ? (
                <>
                  {/* Trip details */}
                  <div className="px-5 py-4 shrink-0">
                    <p className="text-[10px] font-extrabold text-ink-soft uppercase tracking-wider mb-0.5">Аренда активна</p>
                    <p className="text-3xl font-bold font-mono text-cobalt tracking-tight">
                      {formatTimer(tripSeconds)}
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="flex-1 px-5 flex flex-col gap-2.5">
                    <div className="flex gap-3 items-center bg-card border border-border rounded-xl p-3">
                      <span className="w-5 h-5 rounded-md bg-turquoise text-white flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="font-bold text-xs text-ink leading-tight">Осмотр при старте</p>
                        <p className="text-[10px] text-ink-soft mt-0.5 leading-none">4 фото загружены</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center bg-card border border-border rounded-xl p-3">
                      <span className="w-5 h-5 rounded-md bg-turquoise text-white flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="font-bold text-xs text-ink leading-tight">Топливо зафиксировано</p>
                        <p className="text-[10px] text-ink-soft mt-0.5 leading-none">Уровень: 64% (3/4 бака)</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center bg-card border border-border rounded-xl p-3">
                      {step === 3 ? (
                        <span className="w-5 h-5 rounded-md bg-turquoise text-white flex items-center justify-center shrink-0 animate-fade-in">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md border border-border shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold text-xs leading-tight ${step === 3 ? "line-through text-ink-soft" : "text-ink"}`}>
                          Пробег на завершении
                        </p>
                        <p className="text-[10px] text-ink-soft mt-0.5 leading-none">
                          {step === 3 ? "Пробег отправлен: 42 342 км" : "Заполнить перед сдачей"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Actions */}
                  <div className="px-5 pb-5 shrink-0">
                    {step === 2 ? (
                      <button 
                        onClick={handleEndTrip}
                        className="bg-destructive text-white font-bold py-3.5 rounded-xl text-center text-[13px] w-full hover:opacity-90 active:scale-[0.98] transition-transform"
                      >
                        Завершить поездку
                      </button>
                    ) : (
                      <div className="bg-secondary text-ink-soft font-semibold py-3.5 rounded-xl text-center text-[13px] w-full">
                        Поездка завершена
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center px-6 text-center bg-card">
                  <p className="text-xs text-ink-soft leading-relaxed max-w-[200px]">
                    Нажмите «Подтвердить аренду» на iOS-симуляторе слева, чтобы запустить таймер поездки здесь.
                  </p>
                </div>
              )}

              {/* Android nav buttons stub */}
              <div className="flex justify-center gap-12 py-3 bg-neutral-50/50 border-t border-border shrink-0 text-ink-soft text-base">
                <span className="opacity-40">◁</span>
                <span className="opacity-40">◯</span>
                <span className="opacity-40">☐</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
