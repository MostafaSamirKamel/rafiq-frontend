'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Menu, X, LogOut, User, Sparkles, ChevronLeft, Globe, Shield, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/store/slices/authSlice';
import { childAPI } from '@/services/apiClient';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
  onLogout?: () => void;
}

interface ChildProfile {
  _id: string;
  name: string;
  photoUrl?: string;
}

export default function Navbar({ variant = 'landing', onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchChild = async () => {
      if (variant === 'dashboard' && token) {
        try {
          const children = await childAPI.getMyChildren(token) as ChildProfile[];
          if (children && children.length > 0) {
            setActiveChild(children[0]);
          }
        } catch (error) {
          console.error("Navbar: Failed to fetch child data", error);
        }
      }
    };
    fetchChild();
  }, [variant, token]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      dispatch(logout());
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  };

  const navLinks = variant === 'landing' 
    ? [
        { href: '#about', label: 'عن رافيق' },
        { href: '#services', label: 'الخدمات' },
        { href: '#team', label: 'الفريق' },
      ]
    : [
        { href: '/dashboard', label: 'الرئيسية' },
        { href: '/recognition', label: 'التعرف' },
        { href: '/interaction', label: 'التفاعل' },
        { href: '/communication', label: 'التواصل' },
      ];

  return (
    <nav 
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        scrolled 
          ? "h-16 bg-white/80 backdrop-blur-2xl border-b border-neutral-100 shadow-sm" 
          : "h-20 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        
        {/* Right: Brand & Logo */}
        <div className="flex items-center">
          <Link href={variant === 'dashboard' ? '/dashboard' : '/'} className="flex items-center gap-3 no-underline group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm border border-white/50"
            >
              <Image src="/logo.jpeg" alt="رافيق" fill className="object-cover" />
            </motion.div>
            <span className="text-xl font-black text-neutral-900 tracking-tight">رافيق</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-100/50 p-1 rounded-2xl border border-neutral-200/20">
          <LayoutGroup>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "relative px-5 py-2 text-sm font-bold transition-colors no-underline rounded-xl overflow-hidden",
                    isActive ? "text-primary-600" : "text-neutral-500 hover:text-neutral-800"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-white shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </LayoutGroup>
        </div>

        {/* Left: User Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {variant === 'landing' ? (
              <>
                <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors no-underline">
                  دخول
                </Link>
                <Link href="/register" className="px-6 py-2.5 text-sm font-bold bg-neutral-900 text-white rounded-xl shadow-lg hover:bg-neutral-800 transition-all no-underline">
                  ابدأ الآن
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 p-1 bg-neutral-100/50 rounded-2xl border border-neutral-200/20">
                <Link 
                  href="/profile" 
                  className={cn(
                    "flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-xl transition-all group",
                    pathname === '/profile' ? "bg-white shadow-sm border border-neutral-100" : "hover:bg-white/50"
                  )}
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white shadow-xs">
                    {activeChild?.photoUrl ? (
                      <Image src={activeChild.photoUrl} alt={activeChild.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-400 font-black text-xs">
                        {activeChild?.name?.charAt(0) || 'ر'}
                      </div>
                    )}
                  </div>
                  <div className="text-right leading-none">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">الملف الشخصي</p>
                    <p className="text-xs font-black text-neutral-800">{activeChild?.name || 'البطل'}</p>
                  </div>
                </Link>

                <div className="w-px h-6 bg-neutral-200/50 mx-1" />

                <button 
                  onClick={handleLogout} 
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-white transition-all group"
                  title="خروج"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-xl bg-neutral-100/50 border border-neutral-200/20 text-neutral-600 active:scale-95 transition-transform"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Modern Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-neutral-900/60 backdrop-blur-md md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Overlay Header */}
              <div className="p-6 flex items-center justify-between border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden">
                    <Image src="/logo.jpeg" alt="Logo" width={36} height={36} />
                  </div>
                  <span className="text-lg font-black text-neutral-900 italic">رافيق</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Overlay Content */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {/* Child Status Card (if dashboard) */}
                {variant === 'dashboard' && activeChild && (
                  <Link 
                    href="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="block p-5 rounded-3xl bg-linear-to-br from-primary-50 to-white border border-primary-100 shadow-sm no-underline group active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-4 ring-primary-50 group-hover:ring-primary-100 transition-all">
                        {activeChild.photoUrl ? (
                          <Image src={activeChild.photoUrl} alt={activeChild.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-black">
                            {activeChild.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary-500 uppercase tracking-widest mb-1">المستكشف الصغير</p>
                        <p className="text-lg font-black text-neutral-900">{activeChild.name}</p>
                      </div>
                      <ChevronLeft size={20} className="mr-auto text-primary-300 group-hover:translate-x-[-4px] transition-transform" />
                    </div>
                  </Link>
                )}

                {/* Main Links */}
                <div className="space-y-2">
                  <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">القائمة الرئيسية</p>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl transition-all no-underline font-bold",
                          pathname === link.href 
                            ? "bg-neutral-900 text-white shadow-lg" 
                            : "text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100"
                        )}
                      >
                       {link.label}
                       {pathname === link.href && <Sparkles size={16} className="text-primary-400" />}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Links */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">إضافات</p>
                  <div className="grid grid-cols-1 gap-2">
                    <MobileSecondaryLink icon={<Globe size={18} />} label="اللغة: العربية" />
                    <MobileSecondaryLink icon={<Shield size={18} />} label="الخصوصية والأمان" />
                    <MobileSecondaryLink icon={<HelpCircle size={18} />} label="مركز المساعدة" />
                  </div>
                </div>
              </div>

              {/* Overlay Footer */}
              <div className="p-6 border-t border-neutral-100">
                {variant === 'landing' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-neutral-50 text-neutral-900 font-black no-underline">دخول</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-neutral-900 text-white font-black no-underline shadow-lg">ابدأ</Link>
                  </div>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 flex items-center justify-center gap-3 rounded-2xl bg-red-50 text-red-600 font-black transition-all hover:bg-red-100"
                  >
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MobileSecondaryLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-3 w-full p-4 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all text-sm font-bold">
      <span className="text-neutral-300">{icon}</span>
      {label}
    </button>
  );
}
