import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

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
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('❌ পাসওয়ার্ড মিলছে না')
      setLoading(false)
      return
    }

    const result = await register({
      username: formData.username,
      password: formData.password,
      email: formData.email
    })
    
    if (result.success) {
      setSuccess('✅ রেজিস্টার সফল! এখন লগইন করুন')
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setError(result.error || '❌ রেজিস্টার করতে সমস্যা হয়েছে')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 রেজিস্টার করুন</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ইউজারনাম</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="আপনার ইউজারনাম"
            />
          </div>
          
          <div className="form-group">
            <label>ইমেইল</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="আপনার ইমেইল (ঐচ্ছিক)"
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
              placeholder="পাসওয়ার্ড দিন"
            />
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="আবার পাসওয়ার্ড দিন"
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ লোড হচ্ছে...' : '📝 রেজিস্টার করুন'}
          </button>
        </form>
        
        <p className="auth-footer">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করুন</Link>
        </p>
      </div>
    </div>
  )
}

export default Register