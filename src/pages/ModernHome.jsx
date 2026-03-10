import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import heroImg from '../assets/imageprincipale.png'
import {
  FiSearch, FiArrowRight, FiTrendingDown, FiMapPin, FiPackage,
  FiChevronRight, FiStar, FiShield, FiUsers
} from 'react-icons/fi'
import ModernProductCard from '../components/ModernProductCard'
import HowItWorks from '../components/HowItWorks'
import { useProducts } from '../hooks/useProducts'

/* ── Framer variants ──────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13 } },
}

/* ── Animated counter ─────────────────────────────── */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(to / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const ModernHome = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(searchQuery)
  const inputRef = useRef(null)

  const { searchProducts, searchProductsQuery } = useProducts(searchQuery)
  const isSearchMode = searchQuery.length > 0

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const { data: products, isLoading, error } = isSearchMode
    ? searchProductsQuery
    : searchProducts

  const handleSearch = (e) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (q) {
      setSearchParams({ q })
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative bg-white pt-24 pb-16 overflow-hidden">

        {/* Blobs décoratifs */}
        <div className="absolute -top-32 -right-32 w-125 h-125 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-87.5 h-87.5 bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* ── Colonne gauche ────────────────────── */}
            <div className="flex-1 text-center lg:text-left z-10">

              {/* Badge animé */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-full px-4 py-2 mb-6 text-sm font-medium border border-indigo-100"
              >
                <FiMapPin className="w-4 h-4" />
                La plateforme de comparaison des prix locaux
              </motion.div>

              {/* Titre */}
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-5 tracking-tight"
              >
                Achetez mieux,{' '}
                <br />
                <span className="relative inline-block">
                  <span className="text-indigo-600">économisez plus</span>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-1 bg-indigo-200 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
                  />
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Comparez les prix réels dans les magasins autour de vous.
                Fini les mauvaises surprises, commencez à économiser dès aujourd'hui.
              </motion.p>

              {/* Barre de recherche */}
              <motion.form
                variants={fadeUp}
                onSubmit={handleSearch}
                className="flex gap-2 max-w-lg mx-auto lg:mx-0"
              >
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ex : riz 25kg, huile, sucre…"
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 transition-colors shrink-0 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Rechercher
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.form>

              {/* Tags populaires */}
              <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="text-xs text-slate-400 self-center">Populaire :</span>
                {['Riz 25kg', 'Huile 5L', 'Sucre 1kg', 'Ciment', 'Lait Gloria'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setInputValue(tag)
                      setSearchParams({ q: tag })
                      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-indigo-100"
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>

              {/* Compteurs sociaux */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start"
              >
                {[
                  { icon: FiUsers,       to: 5200,  suffix: '+', label: 'utilisateurs' },
                  { icon: FiPackage,     to: 1200,  suffix: '+', label: 'produits'     },
                  { icon: FiTrendingDown,to: 40,    suffix: '%', label: 'd\'économies' },
                ].map(({ icon: Icon, to, suffix, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-base font-bold text-slate-900 leading-none">
                        <Counter to={to} suffix={suffix} />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                  100% gratuit
                </div>
              </motion.div>
            </div>

            {/* ── Colonne droite — image + badges flottants ── */}
            <motion.div variants={fadeUp} className="shrink-0 w-full max-w-md lg:max-w-lg xl:max-w-xl relative">

              {/* Halo de fond */}
              <div className="absolute inset-0 bg-linear-to-br from-indigo-100 to-emerald-50 rounded-3xl blur-2xl opacity-60 scale-95" />

              {/* Image principale */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
                <img
                  src={heroImg}
                  alt="AfriPrix — comparez les prix"
                  className="w-full h-auto object-cover"
                />
                {/* overlay léger en bas */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-linear-to-t from-white/20 to-transparent" />
              </div>

              {/* Badge flottant — économie */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-2.5"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FiTrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Économie ce mois</div>
                  <div className="text-sm font-extrabold text-emerald-600">-15 000 FCFA</div>
                </div>
              </motion.div>

              {/* Badge flottant — note */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-2.5"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5, type: 'spring' }}
              >
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <FiStar key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Noté 4.9/5</div>
                  <div className="text-xs text-slate-400">par la communauté</div>
                </div>
              </motion.div>

              {/* Badge flottant — live */}
              <motion.div
                className="absolute top-6 -right-3 bg-indigo-600 text-white rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-semibold">Prix en direct</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <HowItWorks />

      {/* ════════════════════════════════════════════
          PRODUCT RESULTS / POPULAR
      ════════════════════════════════════════════ */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {isSearchMode ? `Résultats pour "${searchQuery}"` : 'Produits populaires'}
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                {isSearchMode
                  ? 'Comparez les prix dans les magasins locaux'
                  : 'Les produits les plus comparés cette semaine'}
              </p>
            </div>
            {!isSearchMode && (
              <Link
                to="/add-price"
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Ajouter un produit <FiChevronRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>

          {/* Re-search bar if in search mode */}
          {isSearchMode && (
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-10">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Modifier la recherche…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                OK
              </button>
            </form>
          )}

          {/* States */}
          {isLoading && (
            <div className="flex flex-col items-center py-24 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full"
              />
              <p className="text-slate-500 text-sm">Recherche en cours…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto">
              <p className="text-red-700 text-sm">Une erreur est survenue : {error.message}</p>
            </div>
          )}

          {!isLoading && products && products.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {products.map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} transition={{ delay: i * 0.05 }}>
                  <ModernProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA → page Marché */}
          {!isLoading && !isSearchMode && (
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                to="/marche"
                className="inline-flex items-center gap-2 bg-white border-2 border-indigo-200 text-indigo-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-sm text-sm"
              >
                <FiChevronRight className="w-4 h-4" />
                Voir tous les prix de la plateforme
              </Link>
              <p className="text-xs text-slate-400 mt-2">Filtrer par catégorie, ville et fourchette de prix</p>
            </motion.div>
          )}

          {!isLoading && products && products.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                {isSearchMode ? `Aucun résultat pour "${searchQuery}"` : 'Aucun produit disponible'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {isSearchMode ? 'Essayez un autre terme ou contribuez en ajoutant ce produit.' : 'Soyez le premier à contribuer !'}
              </p>
              <Link
                to="/add-price"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
              >
                Ajouter ce produit <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════ */}
      <section className="py-20 bg-indigo-600">
        <motion.div
          className="max-w-3xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vous connaissez un prix ?
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Aidez la communauté en partageant les prix que vous voyez dans les magasins.
          </p>
          <Link
            to="/add-price"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-sm"
          >
            Partager un prix <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default ModernHome
