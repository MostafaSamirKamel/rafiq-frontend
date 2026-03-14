'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrainingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  delay?: number;
}

export default function TrainingCard({ title, description, icon, href, delay = 0 }: TrainingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.01, x: -5 }}
      className="w-full"
    >
      <Link href={href} className="block no-underline group">
        <div
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-premium hover:shadow-floating transition-all duration-500 cursor-pointer relative overflow-hidden flex items-center gap-6"
        >
          {/* Decorative Background Accent */}
          <div className="absolute top-0 right-0 w-1.5 h-full bg-linear-to-b from-primary-400 to-primary-600 opacity-80" />
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-primary-100/20 blur-3xl group-hover:bg-primary-200/30 transition-colors duration-700" />
          
          {/* Icon Section (Right in RTL) */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100/50 text-primary-600 shadow-sm border border-primary-100 shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 relative z-10"
          >
            <div className="flex items-center justify-center [&>svg]:w-9! [&>svg]:h-9!">
              {icon}
            </div>
          </div>

          {/* Text Content Section (Middle) */}
          <div className="flex-1 min-w-0 text-right relative z-10">
            <h3 className="font-black text-lg sm:text-xl text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors mb-1">
              {title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-500 font-medium line-clamp-2">
              {description}
            </p>
          </div>

          {/* Action Arrow (Left in RTL) */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-neutral-100 text-neutral-400 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all duration-300 shrink-0 relative z-10">
            <ArrowLeft size={20} className="translate-x-0 group-hover:-translate-x-1.5 transition-transform" />
          </div>

          {/* Bottom Interactive Label */}
          <div className="absolute bottom-2 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">
                ابدأ التدريب
             </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
