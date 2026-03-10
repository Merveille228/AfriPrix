import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiHeart, FiUsers, FiTrendingDown, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { usePrices } from '../hooks/usePrices'
import AddPriceForm from '../components/AddPriceForm'

const WHY_CONTRIBUTE = [
  { icon: FiHeart,        text: 'Vous aidez vos voisins à économiser' },
  { icon: FiUsers,        text: 'Vous renforcez la communauté AfriPrix' },
  { icon: FiTrendingDown, text: 'Plus de contributions = meilleurs prix' },
]

const AddPrice = () => {
  const { user, isAuthenticated } = useAuth()
  const { addPriceAsync, isAddingPrice } = usePrices()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (formData) => {
    if (!isAuthenticated) { navigate('/login'); return }
    setSubmitError('')
    try {
      await addPriceAsync({ ...formData, userId: user.id })
      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setSubmitError(err?.message || 'Erreur lors de l\'ajout. Vérifiez votre connexion et réessayez.')
    }
  }

  /* -- Non connecté ----------------------------------------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-sm w-full text-center"
        >
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiHeart className="w-7 h-7 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connexion requise</h2>
          <p className="text-slate-500 text-sm mb-6">
            Créez un compte gratuit pour partager des prix et aider votre communauté.
          </p>
          <div className="flex gap-3">
            <Link to="/login"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors text-center">
              Se connecter
            </Link>
            <Link to="/register"
              className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors text-center">
              S'inscrire
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  /* -- Succès --------------------------------------------------------- */
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-sm w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <FiCheck className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">Prix ajouté !</h2>
          <p className="text-slate-500 text-sm">Merci pour votre contribution. Vous aidez la communauté à économiser.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Retour */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <FiArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* -- Colonne gauche - formulaire ------------------- */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Ajouter un prix</h1>
              <p className="text-slate-500 text-sm mb-8">
                Partagez un prix et aidez d'autres personnes à mieux acheter au Togo.
              </p>
              {submitError && (
                <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}
              <AddPriceForm onSubmit={handleSubmit} isLoading={isAddingPrice} />
            </motion.div>
          </div>

          {/* ── Colonne droite – pourquoi contribuer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:w-72 shrink-0 space-y-4"
          >
            {/* Bloc "pourquoi contribuer" */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Pourquoi partager ?</h3>
              <div className="space-y-3">
                {WHY_CONTRIBUTE.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-indigo-100 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseil */}
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Bon à savoir</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Soyez précis sur le nom du produit (ex : <strong>Riz 25kg</strong> plutôt que <em>riz</em>) pour que d'autres utilisateurs retrouvent facilement votre contribution.
              </p>
            </div>

            {/* Stats contributeur */}
            {user && (
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                <p className="text-xs text-slate-400 mb-1">Contribuer en tant que</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AddPrice
