import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../hooks/useBooks'
import { bookSchema } from '../schemas/bookSchema'
import { Toaster } from 'react-hot-toast'
import '../App.css'

function BookList() {
  const [editingId, setEditingId] = useState(null)

  // ✅ React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      book_name: '',
      price: '',
      description: ''
    }
  })

  // ✅ React Query Hooks
  const { data: books, isLoading, error } = useBooks()
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()

  // ➕ বই যোগ/আপডেট
  const onSubmit = async (data) => {
    if (editingId) {
      // ✏️ আপডেট
      await updateBook.mutateAsync({
        id: editingId,
        data: data
      })
      setEditingId(null)
    } else {
      // ➕ নতুন যোগ
      await createBook.mutateAsync(data)
    }
    
    reset() // ফর্ম রিসেট করুন
  }

  // ✏️ এডিট (ফর্মে ডেটা সেট করুন)
  const handleEdit = (book) => {
    reset({
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

  // ❌ এডিট ক্যানসেল
  const cancelEdit = () => {
    setEditingId(null)
    reset()
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>বইয়ের নাম</label>
            <input
              type="text"
              {...register('book_name')}
              placeholder="বইয়ের নাম লিখুন"
              className={errors.book_name ? 'error-input' : ''}
            />
            {errors.book_name && (
              <p className="error-text">{errors.book_name.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>মূল্য (৳)</label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="মূল্য লিখুন"
              className={errors.price ? 'error-input' : ''}
            />
            {errors.price && (
              <p className="error-text">{errors.price.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label>বর্ণনা</label>
            <textarea
              {...register('description')}
              placeholder="বইয়ের বর্ণনা লিখুন"
              rows="3"
              className={errors.description ? 'error-input' : ''}
            />
            {errors.description && (
              <p className="error-text">{errors.description.message}</p>
            )}
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting 
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