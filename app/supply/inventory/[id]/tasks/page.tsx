"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Activity, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types";
import { useRouter, useParams } from "next/navigation";

export default function PropertyTasksPage() {
  const { tasks, properties, updateTaskStatus } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const propertyId = typeof params.id === 'string' ? params.id : params.id?.[0];
  
  const property = properties.find(p => p.id === propertyId);
  const propertyTasks = tasks.filter(t => t.relatedEntity?.type === 'Property' && t.relatedEntity?.id === propertyId);
  
  const [showToast, setShowToast] = useState(false);

  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Open': return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'In Progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Overdue': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openTasks = propertyTasks.filter(t => t.status === 'Open').length;
  const inProgressTasks = propertyTasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = propertyTasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = propertyTasks.filter(t => t.status === 'Overdue').length;

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-10 w-10 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">We couldn't find the property you're looking for.</p>
        <Button onClick={() => router.push('/supply/inventory')}>Return to Inventory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/supply/inventory/${propertyId}`)} className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full -ml-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{property.name} Tasks</h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">Manage and track tasks assigned specifically to this property.</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/supply/inventory/${propertyId}`)}>
          Back to Property
        </Button>
      </div>

      {/* TOP METRICS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Open</p>
            <p className="text-3xl font-bold text-slate-900">{openTasks}</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressTasks}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Completed</p>
            <p className="text-3xl font-bold text-emerald-600">{completedTasks}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">Property Tasks</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-bold">Task ID</th>
                <th className="px-6 py-4 font-bold">Task Name</th>
                <th className="px-6 py-4 font-bold">Priority</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Assigned By</th>
                <th className="px-6 py-4 font-bold">Due Date</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {propertyTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center bg-slate-50/50">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                    <h3 className="text-sm font-bold text-slate-900">You're all caught up!</h3>
                    <p className="text-xs text-slate-500 mt-1">There are no tasks assigned to this property right now.</p>
                  </td>
                </tr>
              ) : (
                propertyTasks.map((task) => (
                  <tr key={task.id} onClick={() => router.push(`/supply/task-management/${task.id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{task.id.toUpperCase()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{task.taskName}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getPriorityVariant(task.priority)} className="shadow-none text-[10px] uppercase tracking-wider px-2 py-0.5">
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`shadow-none border-none text-[10px] uppercase tracking-wider px-2 py-0.5 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {task.assignedBy}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs font-semibold text-primary hover:text-primary/90 hover:bg-slate-100"
                        onClick={() => router.push(`/supply/task-management/${task.id}`)}
                      >
                        View Task
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="font-medium text-sm">Task status updated</span>
          </div>
        </div>
      )}

    </div>
  );
}
