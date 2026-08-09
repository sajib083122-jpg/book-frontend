import React, { useState, useRef, useEffect } from 'react'

function ImageUpload({ value, onChange, error }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  // ✅ value প্রপ পরিবর্তন ডিটেক্ট করুন
  useEffect(() => {
    console.log('ImageUpload - value changed:', value) // Debugging
    
    // ✅ value null বা undefined হলে ক্লিয়ার করুন
    if (value === null || value === undefined || value === '') {
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }
    
    // ✅ value যদি string হয় (ইউআরএল) তাহলে প্রিভিউ দেখান
    if (typeof value === 'string' && value) {
      setPreview(value)
      return
    }
    
    // ✅ value যদি File object হয় তাহলে প্রিভিউ দেখান
    if (value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(value)
    }
  }, [value])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ✅ File validation
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        alert('শুধু JPEG, PNG, GIF বা WEBP ফাইল আপলোড করুন')
        return
      }

      if (file.size > maxSize) {
        alert('ছবির সাইজ ৫MB এর কম হতে হবে')
        return
      }

      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload-container">
      <div className="image-upload-box" onClick={() => fileInputRef.current?.click()}>
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button 
              type="button"
              className="remove-image-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <div className="upload-icon">📷</div>
            <p>ছবি আপলোড করুন</p>
            <small>JPEG, PNG, GIF (Max 5MB)</small>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export default ImageUpload