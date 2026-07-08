"use client"

import { useState, useEffect } from "react"
import { 
  Bell, Search, Building2, CarFront, Wallet, Gauge, 
  TriangleAlert, TrendingUp, TrendingDown, Plus, X, 
  CheckCircle2, User, Mail, Phone, Shield, CreditCard, 
  AlertCircle, ArrowUpRight, ArrowDownLeft, Download, 
  MapPin, Activity, Lock, Unlock, Volume2, AlertTriangle,
  MessageSquare, ShieldCheck, ShieldAlert, Fuel, Zap 
} from "lucide-react"
import { DashboardSidebar } from "./dashboard-sidebar"

const initialTrips = [
  { driver: "Алишер Каримов", initials: "АК", car: "Chevrolet Cobalt LT", plate: "01 A 777 QA", status: "moving", start: "Сегодня, 09:12", cost: "35 000 сум" },
  { driver: "Дильноза Юсупова", initials: "ДЮ", car: "Chevrolet Lacetti", plate: "01 B 214 KX", status: "done", start: "Вчера, 14:05", cost: "120 000 сум" },
  { driver: "Бобур Турсунов", initials: "БТ", car: "Chevrolet Malibu 2", plate: "30 A 019 BT", status: "done", start: "05 Июл, 10:20", cost: "450 000 сум" },
  { driver: "Саида Мирзаева", initials: "СМ", car: "Chevrolet Spark", plate: "01 H 552 MN", status: "moving", start: "Сегодня, 08:30", cost: "18 000 сум" },
] as const

const initialFleet = [
  { plate: "01 A 777 QA", model: "Chevrolet Cobalt LT", status: "moving", charge: "64%", mileage: "42 300 км", lat: 41.328, lng: 69.278, speed: "62 км/ч", temp: "92 °C", pressure: "2.2 bar" },
  { plate: "01 B 214 KX", model: "Chevrolet Nexia 3", status: "free", charge: "82%", mileage: "58 900 км", lat: 41.302, lng: 69.232, speed: "0 км/ч", temp: "85 °C", pressure: "2.3 bar" },
  { plate: "30 A 019 BT", model: "Chevrolet Malibu 2", status: "service", charge: "14%", mileage: "71 100 км", lat: 41.342, lng: 69.215, speed: "0 км/ч", temp: "22 °C", pressure: "2.1 bar" },
  { plate: "01 Z 885 ZZ", model: "BYD Song Plus EV", status: "free", charge: "95%", mileage: "3 120 км", lat: 41.318, lng: 69.262, speed: "0 км/ч", temp: "35 °C", pressure: "2.4 bar" },
]

const initialCompanies = [
  { name: "ООО «Uzum Market»", inn: "309182402", tariff: "Корпорация", limit: "15 000 000 сум / мес", status: "approved" },
  { name: "Artel Electronics JV", inn: "201948201", tariff: "Корпорация", limit: "25 000 000 сум / мес", status: "approved" },
  { name: "Samarkand Travel LLC", inn: "302848109", tariff: "Start-up", limit: "5 000 000 сум / мес", status: "approved" },
  { name: "Tashkent Logistics JV", inn: "309824021", tariff: "Enterprise", limit: "Индивидуальный", status: "pending" },
]

const initialEmployees = [
  { name: "Алишер Каримов", role: "Водитель", used: "450 000 сум", limit: "1 500 000 сум", mileage: "142 км", status: "active" },
  { name: "Дильноза Юсупова", role: "Менеджер АХО", used: "1 890 000 сум", limit: "3 000 000 сум", mileage: "512 км", status: "active" },
  { name: "Бобур Турсунов", role: "Разработчик", used: "950 000 сум", limit: "1 000 000 сум", mileage: "15 км", status: "active" },
  { name: "Саида Мирзаева", role: "Sales Director", used: "950 000 сум", limit: "2 000 000 сум", mileage: "280 км", status: "active" },
]

const initialBookings = [
  { id: "#774129", driver: "Алишер Каримов", car: "Cobalt LT (01 A 774 BB)", start: "Сегодня, 09:12", distance: "12 км", cost: "35 000 сум" },
  { id: "#774092", driver: "Дильноза Юсупова", car: "Nexia 3 (01 B 220 AA)", start: "Вчера, 14:05", distance: "45 км", cost: "120 000 сум" },
  { id: "#773821", driver: "Саида Мирзаева", car: "Malibu 2 (01 A 019 CC)", start: "05 Июл, 10:20", distance: "110 км", cost: "450 000 сум" },
]

const initialIncidents = [
  { id: "#F-5001", car: "01 A 774 BB", driver: "Алишер Каримов", violation: "Превышение скорости (+20 км/ч) - Радар ГУБДД", cost: "340 000 сум", status: "sent" },
  { id: "#F-5002", car: "01 B 220 AA", driver: "Дильноза Юсупова", violation: "Проезд на красный свет - Камера ГУБДД", cost: "680 000 сум", status: "paid" },
]

