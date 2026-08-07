"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout, Shield, Bell, Database, Image as ImageIcon } from "lucide-react";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<'Branding' | 'Security' | 'Notifications' | 'Data'>('Branding');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Manage global configurations for Estate OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('Branding')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'Branding' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ImageIcon className="h-4 w-4" /> Branding
          </button>
          <button 
            onClick={() => setActiveTab('Security')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'Security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Shield className="h-4 w-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('Notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'Notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('Data')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'Data' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Database className="h-4 w-4" /> Data Management
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'Branding' && (
            <Card className="bg-white border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Platform Identity</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Platform Name</label>
                      <input type="text" defaultValue="Estate OS" className="w-full md:w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Global Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                          <Layout className="h-8 w-8" />
                        </div>
                        <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                          Upload New Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Global Theme</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-indigo-600 border border-slate-200"></div>
                        <input type="text" defaultValue="#4F46E5" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Security' && (
            <Card className="bg-white border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Security Enforcement</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Enforce 2FA Globally</p>
                        <p className="text-sm text-slate-500">Require all organizations to use Two-Factor Authentication.</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Global Session Timeout</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>Never</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Password Policy</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>Strict (Alphanumeric + Symbols)</option>
                        <option>Standard (Alphanumeric)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Notifications' && (
            <Card className="bg-white border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">System Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Storage Usage Warnings (90% threshold)</p>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">API Rate Limit Warnings</p>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Email Templates</h3>
                  <p className="text-sm text-slate-500 mb-4">Manage global email templates for system notifications.</p>
                  <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                    Manage Templates
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Data' && (
            <Card className="bg-white border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Data Retention Policy</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Audit Logs Retention</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>90 Days</option>
                        <option>1 Year</option>
                        <option>3 Years</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Backup Frequency</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Continuous</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
