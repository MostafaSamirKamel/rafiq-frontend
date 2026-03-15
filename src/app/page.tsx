'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, User, ChevronDown } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SliderModal from '@/components/ui/SliderModal';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import ShieldIcon from '@mui/icons-material/Shield';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChatIcon from '@mui/icons-material/Chat';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SparklesIcon from '@mui/icons-material/AutoAwesome';

const introSlides = [
  {
    title: 'ما هو رفيق؟',
    description: 'منصة علاجية ذكية تعتمد على الذكاء الاصطناعي لمساعدة الأطفال على تطوير المهارات الاجتماعية والتواصل بطريقة ممتعة وتفاعلية.',
    icon: <ExtensionIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: 'كيف يعمل؟',
    description: 'يقوم الطفل بالتدريب من خلال تجارب تفاعلية مخصصة تشمل التعرف البصري والإشارات الاجتماعية والمحادثة.',
    icon: <SettingsIcon sx={{ fontSize: 36 }} />,
    items: ['الصور الحقيقية', 'الفيديو التفاعلي', 'التفاعل الصوتي'],
  },
  {
    title: 'نتائج البرنامج',
    description: 'تحسين ملحوظ في قدرات الطفل الاجتماعية من خلال برنامج علاجي متكامل ومتابعة مستمرة.',
    icon: <TrendingUpIcon sx={{ fontSize: 36 }} />,
    items: ['تحسين التعرف الاجتماعي', 'فهم المشاعر', 'تطوير مهارات التواصل'],
  },
];

const serviceSlides = [
  {
    title: 'التعرف الاجتماعي',
    description: 'تدريب الطفل على التعرف على الأشخاص المقربين والأماكن المألوفة والأشياء اليومية من خلال صور حقيقية.',
    icon: <VisibilityIcon sx={{ fontSize: 36 }} />,
    items: ['التعرف على الأشخاص', 'التعرف على الأماكن', 'التعرف على الأشياء'],
  },
  {
    title: 'التفاعل الاجتماعي',
    description: 'تعليم الطفل فهم الإشارات الاجتماعية والمشاعر من خلال فيديوهات تفاعلية مخصصة.',
    icon: <HandshakeIcon sx={{ fontSize: 36 }} />,
    items: ['فهم الإشارات', 'فهم المشاعر', 'التفاعل المناسب'],
  },
  {
    title: 'التواصل الاجتماعي',
    description: 'تطوير مهارات الحوار والتواصل من خلال محادثات ذكية مع الذكاء الاصطناعي وتحليل الصوت.',
    icon: <ChatIcon sx={{ fontSize: 36 }} />,
    items: ['محادثة مع الذكاء الاصطناعي', 'تحليل الصوت', 'تطوير الحوار'],
  },
];

const features = [
  { icon: <ShieldIcon />, title: 'آمن وموثوق', desc: 'بيئة آمنة ومحمية للأطفال' },
  { icon: <PsychologyIcon />, title: 'ذكاء اصطناعي', desc: 'تقنيات متقدمة للتعلم' },
  { icon: <FavoriteIcon />, title: 'مخصص للطفل', desc: 'تجربة فريدة لكل طفل' },
  { icon: <StarIcon />, title: 'نتائج مثبتة', desc: 'تحسن ملحوظ في المهارات' },
];

const faqItems = [
  {
    q: 'ماهو العمر المناسب لاستخدام رفيق؟',
    a: 'تم تصميم رفيق خصيصاً للأطفال من عمر ٣ سنوات إلى ١٢ سنة، مع برامج مخصصة لكل فئة عمرية حسب احتياجاتها التطورية.',
  },
  {
    q: 'هل النظام آمن تماماً لطفلي؟',
    a: 'نعم، الأمان هو أولويتنا القصوى. رفيق يعمل في بيئة مغلقة ومحمية تماماً، ويتم مراجعة المحتوى من قبل أخصائيين نفسيين وتربويين.',
  },
  {
    q: 'كيف يمكنني متابعة تقدم طفلي؟',
    a: 'توفر المنصة لوحة تحكم ذكية لولي الأمر تقدم تقارير يومية وأسبوعية مفصلة عن المهارات التي تم اكتسابها ونقاط التطور.',
  },
  {
    q: 'هل يحتاج رفيق إلى اتصال دائم بالإنترنت؟',
    a: 'نعم، يتطلب النظام اتصالاً بالإنترنت لتقديم التفاعل الذكي المعتمد على خوادم الذكاء الاصطناعي الخاصة بنا بشكل لحظي.',
  },
];

