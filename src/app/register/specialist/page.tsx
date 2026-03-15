'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { specialistRegisterSchema, type SpecialistRegisterFormValues } from '@/lib/validations/auth';
import { registerAction } from '@/app/actions/auth';
import { setCredentials, setLoading } from '@/lib/store/slices/authSlice';
import { RootState } from '@/lib/store';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SpecialistRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecialistRegisterFormValues>({
    resolver: zodResolver(specialistRegisterSchema),
  });

  const onSubmit = async (data: SpecialistRegisterFormValues) => {
    dispatch(setLoading(true));

    try {
      const result = await registerAction(data, 'specialist');
      if (result.success && result.user) {
        dispatch(setCredentials({ user: result.user, token: result.user.token }));
        toast.success(`مرحباً بك دكتور ${data.fullName.split(' ')[0]}`);
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err: unknown) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary-100/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-[3rem] p-8 sm:p-12 bg-white/70 backdrop-blur-xl border border-white/50 shadow-floating glass-premium">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block group mb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-premium group-hover:scale-110 transition-transform duration-500 border-2 border-white">
                <Image src="/logo.jpeg" alt="رفيق" width={80} height={80} className="object-cover" />
              </div>
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50/50 text-cyan-600 font-black text-xs border border-cyan-100/50 mb-6 backdrop-blur-sm shadow-sm">
              <LocalHospitalIcon sx={{ fontSize: 16 }} /> بوابة الأخصائيين
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">إنشاء حساب جديد</h1>
            <p className="text-lg text-neutral-500 mt-2 font-medium">
              تابع تقدم الأطفال وشارك النتائج
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">الاسم الكامل</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-cyan-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  className={cn(
                    "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold placeholder:text-neutral-400 focus:bg-white focus:border-cyan-500 focus:shadow-cyan-glow transition-all outline-hidden",
                    errors.fullName && "border-red-500"
                  )} 
                  placeholder="د. محمد علي" 
                  {...register('fullName')} 
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">رقم الهاتف</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-cyan-500 transition-colors">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel" 
                  className={cn(
                    "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold placeholder:text-neutral-400 focus:bg-white focus:border-cyan-500 focus:shadow-cyan-glow transition-all outline-hidden",
                    errors.phone && "border-red-500"
                  )} 
                  placeholder="01xxxxxxxxx" 
                  dir="ltr" 
                  {...register('phone')} 
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-cyan-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-14 text-neutral-800 font-bold placeholder:text-neutral-400 focus:bg-white focus:border-cyan-500 focus:shadow-cyan-glow transition-all outline-hidden",
                    errors.password && "border-red-500"
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors outline-hidden flex items-center justify-center p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-linear-to-r from-cyan-600 to-cyan-700 text-white font-black py-4 rounded-2xl shadow-floating hover:shadow-cyan-glow active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-3 text-lg mt-8 border-none"
            >
              {loading ? (
                <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>إنشاء الحساب</span>
                  <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/0 backdrop-blur-sm px-4 text-neutral-400 font-black tracking-widest">أو</span></div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-base text-center text-neutral-500 font-medium">
              لديك حساب؟{' '}
              <Link href="/login" className="font-black text-cyan-600 hover:text-cyan-700 no-underline transition-colors">
                سجل دخولك
              </Link>
            </p>
            <div className="pt-2">
              <Link href="/register" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary-50/50 text-primary-600 font-black text-sm border border-primary-100/50 hover:bg-primary-100 hover:shadow-blue-glow transition-all no-underline shadow-sm">
                 لست أخصائياً؟ سجل كولي أمر
              </Link>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-neutral-400 hover:text-neutral-900 transition-all no-underline group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
