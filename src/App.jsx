import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ModernNavbar from './components/ModernNavbar'
import ModernHome from './pages/ModernHome'
import ProductPage from './pages/ProductPage'
import AddPrice from './pages/AddPrice'
import ModernLogin from './pages/ModernLogin'
import ModernRegister from './pages/ModernRegister'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/MapPage'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import MarketPage from './pages/MarketPage'
import AnimatedBackground from './components/AnimatedBackground'
import DebugAuth from './components/DebugAuth'

// Création du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

// Import du hook useAuth ici pour éviter les problèmes d'import circulaire
import { useAuth } from './hooks/useAuth'

function App() {
  // Ajouter une route de debug pour le développement
  const isDev = import.meta.env.DEV

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AnimatedBackground />
            <ModernNavbar />
            <Routes>
              <Route path="/" element={<ModernHome />} />
              <Route path="/search" element={<ModernHome />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/login" element={<ModernLogin />} />
              <Route path="/register" element={<ModernRegister />} />
              {isDev && <Route path="/debug-auth" element={<DebugAuth />} />}
              <Route 
                path="/add-price" 
                element={
                  <ProtectedRoute>
                    <AddPrice />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/map" element={<MapPage />} />
              <Route path="/marche" element={<MarketPage />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App