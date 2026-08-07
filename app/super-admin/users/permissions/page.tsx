"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useState } from "react";

const MODULES = [
  'Dashboard', 'Leads', 'Inventory', 'Meetings', 'Clients', 'Tasks', 'AI tools', 'Reports'
];

const ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve'];

const ROLES = [
  'Admin',
  'Sales Manager',
  'Sales Executive',
  'Supply Manager',
  'Supply Executive'
];

export default function PermissionsPage() {
  const router = useRouter();
  
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  
  // mock permission state: role -> module -> action -> boolean
  const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    const init: any = {};
    for (const role of ROLES) {
      init[role] = {};
      for (const mod of MODULES) {
        init[role][mod] = {
          'View': true,
          'Create': role.includes('Admin') || role.includes('Manager'),
          'Edit': role.includes('Admin') || role.includes('Manager'),
          'Delete': role === 'Admin',
          'Approve': role === 'Admin' || role.includes('Manager')
        };
      }
    }
    return init;
  });

  const togglePermission = (mod: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [mod]: {
          ...prev[selectedRole][mod],
          [action]: !prev[selectedRole][mod][action]
        }
      }
    }));
  };

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors mx-auto ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 bg-white w-3 h-3 rounded-full shadow transition-all ${active ? 'right-1' : 'left-1'}`} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Role Permissions</h1>
            <p className="text-slate-500 mt-1">Configure workspace module access and actions per role.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side: Roles */}
        <div className="md:col-span-1 space-y-2">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                selectedRole === role 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Right Side: Matrix */}
        <div className="md:col-span-3">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Matrix for {selectedRole}
              </h2>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 min-w-[150px]">Module</th>
                      {ACTIONS.map(action => (
                        <th key={action} className="px-4 py-4 text-center border-l border-slate-100">{action}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MODULES.map((mod) => (
                      <tr key={mod} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{mod}</td>
                        {ACTIONS.map(action => (
                          <td key={action} className="px-4 py-4 border-l border-slate-100">
                            <Toggle 
                              active={permissions[selectedRole][mod][action]} 
                              onClick={() => togglePermission(mod, action)} 
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
