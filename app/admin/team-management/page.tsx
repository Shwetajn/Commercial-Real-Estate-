"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus, Shield, MapPin, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { Employee, EmployeeRole } from "@/types";

export default function TeamManagementPage() {
  const router = useRouter();
  const { employees, addEmployee } = useAppStore();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', phone: '', role: 'Sales Manager' as EmployeeRole, region: 'North Region', 
    reportingManager: '', leadCapacity: 50, inventoryAccess: 'All Regions',
    generatedId: '', generatedPass: ''
  });

  const handleNextStep = () => {
    if (wizardStep === 3) {
      // Generate credentials
      const prefix = newEmp.role === 'Admin' ? 'A' : newEmp.role === 'Sales Manager' || newEmp.role === 'Sales Executive' ? 'S' : 'E';
      setNewEmp(prev => ({
        ...prev,
        generatedId: `WOS-${prefix}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        generatedPass: Math.random().toString(36).slice(-8) + '!'
      }));
    }
    setWizardStep(prev => prev + 1);
  };

  const handleSaveEmployee = () => {
    addEmployee({
      id: `emp_${Date.now()}`,
      employeeId: newEmp.generatedId,
      name: newEmp.name,
      email: newEmp.email,
      phone: newEmp.phone,
      role: newEmp.role,
      region: newEmp.region,
      status: 'Active',
      joinedAt: new Date().toISOString()
    });
    setAddModalOpen(false);
    setWizardStep(1);
    setNewEmp({ name: '', email: '', phone: '', role: 'Sales Manager', region: 'North Region', generatedId: '', generatedPass: '' });
  };

  const roleColors: Record<string, string> = {
    'Admin': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sales Manager': 'bg-blue-50 text-blue-700 border-blue-200',
    'Sales Executive': 'bg-sky-50 text-sky-700 border-sky-200',
    'Supply Executive': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-500 mt-2">Manage employee access, roles, and territories.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/team-management/add')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* EMPLOYEE LIST */}
        <div className="xl:col-span-3">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Employee</th>
                    <th className="px-6 py-4 font-semibold">Role & Region</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => router.push(`/admin/team-management/${emp.id}`)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/50`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {emp.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{emp.name}</div>
                            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-0.5">{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border mb-1 ${roleColors[emp.role]}`}>
                          {emp.role}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {emp.region}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>



    </div>
  );
}
