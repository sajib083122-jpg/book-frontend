import { z } from 'zod'

// 📝 বই এর Zod Schema
export const bookSchema = z.object({
  book_name: z.string()
    .min(3, 'বইয়ের নাম কমপক্ষে ৩ অক্ষর হতে হবে')
    .max(200, 'বইয়ের নাম ২০০ অক্ষরের বেশি হতে পারবে না'),
  
  price: z.coerce.number()
    .positive('মূল্য ০ এর বেশি হতে হবে')
    .max(999999, 'মূল্য খুব বেশি'),
  
  description: z.string()
    .max(1000, 'বর্ণনা ১০০০ অক্ষরের বেশি হতে পারবে না')
    .optional()
})

// 📝 লগইন এর Zod Schema
export const loginSchema = z.object({
  username: z.string()
    .min(3, 'ইউজারনাম কমপক্ষে ৩ অক্ষর হতে হবে'),
  
  password: z.string()
    .min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে')
})

// 📝 রেজিস্টার এর Zod Schema
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'ইউজারনাম কমপক্ষে ৩ অক্ষর হতে হবে'),
  
  email: z.string()
    .email('সঠিক ইমেইল ঠিকানা দিন')
    .optional()
    .or(z.literal('')),
  
  password: z.string()
    .min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
})