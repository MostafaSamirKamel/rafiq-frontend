'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import SessionCard from '@/components/cards/SessionCard';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import PanToolIcon from '@mui/icons-material/PanTool';
import BackHandIcon from '@mui/icons-material/BackHand';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const signals = [
  { id: 'hello', name: 'مرحباً', description: 'التلويح باليد للتحية', icon: <WavingHandIcon sx={{ fontSize: 32 }} />, color: '#3b82f6' },
  { id: 'stop', name: 'قف', description: 'رفع اليد للإيقاف', icon: <PanToolIcon sx={{ fontSize: 32 }} />, color: '#ef4444' },
  { id: 'good', name: 'ممتاز', description: 'إشارة اليد للإعجاب', icon: <BackHandIcon sx={{ fontSize: 32 }} />, color: '#22c55e' },
];

type Phase = 'list' | 'video' | 'quiz';

export default function SignalsPage() {
  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('list');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  const currentSignal = signals.find((s) => s.id === activeSignal);

  const startTraining = (id: string) => {
    setActiveSignal(id);
    setPhase('video');
    setQuizAnswer(null);
    setQuizResult(null);
  };

  const startQuiz = () => {
    setPhase('quiz');
    setQuizAnswer(null);
    setQuizResult(null);
  };

  const handleQuizAnswer = (answerId: string) => {
    setQuizAnswer(answerId);
    const isCorrect = answerId === activeSignal;
    setQuizResult(isCorrect);
    if (isCorrect) toast.success('أحسنت! إجابة صحيحة');
    else toast.error('حاول مرة أخرى');
  };

  const shuffledOptions = useMemo(() => {
    if (!activeSignal) return [];
    const options = [...signals].sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.find((o) => o.id === activeSignal)) {
      options[Math.floor(Math.random() * 3)] = signals.find((s) => s.id === activeSignal)!;
    }
    return options;
  }, [activeSignal]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-bold flex-row-reverse">
        <Link href="/dashboard" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">الرئيسية</Link>
        <span className="text-neutral-300">/</span>
        <Link href="/interaction" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">التفاعل الاجتماعي</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-primary-600">الإشارات</span>
      </nav>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-right">
        <Link href="/interaction" className="inline-flex items-center gap-2 text-sm font-black no-underline mb-6 text-primary-600 hover:gap-3 transition-all flex-row-reverse group">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للتفاعل الاجتماعي
        </Link>
        <div className="flex items-center gap-4 mb-3 justify-end lg:justify-start flex-row-reverse">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            فهم الإشارات الاجتماعية
          </h1>
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
            <WavingHandIcon sx={{ fontSize: 32 }} />
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-xl ml-auto">
          تعلم كيف تستخدم يديك وجسدك للتواصل مع الآخرين بسهولة من خلال فيديوهات توضيحية وتمارين ممتعة
        </p>
      </motion.div>

      <div className="mb-12">
        <SessionCard phase="المرحلة الثانية" module="فهم الإشارات" continueUrl="/interaction/signals" isActive={true} />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid sm:grid-cols-2 gap-6">
            {signals.map((signal, i) => (
              <motion.button
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => startTraining(signal.id)}
                className="group rounded-3xl p-6 bg-white glass border border-neutral-100 shadow-premium card-hover text-right"
              >
                <div className="flex items-center gap-5 flex-row-reverse">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform" style={{ background: `${signal.color}15`, color: signal.color }}>
                    {React.cloneElement(signal.icon as React.ReactElement<any>, { sx: { fontSize: 36 } })}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-800 tracking-tight">{signal.name}</h3>
                    <p className="text-sm font-medium text-neutral-500 mt-1">{signal.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {phase === 'video' && currentSignal && (
          <motion.div key="video" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-2xl mx-auto">
            <div className="rounded-[3rem] overflow-hidden bg-white glass border border-white/50 shadow-premium flex flex-col">
              <div className="aspect-video relative group flex flex-col items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${currentSignal.color}20, ${currentSignal.color}05)` }}>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6 z-10" 
                  style={{ color: currentSignal.color }}
                >
                  {React.cloneElement(currentSignal.icon as React.ReactElement<any>, { sx: { fontSize: 80 } })}
                </motion.div>
                <h3 className="text-3xl font-black z-10 tracking-tight" style={{ color: currentSignal.color }}>{currentSignal.name}</h3>
                <p className="text-base font-bold mt-2 z-10 text-neutral-500">{currentSignal.description}</p>
                
                <div className="mt-8 w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-10" style={{ color: currentSignal.color }}>
                  <PlayArrowIcon sx={{ fontSize: 40 }} />
                </div>
              </div>
              <div className="p-8 flex items-center justify-center gap-4 bg-white/50 backdrop-blur-md">
                <button onClick={() => setPhase('list')} className="px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-black text-sm flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                  <ArrowRight size={18} /> العودة
                </button>
                <button className="px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-black text-sm flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                  <ReplayIcon sx={{ fontSize: 20 }} /> إعادة
                </button>
                <button onClick={startQuiz} className="px-8 py-3 rounded-2xl bg-linear-to-r from-primary-600 to-primary-700 text-white font-black text-sm flex items-center gap-2 shadow-blue-glow hover:scale-105 active:scale-95 transition-all">
                  بدء الاختبار <TaskAltIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'quiz' && currentSignal && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-2xl mx-auto">
            <div className="rounded-[3rem] p-8 sm:p-12 bg-white glass border border-white/50 shadow-premium text-center">
              <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest border border-primary-100 mb-6 inline-block">تحدي الذكاء</span>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 text-neutral-800 tracking-tight">ما هي هذه الإشارة؟</h2>
              <p className="text-base font-medium mb-10 text-neutral-500">اختر الإجابة الصحيحة التي تماثل الحركة في الصورة</p>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-12 flex justify-center" 
                style={{ color: currentSignal.color }}
              >
                {React.cloneElement(currentSignal.icon as React.ReactElement<any>, { sx: { fontSize: 100 } })}
              </motion.div>
 
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {shuffledOptions.map((option) => {
                  let status = 'default';
                  if (quizAnswer === option.id) status = quizResult ? 'correct' : 'wrong';
                  if (quizResult === false && option.id === activeSignal) status = 'correct';
                  
                  return (
                    <button 
                      key={option.id} 
                      onClick={() => !quizAnswer && handleQuizAnswer(option.id)} 
                      disabled={!!quizAnswer}
                      className={cn(
                        "p-6 rounded-3xl text-center transition-all border-4 flex flex-col items-center gap-3 group relative overflow-hidden",
                        status === 'default' && "border-neutral-100 bg-neutral-50/50 hover:border-primary-300 hover:bg-white",
                        status === 'correct' && "border-success-500 bg-success-50 shadow-sm",
                        status === 'wrong' && "border-danger-500 bg-danger-50 shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        status === 'default' ? "text-neutral-400" : "text-white opacity-100",
                        status === 'correct' && "bg-success-500",
                        status === 'wrong' && "bg-danger-500"
                      )} style={{ color: status === 'default' ? option.color : undefined }}>
                        {React.cloneElement(option.icon as React.ReactElement<any>, { sx: { fontSize: 28 } })}
                      </div>
                      <span className={cn(
                        "font-black text-base tracking-tight",
                        status === 'default' ? "text-neutral-600" : (status === 'correct' ? "text-success-700" : "text-danger-700")
                      )}>{option.name}</span>
                    </button>
                  );
                })}
              </div>
 
              {quizResult !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn(
                  "p-5 rounded-2xl mb-6",
                  quizResult ? "bg-success-50 border border-success-100" : "bg-danger-50 border border-danger-100"
                )}>
                  {quizResult ? (
                    <div className="flex items-center justify-center gap-3 text-success-700">
                      <TaskAltIcon sx={{ fontSize: 24 }} />
                      <span className="font-black text-lg tracking-tight">أحسنت بطل! إجابة صحيحة جداً</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-danger-700">
                      <div className="flex items-center gap-3">
                        <HighlightOffIcon sx={{ fontSize: 24 }} />
                        <span className="font-black text-lg tracking-tight">لا بأس، حاول مرة أخرى لتتعلم</span>
                      </div>
                      <button onClick={() => startTraining(activeSignal!)} className="mt-2 px-6 py-2 rounded-xl bg-white text-danger-600 font-black text-sm border border-danger-100 hover:bg-danger-50 transition-colors flex items-center gap-2">
                        <ReplayIcon sx={{ fontSize: 18 }} /> إعادة التدريب
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
 
              {quizResult === true && (
                <button onClick={() => { setPhase('list'); setActiveSignal(null); }} className="w-full py-4 rounded-2xl bg-linear-to-r from-primary-600 to-primary-700 text-white font-black text-lg shadow-blue-glow hover:scale-105 active:scale-95 transition-all">
                  استمر للخطوة التالية
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
