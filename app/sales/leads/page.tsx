"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Search, Filter, MoreHorizontal, User as UserIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LeadsPage() {
  const router = useRouter();
  const { leads, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All' | 'My Leads' | 'Open' | 'Closed'>('All');

  const filteredLeads = leads.filter(lead => {
    if (activeTab === 'My Leads') return lead.assignedExecutive === currentUser.id;
    if (activeTab === 'Open') return lead.status !== 'Closed';
    if (activeTab === 'Closed') return lead.status === 'Closed';
    return true; // All
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New Requirement': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'Property Suggested': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      case 'Proposal Sent': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'Negotiation': return 'bg-pink-50 text-pink-700 ring-pink-600/20';
      case 'Closed': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Lead Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">Manage client requirements and active opportunities.</p>
        </div>
        <Button onClick={() => router.push('/sales/leads/add')} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Add New Lead
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg">
              {['All', 'My Leads', 'Open', 'Closed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab 
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  className="pl-9 h-9 border-slate-200 bg-slate-50 text-sm focus-visible:ring-indigo-600/20"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Requirement</th>
                <th className="px-6 py-4 font-semibold">Budget</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Activity</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/sales/leads/${lead.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {lead.type === 'Company' ? <Building2 className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{lead.type === 'Company' ? lead.companyName : lead.clientName}</div>
                          <div className="text-xs text-slate-500">{lead.type === 'Company' ? lead.contactPerson : lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{lead.lookingFor}</div>
                      <div className="text-xs text-slate-500">
                        {lead.lookingFor === 'Commercial Office' ? `${lead.requiredArea} sq ft` : `${lead.coworkingSeats} Seats`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                      {lead.budgetRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {lead.micromarket}, {lead.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                      {new Date(lead.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/sales/leads/${lead.id}`); }} className="text-sm font-medium">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/sales/deck-generation?lead=${lead.id}`); }} className="text-sm font-medium">
                            Generate Deck
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No leads found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
