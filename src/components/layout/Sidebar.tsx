"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CalendarDays, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import logoMemfa from "../../../assets/logo.png"

const handleLogout = async () => {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  }
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/activites", label: "Activités", icon: CalendarDays, badge: "12" },
  { href: "/rappels", label: "Rappels WhatsApp", icon: Bell, badge: "3" },
  { href: "/calendrier", label: "Calendrier", icon: CalendarDays, badge: null },
  { href: "/parametres", label: "Paramètres", icon: Settings, badge: null },
]

type UserProfile = {
  nom: string
  email: string
}

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({ nom: "Admin Bureau", email: "admin@memfa.ci" })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile')
        if (!res.ok) return
        const data = await res.json()
        if (data?.user?.nom && data?.user?.email) {
          setProfile({ nom: data.user.nom, email: data.user.email })
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error)
      }
    }

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<UserProfile>
      if (customEvent.detail?.nom && customEvent.detail?.email) {
        setProfile(customEvent.detail)
      }
    }

    fetchProfile()
    window.addEventListener('profile-updated', handleProfileUpdated)
    return () => window.removeEventListener('profile-updated', handleProfileUpdated)
  }, [])

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2.5 bg-white rounded-xl shadow-lg lg:hidden text-gray-600 hover:text-primary transition-colors apple-tap apple-hover-lift"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Black Glassmorphism */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 transition-transform duration-500 ease-out lg:translate-x-0 flex flex-col",
          "bg-black/80 backdrop-blur-xl border-r border-white/10",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center px-6 h-24 border-b border-white/10">
          <div className="relative w-16 h-16 shrink-0 mt-6">
            <Image
              src={logoMemfa}
              alt="MEMFA Jeunesse"
              width={64}
              height={64}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="ml-3">
            <p className="text-white text-2xl font-extrabold leading-none tracking-tight">MEMFA</p>
            <p className="text-gray-300 text-[10px] font-semibold uppercase tracking-[0.22em] mt-1">Jeunesse</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-4 px-3">Navigation</p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative apple-smooth apple-tap",
                  isActive 
                    ? "text-white bg-primary/20 border border-primary/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/50"></div>
                )}
                
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                )}>
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                
                <span className="flex-1">{item.label}</span>
                
                {item.badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md",
                    isActive 
                      ? "bg-primary text-white" 
                      : "bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white"
                  )}>
                    {item.badge}
                  </span>
                )}
                
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isActive ? "text-white opacity-100" : "text-gray-600 group-hover:text-gray-400"
                )} />
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all apple-hover-lift apple-smooth">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-emerald-400/20 rounded-full flex items-center justify-center border border-primary/30">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{profile.nom}</p>
                <p className="text-xs text-gray-400 truncate">{profile.email}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 apple-tap apple-smooth"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-semibold">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}