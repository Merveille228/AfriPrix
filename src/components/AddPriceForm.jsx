import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiTag, FiDollarSign, FiMapPin, FiAlertCircle,
  FiArrowRight, FiCheckCircle, FiInfo
} from 'react-icons/fi'
import ProductImageUpload from './ProductImageUpload'
import StoreAutocomplete from './StoreAutocomplete'
import { productService } from '../services/productService'

/* ── Villes du Togo ───────────────────────────────── */
const TOGO_CITIES = ['Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Tsévié', 'Aného', 'Dapaong', 'Notsé', 'Vogan']

/* ── Produits populaires ──────────────────────────── */
const POPULAR_PRODUCTS = [
  { name: 'Riz 25kg',     emoji: '🌾' },
  { name: 'Huile 5L',     emoji: '🫙' },
  { name: 'Sucre 1kg',    emoji: '🍬' },
  { name: 'Lait Gloria',  emoji: '🥛' },
  { name: 'Ciment 50kg',  emoji: '🪨' },
  { name: 'Farine 25kg',  emoji: '🌾' },
  { name: 'Savon',        emoji: '🧼' },
  { name: 'Tomate boîte', emoji: '🍅' },
]

const AddPriceForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    productName: '',
    price: '',
    storeName: '',
    storeCity: '',
  })
  const [imageFile, setImageFile]           = useState(null)
  const [error, setError]                   = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const setField = (field) => (val) =>
    setForm(prev => ({ ...prev, [field]: val }))

  const handleStoreChange = ({ name, city }) => {
    setForm(prev => ({ ...prev, storeName: name, storeCity: city || prev.storeCity }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.productName.trim()) { setError('Entrez le nom du produit.'); return }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Entrez un prix valide en FCFA.'); return }
    if (!form.storeName.trim()) { setError('Entrez le nom du magasin.'); return }
    if (!form.storeCity.trim()) { setError('Sélectionnez la ville.'); return }

    let imageUrl = null
    if (imageFile) {
      try {
        setUploadingImage(true)
        imageUrl = await productService.uploadProductImage(imageFile)
      } catch {
        // Upload échoué silencieusement — continue sans image
      } finally {
        setUploadingImage(false)
      }
    }

    onSubmit({
      productName: form.productName.trim(),
      price: form.price,
      storeName: form.storeName.trim(),
      city: form.storeCity.trim(),
      imageUrl,
    })
  }

  const busy = isLoading || uploadingImage

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Produit */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nom du produit <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={form.productName}
            onChange={(e) => setField('productName')(e.target.value)}
            placeholder="Ex : Riz 25kg, Huile Dinor 5L, iPhone 15…"
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        {/* Raccourcis produits populaires */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {POPULAR_PRODUCTS.map(({ name, emoji }) => (
            <button
              key={name}
              type="button"
              onClick={() => setField('productName')(name)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                form.productName === name
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {emoji} {name}
            </button>
          ))}
        </div>
      </div>

      {/* Image produit */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Photo du produit
          <span className="ml-2 text-xs font-normal text-slate-400">(optionnel)</span>
        </label>
        <ProductImageUpload onFile={setImageFile} />
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Prix <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setField('price')(e.target.value)}
            placeholder="Ex : 13 500"
            min="1"
            step="1"
            className="w-full pl-10 pr-20 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">FCFA</span>
        </div>
      </div>

      {/* Magasin */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Magasin <span className="text-red-400">*</span>
        </label>
        <StoreAutocomplete
          value={form.storeName}
          onChange={handleStoreChange}
          placeholder="Ex : Orca Dépôt, Grand Marché…"
        />
        <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
          <FiInfo className="w-3 h-3" />
          Choisissez dans la liste ou tapez un nouveau magasin
        </p>
      </div>

      {/* Ville */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Ville <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <select
            value={form.storeCity}
            onChange={(e) => setField('storeCity')(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Sélectionner une ville</option>
            {TOGO_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Erreur */}
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
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
        whileTap={{ scale: 0.98 }}
      >
        {busy ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            {uploadingImage ? 'Upload de la photo…' : 'Enregistrement…'}
          </>
        ) : (
          <>
            <FiCheckCircle className="w-4 h-4" />
            Publier ce prix
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  )
}

export default AddPriceForm
