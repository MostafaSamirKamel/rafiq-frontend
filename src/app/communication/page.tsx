'use client';

// Define types for Web Speech API
interface ISpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-toastify';
import SessionCard from '@/components/cards/SessionCard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const aiQuestions = [
  'إزيك؟ عامل إيه؟',
  'اسمك إيه؟',
  'عندك كام سنة؟',
  'بتحب تلعب إيه؟',
  'مين أحسن صاحب عندك؟',
];

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: 'مرحباً! أنا رفيق. هيا نتكلم مع بعض! إزيك؟ عامل إيه؟',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast.error('متصفحك لا يدعم التعرف على الصوت');
      return;
    }

    const recognition = new SpeechRecognitionAPI() as ISpeechRecognition;
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('حدث خطأ في التعرف على الصوت');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const nextIndex = (questionIndex + 1) % aiQuestions.length;
      setQuestionIndex(nextIndex);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `أحسنت! إجابة ممتازة!\n\n${aiQuestions[nextIndex]}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      speakText(aiMsg.text);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen pb-20 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-success-100/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-10 text-sm font-bold flex-row-reverse"
        >
          <Link href="/dashboard" className="text-neutral-400 hover:text-primary-600 transition-colors no-underline">الرئيسية</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-600">التواصل الاجتماعي</span>
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 text-right relative"
        >
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center gap-4 justify-end flex-row-reverse tracking-tighter" style={{ color: 'var(--neutral-900)' }}>
                التواصل الاجتماعي
                <div className="w-16 h-16 rounded-3xl bg-success-100 flex items-center justify-center text-success-600 shadow-warm-glow border-2 border-white/50 animate-float">
                  <SmartToyIcon sx={{ fontSize: 40 }} />
                </div>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-500 font-medium ml-auto max-w-2xl leading-relaxed">
                تحدث مع صديقك الذكي رفيق لتطوير مهارات الحوار والتعبير عن نفسك بثقة. رفيق هنا ليسمعك ويشاركك الحديث دائماً.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-14">
          <SessionCard phase="المرحلة الثالثة" module="التواصل الاجتماعي" continueUrl="/communication" isActive={true} />
        </div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[3rem] overflow-hidden glass-premium border border-white/40 shadow-floating flex flex-col relative"
          style={{ 
            height: 'calc(100vh - 400px)', 
            minHeight: '600px', 
          }}
        >
        {/* Chat Header */}
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/20 bg-linear-to-r from-primary-600 to-primary-700">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <SmartToyIcon className="text-white" sx={{ fontSize: 24 }} />
              </div>
              <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-success-500 border-2 border-primary-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
            <div className="text-right">
              <h3 className="font-black text-white text-lg tracking-tight">رفيق الذكي</h3>
              <span className="text-white/70 text-xs font-black uppercase tracking-widest">مساعدك التعليمي</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
              <VolumeUpIcon sx={{ fontSize: 22 }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-neutral-50/30 backdrop-blur-sm custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={cn(
                  "flex items-end gap-3 max-w-[85%]",
                  msg.role === 'user' ? "flex-row" : "flex-row-reverse"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md border",
                    msg.role === 'ai' 
                      ? "bg-linear-to-br from-primary-500 to-primary-600 text-white border-primary-400/30" 
                      : "bg-white text-neutral-500 border-neutral-100"
                  )}>
                    {msg.role === 'ai' ? <SmartToyIcon sx={{ fontSize: 22 }} /> : <PersonIcon sx={{ fontSize: 22 }} />}
                  </div>
                  
                  <div className={cn(
                    "p-5 rounded-3xl shadow-sm relative group transition-all",
                    msg.role === 'ai' 
                      ? "bg-white text-neutral-800 rounded-bl-lg shadow-premium border border-neutral-100/50" 
                      : "bg-linear-to-br from-primary-600 to-primary-700 text-white rounded-br-lg shadow-blue-glow border border-primary-500/20"
                  )}>
                    <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium text-right font-cairo">
                      {msg.text}
                    </p>
                    
                    {msg.role === 'ai' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="mt-4 flex items-center gap-2 text-xs font-black text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 py-1.5 px-3 rounded-xl border border-primary-100 shadow-sm"
                      >
                        <VolumeUpIcon sx={{ fontSize: 18 }} />
                        اسمع النطق
                      </button>
                    )}
                    
                    <span className={cn(
                      "absolute -top-6 text-[10px] font-black text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest",
                      msg.role === 'user' ? "right-0" : "left-0"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white shadow-premium border border-neutral-100">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">رفيق يفكر...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 sm:p-8 bg-white/60 backdrop-blur-xl border-t border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleListening}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-lg active:scale-95 group",
                isListening 
                  ? "bg-danger-500 text-white shadow-danger-500/30 animate-pulse" 
                  : "bg-white text-neutral-600 hover:bg-neutral-50 shadow-premium border border-neutral-100"
              )}
            >
              {isListening ? <MicOffIcon sx={{ fontSize: 24 }} /> : <MicIcon sx={{ fontSize: 24 }} className="group-hover:scale-110 transition-transform" />}
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-white/80 border-2 border-neutral-100 rounded-[1.25rem] px-6 py-4 outline-hidden focus:border-primary-500 focus:bg-white transition-all shadow-sm text-lg font-medium text-right font-cairo"
                placeholder={isListening ? '...أنا أسمعك الآن' : 'اكتب ردك هنا...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isListening}
              />
              {!inputText.trim() && !isListening && (
                <SendIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none" sx={{ fontSize: 20 }} />
              )}
            </div>

            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isThinking}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-lg active:scale-95 disabled:grayscale disabled:opacity-50",
                inputText.trim() 
                  ? "bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-blue-glow hover:scale-105" 
                  : "bg-neutral-100 text-neutral-400"
              )}
            >
              <SendIcon sx={{ fontSize: 24, transform: 'rotate(180deg)' }} />
            </button>
          </div>

          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mt-6 flex justify-center"
              >
                <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-danger-50 text-danger-600 border border-danger-100 shadow-sm animate-bounce">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                  </div>
                  <span className="text-sm font-black tracking-widest uppercase">
                    أنا بسمعك... اتكلم دلوقتي
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
