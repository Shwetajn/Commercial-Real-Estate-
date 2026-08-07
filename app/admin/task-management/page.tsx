"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Plus, Search, Filter, Calendar, User, AlignLeft, AlertCircle } from "lucide-react";
import { TaskStatus } from "@/types";
import { useRouter } from "next/navigation";

export default function TaskManagementPage() {
  const { tasks, addTask, employees, updateTaskStatus } = useAppStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Completed' | 'Overdue'>('All');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', assignedTo: '', priority: 'Medium' as 'High'|'Medium'|'Low', dueDate: ''
  });

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'All') return true;
    return t.status === activeTab;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;
    
    addTask({
      id: `tsk_${Date.now()}`,
      taskName: newTask.title,
      taskType: 'Internal',
      description: newTask.description,
      assignedBy: 'Admin',
      priority: newTask.priority,
      dueDate: newTask.dueDate || new Date().toISOString(),
      status: 'Open',
      history: [{ status: 'Open', date: new Date().toISOString(), notes: 'Task assigned by Admin' }]
    });
    
    setCreateModalOpen(false);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  };

  const priorityColors = {
    'High': 'bg-red-50 text-red-700 border-red-200',
    'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
    'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const statusColors = {
    'Open': 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Overdue': 'bg-red-50 text-red-700 border-red-200',
    'Cancelled': 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Task Management</h1>
          <p className="text-slate-500 mt-2">Monitor global team activity and assign cross-functional tasks.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Task
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Open', 'In Progress', 'Completed', 'Overdue'].map(status => (
          <Card key={status} className="bg-white border-slate-200 shadow-sm cursor-pointer hover:border-indigo-600 transition-all" onClick={() => setActiveTab(status as any)}>
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{status}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black text-slate-900">{tasks.filter(t => t.status === status).length}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABS */}
      <div className="flex space-x-1 border-b border-slate-200 pt-4">
        {['All', 'Open', 'In Progress', 'Completed', 'Overdue'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* LIST */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold w-[40%]">Task Details</th>
                <th className="px-6 py-4 font-semibold">Assigned To</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-900">No tasks found</p>
                    <p className="text-xs">No tasks match your current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} onClick={() => router.push(`/admin/task-management/${task.id}`)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <div>
                          <div className="font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{task.taskName}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{task.description}</div>
                          {task.relatedEntity && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                              <AlignLeft className="h-3 w-3" /> Related: {task.relatedEntity.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                          {task.assignedBy === 'Admin' ? 'A' : task.assignedBy.substring(0,1)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">Someone</p>
                          <p className="text-[10px] text-slate-500">Sales</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {task.status !== 'Completed' && (
                        <button 
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          Mark Done
                        </button>
                      )}
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE TASK MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-600" /> Create Task
                </h3>
                <p className="text-sm text-slate-500 mt-1">Assign a new task to any team member.</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Task Title *</label>
                <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Review legal documents" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Assign To *</label>
                <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Select Employee...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Priority</label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 bg-white" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Due Date</label>
                  <input type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Description</label>
                <textarea className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-600 h-24 resize-none" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Provide additional details..." />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
              <button 
                onClick={handleCreateTask}
                disabled={!newTask.title || !newTask.assignedTo}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
