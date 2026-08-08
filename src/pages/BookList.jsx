import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

function BookList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    book_name: '',
    price: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)

  const API_URL = 'http://localhost:8000/book_list/'
  const API_DETAIL_URL = (id) => `http://localhost:8000/book/${id}/`

  // ✅ Axios Interceptor - Token যোগ করুন
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      setBooks(response.data)
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('❌ লগইন করুন')
      } else {
        setError('বই লোড করতে সমস্যা হয়েছে')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(API_DETAIL_URL(editingId), formData)
        setEditingId(null)
      } else {
        await axios.post(API_URL, formData)
      }
      setFormData({ book_name: '', price: '', description: '' })
      fetchBooks()
    } catch (err) {
      setError('ডেটা সেভ করতে সমস্যা হয়েছে')
    }
  }

  const handleEdit = (book) => {
    setFormData({
      book_name: book.book_name,
      price: book.price,
      description: book.description
    })
    setEditingId(book.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('আপনি কি এই বই ডিলিট করতে চান?')) {
      try {
        await axios.delete(API_DETAIL_URL(id))
        fetchBooks()
      } catch (err) {
        setError('ডিলিট করতে সমস্যা হয়েছে')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ book_name: '', price: '', description: '' })
  }

  return (
    <div className="app-container">
      <h1>📚 আমার বইয়ের লাইব্রেরি</h1>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-container">
        <h2>{editingId ? '✏️ বই আপডেট করুন' : '➕ নতুন বই যোগ করুন'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>বইয়ের নাম</label>
            <input
              type="text"
              name="book_name"
              value={formData.book_name}
              onChange={handleChange}
              required
              placeholder="বইয়ের নাম লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>মূল্য (৳)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="মূল্য লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>বর্ণনা</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="বইয়ের বর্ণনা লিখুন"
              rows="3"
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn-submit">
              {editingId ? 'আপডেট করুন' : 'যোগ করুন'}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={cancelEdit}>
                বাতিল করুন
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="book-list">
        <h2>📖 বইয়ের তালিকা ({books.length})</h2>
        
        {loading ? (
          <div className="loading">⏳ লোড হচ্ছে...</div>
        ) : books.length === 0 ? (
          <div className="empty">😢 কোনো বই নেই</div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.book_name}</h3>
                <p className="price">💰 ৳{book.price}</p>
                <p className="description">{book.description}</p>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(book)}>
                    ✏️ এডিট
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(book.id)}>
                    🗑️ ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookList