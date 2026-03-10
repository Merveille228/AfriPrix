import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser, FiLock, FiSliders, FiLogOut, FiSave,
  FiCheck, FiAlertTriangle, FiMail, FiMapPin,
  FiBell, FiEye, FiEyeOff, FiShield, FiArrowLeft,
  FiSun, FiMoon, FiMonitor, FiGlobe,
} from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

/* ── Thèmes ─────────────────────────────────────────────────────────────── */
const THEMES = [
  { id: 'light',  label: 'Clair',   icon: FiSun },
  { id: 'dark',   label: 'Sombre',  icon: FiMoon },
  { id: 'system', label: 'Système', icon: FiMonitor },
]

/* ── Langues ─────────────────────────────────────────────────────────────── */
const LANGUAGES = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
]

/* ── Appliquer le thème au document ─────────────────────────────────────── */
const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark')
    else root.classList.remove('dark')
  }
  localStorage.setItem('afriprix-theme', theme)
}

/* ── Villes Togo ─────────────────────────────────────────────────────────── */
const TOGO_CITIES = [
  'Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé',
  'Tsévié', 'Aného', 'Notsé', 'Badou', 'Sotouboua',
  'Bassar', 'Bafilo', 'Dapaong', 'Mango',
]

/* ── Section card ────────────────────────────────────────────────────────── */
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
      <div className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
)

/* ── Feedback message ────────────────────────────────────────────────────── */
const FeedbackMsg = ({ msg }) => (
  <AnimatePresence>
    {msg && (
      <Motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`text-xs font-medium flex items-center gap-1.5 ${msg.ok ? 'text-emerald-600' : 'text-red-500'}`}
      >
        {msg.ok ? <FiCheck className="w-3.5 h-3.5" /> : <FiAlertTriangle className="w-3.5 h-3.5" />}
        {msg.text}
      </Motion.p>
    )}
  </AnimatePresence>
)

/* ── Toggle switch ───────────────────────────────────────────────────────── */
const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

