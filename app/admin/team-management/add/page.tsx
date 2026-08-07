"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Shield, MapPin, Key, CheckCircle2, Copy } from "lucide-react";

export default function AddEmployeePage() {
  const router = useRouter();
  const { addEmployee, employees } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '', // Sales Manager, Sales Executive, Supply Manager, Supply Executive
    region: '',
    city: '',
    reportingManagerId: '',
    generatedId: '',
    tempPassword: ''
  });

  const generateCredentials = () => {
    const newId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let newPassword = '';
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, generatedId: newId, tempPassword: newPassword }));
    setCurrentStep(4);
  };

  const handleCreateEmployee = () => {
    const department = formData.role.includes('Sales') ? 'Sales' : 'Supply';
    const workspaceName = department + ' Workspace';
    
    addEmployee({
      id: `emp_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: department,
      role: formData.role,
      workspaceName: workspaceName,
      reportingManagerId: formData.reportingManagerId || undefined,
      status: 'Active',
      region: formData.region,
      joiningDate: new Date().toISOString().split('T')[0],
      propertiesCount: 0
    });
    
    router.push('/admin/team-management');
  };

  // Managers to populate the reporting manager dropdown
  const potentialManagers = employees.filter(emp => emp.role.includes('Manager') && emp.role.includes(formData.role.split(' ')[0]));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* BACK NAVIGATION */}
        <Button variant="ghost" onClick={() => router.push('/admin/team-management')} className="text-slate-600 hover:text-slate-900 -ml-2 font-bold px-3">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team Management
        </Button>

        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Onboard New Employee</h1>
            <p className="text-sm text-slate-500 mt-1">Add a new team member and configure their platform access.</p>
          </div>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, label: 'Employee Details', icon: <UserPlus className="h-4 w-4" /> },
            { step: 2, label: 'Role Assignment', icon: <Shield className="h-4 w-4" /> },
            { step: 3, label: 'Region Assignment', icon: <MapPin className="h-4 w-4" /> },
            { step: 4, label: 'Credentials', icon: <Key className="h-4 w-4" /> }
          ].map((s, i) => (
            <div key={s.step} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                currentStep === s.step 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                  : currentStep > s.step 
                    ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {currentStep > s.step ? <CheckCircle2 className="h-5 w-5" /> : s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${currentStep >= s.step ? 'text-indigo-900' : 'text-slate-400'}`}>{s.label}</span>
              {i < 3 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${currentStep > s.step ? 'bg-indigo-200' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* WIZARD CONTENT */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Employee Details</h3>
                <p className="text-sm text-slate-500">Provide basic contact information.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" className="bg-slate-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john.doe@estateos.com" className="bg-slate-50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="bg-slate-50" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button disabled={!formData.name || !formData.email || !formData.phone} onClick={() => setCurrentStep(2)} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">Next Step</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Role Assignment</h3>
                <p className="text-sm text-slate-500">Select the functional role for this employee. Admin creation is restricted.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Sales Manager', 'Sales Executive', 'Supply Manager', 'Supply Executive'].map(role => (
                  <div 
                    key={role}
                    onClick={() => setFormData({...formData, role})}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === role ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{role}</h4>
                      {formData.role === role && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{role.includes('Manager') ? 'Full access to team performance and approvals.' : 'Standard operational access for executing tasks.'}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="font-semibold text-slate-500">Back</Button>
                <Button disabled={!formData.role} onClick={() => setCurrentStep(3)} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">Next Step</Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Region Assignment</h3>
                <p className="text-sm text-slate-500">Assign geographical focus and reporting structure.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Region</label>
                    <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="" disabled>Select Region</option>
                      <option value="North Region">North Region</option>
                      <option value="South Region">South Region</option>
                      <option value="East Region">East Region</option>
                      <option value="West Region">West Region</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">City (Optional)</label>
                    <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Mumbai" className="bg-slate-50" />
                  </div>
                </div>

                {formData.role.includes('Executive') && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Reporting Manager</label>
                    <select value={formData.reportingManagerId} onChange={e => setFormData({...formData, reportingManagerId: e.target.value})} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none">
                      <option value="" disabled>Select {formData.role.split(' ')[0]} Manager</option>
                      {potentialManagers.length > 0 ? potentialManagers.map(mgr => (
                        <option key={mgr.id} value={mgr.name}>{mgr.name} ({mgr.region})</option>
                      )) : (
                        <option value="System Admin">System Admin (Default fallback)</option>
                      )}
                    </select>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Executives must be assigned to a manager.</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="font-semibold text-slate-500">Back</Button>
                <Button disabled={!formData.region || (formData.role.includes('Executive') && !formData.reportingManagerId)} onClick={generateCredentials} className="bg-primary hover:bg-primary/90 font-bold px-8">Generate Credentials</Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Credentials Generated</h3>
                <p className="text-sm text-slate-500">Please securely share these credentials with the employee. They will be prompted to change the password upon first login.</p>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Employee ID / Username</p>
                    <p className="text-xl font-bold text-slate-900">{formData.generatedId}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => navigator.clipboard.writeText(formData.generatedId)}><Copy className="h-3 w-3 mr-1.5" /> Copy</Button>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Temporary Password</p>
                    <p className="text-xl font-bold text-indigo-600 tracking-wider">{formData.tempPassword}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => navigator.clipboard.writeText(formData.tempPassword)}><Copy className="h-3 w-3 mr-1.5" /> Copy</Button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(3)} className="font-semibold text-slate-500">Back</Button>
                <Button onClick={handleCreateEmployee} className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8 shadow-md">Create Employee</Button>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}
