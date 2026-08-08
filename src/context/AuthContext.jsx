import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

// 1️⃣ Action Types
const ActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SET_USER: 'SET_USER'
}

// 2️⃣ Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// 3️⃣ Reducer Function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOADING:
      return { ...state, loading: true, error: null }
    
    case ActionTypes.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      }
    
    case ActionTypes.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        isAuthenticated: false,
        user: null
      }
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    
    default:
      return state
  }
}

// 4️⃣ Create Context
const AuthContext = createContext()

// 5️⃣ AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Validate token with backend
      const validateToken = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/user/', {
            headers: { Authorization: `Bearer ${token}` }
          })
          dispatch({
            type: ActionTypes.SET_USER,
            payload: response.data
          })
        } catch (error) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          dispatch({ type: ActionTypes.LOGOUT })
        }
      }
      validateToken()
    }
  }, [])

  // Login Action
  const login = async (username, password) => {
    dispatch({ type: ActionTypes.LOADING })
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      })
      
      const { access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      // Get user info
      const userResponse = await axios.get('http://localhost:8000/api/user/', {
        headers: { Authorization: `Bearer ${access}` }
      })
      
      dispatch({
        type: ActionTypes.LOGIN,
        payload: { user: userResponse.data }
      })
      
      return { success: true }
    } catch (error) {
      dispatch({
        type: ActionTypes.ERROR,
        payload: error.response?.data?.detail || 'Login failed'
      })
      return { success: false, error: error.response?.data?.detail }
    }
  }

  // Logout Action
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    dispatch({ type: ActionTypes.LOGOUT })
  }

  // Register Action
  const register = async (userData) => {
    dispatch({ type: ActionTypes.LOADING })
    try {
      await axios.post('http://localhost:8000/api/register/', userData)
      return { success: true }
    } catch (error) {
      dispatch({
        type: ActionTypes.ERROR,
        payload: error.response?.data?.error || 'Registration failed'
      })
      return { success: false, error: error.response?.data?.error }
    }
  }

  const value = {
    ...state,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 6️⃣ Custom Hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { ActionTypes }