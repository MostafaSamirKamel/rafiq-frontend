'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Settings, Plus } from 'lucide-react';
import SessionCard from '@/components/cards/SessionCard';
import RecognitionCard from '@/components/cards/RecognitionCard';
import PeopleIcon from '@mui/icons-material/People';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const demoPeople = [
  { id: '1', name: 'بابا علي', relation: 'الأب', imageUrl: 'https://ui-avatars.com/api/?name=Ali&background=3b82f6&color=fff&size=200' },
  { id: '2', name: 'ماما سارة', relation: 'الأم', imageUrl: 'https://ui-avatars.com/api/?name=Sara&background=ec4899&color=fff&size=200' },
  { id: '3', name: 'جدو محمد', relation: 'الجد', imageUrl: 'https://ui-avatars.com/api/?name=Mohamed&background=f59e0b&color=fff&size=200' },
  { id: '4', name: 'تيتا فاطمة', relation: 'الجدة', imageUrl: 'https://ui-avatars.com/api/?name=Fatma&background=8b5cf6&color=fff&size=200' },
];

export default function PeoplePage() {
  const [people] = useState(demoPeople);
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
          <span className="text-primary-600">الأشخاص</span>
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 text-right relative"
        >
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center gap-4 justify-end flex-row-reverse tracking-tighter" style={{ color: 'var(--neutral-900)' }}>
                التعرف على الأشخاص
                <div className="w-16 h-16 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-blue-glow border-2 border-white/50 animate-float">
                  <PeopleIcon sx={{ fontSize: 40 }} />
                </div>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-500 font-medium ml-auto max-w-2xl leading-relaxed">
                اضغط على بطاقة أي شخص للتعرف على اسمه وعلاقته بك لنساعدك في تذكرهم دائماً. التواصل يبدأ بالتعرف على من حولنا.
              </p>
            </div>
            <Link
              href="/recognition/settings?type=person"
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-premium hover:shadow-floating active:scale-95 group no-underline bg-white border border-neutral-100"
            >
              <Settings size={28} className="text-neutral-400 group-hover:text-primary-500 group-hover:rotate-90 transition-all duration-700" />
            </Link>
          </div>
        </motion.div>

        <div className="mb-14">
          <SessionCard phase="المرحلة الأولى" module="التعرف على الأشخاص" continueUrl="/recognition/people" isActive={true} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {people.map((person) => (
              <motion.div 
                key={person.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <div onClick={() => speakName(person.name, person.id)} className="cursor-pointer">
                  <RecognitionCard
                    name={person.name}
                    relation={person.relation}
                    imageUrl={person.imageUrl}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
                
                <AnimatePresence>
                  {speakingId === person.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 15 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl flex items-center gap-3 z-30 shadow-blue-glow bg-linear-to-r from-primary-600 to-primary-700 text-white border border-white/20 backdrop-blur-md"
                    >
                      <VolumeUpIcon sx={{ fontSize: 20 }} className="animate-pulse" />
                      <span className="text-sm font-black uppercase tracking-widest">{person.name}</span>
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
              href="/recognition/settings?type=person"
              className="rounded-[2.5rem] border-4 border-dashed border-neutral-200 flex flex-col items-center justify-center min-h-[340px] transition-all no-underline cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 group bg-white/50 backdrop-blur-sm shadow-premium card-hover"
            >
              <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary-100 group-hover:text-primary-500 transition-all shadow-inner group-hover:scale-110">
                <Plus size={48} />
              </div>
              <span className="text-xl font-black mt-6 text-neutral-400 group-hover:text-primary-600 transition-colors">إضافة شخص جديد</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
