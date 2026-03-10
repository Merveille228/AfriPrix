import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple } from 'react-icons/fa6'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/logo.png'

const ModernLogin = () => {
  const [form, setForm]             = useState({ email: '', password: '' })
  const [showPw, setShowPw]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const { signIn, signInWithOAuth }    = useAuth()
  const navigate                    = useNavigate()

  const [oauthLoading, setOauthLoading] = useState(null)

  const handleOAuth = async (provider) => {
    setOauthLoading(provider)
    setError('')
    const { error: err } = await signInWithOAuth(provider)
    if (err) {
      setError(err?.message || `Connexion ${provider} impossible.`)
      setOauthLoading(null)
    }
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { success, error: err } = await signIn(form.email, form.password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError(err?.message || 'Identifiants incorrects.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Left panel (decorative, desktop only) ─────── */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-indigo-600 p-12 text-white">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="AfriPrix" className="h-10 w-auto brightness-[100] invert" />
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Bienvenue,<br />content de vous revoir.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Connectez-vous pour retrouver vos prix favoris, suivre vos contributions et découvrir les meilleures offres de votre quartier.
          </p>

          {/* Fake testimonial */}
          <div className="mt-10 bg-white/10 rounded-2xl p-5 border border-white/20">
            <p className="text-sm italic text-indigo-100">
              "Grâce à AfriPrix, j'économise au moins 3 000 FCFA par semaine sur mes courses."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-xs text-indigo-200">Aminata K., Lomé</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-indigo-300">© 2026 AfriPrix. Tous droits réservés.</p>
      </div>

      {/* ── Right panel (form) ────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center mb-10 lg:hidden">
            <img src={logoImg} alt="AfriPrix" className="h-9 w-auto" />
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Connexion</h1>
          <p className="text-slate-500 text-sm mb-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Créez-en un gratuitement
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="vous@exemple.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm"
                >
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Se connecter
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Vos données sont chiffrées et sécurisées.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou continuer avec</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { provider: 'google',   icon: FcGoogle,   label: 'Google',   cls: 'text-slate-700 hover:bg-slate-50' },
              { provider: 'facebook', icon: FaFacebook, label: 'Facebook', cls: 'text-[#1877F2] hover:bg-blue-50'  },
              { provider: 'apple',    icon: FaApple,    label: 'Apple',    cls: 'text-slate-900 hover:bg-slate-50' },
            ].map(({ provider, icon: Icon, label, cls }) => (
              <motion.button
                key={provider}
                type="button"
                onClick={() => handleOAuth(provider)}
                disabled={!!oauthLoading}
                className={`flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium bg-white transition-colors ${cls} disabled:opacity-50 disabled:cursor-not-allowed`}
                whileTap={{ scale: 0.97 }}
              >
                {oauthLoading === provider
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  : <Icon className="w-5 h-5" />
                }
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernLogin

