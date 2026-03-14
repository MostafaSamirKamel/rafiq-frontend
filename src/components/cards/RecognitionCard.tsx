'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecognitionCardProps {
  name: string;
  relation?: string;
  category?: string;
  imageUrl: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RecognitionCard({
  name,
  relation,
  category,
  imageUrl,
  onEdit,
  onDelete,
}: RecognitionCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-3xl overflow-hidden glass border border-neutral-200/50 shadow-premium card-hover"
    >
      {/* Three dots menu */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-md transition-all hover:bg-white hover:scale-110 shadow-sm"
        >
          <MoreVertical size={18} className="text-neutral-600" />
        </button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 left-0 bg-white/90 backdrop-blur-md rounded-2xl py-2 min-w-[140px] z-20 shadow-xl border border-neutral-100"
          >
            <button
              onClick={() => { onEdit?.(); setMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors flex items-center justify-end gap-3 font-bold text-neutral-700"
            >
              <Edit size={14} />
              تعديل
            </button>
            <button
              onClick={() => { onDelete?.(); setMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 text-sm hover:bg-danger-50 transition-colors flex items-center justify-end gap-3 font-bold text-danger-500"
            >
              <Trash2 size={14} />
              حذف
            </button>
          </motion.div>
        )}
      </div>

      {/* Image Container */}
      <div className="w-full aspect-4/5 sm:aspect-square bg-neutral-100 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=200`;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info Section */}
      <div className="p-5 text-center bg-white/40 backdrop-blur-sm border-t border-white/20">
        <h3 className="font-black text-lg sm:text-xl text-neutral-800 tracking-tight leading-tight">
          {name}
        </h3>
        
        {relation && (
          <p className="text-sm font-bold mt-1 text-primary-600 tracking-wide">
            {relation}
          </p>
        )}
        
        {category && (
          <div className="mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-primary-50 text-primary-700 border border-primary-100 tracking-wider">
              {category}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
