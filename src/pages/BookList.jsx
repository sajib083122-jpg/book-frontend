import React, { useState } from 'react'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../hooks/useBooks'
import { Toaster } from 'react-hot-toast'
import '../App.css'

function BookList() {
  const [formData, setFormData] = useState({
    book_name: '',
    price: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)

  // ✅ React Query Hooks
  const { data: books, isLoading, error } = useBooks()
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()

  // ➕ বই যোগ/আপডেট
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editingId) {
      // ✏️ আপডেট
      await updateBook.mutateAsync({
        id: editingId,
        data: formData
      })
      setEditingId(null)
    } else {
      // ➕ নতুন যোগ
      await createBook.mutateAsync(formData)
    }
    
    setFormData({ book_name: '', price: '', description: '' })
  }

  // ✏️ এডিট
  const handleEdit = (book) => {
    setFormData({
      book_name: book.book_name,
      price: book.price,
      description: book.description
    })
    setEditingId(book.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 🗑️ ডিলিট
  const handleDelete = (id) => {
    if (window.confirm('আপনি কি এই বই ডিলিট করতে চান?')) {
      deleteBook.mutate(id)
    }
  }

  // 📝 ইনপুট পরিবর্তন
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ❌ এডিট ক্যানসেল
  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ book_name: '', price: '', description: '' })
  }

  // ⏳ লোডিং
  if (isLoading) {
    return <div className="loading">⏳ বই লোড হচ্ছে...</div>
  }

  // ❌ এরর
  if (error) {
    return <div className="error">❌ {error.message}</div>
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      <h1>📚 আমার বইয়ের লাইব্রেরি</h1>
      
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
            <button 
              type="submit" 
              className="btn-submit"
              disabled={createBook.isPending || updateBook.isPending}
            >
              {createBook.isPending || updateBook.isPending 
                ? '⏳ লোড হচ্ছে...' 
                : editingId ? 'আপডেট করুন' : 'যোগ করুন'
              }
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
        <h2>📖 বইয়ের তালিকা ({books?.length || 0})</h2>
        
        {books?.length === 0 ? (
          <div className="empty">😢 কোনো বই নেই</div>
        ) : (
          <div className="books-grid">
            {books?.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.book_name}</h3>
                <p className="price">💰 ৳{book.price}</p>
                <p className="description">{book.description}</p>
                <div className="card-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(book)}
                    disabled={deleteBook.isPending}
                  >
                    ✏️ এডিট
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(book.id)}
                    disabled={deleteBook.isPending}
                  >
                    {deleteBook.isPending ? '⏳' : '🗑️ ডিলিট'}
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