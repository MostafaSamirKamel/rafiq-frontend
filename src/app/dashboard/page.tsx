'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SessionCard from '@/components/cards/SessionCard';
import TrainingCard from '@/components/cards/TrainingCard';
import Navbar from '@/components/ui/Navbar';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import ToysIcon from '@mui/icons-material/Toys';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PanToolIcon from '@mui/icons-material/PanTool';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { childAPI } from '@/services/apiClient';

const sections = [
  {
    title: 'المرحلة الأولى: التعرف الاجتماعي',
    subtitle: 'بناء القاعدة المعرفية للأشخاص والبيئة المحيطة',
    progress: 75,
    cards: [
      {
        title: 'التعرف على الأشخاص',
        description: 'التعرف على الأشخاص المقربين من خلال صور حقيقية وقصص مخصصة',
        icon: <PeopleIcon />,
        href: '/recognition/people',
      },
      {
        title: 'التعرف على الأماكن',
        description: 'استكشاف الأماكن المألوفة مثل البيت والمدرسة والحديقة',
        icon: <HomeIcon />,
        href: '/recognition/places',
      },
      {
        title: 'التعرف على الأشياء',
        description: 'التعرف على الأشياء اليومية، الفواكه، والحيوانات في البيئة المحيطة',
        icon: <ToysIcon />,
        href: '/recognition/objects',
      },
    ],
  },
  {
    title: 'المرحلة الثانية: التفاعل الاجتماعي',
    subtitle: 'تعلم لغة الجسد وفهم تعابير الوجه والمشاعر',
    progress: 30,
    cards: [
      {
        title: 'فهم الإشارات الاجتماعية',
        description: 'تعلم أهم الإشارات الحركية مثل مرحباً، شكراً، وباي للتواصل الفعال',
        icon: <PanToolIcon />,
        href: '/interaction/signals',
      },
      {
        title: 'فهم المشاعر',
        description: 'اكتشاف تعابير الوجه المختلفة وفهم مشاعر الآخرين والتفاعل معها',
        icon: <EmojiEmotionsIcon />,
        href: '/interaction/emotions',
      },
    ],
  },
  {
    title: 'المرحلة الثالثة: التواصل الاجتماعي',
    subtitle: 'التدريب على الحوار المفتوح مع الذكاء الاصطناعي',
    progress: 0,
    cards: [
      {
        title: 'محادثة مع رفيق زكي',
        description: 'تطوير مهارات الحوار المتكاملة من خلال محادثات تفاعلية ذكية',
        icon: <SmartToyIcon />,
        href: '/communication',
      },
    ],
  },
];

interface ChildProfile {
  _id: string;
  name: string;
  photoUrl?: string;
  iqScore?: number;
}

export default function DashboardPage() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildData = async () => {
      if (!token) return;
      try {
        const children = await childAPI.getMyChildren(token) as ChildProfile[];
        if (children && children.length > 0) {
          // Default to the first child for now
          setActiveChild(children[0]);
        }
      } catch (error) {
        console.error("Failed to load child data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [token]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-4"
    >
      {/* Hero / Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-14 relative bg-white rounded-4xl p-8 shadow-premium border border-neutral-100 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-2 bg-linear-to-l from-primary-400 to-primary-600" />
        
        {/* Background Decorative Glow */}
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary-100/50 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 relative z-10 w-full">
          
          {/* Right side: Photo & Name */}
          <div className="flex flex-col sm:flex-row-reverse items-center gap-6 text-center sm:text-right">
            <Link href="/profile" className="relative group hover:scale-105 transition-transform duration-300">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary-50 group-hover:shadow-blue-glow transition-shadow">
                {isLoading ? (
                  <div className="w-full h-full animate-pulse bg-neutral-200" />
                ) : activeChild?.photoUrl ? (
                  <img src={activeChild.photoUrl} alt={activeChild.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-300">
                    <AutoAwesomeIcon sx={{ fontSize: 48 }} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                <div className="w-4 h-4 rounded-full bg-success-500 animate-pulse" />
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                عرض الملف الشخصي
              </div>
            </Link>

            <div>
              <p className="text-primary-600 font-bold mb-1 tracking-wide text-sm">مرحباً يا بطل!</p>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                {isLoading ? (
                  <span className="w-48 h-10 bg-neutral-200 animate-pulse block rounded-lg" />
                ) : (
                  activeChild?.name || 'صديق رفيق'
                )}
              </h1>
            </div>
          </div>

          {/* Left side: Quick Stats */}
          {!isLoading && activeChild && (
            <div className="flex gap-4 sm:gap-8 rtl:flex-row-reverse bg-neutral-50/80 px-8 py-5 rounded-2xl border border-neutral-100/50 backdrop-blur-sm shadow-sm w-full md:w-auto mt-6 md:mt-0">
              <div className="text-center flex-1 md:flex-none">
                <p className="text-neutral-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">المرحلة الحالية</p>
                <p className="text-xl sm:text-2xl font-black text-primary-600">الأولى</p>
              </div>
              <div className="w-px bg-neutral-200/50 hidden sm:block" />
              <div className="text-center flex-1 md:flex-none">
                <p className="text-neutral-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">التقدم العام</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-neutral-800">35%</span>
                  <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Hero Session Card */}
      <div className="mb-16">
        <SessionCard
          phase="الجلسة التدريبية النشطة"
          module="التعرف الاجتماعي: الأشخاص"
          isActive={true}
          continueUrl="/recognition/people"
        />
      </div>

      {/* Structured Training Sections */}
      <div className="space-y-16">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="relative bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-neutral-100">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 border-b border-neutral-100 pb-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-black text-xl shrink-0 shadow-sm border border-primary-100/50">
                  {sIdx + 1}
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm font-bold text-neutral-500 mt-1">
                    {section.subtitle}
                  </p>
                </div>
              </div>
              
              {/* Progress Level Indicator */}
              <div className="w-full sm:w-48 self-center sm:self-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-neutral-700">{section.progress}%</span>
                  <span className="text-xs font-bold text-neutral-400">إنجاز المرحلة</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${section.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary-500 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Section Content */}
            <div className="flex flex-col gap-4">
              {section.cards.map((card, cIdx) => (
                <div key={cIdx} className={section.progress === 0 && sIdx > 0 ? 'opacity-75 grayscale-50 pointer-events-none' : ''}>
                  <TrainingCard
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    href={card.href}
                    delay={(sIdx * 3 + cIdx) * 0.1}
                  />
                </div>
              ))}
            </div>
            
            {section.progress === 0 && sIdx > 0 && (
              <div className="absolute inset-x-4 bottom-4 top-24 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl border border-white/50">
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-neutral-100 text-center">
                  <p className="text-neutral-500 font-bold text-sm">أكمل المرحلة السابقة لفتح هذه التدريبات</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 p-8 rounded-4xl bg-linear-to-r from-primary-50 to-white border border-primary-100 text-center flex flex-col sm:flex-row-reverse items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400/10 blur-2xl rounded-full pointer-events-none" />
        <div className="text-right relative z-10">
          <p className="text-primary-800 font-black text-lg mb-1">هل تحتاج لمساعدة في خطة التدريب؟</p>
          <p className="text-primary-600/70 text-sm font-medium">الأخصائي المتابع مستعد للإجابة على جميع استفساراتك.</p>
        </div>
        <button className="relative z-10 shrink-0 px-8 py-3 rounded-2xl bg-white border border-primary-200 text-primary-700 font-black text-sm hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm">
          تواصل مع الأخصائي
        </button>
      </motion.div>
    </motion.div>
  );
}
