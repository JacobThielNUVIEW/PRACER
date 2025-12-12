
import Navbar from '../../components/layout/Navbar';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    // Explicit bg-slate-100 ensures the white cards in children stand out
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-primary/20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
