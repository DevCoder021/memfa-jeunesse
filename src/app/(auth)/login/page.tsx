"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import logoMemfa from "../../../../assets/logo.png"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@memfa.ci")
  const [password, setPassword] = useState("memfa2026")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Arrière-plan avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100/60"></div>
      
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-yellow-100/30 rounded-full blur-3xl"></div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-lg mx-4 apple-fade-up">
        
        {/* Logo centré */}
        <div className="flex justify-center mb-6">
          <div className="relative group apple-fade-up apple-fade-up-delay-1">
            {/* Halo lumineux derrière le logo */}
            <div className="absolute inset-0 bg-white/60 rounded-full blur-2xl scale-150 group-hover:scale-175 transition-transform duration-700"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl">
              <img src={logoMemfa.src} alt="Logo MEMFA" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8 apple-fade-up apple-fade-up-delay-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            MEMFA Jeunesse
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Système de Gestion d&apos;Activités Spirituelles
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-green-300"></div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">
              Foi & Action
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-green-300"></div>
          </div>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-gray-300/30 border border-white/80 p-8 md:p-10 apple-fade-up apple-fade-up-delay-2 apple-hover-lift">
          
          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-50/80 border border-red-200/60 rounded-2xl text-red-600 text-sm backdrop-blur-sm animate-pulse">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/80 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:border-green-400/50 focus:ring-4 focus:ring-green-100/50 outline-none transition-all duration-300 text-base apple-smooth"
                placeholder="admin@memfa.ci"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-white/80 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:border-green-400/50 focus:ring-4 focus:ring-green-100/50 outline-none transition-all duration-300 text-base pr-14 apple-smooth"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition-all duration-200 rounded-xl hover:bg-green-50 apple-tap"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Bouton Connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-700 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-700/30 hover:shadow-xl hover:shadow-green-700/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-8 text-base tracking-wide apple-smooth apple-tap"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-400 font-medium">
            Mission Évangélique Maranatha — Foi et Action
          </p>
          <p className="text-xs text-gray-300">
            © 2026 MEMFA Jeunesse — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}