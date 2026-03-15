import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
});

export const parentRegisterSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  childName: z.string().min(2, 'اسم الطفل يجب أن يكون حرفين على الأقل'),
  childBirthDate: z.string().min(1, 'يرجى اختيار تاريخ ميلاد الطفل'),
  gender: z.enum(['male', 'female']),
  governorate: z.string().min(1, 'يرجى اختيار المحافظة'),

  school: z.string().optional(),
  iqScore: z.string().optional(),
  healthStatus: z.string().optional(),
  treatmentCenter: z.string().optional(),
  doctorName: z.string().optional(),
  doctorPhone: z.string().optional(),
});


export const specialistRegisterSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ParentRegisterFormValues = z.infer<typeof parentRegisterSchema>;
export type SpecialistRegisterFormValues = z.infer<typeof specialistRegisterSchema>;
