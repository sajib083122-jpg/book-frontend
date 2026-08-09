import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
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

// 📚 সব বই fetch
const fetchBooks = async ({ pageParam = 1 }) => {
  const response = await axios.get(`${API_URL}?page=${pageParam}`)
  return {
    books: response.data.results || [],
    nextPage: response.data.next ? pageParam + 1 : undefined,
    totalCount: response.data.count || 0,
  }
}

// ➕ নতুন বই যোগ (FormData সহ)
const createBook = async (bookData) => {
  const formData = new FormData()
  formData.append('book_name', bookData.book_name)
  formData.append('price', bookData.price)
  formData.append('description', bookData.description || '')
  
  // ✅ ছবি থাকলে যোগ করুন
  if (bookData.cover_image && bookData.cover_image instanceof File) {
    formData.append('cover_image', bookData.cover_image)
  }
  
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// ✏️ বই আপডেট (FormData সহ)
const updateBook = async ({ id, data }) => {
  const formData = new FormData()
  formData.append('book_name', data.book_name)
  formData.append('price', data.price)
  formData.append('description', data.description || '')
  
  // ✅ নতুন ছবি থাকলে যোগ করুন
  if (data.cover_image && data.cover_image instanceof File) {
    formData.append('cover_image', data.cover_image)
  }
  
  const response = await axios.put(API_DETAIL_URL(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// 🗑️ বই ডিলিট
const deleteBook = async (id) => {
  await axios.delete(API_DETAIL_URL(id))
  return id
}

// 🔥 Custom Hook: Infinite Books
export const useInfiniteBooks = () => {
  return useInfiniteQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}

// 🔥 Custom Hook: Create Book
export const useCreateBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      toast.success('✅ বই সফলভাবে যোগ হয়েছে!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.cover_image?.[0] || '❌ বই যোগ করতে সমস্যা হয়েছে')
      console.error(error)
    }
  })
}

// 🔥 Custom Hook: Update Book
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

// 🔥 Custom Hook: Delete Book
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