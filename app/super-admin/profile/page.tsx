"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, KeyRound, Smartphone } from "lucide-react";

export default function ProfilePage() {
  const { currentUser } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-2">Manage your Super Admin account and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-white border-slate-200 shadow-sm text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
                {currentUser?.name.charAt(0) || 'S'}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name || 'System Admin'}</h2>
              <p className="text-sm font-semibold text-indigo-600 mt-1">Super Admin</p>
              <div className="mt-6 flex flex-col gap-2">
                <button className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Upload Photo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Name</label>
                  <input type="text" defaultValue={currentUser?.name} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Email Address</label>
                  <input type="email" defaultValue={currentUser?.email} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Phone</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Details
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <KeyRound className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Password</h4>
                    <p className="text-xs text-slate-500">Last changed 45 days ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Update
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">Enabled via Authenticator App</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Configure
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
