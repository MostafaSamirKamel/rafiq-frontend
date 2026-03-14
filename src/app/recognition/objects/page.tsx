'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Settings, Plus } from 'lucide-react';
import SessionCard from '@/components/cards/SessionCard';
import RecognitionCard from '@/components/cards/RecognitionCard';
import ToysIcon from '@mui/icons-material/Toys';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const demoObjects = [
  { id: '1', name: 'تفاحة', category: 'فواكه', imageUrl: 'https://ui-avatars.com/api/?name=Apple&background=ef4444&color=fff&size=200' },
  { id: '2', name: 'موزة', category: 'فواكه', imageUrl: 'https://ui-avatars.com/api/?name=Banana&background=facc15&color=000&size=200' },
  { id: '3', name: 'طماطم', category: 'خضروات', imageUrl: 'https://ui-avatars.com/api/?name=Tomato&background=dc2626&color=fff&size=200' },
  { id: '4', name: 'قطة', category: 'حيوانات', imageUrl: 'https://ui-avatars.com/api/?name=Cat&background=f97316&color=fff&size=200' },
  { id: '5', name: 'عربية', category: 'مواصلات', imageUrl: 'https://ui-avatars.com/api/?name=Car&background=3b82f6&color=fff&size=200' },
  { id: '6', name: 'كلب', category: 'حيوانات', imageUrl: 'https://ui-avatars.com/api/?name=Dog&background=a855f7&color=fff&size=200' },
  { id: '7', name: 'برتقالة', category: 'فواكه', imageUrl: 'https://ui-avatars.com/api/?name=Orange&background=f97316&color=fff&size=200' },
  { id: '8', name: 'خيار', category: 'خضروات', imageUrl: 'https://ui-avatars.com/api/?name=Cucumber&background=22c55e&color=fff&size=200' },
];

export default function ObjectsPage() {
  const [objects] = useState(demoObjects);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('الكل');

  const categories = ['الكل', 'فواكه', 'خضروات', 'حيوانات', 'مواصلات'];

  const filteredObjects = objects.filter(obj => 
    activeCategory === 'الكل' || obj.category === activeCategory
  );

  const speakName = (name: string, id: string) => {
    setSpeakingId(id);
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = 'ar-EG';
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen pb-20 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-accent-100/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-10 text-sm font-bold flex-row-reverse"
        >
          <Link href="/dashboard" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">الرئيسية</Link>
          <span className="text-neutral-300">/</span>
          <Link href="/recognition" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">التعرف الاجتماعي</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-600">الأشياء</span>
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 text-right relative"
        >
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center gap-4 justify-end flex-row-reverse tracking-tighter" style={{ color: 'var(--neutral-900)' }}>
                التعرف على الأشياء
                <div className="w-16 h-16 rounded-3xl bg-warning-100 flex items-center justify-center text-warning-600 shadow-warm-glow border-2 border-white/50 animate-float">
                  <ToysIcon sx={{ fontSize: 40 }} />
                </div>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-500 font-medium ml-auto max-w-2xl leading-relaxed">
                اضغط على أي شيء لتسمع اسمه وتتعرف عليه في بيئتك المحيطة. تعلم أسماء الأشياء يساعدك على التفاعل بشكل أفضل مع العالم حولك.
              </p>
            </div>
            <Link
              href="/recognition/settings?type=object"
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-premium hover:shadow-floating active:scale-95 group no-underline bg-white border border-neutral-100"
            >
              <Settings size={28} className="text-neutral-400 group-hover:text-primary-500 group-hover:rotate-90 transition-all duration-700" />
            </Link>
          </div>
        </motion.div>

        <div className="mb-14">
          <SessionCard phase="المرحلة الأولى" module="التعرف على الأشياء" continueUrl="/recognition/objects" isActive={true} />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-4 mb-16 justify-end">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3.5 rounded-[1.25rem] text-sm font-black transition-all border-2 active:scale-95",
                activeCategory === cat 
                  ? "bg-primary-500 border-primary-500 text-white shadow-blue-glow scale-105" 
                  : "bg-white border-white/80 text-neutral-500 hover:border-primary-200 shadow-premium"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredObjects.map((obj) => (
              <motion.div 
                key={obj.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <div onClick={() => speakName(obj.name, obj.id)} className="cursor-pointer">
                  <RecognitionCard name={obj.name} category={obj.category} imageUrl={obj.imageUrl} onEdit={() => {}} onDelete={() => {}} />
                </div>
                <AnimatePresence>
                  {speakingId === obj.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 15 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl flex items-center gap-3 z-30 shadow-blue-glow bg-linear-to-r from-primary-600 to-primary-700 text-white border border-white/20 backdrop-blur-md"
                    >
                      <VolumeUpIcon sx={{ fontSize: 20 }} className="animate-pulse" />
                      <span className="text-sm font-black uppercase tracking-widest">{obj.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link
              href="/recognition/settings?type=object"
              className="rounded-[2.5rem] border-4 border-dashed border-neutral-200 flex flex-col items-center justify-center min-h-[340px] transition-all no-underline cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 group bg-white/50 backdrop-blur-sm shadow-premium card-hover"
            >
              <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary-100 group-hover:text-primary-500 transition-all shadow-inner group-hover:scale-110">
                <Plus size={48} />
              </div>
              <span className="text-xl font-black mt-6 text-neutral-400 group-hover:text-primary-600 transition-colors">إضافة شيء جديد</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
