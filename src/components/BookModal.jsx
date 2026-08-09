import React, { useEffect } from 'react'
import './BookModal.css'

function BookModal({ book, isOpen, onClose }) {
  // ✅ ESC কী প্রেস করলে বন্ধ হবে
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // স্ক্রল বন্ধ
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen || !book) return null

  // ✅ ছবির URL
  const getImageUrl = () => {
    return book.cover_image_url || book.cover_image || null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* ❌ Close Button */}
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-body">
          {/* 📸 Cover Image */}
          <div className="modal-image">
            {getImageUrl() ? (
              <img src={getImageUrl()} alt={book.book_name} />
            ) : (
              <div className="modal-image-placeholder">📚</div>
            )}
          </div>
          
          {/* 📝 Book Details */}
          <div className="modal-details">
            <h2>{book.book_name}</h2>
            
            <div className="modal-price">
              💰 ৳{book.price}
            </div>
            
            <div className="modal-description">
              <h3>বইয়ের বিবরণ</h3>
              <p>{book.description || 'কোনো বিবরণ নেই'}</p>
            </div>
            
            <div className="modal-meta">
              <div className="meta-item">
                <span className="meta-label">📅 যোগের তারিখ</span>
                <span className="meta-value">
                  {book.created_at ? new Date(book.created_at).toLocaleDateString('bn-BD') : 'N/A'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">🆔 বইয়ের আইডি</span>
                <span className="meta-value">#{book.id}</span>
              </div>
            </div>
            
            <button className="modal-close-btn" onClick={onClose}>
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookModal