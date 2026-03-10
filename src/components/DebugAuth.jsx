import React, { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { FiEye, FiEyeOff, FiMail, FiLock, FiCheck, FiX } from 'react-icons/fi'

const DebugAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const testSignUp = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5173'
        }
      })
      
      if (error) {
        setError(error.message)
      } else {
        setResult({ type: 'success', message: 'Inscription réussie!', data })
      }
    } catch (err) {
      setError(err.message)
    }
    
    setLoading(false)
  }

  const testSignIn = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setError(error.message)
      } else {
        setResult({ type: 'success', message: 'Connexion réussie!', data })
      }
    } catch (err) {
      setError(err.message)
    }
    
    setLoading(false)
  }

  const checkCurrentUser = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setError(error.message)
      } else {
        setResult({ type: 'info', message: 'Utilisateur actuel:', data: user })
      }
    } catch (err) {
      setError(err.message)
    }
    
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
      } else {
        setResult({ type: 'success', message: 'Déconnexion réussie!' })
      }
    } catch (err) {
      setError(err.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Debug Auth Supabase</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Formulaire de test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="test@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={testSignUp}
              disabled={loading || !email || !password}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Tester Inscription'}
            </button>
            
            <button
              onClick={testSignIn}
              disabled={loading || !email || !password}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Tester Connexion'}
            </button>
            
            <button
              onClick={checkCurrentUser}
              disabled={loading}
              className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Vérifier User'}
            </button>
            
            <button
              onClick={signOut}
              disabled={loading}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Déconnexion'}
            </button>
          </div>
        </div>
        
        {/* Résultats */}
        {result && (
          <div className={`rounded-lg p-4 mb-6 ${
            result.type === 'success' ? 'bg-green-100 border-green-500' : 
            result.type === 'error' ? 'bg-red-100 border-red-500' : 
            'bg-blue-100 border-blue-500'
          } border`}>
            <div className="flex items-start gap-2">
              {result.type === 'success' ? <FiCheck className="text-green-600 mt-1" /> : 
               result.type === 'error' ? <FiX className="text-red-600 mt-1" /> : 
               <FiEye className="text-blue-600 mt-1" />}
              <div>
                <div className="font-semibold">{result.message}</div>
                {result.data && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Erreurs */}
        {error && (
          <div className="bg-red-100 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <FiX className="text-red-600 mt-1" />
              <div>
                <div className="font-semibold text-red-800">Erreur</div>
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions de débogage :</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Créez un compte avec le formulaire ci-dessus</li>
            <li>Vérifiez votre email (y compris spams) pour la confirmation</li>
            <li>Essayez de vous connecter</li>
            <li>Si ça ne marche pas, allez dans Supabase → Authentication → Users</li>
            <li>Confirmez manuellement l'utilisateur si nécessaire</li>
            <li>Désactivez "Enable email confirmations" pour les tests</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default DebugAuth
