import React from 'react'
import { FiSearch, FiTrendingUp, FiShoppingBag } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'

// Positions prédéfinies pour éviter Math.random
const PARTICLE_POSITIONS = [
  { left: 5, top: 10, duration: 3, delay: 0 },
  { left: 15, top: 25, duration: 4, delay: 0.5 },
  { left: 25, top: 15, duration: 3.5, delay: 1 },
  { left: 35, top: 30, duration: 4.5, delay: 1.5 },
  { left: 45, top: 20, duration: 3.2, delay: 2 },
  { left: 55, top: 35, duration: 4.8, delay: 0.3 },
  { left: 65, top: 25, duration: 3.7, delay: 0.8 },
  { left: 75, top: 40, duration: 4.2, delay: 1.3 },
  { left: 85, top: 30, duration: 3.9, delay: 1.8 },
  { left: 95, top: 45, duration: 4.6, delay: 2.3 },
  { left: 10, top: 50, duration: 3.4, delay: 0.2 },
  { left: 20, top: 60, duration: 4.3, delay: 0.7 },
  { left: 30, top: 55, duration: 3.8, delay: 1.2 },
  { left: 40, top: 65, duration: 4.7, delay: 1.7 },
  { left: 50, top: 70, duration: 3.6, delay: 2.2 },
  { left: 60, top: 75, duration: 4.4, delay: 0.4 },
  { left: 70, top: 80, duration: 3.3, delay: 0.9 },
  { left: 80, top: 85, duration: 4.1, delay: 1.4 },
  { left: 90, top: 90, duration: 3.5, delay: 1.9 },
  { left: 100, top: 95, duration: 4.9, delay: 2.4 }
]

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Particules décoratives */}
      {PARTICLE_POSITIONS.map((particle, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
          <HiOutlineSparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-white/80 text-sm font-medium">La révolution des prix locaux</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Comparez les prix
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
            avant d'acheter
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
          Trouvez les meilleurs prix dans les magasins près de chez vous. 
          Économisez du temps et de l'argent à chaque achat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            onClick={() => window.location.href = '#search'}
          >
            <FiSearch className="w-5 h-5" />
            Commencer à comparer
          </button>
          
          <button
            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            onClick={() => window.location.href = '#products'}
          >
            <FiShoppingBag className="w-5 h-5" />
            Voir les produits
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: FiTrendingUp, label: "Économies", value: "Jusqu'à 40%" },
            { icon: FiShoppingBag, label: "Produits", value: "1000+" },
            { icon: FiSearch, label: "Magasins", value: "50+" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 hover:bg-white/15 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-yellow-300 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{ animation: 'bounce 2s infinite' }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-100px); opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
