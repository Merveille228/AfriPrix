import React from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import {
  FiPlus, FiPackage, FiMapPin, FiCalendar,
  FiAward, FiTrendingUp, FiStar, FiArrowRight
} from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { usePrices } from '../hooks/usePrices'

/* ── Badge système ────────────────────────────────── */
const getBadge = (count) => {
  if (count >= 50) return { label: '🏆 Champion',      color: 'bg-amber-100 text-amber-800 border-amber-200' }
  if (count >= 20) return { label: '⭐ Expert',         color: 'bg-violet-100 text-violet-800 border-violet-200' }
  if (count >= 5)  return { label: '✅ Contributeur',   color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  return              { label: '🌱 Nouveau',           color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
}

/* ── Stat card ────────────────────────────────────── */
const StatCard = ({ Icon, value, label, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  </div>
)

/* ── Contribution row ─────────────────────────────── */
const ContribRow = ({ price, index }) => {
  const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <Motion.div
      className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Icône produit */}
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
        {price.products?.image_url
          ? <img src={price.products.image_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
          : <FiPackage className="w-5 h-5 text-slate-400" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 truncate capitalize">
          {price.products?.name ?? '—'}
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3" />
            {price.stores?.name ?? '—'} · {price.stores?.city ?? '—'}
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {fmtDate(price.updated_at)}
          </span>
        </div>
      </div>

      {/* Prix */}
      <div className="shrink-0 text-right">
        <div className="text-base font-bold text-slate-900">
          {price.price?.toLocaleString('fr-FR')}
          <span className="text-xs text-slate-400 ml-1 font-normal">FCFA</span>
        </div>
      </div>
    </Motion.div>
  )
}

/* ── Page principale ──────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth()
  const { useUserPrices } = usePrices()
  const { data: userPrices, isLoading, error } = useUserPrices(user?.id)

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center max-w-sm">
          <p className="text-slate-600 mb-4">Vous devez être connecté.</p>
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Se connecter</Link>
        </div>
      </div>
    )
  }

  const totalPrices    = userPrices?.length || 0
  const uniqueProducts = new Set(userPrices?.map(p => p.products?.name)).size
  const uniqueStores   = new Set(userPrices?.map(p => p.stores?.name)).size
  const badge          = getBadge(totalPrices)
  const userName       = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Contributeur'

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Hero utilisateur ──────────────────── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Bienvenue 👋</p>
              <h1 className="text-2xl font-bold capitalize">{userName}</h1>
              <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <Link
              to="/add-price"
              className="shrink-0 flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-5 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Ajouter un prix
            </Link>
          </div>
        </Motion.div>

        {/* ── Stats ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <StatCard Icon={FiStar}      value={totalPrices}    label="Prix publiés"     color="bg-indigo-500" />
          <StatCard Icon={FiPackage}   value={uniqueProducts} label="Produits ajoutés" color="bg-emerald-500" />
          <StatCard Icon={FiMapPin}    value={uniqueStores}   label="Magasins couverts" color="bg-purple-500" />
        </div>

        {/* Barre de progression vers le prochain badge */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiAward className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700">Progression</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
          </div>
          {totalPrices < 50 && (
            <>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <Motion.div
                  className="bg-indigo-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalPrices / (totalPrices < 5 ? 5 : totalPrices < 20 ? 20 : 50)) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {totalPrices < 5
                  ? `${5 - totalPrices} prix restants pour devenir Contributeur`
                  : totalPrices < 20
                  ? `${20 - totalPrices} prix restants pour devenir Expert`
                  : `${50 - totalPrices} prix restants pour devenir Champion`}
              </p>
            </>
          )}
          {totalPrices >= 50 && (
            <p className="text-xs text-amber-700 mt-2 font-medium">🏆 Vous avez atteint le niveau maximum. Merci !</p>
          )}
        </div>

        {/* ── Historique des contributions ──────── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-indigo-500" />
              Mes contributions
            </h2>
            {totalPrices > 0 && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                {totalPrices} au total
              </span>
            )}
          </div>

          <div className="px-6">
            {isLoading && (
              <div className="py-12 flex flex-col items-center gap-3">
                <Motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
                />
                <p className="text-sm text-slate-400">Chargement…</p>
              </div>
            )}

            {error && (
              <p className="py-8 text-center text-sm text-red-500">{error.message}</p>
            )}

            {!isLoading && !error && userPrices?.length > 0 && (
              userPrices.map((price, i) => (
                <ContribRow key={price.id} price={price} index={i} />
              ))
            )}

            {!isLoading && !error && (!userPrices || userPrices.length === 0) && (
              <div className="py-14 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-600 font-medium mb-1">Aucune contribution encore</p>
                <p className="text-slate-400 text-sm mb-5">
                  Partagez le prix d'un produit et aidez votre communauté !
                </p>
                <Link
                  to="/add-price"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Ajouter mon premier prix
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

