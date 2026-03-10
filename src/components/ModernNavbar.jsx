import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiLogOut, FiMenu, FiX, FiSettings, FiTool } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/logo.png'

const ModernNavbar = () => {
  const [isScrolled, setIsScrolled]       = useState(false)
  const [isMobileOpen, setIsMobileOpen]   = useState(false)
  const { user, signOut, isAuthenticated, isAdmin } = useAuth()
  const navigate                           = useNavigate()
  const location                           = useLocation()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/',          label: 'Accueil' },
    { path: '/marche',    label: 'Marché' },
    { path: '/map',       label: 'Carte' },
    { path: '/add-price', label: 'Ajouter un prix', protected: true },
    { path: '/dashboard', label: 'Dashboard',       protected: true },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-sm border-b border-slate-100'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-100/60'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ──────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src={logoImg}
                alt="AfriPrix"
                className="h-9 w-auto group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-slate-900 font-bold text-xl tracking-tight hidden sm:block">
                Afri<span className="text-indigo-600">Prix</span>
              </span>
            </Link>

            {/* ── Desktop links ──────────────────────────── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((item) =>
                (!item.protected || isAuthenticated) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* ── Desktop right section ─────────────────── */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Avatar + nom */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {(user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-32">
                      {user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <Link
                    to="/settings"
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-150"
                    title="Paramètres"
                  >
                    <FiSettings className="w-4 h-4" />
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-150"
                      title="Administration"
                    >
                      <FiTool className="w-4 h-4" />
                    </Link>
                  )}
                  <motion.button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut className="w-4 h-4" />
                    Déconnexion
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-150 border border-slate-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-150 shadow-sm shadow-indigo-200"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ──────────────────────── */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Menu"
            >
              {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ───────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-slate-100 shadow-lg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((item) =>
                (!item.protected || isAuthenticated) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}

              <div className="pt-3 border-t border-slate-100 space-y-1">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2">
                      <div className="text-sm font-semibold text-slate-800">
                        {user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FiSettings className="w-4 h-4" />
                      Paramètres
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <FiTool className="w-4 h-4" />
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => { handleSignOut(); setIsMobileOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl text-center"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Inscription gratuite
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ModernNavbar
