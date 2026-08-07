"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AddUserPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [workspace, setWorkspace] = useState('');

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const showReportingManager = role === 'Sales Executive' || role === 'Supply Executive';
  const showTeamAssignment = role.includes('Manager');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Provision User</h1>
          <p className="text-slate-500 mt-1">Create a new user and assign them to a workspace.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="flex items-center gap-2 flex-1">
            <div className={`h-2 rounded-full w-full transition-colors ${step >= num ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= num ? 'text-indigo-600' : 'text-slate-400'}`}>Step {num}</span>
          </div>
        ))}
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8 space-y-8">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Step 1: Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Name *</label>
                  <input type="text" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Jane Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Email Address *</label>
                  <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Phone Number</label>
                  <input type="tel" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-slate-50 focus:bg-white transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Step 2: Role Selection</h2>
              <div className="space-y-4">
                {['Admin', 'Sales Manager', 'Sales Executive', 'Supply Manager', 'Supply Executive'].map(r => (
                  <div 
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${role === r ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <span className="font-semibold text-slate-900">{r}</span>
                    {role === r && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Step 3: Assignment Logic</h2>
              
              {!role && (
                <div className="text-sm text-slate-500 text-center py-8">Please select a role in Step 2.</div>
              )}

              {showReportingManager && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Select Reporting Manager</label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-slate-50 focus:bg-white transition-colors">
                    <option value="">Select Manager</option>
                    {role === 'Sales Executive' ? (
                      <>
                        <option>Amit Sharma</option>
                        <option>Priya Sharma</option>
                      </>
                    ) : (
                      <option>Rajiv Kumar</option>
                    )}
                  </select>
                </div>
              )}

              {showTeamAssignment && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Team Assignment</label>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                      <span className="text-sm font-medium text-slate-700">Team Alpha (North Region)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-600 h-4 w-4" />
                      <span className="text-sm font-medium text-slate-700">Team Beta (South Region)</span>
                    </label>
                  </div>
                </div>
              )}

              {role === 'Admin' && (
                <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  Admins do not require reporting manager assignments. They report directly to Super Admin or function independently.
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Step 4: Workspace Access</h2>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Assign Workspace</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'admin', name: 'Admin Workspace', desc: 'Platform control & approvals' },
                    { id: 'sales', name: 'Sales Workspace', desc: 'Lead & client management' },
                    { id: 'supply', name: 'Supply Workspace', desc: 'Inventory & property management' }
                  ].map(ws => (
                    <div 
                      key={ws.id}
                      onClick={() => setWorkspace(ws.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${workspace === ws.id ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block">{ws.name}</span>
                        <span className="text-xs text-slate-500">{ws.desc}</span>
                      </div>
                      {workspace === ws.id && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-between">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2.5 text-slate-600 font-semibold text-sm hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Back
            </button>
            {step < 4 ? (
              <button 
                onClick={nextStep}
                className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={() => router.push('/super-admin/users')}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                Create User
              </button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
