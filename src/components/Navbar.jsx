import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const { user, signOut, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) {
      navigate('/')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AfriPrix</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Accueil
            </Link>
            
            <Link
              to="/add-price"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/add-price') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Ajouter un prix
            </Link>

            <Link
              to="/map"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/map') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Carte
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
