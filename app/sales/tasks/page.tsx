"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckSquare, Clock, AlertCircle, Plus, CheckCircle2, 
  Search, Filter, Calendar, Briefcase, FileText, Activity, MapPin, Target, Check
} from "lucide-react";

export default function SalesTasksPage() {
  const router = useRouter();
  const { tasks, updateTaskStatus, addTask } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All Tasks' | 'Today' | 'Upcoming' | 'Overdue' | 'Completed'>('All Tasks');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Task Modal State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('Follow Up');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Metrics
  const openTasksCount = tasks.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  // Mock logic for Due Today: Just checking if it's not completed and due date is close. In reality, compare dates.
  const dueTodayCount = tasks.filter(t => (t.status === 'Open' || t.status === 'In Progress') && new Date(t.dueDate).getDate() === new Date().getDate()).length;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  const displayTasks = tasks.filter(t => {
    if (searchTerm && !t.taskName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (activeTab === 'Completed') return t.status === 'Completed';
    if (activeTab === 'Overdue') return t.status === 'Overdue';
    if (activeTab === 'Today') return new Date(t.dueDate).getDate() === new Date().getDate() && t.status !== 'Completed';
    if (activeTab === 'Upcoming') return new Date(t.dueDate).getDate() > new Date().getDate() && t.status !== 'Completed';
    return true; // All Tasks
  });

  const getTaskTypeIcon = (type: string) => {
    switch(type) {
      case 'Follow Up': return <Activity className="h-3 w-3 mr-1 text-blue-500" />;
      case 'Meeting': return <Briefcase className="h-3 w-3 mr-1 text-purple-500" />;
      case 'Proposal': return <FileText className="h-3 w-3 mr-1 text-orange-500" />;
      case 'Deck': return <Target className="h-3 w-3 mr-1 text-pink-500" />;
      default: return <Clock className="h-3 w-3 mr-1 text-slate-500" />;
    }
  };

  const submitNewTask = () => {
    if (!newTaskTitle) return;
    
    addTask({
      id: `tsk_${Date.now()}`,
      taskName: newTaskTitle,
      taskType: newTaskType as any,
      description: newTaskDesc,
      priority: newTaskPriority as any,
      dueDate: newTaskDate || new Date().toISOString(),
      status: 'Open',
      assignedBy: 'System',
      history: [{
        status: 'Open',
        date: new Date().toISOString(),
        notes: 'Task created via dashboard.'
      }]
    });
    
    setShowAddTask(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER SECTION */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-indigo-600" /> Task Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage client activities, follow-ups and sales operations.</p>
          </div>
          <Button onClick={() => setShowAddTask(true)} className="bg-indigo-600 hover:bg-indigo-700 font-semibold h-10 px-6">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>

        {/* TABS & FILTERS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 p-2 gap-4">
            <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar">
              {(['All Tasks', 'Today', 'Upcoming', 'Overdue', 'Completed'] as const).map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-md transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto px-2 md:px-0 md:mr-2 mb-2 md:mb-0">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-9 h-9 text-sm bg-slate-50 border-slate-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-9 px-3 border-slate-200 text-slate-600 font-semibold hidden md:flex">
                <Filter className="h-4 w-4 mr-2"/> Filters
              </Button>
            </div>
          </div>

          {/* TASKS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold w-10">
                    <div className="w-4 h-4 border border-slate-300 rounded bg-white"></div>
                  </th>
                  <th className="px-6 py-4 font-bold">Task</th>
                  <th className="px-6 py-4 font-bold">Related To</th>
                  <th className="px-6 py-4 font-bold">Task Type</th>
                  <th className="px-6 py-4 font-bold">Due Date</th>
                  <th className="px-6 py-4 font-bold">Priority</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayTasks.map(task => (
                  <tr key={task.id} onClick={() => router.push(`/sales/tasks/${task.id}`)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="w-4 h-4 border border-slate-300 rounded bg-white group-hover:border-indigo-400 transition-colors cursor-pointer flex items-center justify-center">
                        {task.status === 'Completed' && <Check className="h-3 w-3 text-emerald-600" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold text-base ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.taskName}</div>
                      {task.description && <div className="text-xs text-slate-500 font-medium truncate max-w-xs">{task.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {task.relatedEntity ? (
                        <div>
                          <div className="font-semibold text-slate-800">{task.relatedEntity.name}</div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{task.relatedEntity.type}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {getTaskTypeIcon(task.taskType)} {task.taskType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/> {new Date(task.dueDate).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        task.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {task.status !== 'Completed' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => updateTaskStatus(task.id, 'Completed')}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                          </Button>
                        )}
                        <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold" onClick={() => router.push(`/sales/tasks/${task.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <CheckSquare className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {activeTab === 'Completed' ? "No completed tasks yet" : activeTab === 'Overdue' ? "You're all caught up!" : "No tasks found"}
                      </h3>
                      <p className="text-slate-500 font-medium">
                        {activeTab === 'Completed' ? "Completed activities will appear here." : "There are no tasks matching your current view."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-lg bg-white p-6 shadow-2xl animate-in zoom-in-95 border-0 rounded-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-[20px] font-bold tracking-tight text-slate-900 mb-1">Create New Task</h3>
            <p className="text-sm text-slate-500 mb-6">Add a new action item to your workspace.</p>
            
            <div className="space-y-5 mb-8">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Task Title</label>
                <Input 
                  placeholder="E.g., Follow up with client regarding proposal..." 
                  className="h-11 bg-slate-50 border-slate-200"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Task Category</label>
                  <select 
                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium"
                    value={newTaskType}
                    onChange={e => setNewTaskType(e.target.value)}
                  >
                    <option>Follow Up</option>
                    <option>Meeting</option>
                    <option>Proposal</option>
                    <option>Deck Sharing</option>
                    <option>Internal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority</label>
                  <select 
                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium"
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value)}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Related Entity</label>
                <div className="flex gap-2">
                  <select className="w-1/3 h-11 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium">
                    <option>Lead</option>
                    <option>Client</option>
                    <option>Property</option>
                    <option>None</option>
                  </select>
                  <Input placeholder="Search entity..." className="flex-1 h-11 bg-slate-50 border-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Due Date</label>
                  <Input type="date" className="h-11 bg-slate-50 border-slate-200" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)}/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Reminder</label>
                  <select className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium">
                    <option>Same Day</option>
                    <option>1 Day Before</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                <textarea 
                  className="w-full h-24 p-3 rounded-md border border-slate-200 bg-slate-50 focus:ring-1 focus:ring-indigo-600 text-sm resize-none"
                  placeholder="Add details, links or context..."
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setShowAddTask(false)} className="font-semibold h-10 px-5 text-slate-500 hover:text-slate-900">Cancel</Button>
              <Button onClick={submitNewTask} className="bg-primary hover:bg-primary/90 font-semibold h-10 px-6">
                Create Task
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
