import Link from "next/link";
import { Shield, BarChart3, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui-kit";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 h-16 flex items-center border-b bg-white">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Shield className="h-6 w-6" />
          <span>Nevertop ProgramL</span>
        </div>
        <nav className="ml-auto flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
              Safer Schools, <span className="text-indigo-600">Smarter Analytics</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl">
              The complete platform for anti-bullying education, incident reporting, and real-time student engagement monitoring.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button className="h-11 px-8 text-base">Start Monitoring <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
              <Button variant="outline" className="h-11 px-8 text-base">View Demo</Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-16 bg-slate-50 border-t">
          <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Real-time Analytics</h3>
              <p className="text-sm text-slate-500">Visualize engagement trends and identify hotspots with Looker Studio integration.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Proactive Intervention</h3>
              <p className="text-sm text-slate-500">Empower educators with tools to intervene early and effectively.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Secure & Private</h3>
              <p className="text-sm text-slate-500">Enterprise-grade security ensuring student data remains confidential.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-center text-slate-500">© 2025 Nevertop ProgramL. All rights reserved.</p>
      </footer>
    </div>
  );
}