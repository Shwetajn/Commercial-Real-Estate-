"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Plus, Search, Filter } from "lucide-react";
import { Property } from "@/types";

export default function InventoryManagementPage() {
  const router = useRouter();
  const { properties } = useAppStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Pending Approval' | 'Approved' | 'Rejected'>('All');

  const filteredProperties = properties.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending Approval') return p.lifecycleStatus === 'Under Review';
    return p.lifecycleStatus === activeTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-2">Review, approve and manage workspace inventory.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/inventory/add')}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      {/* TABS */}
      <div className="flex space-x-1 border-b border-slate-200">
        {['All', 'Pending Approval', 'Approved', 'Rejected'].map((tab) => (
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
            {tab === 'Pending Approval' && (
              <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px]">
                {properties.filter(p => p.lifecycleStatus === 'Under Review').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* TABLE */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl font-semibold">Property</th>
                <th className="px-6 py-4 font-semibold">Submitted By</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Inventory</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Updated</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-900">No properties found</p>
                    <p className="text-xs">There are no properties matching the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{property.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{property.micromarket}, {property.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          {/* Mock initials based on createdBy */}
                          {property.createdBy === 'usr_1' ? 'SV' : 'RM'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{property.createdBy === 'usr_1' ? 'Sanjay Verma' : 'Rahul Mehta'}</div>
                          <div className="text-[10px] text-slate-500">Supply Executive</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {property.buildingType}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                        View Details
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        property.lifecycleStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                        property.lifecycleStatus === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                        property.lifecycleStatus === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200/50' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {property.lifecycleStatus === 'Under Review' ? 'Pending Approval' : property.lifecycleStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(property.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/inventory/${property.id}`)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
