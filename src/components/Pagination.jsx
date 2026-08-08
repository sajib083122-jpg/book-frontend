import React from 'react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 🔢 পেজ নম্বর জেনারেট করুন
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // একসাথে ৫টি পেজ দেখাবে
    
    if (totalPages <= maxVisible) {
      // সব পেজ দেখান
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // প্রথম পেজ
      pages.push(1)
      
      // মাঝের পেজ
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4)
      }
      
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3)
      }
      
      // এলিপসিস যোগ করুন
      if (start > 2) {
        pages.push('...')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // শেষ পেজ
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) {
    return null // ১ পেজ হলে দেখাবেনা
  }

  return (
    <div className="pagination-container">
      {/* ⬅️ Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ⬅️ আগের
      </button>

      {/* 🔢 Page Numbers */}
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`pagination-number ${
              page === currentPage ? 'active' : ''
            } ${typeof page === 'string' ? 'ellipsis' : ''}`}
            disabled={typeof page === 'string'}
          >
            {page}
          </button>
        ))}
      </div>

      {/* ➡️ Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        পরবর্তী ➡️
      </button>
    </div>
  )
}

export default Pagination