function isElectricCar(model: string) {
  const m = model.toLowerCase();
  return m.includes("byd") || m.includes("tesla") || /\bev\b/i.test(model);
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [depositBalance, setDepositBalance] = useState<number>(45200000)

  // Lists state
  const [fleetList, setFleetList] = useState(initialFleet)
  const [employeesList, setEmployeesList] = useState(initialEmployees)
  const [incidentsList, setIncidentsList] = useState(initialIncidents)
  const [bookingsList, setBookingsList] = useState(initialBookings)

  // Notification center state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Новый штраф от ГУБДД для авто 01 A 774 BB на сумму 340 000 сум", date: "Сегодня, 10:15", read: false },
    { id: 2, text: "Сотрудник Саида Мирзаева начала поездку на Chevrolet Spark (01 H 552 MN)", date: "Сегодня, 08:30", read: false },
    { id: 3, text: "Баланс депозита пополнен на 10 000 000 сум через Click Business", date: "Вчера, 16:45", read: true },
  ])
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Modals state
  const [isAddCarOpen, setIsAddCarOpen] = useState(false)
  const [isInviteEmployeeOpen, setIsInviteEmployeeOpen] = useState(false)
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedCarTelemetry, setSelectedCarTelemetry] = useState<typeof initialFleet[0] | null>(null)

  // 2FA Security State
  const [is2faEnabled, setIs2faEnabled] = useState(false)
  const [is2faVerifying, setIs2faVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationTarget, setVerificationTarget] = useState<"setup" | "action">("setup")
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // Support Chat State
  const [activeChatId, setActiveChatId] = useState<number>(1)
  const [typedMessage, setTypedMessage] = useState<string>("")
  const [supportChats, setSupportChats] = useState([
    {
      id: 1,
      driverName: "Алишер Каримов",
      driverPlate: "01 A 777 QA",
      unread: true,
      messages: [
        { sender: "driver", text: "Здравствуйте! Не могу открыть двери у Cobalt.", time: "10:30" },
        { sender: "operator", text: "Приветствуем! Попробуйте сдвинуть шторку или нажмите кнопку открытия в приложении.", time: "10:32" },
        { sender: "driver", text: "В приложении пишет 'Двери заблокированы', кнопка не срабатывает. Помогите открыть.", time: "10:35" },
      ]
    },
    {
      id: 2,
      driverName: "Бобур Турсунов",
      driverPlate: "30 A 019 BT",
      unread: false,
      messages: [
        { sender: "driver", text: "Где находится ключ от лок-бокса?", time: "Вчера, 15:20" },
        { sender: "operator", text: "Ключ находится в бардачке. Пароль от кейса 5582.", time: "Вчера, 15:22" },
        { sender: "driver", text: "Понял, спасибо за помощь!", time: "Вчера, 15:25" },
      ]
    }
  ])

  // Profile data
  const [profile, setProfile] = useState({
    name: "Фарход Махмудов",
    email: "f.mahmudov@uzum.uz",
    phone: "+998 90 123-45-67",
    role: "Главный Администратор",
    company: "ООО «Uzum Market»"
  })

  // Forms state
  const [newCar, setNewCar] = useState({ plate: "", model: "", charge: "100%", mileage: "0 км" })
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", limit: "1 500 000 сум" })
  const [topUpAmount, setTopUpAmount] = useState("")
  const [topUpMethod, setTopUpMethod] = useState("click")

  // Transactions state
  const [transactions, setTransactions] = useState([
    { id: "#TX-9003", description: "Пополнение баланса (Click Бизнес)", amount: "+10 000 000 сум", date: "Вчера, 16:45", type: "in" },
    { id: "#TX-9002", description: "Списание за поездки сотрудников", amount: "-186 400 сум", date: "Вчера, 23:59", type: "out" },
    { id: "#TX-9001", description: "Пополнение баланса (Банковский перевод)", amount: "+35 200 000 сум", date: "01 Июл, 12:00", type: "in" },
  ])

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Simulated Push Notification Timer for Limit Exhaustion
  useEffect(() => {
    const timer = setTimeout(() => {
      const warningText = "Внимание: Лимит расходов отдела 'Разработка' исчерпан на 95% (использовано 950 000 из 1 000 000 сум)"
      setNotifications(prev => [
        { id: Date.now(), text: warningText, date: "Только что", read: false },
        ...prev
      ])
      showToast("Внимание! Лимит расходов отдела 'Разработка' близок к лимиту!", "info")
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Action: Support Chat Message Sending
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return
    const activeChat = supportChats.find(c => c.id === activeChatId)
    if (!activeChat) return

    const timeString = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    const userMsg = { sender: "operator", text: typedMessage, time: timeString }

    setSupportChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, userMsg]
        }
      }
      return c
    }))

    const tempMessage = typedMessage
    setTypedMessage("")

    // Simulate driver response after delay
    setTimeout(() => {
      let replyText = "Проверяю, секунду."
      if (activeChatId === 1) {
        if (tempMessage.toLowerCase().includes("шторк") || tempMessage.toLowerCase().includes("кнопк")) {
          replyText = "Да, нажал кнопку открытия в приложении повторно и замки сработали! Огромное спасибо за помощь, поехал."
        } else {
          replyText = "Хорошо, я попробовал открыть, всё заработало! Спасибо."
        }
      } else {
        replyText = "Действительно всё получилось, спасибо большое за поддержку!"
      }

      const replyMsg = { 
        sender: "driver", 
        text: replyText, 
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) 
      }
      
      setSupportChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: [...c.messages, replyMsg]
          }
        }
        return c
      }))
      showToast(`Новое сообщение от водителя ${activeChat.driverName}`, "info")
    }, 1500)
  }

  // Action: Export July Report
  const handleExportReport = () => {
    const header = "ID Транзакции,Описание,Дата,Сумма\n"
    const rows = transactions.map(t => `${t.id},${t.description},${t.date},${t.amount.replace(/\s/g, "")}`).join("\n")
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(header + rows)
    const link = document.createElement("a")
    link.setAttribute("href", csvContent)
    link.setAttribute("download", `B2B_Report_${profile.company.replace(/[\s«»"']/g, "_")}_July2026.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Отчет об использовании лимитов экспортирован в CSV!", "success")
  }

  // Action: Add Car
  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCar.plate || !newCar.model) {
      showToast("Заполните гос.номер и модель автомобиля!", "success")
      return
    }
    const carToAdd = {
      plate: newCar.plate.toUpperCase(),
      model: newCar.model,
      status: "free" as const,
      charge: newCar.charge,
      mileage: newCar.mileage || "0 км",
      lat: 41.311081 + (Math.random() - 0.5) * 0.05,
      lng: 69.240562 + (Math.random() - 0.5) * 0.05,
      speed: "0 км/ч",
      temp: "25 °C",
      pressure: "2.2 bar"
    }
    setFleetList(prev => [...prev, carToAdd])
    setIsAddCarOpen(false)
    setNewCar({ plate: "", model: "", charge: "100%", mileage: "0 км" })
    showToast(`Автомобиль ${carToAdd.model} добавлен в парк!`, "success")

    // Add notification
    setNotifications(prev => [
      { id: Date.now(), text: `Новый автомобиль ${carToAdd.model} (${carToAdd.plate}) добавлен в автопарк`, date: "Только что", read: false },
      ...prev
    ])
  }

  // Action: Invite Employee
  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployee.name || !newEmployee.role) {
      showToast("Заполните ФИО и должность сотрудника!", "success")
      return
    }
    const empToAdd = {
      name: newEmployee.name,
      role: newEmployee.role,
      used: "0 сум",
      limit: newEmployee.limit,
      mileage: "0 км",
      status: "active" as const
    }
    setEmployeesList(prev => [...prev, empToAdd])
    setIsInviteEmployeeOpen(false)
    setNewEmployee({ name: "", role: "", limit: "1 500 000 сум" })
    showToast(`Сотрудник ${empToAdd.name} успешно добавлен!`, "success")

    // Add notification
    setNotifications(prev => [
      { id: Date.now(), text: `Сотрудник ${empToAdd.name} присоединён к лимитам компании`, date: "Только что", read: false },
      ...prev
    ])
  }

  // Action: Top Up Billing Balance (Interceded by 2FA if enabled)
  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault()
    const amountVal = parseFloat(topUpAmount.replace(/[^0-9]/g, ""))
    if (isNaN(amountVal) || amountVal <= 0) {
      showToast("Введите корректную сумму пополнения!", "success")
      return
    }

    const performTopUp = () => {
      setDepositBalance(prev => prev + amountVal)
      const formattedAmount = new Intl.NumberFormat("ru-RU").format(amountVal) + " сум"

      // Add transaction
      const methodLabel = topUpMethod === "click" ? "Click Бизнес" : topUpMethod === "payme" ? "Payme Бизнес" : "Банковский перевод"
      const newTx = {
        id: `#TX-${Math.floor(1000 + Math.random() * 9000)}`,
        description: `Пополнение баланса (${methodLabel})`,
        amount: `+${formattedAmount}`,
        date: "Сегодня, " + new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        type: "in"
      }
      setTransactions(prev => [newTx, ...prev])

      // Add notification
      setNotifications(prev => [
        { id: Date.now(), text: `Баланс депозита пополнен на ${formattedAmount} через ${methodLabel}`, date: "Только что", read: false },
        ...prev
      ])

      setIsTopUpOpen(false)
      setTopUpAmount("")
      showToast(`Баланс успешно пополнен на ${formattedAmount}!`, "success")
    }

    if (is2faEnabled) {
      setVerificationTarget("action")
      setPendingAction(() => performTopUp)
      setIs2faVerifying(true)
    } else {
      performTopUp()
    }
  }

  // Action: Pay Fine (Interceded by 2FA if enabled)
  const handlePayFine = (fineId: string, fineCost: string) => {
    const costVal = parseFloat(fineCost.replace(/[^0-9]/g, ""))
    if (isNaN(costVal)) return

    if (depositBalance < costVal) {
      showToast("Недостаточно средств на корпоративном счёте!", "success")
      return
    }

    const performPayFine = () => {
      setDepositBalance(prev => prev - costVal)
      setIncidentsList(prev => prev.map(inc => inc.id === fineId ? { ...inc, status: "paid" as const } : inc))

      const formattedCost = new Intl.NumberFormat("ru-RU").format(costVal) + " сум"

      // Add transaction
      const newTx = {
        id: `#TX-${Math.floor(1000 + Math.random() * 9000)}`,
        description: `Оплата штрафа ${fineId}`,
        amount: `-${formattedCost}`,
        date: "Сегодня, " + new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        type: "out"
      }
      setTransactions(prev => [newTx, ...prev])

      // Add notification
      setNotifications(prev => [
        { id: Date.now(), text: `Оплачен штраф ГУБДД ${fineId} на сумму ${formattedCost}`, date: "Только что", read: false },
        ...prev
      ])

      showToast(`Штраф ${fineId} успешно оплачен с депозита компании!`, "success")
    }

    if (is2faEnabled) {
      setVerificationTarget("action")
      setPendingAction(() => performPayFine)
      setIs2faVerifying(true)
    } else {
      performPayFine()
    }
  }

  // Filtering helper
  const filterList = <T extends Record<string, any>>(list: T[], searchFields: (keyof T)[]) => {
    if (!searchQuery) return list
    const q = searchQuery.toLowerCase()
    return list.filter(item => 
      searchFields.some(field => String(item[field]).toLowerCase().includes(q))
    )
  }

  const filteredTrips = filterList(initialTrips, ["driver", "car", "plate"])
  const filteredFleet = filterList(fleetList, ["plate", "model"])
  const filteredCompanies = filterList(initialCompanies, ["name", "inn"])
  const filteredEmployees = filterList(employeesList, ["name", "role"])
  const filteredBookings = filterList(bookingsList, ["driver", "car", "id"])
  const filteredIncidents = filterList(incidentsList, ["id", "car", "driver", "violation"])

  const unreadNotificationsCount = notifications.filter(n => !n.read).length

  // Danger warning if balance gets low
  const isBalanceLow = depositBalance < 15000000

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative select-none">
      <DashboardSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-4 z-20 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-turquoise" />
            <div>
              <h1 className="text-base font-extrabold leading-tight text-foreground">{profile.company}</h1>
              <p className="text-xs text-muted-foreground">тариф «Корпорация»</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 lg:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск поездок, сотрудников…"
                className="w-48 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className={`hidden rounded-xl px-3 py-2 text-right sm:block border transition-colors ${isBalanceLow ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-accent border-transparent text-accent-foreground"}`}>
              <p className="text-[11px] font-medium opacity-80">Баланс депозита</p>
              <p className="text-sm font-bold">
                {new Intl.NumberFormat("ru-RU").format(depositBalance)} сум
              </p>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-colors hover:bg-muted ${isNotificationsOpen ? "bg-muted" : ""}`} 
                aria-label="Уведомления"
              >
                <Bell className="h-4.5 w-4.5 text-foreground" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2.5">
                      <span className="font-bold text-xs text-foreground">Уведомления</span>
                      {unreadNotificationsCount > 0 && (
                        <button 
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                            showToast("Все уведомления прочитаны")
                          }} 
                          className="text-[10px] font-semibold text-turquoise hover:underline"
                        >
                          Прочитать все
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">Нет уведомлений</p>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
                            }}
                            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer select-none ${n.read ? "hover:bg-muted/30" : "bg-turquoise-light/35 border-l-2 border-l-turquoise"}`}
                          >
                            <p className="text-foreground leading-normal">{n.text}</p>
                            <span className="text-[9px] text-muted-foreground block mt-1">{n.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground font-mono transition-transform hover:scale-105"
            >
              {profile.name.split(" ").map(n => n[0]).join("")}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 z-10">
          {/* Limit Exhaustion Caution Banner */}
          {isBalanceLow && (
            <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                <div className="text-left">
                  <p className="text-xs font-bold">Низкий баланс корпоративного депозита</p>
                  <p className="text-[11px] opacity-90 mt-0.5">Баланс депозита меньше 15 000 000 сум. Рекомендуется пополнить счет для непрерывности поездок сотрудников.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveTab("billing")
                  setIsTopUpOpen(true)
                }}
                className="bg-destructive text-white font-bold text-xs px-3.5 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Пополнить
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Дашборд</h2>
                  <p className="text-sm text-muted-foreground">Обзор автопарка за июль 2026</p>
                </div>
              </div>

              {/* KPI grid */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Авто в парке", value: fleetList.length, delta: `+${fleetList.length - 4} за месяц`, up: true, icon: CarFront },
                  { label: "В поездке сейчас", value: "54", delta: "42% парка", up: true, icon: Wallet },
                  { label: "На ТО / в ремонте", value: fleetList.filter(f => f.status === "service").length, delta: "2 просрочены", up: false, icon: TriangleAlert },
                  { label: "Доходность за месяц", value: "186.4М сум", delta: "+11%", up: true, icon: Gauge },
                ].map((kpi) => {
                  const Icon = kpi.icon
                  return (
                    <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span
                          className={`flex items-center gap-0.5 text-xs font-semibold ${
                            kpi.up ? "text-success" : "text-destructive"
                          }`}
                        >
                          {kpi.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {kpi.delta}
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{kpi.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Map panel */}
              <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <h3 className="font-semibold text-foreground">Автопарк на карте · Ташкент</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-turquoise" />свободен</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cobalt" />в поездке</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" />на ТО</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-soft" />офлайн</span>
                  </div>
                </div>
                <div className="h-[350px] w-full rounded-xl bg-secondary overflow-hidden relative border border-border">
                  <iframe
                    title="Карта Ташкента"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="opacity-90 filter contrast-[95%]"
                    srcDoc="<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
  <script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #fafafa; }
    .leaflet-popup-content-wrapper {
      background: #ffffff;
      color: #111827;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      font-family: sans-serif;
    }
    .leaflet-popup-tip {
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div id='map'></div>
  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([41.311081, 69.240562], 12.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var cars = [
      { coords: [41.328, 69.278], name: 'Cobalt LT', status: 'Свободен', color: '#1C8F86' },
      { coords: [41.302, 69.232], name: 'Nexia 3', status: 'В поездке', color: '#2454A8' },
      { coords: [41.288, 69.202], name: 'Spark', status: 'В поездке', color: '#2454A8' },
      { coords: [41.342, 69.215], name: 'Malibu 2', status: 'На ТО', color: '#B9832B' },
      { coords: [41.318, 69.262], name: 'Lacetti', status: 'Офлайн', color: '#585B62' }
    ];

    cars.forEach(function(car) {
      var marker = L.circleMarker(car.coords, {
        radius: 7,
        fillColor: car.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);

      marker.bindPopup('<div style=\'font-size:12px; font-family:sans-serif;\'><strong>' + car.name + '</strong><br/><span style=\'color:\' + car.color + \'; font-weight:bold;\'>' + car.status + '</span></div>');
    });
  </script>
</body>
</html>"
                  />
                </div>
              </div>

              {/* Chart & Companies Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Биллинг по месяцам, млн сум</h3>
                      <p className="text-xs text-muted-foreground">Корпоративные расходы на каршеринг</p>
                    </div>
                    <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">Июль 2026</span>
                  </div>
                  <div className="flex justify-between items-end gap-2 h-44 pt-4 px-2 font-mono text-xs select-none">
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-secondary rounded-t-md" style={{ height: "46px" }}></div>
                      <span className="text-[10px] text-muted-foreground">фев</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-secondary rounded-t-md" style={{ height: "66px" }}></div>
                      <span className="text-[10px] text-muted-foreground">мар</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-secondary rounded-t-md" style={{ height: "81px" }}></div>
                      <span className="text-[10px] text-muted-foreground">апр</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-[#DCEEEA] rounded-t-md" style={{ height: "96px" }}></div>
                      <span className="text-[10px] text-muted-foreground">май</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-[#DCEEEA] rounded-t-md" style={{ height: "106px" }}></div>
                      <span className="text-[10px] text-muted-foreground">июн</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="w-8 bg-turquoise rounded-t-md flex flex-col justify-end items-center" style={{ height: "121px" }}>
                        <span className="text-[9px] font-bold text-white mb-1">186.4</span>
                      </div>
                      <span className="text-[10px] font-bold text-turquoise">июл</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-4">Компании и использование лимитов</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>ООО «Uzum Market» <span className="text-muted-foreground font-normal">· {employeesList.length} сотрудников</span></span>
                        <span>78%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-cobalt rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Artel Electronics JV <span className="text-muted-foreground font-normal">· 31 сотрудник</span></span>
                        <span>45%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-turquoise rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Ipak Yo'li Bank <span className="text-muted-foreground font-normal">· 12 сотрудников</span></span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: "92%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Beeline Uzbekistan <span className="text-muted-foreground font-normal">· 27 сотрудников</span></span>
                        <span>34%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-cobalt rounded-full" style={{ width: "34%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trips table */}
              <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between px-5 py-4">
                  <h3 className="font-semibold text-foreground">Текущие поездки</h3>
                  <button onClick={() => setActiveTab("bookings")} className="text-sm font-semibold text-turquoise hover:underline">
                    Все поездки
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="border-y border-border text-xs uppercase tracking-wide text-muted-foreground bg-secondary/50">
                        <th className="px-5 py-2.5 font-medium">Водитель</th>
                        <th className="px-5 py-2.5 font-medium">Автомобиль</th>
                        <th className="px-5 py-2.5 font-medium">Статус</th>
                        <th className="px-5 py-2.5 font-medium">Старт</th>
                        <th className="px-5 py-2.5 text-right font-medium">Стоимость</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-xs">
                            Поездки не найдены
                          </td>
                        </tr>
                      ) : (
                        filteredTrips.map((t, i) => (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                                  {t.initials}
                                </span>
                                <span className="font-medium text-foreground">{t.driver}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <div className="text-foreground font-semibold">{t.car}</div>
                              <div className="font-mono text-xs text-muted-foreground">{t.plate}</div>
                            </td>
                            <td className="px-5 py-3">
                              {t.status === "moving" ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                  В пути
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                  Завершено
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground font-medium">{t.start}</td>
                            <td className="px-5 py-3 text-right font-bold text-foreground">{t.cost}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: FLEET */}
          {activeTab === "fleet" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Управление автопарком</h2>
                  <p className="text-sm text-muted-foreground">Мониторинг параметров телеметрии. Кликните на строку авто для просмотра детальной карты и приборов.</p>
                </div>
                <button 
                  onClick={() => setIsAddCarOpen(true)}
                  className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Добавить авто
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">Гос.номер</th>
                      <th className="px-5 py-3 font-medium">Модель</th>
                      <th className="px-5 py-3 font-medium">Статус</th>
                      <th className="px-5 py-3 font-medium">Заряд / Топливо</th>
                      <th className="px-5 py-3 font-medium">Пробег</th>
                      <th className="px-5 py-3 text-right font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFleet.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-xs">
                          Автомобили не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredFleet.map((f, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10 cursor-pointer">
                          <td onClick={() => setSelectedCarTelemetry(f)} className="px-5 py-4">
                            <span className="font-mono bg-secondary px-2.5 py-1 rounded-lg border border-border text-xs font-bold text-foreground">
                              {f.plate}
                            </span>
                          </td>
                          <td onClick={() => setSelectedCarTelemetry(f)} className="px-5 py-4 font-bold text-foreground">{f.model}</td>
                          <td onClick={() => setSelectedCarTelemetry(f)} className="px-5 py-4">
                            {f.status === "moving" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">в поездке</span>}
                            {f.status === "free" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">свободен</span>}
                            {f.status === "service" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">на ТО</span>}
                          </td>
                          <td onClick={() => setSelectedCarTelemetry(f)} className="px-5 py-4 font-semibold text-foreground">
                            <div className="flex items-center gap-1.5">
                              {isElectricCar(f.model) ? (
                                <Zap className="h-4 w-4 text-success shrink-0" />
                              ) : (
                                <Fuel className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span>{f.charge}</span>
                            </div>
                          </td>
                          <td onClick={() => setSelectedCarTelemetry(f)} className="px-5 py-4 text-muted-foreground font-mono text-xs font-medium">{f.mileage}</td>
                          <td className="px-5 py-4 text-right">
                            {f.status === "service" ? (
                              <button 
                                onClick={() => {
                                  setFleetList(prev => prev.map(item => item.plate === f.plate ? { ...item, status: "free" as const, charge: "92%" } : item))
                                  showToast(`Автомобиль ${f.model} возвращён из ТО!`, "success")
                                }}
                                className="bg-turquoise text-white text-xs px-2.5 py-1 rounded-lg font-semibold shadow-sm hover:opacity-90"
                              >
                                Вернуть
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setFleetList(prev => prev.map(item => item.plate === f.plate ? { ...item, status: "service" as const } : item))
                                  showToast(`Автомобиль ${f.model} отправлен на сервисное обслуживание`, "info")
                                }}
                                className="bg-secondary text-foreground text-xs px-2.5 py-1 rounded-lg font-medium hover:bg-muted"
                              >
                                ТО
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMPANIES */}
          {activeTab === "companies" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Зарегистрированные компании</h2>
                <p className="text-sm text-muted-foreground">База B2B клиентов платформы</p>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">Компания</th>
                      <th className="px-5 py-3 font-medium">ИНН</th>
                      <th className="px-5 py-3 font-medium">Тариф</th>
                      <th className="px-5 py-3 font-medium">Лимит (сум)</th>
                      <th className="px-5 py-3 text-right font-medium">KYB статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs">
                          Компании не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((c, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="px-5 py-4 font-bold text-foreground">{c.name}</td>
                          <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{c.inn}</td>
                          <td className="px-5 py-4 font-semibold">{c.tariff}</td>
                          <td className="px-5 py-4 text-foreground font-semibold">{c.limit}</td>
                          <td className="px-5 py-4 text-right">
                            {c.status === "approved" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Одобрено</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Проверка</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EMPLOYEES */}
          {activeTab === "employees" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Сотрудники и лимиты</h2>
                  <p className="text-sm text-muted-foreground">Управление бюджетами сотрудников</p>
                </div>
                <button 
                  onClick={() => setIsInviteEmployeeOpen(true)}
                  className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Пригласить сотрудника
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">Имя сотрудника</th>
                      <th className="px-5 py-3 font-medium">Роль</th>
                      <th className="px-5 py-3 font-medium">Использовано лимита</th>
                      <th className="px-5 py-3 font-medium">Пробег</th>
                      <th className="px-5 py-3 text-right font-medium">Статус прав</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs">
                          Сотрудники не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((e, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="px-5 py-3 font-bold text-foreground">{e.name}</td>
                          <td className="px-5 py-3 text-muted-foreground font-medium">{e.role}</td>
                          <td className="px-5 py-3 font-semibold">
                            <span className="text-foreground">{e.used}</span>
                            <span className="text-xs text-muted-foreground font-normal"> / {e.limit}</span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground font-mono text-xs font-semibold">{e.mileage}</td>
                          <td className="px-5 py-3 text-right">
                            {e.status === "active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Активен</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Проверка прав</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BOOKINGS */}
          {activeTab === "bookings" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Последние бронирования</h2>
                <p className="text-sm text-muted-foreground">История аренды автомобилей</p>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-5 py-3 font-medium">Водитель</th>
                      <th className="px-5 py-3 font-medium">Машина</th>
                      <th className="px-5 py-3 font-medium">Старт аренды</th>
                      <th className="px-5 py-3 font-medium">Дистанция</th>
                      <th className="px-5 py-3 text-right font-medium">Стоимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-xs">
                          Бронирования не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="px-5 py-3 font-bold text-foreground">{b.id}</td>
                          <td className="px-5 py-3 font-semibold text-foreground">{b.driver}</td>
                          <td className="px-5 py-3 text-muted-foreground font-semibold">{b.car}</td>
                          <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{b.start}</td>
                          <td className="px-5 py-3 text-muted-foreground font-semibold">{b.distance}</td>
                          <td className="px-5 py-3 text-right font-bold text-foreground">{b.cost}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: BILLING */}
          {activeTab === "billing" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Биллинг и Интеграции</h2>
                  <p className="text-sm text-muted-foreground">Управление балансом и платежными шлюзами</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportReport}
                    className="bg-secondary text-foreground border border-border font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:bg-muted cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Экспорт отчета (.CSV)
                  </button>
                  <button 
                    onClick={() => setIsTopUpOpen(true)}
                    className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" /> Пополнить баланс
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm border-l-4 border-l-turquoise">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Баланс депозита</p>
                  <p className="text-2xl font-extrabold text-foreground">
                    {new Intl.NumberFormat("ru-RU").format(depositBalance)} сум
                  </p>
                  <p className="text-[10px] text-success font-medium mt-2">Click/Payme Бизнес-аккаунты активны</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Потрачено в этом месяце</p>
                  <p className="text-2xl font-extrabold text-foreground">3 290 000 сум</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-2">-3% от лимита прошлого месяца</p>
                </div>
              </div>

              <h4 className="font-bold text-foreground text-sm mb-3">История транзакций</h4>
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-secondary text-xxs sm:text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-2.5 font-medium">ID Транзакции</th>
                      <th className="px-5 py-2.5 font-medium">Описание</th>
                      <th className="px-5 py-2.5 font-medium">Дата</th>
                      <th className="px-5 py-2.5 text-right font-medium">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-5 py-3 font-mono font-bold text-foreground">{tx.id}</td>
                        <td className="px-5 py-3 font-semibold text-foreground">{tx.description}</td>
                        <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{tx.date}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 font-bold ${tx.type === "in" ? "text-success" : "text-destructive"}`}>
                            {tx.type === "in" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                            {tx.amount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold text-foreground text-sm mb-3">Платежные шлюзы</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-foreground">Payme Business API</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">SHA-256 endpoint verified</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Подключено</span>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-foreground">Click Business API</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Webhook status: Active</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Подключено</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INCIDENTS */}
          {activeTab === "incidents" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Штрафы ГУБДД и Инциденты</h2>
                <p className="text-sm text-muted-foreground">Фиксация дорожных нарушений и оплата штрафов</p>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">ID Штрафа</th>
                      <th className="px-5 py-3 font-medium">Машина</th>
                      <th className="px-5 py-3 font-medium">Водитель</th>
                      <th className="px-5 py-3 font-medium">Нарушение</th>
                      <th className="px-5 py-3 font-medium">Сумма</th>
                      <th className="px-5 py-3 text-right font-medium">Статус / Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-xs">
                          Нарушения не найдены
                        </td>
                      </tr>
                    ) : (
                      filteredIncidents.map((inc, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="px-5 py-4 font-bold text-foreground">{inc.id}</td>
                          <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{inc.car}</td>
                          <td className="px-5 py-4 font-semibold">{inc.driver}</td>
                          <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs leading-normal">{inc.violation}</td>
                          <td className="px-5 py-4 font-bold text-destructive">{inc.cost}</td>
                          <td className="px-5 py-4 text-right">
                            {inc.status === "paid" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Оплачен</span>
                            ) : (
                              <button 
                                onClick={() => handlePayFine(inc.id, inc.cost)}
                                className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm hover:opacity-90 cursor-pointer"
                              >
                                Оплатить с депозита
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: SUPPORT CHAT */}
          {activeTab === "support" && (
            <div className="flex h-[calc(100vh-120px)] border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
              {/* Chats List (Left Pane) */}
              <div className="w-1/3 border-r border-border flex flex-col bg-secondary/10">
                <div className="p-4 border-b border-border bg-card">
                  <h3 className="font-bold text-foreground text-sm">Чаты с водителями</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Обращения в службу поддержки</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
                  {supportChats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setActiveChatId(chat.id)
                        setSupportChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c))
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all select-none text-left ${activeChatId === chat.id ? "bg-primary text-primary-foreground" : "hover:bg-muted bg-card border border-border"}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs truncate max-w-[130px]">{chat.driverName}</span>
                        {chat.unread && (
                          <span className="h-2 w-2 rounded-full bg-turquoise shrink-0 animate-pulse" />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] opacity-70 font-mono">{chat.driverPlate}</span>
                        <span className="text-[9px] opacity-60">{chat.messages[chat.messages.length - 1].time}</span>
                      </div>
                      <p className="text-[10px] opacity-80 truncate mt-1.5 text-left">{chat.messages[chat.messages.length - 1].text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Message Box (Right Pane) */}
              <div className="flex-1 flex flex-col bg-card">
                {(() => {
                  const activeChat = supportChats.find(c => c.id === activeChatId)
                  if (!activeChat) return <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">Выберите чат для общения</div>
                  return (
                    <>
                      <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-foreground">{activeChat.driverName}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Автомобиль: {activeChat.driverPlate}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-semibold bg-emerald-100 text-emerald-800">в сети</span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {activeChat.messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex flex-col max-w-[75%] ${msg.sender === "operator" ? "self-end items-end" : "self-start items-start"}`}
                          >
                            <div
                              className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${msg.sender === "operator" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-secondary text-foreground rounded-tl-none"}`}
                            >
                              <p>{msg.text}</p>
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-1 font-mono">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-border bg-card shrink-0 flex gap-2">
                        <input
                          type="text"
                          value={typedMessage}
                          onChange={e => setTypedMessage(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") handleSendMessage()
                          }}
                          placeholder="Напишите ответ водителю…"
                          className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-foreground"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs hover:opacity-90 cursor-pointer"
                        >
                          Отправить
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: ADD CAR */}
      {isAddCarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsAddCarOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-bold text-foreground mb-4">Добавить автомобиль в автопарк</h3>
            <form onSubmit={handleAddCar} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Государственный номер автомобиля</label>
                <input 
                  type="text" 
                  required
                  value={newCar.plate}
                  onChange={e => setNewCar(prev => ({ ...prev, plate: e.target.value }))}
                  placeholder="01 A 777 QA"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Марка и модель автомобиля</label>
                <input 
                  type="text" 
                  required
                  value={newCar.model}
                  onChange={e => setNewCar(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="BYD Song Plus EV"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Заряд / Топливо</label>
                  <input 
                    type="text" 
                    value={newCar.charge}
                    onChange={e => setNewCar(prev => ({ ...prev, charge: e.target.value }))}
                    placeholder="95%"
                    className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground">Текущий пробег</label>
                  <input 
                    type="text" 
                    value={newCar.mileage}
                    onChange={e => setNewCar(prev => ({ ...prev, mileage: e.target.value }))}
                    placeholder="5 200 км"
                    className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
              >
                Сохранить в базу
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE EMPLOYEE */}
      {isInviteEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsInviteEmployeeOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-bold text-foreground mb-4">Выписать лимит на сотрудника</h3>
            <form onSubmit={handleInviteEmployee} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">ФИО сотрудника</label>
                <input 
                  type="text" 
                  required
                  value={newEmployee.name}
                  onChange={e => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Константин Константинопольский"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Должность / Отдел</label>
                <input 
                  type="text" 
                  required
                  value={newEmployee.role}
                  onChange={e => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Менеджер по маркетингу"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Месячный лимит расходов (сум)</label>
                <select
                  value={newEmployee.limit}
                  onChange={e => setNewEmployee(prev => ({ ...prev, limit: e.target.value }))}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                >
                  <option value="500 000 сум">500 000 сум / мес</option>
                  <option value="1 000 000 сум">1 000 000 сум / мес</option>
                  <option value="1 500 000 сум">1 500 000 сум / мес</option>
                  <option value="3 000 000 сум">3 000 000 сум / мес</option>
                  <option value="5 000 000 сум">5 000 000 сум / мес</option>
                </select>
              </div>
              <button 
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
              >
                Отправить приглашение
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TOP UP */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsTopUpOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-bold text-foreground mb-4">Пополнение корпоративного депозита</h3>
            <form onSubmit={handleTopUp} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Сумма пополнения (сум)</label>
                <input 
                  type="text" 
                  required
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="5 000 000"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground font-mono font-bold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground">Платежная система</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "click", name: "Click Бизнес" },
                    { id: "payme", name: "Payme Бизнес" },
                    { id: "invoice", name: "Счет-фактура" }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTopUpMethod(m.id)}
                      className={`px-2 py-3.5 text-center rounded-xl border text-xs font-bold transition-all ${topUpMethod === m.id ? "bg-turquoise-light border-turquoise text-accent-foreground animate-pulse" : "border-border hover:bg-muted bg-background text-foreground"}`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
              >
                Пополнить баланс
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PROFILE & SECURITY (2FA Toggle) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-bold text-foreground mb-4">Профиль администратора</h3>
            
            <div className="flex flex-col items-center gap-2 mb-6 border-b border-border pb-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-foreground">
                {profile.name.split(" ").map(n => n[0]).join("")}
              </span>
              <div className="text-center mt-1">
                <div className="font-bold text-sm text-foreground">{profile.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{profile.role} · {profile.company}</div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              setIsProfileOpen(false)
              showToast("Профиль успешно обновлен!")
            }} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1"><User className="h-3.5 w-3.5" /> ФИО</label>
                <input 
                  type="text" 
                  required
                  value={profile.name}
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</label>
                <input 
                  type="email" 
                  required
                  value={profile.email}
                  onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Телефон</label>
                <input 
                  type="text" 
                  required
                  value={profile.phone}
                  onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                />
              </div>

              {/* 2FA Toggle Switch in Profile */}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <div className="text-left">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1">
                    {is2faEnabled ? <ShieldCheck className="h-4 w-4 text-success" /> : <ShieldAlert className="h-4 w-4 text-turquoise" />}
                    Двухфакторная защита (2FA)
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Требовать проверочный код при крупных операциях</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (is2faEnabled) {
                      setIs2faEnabled(false)
                      showToast("Двухфакторная аутентификация отключена!", "info")
                    } else {
                      setVerificationTarget("setup")
                      setIs2faVerifying(true)
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${is2faEnabled ? "bg-turquoise" : "bg-secondary"}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${is2faEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <button 
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
              >
                Сохранить настройки
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CAR TELEMETRY DETAILS */}
      {selectedCarTelemetry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedCarTelemetry(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer z-10"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h3 className="text-base font-bold text-foreground mb-1">Детализация телеметрии автомобиля</h3>
            <p className="text-xs text-muted-foreground mb-4">Мониторинг приборов в реальном времени · {selectedCarTelemetry.model} ({selectedCarTelemetry.plate})</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Live indicators & Remote commands */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/40 border border-border rounded-xl p-3 text-left">
                    <span className="text-[10px] text-muted-foreground block font-bold flex items-center gap-1"><Activity className="h-3 w-3" /> Скорость</span>
                    <span className="text-base font-bold text-foreground font-mono mt-1 block">
                      {selectedCarTelemetry.speed}
                    </span>
                  </div>
                  <div className="bg-secondary/40 border border-border rounded-xl p-3 text-left">
                    <span className="text-[10px] text-muted-foreground block font-bold flex items-center gap-1">
                      {isElectricCar(selectedCarTelemetry.model) ? (
                        <Zap className="h-3 w-3 text-success" />
                      ) : (
                        <Fuel className="h-3 w-3 text-muted-foreground" />
                      )} 
                      {isElectricCar(selectedCarTelemetry.model) ? "Заряд батареи" : "Уровень топлива"}
                    </span>
                    <span className="text-base font-bold text-foreground font-mono mt-1 block">{selectedCarTelemetry.charge}</span>
                  </div>
                  <div className="bg-secondary/40 border border-border rounded-xl p-3 text-left">
                    <span className="text-[10px] text-muted-foreground block font-bold flex items-center gap-1"><MapPin className="h-3 w-3" /> Давление шин</span>
                    <span className="text-base font-bold text-foreground font-mono mt-1 block">{selectedCarTelemetry.pressure}</span>
                  </div>
                  <div className="bg-secondary/40 border border-border rounded-xl p-3 text-left">
                    <span className="text-[10px] text-muted-foreground block font-bold flex items-center gap-1"><Gauge className="h-3 w-3" /> Темп. двигателя</span>
                    <span className="text-base font-bold text-foreground font-mono mt-1 block">{selectedCarTelemetry.temp}</span>
                  </div>
                </div>

                <div className="bg-secondary/30 border border-border rounded-xl p-4 flex-1 text-left">
                  <span className="text-xs font-bold text-foreground block mb-3">Дистанционное управление</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button 
                      onClick={() => showToast(`Двигатель автомобиля ${selectedCarTelemetry.plate} удаленно заблокирован!`, "info")}
                      className="text-xs font-semibold py-2.5 rounded-xl border border-border hover:bg-muted text-foreground cursor-pointer bg-background flex flex-col items-center justify-center gap-1"
                    >
                      <Lock className="h-4 w-4 text-destructive" />
                      Заблок. дв.
                    </button>
                    <button 
                      onClick={() => showToast(`Центральный замок автомобиля ${selectedCarTelemetry.plate} разблокирован`, "success")}
                      className="text-xs font-semibold py-2.5 rounded-xl border border-border hover:bg-muted text-foreground cursor-pointer bg-background flex flex-col items-center justify-center gap-1"
                    >
                      <Unlock className="h-4 w-4 text-success" />
                      Открыть дв.
                    </button>
                    <button 
                      onClick={() => showToast(`Гудок успешно отправлен на автомобиль ${selectedCarTelemetry.plate}!`, "info")}
                      className="text-xs font-semibold py-2.5 rounded-xl border border-border hover:bg-muted text-foreground cursor-pointer bg-background flex flex-col items-center justify-center gap-1"
                    >
                      <Volume2 className="h-4 w-4 text-turquoise" />
                      Посигналить
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Map */}
              <div className="h-[250px] md:h-auto rounded-xl bg-secondary border border-border overflow-hidden relative">
                <iframe
                  title="Телеметрия геопозиции"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="opacity-90"
                  srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
  <script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id='map'></div>
  <script>
    var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${selectedCarTelemetry.lat}, ${selectedCarTelemetry.lng}], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var marker = L.circleMarker([${selectedCarTelemetry.lat}, ${selectedCarTelemetry.lng}], {
      radius: 8,
      fillColor: '${selectedCarTelemetry.status === "moving" ? "#2454A8" : selectedCarTelemetry.status === "free" ? "#1C8F86" : "#B9832B"}',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map);
    marker.bindPopup('<div style=\'font-size:11px;font-family:sans-serif;\'><strong>${selectedCarTelemetry.model}</strong><br/>${selectedCarTelemetry.plate}</div>').openPopup();
  </script>
</body>
</html>`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: 2FA SECURITY CODE VERIFICATION */}
      {is2faVerifying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            <button 
              onClick={() => {
                setIs2faVerifying(false)
                setVerificationCode("")
                setPendingAction(null)
              }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-turquoise" /> Подтверждение 2FA
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Введите 4-значный проверочный код <b>9982</b>, высланный на ваш номер {profile.phone}.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input 
                  type="text" 
                  required
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="••••"
                  maxLength={4}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-foreground outline-none focus:border-foreground"
                />
              </div>
              <button 
                onClick={() => {
                  if (verificationCode === "9982") {
                    setIs2faVerifying(false)
                    setVerificationCode("")
                    if (verificationTarget === "setup") {
                      setIs2faEnabled(true)
                      showToast("Двухфакторная аутентификация успешно активирована!", "success")
                    } else {
                      showToast("Действие подтверждено через 2FA", "success")
                      if (pendingAction) {
                        pendingAction()
                        setPendingAction(null)
                      }
                    }
                  } else {
                    showToast("Неверный код 2FA! Попробуйте 9982", "error")
                  }
                }}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 cursor-pointer"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 select-none">
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
          {toast.type === "error" && <AlertCircle className="h-5 w-5 text-destructive shrink-0" />}
          {toast.type === "info" && <Bell className="h-5 w-5 text-turquoise shrink-0" />}
          <p className="text-xs font-semibold text-foreground leading-normal">{toast.message}</p>
        </div>
      )}
    </div>
  )
}
