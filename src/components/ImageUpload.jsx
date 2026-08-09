import React, { useState, useRef } from 'react'

function ImageUpload({ value, onChange, error }) {
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

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
      
      {value && typeof value === 'string' && !preview && (
        <div className="existing-image">
          <p>বর্তমান ছবি:</p>
          <img src={value} alt="Current" />
        </div>
      )}
    </div>
  )
}

export default ImageUpload