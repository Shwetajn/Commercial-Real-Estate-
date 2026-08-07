"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Lock, PowerOff, CheckCircle2, ShieldAlert, Activity, User, Briefcase, MapPin, Inbox, BarChart3, Clock } from "lucide-react";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { employees } = useAppStore();
  const user = employees.find(e => e.id === params.id) || employees[0];

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => router.push('/super-admin/users')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{user.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {user.status}
              </span>
            </div>
            <p className="text-slate-500 mt-1">Manage user access, performance, and activity.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Lock className="h-4 w-4" /> Reset Password
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50">
            <PowerOff className="h-4 w-4" /> {user.status === 'Active' ? 'Disable User' : 'Activate User'}
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
            <Edit className="h-4 w-4" /> Edit User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Role */}
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
                <div className="h-24 w-24 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm font-semibold text-slate-500">{user.role}</p>
                <span className="text-xs text-slate-400 mt-1">ID: EMP-{user.id.split('_')[1] || '001'}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                  <p className="text-sm font-medium text-slate-900">+1 (555) 123-4567</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Joined</p>
                    <p className="text-sm font-medium text-slate-900">Oct 12, 2024</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Last Login</p>
                    <p className="text-sm font-medium text-slate-900">2 hrs ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Access */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-500" /> Role & Access Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Department</span>
                  <span className="text-sm font-bold text-slate-900">{user.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Workspace</span>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{user.workspaceName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Current Role</span>
                  <span className="text-sm font-bold text-indigo-600">{user.role}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Reporting Structure</p>
                {user.reportingManagerId ? (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <ArrowLeft className="h-4 w-4 rotate-90 text-slate-400" />
                    Reports to <span className="font-semibold text-slate-900">{user.reportingManagerId}</span>
                  </div>
                ) : (
                  <div className="text-sm font-medium text-slate-700">Directly reports to Admin</div>
                )}
                
                {user.role.includes('Manager') && (
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <p className="text-sm text-slate-600 font-medium">12 Team members reporting</p>
                  </div>
                )}
                
                {user.department === 'Sales' && !user.role.includes('Manager') && (
                  <div className="flex items-center gap-4 pt-2 mt-2 border-t border-slate-200 text-sm">
                    <span className="font-semibold text-slate-700">12 Leads</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-700">32 Clients</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Performance Snapshot */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" /> Performance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {user.department === 'Sales' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Leads Owned</p>
                      <p className="text-3xl font-bold text-slate-900">12</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Clients</p>
                      <p className="text-3xl font-bold text-slate-900">32</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Deals Closed</p>
                      <p className="text-3xl font-bold text-emerald-600">8</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Meetings</p>
                      <p className="text-3xl font-bold text-slate-900">45</p>
                    </div>
                  </>
                ) : user.department === 'Supply' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Properties Submitted</p>
                      <p className="text-3xl font-bold text-slate-900">18</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Approved Inventory</p>
                      <p className="text-3xl font-bold text-emerald-600">15</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending Approvals</p>
                      <p className="text-3xl font-bold text-amber-600">3</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Users Managed</p>
                      <p className="text-3xl font-bold text-slate-900">142</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Approvals Done</p>
                      <p className="text-3xl font-bold text-emerald-600">56</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Overview */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" /> Permissions Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Lead Management</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> View Leads
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Add Leads
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Edit Assigned Leads
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Inventory</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> View Inventory
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Request Changes
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Client Management</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Manage Clients
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Reports</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> View Analytics
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" /> Activity Overview
              </CardTitle>
              <button className="text-xs font-semibold text-indigo-600 hover:underline">View All Logs</button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="relative border-l border-slate-200 ml-3 space-y-6">
                  
                  {[
                    { title: 'Logged in successfully', time: '2 hours ago', type: 'login' },
                    { title: 'Updated property details for DLF Cyber City', time: '1 day ago', type: 'update' },
                    { title: 'Assigned new lead from website', time: '2 days ago', type: 'lead' },
                    { title: 'Completed meeting with Client X', time: '3 days ago', type: 'meeting' },
                    { title: 'Approved inventory request #4092', time: '5 days ago', type: 'approval' }
                  ].map((activity, i) => (
                    <div key={i} className="pl-6 relative">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  ))}

                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
