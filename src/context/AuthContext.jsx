import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session en cours et rafraîchir le JWT pour avoir app_metadata à jour
    const checkUser = async () => {
      try {
        // refreshSession renouvelle le JWT et y inclut le dernier app_metadata
        const refreshed = await authService.refreshSession()
        if (refreshed?.session?.user) {
          setUser(refreshed.session.user)
        } else {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      const data = await authService.signUp(email, password, metadata)
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const data = await authService.signIn(email, password)
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const data = await authService.updateUser(updates)
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signInWithOAuth = async (provider) => {
    try {
      await authService.signInWithOAuth(provider)
      return { success: true }
    } catch (error) {
      return { success: false, error: error }
    }
  }

  const isAdmin = !!(user?.app_metadata?.role === 'admin')

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    signInWithOAuth,
    isAuthenticated: !!user,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
