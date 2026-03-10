import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiSearch, FiX, FiFilter, FiArrowRight, FiMapPin,
  FiTrendingDown, FiPackage, FiChevronDown, FiTag,
  FiShoppingCart, FiStar, FiGrid, FiList, FiRefreshCw,
} from 'react-icons/fi'
import { useAllProducts } from '../hooks/useProducts'

/* ── Helpers ───────────────────────────────────────── */
const fmt = (n) => n?.toLocaleString('fr-FR') ?? '—'

const CATEGORIES = ['Tout', 'Alimentation', 'Boissons', 'Hygiène & Ménage', 'Énergie', 'Autre']
const SORTS = [
  { value: 'name',       label: 'Nom (A → Z)' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'recent',     label: 'Plus récents' },
  { value: 'stores',     label: 'Plus de magasins' },
]
const CAT_COLORS = {
  'Alimentation':     'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Boissons':         'bg-blue-50    text-blue-700    border-blue-100',
  'Hygiène & Ménage': 'bg-purple-50  text-purple-700  border-purple-100',
  'Énergie':          'bg-amber-50   text-amber-700   border-amber-100',
  'Autre':            'bg-slate-50   text-slate-600   border-slate-100',
}

/* ── Card produit ──────────────────────────────────── */
const MarketCard = ({ product }) => {
  const prices     = product.prices || []
  const allPrices  = prices.map((p) => p.price).filter(Boolean)
  const lowest     = allPrices.length ? Math.min(...allPrices) : null
  const highest    = allPrices.length ? Math.max(...allPrices) : null
  const savings    = lowest && highest && highest > lowest
    ? Math.round(((highest - lowest) / highest) * 100)
    : null
  const storeCount = prices.length

  const cities = [...new Set(
    prices.map((p) => p.stores?.city).filter(Boolean)
  )].slice(0, 2)

  const catColor = CAT_COLORS[product.category] || CAT_COLORS['Autre']

  return (
    <Motion.div
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-all"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.05)' }}
      whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0,0,0,.08), 0 16px 36px rgba(0,0,0,.09)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Photo */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-100 to-slate-200">
            <FiPackage className="w-10 h-10 text-slate-300" />
            <span className="text-xs text-slate-400 font-medium capitalize text-center px-4 line-clamp-2">{product.name}</span>
          </div>
        )}
        {savings && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
            -{savings}%
          </span>
        )}
        {storeCount >= 4 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow flex items-center gap-1">
            <FiStar className="w-3 h-3" /> Populaire
          </span>
        )}
        {product.category && (
          <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-lg border backdrop-blur-sm ${catColor}`}>
            {product.category}
          </span>
        )}
      </div>

      {/* Corps */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 capitalize text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
          {product.name}
        </h3>

        {cities.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3 flex-wrap">
            <FiMapPin className="w-3 h-3 shrink-0" />
            {cities.join(' · ')}
            {storeCount > 2 && <span className="text-slate-300">+{storeCount - 2}</span>}
          </div>
        )}

        <div className="flex items-end justify-between gap-2">
          {lowest ? (
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Meilleur prix</div>
              <div className="text-xl font-extrabold text-slate-900 leading-none">
                {fmt(lowest)}
                <span className="text-[11px] font-medium text-slate-500 ml-1">FCFA</span>
              </div>
              {highest && highest > lowest && (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  jusqu'à {fmt(highest)} FCFA
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400 italic">Prix à venir</div>
          )}

          <Link to={`/product/${product.id}`} className="shrink-0">
            <Motion.button
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
              whileTap={{ scale: 0.95 }}
            >
              Comparer
              <FiArrowRight className="w-3.5 h-3.5" />
            </Motion.button>
          </Link>
        </div>

        {storeCount > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
            <FiShoppingCart className="w-3 h-3" />
            {storeCount} magasin{storeCount > 1 ? 's' : ''} comparé{storeCount > 1 ? 's' : ''}
            {storeCount > 3 && (
              <>
                <span className="mx-0.5">·</span>
                <FiTrendingDown className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600">Tendance</span>
              </>
            )}
          </div>
        )}
      </div>
    </Motion.div>
  )
}

/* ── Skeleton card ─────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-7 bg-slate-200 rounded w-24" />
        </div>
        <div className="h-9 w-20 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
)

/* ── Composant principal ───────────────────────────── */
const MarketPage = () => {
  const [search,          setSearch]      = useState('')
  const [debouncedSearch, setDS]          = useState('')
  const [category,        setCategory]    = useState('Tout')
  const [city,            setCity]        = useState('Tout')
  const [sortBy,          setSortBy]      = useState('name')
  const [view,            setView]        = useState('grid')
  const [showFilters,     setShowFilters] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setDS(search), 380)
    return () => clearTimeout(t)
  }, [search])

  const { data: allProducts = [], isLoading, error, refetch } = useAllProducts({
    search: debouncedSearch,
    category: category === 'Tout' ? null : category,
  })

  const availableCities = useMemo(() => {
    const set = new Set()
    allProducts.forEach((p) =>
      p.prices?.forEach((pr) => { if (pr.stores?.city) set.add(pr.stores.city) })
    )
    return ['Tout', ...Array.from(set).sort()]
  }, [allProducts])

  const products = useMemo(() => {
    let list = [...allProducts]

    if (city !== 'Tout') {
      list = list.filter((p) =>
        p.prices?.some((pr) => pr.stores?.city === city)
      )
    }

    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => {
          const ma = a.prices?.length ? Math.min(...a.prices.map((p) => p.price)) : Infinity
          const mb = b.prices?.length ? Math.min(...b.prices.map((p) => p.price)) : Infinity
          return ma - mb
        })
        break
      case 'price_desc':
        list.sort((a, b) => {
          const ma = a.prices?.length ? Math.min(...a.prices.map((p) => p.price)) : 0
          const mb = b.prices?.length ? Math.min(...b.prices.map((p) => p.price)) : 0
          return mb - ma
        })
        break
      case 'recent':
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'stores':
        list.sort((a, b) => (b.prices?.length || 0) - (a.prices?.length || 0))
        break
      default:
        break
    }

    return list
  }, [allProducts, city, sortBy])

  const totalPrices = useMemo(
    () => allProducts.reduce((acc, p) => acc + (p.prices?.length || 0), 0),
    [allProducts]
  )

  const hasActiveFilters = category !== 'Tout' || city !== 'Tout' || search
  const resetFilters = () => {
    setSearch('')
    setCategory('Tout')
    setCity('Tout')
    setSortBy('name')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── HERO BAR ──────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiShoppingCart className="w-5 h-5 text-indigo-600" />
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Marché AfriPrix
                </h1>
              </div>
              <p className="text-slate-500 text-sm">
                Tous les prix au Togo, en temps réel — comparez avant d'acheter
              </p>
            </div>

            {!isLoading && (
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{allProducts.length}</div>
                  <div className="text-xs text-slate-400">produits</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{totalPrices}</div>
                  <div className="text-xs text-slate-400">prix comparés</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{availableCities.length - 1}</div>
                  <div className="text-xs text-slate-400">villes</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTRES STICKY ────────────────────────────── */}
      <div
        ref={filterRef}
        className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          <div className="flex items-center gap-2">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit…"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Ville */}
            <div className="relative hidden sm:block">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c === 'Tout' ? 'Toutes les villes' : c}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Tri */}
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Toggle vue */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>

            {/* Filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-700 font-medium"
            >
              <FiFilter className="w-4 h-4" />
              Filtres
              {hasActiveFilters && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
            </button>

            {/* Reset */}
            {hasActiveFilters && (
              <Motion.button
                onClick={resetFilters}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
                Réinitialiser
              </Motion.button>
            )}
          </div>

          {/* Catégories */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filtres mobiles déroulants */}
          <AnimatePresence>
            {showFilters && (
              <Motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 pt-2.5">
                  <div className="relative flex-1">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c}>{c === 'Tout' ? 'Toutes les villes' : c}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 pr-8"
                    >
                      {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CONTENU ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {!isLoading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {products.length === 0
                ? 'Aucun produit trouvé'
                : (
                  <>
                    <span className="font-semibold text-slate-900">{products.length}</span>
                    {' '}produit{products.length > 1 ? 's' : ''}{' '}
                    {hasActiveFilters ? 'filtré' : 'disponible'}{products.length > 1 ? 's' : ''}
                  </>
                )
              }
              {category !== 'Tout' && (
                <span className="ml-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{category}</span>
              )}
              {city !== 'Tout' && (
                <span className="ml-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{city}</span>
              )}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              Actualiser
            </button>
          </div>
        )}

        {/* Squelettes */}
        {isLoading && (
          <div className={`grid gap-5 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiX className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-slate-600 font-medium mb-2">Impossible de charger les produits</p>
            <p className="text-slate-400 text-sm mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Grille */}
        {!isLoading && !error && products.length > 0 && (
          <Motion.div
            className={`grid gap-5 ${
              view === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
          >
            {products.map((product) => (
              <MarketCard key={product.id} product={product} />
            ))}
          </Motion.div>
        )}

        {/* État vide */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <FiPackage className="w-9 h-9 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-2">Aucun produit trouvé</p>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              {search
                ? `Aucun résultat pour « ${search} »`
                : "Aucun produit dans cette catégorie pour l'instant"}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Voir tous les produits
              </button>
              <Link
                to="/add-price"
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Ajouter ce produit
              </Link>
            </div>
          </div>
        )}

        {/* CTA */}
        {!isLoading && products.length > 0 && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-linear-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-center text-white"
          >
            <FiTag className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Vous connaissez un prix ?</h2>
            <p className="text-indigo-200 text-sm mb-5 max-w-md mx-auto">
              Aidez la communauté togolaise à mieux acheter en partageant les prix que vous observez dans votre quartier.
            </p>
            <Link
              to="/add-price"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <FiArrowRight className="w-4 h-4" />
              Publier un prix
            </Link>
          </Motion.div>
        )}
      </div>
    </div>
  )
}

export default MarketPage
