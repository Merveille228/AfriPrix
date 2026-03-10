import React from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiBarChart2, FiShoppingBag } from 'react-icons/fi'

const steps = [
  {
    number: '01',
    icon: FiSearch,
    title: 'Rechercher un produit',
    description: "Tapez le nom d'un produit dans la barre de recherche. Notre système trouve immédiatement les prix disponibles autour de vous.",
    color: 'bg-indigo-600',
    light: 'bg-indigo-50',
  },
  {
    number: '02',
    icon: FiBarChart2,
    title: 'Comparer les prix',
    description: 'Visualisez tous les prix disponibles côte à côte, par magasin et par ville. Le meilleur prix est mis en avant automatiquement.',
    color: 'bg-purple-600',
    light: 'bg-purple-50',
  },
  {
    number: '03',
    icon: FiShoppingBag,
    title: 'Acheter au meilleur prix',
    description: "Rendez-vous dans le magasin sélectionné et économisez jusqu'à 40% sur vos achats. C'est simple, rapide et gratuit.",
    color: 'bg-emerald-600',
    light: 'bg-emerald-50',
  },
]

const HowItWorks = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            3 étapes pour économiser
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Simple, rapide et gratuit — trouvez le meilleur prix avant de vous déplacer.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-1/6 right-1/6 h-px bg-slate-200 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative z-10"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-2xl p-7 border border-slate-100 h-full"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06)' }}
                whileHover={{ y: -6, boxShadow: '0 4px 12px rgba(0,0,0,.08), 0 20px 40px rgba(0,0,0,.10)' }}
                transition={{ duration: 0.25 }}
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center shadow-md shrink-0`}>
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 leading-none select-none">{step.number}</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

