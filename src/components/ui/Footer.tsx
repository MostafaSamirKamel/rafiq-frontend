'use client';

import React from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BrushIcon from '@mui/icons-material/Brush';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const teamMembers = [
  { name: 'Eng Mostafa Samir', role: 'Web Developer', icon: <CodeIcon sx={{ fontSize: 24 }} /> },
  { name: 'Eng Ahmed Eid', role: 'Flutter & AI', icon: <PhoneAndroidIcon sx={{ fontSize: 24 }} /> },
  { name: 'Eng Manar Bahaa', role: 'AI Developer', icon: <SmartToyIcon sx={{ fontSize: 24 }} /> },
  { name: 'Eng Mariam Khaled', role: 'UI/UX Designer', icon: <BrushIcon sx={{ fontSize: 24 }} /> },
  { name: 'Eng Alaa Hassan', role: 'AI Developer', icon: <PsychologyIcon sx={{ fontSize: 24 }} /> },
];

export default function Footer() {
  return (
    <footer id="team" className="bg-neutral-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-accent-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Team Header */}
        <div className="text-center mb-16">
          <span className="text-primary-500 font-black text-xs uppercase tracking-[0.3em] mb-4 inline-block">وراء الكواليس</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">فريق عمل رافيق</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            نحن مجموعة من المهندسين الشغوفين تكاتفنا معاً لتقديم حل تقني مبتكر يساعد الأطفال على التعبير والتعلم بسهولة
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-24">
          {teamMembers.map((member, i) => (
            <div
              key={member.name}
              className="group text-center p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-default"
            >
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
              >
                {member.icon}
              </div>
              <h3 className="font-black text-white tracking-tight text-sm sm:text-base leading-tight">{member.name}</h3>
              <p className="text-neutral-500 text-xs font-bold mt-2 uppercase tracking-wider">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="text-white font-black text-2xl tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-xs">R</div>
              RAFIQ
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="mailto:rafiqteam770@gmail.com"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors no-underline text-sm font-bold"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <MailOutlineIcon sx={{ fontSize: 16 }} />
                </div>
                rafiqteam770@gmail.com
              </a>
              <a
                href="tel:01090500290"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors no-underline text-sm font-bold"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <PhoneIcon sx={{ fontSize: 16 }} />
                </div>
                <span dir="ltr">01090500290</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-3 text-neutral-500 text-sm font-bold">
            <span>تم تطويره بكل</span>
            <FavoriteIcon sx={{ fontSize: 16 }} className="text-red-500 animate-pulse" />
            <span>بواسطة فريق رافيق - ٢٠٢٤</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
