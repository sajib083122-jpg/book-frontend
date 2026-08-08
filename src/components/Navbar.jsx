import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          📚 Book Library
        </Link>
        
        <div className="nav-center">
          {isAuthenticated && (
            <span className="user-name">👋 {user?.username}</span>
          )}
        </div>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/books" className="nav-link">📖 বইয়ের তালিকা</Link>
              <button onClick={logout} className="nav-link logout-btn">
                🚪 লগআউট
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">🔐 লগইন</Link>
              <Link to="/register" className="nav-link">📝 রেজিস্টার</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar