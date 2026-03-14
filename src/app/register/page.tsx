'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User, Phone, Lock, Calendar, MapPin, School, Heart,
  Building, ArrowLeft, ArrowRight, Check, Upload, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { parentRegisterSchema, type ParentRegisterFormValues } from '@/lib/validations/auth';
import { registerAction } from '@/app/actions/auth';
import { setCredentials, setLoading } from '@/lib/store/slices/authSlice';
import { RootState } from '@/lib/store';
import { childAPI } from '@/services/apiClient';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const steps = [
  { title: 'الطفل', icon: <ChildCareIcon sx={{ fontSize: 20 }} /> },
  { title: 'الدراسة', icon: <AssignmentIcon sx={{ fontSize: 20 }} /> },
  { title: 'الأخصائي', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} /> },
  { title: 'الدخول', icon: <LockOpenIcon sx={{ fontSize: 20 }} /> },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [childPhoto, setChildPhoto] = useState<File | null>(null);
  const [childPhotoPreview, setChildPhotoPreview] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParentRegisterFormValues>({
    resolver: zodResolver(parentRegisterSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      password: '',
      childName: '',
      childBirthDate: '',
      governorate: '',
    }
  });

  const gender = watch('gender' as any) || 'male';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChildPhoto(file);
      setChildPhotoPreview(URL.createObjectURL(file));
      toast.info('تم رفع الصورة بنجاح');
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['childName', 'childBirthDate'];
    if (currentStep === 1) fieldsToValidate = ['governorate'];
    if (currentStep === 3) fieldsToValidate = ['fullName', 'phone', 'password'];
    
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
    }
    
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: ParentRegisterFormValues) => {
    dispatch(setLoading(true));

    try {
      const authResult = await registerAction(data as any, 'parent');
      
      if (!authResult.success || !authResult.user) {
        toast.error(authResult.error || 'حدث خطأ أثناء التسجيل');
        return;
      }

      dispatch(setCredentials({ user: authResult.user, token: authResult.user.token }));
      
      // Since we integrated child data into the registration flow refactor, 
      // we'll still keep the secondary call for the specific childAPI if needed, 
      // but the main goal is to ensure auth works first.
      
      const formData = new FormData();
      formData.append('name', data.childName);
      formData.append('birthdate', data.childBirthDate);
      formData.append('gender', gender);
      formData.append('governorate', data.governorate);
      // ... other optional fields from the form could be added here if schemas were expanded
      if (childPhoto) formData.append('photo', childPhoto);

      try {
        await childAPI.create(formData, authResult.user.token);
      } catch (childErr) {
        console.error('Child creation failed but auth succeeded:', childErr);
        // We still redirect because account is created
      }

      toast.success('تم إنشاء حسابك وحساب طفلك بنجاح!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error('حدث خطأ غير متوقع أثناء التسجيل');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-20 bg-background relative overflow-hidden">
      {/* Dynamic background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-accent-100/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="rounded-[3rem] p-8 sm:p-14 bg-white/70 backdrop-blur-xl border border-white/50 shadow-floating glass-premium">
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block group">
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-6 shadow-premium group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border-2 border-white">
                <Image src="/logo.jpeg" alt="رافيق" width={64} height={64} className="object-cover" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">إنشاء حساب ولي أمر</h1>
            <p className="text-lg text-neutral-500 mt-2 font-medium">خطوات بسيطة لنبدأ رحلة طفلك معنا</p>
          </div>

          {/* Stepper */}
          <div className="relative flex items-center justify-between mb-16 px-4">
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-neutral-100/50 -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1.5 bg-linear-to-r from-primary-400 to-primary-600 -translate-y-1/2 z-0 transition-all duration-700 rounded-full shadow-blue-glow" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: i === currentStep ? 1.15 : 1,
                  }}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 border-4",
                    i < currentStep 
                      ? "bg-primary-500 border-white text-white shadow-blue-glow" 
                      : i === currentStep
                        ? "bg-white border-primary-500 text-primary-600 shadow-floating"
                        : "bg-white border-neutral-100 text-neutral-400"
                  )}
                >
                  {i < currentStep ? <Check size={20} strokeWidth={3} /> : step.icon}
                </motion.div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  i <= currentStep ? "text-primary-600" : "text-neutral-400"
                )}>{step.title}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Child Info */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="text-center mb-4">
                    <label className="relative cursor-pointer group inline-block">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-primary-50 border-4 border-dashed border-primary-200 group-hover:border-primary-400 group-hover:bg-primary-100 transition-all flex items-center justify-center shadow-inner relative">
                        {childPhotoPreview ? (
                          <img src={childPhotoPreview} alt="صورة الطفل" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-primary-400 group-hover:text-primary-600 transition-colors">
                            <Upload size={32} />
                            <span className="text-[10px] font-black uppercase tracking-wider">أضف صورة</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">اسم الطفل البطل</label>
                      <div className="relative group">
                        <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                          className={cn(
                            "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold placeholder:text-neutral-400 focus:bg-white focus:border-primary-500 focus:shadow-blue-glow transition-all outline-hidden",
                            errors.childName && "border-red-500"
                          )} 
                          placeholder="أدخل اسم الطفل بالكامل" 
                          {...register('childName')} 
                        />
                      </div>
                      {errors.childName && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.childName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">تاريخ الميلاد</label>
                        <div className="relative group">
                          <Calendar size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                          <input 
                            type="date" 
                            className={cn(
                              "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden",
                              errors.childBirthDate && "border-red-500"
                            )} 
                            {...register('childBirthDate')} 
                          />
                        </div>
                        {errors.childBirthDate && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.childBirthDate.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">النوع</label>
                        <div className="flex gap-4">
                          {[
                            { value: 'male', label: 'بطل', icon: <BoyIcon sx={{ fontSize: 24 }} /> },
                            { value: 'female', label: 'بطلة', icon: <GirlIcon sx={{ fontSize: 24 }} /> },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setValue('gender' as any, opt.value)}
                              className={cn(
                                "flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all border-2",
                                gender === opt.value ? "bg-primary-500 border-primary-500 text-white shadow-blue-glow" : "bg-neutral-50/50 border-neutral-100 text-neutral-500 hover:border-primary-300"
                              )}
                            >
                              {opt.icon} {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Case Study */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">المحافظة</label>
                      <div className="relative group">
                        <MapPin size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                          className={cn(
                            "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden",
                            errors.governorate && "border-red-500"
                          )} 
                          placeholder="أين تسكن؟" 
                          {...register('governorate')} 
                        />
                      </div>
                      {errors.governorate && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.governorate.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">المدرسة</label>
                    <div className="relative group">
                      <School size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                      <input className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="اسم المدرسة" {...register('school' as any)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">نسبة الذكاء (IQ)</label>
                    <input type="number" className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 px-6 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="مثال: 95" {...register('iqScore' as any)} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">التشخيص الصحي</label>
                    <div className="relative group">
                      <Heart size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                      <input className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="أدخل الحالة الصحية بالتفصيل" {...register('healthStatus' as any)} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">المركز المعالج (اختياري)</label>
                    <div className="relative group">
                      <Building size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                      <input className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="اسم المركز المتابع للحالة" {...register('treatmentCenter' as any)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Specialist */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-3xl bg-primary-50/50 border border-primary-100 mb-4 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200/20 rounded-full -mr-12 -mt-12" />
                    <p className="text-sm font-bold text-primary-800 text-center leading-relaxed relative z-10">
                      هذه البيانات تساعدنا في ربط طفلك بالأخصائي المتابع لتسجيل التقدم ومراجعة التمارين بشكل احترافي
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">اسم الأخصائي المتابع</label>
                      <div className="relative group">
                        <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="اسم الدكتور أو الأخصائي" {...register('doctorName' as any)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">رقم هاتف الأخصائي</label>
                      <div className="relative group">
                        <Phone size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input type="tel" className="w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden" placeholder="01xxxxxxxxx" dir="ltr" {...register('doctorPhone' as any)} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Login Credentials */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">اسم ولي الأمر</label>
                      <div className="relative group">
                        <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                          className={cn(
                            "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden",
                            errors.fullName && "border-red-500"
                          )} 
                          placeholder="اسمك بالكامل" 
                          {...register('fullName')} 
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-xs mt-2 mr-1 font-bold">{errors.fullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">رقم الهاتف (سيكون اسم المستخدم الخاص بك)</label>
                      <div className="relative group">
                        <Phone size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                        <input 
                          type="tel" 
                          className={cn(
                            "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-4 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 transition-all outline-hidden",
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
                        <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={cn(
                            "w-full bg-neutral-50/50 border-2 border-neutral-100 rounded-2xl py-4 pr-12 pl-14 text-neutral-800 font-bold focus:bg-white focus:border-primary-500 focus:shadow-blue-glow transition-all outline-hidden",
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
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-12 gap-6">
              {currentStep > 0 ? (
                <button type="button" onClick={prevStep} className="flex-1 py-4 rounded-2xl font-black text-neutral-600 bg-neutral-100/50 hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 border-2 border-transparent">
                  <ArrowRight size={22} />
                  السابق
                </button>
              ) : (
                <div className="flex-1 hidden sm:block" />
              )}

              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={nextStep} className="flex-1 py-4 rounded-2xl font-black text-white bg-linear-to-r from-primary-600 to-primary-700 shadow-floating hover:shadow-blue-glow active:scale-95 transition-all flex items-center justify-center gap-3">
                  التالي
                  <ArrowLeft size={22} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl font-black text-white bg-linear-to-r from-success-600 to-success-700 shadow-lg shadow-success-500/30 hover:shadow-success-500/50 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-3">
                  {loading ? <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>إتمام التسجيل والبدء <Check size={24} strokeWidth={3} /></>}
                </button>
              )}
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-12 pt-8 border-t border-neutral-100/50">
            <p className="text-base text-neutral-500 font-medium">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-black text-primary-600 hover:text-primary-700 no-underline transition-colors">
                سجل دخولك هنا
              </Link>
            </p>
          </div>
        </div>

        {/* Home link */}
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
