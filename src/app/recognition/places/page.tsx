'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Settings, Plus, MapPin } from 'lucide-react';
import SessionCard from '@/components/cards/SessionCard';
import RecognitionCard from '@/components/cards/RecognitionCard';
import HomeIcon from '@mui/icons-material/Home';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const demoPlaces = [
  { id: '1', name: 'بيتي', category: 'المنزل', imageUrl: 'https://ui-avatars.com/api/?name=Home&background=06b6d4&color=fff&size=200' },
  { id: '2', name: 'مدرستي', category: 'التعليم', imageUrl: 'https://ui-avatars.com/api/?name=School&background=3b82f6&color=fff&size=200' },
  { id: '3', name: 'بيت جدو', category: 'عائلة', imageUrl: 'https://ui-avatars.com/api/?name=Grandpa&background=a855f7&color=fff&size=200' },
  { id: '4', name: 'الحديقة', category: 'ترفيه', imageUrl: 'https://ui-avatars.com/api/?name=Park&background=22c55e&color=fff&size=200' },
];

export default function PlacesPage() {
  const [places] = useState(demoPlaces);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const speakName = (name: string, id: string) => {
    setSpeakingId(id);
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = 'ar-EG';
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto py-8 px-4"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-bold flex-row-reverse">
        <Link href="/dashboard" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">الرئيسية</Link>
        <span className="text-neutral-300">/</span>
        <Link href="/recognition" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">التعرف الاجتماعي</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-primary-600">الأماكن</span>
      </nav>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-right">
        <div className="flex items-center justify-between flex-row-reverse">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3 justify-end flex-row-reverse" style={{ color: 'var(--neutral-900)' }}>
              التعرف على الأماكن
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 shadow-sm border border-cyan-100">
                <HomeIcon sx={{ fontSize: 32 }} />
              </div>
            </h1>
            <p className="text-base sm:text-lg text-neutral-500 font-medium ml-auto max-w-lg">
              تعرف على الأماكن المهمة من حولك واربطها بذكرياتك الجميلة
            </p>
          </div>
          <Link
            href="/recognition/settings?type=place"
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-premium hover:scale-110 active:scale-95 group no-underline bg-white border border-neutral-100"
          >
            <Settings size={24} className="text-neutral-500 group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>
      </motion.div>

      <div className="mb-12">
        <SessionCard phase="المرحلة الأولى" module="التعرف على الأماكن" continueUrl="/recognition/places" isActive={true} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {places.map((place) => (
            <motion.div 
              key={place.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div onClick={() => speakName(place.name, place.id)} className="cursor-pointer h-full">
                <RecognitionCard name={place.name} category={place.category} imageUrl={place.imageUrl} onEdit={() => {}} onDelete={() => {}} />
              </div>
              
              <AnimatePresence>
                {speakingId === place.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl flex items-center gap-2 z-30 shadow-blue-glow bg-linear-to-r from-cyan-500 to-cyan-600 text-white"
                  >
                    <VolumeUpIcon sx={{ fontSize: 18 }} className="animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-wider">{place.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        <Link
          href="/recognition/settings?type=place"
          className="rounded-[2.5rem] border-4 border-dashed border-neutral-200 flex flex-col items-center justify-center min-h-[320px] transition-all no-underline cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 group"
        >
          <div className="w-16 h-16 rounded-3xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-cyan-100 group-hover:text-cyan-500 transition-colors shadow-inner">
            <Plus size={40} />
          </div>
          <span className="text-lg font-black mt-4 text-neutral-400 group-hover:text-cyan-600 transition-colors">إضافة مكان جديد</span>
        </Link>
      </div>
    </motion.div>
  );
}
