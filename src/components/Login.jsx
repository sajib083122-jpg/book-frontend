import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/bookSchema'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    const result = await login(data.username, data.password)
    
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>ইউজারনেম</label>
            <input
              type="text"
              {...register('username')}
              placeholder="আপনার ইউজারনেম"
              className={errors.username ? 'error-input' : ''}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড</label>
            <input
              type="password"
              {...register('password')}
              placeholder="আপনার পাসওয়ার্ড"
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
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