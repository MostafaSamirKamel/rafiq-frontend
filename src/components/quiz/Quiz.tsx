'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizOption {
  id: string;
  imageUrl: string;
  label: string;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
  correctId: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export default function Quiz({ question, options, correctId, onSuccess, onFailure }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleSelect = (id: string) => {
    if (result) return;
    setSelected(id);
    const isCorrect = id === correctId;
    setResult(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (isCorrect) {
        onSuccess();
      } else {
        onFailure();
      }
    }, 2000);
  };

  const handleRetry = () => {
    setSelected(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Question */}
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--neutral-800)' }}>
        {question}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {options.map((option) => {
          let borderColor = 'var(--neutral-200)';
          let bgColor = 'white';

          if (selected === option.id && result === 'correct') {
            borderColor = 'var(--success-500)';
            bgColor = 'var(--success-400)10';
          } else if (selected === option.id && result === 'wrong') {
            borderColor = 'var(--danger-500)';
            bgColor = 'var(--danger-400)10';
          } else if (result === 'wrong' && option.id === correctId) {
            borderColor = 'var(--success-500)';
          }

          return (
            <motion.button
              key={option.id}
              whileHover={!result ? { scale: 1.05 } : {}}
              whileTap={!result ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(option.id)}
              className="rounded-2xl overflow-hidden transition-all cursor-pointer"
              style={{
                border: `3px solid ${borderColor}`,
                background: bgColor,
                boxShadow: 'var(--shadow-md)',
              }}
              disabled={!!result}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <span className="font-bold text-sm" style={{ color: 'var(--neutral-700)' }}>
                  {option.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Result Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 rounded-2xl"
            style={{
              background: result === 'correct' ? 'var(--success-400)15' : 'var(--danger-400)15',
            }}
          >
            {result === 'correct' ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle size={48} style={{ color: 'var(--success-500)' }} />
                <h3 className="text-xl font-bold" style={{ color: 'var(--success-500)' }}>
                  أحسنت! إجابة صحيحة
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <XCircle size={48} style={{ color: 'var(--danger-500)' }} />
                <h3 className="text-xl font-bold" style={{ color: 'var(--danger-500)' }}>
                  حاول مرة أخرى
                </h3>
                <button
                  onClick={handleRetry}
                  className="btn btn-secondary btn-sm mt-2"
                >
                  <RotateCcw size={16} />
                  إعادة المحاولة
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
