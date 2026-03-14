'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  items?: string[];
}

interface SliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
}

export default function SliderModal({ isOpen, onClose, slides }: SliderModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={slides[currentSlide].title} maxWidth="lg">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-right"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 shadow-sm">
                {slides[currentSlide].icon}
              </div>
              <p className="text-lg text-neutral-600 font-medium leading-relaxed text-center mb-8">
                {slides[currentSlide].description}
              </p>

              {slides[currentSlide].items && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slides[currentSlide].items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex-row-reverse">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <span className="text-sm font-bold text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 bg-primary-500' : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="px-6 h-12 rounded-xl bg-primary-500 text-white font-black text-sm hover:bg-primary-600 transition-all shadow-blue-glow active:scale-95 flex items-center gap-2"
            >
              <span>التالي</span>
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
