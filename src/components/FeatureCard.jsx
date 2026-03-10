import React from 'react'
import { motion } from 'framer-motion'

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      }}
    >
      {/* Icône animée */}
      <motion.div
        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center leading-relaxed">
        {description}
      </p>

      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl" />
      </div>
    </motion.div>
  )
}

export default FeatureCard
