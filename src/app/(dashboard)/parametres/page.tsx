"use client"

import { useEffect, useState } from 'react'
import { 
  Key, 
  User, 
  Shield, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'password' | 'system'>('profil')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // États pour le profil
  const [profilData, setProfilData] = useState({
    nom: 'Admin Bureau',
    email: 'admin@memfa.ci'
  })

  type CronResult = {
    success?: boolean
    message?: string
    error?: string
  } | null

  // États pour le test Cron
  const [cronResult, setCronResult] = useState<CronResult>(null)
  const [cronLoading, setCronLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile')
        if (!res.ok) return
        const data = await res.json()
        if (data?.user?.nom && data?.user?.email) {
          setProfilData({ nom: data.user.nom, email: data.user.email })
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleProfilSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage(null)

  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: profilData.nom }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Erreur inconnue')

    setMessage({ type: 'success', text: '✅ Profil mis à jour avec succès !' })
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: data.user }))
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Une erreur est survenue pendant la mise à jour du profil'
    setMessage({ type: 'error', text: errorMessage })
  } finally {
    setLoading(false)
  }
}

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue')
      }

      setMessage({ type: 'success', text: data.message || 'Mot de passe modifié avec succès' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant la mise à jour du mot de passe'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Test manuel du Cron
  const testCron = async () => {
    setCronLoading(true)
    setCronResult(null)
    
    try {
      const res = await fetch('/api/cron')
      if (!res.ok) {
        const text = await res.text()
        setCronResult({ error: `Erreur du serveur (${res.status}) : ${text}` })
      } else {
        const data = await res.json()
        setCronResult(data)
      }
    } catch {
      setCronResult({ error: 'Erreur lors de l&rsquo;exécution du cron' })
    } finally {
      setCronLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et les configurations du système.</p>
      </div>

      {/* Message de notification */}
      {message && (
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          message.type === 'success' 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        )}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('profil')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'profil'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-700"
          )}
        >
          <User className="h-4 w-4" />
          Profil
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'password'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-700"
          )}
        >
          <Key className="h-4 w-4" />
          Mot de passe
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
            activeTab === 'system'
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-gray-700"
          )}
        >
          <Shield className="h-4 w-4" />
          Système
        </button>
      </div>

      {/* Contenu des tabs */}
      <div key={activeTab} className="mt-6 apple-route-enter">
        
        {/* TAB: PROFIL */}
        {activeTab === 'profil' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations du profil
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfilSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet</Label>
                  <Input
                    id="nom"
                    value={profilData.nom}
                    onChange={(e) => setProfilData({ ...profilData, nom: e.target.value })}
                    className="max-w-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profilData.email}
                    onChange={(e) => setProfilData({ ...profilData, email: e.target.value })}
                    className="max-w-md"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">L&rsquo;email ne peut pas être modifié pour des raisons de sécurité.</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB: MOT DE PASSE */}
        {activeTab === 'password' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Changer le mot de passe
              </CardTitle>
              <CardDescription>
                Assurez-vous d’utiliser un mot de passe sécurisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Changer le mot de passe
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB: SYSTÈME */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Test du Cron */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className={cn("h-5 w-5 text-primary", cronLoading && "animate-spin")} />
                  Test des rappels automatiques
                </CardTitle>
                <CardDescription>
                  Exécutez manuellement le cron pour vérifier les rappels J-7, J-3, J-1, J-0
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Configuration actuelle</p>
                    <p>Le cron s&rsquo;exécute automatiquement tous les jours à 08h00 (heure locale).</p>
                  </div>
                </div>

                <Button 
                  onClick={testCron} 
                  disabled={cronLoading}
                  className="w-full md:w-auto"
                >
                  {cronLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exécution en cours...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Tester le cron maintenant
                    </>
                  )}
                </Button>

                {cronResult && (
                  <div className={cn(
                    "p-4 rounded-lg border",
                    cronResult.error 
                      ? "bg-red-50 border-red-200" 
                      : "bg-green-50 border-green-200"
                  )}>
                    <div className="flex items-start gap-3">
                      {cronResult.error ? (
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      )}
                      <div className="text-sm">
                        <p className={cn(
                          "font-semibold",
                          cronResult.error ? "text-red-900" : "text-green-900"
                        )}>
                          {cronResult.error ? "Erreur" : "Succès"}
                        </p>
                        <p className={cn(
                          "mt-1",
                          cronResult.error ? "text-red-700" : "text-green-700"
                        )}>
                          {cronResult.message || cronResult.error}
                        </p>
                        {cronResult.success && (
                          <Badge className="mt-2 bg-white text-green-700 hover:bg-green-100">
                            {cronResult.message}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
                <CardDescription>
                  Détails techniques de l&rsquo;application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Version</p>
                    <p className="font-semibold">1.0.0</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Environnement</p>
                    <p className="font-semibold">
                      {process.env.NODE_ENV === 'production' ? 'Production' : 'Développement'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Base de données</p>
                    <p className="font-semibold">SQLite (Local) / PostgreSQL (Prod)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-xs mb-1">Framework</p>
                    <p className="font-semibold">Next.js 14 + TypeScript</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}