
import Link from "next/link";
import { Shield, LayoutDashboard, Users, FileText, Settings, CreditCard, LogOut } from "lucide-react";
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 bg-slate-900 text-white md:flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg tracking-wide border-b border-slate-800">
          <Shield className="mr-2 h-5 w-5 text-indigo-400" />
          Nevertop
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/programs" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <FileText className="mr-3 h-5 w-5" />
            Programs
          </Link>
          <Link href="/dashboard/students" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <Users className="mr-3 h-5 w-5" />
            Students
          </Link>
          <Link href="/pricing" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <CreditCard className="mr-3 h-5 w-5" />
            Billing
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <div className="md:hidden h-16 bg-slate-900 text-white flex items-center px-4">
          <Shield className="h-6 w-6 text-indigo-400" />
          <span className="ml-2 font-bold">Nevertop</span>
        </div>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
