import React from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiUsers, FiShoppingBag, FiTarget, FiZap, FiAward } from 'react-icons/fi'
import { HiOutlineCurrencyDollar, HiOutlineLightBulb } from 'react-icons/hi'

const MonetizationSection = () => {
  const revenueStreams = [
    {
      icon: FiTarget,
      title: "Publicité Ciblée",
      description: "Affichez des annonces pertinentes pour les utilisateurs selon leurs recherches",
      potential: "€2-5€ CPM",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiShoppingBag,
      title: "Partenariats Magasins",
      description: "Les magasins paient pour être en vedette et avoir plus de visibilité",
      potential: "€50-500€/mois",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: HiOutlineCurrencyDollar,
      title: "Commission sur Ventes",
      description: "Gagnez une commission sur chaque vente générée via votre plateforme",
      potential: "5-15% commission",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FiAward,
      title: "Premium Features",
      description: "Abonnements pour des fonctionnalités avancées (alertes prix, analytics)",
      potential: "€5-20€/mois",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: FiUsers,
      title: "API B2B",
      description: "Vendez l'accès aux données de prix à d'autres entreprises",
      potential: "€100-1000€/mois",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: FiZap,
      title: "Lead Generation",
      description: "Vendez des leads qualifiés aux magasins et marques",
      potential: "€1-10€/lead",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const growthMetrics = [
    { metric: "Utilisateurs Actifs", target: "100K+", timeframe: "6 mois" },
    { metric: "Magasins Partenaires", target: "500+", timeframe: "1 an" },
    { metric: "Revenu Mensuel", target: "€10K+", timeframe: "1 an" },
    { metric: "Produits Référencés", target: "50K+", timeframe: "6 mois" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <HiOutlineLightBulb className="w-5 h-5 text-gray-900" />
            <span className="text-gray-900 font-semibold text-sm">Modèle de Monétisation</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comment <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">gagner de l'argent</span> avec AfriPrix
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transformez votre plateforme de comparaison de prix en une machine à revenus durable avec ces stratégies éprouvées
          </p>
        </motion.div>

        {/* Revenue Streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={stream.title}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                backgroundColor: "rgba(255,255,255,0.05)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
            >
              {/* Icône */}
              <motion.div
                className={`w-16 h-16 bg-gradient-to-r ${stream.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stream.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Contenu */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                {stream.title}
              </h3>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {stream.description}
              </p>

              {/* Potentiel */}
              <motion.div
                className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl px-4 py-3 border border-yellow-400/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-yellow-400 font-semibold text-sm">Potentiel de revenu</div>
                <div className="text-white text-lg font-bold">{stream.potential}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Growth Metrics */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Objectifs de Croissance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-4xl font-bold text-yellow-400 mb-2">{metric.target}</div>
                <div className="text-white font-semibold mb-1">{metric.metric}</div>
                <div className="text-gray-400 text-sm">{metric.timeframe}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">Plan d'Action Immédiat</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Lancement Beta", desc: "Testez avec 100 utilisateurs" },
              { step: "2", title: "Partenariats", desc: "Contactez 20 magasins locaux" },
              { step: "3", title: "Monétisation", desc: "Lancez les features premium" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-yellow-400 mb-3">{item.step}</div>
                <div className="text-white font-semibold mb-2">{item.title}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MonetizationSection
