import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_URL = 'http://localhost:8000/book_list/'
const API_DETAIL_URL = (id) => `http://localhost:8000/book/${id}/`

// Axios Interceptor
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

// 📚 সব বই fetch (Pagination সহ)
const fetchBooks = async (page = 1) => {
  const response = await axios.get(`${API_URL}?page=${page}`)
  return {
    books: response.data.results || [],
    count: response.data.count || 0,
    next: response.data.next,
    previous: response.data.previous,
    currentPage: page,
    totalPages: Math.ceil((response.data.count || 0) / 5) // 5 = page_size
  }
}

// ➕ নতুন বই যোগ
const createBook = async (bookData) => {
  const response = await axios.post(API_URL, bookData)
  return response.data
}

// ✏️ বই আপডেট
const updateBook = async ({ id, data }) => {
  const response = await axios.put(API_DETAIL_URL(id), data)
  return response.data
}

// 🗑️ বই ডিলিট
const deleteBook = async (id) => {
  await axios.delete(API_DETAIL_URL(id))
  return id
}

// 🔥 Custom Hook: সব বই (Pagination সহ)
export const useBooks = (page = 1) => {
  return useQuery({
    queryKey: ['books', page],
    queryFn: () => fetchBooks(page),
    keepPreviousData: true, // ✅ পেজ চেঞ্জের সময় আগের ডেটা রাখে
  })
}

// 🔥 Custom Hook: নতুন বই যোগ
export const useCreateBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      toast.success('✅ বই সফলভাবে যোগ হয়েছে!')
    },
    onError: (error) => {
      toast.error('❌ বই যোগ করতে সমস্যা হয়েছে')
      console.error(error)
    }
  })
}

// 🔥 Custom Hook: বই আপডেট
export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      toast.success('✅ বই সফলভাবে আপডেট হয়েছে!')
    },
    onError: (error) => {
      toast.error('❌ বই আপডেট করতে সমস্যা হয়েছে')
      console.error(error)
    }
  })
}

// 🔥 Custom Hook: বই ডিলিট
export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      toast.success('✅ বই সফলভাবে ডিলিট হয়েছে!')
    },
    onError: (error) => {
      toast.error('❌ বই ডিলিট করতে সমস্যা হয়েছে')
      console.error(error)
    }
  })
}