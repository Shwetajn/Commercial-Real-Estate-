"use client";

import { useAppStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Layers, CheckSquare, Activity, Mail, Phone, MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { currentUser, properties, tasks } = useAppStore();
  const router = useRouter();

  const myPropertiesCount = properties.filter((p) => p.createdBy === currentUser.id).length;
  const myActiveInventoryCount = properties.filter((p) => p.lifecycleStatus === 'Approved' && p.createdBy === currentUser.id).length;
  const pendingReviewsCount = properties.filter((p) => p.lifecycleStatus === 'Under Review' && p.createdBy === currentUser.id).length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed' && t.assignedBy === currentUser.id).length;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage account information and performance.</p>
        </div>
      </div>

      {/* PROFILE OVERVIEW CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="h-20 w-20 border border-slate-200 shadow-sm shrink-0">
          <AvatarImage src={currentUser.avatar || "https://i.pravatar.cc/150?u=sanjay"} />
          <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xl font-bold">SV</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-3">
           <div>
             <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
             <div className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                <Briefcase className="h-3 w-3 mr-1.5" />
                {currentUser.role}
             </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600 font-medium pt-2 border-t border-slate-100 max-w-2xl inline-grid md:w-auto w-full">
             <div className="flex items-center gap-2 justify-center md:justify-start">
               <Mail className="h-4 w-4 text-slate-400 shrink-0"/> 
               <span className="truncate">{currentUser.email}</span>
             </div>
             <div className="flex items-center gap-2 justify-center md:justify-start">
               <Phone className="h-4 w-4 text-slate-400 shrink-0"/> 
               <span>+91 98765 43210</span>
             </div>
             <div className="flex items-center gap-2 justify-center md:justify-start">
               <MapPin className="h-4 w-4 text-slate-400 shrink-0"/> 
               <span className="truncate">North India Region</span>
             </div>
             <div className="flex items-center gap-2 justify-center md:justify-start">
               <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest shrink-0">EMP ID</span> 
               <span>EMP-84729</span>
             </div>
           </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Properties Added</p>
            <p className="text-3xl font-bold text-slate-900">{myPropertiesCount}</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Approved Properties</p>
            <p className="text-3xl font-bold text-slate-900">{myActiveInventoryCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pending Reviews</p>
            <p className="text-3xl font-bold text-slate-900">{pendingReviewsCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tasks Completed</p>
            <p className="text-3xl font-bold text-slate-900">{completedTasksCount}</p>
          </div>
        </div>
      </div>

      {/* ACTIVITY SECTION */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-900 cursor-pointer hover:underline" onClick={() => router.push('/supply/inventory')}>Added New Property</p>
                <span className="text-xs text-slate-500 font-medium">Today</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">You onboarded <span className="font-semibold text-slate-900">Cyber Hub Workspace</span> and submitted it for review.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-900 cursor-pointer hover:underline" onClick={() => router.push('/supply/status-management')}>Updated Unit Availability</p>
                <span className="text-xs text-slate-500 font-medium">Yesterday</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Marked Unit 501 at DLF Tower A as <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Occupied</span>.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-900 cursor-pointer hover:underline" onClick={() => router.push('/supply/task-management')}>Completed Verification Task</p>
                <span className="text-xs text-slate-500 font-medium">3 days ago</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Verified building information for One Horizon Center.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
