
'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '../../lib/router-context';
import { Search, Plus, Bell, ChevronDown, UserCircle, Zap, LogOut, Menu, X } from 'lucide-react';
import { MOCK_PROFILE } from '../../constants';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8">
           <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer group">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform -skew-x-12 shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg skew-x-12">P</span>
               </div>
               <span className="font-black text-xl tracking-tight text-text-primary hidden sm:block">PRACER</span>
           </Link>
           
           <div className="hidden lg:flex items-center bg-gray-100 rounded-md px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-text-secondary mr-2" />
              <input 
                type="text" 
                placeholder="Search athletes, races, clubs..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-text-primary"
              />
           </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 h-full">
            <Link 
              href="/dashboard"
              className={`h-full px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${isActive('/dashboard') ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/training-log"
              className={`h-full px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${isActive('/training-log') ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'}`}
            >
              My Training
            </Link>
            <Link 
              href="/races"
              className={`h-full px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${isActive('/races') ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-200'}`}
            >
              Races
            </Link>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-4">
           <div className="hidden sm:block relative group">
              <button className="w-8 h-8 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-sm transition-colors">
                 <Plus className="w-5 h-5" />
              </button>
           </div>

           <button className="text-text-secondary hover:text-text-primary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-white"></span>
           </button>

           <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                 <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                    <img src="https://picsum.photos/seed/alex/100" alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <ChevronDown className="w-4 h-4 text-text-secondary" />
              </div>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 animate-fade-in z-50">
                   <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-text-primary">{MOCK_PROFILE.name}</p>
                      <p className="text-xs text-text-secondary">Pracer Athlete</p>
                   </div>
                   <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}>
                      <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                         <UserCircle className="w-4 h-4" /> My Profile
                      </button>
                   </Link>
                   <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}>
                      <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                         <Zap className="w-4 h-4" /> Settings
                      </button>
                   </Link>
                   <div className="border-t border-gray-100 my-1"></div>
                   <Link href="/login" onClick={() => setIsUserMenuOpen(false)}>
                      <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 flex items-center gap-2">
                         <LogOut className="w-4 h-4" /> Log Out
                      </button>
                   </Link>
                </div>
              )}
           </div>

           <button 
             className="md:hidden text-text-secondary"
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
           <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 font-bold text-text-primary border-b border-gray-100">Dashboard</Link>
           <Link href="/training-log" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 font-bold text-text-primary border-b border-gray-100">My Training</Link>
           <Link href="/races" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 font-bold text-text-primary border-b border-gray-100">Races</Link>
           <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 font-bold text-text-primary border-b border-gray-100">My Profile</Link>
           <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 font-bold text-text-primary">Settings</Link>
        </div>
      )}
    </nav>
  );
}
