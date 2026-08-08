import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import BookList from './pages/BookList'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// ✅ নতুন Wrapper Component
const AppContent = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/books" /> : <Login />
          } />
          
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/books" /> : <Register />
          } />
          
          <Route path="/books" element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/books" : "/login"} />
          } />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App