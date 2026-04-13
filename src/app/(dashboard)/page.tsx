import { 
  CalendarDays, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  MessageCircle,
  MapPin,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { getDaysRemaining } from "@/lib/dates"
import { InteractiveCard } from "@/components/ui/interactive-card"
import Link from "next/link"

export default async function DashboardPage() {
  const activites = await db.activite.findMany({
    select: {
      id: true,
      statut: true,
      dateActivite: true,
      type: true,
    },
  })

  const totalActivites = activites.length
  const aVenir = activites.filter((a) => {
    const days = getDaysRemaining(a.dateActivite, a.type)
    return days !== null && days >= 0
  }).length
  const urgentes = activites.filter((a) => {
    const days = getDaysRemaining(a.dateActivite, a.type)
    return days !== null && days >= 0 && days <= 7
  }).length
  const terminees = activites.filter((a) => a.statut === "terminee").length

  const safeTotal = totalActivites > 0 ? totalActivites : 1
  const ringData = [
    { label: "Total Activités", value: totalActivites, color: "#2563eb", badgeClass: "text-blue-700 bg-blue-50" },
    { label: "À venir", value: aVenir, color: "#059669", badgeClass: "text-emerald-700 bg-emerald-50" },
    { label: "Urgentes", value: urgentes, color: "#d97706", badgeClass: "text-amber-700 bg-amber-50" },
    { label: "Terminées", value: terminees, color: "#7c3aed", badgeClass: "text-violet-700 bg-violet-50" },
  ]
  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d&rsquo;ensemble des activités spirituelles de la jeunesse MEMFA.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2 sm:gap-3">
          <Button asChild variant="outline" className="glass hover:bg-white/80 border-white/60 w-full sm:w-auto">
            <Link href="/calendrier">
              <CalendarDays className="mr-2 h-4 w-4" /> Calendrier
            </Link>
          </Button>
          <Button asChild className="btn-primary-glow rounded-xl px-6 w-full sm:w-auto">
            <Link href="/activites/new">+ Nouvelle activité</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <InteractiveCard delay={40} className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Activités</span>
            <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100/50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{totalActivites}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4
            </span>
            <span className="text-xs text-muted-foreground">ce mois-ci</span>
          </div>
        </InteractiveCard>

        {/* Stat 2 */}
        <InteractiveCard delay={90} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">À venir</span>
            <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-100/50">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{aVenir}</div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Prochaine dans </span>
            <span className="text-xs font-semibold text-primary">12 jours</span>
          </div>
        </InteractiveCard>

        {/* Stat 3 */}
        <InteractiveCard delay={140} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-t-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Urgentes</span>
            <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-100/50">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{urgentes}</div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <AlertCircle className="h-3 w-3" /> J-7 Sortie Moyekro
            </span>
          </div>
        </InteractiveCard>

        {/* Stat 4 */}
        <InteractiveCard delay={190} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-t-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Terminées</span>
            <div className="p-2.5 bg-purple-50/80 rounded-xl border border-purple-100/50">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{terminees}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
              <ArrowDownRight className="h-3 w-3 mr-0.5" /> -2
            </span>
            <span className="text-xs text-muted-foreground">vs 2025</span>
          </div>
        </InteractiveCard>
      </div>

      {/* Alert Banner */}
      <InteractiveCard delay={240} className="glass-card p-5 flex flex-col sm:flex-row items-start gap-4 border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50/60 to-transparent">
        <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Rappel automatique requis</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            La sortie à Moyekro approche dans <span className="font-semibold text-amber-600">12 jours</span>. 
            Préparez le message de rappel J-7 pour le groupe WhatsApp.
          </p>
        </div>
        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-500/20 shrink-0 w-full sm:w-auto">
          <MessageCircle className="h-4 w-4 mr-2" /> Préparer le message
        </Button>
      </InteractiveCard>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Left: Upcoming Activities (4/7) */}
        <InteractiveCard delay={280} className="md:col-span-4 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/40 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activités à venir</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Les prochains événements de la jeunesse.</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg">
              Voir tout <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="p-6 space-y-3">
            {[
              { name: "Sortie détente — Lundi de Pâques", date: "06 Avril", days: 12, loc: "Moyekro", type: "Sortie" },
              { name: "Veillées d'intercession", date: "01 Mai", days: 37, loc: "Temple MEMFA", type: "Prière" },
              { name: "Conférence sur le mariage", date: "14 Mai", days: 50, loc: "Temple MEMFA", type: "Conférence" },
              { name: "Sortie Basilique de Yamoussoukro", date: "25 Mai", days: 61, loc: "Yamoussoukro", type: "Sortie" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group flex items-center justify-between p-4 rounded-xl bg-white/40 hover:bg-white/70 border border-white/50 hover:border-primary/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.date.split(' ')[1].substring(0, 3)}</span>
                    <span className="text-lg font-bold text-gray-900">{item.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {item.loc}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> Jeunesse
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`badge-glass ${item.days <= 7 ? 'danger' : item.days <= 14 ? 'warning' : 'success'}`}>
                    <Clock className="h-3 w-3" /> J-{item.days}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </InteractiveCard>

        {/* Right: Quick Actions & Stats (3/7) */}
        <div className="md:col-span-3 space-y-6">
          
          {/* WhatsApp Quick Send */}
          <InteractiveCard delay={320} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-50 rounded-xl border border-green-100/50 shrink-0">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp Rapide</h3>
                <p className="text-xs text-muted-foreground">Envoyer un rappel au groupe</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Sortie Moyekro</span>
                </div>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">J-12</Badge>
              </div>
              <Button className="w-full btn-primary-glow rounded-xl">
                <MessageCircle className="h-4 w-4 mr-2" /> Générer le message
              </Button>
            </div>
          </InteractiveCard>

          {/* Dynamic Statistics Card */}
          <InteractiveCard delay={360} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Statistiques activités</h3>
                <p className="text-xs text-muted-foreground">Synchronisées avec les cards du haut</p>
              </div>
              <Badge variant="outline" className="text-xs bg-white/70">Aujourd&rsquo;hui</Badge>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  {[
                    { r: 50, color: "#e5e7eb", value: 100, width: 6 },
                    { r: 40, color: "#e5e7eb", value: 100, width: 6 },
                    { r: 30, color: "#e5e7eb", value: 100, width: 6 },
                    { r: 20, color: "#e5e7eb", value: 100, width: 6 },
                  ].map((ring, idx) => {
                    const c = 2 * Math.PI * ring.r
                    return (
                      <circle
                        key={`base-${idx}`}
                        cx="60"
                        cy="60"
                        r={ring.r}
                        fill="none"
                        stroke={ring.color}
                        strokeWidth={ring.width}
                        strokeLinecap="round"
                        strokeDasharray={`${c * 0.72} ${c}`}
                        transform="rotate(140 60 60)"
                      />
                    )
                  })}

                  {[
                    { r: 50, color: "#2563eb", value: ringData[0].value / safeTotal, width: 6 },
                    { r: 40, color: "#059669", value: ringData[1].value / safeTotal, width: 6 },
                    { r: 30, color: "#d97706", value: ringData[2].value / safeTotal, width: 6 },
                    { r: 20, color: "#7c3aed", value: ringData[3].value / safeTotal, width: 6 },
                  ].map((ring, idx) => {
                    const c = 2 * Math.PI * ring.r
                    return (
                      <circle
                        key={`val-${idx}`}
                        cx="60"
                        cy="60"
                        r={ring.r}
                        fill="none"
                        stroke={ring.color}
                        strokeWidth={ring.width}
                        strokeLinecap="round"
                        strokeDasharray={`${c * 0.72 * ring.value} ${c}`}
                        transform="rotate(140 60 60)"
                      />
                    )
                  })}
                </svg>
              </div>

              <div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{totalActivites}</p>
                <p className="text-xs text-muted-foreground">Total activités</p>
                <span className="inline-flex mt-2 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  100%
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {ringData.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{item.value}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${item.badgeClass}`}>
                      {Math.round((item.value / safeTotal) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </InteractiveCard>

          {/* Activity Progress */}
          <InteractiveCard delay={400} className="glass-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Progression annuelle</h3>
            <div className="flex items-end gap-2 h-32 mb-4">
              {[30, 45, 60, 40, 75, 85, 65, 50, 70, 90, 55, 40].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary/20 hover:from-primary hover:to-primary/40 transition-all duration-300 relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {h}%
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/40">
              <div>
                <p className="text-2xl font-bold text-gray-900">67%</p>
                <p className="text-xs text-muted-foreground">Objectif annuel</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">16 / 24</p>
                <p className="text-xs text-muted-foreground">activités réalisées</p>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  )
}