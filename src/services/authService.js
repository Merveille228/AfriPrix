import { supabase } from './supabaseClient'

export const authService = {
  // Inscription
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })

    if (error) throw error
    return data
  },

  // Connexion
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Rafraîchir la session (pour récupérer app_metadata mis à jour)
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return data
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Écouter les changements d'authentification
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Réinitialiser le mot de passe
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  // Mettre à jour le profil utilisateur (métadonnées et/ou mot de passe)
  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates)
    if (error) throw error
    return data
  },

  // Connexion OAuth (Google, Facebook, Apple…)
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
    return data
  },
}
