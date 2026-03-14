'use server';

import { cookies } from 'next/headers';
import { authAPI } from '@/services/apiClient';
import { loginSchema, parentRegisterSchema, specialistRegisterSchema } from '@/lib/validations/auth';

export async function loginAction(formData: unknown) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: 'بيانات غير صالحة', details: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const { phone, password } = validatedFields.data;
    const response = await authAPI.login(phone, password);

    const cookieStore = await cookies();
    cookieStore.set('rafiq_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, user: response };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'فشل تسجيل الدخول' };
  }
}

export async function registerAction(formData: unknown, role: 'parent' | 'specialist') {
  const schema = role === 'parent' ? parentRegisterSchema : specialistRegisterSchema;
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: 'بيانات غير صالحة', details: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const response = await authAPI.register({ ...validatedFields.data, role } as any);

    const cookieStore = await cookies();
    cookieStore.set('rafiq_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: response };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'فشل إنشاء الحساب' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('rafiq_token');
  return { success: true };
}
