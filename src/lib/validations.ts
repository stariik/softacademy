import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'სახელი უნდა იყოს მინიმუმ 2 სიმბოლო'),
  email: z.string().email('არასწორი ელ-ფოსტის ფორმატი').optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, 'არასწორი ტელეფონის ნომერი').optional().or(z.literal('')),
  password: z.string().min(6, 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო'),
}).refine(data => data.email || data.phone, {
  message: 'გთხოვთ მიუთითოთ ელ-ფოსტა ან ტელეფონის ნომერი',
})

export const loginSchema = z.object({
  identifier: z.string().min(1, 'გთხოვთ მიუთითოთ ელ-ფოსტა ან ტელეფონის ნომერი'),
  password: z.string().min(1, 'გთხოვთ მიუთითოთ პაროლი'),
})

export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, 'არასწორი ტელეფონის ნომერი'),
})

export const otpSchema = z.object({
  otp: z.string().length(6, 'კოდი უნდა იყოს 6 ციფრი'),
})

export const courseSchema = z.object({
  title: z.string().min(3, 'სათაური უნდა იყოს მინიმუმ 3 სიმბოლო'),
  shortDesc: z.string().min(10, 'მოკლე აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო'),
  description: z.string().min(50, 'აღწერა უნდა იყოს მინიმუმ 50 სიმბოლო'),
  price: z.number().positive('ფასი უნდა იყოს დადებითი'),
  categoryId: z.string().min(1, 'აირჩიეთ კატეგორია'),
  instructor: z.string().min(2, 'ლექტორის სახელი სავალდებულოა'),
  instructorBio: z.string().optional(),
  duration: z.string().min(1, 'ხანგრძლივობა სავალდებულოა'),
  startDate: z.string().min(1, 'თარიღი სავალდებულოა'),
  syllabus: z.array(z.string()).min(1, 'მინიმუმ 1 თემა სავალდებულოა'),
  syllabusFile: z.string().nullable().optional(),
  maxStudents: z.number().positive().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'კატეგორიის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო'),
  description: z.string().optional(),
})

export const promocodeSchema = z.object({
  code: z.string().min(3, 'კოდი უნდა იყოს მინიმუმ 3 სიმბოლო').toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive('მნიშვნელობა უნდა იყოს დადებითი'),
  maxUses: z.number().positive().optional(),
  minPurchase: z.number().positive().optional(),
  expiresAt: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'შეფასება უნდა იყოს 1-დან 5-მდე'),
  comment: z.string().min(10, 'კომენტარი უნდა იყოს მინიმუმ 10 სიმბოლო'),
})

export const messageSchema = z.object({
  subject: z.string().min(3, 'თემა სავალდებულოა'),
  content: z.string().min(10, 'შეტყობინება სავალდებულოა'),
  recipients: z.array(z.string()).min(1, 'აირჩიეთ მინიმუმ 1 მიმღები'),
  type: z.enum(['email', 'sms']),
})

export const settingsSchema = z.object({
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().optional().or(z.literal('')),
  SMTP_FROM_NAME: z.string().optional(),
  SITE_NAME: z.string().optional(),
  SITE_DESCRIPTION: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PhoneLoginInput = z.infer<typeof phoneLoginSchema>
export type OTPInput = z.infer<typeof otpSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type PromocodeInput = z.infer<typeof promocodeSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
