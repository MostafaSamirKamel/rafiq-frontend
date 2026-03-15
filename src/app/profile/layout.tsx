'use client';

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout as logoutSice } from '@/lib/store/slices/authSlice';
import { logoutAction } from '@/app/actions/auth';

function ProfileNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutAction();
    dispatch(logoutSice());
    router.push('/login');
  };

  return <Navbar variant="dashboard" onLogout={handleLogout} />;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <ProfileNavbar />
      <main className="pb-12 px-4 sm:px-6 max-w-7xl mx-auto" style={{ paddingTop: '128px' }}>
        {children}
      </main>
    </div>
  );
}
