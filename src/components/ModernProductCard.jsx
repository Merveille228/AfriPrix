import React from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiArrowRight, FiTrendingDown } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ModernProductCard = ({ product }) => {
  if (!product) return null

  const lowestPrice = product.prices?.length > 0
    ? Math.min(...product.prices.map((p) => p.price))
    : null

  const highestPrice = product.prices?.length > 0
    ? Math.max(...product.prices.map((p) => p.price))
    : null

  const storeCount = product.prices?.length ?? 0

  const savings = lowestPrice && highestPrice && highestPrice > lowestPrice
    ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
    : null

  const imageUrl = product.image_url
    || `https://placehold.co/400x240/eef2ff/6366f1?text=${encodeURIComponent(product.name)}`

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.06)' }}
      whileHover={{ y: -6, boxShadow: '0 4px 12px rgba(0,0,0,.08), 0 20px 40px rgba(0,0,0,.10)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x240/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`
          }}
        />
        {savings && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
            -{savings}%
          </span>
        )}
        {storeCount > 5 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
            Populaire
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 capitalize mb-1 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
          <FiMapPin className="w-3 h-3 shrink-0" />
          <span>{storeCount} magasin{storeCount > 1 ? 's' : ''}</span>
          {storeCount > 3 && (
            <>
              <span>·</span>
              <FiTrendingDown className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">Tendance</span>
            </>
          )}
        </div>

        <div className="flex items-end justify-between">
          {lowestPrice ? (
            <div>
              <div className="text-xs text-slate-400 mb-0.5">À partir de</div>
              <div className="text-xl font-bold text-slate-900">
                {lowestPrice.toLocaleString('fr-FR')}
                <span className="text-xs font-medium text-slate-500 ml-1">FCFA</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">Prix non disponible</div>
          )}

          <Link to={`/product/${product.id}`}>
            <motion.button
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
              whileTap={{ scale: 0.95 }}
            >
              Voir
              <FiArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default ModernProductCard

