
'use client';

import React from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Smartphone, 
  CreditCard, 
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../../../components/ui-kit';
import { MOCK_PROFILE } from '../../../constants';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account, connections, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
           <nav className="space-y-1">
              {[
                { label: 'Profile', icon: User, active: true },
                { label: 'Integrations', icon: Globe },
                { label: 'Notifications', icon: Bell },
                { label: 'Privacy', icon: Lock },
                { label: 'Billing', icon: CreditCard },
              ].map((item) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                   <item.icon className={`w-4 h-4 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
                   {item.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                   <LogOut className="w-4 h-4" />
                   Sign Out
                </button>
              </div>
           </nav>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
           
           {/* Connected Apps */}
           <Card>
              <CardHeader>
                 <CardTitle>Connected Apps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {/* Strava */}
                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#FC4C02] rounded-lg flex items-center justify-center text-white font-bold">S</div>
                       <div>
                          <h4 className="font-bold text-slate-900">Strava</h4>
                          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                             <CheckCircle2 className="w-3 h-3" />
                             Connected as {MOCK_PROFILE.name}
                          </div>
                       </div>
                    </div>
                    <Button variant="outline" className="text-xs">Disconnect</Button>
                 </div>

                 {/* Garmin */}
                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#007CC3] rounded-lg flex items-center justify-center text-white font-bold">G</div>
                       <div>
                          <h4 className="font-bold text-slate-900">Garmin Connect</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                             Not connected
                          </div>
                       </div>
                    </div>
                    <Button variant="outline" className="text-xs">Connect</Button>
                 </div>
                 
                 {/* Apple Health */}
                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold"></div>
                       <div>
                          <h4 className="font-bold text-slate-900">Apple Health</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                             Sync via Mobile App
                          </div>
                       </div>
                    </div>
                    <Button variant="ghost" disabled className="text-xs"><Smartphone className="w-3 h-3 mr-1"/> App Only</Button>
                 </div>
              </CardContent>
           </Card>

           {/* Account Details */}
           <Card>
              <CardHeader>
                 <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                       <Input defaultValue={MOCK_PROFILE.name} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                       <Input defaultValue={MOCK_PROFILE.location} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Bio</label>
                       <Input defaultValue="Marathoner chasing sub-3. Love early morning trails." />
                    </div>
                 </div>
                 <div className="pt-4 flex justify-end">
                    <Button>Save Changes</Button>
                 </div>
              </CardContent>
           </Card>

           {/* Subscription */}
           <Card className="border-indigo-100 bg-indigo-50/50">
              <CardContent className="flex items-center justify-between pt-6">
                 <div>
                    <h4 className="font-bold text-indigo-900">Pracer Premium</h4>
                    <p className="text-sm text-indigo-700 mt-1">You are on the <span className="font-bold">Pro Plan</span>. Next billing date: Oct 24, 2025.</p>
                 </div>
                 <Button className="bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-md">Manage Subscription</Button>
              </CardContent>
           </Card>

        </div>
      </div>
    </div>
  );
}
