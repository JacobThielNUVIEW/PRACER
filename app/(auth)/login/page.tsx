
'use client';

import React, { useState } from 'react';
import { useRouter, Link, usePathname } from '../../../lib/router-context';
import { Button, Input } from '../../../components/ui-kit';
import { Mail, Lock, ArrowRight, CheckCircle2, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isSignup = pathname === '/signup';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay for effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      
      {/* LEFT: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
           
           {/* Brand Header */}
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transform -skew-x-12 shadow-lg shadow-primary/30">
                    <span className="text-white font-black text-xl skew-x-12">P</span>
                 </div>
                 <span className="font-black text-2xl tracking-tight text-slate-900">PRACER</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                {isSignup ? "Create account." : "Welcome back."}
              </h1>
              <p className="text-slate-500 text-lg font-medium">
                {isSignup ? "Join the fastest growing community." : "Never Stop chasing your next PR."}
              </p>
           </div>

           {/* OAuth Buttons */}
           <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 w-full bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm active:scale-[0.98] transform duration-100">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>
                 {isSignup ? "Sign up with Strava" : "Continue with Strava"}
              </button>
              <button className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-bold py-3.5 rounded-lg transition-colors active:scale-[0.98] transform duration-100">
                 <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.13 4.13 0 0 1-1.79 2.71v2.24h2.9a8.6 8.6 0 0 0 2.7-6.6z" fill="#4285F4"/><path d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.24a5.41 5.41 0 0 1-8.09-2.85H1.05v2.33A9 9 0 0 0 12 21z" fill="#34A853"/><path d="M4.05 13.73a5.41 5.41 0 0 1 0-3.46V7.93H1.05a9 9 0 0 0 0 8.13l3-2.33z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 1.05 7.93l3 2.33c.7-2.05 2.64-3.52 4.95-3.52z" fill="#EA4335"/></g></svg>
                 {isSignup ? "Sign up with Google" : "Continue with Google"}
              </button>
           </div>

           <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                 <span className="bg-white px-4 text-slate-400 font-bold">Or {isSignup ? "join" : "log in"} with email</span>
              </div>
           </div>

           {/* Auth Form */}
           <form onSubmit={handleAuth} className="space-y-5">
              {isSignup && (
                <div className="space-y-2 animate-fade-in">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        type="text" 
                        placeholder="Alex Runner" 
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignup}
                      />
                   </div>
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="runner@pracer.com" 
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                    {!isSignup && <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>}
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary-hover active:translate-y-0"
                disabled={isLoading}
              >
                 {isLoading ? (
                    <span className="flex items-center gap-2">
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       {isSignup ? "Creating Account..." : "Logging In..."}
                    </span>
                 ) : (
                    <span className="flex items-center gap-2">
                       {isSignup ? "Create Account" : "Log In"} <ArrowRight className="w-4 h-4" />
                    </span>
                 )}
              </Button>
           </form>

           <p className="text-center text-sm text-slate-600 font-medium">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
              <Link href={isSignup ? "/login" : "/signup"} className="text-primary font-bold hover:underline">
                 {isSignup ? "Log in here" : "Sign up for free"}
              </Link>
           </p>

        </div>
      </div>

      {/* RIGHT: Visual Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
         {/* Background Layer */}
         <div className="absolute inset-0 bg-hero-gradient opacity-90 mix-blend-multiply z-10"></div>
         <img 
            src="https://images.unsplash.com/photo-1552674605-46d536d232a3?q=80&w=2070&auto=format&fit=crop" 
            alt="Runner on track" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 mix-blend-overlay"
         />
         
         {/* Content Layer */}
         <div className="relative z-20 h-full flex flex-col justify-between p-20 text-white">
            <div className="flex gap-2">
               <span className={`w-2.5 h-2.5 rounded-full transition-colors ${!isSignup ? 'bg-secondary shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-white/20 backdrop-blur-sm'}`}></span>
               <span className={`w-2.5 h-2.5 rounded-full transition-colors ${isSignup ? 'bg-secondary shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-white/20 backdrop-blur-sm'}`}></span>
               <span className="w-2.5 h-2.5 bg-white/20 rounded-full backdrop-blur-sm"></span>
            </div>
            
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-secondary uppercase tracking-wider shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Trusted by 10,000+ Athletes
               </div>
               
               <h2 className="text-6xl font-black tracking-tighter leading-[1.1]">
                  Data that keeps up with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">pace</span>.
               </h2>
               
               <p className="text-xl text-slate-200 max-w-md font-medium leading-relaxed">
                  Join the platform built for athletes who want more than just tracking. Analyze, predict, and conquer your next PR.
               </p>
               
               <div className="pt-8 grid grid-cols-2 gap-12 border-t border-white/10">
                  <div>
                     <p className="text-4xl font-black text-white tracking-tight">2.5M+</p>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Activities Logged</p>
                  </div>
                  <div>
                     <p className="text-4xl font-black text-white tracking-tight">125k</p>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">PRs Smashed</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
