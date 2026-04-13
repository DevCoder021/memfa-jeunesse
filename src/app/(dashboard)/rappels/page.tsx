"use client"

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  CalendarDays, 
  Clock, 
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { genererMessageWhatsApp } from '@/lib/messages'
import { cn } from '@/lib/utils'

interface Activite {
  id: number
  nom: string
  dateActivite: string | null
  heure: string | null
  lieu: string
  participants: string
  statut: string
}

export default function RappelsPage() {
  const [activites, setActivites] = useState<Activite[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [actionState, setActionState] = useState<'idle' | 'copying' | 'copied' | 'sending'>('idle')

  // Chargement des activités
  useEffect(() => {
    fetchActivites()
  }, [])

  const fetchActivites = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/activites')
      const data = (await res.json()) as Activite[]
      // On ne garde que les activités à venir
      const aVenir = data.filter((a) => a.statut === 'a_venir')
      // Tri par date la plus proche
      aVenir.sort((a, b) => {
        if (!a.dateActivite) return 1
        if (!b.dateActivite) return -1
        return new Date(a.dateActivite).getTime() - new Date(b.dateActivite).getTime()
      })
      setActivites(aVenir)
    } catch (error) {
      console.error('Erreur chargement activités:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcul des jours restants
  const calculerJours = (dateStr: string | null): number | null => {
    if (!dateStr) return null
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff >= 0 ? diff : null
  }

  // Sélection d'une activité
  const handleSelect = (act: Activite) => {
    setSelectedId(act.id)
    const jours = calculerJours(act.dateActivite)
    const msg = genererMessageWhatsApp(act, jours)
    setMessage(msg)
    setActionState('idle')
  }

  // Sauvegarde de l'historique
  const saveLog = async (mode: 'manuel' | 'auto') => {
    if (!selectedId) return
    try {
      await fetch('/api/rappels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activiteId: selectedId,
          joursRestants: calculerJours(activites.find(a => a.id === selectedId)?.dateActivite || null),
          message: message,
          mode: mode
        })
      })
    } catch (error) {
      console.error('Erreur sauvegarde log:', error)
    }
  }

  // Action Copier
  const handleCopy = async () => {
    if (!message) return
    setActionState('copying')
    try {
      await navigator.clipboard.writeText(message)
      setActionState('copied')
      await saveLog('manuel')
      setTimeout(() => setActionState('idle'), 2000)
    } catch (error) {
      console.error('Erreur copie:', error)
      setActionState('idle')
    }
  }

  // Action Ouvrir WhatsApp
  const handleSend = async () => {
    if (!message) return
    setActionState('sending')
    try {
      const encoded = encodeURIComponent(message)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
      await saveLog('manuel')
      setActionState('idle')
    } catch (error) {
      console.error('Erreur envoi:', error)
      setActionState('idle')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rappels WhatsApp</h1>
          <p className="text-muted-foreground">Générez et envoyez les messages de rappel au groupe.</p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Gauche : Liste des activités */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activités à venir</h2>
            <Badge variant="secondary" className="font-medium">{activites.length}</Badge>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Chargement...
            </div>
          ) : activites.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center text-muted-foreground">
              <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>Aucune activité à venir pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              {activites.map(act => {
                const jours = calculerJours(act.dateActivite)
                if (jours === null) return null
                
                const isUrgent = jours <= 3
                const isSelected = selectedId === act.id

                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelect(act)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-200 group",
                      isSelected 
                        ? "bg-primary/5 border-primary ring-1 ring-primary shadow-sm" 
                        : "bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "font-medium line-clamp-1",
                        isSelected ? "text-primary" : "text-gray-900"
                      )}>
                        {act.nom}
                      </span>
                      {isUrgent && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md shrink-0">
                          <AlertTriangle className="h-3 w-3" /> J-{jours}
                        </span>
                      )}
                      {!isUrgent && jours !== null && (
                        <span className="text-[10px] font-medium text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
                          J-{jours}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {act.dateActivite 
                        ? new Date(act.dateActivite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                        : 'Date indéfinie'
                      }
                      {act.lieu && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="truncate">{act.lieu}</span>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Colonne Droite : Prévisualisation & Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm h-full flex flex-col overflow-hidden">
            
            {/* Barre d'actions */}
            <div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold text-gray-900">Aperçu du message</span>
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  disabled={actionState !== 'idle' || !selectedId}
                  className={cn(
                    "transition-all",
                    "flex-1 sm:flex-none",
                    actionState === 'copied' ? "bg-green-50 text-green-700 border-green-200" : ""
                  )}
                >
                  {actionState === 'copying' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : actionState === 'copied' ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {actionState === 'copied' ? "Copié !" : "Copier"}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSend}
                  disabled={actionState !== 'idle' || !selectedId}
                  className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none"
                >
                  {actionState === 'sending' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Ouvrir WhatsApp
                </Button>
              </div>
            </div>

            {/* Contenu du message */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/30">
              {selectedId ? (
                <div className="bg-white border rounded-xl p-6 shadow-sm max-w-2xl mx-auto relative">
                  {/* En-tête du message */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {activites.find(a => a.id === selectedId)?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activites.find(a => a.id === selectedId)?.lieu}
                      </p>
                    </div>
                  </div>

                  {/* Corps du message */}
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                    {message}
                  </pre>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Généré automatiquement</span>
                    <span>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-center">Sélectionnez une activité dans la liste pour prévisualiser le message de rappel.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}