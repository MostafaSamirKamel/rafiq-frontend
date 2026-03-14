'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import SessionCard from '@/components/cards/SessionCard';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const emotions = [
  { id: 'happy', name: 'سعادة', description: 'التعبير عن الفرح والسعادة', icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 32 }} />, color: '#22c55e' },
  { id: 'sad', name: 'حزن', description: 'التعبير عن الحزن والضيق', icon: <SentimentVeryDissatisfiedIcon sx={{ fontSize: 32 }} />, color: '#3b82f6' },
  { id: 'angry', name: 'غضب', description: 'التعبير عن الغضب والانزعاج', icon: <MoodBadIcon sx={{ fontSize: 32 }} />, color: '#ef4444' },
];

type Phase = 'list' | 'video' | 'quiz';

export default function EmotionsPage() {
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('list');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  const currentEmotion = emotions.find((e) => e.id === activeEmotion);

  const startTraining = (id: string) => {
    setActiveEmotion(id);
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
    const isCorrect = answerId === activeEmotion;
    setQuizResult(isCorrect);
    if (isCorrect) toast.success('أحسنت! إجابة صحيحة');
    else toast.error('حاول مرة أخرى');
  };

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
        <span className="text-primary-600">المشاعر</span>
      </nav>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-right">
        <Link href="/interaction" className="inline-flex items-center gap-2 text-sm font-black no-underline mb-6 text-primary-600 hover:gap-3 transition-all flex-row-reverse group">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للتفاعل الاجتماعي
        </Link>
        <div className="flex items-center gap-4 mb-3 justify-end lg:justify-start flex-row-reverse">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            فهم المشاعر البشرية
          </h1>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm border border-pink-100">
            <EmojiEmotionsIcon sx={{ fontSize: 32 }} />
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-xl ml-auto">
          اكتشف عالم المشاعر وتعلم كيف تتعرف على ما يشعر به الآخرون من حولك من خلال تعابير وجوههم
        </p>
      </motion.div>

      <div className="mb-12">
        <SessionCard phase="المرحلة الثانية" module="فهم المشاعر" continueUrl="/interaction/emotions" isActive={true} />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid sm:grid-cols-3 gap-6">
            {emotions.map((emotion, i) => (
              <motion.button
                key={emotion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => startTraining(emotion.id)}
                className="group rounded-[2.5rem] p-8 bg-white glass border border-neutral-100 shadow-premium card-hover text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="mb-4 flex justify-center" 
                  style={{ color: emotion.color }}
                >
                  {React.cloneElement(emotion.icon as React.ReactElement<any>, { sx: { fontSize: 64 } })}
                </motion.div>
                <h3 className="text-2xl font-black text-neutral-800 mb-2 tracking-tight">{emotion.name}</h3>
                <p className="text-sm font-medium text-neutral-500 leading-relaxed">{emotion.description}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {phase === 'video' && currentEmotion && (
          <motion.div key="video" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            <div className="rounded-[3rem] overflow-hidden bg-white glass border border-white/50 shadow-premium flex flex-col">
              <div className="aspect-video flex flex-col items-center justify-center relative overflow-hidden group" style={{ background: `linear-gradient(135deg, ${currentEmotion.color}20, ${currentEmotion.color}05)` }}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-6 z-10" 
                  style={{ color: currentEmotion.color }}
                >
                  {React.cloneElement(currentEmotion.icon as React.ReactElement<any>, { sx: { fontSize: 80 } })}
                </motion.div>
                <h3 className="text-3xl font-black z-10 tracking-tight" style={{ color: currentEmotion.color }}>{currentEmotion.name}</h3>
                <p className="text-base font-bold mt-2 z-10 text-neutral-500">{currentEmotion.description}</p>
                
                <div className="mt-8 w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-xl cursor-pointer hover:scale-110 transition-all z-10" style={{ color: currentEmotion.color }}>
                  <PlayArrowIcon sx={{ fontSize: 40 }} />
                </div>
              </div>
              <div className="p-8 flex items-center justify-center gap-4 bg-white/50 backdrop-blur-md">
                <button onClick={() => setPhase('list')} className="px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-black text-sm flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                   العودة
                </button>
                <button className="px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-black text-sm flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                  <ReplayIcon sx={{ fontSize: 20 }} /> إعادة
                </button>
                <button onClick={startQuiz} className="px-8 py-3 rounded-2xl bg-linear-to-r from-primary-600 to-primary-700 text-white font-black text-sm flex items-center gap-2 shadow-blue-glow hover:scale-105 transition-all">
                  بدء الاختبار <TaskAltIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'quiz' && currentEmotion && (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            <div className="rounded-[3rem] p-8 sm:p-12 bg-white glass border border-white/50 shadow-premium text-center">
              <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-black border border-primary-100 mb-6 inline-block">تحدي المشاعر</span>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 text-neutral-800 tracking-tight">ما هو هذا الشعور؟</h2>
              <p className="text-base font-medium mb-10 text-neutral-500">انظر إلى التعبير التالي واختر الاسم الصحيح له</p>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-12 flex justify-center" 
                style={{ color: currentEmotion.color }}
              >
                {React.cloneElement(currentEmotion.icon as React.ReactElement<any>, { sx: { fontSize: 100 } })}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {emotions.map((emotion) => {
                  let status = 'default';
                  if (quizAnswer === emotion.id) status = quizResult ? 'correct' : 'wrong';
                  if (quizResult === false && emotion.id === activeEmotion) status = 'correct';

                  return (
                    <button 
                      key={emotion.id} 
                      onClick={() => !quizAnswer && handleQuizAnswer(emotion.id)} 
                      disabled={!!quizAnswer}
                      className={cn(
                        "p-6 rounded-3xl text-center transition-all border-4 flex flex-col items-center gap-3 group bg-neutral-50/50 hover:bg-white",
                        status === 'default' && "border-neutral-100 hover:border-primary-300",
                        status === 'correct' && "border-success-500 bg-success-50",
                        status === 'wrong' && "border-danger-500 bg-danger-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                        status === 'default' ? "text-neutral-400" : "text-white opacity-100",
                        status === 'correct' && "bg-success-500",
                        status === 'wrong' && "bg-danger-500"
                      )} style={{ color: status === 'default' ? emotion.color : undefined }}>
                        {React.cloneElement(emotion.icon as React.ReactElement<any>, { sx: { fontSize: 32 } })}
                      </div>
                      <span className={cn(
                        "font-black text-base tracking-tight",
                        status === 'default' ? "text-neutral-600" : (status === 'correct' ? "text-success-700" : "text-danger-700")
                      )}>{emotion.name}</span>
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
                      <span className="font-black text-lg tracking-tight">رائع! عرفت الشعور بشكل صحيح</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-danger-700">
                      <div className="flex items-center gap-3">
                        <HighlightOffIcon sx={{ fontSize: 24 }} />
                        <span className="font-black text-lg tracking-tight">ليس تماماً، جرب مرة أخرى</span>
                      </div>
                      <button onClick={() => startTraining(activeEmotion!)} className="mt-2 px-6 py-2 rounded-xl bg-white text-danger-600 font-black text-sm border border-danger-100 hover:bg-danger-50 transition-colors flex items-center gap-2">
                        <ReplayIcon sx={{ fontSize: 18 }} /> إعادة التعلم
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {quizResult === true && (
                <button onClick={() => { setPhase('list'); setActiveEmotion(null); }} className="w-full py-4 rounded-2xl bg-linear-to-r from-primary-600 to-primary-700 text-white font-black text-lg shadow-blue-glow hover:scale-105 transition-all">
                  التالي
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
