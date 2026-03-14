'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/slices/authSlice';

interface AuthInitProps {
  children: React.ReactNode;
  initialUser: {
    user: {
      _id: string;
      phone: string;
      role: string;
      fullName: string;
    };
    token: string;
  } | null;
}

export function AuthInit({ children, initialUser }: AuthInitProps) {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  // Sync state during render to avoid flicker (hydration)
  if (!initialized.current && initialUser) {
    dispatch(setCredentials(initialUser));
    initialized.current = true;
  }

  return <>{children}</>;
}
