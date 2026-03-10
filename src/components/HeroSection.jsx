import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiTrendingUp, FiShoppingBag, FiMapPin } from 'react-icons/fi'

const stats = [
  { icon: FiTrendingUp,   value: "40%",   label: "d'économies" },
  { icon: FiShoppingBag,  value: "1 000+",label: "produits" },
  { icon: FiMapPin,       value: "50+",   label: "magasins" },
]

const HeroSection = () => (
  <section className="relative bg-white overflow-hidden">
    {/* subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}
    />

    <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-20">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          Comparer les prix au Sénégal
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Comparez les prix<br />
          <span className="text-indigo-600">avant d'acheter</span>
        </motion.h1>

        <motion.p
          className="text-lg text-slate-500 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trouvez les meilleurs prix dans les magasins près de chez vous et économisez à chaque achat.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-md shadow-indigo-200 text-sm"
          >
            <FiSearch className="w-4 h-4" />
            Commencer à comparer
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-medium px-6 py-3.5 rounded-xl transition-colors text-sm bg-white"
          >
            <FiMapPin className="w-4 h-4" />
            Voir la carte
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
)

export default HeroSection
