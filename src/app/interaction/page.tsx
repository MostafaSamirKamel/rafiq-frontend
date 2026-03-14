'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SessionCard from '@/components/cards/SessionCard';
import TrainingCard from '@/components/cards/TrainingCard';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PanToolIcon from '@mui/icons-material/PanTool';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const cards = [
  {
    title: 'فهم الإشارات الاجتماعية',
    description: 'تعلم إشارات مرحباً ونعم ولا وباي من خلال فيديوهات تفاعلية',
    icon: <PanToolIcon />,
    href: '/interaction/signals',
    color: 'var(--accent-500)',
  },
  {
    title: 'فهم المشاعر',
    description: 'التعرف على مشاعر السعادة والحزن والغضب',
    icon: <EmojiEmotionsIcon />,
    href: '/interaction/emotions',
    color: '#ec4899',
  },
];

export default function InteractionPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="mb-10 text-right"
      >
        <div className="flex items-center gap-4 mb-3 justify-end lg:justify-start flex-row-reverse">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            التفاعل الاجتماعي
          </h1>
          <div className="w-12 h-12 rounded-2xl bg-accent-50 flex items-center justify-center text-accent-600 shadow-sm border border-accent-100">
            <HandshakeIcon sx={{ fontSize: 32 }} />
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-xl ml-auto">
          المرحلة الثانية - تعلم كيف تتواصل مع الآخرين من خلال الإشارات وفهم المشاعر المختلفة
        </p>
      </motion.div>

      <div className="mb-12">
        <SessionCard phase="المرحلة الثانية" module="التفاعل الاجتماعي" continueUrl="/interaction" isActive={true} />
      </div>

      <div className="grid gap-4">
        {cards.map((card, i) => (
          <TrainingCard key={i} {...card} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
