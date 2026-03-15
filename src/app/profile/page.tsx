'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Calendar, 
  Activity, 
  ClipboardList, 
  BrainCircuit, 
  MapPin, 
  School, 
  HeartPulse,
  ChevronRight,
  TrendingUp,
  Clock,
  History,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { childAPI, progressAPI } from '@/services/apiClient';
import Image from 'next/image';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface ChildProfile {
  _id: string;
  name: string;
  birthdate: string;
  age?: number;
  gender: string;
  photoUrl?: string;
  governorate: string;
  school?: string;
  iqScore?: number;
  healthStatus?: string;
  treatmentCenter?: string;
  sessionSettings?: {
    phase1Enabled: boolean;
    phase2Enabled: boolean;
    phase3Enabled: boolean;
    duration: number;
    sessionsPerDay: number;
  };
}

interface ProgressOverview {
  phase1: number;
  phase2: number;
  phase3: number;
  overall: number;
}

interface SessionRecord {
  _id: string;
  phase: number;
  status: string;
  score: number;
  startTime: string;
}

export default function ProfilePage() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editedSettings, setEditedSettings] = useState<ChildProfile['sessionSettings'] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchProfileData = async () => {
      if (!token) return;
      try {
        const children = await childAPI.getMyChildren(token) as ChildProfile[];
        if (children && children.length > 0) {
          const child = children[0];
          setActiveChild(child);
          setEditedSettings(child.sessionSettings || null);
          
          const progressData = await progressAPI.getOverview(child._id, token) as any;
          setProgress(progressData.overview);
          setHistory(progressData.history || []);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  const chartData = [
    { name: 'المرحلة 1', value: progress?.phase1 || 0, color: '#0ea5e9', description: 'التعرف الاجتماعي' },
    { name: 'المرحلة 2', value: progress?.phase2 || 0, color: '#6366f1', description: 'التفاعل الاجتماعي' },
    { name: 'المرحلة 3', value: progress?.phase3 || 0, color: '#14b8a6', description: 'التواصل الاجتماعي' },
  ];

  const handleSaveProgram = async () => {
    if (!token || !activeChild || !editedSettings) return;
    setIsSaving(true);
    try {
      const updated = await childAPI.update(activeChild._id, { sessionSettings: editedSettings }, token) as ChildProfile;
      setActiveChild(updated);
      setIsEditingProgram(false);
    } catch (error) {
      console.error("Failed to update program settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
           <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <User size={40} />
           </div>
           <h2 className="text-2xl font-black text-neutral-900 tracking-tight">لم يتم العثور على طفل</h2>
           <p className="text-neutral-500">يرجى إضافة طفل أولاً للبدء في تتبع التقدم.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12 pb-24">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/70 backdrop-blur-xl rounded-4xl p-8 sm:p-10 border border-white/80 shadow-premium overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-2 bg-linear-to-r from-primary-400 to-primary-600" />
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-100/30 blur-3xl opacity-60" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            {/* Photo */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-floating border-4 border-white relative">
                <Image 
                  src={activeChild.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChild.name)}&background=0284c7&color=fff&size=200`} 
                  alt={activeChild.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white">
                <BrainCircuit size={20} />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-right space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-2">
                  {activeChild.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-bold border border-primary-100/50">
                    {activeChild.age} سنوات
                  </span>
                  <span className="px-4 py-1.5 bg-neutral-50 text-neutral-600 rounded-full text-sm font-bold border border-neutral-100">
                    {activeChild.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                <InfoItem icon={<MapPin size={18} />} label="المحافظة" value={activeChild.governorate} />
                <InfoItem icon={<School size={18} />} label="المدرسة" value={activeChild.school || 'غير محدد'} />
                <InfoItem icon={<HeartPulse size={18} />} label="الحالة الصحية" value={activeChild.healthStatus || 'مستقرة'} />
                <InfoItem icon={<TrendingUp size={18} />} label="نسبة الذكاء (IQ)" value={`${activeChild.iqScore || '--'}`} highlight />
                <InfoItem icon={<Calendar size={18} />} label="تاريخ الميلاد" value={new Date(activeChild.birthdate).toLocaleDateString('ar-EG')} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Analysis Report & Program */}
          <div className="lg:col-span-2 space-y-10">
            {/* Analysis Report */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">تقرير التحليل والتقدم</h2>
              </div>
              
              <div className="bg-white/70 backdrop-blur-xl rounded-4xl p-8 border border-white/80 shadow-premium space-y-8">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontWeight: 'bold' }} 
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-4 rounded-2xl shadow-floating border border-neutral-100 text-right">
                                <p className="text-sm font-black text-neutral-900 mb-1">{payload[0].payload.name}</p>
                                <p className="text-xs text-neutral-500 mb-2">{payload[0].payload.description}</p>
                                <p className="text-lg font-black text-primary-600">{payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[12, 12, 12, 12]} 
                        barSize={60}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-6">
                  {chartData.map((item, i) => (
                    <div key={i} className="p-4 rounded-3xl bg-neutral-50 border border-neutral-100/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.name}</span>
                        <span className="text-sm font-black text-neutral-900">{Math.round(item.value)}%</span>
                      </div>
                      <div className="text-xs text-neutral-500 font-medium leading-relaxed">{item.description}</div>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black">
                        {Math.round(progress?.overall || 0)}%
                      </div>
                      <div>
                        <p className="text-sm font-black text-neutral-900">معدل الإنجاز الكلي</p>
                        <p className="text-xs font-medium text-neutral-500">متوسط الأداء في جميع المراحل</p>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95">
                      تصدير التقرير PDF
                   </button>
                </div>
              </div>
            </section>

            {/* Training History */}
            <section className="space-y-6">
               <div className="flex items-center gap-4 px-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                  <History size={24} />
                </div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">سجل التدريبات الأخيرة</h2>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-4xl border border-white/80 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-neutral-50/50 border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-4 text-sm font-black text-neutral-500 uppercase tracking-widest">تاريخ الجلسة</th>
                        <th className="px-6 py-4 text-sm font-black text-neutral-500 uppercase tracking-widest">المرحلة</th>
                        <th className="px-6 py-4 text-sm font-black text-neutral-500 uppercase tracking-widest">النتيجة</th>
                        <th className="px-6 py-4 text-sm font-black text-neutral-500 uppercase tracking-widest">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {history.length > 0 ? history.slice(0, 10).map((session, i) => (
                        <React.Fragment key={session._id}>
                          <tr 
                            onClick={() => setExpandedSessionId(expandedSessionId === session._id ? null : session._id)}
                            className="hover:bg-neutral-50/30 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className="p-2 bg-neutral-100 rounded-lg text-neutral-500 group-hover:bg-white transition-colors">
                                  <Clock size={16} />
                                </span>
                                <span className="font-bold text-neutral-700">{new Date(session.startTime).toLocaleDateString('ar-EG')}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 font-bold text-neutral-600">المرحلة {session.phase}</td>
                            <td className="px-6 py-5 font-black text-primary-600">{session.score}%</td>
                            <td className="px-6 py-5 text-sm">
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex px-3 py-1 rounded-full font-bold ${
                                  session.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {session.status === 'completed' ? 'مكتمل' : 'نشط'}
                                </span>
                                <ChevronRight 
                                  size={16} 
                                  className={`text-neutral-300 transition-transform ${expandedSessionId === session._id ? 'rotate-90' : ''}`} 
                                />
                              </div>
                            </td>
                          </tr>
                          {expandedSessionId === session._id && (
                            <tr>
                              <td colSpan={4} className="px-8 py-6 bg-neutral-50/50 border-y border-neutral-100/50">
                                <div className="space-y-4">
                                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">تفاصيل الجلسة</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    <DetailBox label="وقت البدء" value={new Date(session.startTime).toLocaleTimeString('ar-EG')} />
                                    <DetailBox label="الدقة" value={`${session.score}%`} />
                                    <DetailBox label="التركيز" value="مرتفع" />
                                    <DetailBox label="التحسن" value="+5%" positive />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-medium">لا توجد جلسات مسجلة بعد</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar: Program & Notes */}
          <div className="space-y-10">
            {/* Current Program Settings */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                    <ClipboardList size={24} />
                  </div>
                  <h2 className="text-xl font-black text-neutral-900 tracking-tight">البرنامج العلاجي</h2>
                </div>
                {isEditingProgram ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveProgram}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingProgram(false);
                        setEditedSettings(activeChild.sessionSettings || null);
                      }}
                      className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold hover:bg-neutral-200"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingProgram(true)}
                    className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                )}
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-4xl p-6 border border-white/80 shadow-premium space-y-6">
                 <div className="space-y-4">
                    <ProgramField 
                      label="مدة الجلسة" 
                      value={`${editedSettings?.duration || 20} دقيقة`} 
                      isEditing={isEditingProgram}
                      onChange={(val) => setEditedSettings(prev => prev ? ({ ...prev, duration: parseInt(val) || 20 }) : null)}
                      type="number"
                      suffix=" دقيقة"
                    />
                    <ProgramField 
                      label="جلسات يومياً" 
                      value={`${editedSettings?.sessionsPerDay || 2} جلسة`} 
                      isEditing={isEditingProgram}
                      onChange={(val) => setEditedSettings(prev => prev ? ({ ...prev, sessionsPerDay: parseInt(val) || 2 }) : null)}
                      type="number"
                      suffix=" جلسة"
                    />
                 </div>
                 
                 <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">المراحل النشطة</p>
                    <div className="space-y-3">
                       <ActivePhaseItem 
                        active={editedSettings?.phase1Enabled} 
                        label="المرحلة 1" 
                        isEditing={isEditingProgram}
                        onToggle={() => setEditedSettings(prev => prev ? ({ ...prev, phase1Enabled: !prev.phase1Enabled }) : null)}
                       />
                       <ActivePhaseItem 
                        active={editedSettings?.phase2Enabled} 
                        label="المرحلة 2" 
                        isEditing={isEditingProgram}
                        onToggle={() => setEditedSettings(prev => prev ? ({ ...prev, phase2Enabled: !prev.phase2Enabled }) : null)}
                       />
                       <ActivePhaseItem 
                        active={editedSettings?.phase3Enabled} 
                        label="المرحلة 3" 
                        isEditing={isEditingProgram}
                        onToggle={() => setEditedSettings(prev => prev ? ({ ...prev, phase3Enabled: !prev.phase3Enabled }) : null)}
                       />
                    </div>
                 </div>
              </div>
            </section>

            {/* Specialist Feedback */}
            <section className="space-y-6">
               <div className="flex items-center gap-4 px-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">ملاحظات المختص</h2>
              </div>

              <div className="bg-linear-to-br from-neutral-900 to-neutral-800 rounded-4xl p-7 shadow-premium relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary-500" />
                  <p className="text-white/60 text-sm font-medium leading-relaxed italic mb-4">
                    "الطفل يظهر تحسناً ملحوظاً في المرحلة الأولى، ننصح بزيادة وقت التدريب على الأماكن المألوفة لتعزيز الثقة قبل الانتقال للمرحلة الثانية."
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-400">
                        <User size={18} />
                     </div>
                     <div>
                        <p className="text-white text-xs font-black">أ/ سارة محمد</p>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">أخصائي تخاطب</p>
                     </div>
                  </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value, positive }: { label: string, value: string, positive?: boolean }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black ${positive ? 'text-green-600' : 'text-neutral-900'}`}>{value}</p>
    </div>
  );
}

function InfoItem({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        highlight ? 'bg-primary-500 text-white shadow-lg' : 'bg-neutral-50 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-500'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`font-bold transition-colors ${highlight ? 'text-primary-600 text-lg' : 'text-neutral-700'}`}>{value}</p>
      </div>
    </div>
  );
}

function ProgramField({ label, value, isEditing, onChange, type = "text", suffix = "" }: { 
  label: string, 
  value: string, 
  isEditing?: boolean, 
  onChange?: (val: string) => void,
  type?: string,
  suffix?: string
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-bold text-neutral-500">{label}</span>
      {isEditing ? (
        <div className="flex items-center gap-2">
           <input 
            type={type}
            defaultValue={value.replace(suffix, '')}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-16 px-2 py-1 bg-neutral-100 rounded-lg text-sm font-black text-right border-none focus:ring-2 focus:ring-primary-400 outline-none"
          />
          <span className="text-xs text-neutral-400">{suffix}</span>
        </div>
      ) : (
        <span className="text-sm font-black text-neutral-900 border-b-2 border-primary-100">{value}</span>
      )}
    </div>
  );
}

function ActivePhaseItem({ active, label, isEditing, onToggle }: { 
  active?: boolean, 
  label: string, 
  isEditing?: boolean, 
  onToggle?: () => void 
}) {
  return (
    <div 
      onClick={isEditing ? onToggle : undefined}
      className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
        isEditing ? 'cursor-pointer hover:border-primary-400' : ''
      } ${
        active ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-neutral-50 border-neutral-100 text-neutral-400 opacity-60'
      }`}
    >
       <span className="text-sm font-black">{label}</span>
       <div className={`w-2 h-2 rounded-full ${active ? 'bg-primary-500 shadow-xs ring-4 ring-primary-100' : 'bg-neutral-300'}`} />
    </div>
  );
}
