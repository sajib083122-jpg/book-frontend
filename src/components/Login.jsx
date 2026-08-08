import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.username, formData.password)
    
    if (result.success) {
      navigate('/books')
    } else {
      setError(result.error || '❌ ইউজারনেম বা পাসওয়ার্ড ভুল')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 লগইন করুন</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ইউজারনেম</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="আপনার ইউজারনেম"
            />
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="আপনার পাসওয়ার্ড"
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ লোড হচ্ছে...' : '🔓 লগইন করুন'}
          </button>
        </form>
        
        <p className="auth-footer">
          অ্যাকাউন্ট নেই? <Link to="/register">রেজিস্টার করুন</Link>
        </p>
      </div>
    </div>
  )
}

export default Login