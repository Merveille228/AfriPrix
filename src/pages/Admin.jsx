import React, { useEffect, useState, useCallback } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiTrash2, FiPackage, FiDollarSign,
  FiShield, FiRefreshCw, FiMap, FiCopy, FiCheck,
  FiAlertTriangle, FiAlertCircle,
} from 'react-icons/fi'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../hooks/useAuth'

/* ── Carte stat ──────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-10 h-10 ${accent} rounded-xl flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value ?? '—'}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════════ */
const Admin = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats]       = useState({ products: 0, prices: 0, stores: 0 })
  const [products, setProducts] = useState([])
  const [prices, setPrices]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [copied, setCopied]     = useState(false)
  const [tab, setTab]           = useState('products')
  const [showSetup, setShowSetup] = useState(
    () => localStorage.getItem('admin-setup-hidden') !== 'true'
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    const [prodRes, priceRes, storeCount] = await Promise.all([
      supabase.from('products').select('id, name, created_at').order('created_at', { ascending: false }),
      supabase.from('prices').select('id, price, created_at, products(name), stores(name, city)').order('created_at', { ascending: false }).limit(100),
      supabase.from('stores').select('id', { count: 'exact', head: true }),
    ])
    setProducts(prodRes.data || [])
    setPrices(priceRes.data || [])
    setStats({
      products: prodRes.data?.length || 0,
      prices:   priceRes.data?.length || 0,
      stores:   storeCount.count || 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    const timer = setTimeout(() => loadData(), 0)
    return () => clearTimeout(timer)
  }, [isAdmin, navigate, loadData])

  const deleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit et tous ses prix associés ?')) return
    setDeleting(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Erreur : ' + error.message)
    setDeleting(null)
    loadData()
  }

  const deletePrice = async (id) => {
    if (!window.confirm('Supprimer ce prix ?')) return
    setDeleting(id)
    const { error } = await supabase.from('prices').delete().eq('id', id)
    if (error) alert('Erreur : ' + error.message)
    setDeleting(null)
    loadData()
  }

  /* SQL à copier pour activer les droits admin */
  const adminSQL =
    `UPDATE auth.users\nSET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb\nWHERE email = '${user?.email}';`

  const adminPoliciesSQL =
    `-- Politique de suppression admin pour les produits\nCREATE POLICY "Admin peut supprimer des produits" ON products\n  FOR DELETE USING (\n    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'\n  );\n\n-- Politique de suppression admin pour les prix\nCREATE POLICY "Admin peut supprimer des prix" ON prices\n  FOR DELETE USING (\n    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'\n  );\n\n-- Politique de mise à jour admin pour les prix\nCREATE POLICY "Admin peut modifier tous les prix" ON prices\n  FOR UPDATE USING (\n    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'\n  );\n\n-- Colonne image_url si elle n'existe pas encore\nALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;`

  const [sqlTarget, setSqlTarget] = useState('role')
  const currentSQL = sqlTarget === 'role' ? adminSQL : adminPoliciesSQL

  const copySQL = () => {
    navigator.clipboard.writeText(currentSQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── En-tête ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-md">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Accès gérant · {user?.email}</p>
                </div>
              </div>
              <button
                onClick={loadData}
                className="ml-auto p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Rafraîchir"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </Motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16">

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <StatCard label="Produits"     value={stats.products} icon={FiPackage}    accent="bg-indigo-500" />
          <StatCard label="Prix publiés" value={stats.prices}   icon={FiDollarSign} accent="bg-emerald-500" />
          <StatCard label="Magasins"     value={stats.stores}   icon={FiMap}        accent="bg-amber-500" />
        </Motion.div>

        {/* ── Setup SQL ────────────────────────────────────────────────── */}
        {showSetup ? (
          <Motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-indigo-800">
                    Configuration Supabase requise
                  </p>
                  <button
                    onClick={() => {
                      setShowSetup(false)
                      localStorage.setItem('admin-setup-hidden', 'true')
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                  >
                    <FiCheck className="w-3 h-3" /> Masquer (déjà fait)
                  </button>
                </div>
                <p className="text-xs text-indigo-600 mb-3">
                  Copiez et exécutez ces SQL dans l&apos;éditeur SQL de votre dashboard Supabase.
                </p>
                <div className="flex gap-2 mb-3">
                  {[{ id: 'role', label: '1. Rôle admin' }, { id: 'policies', label: '2. Politiques RLS' }].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setSqlTarget(id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${sqlTarget === id ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-start gap-2">
                  <pre className="flex-1 bg-white border border-indigo-200 text-xs text-indigo-700 px-3 py-2 rounded-lg font-mono overflow-x-auto whitespace-pre-wrap">
                    {currentSQL}
                  </pre>
                  <button
                    onClick={copySQL}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        ) : (
          <button
            onClick={() => {
              setShowSetup(true)
              localStorage.removeItem('admin-setup-hidden')
            }}
            className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <FiAlertCircle className="w-3.5 h-3.5" /> Afficher les instructions SQL de configuration
          </button>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex gap-2 mb-4">
            {[
              { id: 'products', label: `Produits (${stats.products})` },
              { id: 'prices',   label: `Prix (${stats.prices})` },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Liste produits ── */}
          {tab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                <div className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                  <FiPackage className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-sm font-semibold text-slate-800">Tous les produits</h2>
              </div>
              <div className="divide-y divide-slate-50 max-h-screen overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-slate-400 text-center py-10">Chargement…</p>
                ) : products.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">Aucun produit</p>
                ) : products.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      disabled={deleting === p.id}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Supprimer le produit"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Liste prix ── */}
          {tab === 'prices' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                <div className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                  <FiDollarSign className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="text-sm font-semibold text-slate-800">Tous les prix publiés</h2>
              </div>
              <div className="divide-y divide-slate-50 max-h-screen overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-slate-400 text-center py-10">Chargement…</p>
                ) : prices.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">Aucun prix</p>
                ) : prices.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-800 truncate block">
                        {p.products?.name || '—'}{' '}
                        <span className="text-emerald-600 font-semibold">
                          {Number(p.price).toLocaleString('fr-FR')} FCFA
                        </span>
                      </span>
                      <span className="text-xs text-slate-400">
                        {p.stores?.name}, {p.stores?.city} · {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <button
                      onClick={() => deletePrice(p.id)}
                      disabled={deleting === p.id}
                      className="ml-3 shrink-0 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Supprimer ce prix"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Motion.div>

        {/* ── Zone danger ──────────────────────────────────────────────── */}
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-700">Zone de danger</span>
            </div>
            <p className="text-xs text-red-600 mb-4">
              Les suppressions sont définitives et non récupérables. Les boutons ci-dessous sont fournis à titre de référence — les opérations destructives massives doivent être réalisées directement dans Supabase.
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              Ouvrir le dashboard Supabase
            </a>
          </div>
        </Motion.div>

      </div>
    </div>
  )
}

export default Admin
