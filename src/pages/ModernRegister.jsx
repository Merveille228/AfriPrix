import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiUser,
  FiArrowRight, FiAlertCircle, FiCheckCircle, FiCheck
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple } from 'react-icons/fa6'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/logo.png'

const PasswordStrengthBar = ({ password }) => {
  const strength = password.length >= 8 ? 3 : password.length >= 6 ? 2 : password.length > 0 ? 1 : 0
  const labels   = ['', 'Faible', 'Moyen', 'Fort']
  const colors   = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500']

  if (!password) return null
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? colors[strength] : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <span className={`text-xs ${strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-red-500'}`}>
        {labels[strength]}
      </span>
    </div>
  )
}

const ModernRegister = () => {
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw]   = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const { signUp, signInWithOAuth }  = useAuth()
  const navigate              = useNavigate()

  const [oauthLoading, setOauthLoading] = useState(null)
  const [oauthError, setOauthError]     = useState('')

  const handleOAuth = async (provider) => {
    setOauthLoading(provider)
    setOauthError('')
    const { error: err } = await signInWithOAuth(provider)
    if (err) {
      setOauthError(err?.message || `Connexion ${provider} impossible.`)
      setOauthLoading(null)
    }
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    const { success: ok, error: err } = await signUp(form.email, form.password, {
      full_name: form.fullName,
      username:  form.username.trim() || form.fullName.trim().toLowerCase().replace(/\s+/g, '_'),
    })
    if (ok) {
      setSuccess('Compte créé avec succès ! Redirection en cours…')
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setError(err?.message || "Erreur lors de l'inscription.")
    }
    setLoading(false)
  }

  const pwMatch = form.password && form.confirmPassword && form.password === form.confirmPassword

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Left decorative panel (desktop) ──────── */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-emerald-600 p-12 text-white">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="AfriPrix" className="h-10 w-auto brightness-[100] invert" />
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Rejoignez des milliers<br />d'acheteurs malins.
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed mb-8">
            Créez votre compte gratuitement et commencez à comparer les prix dans votre ville.
          </p>

          {/* Benefits list */}
          {[
            'Accès à tous les prix en temps réel',
            'Contribuez et aidez votre communauté',
            'Trouvez les meilleurs magasins près de vous',
            '100% gratuit, sans publicité agressive',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 mb-3">
              <FiCheck className="w-4 h-4 text-emerald-200 mt-0.5 shrink-0" />
              <span className="text-sm text-emerald-100">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-emerald-300">© 2026 AfriPrix. Tous droits réservés.</p>
      </div>

      {/* ── Form panel ────────────────────────────── */}
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

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Créer un compte</h1>
          <p className="text-slate-500 text-sm mb-8">
            Déjà membre ?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Connectez-vous
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Prénom Nom"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom d&apos;utilisateur</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">@</span>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={handleChange('username')}
                  placeholder="nom_utilisateur"
                  pattern="[a-zA-Z0-9_]+"
                  title="Lettres, chiffres et underscore uniquement"
                  className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Affiché dans la navbar et sur votre profil</p>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
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
                  className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthBar password={form.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showCpw ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm ${
                    form.confirmPassword
                      ? pwMatch ? 'border-emerald-300' : 'border-red-300'
                      : 'border-slate-200'
                  }`}
                />
                <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showCpw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword && pwMatch && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3" /> Mots de passe identiques
                </p>
              )}
            </div>

            {/* Feedback */}
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
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm"
                >
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  {success}
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
                  Créer mon compte
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou s'inscrire avec</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* OAuth error */}
          <AnimatePresence>
            {oauthError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm mb-3"
              >
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {oauthError}
              </motion.div>
            )}
          </AnimatePresence>

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

export default ModernRegister
