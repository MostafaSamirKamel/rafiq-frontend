'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Menu, X, LogOut, User, Sparkles, ChevronLeft, Globe, Shield, HelpCircle, LayoutDashboard, Target, MessageSquare, Fingerprint } from 'lucide-react';
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
  variant?: 'landing' | 'dashboard' | 'auth';
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  const navLinks: { href: string; label: string; icon?: React.ReactNode }[] = (variant === 'landing' || variant === 'auth') 
    ? [
        { href: '/#about', label: 'عن رفيق' },
        { href: '/#services', label: 'الخدمات' },
        { href: '/#team', label: 'الفريق' },
      ]
    : [
        { href: '/dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
        { href: '/recognition', label: 'التعرف', icon: <Fingerprint size={20} /> },
        { href: '/interaction', label: 'التفاعل', icon: <Target size={20} /> },
        { href: '/communication', label: 'التواصل', icon: <MessageSquare size={20} /> },
      ];

  const isProfessional = variant === 'dashboard' || variant === 'auth';
  const isDashboard = variant === 'dashboard';
  const showGlassBackground = scrolled || isProfessional;

  // Text colors logic
  const textColor = showGlassBackground ? "text-neutral-900" : (variant === 'landing' ? "text-white" : "text-neutral-900");
  const linkColor = showGlassBackground ? "text-neutral-600 hover:text-primary-600" : (variant === 'landing' ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-neutral-900");

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav 
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-700 ease-in-out",
          showGlassBackground 
            ? "h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]" 
            : "h-20 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* RIGHT: Logo & Brand */}
          <div className="flex items-center">
            <Link href={isDashboard ? '/dashboard' : '/'} className="flex items-center gap-2.5 sm:gap-3 no-underline group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm border border-white/20 ring-1 ring-neutral-200/10"
              >
                <Image src="/logo.jpeg" alt="رفيق" fill className="object-cover" />
              </motion.div>
              <div className="flex flex-col">
                <span className={cn("text-lg sm:text-xl font-black tracking-tighter leading-none transition-colors duration-300", textColor)}>رفيق</span>
                <span className={cn("text-[8px] sm:text-[9px] font-black tracking-widest uppercase mt-0.5 opacity-50", showGlassBackground ? "text-primary-600" : "text-white")}>RAFIQ</span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          {!isProfessional && (
            <div className="hidden md:flex items-center gap-8 ml-auto mr-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn("text-sm font-black transition-all no-underline relative py-2", linkColor)}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}

          {isDashboard && (
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-neutral-100/50 rounded-2xl border border-neutral-200/50 transition-all">
              <LayoutGroup>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={cn(
                        "relative px-4 py-2 text-[11px] lg:text-xs font-black transition-all no-underline rounded-xl flex items-center gap-2",
                        isActive ? "text-primary-700" : "text-neutral-500 hover:text-neutral-900"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="nav-bg-active"
                          className="absolute inset-0 bg-white shadow-sm ring-1 ring-neutral-200/10 -z-10"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <span className={cn("transition-transform duration-300", isActive && "scale-110")}>{link.icon}</span>
                      <span className="mt-0.5">{link.label}</span>
                    </Link>
                  );
                })}
              </LayoutGroup>
            </div>
          )}

          {/* LEFT: Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth/Profile */}
            <div className="hidden md:flex items-center gap-3">
              {!isProfessional ? (
                <>
                  <Link href="/login" className={cn("px-5 py-2.5 text-sm font-black transition-colors no-underline", linkColor)}>دخول</Link>
                  <Link href="/register" className={cn(
                    "px-6 py-2.5 text-sm font-black rounded-xl shadow-lg transition-all no-underline flex items-center gap-2",
                    showGlassBackground ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow-white/10"
                  )}>
                    ابدأ الآن <ChevronLeft size={16} />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 pl-1 pr-1.5 py-1.5 bg-white shadow-sm ring-1 ring-neutral-100 rounded-2xl">
                  <Link href="/profile" className={cn("flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-xl transition-all group no-underline", pathname === '/profile' ? "bg-primary-50/50" : "hover:bg-neutral-50")}>
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-neutral-100 shadow-xs ring-2 ring-white">
                      {activeChild?.photoUrl ? (
                        <Image src={activeChild.photoUrl} alt={activeChild.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-xs">
                          {activeChild?.name?.charAt(0) || 'ر'}
                        </div>
                      )}
                    </div>
                    <div className="text-right leading-none flex flex-col justify-center">
                      <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-0.5">الملف الشخصي</p>
                      <p className="text-xs font-black text-neutral-900">{activeChild?.name || 'البطل'}</p>
                    </div>
                  </Link>
                  <div className="w-px h-6 mx-1 bg-neutral-100" />
                  <button onClick={handleLogout} className="p-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all group"><LogOut size={18} /></button>
                </div>
              )}
            </div>

            {/* Mobile Actions: Only Profile for Dashboard, Menu for Landing */}
            <div className="md:hidden flex items-center gap-2">
              {isDashboard ? (
                <Link href="/profile" className="flex items-center gap-2 p-1 bg-white shadow-xs ring-1 ring-neutral-100 rounded-xl no-underline group active:scale-95 transition-all">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-neutral-50 shadow-xs">
                    {activeChild?.photoUrl ? (
                      <Image src={activeChild.photoUrl} alt={activeChild.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-black text-xs">
                        {activeChild?.name?.charAt(0) || 'ر'}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => setIsOpen(true)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all active:scale-90",
                    showGlassBackground 
                      ? "bg-neutral-100/80 border-neutral-200/50 text-neutral-900 shadow-sm" 
                      : "bg-white/10 border-white/20 text-white backdrop-blur-md"
                  )}
                >
                  <Menu size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAV (Dashboard Only) --- */}
      {isDashboard && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
          <div className="bg-white/90 backdrop-blur-2xl border border-neutral-200/50 rounded-4xl shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between px-3 py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="relative flex-1 flex flex-col items-center gap-1.5 py-3 rounded-4xl transition-all no-underline group"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 bg-primary-50 rounded-4xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={cn(
                    "transition-all duration-300",
                    isActive ? "text-primary-600 scale-110 -translate-y-1" : "text-neutral-400 group-hover:text-neutral-600"
                  )}>
                    {link.icon}
                  </span>
                  <span className={cn(
                    "text-[10px] font-black transition-all",
                    isActive ? "text-primary-700 opacity-100" : "text-neutral-400 opacity-70"
                  )}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* --- REFINED MOBILE OVERLAY (Landing/Auth Only) --- */}
      <AnimatePresence>
        {isOpen && !isDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-neutral-900/80 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ x: '100%', skewX: -2 }}
              animate={{ x: 0, skewX: 0 }}
              exit={{ x: '100%', skewX: 2 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/95 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-neutral-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
                    <Image src="/logo.jpeg" alt="Logo" width={36} height={36} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-neutral-900 tracking-tighter leading-none">رفيق</span>
                    <span className="text-[8px] font-black text-primary-600 tracking-widest uppercase mt-0.5">RAFIQ TOOL</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl bg-neutral-100 text-neutral-500 active:rotate-90"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10">
                <div className="space-y-3">
                  <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">التنقل السريع</p>
                  <div className="grid grid-cols-1 gap-2">
                    {navLinks.map((link, i) => (
                      <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl transition-all no-underline font-black group",
                            pathname === link.href ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/10" : "text-neutral-600 hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {isProfessional && <span className={cn(pathname === link.href ? "text-primary-400" : "text-neutral-400")}>{(link as any).icon}</span>}
                            <span>{link.label}</span>
                          </div>
                          {pathname === link.href ? <Sparkles size={16} className="text-primary-400 animate-pulse" /> : <ChevronLeft size={16} className="text-neutral-300" />}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <p className="px-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">المساعدة والخصوصية</p>
                  <div className="grid grid-cols-1 gap-1">
                    <MobileSecondaryLink icon={<Globe size={18} />} label="اللغة: العربية" />
                    <MobileSecondaryLink icon={<Shield size={18} />} label="الخصوصية والأمان" />
                    <MobileSecondaryLink icon={<HelpCircle size={18} />} label="مركز المساعدة" />
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-neutral-100 bg-neutral-50/50">
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-white border border-neutral-100 text-neutral-900 font-black no-underline shadow-sm hover:shadow-md transition-shadow">دخول</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="py-4 text-center rounded-2xl bg-neutral-900 text-white font-black no-underline shadow-xl shadow-neutral-900/10 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">ابدأ الآن مجاناً 🚀</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileSecondaryLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-4 w-full p-4 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all text-sm font-black group">
      <span className="text-neutral-300 group-hover:text-primary-500 transition-colors">{icon}</span>
      {label}
    </button>
  );
}
