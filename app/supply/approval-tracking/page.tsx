"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, Calendar, MapPin, ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function ApprovalTrackingPage() {
  const router = useRouter();
  const { properties } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = properties.filter(p => {
    // Basic search
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Status filter
    if (activeTab === 'All') return true;
    if (activeTab === 'Under Review') return p.lifecycleStatus === 'Under Review';
    if (activeTab === 'Approved') return p.lifecycleStatus === 'Approved';
    if (activeTab === 'Rejected') return p.lifecycleStatus === 'Rejected';
    if (activeTab === 'Draft') return p.lifecycleStatus === 'Draft';
    if (activeTab === 'Changes Requested') return false; // Not strictly in lifecycle enum right now, treating as rejected for UI or empty
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
      case 'Rejected': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-700 border border-red-200"><XCircle className="h-3 w-3" /> Rejected</span>;
      case 'Under Review': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200"><Clock className="h-3 w-3" /> Under Review</span>;
      default: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200"><ShieldAlert className="h-3 w-3" /> {status}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Approval Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Track submitted properties and admin review status.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {['All', 'Under Review', 'Approved', 'Rejected', 'Changes Requested'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-md transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search properties..." 
              className="pl-9 bg-white border-slate-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          {property.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {property.micromarket}, {property.city}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        System Admin
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(property.lifecycleStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" className="font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={() => router.push(`/supply/approval-tracking/${property.id}`)}>
                          View Review
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No properties found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