/* ══════════════════════════════════════════════════════════════════════════ */
const Settings = () => {
  const { user, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()

  /* ── État profil ── */
  const [profile, setProfile] = useState({
    username: user?.user_metadata?.username || '',
    fullName: user?.user_metadata?.full_name || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg]       = useState(null)

  /* ── État sécurité ── */
  const [pwForm, setPwForm]   = useState({ newPw: '', confirmPw: '' })
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwMsg, setPwMsg]         = useState(null)

  /* ── État apparence ── */
  const [appearance, setAppearance] = useState({
    theme:    localStorage.getItem('afriprix-theme') || user?.user_metadata?.theme    || 'system',
    language: user?.user_metadata?.language || 'fr',
  })
  const [appearanceSaving, setAppearanceSaving] = useState(false)
  const [appearanceMsg, setAppearanceMsg]       = useState(null)

  /* ── Appliquer le thème au montage ── */
  useEffect(() => {
    applyTheme(appearance.theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── État préférences ── */
  const [prefs, setPrefs] = useState({
    defaultCity:   user?.user_metadata?.default_city   || 'Lomé',
    notifications: user?.user_metadata?.notifications !== false,
    publicProfile: user?.user_metadata?.public_profile !== false,
  })
  const [prefsSaving, setPrefsSaving] = useState(false)
  const [prefsMsg, setPrefsMsg]       = useState(null)

  /* ── Handlers ── */
  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      setProfileMsg({ ok: false, text: "Le nom d'utilisateur est requis." })
      return
    }
    setProfileSaving(true)
    setProfileMsg(null)
    const { success, error } = await updateProfile({
      data: {
        username:  profile.username.trim(),
        full_name: profile.fullName.trim(),
      },
    })
    setProfileMsg(success
      ? { ok: true, text: 'Profil mis à jour ✓' }
      : { ok: false, text: error || 'Erreur inconnue' }
    )
    setProfileSaving(false)
  }

  const handleSavePw = async () => {
    if (pwForm.newPw !== pwForm.confirmPw) {
      setPwMsg({ ok: false, text: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (pwForm.newPw.length < 8) {
      setPwMsg({ ok: false, text: 'Au moins 8 caractères requis.' })
      return
    }
    setPwSaving(true)
    setPwMsg(null)
    const { success, error } = await updateProfile({ password: pwForm.newPw })
    setPwMsg(success
      ? { ok: true, text: 'Mot de passe modifié ✓' }
      : { ok: false, text: error || 'Erreur inconnue' }
    )
    if (success) setPwForm({ newPw: '', confirmPw: '' })
    setPwSaving(false)
  }

  const handleSaveAppearance = async () => {
    applyTheme(appearance.theme)
    setAppearanceSaving(true)
    setAppearanceMsg(null)
    const { success, error } = await updateProfile({
      data: {
        theme:    appearance.theme,
        language: appearance.language,
      },
    })
    setAppearanceMsg(success
      ? { ok: true, text: 'Apparence enregistrée ✓' }
      : { ok: false, text: error || 'Erreur inconnue' }
    )
    setAppearanceSaving(false)
  }

  const handleSavePrefs = async () => {
    setPrefsSaving(true)
    setPrefsMsg(null)
    const { success, error } = await updateProfile({
      data: {
        default_city:   prefs.defaultCity,
        notifications:  prefs.notifications,
        public_profile: prefs.publicProfile,
      },
    })
    setPrefsMsg(success
      ? { ok: true, text: 'Préférences enregistrées ✓' }
      : { ok: false, text: error || 'Erreur inconnue' }
    )
    setPrefsSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  /* ── Initiales avatar ── */
  const initials = (
    profile.username?.[0] ||
    profile.fullName?.[0] ||
    user?.email?.[0] ||
    '?'
  ).toUpperCase()

  const displayName = profile.username || profile.fullName || user?.email?.split('@')[0]

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── En-tête ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-600 to-slate-900 flex items-center justify-center shadow-md">
                  <FiSliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                  <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5 pb-16">

        {/* ── Profil ──────────────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionCard title="Profil" icon={FiUser}>
            <div className="space-y-4">

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 border-2 border-indigo-200">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{displayName}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nom d&apos;utilisateur <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none select-none">@</span>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={e => setProfile(p => ({ ...p, username: e.target.value.replace(/\s/g, '_') }))}
                    placeholder="nom_utilisateur"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Affiché dans la navbar et sur votre profil</p>
              </div>

              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Prénom Nom"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
                  <FiMail className="w-4 h-4 text-slate-400 shrink-0" />
                  {user.email}
                </div>
                <p className="text-xs text-slate-400 mt-1">Modifiable uniquement via le lien de réinitialisation.</p>
              </div>

              <FeedbackMsg msg={profileMsg} />

              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200"
              >
                {profileSaving
                  ? 'Enregistrement…'
                  : <><FiSave className="w-4 h-4" /> Enregistrer le profil</>
                }
              </button>
            </div>
          </SectionCard>
        </Motion.div>

        {/* ── Apparence ───────────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionCard title="Apparence" icon={FiSun}>
            <div className="space-y-5">

              {/* Thème */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <FiMoon className="w-4 h-4 inline mr-1.5 text-slate-400" />
                  Thème
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setAppearance(a => ({ ...a, theme: id }))
                        applyTheme(id)
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        appearance.theme === id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Langue */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <FiGlobe className="w-4 h-4 inline mr-1.5 text-slate-400" />
                  Langue d&apos;affichage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ code, label, flag }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setAppearance(a => ({ ...a, language: code }))}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        appearance.language === code
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-base">{flag}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">D&apos;autres langues arrivent bientôt.</p>
              </div>

              <FeedbackMsg msg={appearanceMsg} />

              <button
                onClick={handleSaveAppearance}
                disabled={appearanceSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200"
              >
                {appearanceSaving
                  ? 'Enregistrement…'
                  : <><FiSave className="w-4 h-4" /> Enregistrer l&apos;apparence</>
                }
              </button>
            </div>
          </SectionCard>
        </Motion.div>

        {/* ── Sécurité ────────────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionCard title="Sécurité" icon={FiShield}>
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={pwForm.newPw}
                    onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type={showConfPw ? 'text' : 'password'}
                    value={pwForm.confirmPw}
                    onChange={e => setPwForm(p => ({ ...p, confirmPw: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                  <button type="button" onClick={() => setShowConfPw(!showConfPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <FeedbackMsg msg={pwMsg} />

              <button
                onClick={handleSavePw}
                disabled={pwSaving || !pwForm.newPw}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {pwSaving
                  ? 'Modification…'
                  : <><FiCheck className="w-4 h-4" /> Changer le mot de passe</>
                }
              </button>
            </div>
          </SectionCard>
        </Motion.div>

        {/* ── Préférences ─────────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionCard title="Préférences" icon={FiSliders}>
            <div className="space-y-5">

              {/* Ville par défaut */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FiMapPin className="w-4 h-4 inline mr-1.5 text-slate-400" />
                  Ville par défaut
                </label>
                <select
                  value={prefs.defaultCity}
                  onChange={e => setPrefs(p => ({ ...p, defaultCity: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                  {TOGO_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">Utilisée pour filtrer les prix près de vous</p>
              </div>

              {/* Devise */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-sm font-medium text-slate-700">Devise</div>
                  <div className="text-xs text-slate-400 mt-0.5">Fixé pour le marché togolais</div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">FCFA</span>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <FiBell className="w-4 h-4 text-slate-400" />
                    Notifications
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Alertes prix et nouveaux produits</div>
                </div>
                <Toggle value={prefs.notifications} onChange={v => setPrefs(p => ({ ...p, notifications: v }))} />
              </div>

              {/* Profil public */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <FiShield className="w-4 h-4 text-slate-400" />
                    Profil public
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Vos contributions sont visibles par tous</div>
                </div>
                <Toggle value={prefs.publicProfile} onChange={v => setPrefs(p => ({ ...p, publicProfile: v }))} />
              </div>

              <FeedbackMsg msg={prefsMsg} />

              <button
                onClick={handleSavePrefs}
                disabled={prefsSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200"
              >
                {prefsSaving
                  ? 'Enregistrement…'
                  : <><FiSave className="w-4 h-4" /> Enregistrer les préférences</>
                }
              </button>
            </div>
          </SectionCard>
        </Motion.div>

        {/* ── À propos du site ────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionCard title="À propos d'AfriPrix" icon={FiSliders}>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Version', value: '1.0.0' },
                  { label: 'Région', value: '🇹🇬 Togo' },
                  { label: 'Devise', value: 'FCFA' },
                  { label: 'Langue', value: 'Français' },
                  { label: 'Base de données', value: 'Supabase' },
                  { label: 'Contact', value: 'contact@afriprix.tg' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 pt-1">
                AfriPrix est une plateforme communautaire de comparaison de prix pour le marché togolais.
                Contribuez en ajoutant des prix et aidez votre communauté à mieux consommer.
              </p>
            </div>
          </SectionCard>
        </Motion.div>

        {/* ── Compte / Déconnexion ─────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionCard title="Compte" icon={FiAlertTriangle}>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Connecté en tant que <strong className="text-slate-800">{user.email}</strong>
              </p>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full text-red-600 hover:bg-red-50 border border-red-200 font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </SectionCard>
        </Motion.div>

      </div>
    </div>
  )
}

export default Settings
