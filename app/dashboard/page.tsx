'use client';

import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui-kit';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Users, FileWarning, TrendingUp, Download, Plus } from 'lucide-react';

const MOCK_DATA = [
  { name: 'Mon', reports: 4, completed: 24 },
  { name: 'Tue', reports: 3, completed: 18 },
  { name: 'Wed', reports: 7, completed: 35 },
  { name: 'Thu', reports: 2, completed: 28 },
  { name: 'Fri', reports: 5, completed: 32 },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Sarah J.", action: "Completed Module: 'Cyber Safety'", time: "2m ago" },
  { id: 2, user: "Mike T.", action: "Submitted Incident Report #492", time: "15m ago" },
  { id: 3, user: "System", action: "Weekly Analytics Report Generated", time: "1h ago" },
  { id: 4, user: "Admin", action: "Updated 'Prevention' Policy", time: "4h ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> New Program</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Students</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Program Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-slate-500 mt-1">Average across all modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Open Reports</CardTitle>
            <FileWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-orange-600 mt-1">3 require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Engagement Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="completed" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Modules Completed" />
                <Bar dataKey="reports" fill="#F97316" radius={[4, 4, 0, 0]} name="Incidents Reported" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500">{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-indigo-600">View Full Log</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}