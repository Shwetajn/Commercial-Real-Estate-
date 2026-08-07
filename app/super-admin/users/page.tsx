"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const { employees } = useAppStore();
  const router = useRouter();

  const users = employees.map((emp) => ({
    ...emp,
    lastLogin: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString()
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Directory</h1>
          <p className="text-slate-500 mt-2">Manage internal users, assign workspaces, and define platform roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/super-admin/users/permissions')}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ShieldAlert className="h-4 w-4" />
            Role Permissions
          </button>
          <button 
            onClick={() => router.push('/super-admin/users/add')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by name, email..."
              className="w-full rounded-lg bg-white pl-9 border-slate-200 focus-visible:ring-indigo-600/20 text-sm h-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium outline-none focus:border-indigo-600">
              <option>All Departments</option>
              <option>Operations</option>
              <option>Sales</option>
              <option>Supply</option>
            </select>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium outline-none focus:border-indigo-600">
              <option>All Workspaces</option>
              <option>Admin Workspace</option>
              <option>Sales Workspace</option>
              <option>Supply Workspace</option>
            </select>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Workspace</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Reporting Manager</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.department}</td>
                    <td className="px-6 py-4 text-slate-600">{user.workspaceName}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {user.reportingManagerId || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/super-admin/users/${user.id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          View User
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
