import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiStar, FiTrendingDown,
  FiAlertCircle, FiPlus, FiShoppingBag
} from 'react-icons/fi'
import { useProduct } from '../hooks/useProducts'
import { usePrices } from '../hooks/usePrices'
import { useAuth } from '../hooks/useAuth'

/* ── Helpers ──────────────────────────────────────── */
const fmtPrice  = (n) => n?.toLocaleString('fr-FR') ?? '—'
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

/* ── Spinner ──────────────────────────────────────── */
const Spinner = ({ label = 'Chargement…' }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full"
    />
    <p className="text-slate-500 text-sm">{label}</p>
  </div>
)

/* ── Price row card ───────────────────────────────── */
const PriceRow = ({ price, rank, onReport, user }) => {
  const isBest = rank === 0

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        isBest
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      style={{ boxShadow: isBest ? '0 2px 12px rgba(16,185,129,.12)' : '0 1px 4px rgba(0,0,0,.04)' }}
    >
      {/* Rank badge */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
        isBest ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        {isBest ? <FiStar className="w-4 h-4 fill-white" /> : rank + 1}
      </div>

      {/* Store info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 text-sm truncate">
          {price.stores?.name ?? 'Magasin inconnu'}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap">
          {price.stores?.city && (
            <span className="flex items-center gap-1">
              <FiMapPin className="w-3 h-3" />
              {price.stores.city}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {fmtDate(price.updated_at || price.created_at)}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <div className={`text-lg font-bold ${isBest ? 'text-emerald-700' : 'text-slate-900'}`}>
          {fmtPrice(price.price)}
          <span className="text-xs font-medium text-slate-400 ml-1">FCFA</span>
        </div>
        {isBest && <div className="text-xs text-emerald-600 font-medium">Meilleur prix</div>}
      </div>

      {/* Report button */}
      {user && (
        <button
          onClick={() => onReport(price.id)}
          className="shrink-0 p-2 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
          title="Signaler ce prix"
        >
          <FiAlertCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}

/* ── Main page ────────────────────────────────────── */
const ProductPage = () => {
  const { productId } = useParams()
  const { user } = useAuth()
  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId)
  const { useProductPrices, reportPrice } = usePrices()
  const { data: prices, isLoading: pricesLoading } = useProductPrices(productId)
  const [sortBy, setSortBy] = useState('price')
  const [reportModal, setReportModal] = useState({ open: false, priceId: null })
  const [reportReason, setReportReason] = useState('')
  const [reportStatus, setReportStatus] = useState(null) // 'success' | 'error' | null
  const [reportSubmitting, setReportSubmitting] = useState(false)

  const handleReportPrice = (priceId) => {
    if (!user) {
      setReportStatus('auth')
      return
    }
    setReportReason('')
    setReportStatus(null)
    setReportModal({ open: true, priceId })
  }

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return
    setReportSubmitting(true)
    try {
      await reportPrice({ priceId: reportModal.priceId, userId: user.id, reason: reportReason })
      setReportModal({ open: false, priceId: null })
      setReportStatus('success')
    } catch (err) {
      setReportStatus('error')
    } finally {
      setReportSubmitting(false)
    }
  }

  if (productLoading) return <Spinner label="Chargement du produit…" />

  if (productError) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-sm w-full text-center">
        <FiAlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 text-sm">{productError.message}</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500">Produit introuvable.</p>
    </div>
  )

  /* ── Sort prices ──────────────────────────────── */
  const sorted = prices
    ? [...prices].sort((a, b) =>
        sortBy === 'price' ? a.price - b.price : new Date(b.updated_at) - new Date(a.updated_at)
      )
    : []

  const lowestPrice  = sorted[0]?.price
  const highestPrice = sorted.at(-1)?.price
  const savings      = lowestPrice && highestPrice && highestPrice > lowestPrice
    ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
    : null

  const imageUrl = product.image_url
    || `https://placehold.co/400x400/eef2ff/6366f1?text=${encodeURIComponent(product.name)}`

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── Header ────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Product image */}
            <div className="w-full md:w-56 shrink-0">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/400x400/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`
                  }}
                />
              </div>
            </div>

            {/* Product info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 capitalize mb-2">{product.name}</h1>
              {product.category && (
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full mb-4 border border-indigo-100">
                  {product.category}
                </span>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mt-4">
                {lowestPrice && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
                    <div className="text-xs text-emerald-600 font-medium mb-0.5">Meilleur prix</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {fmtPrice(lowestPrice)}
                      <span className="text-sm font-medium ml-1">FCFA</span>
                    </div>
                  </div>
                )}
                {savings && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-center gap-2">
                    <FiTrendingDown className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs text-amber-600 font-medium">Économie possible</div>
                      <div className="text-xl font-bold text-amber-700">-{savings}%</div>
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Magasins</div>
                  <div className="text-2xl font-bold text-slate-700">{sorted.length}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link
                to="/add-price"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-200"
              >
                <FiPlus className="w-4 h-4" />
                Ajouter un prix
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prices list ───────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Comparaison des prix
            {sorted.length > 0 && (
              <span className="text-sm font-normal text-slate-400 ml-2">({sorted.length} magasin{sorted.length > 1 ? 's' : ''})</span>
            )}
          </h2>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-slate-200 bg-white text-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
          >
            <option value="price">Trier par prix</option>
            <option value="date">Trier par date</option>
          </select>
        </div>

        {pricesLoading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
            />
            <p className="text-slate-500 text-sm">Chargement des prix…</p>
          </div>
        )}

        {!pricesLoading && sorted.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Aucun prix disponible</h3>
            <p className="text-slate-400 text-sm mb-5">Soyez le premier à contribuer !</p>
            <Link
              to="/add-price"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Ajouter un prix
            </Link>
          </div>
        )}

        {!pricesLoading && sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map((price, i) => (
              <PriceRow
                key={price.id}
                price={price}
                rank={i}
                onReport={handleReportPrice}
                user={user}
              />
            ))}
          </div>
        )}

        {/* Status banners */}
        {reportStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2"
          >
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            Prix signalé avec succès. Merci pour votre contribution !
          </motion.div>
        )}
        {reportStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
          >
            Une erreur est survenue. Veuillez réessayer.
          </motion.div>
        )}
        {reportStatus === 'auth' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3"
          >
            Vous devez être connecté pour signaler un prix.
          </motion.div>
        )}
      </div>

      {/* ── Report modal ──────────────────────────── */}
      {reportModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
          >
            <h3 className="text-base font-bold text-slate-900 mb-1">Signaler ce prix</h3>
            <p className="text-sm text-slate-500 mb-4">Expliquez pourquoi ce prix vous semble incorrect ou obsolete.</p>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Ex : Ce prix date d’il y a 3 mois, il a changé..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setReportModal({ open: false, priceId: null })}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason.trim() || reportSubmitting}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {reportSubmitting ? 'Envoi...' : 'Signaler'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProductPage

