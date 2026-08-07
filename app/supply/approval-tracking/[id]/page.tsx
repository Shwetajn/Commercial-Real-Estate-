"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, CheckCircle2, XCircle, Clock, FileText, AlertTriangle, User as UserIcon } from "lucide-react";

export default function ApprovalDetailView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { properties } = useAppStore();
  const property = properties.find(p => p.id === params.id);

  if (!property) {
    return (
      <div className="flex-1 p-8 h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Property not found</h2>
        <Button onClick={() => router.push('/supply/approval-tracking')} className="mt-4">Back to Tracking</Button>
      </div>
    );
  }

  // Create a timeline based on the status
  const steps = [
    { title: 'Property Created', date: new Date(property.createdAt).toLocaleDateString(), completed: true, icon: <FileText className="h-4 w-4" /> },
    { title: 'Submitted for Review', date: new Date(property.createdAt).toLocaleDateString(), completed: true, icon: <CheckCircle2 className="h-4 w-4" /> },
    { title: 'Admin Reviewing', date: 'In Progress', completed: property.lifecycleStatus !== 'Draft', icon: <Clock className="h-4 w-4" /> },
    { 
      title: property.lifecycleStatus === 'Rejected' ? 'Rejected' : property.lifecycleStatus === 'Approved' ? 'Approved' : 'Pending Decision', 
      date: property.lifecycleStatus === 'Approved' || property.lifecycleStatus === 'Rejected' ? new Date().toLocaleDateString() : 'Pending', 
      completed: property.lifecycleStatus === 'Approved' || property.lifecycleStatus === 'Rejected', 
      icon: property.lifecycleStatus === 'Rejected' ? <XCircle className="h-4 w-4" /> : property.lifecycleStatus === 'Approved' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" /> 
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* BACK NAVIGATION */}
        <Button variant="ghost" onClick={() => router.push('/supply/approval-tracking')} className="text-slate-600 hover:text-slate-900 -ml-2 font-bold px-3">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Approval Tracking
        </Button>

        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-indigo-600" /> {property.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Property Approval Details</p>
          </div>
          
          <div className="flex gap-2">
            {property.lifecycleStatus === 'Rejected' && (
              <Button onClick={() => router.push(`/supply/inventory/${property.id}/edit`)} className="bg-indigo-600 hover:bg-indigo-700">
                Edit Property & Resubmit
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(`/supply/inventory/${property.id}`)}>
              View Property Form
            </Button>
          </div>
        </div>

        {/* REJECTION / APPROVAL BANNER */}
        {property.lifecycleStatus === 'Rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm flex gap-4 items-start animate-in slide-in-from-bottom-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">Property Rejected / Changes Requested</h3>
              <p className="text-sm font-medium text-red-700 mt-2 bg-white/60 p-3 rounded-lg border border-red-100 inline-block">
                <span className="font-bold block text-xs uppercase tracking-widest mb-1 text-red-500">Admin Comment</span>
                {property.rejectionReason || 'Floor plans missing or unclear pricing details.'}
              </p>
              <div className="mt-4">
                <Button onClick={() => router.push(`/supply/inventory/${property.id}/edit`)} variant="outline" className="text-red-700 border-red-200 hover:bg-red-100 font-semibold">
                  Update Property & Resubmit
                </Button>
              </div>
            </div>
          </div>
        )}

        {property.lifecycleStatus === 'Approved' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm flex gap-4 items-center animate-in slide-in-from-bottom-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 text-lg">Property Approved</h3>
              <p className="text-sm font-medium text-emerald-700 flex items-center gap-2 mt-1">
                Approved by: <span className="font-bold flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> System Admin</span> on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        <Card className="p-6 border-slate-200 shadow-sm bg-white">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" /> Approval Timeline
          </h3>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
            {steps.map((step, i) => (
              <div key={i} className={`relative flex items-center gap-6 ${!step.completed ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 z-10 shadow-sm shadow-slate-200 ${
                  step.completed 
                    ? step.title === 'Rejected' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-base ${step.completed ? (step.title === 'Rejected' ? 'text-red-700' : 'text-slate-900') : 'text-slate-500'}`}>{step.title}</h4>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
