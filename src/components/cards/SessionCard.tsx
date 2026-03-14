'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SessionCardProps {
  phase?: string;
  module?: string;
  startTime?: string;
  isActive?: boolean;
  continueUrl?: string;
}

export default function SessionCard({
  phase = 'المرحلة الأولى',
  module = 'التعرف الاجتماعي',
  startTime,
  isActive = false,
  continueUrl = '/recognition',
}: SessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 gradient-hero shadow-blue-glow card-hover"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full gradient-shimmer opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
      
      <div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-30 bg-white"
      />
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20 bg-white"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {isActive ? (
              <motion.span 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                className="flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black bg-white/20 text-white backdrop-blur-xl border border-white/20 uppercase tracking-widest"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.9)]" />
                جلسة مستمرة
              </motion.span>
            ) : (
              <span className="flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black bg-white/10 text-white backdrop-blur-md border border-white/10 uppercase tracking-widest">
                <Clock size={14} />
                الجلسة التالية
              </span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <motion.h3 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white text-3xl sm:text-4xl font-black mb-2 tracking-tight"
          >
            {phase}
          </motion.h3>
          <motion.p 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg sm:text-xl font-medium"
          >
            {module}
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-10">
          {startTime && (
            <div className="flex items-center gap-2.5 text-white/90 text-sm font-bold bg-white/10 py-2.5 px-5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Clock size={16} />
              {startTime}
            </div>
          )}

          <Link
            href={continueUrl}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-primary-700 font-black text-sm transition-all hover:bg-neutral-50 hover:scale-105 active:scale-95 no-underline shadow-floating"
          >
            {isActive ? 'متابعة الجلسة' : 'بدء الجلسة'}
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
