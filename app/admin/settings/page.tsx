"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Shield, Database, Layout, Check, AlertTriangle } from "lucide-react";

const Toggle = ({ active, onClick }: { active: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow transition-all ${active ? 'right-1' : 'left-1'}`} />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'General' | 'Security' | 'Notifications' | 'Data Management'>('General');

  // Dummy states for interactivity
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    autoAssign: true,
    strictApproval: false,
    twoFactor: true,
    lockout: false,
    newLead: true,
    leadAssigned: true,
    leadVerification: false,
    newProperty: true,
    propertyApprove: true,
    infoRequest: true,
    taskAssigned: true,
    taskDue: true,
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Configure workspace rules, notifications, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('General')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'General' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Layout className="h-4 w-4" /> General
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
            onClick={() => setActiveTab('Data Management')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === 'Data Management' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Database className="h-4 w-4" /> Data Management
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'General' && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Workspace Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Auto-assign AI Leads</p>
                        <p className="text-sm text-slate-500">Automatically assign high-confidence AI leads to the nearest regional manager.</p>
                      </div>
                      <Toggle active={toggles.autoAssign} onClick={() => handleToggle('autoAssign')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Strict Property Approval</p>
                        <p className="text-sm text-slate-500">Require all property certifications to be uploaded before approval.</p>
                      </div>
                      <Toggle active={toggles.strictApproval} onClick={() => handleToggle('strictApproval')} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Global Defaults</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Default Currency</label>
                      <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Measurement Unit</label>
                      <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>Square Feet (sq ft)</option>
                        <option>Square Meters (sq m)</option>
                      </select>
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
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Security Settings</h2>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Authentication</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Require Two Factor Authentication</p>
                        <p className="text-sm text-slate-500">Require workspace users to verify login using OTP/authenticator.</p>
                      </div>
                      <Toggle active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Session Timeout</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Access Control</h3>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-4">Allowed Roles</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-900 mb-3">Admin</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Manage users</li>
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Approve inventory</li>
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Configure workspace</li>
                        </ul>
                      </div>
                      
                      <div className="border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-900 mb-3">Reporting Manager</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Manage assigned teams</li>
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Assign leads</li>
                        </ul>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-900 mb-3">Sales Executive</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Manage clients</li>
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> View inventory</li>
                        </ul>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4">
                        <h4 className="font-bold text-slate-900 mb-3">Supply Executive</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Add properties</li>
                          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Manage inventory submissions</li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Login Controls</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Password Policy</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>Standard</option>
                        <option>Strong</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Failed login lockout</p>
                        <p className="text-sm text-slate-500">Temporarily lock accounts after too many failed login attempts.</p>
                      </div>
                      <Toggle active={toggles.lockout} onClick={() => handleToggle('lockout')} />
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
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Lead Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">New Lead Captured</p>
                      <Toggle active={toggles.newLead} onClick={() => handleToggle('newLead')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Lead Assigned</p>
                      <Toggle active={toggles.leadAssigned} onClick={() => handleToggle('leadAssigned')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Lead Verification Required</p>
                      <Toggle active={toggles.leadVerification} onClick={() => handleToggle('leadVerification')} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Inventory Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">New Property Submitted</p>
                      <Toggle active={toggles.newProperty} onClick={() => handleToggle('newProperty')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Property Approved / Rejected</p>
                      <Toggle active={toggles.propertyApprove} onClick={() => handleToggle('propertyApprove')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Information Request Raised</p>
                      <Toggle active={toggles.infoRequest} onClick={() => handleToggle('infoRequest')} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Task Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Task Assigned</p>
                      <Toggle active={toggles.taskAssigned} onClick={() => handleToggle('taskAssigned')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-700">Task Due Reminder</p>
                      <Toggle active={toggles.taskDue} onClick={() => handleToggle('taskDue')} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Delivery Channels</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-600" />
                      <span className="font-medium text-slate-700">Email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-600" />
                      <span className="font-medium text-slate-700">In-app Notification</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-600" />
                      <span className="font-medium text-slate-700">WhatsApp</span>
                    </label>
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

          {activeTab === 'Data Management' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Import Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <Database className="h-8 w-8 text-indigo-300 mx-auto mb-3 group-hover:text-indigo-600 transition-colors" />
                        <h4 className="font-bold text-slate-900">Import Leads</h4>
                        <p className="text-xs text-slate-500 mt-1">Upload CSV / XLSX</p>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <Database className="h-8 w-8 text-emerald-300 mx-auto mb-3 group-hover:text-emerald-600 transition-colors" />
                        <h4 className="font-bold text-slate-900">Import Inventory</h4>
                        <p className="text-xs text-slate-500 mt-1">Upload property data</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Export Data</h3>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                        Export Leads
                      </button>
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                        Export Inventory
                      </button>
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                        Export Activity Logs
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Data Cleanup</h3>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Archive old leads after:</label>
                      <select className="w-64 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white">
                        <option>6 months</option>
                        <option>1 year</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-red-200 shadow-sm bg-red-50/50">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-red-900 mb-4 border-b border-red-200/50 pb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" /> Danger Zone
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-red-900">Delete Workspace Data</h4>
                      <p className="text-sm text-red-700 mt-1">Permanently remove all data and configurations. This action cannot be undone.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap">
                      Delete Workspace Data
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
