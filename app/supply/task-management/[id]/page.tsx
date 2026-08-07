"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Calendar, Building, Clock, CheckCircle2, 
  MessageSquare, Paperclip, Send, User, Target, ChevronRight, Activity
} from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, properties, updateTaskStatus } = useAppStore();
  
  const taskId = params.id as string;
  const task = tasks.find(t => t.id === taskId);
  
  const [commentText, setCommentText] = useState("");
  // Mock comments state since it's not currently in the global store model for tasks
  const [comments, setComments] = useState<any[]>([
    { id: 1, author: "Admin User", text: "Please review the updated layout plan attached in the property doc section.", time: "Yesterday, 4:30 PM", isInternal: false }
  ]);

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Task not found</h2>
        <Button variant="outline" onClick={() => router.push('/supply/task-management')}>Return to Tasks</Button>
      </div>
    );
  }

  const relatedProperty = task.relatedEntity?.type === 'Property' && task.relatedEntity.id 
    ? properties.find(p => p.id === task.relatedEntity?.id) 
    : undefined;

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

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(task.id, status);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([...comments, {
      id: Date.now(),
      author: "Current User",
      text: commentText,
      time: "Just now",
      isInternal: false
    }]);
    setCommentText("");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/supply/task-management')} className="rounded-full shrink-0 bg-white shadow-sm border border-slate-200 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <Badge variant="outline" className={`shadow-none border-none text-[10px] uppercase tracking-wider px-2 py-0.5 ${getStatusColor(task.status)}`}>
                {task.status}
              </Badge>
              <Badge variant={getPriorityVariant(task.priority)} className="shadow-none text-[10px] uppercase tracking-wider px-2 py-0.5">
                {task.priority}
              </Badge>
              <span className="text-[10px] font-mono text-slate-400">ID: {task.id.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
              {task.taskName}
            </h1>
          </div>
          <div className="flex gap-3 shrink-0">
            {task.status === 'Open' && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => handleStatusChange('In Progress')}>
                Start Task
              </Button>
            )}
            {task.status === 'In Progress' && (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" onClick={() => handleStatusChange('Completed')}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Completed
              </Button>
            )}
            {task.status === 'Completed' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-white">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Target className="h-4 w-4" /> Task Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {task.description || "No detailed description provided for this task."}
                </p>
              </CardContent>
            </Card>

            {/* Comments / Updates Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-white">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Comments & Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-slate-50/50">
                <div className="p-6 space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-1">
                        {comment.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                            <span className="text-[10px] font-medium text-slate-400">{comment.time}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment Input */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-end gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-slate-500 rounded-lg">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <textarea 
                      className="w-full min-h-[40px] max-h-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none custom-scrollbar"
                      placeholder="Add a progress note or internal comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="h-10 px-4 bg-primary hover:bg-primary/90 shrink-0"
                    disabled={!commentText.trim()}
                    onClick={handleAddComment}
                  >
                    Post <Send className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="space-y-6">
            
            {/* Task Information Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-white">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Task Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-4 flex justify-between items-center bg-white">
                    <span className="text-xs font-semibold text-slate-500">Category</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[10px]">
                      {task.relatedEntity?.type === 'Property' ? 'Inventory' : 'Internal'}
                    </Badge>
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <span className="text-xs font-semibold text-slate-500">Created Date</span>
                    <span className="text-xs font-bold text-slate-900">
                      {new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <span className="text-xs font-semibold text-slate-500">Due Date</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <span className="text-xs font-semibold text-slate-500">Assigned By</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[8px]">
                        {task.assignedBy.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{task.assignedBy}</span>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center bg-white">
                    <span className="text-xs font-semibold text-slate-500">Assigned To</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[8px]">
                        ME
                      </div>
                      <span className="text-xs font-bold text-slate-900">Current User</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Context Section */}
            {relatedProperty && (
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="p-5 border-b border-slate-100 bg-slate-50">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Building className="h-4 w-4" /> Related Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 bg-white space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{relatedProperty.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{relatedProperty.city}, {relatedProperty.micromarket}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Current Status</span>
                    <Badge variant={relatedProperty.lifecycleStatus === 'Approved' ? 'success' : 'warning'} className="text-[10px]">
                      {relatedProperty.lifecycleStatus}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => router.push(`/supply/inventory/${relatedProperty.id}`)}
                  >
                    View Property
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Task Progress Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-white">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                  
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center z-10 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-bold text-slate-900">Task Created</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Assigned by {task.assignedBy}</p>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 block">17 Jun</span>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center z-10 shrink-0 ${task.status !== 'Open' ? 'bg-indigo-500' : 'bg-slate-100'}`}>
                      {task.status !== 'Open' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-xs font-bold ${task.status !== 'Open' ? 'text-slate-900' : 'text-slate-400'}`}>Task Started</p>
                      {task.status !== 'Open' && <span className="text-[9px] font-bold text-slate-400 mt-1 block">18 Jun</span>}
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center z-10 shrink-0 ${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                      {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-xs font-bold ${task.status === 'Completed' ? 'text-slate-900' : 'text-slate-400'}`}>Completed</p>
                      {task.status === 'Completed' && <span className="text-[9px] font-bold text-slate-400 mt-1 block">19 Jun</span>}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
