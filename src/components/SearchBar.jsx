import React from 'react'

function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  filterPrice, 
  setFilterPrice,
  sortBy,
  setSortBy 
}) {
  return (
    <div className="search-container">
      {/* 🔍 Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 বই খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-btn"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* 🏷️ Filter & Sort */}
      <div className="filter-sort-container">
        <div className="filter-group">
          <label>মূল্য ফিল্টার:</label>
          <select 
            value={filterPrice} 
            onChange={(e) => setFilterPrice(e.target.value)}
            className="filter-select"
          >
            <option value="all">সব</option>
            <option value="low">৳ ০-৫০০</option>
            <option value="medium">৳ ৫০০-২০০০</option>
            <option value="high">৳ ২০০০+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>সাজান:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">নাম (A-Z)</option>
            <option value="name_desc">নাম (Z-A)</option>
            <option value="price_low">মূল্য (কম)</option>
            <option value="price_high">মূল্য (বেশি)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchBar