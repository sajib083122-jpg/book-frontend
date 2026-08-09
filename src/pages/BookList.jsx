import React, { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInfiniteBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../hooks/useBooks'
import { bookSchema } from '../schemas/bookSchema'
import { Toaster } from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import SearchBar from '../components/SearchBar'
import ImageUpload from '../components/ImageUpload'
import BookModal from '../components/BookModal'
import '../App.css'

function BookList() {
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPrice, setFilterPrice] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [imageFile, setImageFile] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

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
      description: '',
    }
  })

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteBooks()

  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const allBooks = useMemo(() => {
    return data?.pages?.flatMap((page) => page.books) || []
  }, [data])

  const totalBooks = data?.pages?.[0]?.totalCount || 0

  // ✅ Search, Filter & Sort
  const filteredAndSortedBooks = useMemo(() => {
    if (!allBooks) return []

    let result = [...allBooks]

    if (searchTerm.trim()) {
      result = result.filter(book =>
        book.book_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    }

    if (filterPrice !== 'all') {
      result = result.filter(book => {
        const price = parseFloat(book.price)
        if (filterPrice === 'low') return price >= 0 && price <= 500
        if (filterPrice === 'medium') return price > 500 && price <= 2000
        if (filterPrice === 'high') return price > 2000
        return true
      })
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.book_name.localeCompare(b.book_name))
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.book_name.localeCompare(a.book_name))
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    }

    return result
  }, [allBooks, searchTerm, filterPrice, sortBy])

  // ✅ ফর্ম সাবমিট - সব ফিল্ড ক্লিয়ার হবে
  const onSubmit = async (data) => {
    const formData = {
      book_name: data.book_name,
      price: data.price,
      description: data.description,
      cover_image: imageFile
    }

    try {
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
      
      // ✅ সব ফিল্ড ক্লিয়ার করুন (ইমেজ সহ)
      reset() // ফর্ম রিসেট
      setImageFile(null) // ইমেজ ফিল্ড ক্লিয়ার
      
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // ✏️ এডিট (ফর্মে ডেটা সেট করুন)
  const handleEdit = (book) => {
    reset({
      book_name: book.book_name,
      price: book.price,
      description: book.description
    })
    setImageFile(null) // ইমেজ ফিল্ড ক্লিয়ার
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
    setImageFile(null) // ইমেজ ফিল্ড ক্লিয়ার
    reset() // ফর্ম রিসেট
  }

  // ✅ Book Card Click
  const handleBookClick = (book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  // 📸 ইমেজ ইউআরএল
  const getImageUrl = (book) => {
    return book.cover_image_url || book.cover_image || null
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
      
      {/* 📝 Form */}
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
          
          {/* ✅ Image Upload */}
          <div className="form-group">
            <label>বইয়ের কভার ছবি</label>
            <ImageUpload
              value={imageFile}
              onChange={setImageFile}
              error={errors.cover_image?.message}
            />
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
      
      {/* 🔍 Search & Filter */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      {/* 📖 Result Count */}
      <div className="result-count">
        <p>
          {totalBooks} টি বই 
          {searchTerm && ` | "${searchTerm}" অনুসারে ${filteredAndSortedBooks.length} টি পাওয়া গেছে`}
        </p>
      </div>
      
      {/* 📚 Book List */}
      <div className="book-list">
        {filteredAndSortedBooks.length === 0 ? (
          <div className="empty">
            {searchTerm ? '😢 আপনার খোঁজা বইটি পাওয়া যায়নি' : '😢 কোনো বই নেই'}
          </div>
        ) : (
          <>
            <div className="books-grid">
              {filteredAndSortedBooks.map((book, index) => {
                const imageUrl = getImageUrl(book)
                return (
                  <div 
                    key={book.id || index} 
                    className="book-card"
                    ref={index === filteredAndSortedBooks.length - 1 ? ref : null}
                    onClick={() => handleBookClick(book)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="book-image">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={book.book_name}
                          className="book-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = '<div class="book-cover-placeholder"><span>📚</span></div>'
                          }}
                        />
                      ) : (
                        <div className="book-cover-placeholder">
                          <span>📚</span>
                        </div>
                      )}
                    </div>
                    
                    <h3>{book.book_name}</h3>
                    <p className="price">💰 ৳{book.price}</p>
                    <p className="description">{book.description}</p>
                    
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
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
                )
              })}
            </div>
            
            {/* ⏳ Loading More */}
            {isFetchingNextPage && (
              <div className="loading-more">
                <div className="spinner"></div>
                <p>⏳ আরও বই লোড হচ্ছে...</p>
              </div>
            )}
            
            {/* 🏁 End of List */}
            {!hasNextPage && allBooks.length > 0 && (
              <div className="end-of-list">
                <p>🏁 সব বই দেখানো হয়েছে</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* ✅ Book Detail Modal */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}

export default BookList