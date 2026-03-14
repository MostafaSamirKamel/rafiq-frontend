'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SessionCard from '@/components/cards/SessionCard';
import TrainingCard from '@/components/cards/TrainingCard';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import ToysIcon from '@mui/icons-material/Toys';
import VisibilityIcon from '@mui/icons-material/Visibility';

const cards = [
  {
    title: 'التعرف على الأشخاص',
    description: 'التعرف على الأشخاص المقربين مثل الأب والأم والأصدقاء من خلال صور حقيقية',
    icon: <PeopleIcon />,
    href: '/recognition/people',
    color: 'var(--primary-500)',
  },
  {
    title: 'التعرف على الأماكن',
    description: 'التعرف على الأماكن المألوفة مثل البيت والمدرسة والمطبخ',
    icon: <HomeIcon />,
    href: '/recognition/places',
    color: '#06b6d4',
  },
  {
    title: 'التعرف على الأشياء',
    description: 'التعرف على الأشياء اليومية مثل الفواكه والخضروات والحيوانات',
    icon: <ToysIcon />,
    href: '/recognition/objects',
    color: '#f59e0b',
  },
];

export default function RecognitionPage() {
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
            التعرف الاجتماعي
          </h1>
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
            <VisibilityIcon sx={{ fontSize: 32 }} />
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-xl ml-auto">
          المرحلة الأولى - ابدأ بتعلم التعرف على الأشخاص والأماكن والأشياء التي تحيط بك في حياتك اليومية
        </p>
      </motion.div>

      <div className="mb-12">
        <SessionCard phase="المرحلة الأولى" module="التعرف الاجتماعي" continueUrl="/recognition" isActive={true} />
      </div>

      <div className="grid gap-4">
        {cards.map((card, i) => (
          <TrainingCard key={i} {...card} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}
