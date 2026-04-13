"use client"

import { Search, Bell, Calendar, User, Settings, LogOut, Trash2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type NotificationItem = {
  id: number
  title: string
  message: string
  type: "warning" | "success" | "info"
  time: string
  read: boolean
}

type ActiviteSearchItem = {
  id: number
  nom: string
  lieu: string
  participants: string
}

type SearchResultItem = {
  key: string
  title: string
  subtitle: string
  href: string
}

type UserProfile = {
  nom: string
  email: string
}

export function Topbar() {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(3)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({ nom: "Admin Bureau", email: "admin@memfa.ci" })
  
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications()
  }, [])

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const trimmed = search.trim()
    if (trimmed.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch('/api/activites')
        const data = (await res.json()) as ActiviteSearchItem[]
        const query = trimmed.toLowerCase()

        const activiteResults: SearchResultItem[] = data
          .filter((item) =>
            item.nom.toLowerCase().includes(query) ||
            item.lieu.toLowerCase().includes(query) ||
            item.participants.toLowerCase().includes(query)
          )
          .slice(0, 5)
          .map((item) => ({
            key: `activite-${item.id}`,
            title: item.nom,
            subtitle: `Activité • ${item.lieu}`,
            href: `/activites/${item.id}/edit`,
          }))

        const staticPages: SearchResultItem[] = [
          { key: 'page-activites', title: 'Page Activités', subtitle: 'Navigation', href: '/activites' },
          { key: 'page-rappels', title: 'Page Rappels WhatsApp', subtitle: 'Navigation', href: '/rappels' },
          { key: 'page-calendrier', title: 'Page Calendrier', subtitle: 'Navigation', href: '/calendrier' },
          { key: 'page-parametres', title: 'Page Paramètres', subtitle: 'Navigation', href: '/parametres' },
        ].filter((page) => page.title.toLowerCase().includes(query))

        setSearchResults([...activiteResults, ...staticPages].slice(0, 8))
      } catch (error) {
        console.error('Erreur recherche:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [search])

  const handleSearchSelect = (href: string) => {
    setShowSearchResults(false)
    setSearch("")
    router.push(href)
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = (await res.json()) as NotificationItem[]
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch {
      // Données par défaut si l'API échoue
      const defaultNotifications: NotificationItem[] = [
        { id: 1, title: "Sortie Moyekro", message: "Dans 12 jours", type: "warning", time: "Il y a 2h", read: false },
        { id: 2, title: "Nouvelle activité", message: "Conférence mariage ajoutée", type: "info", time: "Il y a 5h", read: false },
        { id: 3, title: "Rappel envoyé", message: "Message WhatsApp J-7", type: "success", time: "Hier", read: true },
      ]
      setNotifications(defaultNotifications)
      setUnreadCount(2)
    }
  }

  const markNotificationAsRead = async (id: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error('Erreur update notification:', error)
    } finally {
      fetchNotifications()
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      })
    } catch (error) {
      console.error('Erreur update notifications:', error)
    } finally {
      fetchNotifications()
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error('Erreur suppression notification:', error)
    } finally {
      fetchNotifications()
    }
  }

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
        window.location.href = '/login'
      } catch (error) {
        console.error('Erreur déconnexion:', error)
        window.location.href = '/login'
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 glass-topbar px-4 sm:px-6 lg:px-8 py-3 min-h-[80px] flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 apple-fade-up">
      
      {/* Left Section: Date & Greeting */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="hidden md:flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Bonjour, {profile.nom}
          </h2>
          <p className="text-sm text-muted-foreground capitalize flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formattedDate}
          </p>
        </div>

        {/* Mobile Date */}
        <div className="md:hidden flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="capitalize">{currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="order-3 lg:order-none w-full lg:flex-1 lg:max-w-xl">
        <div ref={searchRef} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Rechercher une activité, un rappel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSearchResults(true)
            }}
            onFocus={() => {
              if (search.trim().length >= 2 || searchResults.length > 0) {
                setShowSearchResults(true)
              }
            }}
            className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md 
                       text-sm focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 
                       outline-none transition-all duration-300 placeholder:text-gray-400 shadow-sm apple-smooth"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100/80 border border-gray-200">
            <span className="text-[10px] font-semibold text-gray-500">⌘K</span>
          </div>

          {showSearchResults && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 bg-white rounded-xl border shadow-xl overflow-hidden apple-fade-up apple-fade-up-delay-1">
              {isSearching ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">Recherche en cours...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.key}
                    onClick={() => handleSearchSelect(result.href)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors apple-tap"
                  >
                    <p className="text-sm font-medium text-gray-900">{result.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{result.subtitle}</p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">Aucun résultat</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative p-3 rounded-xl border border-white/60 bg-white/40 hover:bg-white/70 
                       transition-all duration-200 group apple-smooth apple-tap apple-hover-lift"
          >
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass rounded-2xl shadow-2xl border border-white/60 overflow-hidden apple-fade-up apple-fade-up-delay-1 z-50">
              <div className="p-4 border-b border-white/40 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-md">
                  {unreadCount} nouvelles
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 hover:bg-white/50 border-b border-white/30 last:border-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          notif.type === "warning" ? "bg-amber-500" :
                          notif.type === "success" ? "bg-green-500" : "bg-blue-500"
                        )} />
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="flex-1 text-left cursor-pointer"
                        >
                          <p className={cn(
                            "text-sm font-semibold",
                            !notif.read ? "text-gray-900" : "text-gray-600"
                          )}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </button>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Aucune notification
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-white/40 bg-gray-50/50">
                <button
                  onClick={markAllNotificationsAsRead}
                  className="w-full text-center text-xs font-medium text-primary hover:text-primary/80"
                >
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-xl border border-white/60 bg-white/40 
                       hover:bg-white/70 transition-all duration-200 group apple-smooth apple-tap apple-hover-lift"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg transition-shadow">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{profile.nom}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{profile.email}</p>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-64 glass rounded-2xl shadow-2xl border border-white/60 overflow-hidden apple-fade-up apple-fade-up-delay-1 z-50">
              <div className="p-4 border-b border-white/40 bg-gradient-to-r from-primary/5 to-transparent">
                <p className="text-sm font-semibold text-gray-900">{profile.nom}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/parametres')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  Mon profil
                </button>
                <button 
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/parametres')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  Paramètres
                </button>
                <div className="my-2 border-t border-white/40" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/60 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}