'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Plus, Upload, Trash2, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import ToysIcon from '@mui/icons-material/Toys';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Item {
  id: string;
  name: string;
  relation?: string;
  category?: string;
  imageUrl: string;
}

const demoItems: Record<string, Item[]> = {
  person: [
    { id: '1', name: 'بابا علي', relation: 'الأب', imageUrl: 'https://ui-avatars.com/api/?name=Ali&background=3b82f6&color=fff&size=200' },
    { id: '2', name: 'ماما سارة', relation: 'الأم', imageUrl: 'https://ui-avatars.com/api/?name=Sara&background=ec4899&color=fff&size=200' },
  ],
  place: [
    { id: '1', name: 'بيتي', category: 'المنزل', imageUrl: 'https://ui-avatars.com/api/?name=Home&background=06b6d4&color=fff&size=200' },
  ],
  object: [
    { id: '1', name: 'تفاحة', category: 'فواكه', imageUrl: 'https://ui-avatars.com/api/?name=Apple&background=ef4444&color=fff&size=200' },
  ],
};

const typeLabels: Record<string, string> = { person: 'الأشخاص', place: 'الأماكن', object: 'الأشياء' };
const typeIcons: Record<string, React.ReactNode> = {
  person: <PeopleIcon fontSize="small" />,
  place: <HomeIcon fontSize="small" />,
  object: <ToysIcon fontSize="small" />,
};

export default function SettingsPage() {
  const [activeType, setActiveType] = useState('person');
  const [items, setItems] = useState(demoItems);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) { toast.error('يرجى إدخال الاسم'); return; }
    const newItem: Item = {
      id: Date.now().toString(),
      name: newName,
      relation: activeType === 'person' ? newRelation : undefined,
      category: activeType !== 'person' ? newCategory : undefined,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=3b82f6&color=fff&size=200`,
    };
    setItems({ ...items, [activeType]: [...items[activeType], newItem] });
    setNewName(''); setNewRelation(''); setNewCategory('');
    setShowAddForm(false);
    toast.success('تمت إضافة العنصر بنجاح ✨');
  };

  const handleDelete = (id: string) => {
    setItems({ ...items, [activeType]: items[activeType].filter((i) => i.id !== id) });
    toast.success('تم الحذف بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-right">
        <Link href="/recognition" className="inline-flex items-center gap-2 text-sm font-black no-underline mb-6 text-primary-600 hover:gap-3 transition-all flex-row-reverse group">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للتعرف الاجتماعي
        </Link>
        <div className="flex items-center gap-4 mb-3 justify-end lg:justify-start flex-row-reverse">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">إعدادات التعلم</h1>
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-600 shadow-sm border border-neutral-100">
            <SettingsIcon sx={{ fontSize: 32 }} />
          </div>
        </div>
        <p className="text-base sm:text-lg text-neutral-500 font-medium max-w-xl ml-auto">قم بإدارة المحتوى التعليمي المخصص لطفلك لتعزيز مهارات التعرف لديه</p>
      </motion.div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 mb-10 justify-end">
        {(['person', 'place', 'object'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setActiveType(type); setShowAddForm(false); }}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 border-2",
              activeType === type 
                ? "bg-primary-500 border-primary-500 text-white shadow-blue-glow" 
                : "bg-white border-neutral-100 text-neutral-500 hover:border-primary-200"
            )}
          >
            {typeIcons[type]} {typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Add Button & List Header */}
      <div className="flex items-center justify-between flex-row-reverse mb-8">
        <h2 className="text-xl font-black text-neutral-800 tracking-tight">قائمة {typeLabels[activeType]}</h2>
        {!showAddForm && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)} 
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-success-500 to-success-600 text-white font-black text-sm shadow-lg shadow-success-500/20"
          >
            <Plus size={20} /> إضافة جديد
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showAddForm && (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-[2.5rem] p-8 bg-white glass mb-10 border border-success-200 shadow-premium"
          >
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
              <h3 className="text-lg font-black text-success-700">إضافة {activeType === 'person' ? 'شخص' : 'عنصر'} جديد</h3>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="text-right">
                <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">الاسم</label>
                <input className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl py-4 px-4 text-neutral-800 font-bold focus:bg-white focus:border-success-500 transition-all outline-hidden" placeholder="أدخل الاسم هنا" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              {activeType === 'person' ? (
                <div className="text-right">
                  <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">الصلة</label>
                  <input className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl py-4 px-4 text-neutral-800 font-bold focus:bg-white focus:border-success-500 transition-all outline-hidden" placeholder="مثال: الأب، الأخ" value={newRelation} onChange={(e) => setNewRelation(e.target.value)} />
                </div>
              ) : (
                <div className="text-right">
                  <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">التصنيف</label>
                  <input className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl py-4 px-4 text-neutral-800 font-bold focus:bg-white focus:border-success-500 transition-all outline-hidden" placeholder="مثال: فاكهة، وسيلة نقل" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </div>
              )}
            </div>

            <div className="text-right mb-8">
              <label className="block text-sm font-black text-neutral-700 mb-2 mr-1">الصورة</label>
              <div className="border-4 border-dashed rounded-4xl p-8 text-center cursor-pointer hover:border-success-400 hover:bg-success-50/50 transition-all border-neutral-100 bg-neutral-50 group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-neutral-400 group-hover:text-success-500 shadow-sm transition-colors">
                  <Upload size={32} />
                </div>
                <span className="text-sm font-bold text-neutral-500">اضغط لرفع صورة من جهازك</span>
              </div>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <button 
                onClick={handleAdd} 
                className="flex-1 py-4 rounded-2xl bg-linear-to-r from-success-500 to-success-600 text-white font-black shadow-lg shadow-success-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> حفظ العنصر
              </button>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="px-8 py-4 rounded-2xl font-black text-neutral-500 bg-neutral-50 hover:bg-neutral-100 transition-all"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items list */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {items[activeType]?.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4 p-4 pr-6 rounded-4xl bg-white glass card-hover border border-neutral-100 group flex-row-reverse"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-black text-base text-neutral-800 tracking-tight">{item.name}</h4>
                <p className="text-xs font-bold text-neutral-400 mt-1 uppercase tracking-wider">{item.relation || item.category}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors shadow-xs">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-xs"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {items[activeType]?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-4xl bg-neutral-50 flex items-center justify-center text-neutral-300">
                {React.cloneElement(typeIcons[activeType] as React.ReactElement<any>, { sx: { fontSize: 40 } })}
              </div>
              <p className="font-black text-neutral-400 text-lg">لا توجد عناصر مضافة بعد</p>
              <button 
                onClick={() => setShowAddForm(true)} 
                className="text-sm font-black text-primary-600 hover:underline"
              >
                اضغط هنا لإضافة أول عنصر
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
