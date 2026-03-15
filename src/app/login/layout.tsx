import React from 'react';
import Navbar from '@/components/ui/Navbar';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar variant="auth" />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
