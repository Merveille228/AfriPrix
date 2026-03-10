import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiArrowRight, FiMapPin, FiUsers, FiTrendingDown, FiShield } from 'react-icons/fi'

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const FEATURES = [
  {
    icon: <FiTrendingDown className="w-6 h-6 text-emerald-600" />,
    bg: 'bg-emerald-50',
    title: 'Comparer les prix',
    desc: 'Consultez les prix réels soumis par la communauté dans les marchés et supermarchés du Togo.',
  },
  {
    icon: <FiUsers className="w-6 h-6 text-indigo-600" />,
    bg: 'bg-indigo-50',
    title: 'Contribuer',
    desc: 'Ajoutez les prix que vous observez en magasin et aidez toute la communauté à mieux acheter.',
  },
  {
    icon: <FiMapPin className="w-6 h-6 text-amber-600" />,
    bg: 'bg-amber-50',
    title: 'Localiser',
    desc: 'Visualisez les points de vente sur la carte interactive et trouvez le magasin le plus proche.',
  },
  {
    icon: <FiShield className="w-6 h-6 text-rose-600" />,
    bg: 'bg-rose-50',
    title: 'Fiabilité',
    desc: 'Les prix sont vérifiables et signalables par la communauté pour garantir des informations à jour.',
  },
]

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-full px-4 py-2 mb-6 text-sm font-medium border border-indigo-100">
              À propos d'AfriPrix
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
              La comparaison de prix<br />
              <span className="text-indigo-600">au service du Togo</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              AfriPrix est une plateforme participative qui permet à chacun de consulter et de partager
              les prix des produits du quotidien dans les marchés et supermarchés du Togo.
              L'objectif est simple&nbsp;: aider les consommateurs à mieux acheter et à économiser.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Pourquoi AfriPrix ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-slate-900 mb-3 text-center">
            Pourquoi AfriPrix ?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
            Dans les marchés africains, les prix varient considérablement d'un vendeur à l'autre.
            AfriPrix donne le pouvoir à la communauté de rendre ces informations accessibles à tous.
          </motion.p>
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4 items-start"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}
              >
                <div className={`${f.bg} p-3 rounded-xl shrink-0`}>{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Le dev ────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-10"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {/* Avatar */}
            <motion.div variants={fadeUp} className="shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-4xl font-extrabold text-white">M</span>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3 border border-indigo-100">
                Créateur & Développeur
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Merveille <span className="text-indigo-600">· AKIM</span>
              </h2>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed max-w-lg">
                Étudiant en informatique passionné par le développement front-end. J'ai créé AfriPrix
                pour répondre à un besoin réel au Togo&nbsp;: rendre l'information sur les prix accessible,
                transparente et utile pour tous.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <a
                  href="https://github.com/Merveille228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <FiGithub className="w-4 h-4" />
                  GitHub
                </a>
                <Link
                  to="/marche"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Explorer AfriPrix
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-slate-900 mb-3">
            Rejoins la communauté
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 mb-7 max-w-md mx-auto">
            Crée un compte gratuitement et commence à contribuer. Chaque prix ajouté aide des milliers de personnes.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Créer un compte
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Voir les prix
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}

export default About
