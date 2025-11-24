"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api-client"

interface User {
  id: number
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token")
    if (token) {
      apiClient.setToken(token)
      // Fetch current user data
      apiClient.getCurrentUser()
        .then(userData => {
          setUser(userData)
          setIsLoading(false)
        })
        .catch(error => {
          console.error("Failed to fetch user data:", error)
          // Token might be expired
          apiClient.logout()
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await apiClient.login(email, password)
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userData = await apiClient.signup(email, password, name)
      // Auto-login after signup
      await apiClient.login(email, password)
      const fullUserData = await apiClient.getCurrentUser()
      setUser(fullUserData)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
