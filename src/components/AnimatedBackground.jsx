import React from 'react'

// Positions prédéfinies pour éviter Math.random
const PARTICLE_POSITIONS = [
  { left: 10, top: 15, duration: 4, delay: 0 },
  { left: 85, top: 25, duration: 6, delay: 1 },
  { left: 30, top: 70, duration: 5, delay: 2 },
  { left: 60, top: 45, duration: 7, delay: 0.5 },
  { left: 45, top: 85, duration: 4.5, delay: 1.5 },
  { left: 75, top: 60, duration: 5.5, delay: 2.5 }
]

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient animé */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          style={{
            animation: 'float 15s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Particules flottantes */}
      {PARTICLE_POSITIONS.map((particle, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-100px); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default AnimatedBackground
