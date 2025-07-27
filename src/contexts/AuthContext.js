import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import toast from 'react-hot-toast'

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
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN') {
          toast.success('Connexion réussie ! 🎉')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Déconnexion réussie')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Connexion par email
  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      return { data }
    } catch (error) {
      toast.error('Erreur de connexion')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Inscription par email
  const signUpWithEmail = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      toast.success('Vérifiez votre email pour confirmer votre compte')
      return { data }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Lien magique
  const signInWithMagicLink = async (email) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      toast.success('Lien magique envoyé ! Vérifiez votre email 📧')
      return { data }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du lien')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
        return { error }
      }
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Réinitialiser le mot de passe
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      })
      
      if (error) {
        toast.error(error.message)
        return { error }
      }
      
      toast.success('Email de réinitialisation envoyé')
      return { data }
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation')
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}