export default function LandingPage() {
  const [introOpen, setIntroOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Layered Animated Background */}
        <div className="absolute inset-0 bg-neutral-900 pointer-events-none" />
        
        {/* SVG Blobs with animation */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-primary-600/20 blur-[120px] rounded-full animate-blob pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-accent-600/10 blur-[100px] rounded-full animate-blob pointer-events-none [animation-delay:2s]" />
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-right flex flex-col items-center lg:items-end"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-white/90 font-black text-xs uppercase tracking-[0.2em]">مستقبل العلاج الذكي</span>
                <SparklesIcon className="text-warning-400 ml-1" sx={{ fontSize: 18 }} />
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] mb-8 text-center lg:text-right tracking-tight">
                ساعد طفلك على
                <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-white via-primary-200 to-white/80 py-2">
                  التواصل بثقة
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed mb-12 max-w-xl text-center lg:text-right font-medium opacity-90">
                رفيق يدمج الذكاء الاصطناعي مع أحدث الأساليب العلاجية 
                ليمنح طفلك بيئة تفاعلية آمنة تنمي مهاراته الاجتماعية كل يوم.
              </p>

              <div className="flex flex-wrap gap-6 justify-center lg:justify-end flex-row-reverse">
                <Link 
                  href="/register" 
                  className="group relative px-10 py-5 rounded-[2rem] bg-linear-to-r from-primary-500 to-primary-600 text-white font-black text-lg no-underline shadow-blue-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  <span>ابدأ رحلة طفلك</span>
                  <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                
                <button
                  onClick={() => setIntroOpen(true)}
                  className="px-10 py-5 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-lg hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Play size={18} fill="currentColor" />
                  </div>
                  شاهد كيف يعمل
                </button>
              </div>

              {/* Stats Strip */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-10 mt-16 px-10 py-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/5 shadow-2xl"
              >
                {[
                  { num: '3', label: 'مراحل ذكية', icon: <ExtensionIcon sx={{ fontSize: 18, color: 'var(--color-primary-400)' }} /> },
                  { num: '24/7', label: 'متابعة دائمة', icon: <PsychologyIcon sx={{ fontSize: 18, color: '#a855f7' }} /> },
                  { num: 'AI', label: 'نظام رفيق', icon: <SmartToyIcon sx={{ fontSize: 18, color: '#22c55e' }} /> },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-end gap-1">
                    <div className="flex items-center gap-2 flex-row-reverse">
                      {stat.icon}
                      <span className="text-2xl font-black text-white">{stat.num}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-black tracking-widest uppercase">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual Content - 3D Robot Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative flex justify-center lg:justify-start"
            >
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full animate-pulse pointer-events-none" />
                
                <div className="animate-float relative z-10">
                   <div className="relative rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-neutral-800/20 backdrop-blur-sm">
                      <Image
                        src="/hero-robot.png"
                        alt="رفيق - المساعد الذكي"
                        width={600}
                        height={600}
                        priority
                        className="w-full h-auto object-cover transform hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Floating Badge on image */}
                      <div className="absolute bottom-6 right-6 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center gap-3">
                        <div className="flex -space-x-3 flex-row-reverse space-x-reverse">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-500 bg-neutral-800 flex items-center justify-center overflow-hidden">
                              <User size={14} className="text-white" />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-black text-white">+٥٠٠ بطل يتعلم الآن</span>
                      </div>
                   </div>
                </div>

                {/* Floating elements around the robot */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 p-5 rounded-3xl bg-white glass shadow-2xl z-20"
                >
                  <FavoriteIcon className="text-pink-500" sx={{ fontSize: 32 }} />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -right-8 p-6 rounded-3xl bg-white glass shadow-2xl z-20"
                >
                  <SmartToyIcon className="text-primary-500" sx={{ fontSize: 40 }} />
                </motion.div>
                
                <div className="absolute top-1/2 -right-12 w-24 h-24 rounded-full bg-linear-to-br from-warning-400 to-orange-500 opacity-20 blur-2xl animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Scroll Tip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:text-primary-400 transition-colors">اكتشف المزيد</span>
          <div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Features Strip */}
      <section className="relative -mt-20 z-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 rounded-[2.5rem] bg-neutral-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-6 rounded-[2.25rem] hover:bg-white/5 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-linear-to-br from-primary-500/20 to-primary-600/5 text-primary-400 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-inner"
                >
                  {f.icon}
                </div>
                <h4 className="font-black text-sm text-white tracking-tight">{f.title}</h4>
                <p className="text-[10px] mt-1.5 text-neutral-400 font-bold uppercase tracking-wider">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section py-32 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="inline-block px-10 py-2.5 rounded-2xl text-[10px] font-black mb-6 uppercase tracking-[0.4em] bg-white border border-neutral-100 shadow-sm text-primary-600"
            >
              اكتشف رفيق
            </span>
            <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-neutral-900">
              برنامج علاجي <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-accent-600">متكامل</span> للأطفال
            </h2>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-neutral-500 font-medium leading-relaxed">
              نحن نقدم تجربة تعليمية مخصصة تجمع بين العلم والمرح، مصممة خصيصاً لمساعدة طفلك على التميز في مهارات التواصل الاجتماعي.
            </p>
          </motion.div>
        </div>

        {/* System preview card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16 px-4"
        >
          <div
            className="rounded-[3.5rem] p-10 lg:p-16 relative overflow-hidden bg-white border border-neutral-100 shadow-premium"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-right flex flex-col items-center lg:items-end">
                <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 mb-8 shadow-inner">
                   <SmartToyIcon sx={{ fontSize: 48 }} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight text-neutral-900 leading-tight">
                  تفاعل ذكي في بيئة آمنة
                </h3>
                <p className="text-lg text-neutral-500 font-medium mb-10 leading-relaxed text-center lg:text-right">
                  بيئة تفاعلية آمنة تجمع بين التعلم والمرح، حيث يتدرب الطفل على المهارات الاجتماعية من خلال محاكاة الواقع المعزز بالذكاء الاصطناعي.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-end gap-3 flex-row-reverse">
                  {[
                    { icon: <VisibilityIcon fontSize="small" />, label: 'التعرف البصري' },
                    { icon: <HandshakeIcon fontSize="small" />, label: 'التفاعل الحركي' },
                    { icon: <ChatIcon fontSize="small" />, label: 'التواصل الصوتي' },
                  ].map((item, i) => (
                    <motion.span 
                      key={i} 
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 font-black text-xs flex items-center gap-3 text-neutral-600 shadow-xs"
                    >
                      {item.icon}
                      {item.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Decorative Child Icon with Badge */}
              <div className="relative flex justify-center">
                <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-[4rem] bg-primary-100 flex items-center justify-center text-primary-600 relative z-10 transition-transform duration-700 hover:rotate-6">
                  <ChildCareIcon sx={{ fontSize: 120 }} />
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 p-5 rounded-3xl bg-white shadow-2xl border border-neutral-50"
                >
                  <SparklesIcon className="text-warning-500" />
                </motion.div>
                <div className="absolute -bottom-6 -left-6 px-6 py-3 rounded-2xl bg-white shadow-premium border border-neutral-100 font-black text-sm text-primary-600 z-20">
                  +٨٥٪ تحسن ملحوظ
                </div>
                
                {/* Background glow for card portion */}
                <div className="absolute inset-0 bg-primary-400/10 blur-[60px] rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Action Cards Section */}
      <section className="section py-24 bg-neutral-900 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] aspect-square bg-primary-600/10 blur-[140px] rounded-full pointer-events-none animate-blob" />
        <div className="absolute top-[-20%] right-[-10%] w-[40%] aspect-square bg-accent-600/5 blur-[120px] rounded-full pointer-events-none animate-blob [animation-delay:3s]" />

        <div className="text-center mb-16 relative z-10 px-4">
          <span className="text-primary-400 font-black text-xs uppercase tracking-[0.4em] mb-4 inline-block">ابدأ الآن</span>
          <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight text-white">
            انضم إلى عائلة <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-accent-400">رفيق</span> وتفوق
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 font-medium max-w-xl mx-auto leading-relaxed">
            البداية بسيطة، اختر نوع الحساب الذي يناسبك وابدأ استكشاف الإمكانيات اللامحدودة لتطوير مهارات طفلك.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 relative z-10">
          {[
            {
              title: 'دخول الأبطال',
              desc: 'سجل دخولك لمواصلة رحلتك التعليمية المليئة بالمرح والإنجازات اليومية.',
              icon: <VpnKeyIcon sx={{ fontSize: 40 }} />,
              href: '/login',
              gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              badge: 'مرحباً بعودتك'
            },
            {
              title: 'حساب ولي الأمر',
              desc: 'ابدأ رحلة طفلك الآن من خلال إنشاء ملف تعريفي مخصص لبرنامج علاجي متكامل.',
              icon: <FamilyRestroomIcon sx={{ fontSize: 40 }} />,
              href: '/register',
              gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
              highlight: true,
              badge: 'الأكثر اختياراً'
            },
            {
              title: 'حساب الأخصائي',
              desc: 'انضم كمحترف لمتابعة حالات الأطفال وتقديم الدعم والتقارير الدقيقة لأولياء الأمور.',
              icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
              href: '/register/specialist',
              gradient: 'linear-gradient(135deg, #083344 0%, #06b6d4 100%)',
              badge: 'للمختصين'
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {card.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-linear-to-r from-warning-400 to-orange-500 text-black font-black text-[10px] tracking-widest uppercase z-20 shadow-xl border border-warning-200">
                  {card.badge}
                </div>
              )}
              {!card.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 font-black text-[9px] tracking-[0.2em] uppercase z-20">
                  {card.badge}
                </div>
              )}
              
              <Link href={card.href} className="block no-underline h-full">
                <div 
                  className={cn(
                    "card-hover rounded-[3rem] p-8 text-center text-white h-full flex flex-col items-center justify-between border transition-all duration-500",
                    card.highlight ? "bg-white/10 border-white/20 shadow-2xl scale-105" : "bg-white/5 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full bg-white" />
                    <div 
                      className="w-20 h-20 rounded-4xl flex items-center justify-center relative z-10 shadow-inner"
                      style={{ background: card.gradient }}
                    >
                      {card.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{card.title}</h3>
                    <p className="text-white/60 text-sm font-medium leading-relaxed mb-10 px-4">{card.desc}</p>
                  </div>

                  <div 
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all",
                      card.highlight ? "bg-white text-primary-900 shadow-xl" : "bg-white/10 text-white group-hover:bg-white/20"
                    )}
                  >
                    <span>ابدأ التجربة</span>
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section py-32 bg-background relative overflow-hidden">
        <div className="text-center mb-20 relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="inline-block px-8 py-2.5 rounded-2xl text-[10px] font-black mb-6 uppercase tracking-[0.4em] bg-primary-100 text-primary-700 shadow-sm"
            >
              خدماتنا الرئيسية
            </span>
            <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-neutral-900 leading-[1.1]">
              نظام علاجي <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-accent-600">شامل</span> وذكي
            </h2>
            <p className="text-lg sm:text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
              لقد بنينا رفيق ليكون مرجعاً تقنياً متكاملاً يغطي كافة جوانب التطور الاجتماعي للطفل عبر ٣ ركائز أساسية.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 relative z-10">
          {[
            {
              icon: <VisibilityIcon sx={{ fontSize: 32 }} />,
              title: 'التعرف الاجتماعي',
              desc: 'الأساس الذي يبدأ منه الطفل بربط الصور والمسميات بالأشخاص والأشياء الحقيقية في عالمه الخاص.',
              items: ['الأشخاص المقربين', 'الأماكن المألوفة', 'الأشياء اليومية'],
              color: 'var(--color-primary-500)',
              glow: 'rgba(59, 130, 246, 0.4)'
            },
            {
              icon: <HandshakeIcon sx={{ fontSize: 32 }} />,
              title: 'التفاعل الاجتماعي',
              desc: 'تجاوز حدود الصور الثابتة إلى فهم لغة الجسد، تعابير الوجه، وكيفية الاستجابة للإشارات الاجتماعية.',
              items: ['لغة الجسد', 'تعابير الوجه', 'التحكم في الانفعال'],
              color: 'var(--color-accent-500)',
              glow: 'rgba(139, 92, 246, 0.4)'
            },
            {
              icon: <ChatIcon sx={{ fontSize: 32 }} />,
              title: 'التواصل الاجتماعي',
              desc: 'المرحلة المتقدمة التي تفتح آفاق الحوار الصوتي المباشر مع الذكاء الاصطناعي لتحسين النطق والحوار.',
              items: ['محادثة صوتية', 'تحليل المشاعر', 'سرد القصص'],
              color: 'var(--color-success-500)',
              glow: 'rgba(34, 197, 94, 0.4)'
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center"
            >
              <div 
                className="absolute inset-x-8 -bottom-4 h-full bg-neutral-200/20 blur-2xl rounded-[3rem] -z-10 group-hover:bg-primary-500/10 transition-colors"
                style={{ backgroundColor: service.glow.replace('0.4', '0.05') }}
              />
              <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 flex flex-col items-center h-full transition-all duration-500 group-hover:-translate-y-4 shadow-premium group-hover:shadow-2xl">
                <div
                  className="w-20 h-20 rounded-4xl mb-8 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl"
                  style={{ background: service.color, boxShadow: `0 10px 30px -5px ${service.glow}` }}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-base font-medium leading-relaxed mb-8 text-neutral-500 text-center">
                  {service.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {service.items.map((item, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-neutral-50 border border-neutral-100 text-neutral-400 group-hover:bg-primary-50/50 group-hover:text-primary-600 group-hover:border-primary-100 transition-all"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-20 relative z-10">
          <button
            onClick={() => setServicesOpen(true)}
            className="group px-10 py-5 rounded-2xl bg-neutral-900 text-white font-black text-sm hover:bg-black transition-all shadow-xl flex items-center gap-3 mx-auto"
          >
            <span>استعرض التفاصيل الكاملة</span>
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section py-32 relative">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-black text-xs uppercase tracking-[0.4em] mb-4 inline-block">الأسئلة الشائعة</span>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight text-neutral-900">لديكم أسئلة؟ <span className="text-primary-600">لدينا إجابات</span></h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "rounded-3xl border transition-all duration-300 overflow-hidden",
                  activeFaq === i ? "bg-white border-primary-200 shadow-xl" : "bg-neutral-50/50 border-neutral-100 hover:border-neutral-200"
                )}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-right gap-4"
                >
                  <span className={cn(
                    "font-black text-lg transition-colors",
                    activeFaq === i ? "text-primary-600" : "text-neutral-900"
                  )}>{item.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={cn(
                      "text-neutral-400 transition-transform duration-300 shrink-0",
                      activeFaq === i && "rotate-180 text-primary-500"
                    )} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-neutral-500 font-medium leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[4rem] bg-neutral-900 p-12 lg:p-24 overflow-hidden text-center">
             {/* Background Effects */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-600/20 to-accent-600/20" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/10 blur-[100px] rounded-full animate-blob [animation-delay:2s]" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">جاهز لتبدأ <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-accent-400">قصة نجاح</span> طفلك؟</h2>
              <p className="text-lg lg:text-xl text-white/60 mb-12 font-medium">انضم إلى مجتمع رفيق اليوم وامنح طفلك الأدوات التي يحتاجها للتواصل مع العالم بثقة حقيقية.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/register" 
                  className="w-full sm:w-auto px-12 py-6 rounded-3xl bg-white text-neutral-900 font-black text-lg hover:scale-105 transition-all shadow-2xl no-underline"
                >
                  ابدأ مجاناً الآن
                </Link>
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-12 py-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all no-underline"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <SliderModal slides={introSlides} isOpen={introOpen} onClose={() => setIntroOpen(false)} />
      <SliderModal slides={serviceSlides} isOpen={servicesOpen} onClose={() => setServicesOpen(false)} />
    </div>
  );
}
