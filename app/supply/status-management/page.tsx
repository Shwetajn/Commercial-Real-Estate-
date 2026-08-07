"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, ExternalLink, Activity, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Property } from "@/types";

export default function StatusManagementLanding() {
  const router = useRouter();
  const { properties } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Only show approved properties for status management
  const activeProperties = properties.filter(p => 
    p.lifecycleStatus === 'Approved' && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPropertyKPIs = (property: Property) => {
    let total = 0, available = 0, reserved = 0, occupied = 0, maintenance = 0;

    if (property.buildingType === 'Corporate Office' && property.towers) {
      property.towers.forEach(t => {
        t.floors.forEach(f => {
          f.units.forEach(u => {
            total++;
            if (u.status === 'Available') available++;
            else if (u.status === 'Reserved') reserved++;
            else if (u.status === 'Occupied') occupied++;
            else if (u.status === 'Under Maintenance') maintenance++;
          });
        });
      });
    } else if (property.buildingType === 'Coworking' && property.coworkingInventory) {
      const inv = property.coworkingInventory;
      // Aggregate cabins
      inv.cabins.forEach(c => {
        total++;
        if (c.status === 'Available') available++;
        else if (c.status === 'Reserved') reserved++;
        else if (c.status === 'Occupied') occupied++;
        else if (c.status === 'Under Maintenance') maintenance++;
      });
      // Aggregate meeting rooms
      inv.meetingRooms.forEach(m => {
        total++;
        if (m.status === 'Available') available++;
        else if (m.status === 'Reserved') reserved++;
        else if (m.status === 'Occupied') occupied++;
        else if (m.status === 'Under Maintenance') maintenance++;
      });
      // Seats logic
      total += inv.seats.totalSeats;
      available += inv.seats.availableSeats;
      occupied += (inv.seats.totalSeats - inv.seats.availableSeats);
    }

    return { total, available, reserved, occupied, maintenance };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Status Management</h1>
            <p className="text-sm text-slate-500 mt-1">Select a property to monitor and manage real-time operational availability.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search properties or cities..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* PROPERTY LIST */}
        <div className="grid grid-cols-1 gap-4">
          {activeProperties.map(property => {
            const kpis = getPropertyKPIs(property);
            
            return (
              <Card key={property.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="p-0 flex flex-col lg:flex-row">
                  {/* Property Info Side */}
                  <div className="p-6 bg-white lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{property.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">{property.developer || property.operatorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                        {property.buildingType}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-sm font-medium text-slate-600">{property.city}</span>
                    </div>
                  </div>

                  {/* KPI Side */}
                  <div className="p-6 bg-slate-50/50 flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Inv.</p>
                        <p className="text-xl font-bold text-slate-900">{kpis.total}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Available</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-emerald-600">{kpis.available}</p>
                          <span className="text-xs font-medium text-slate-400">({kpis.total ? Math.round((kpis.available / kpis.total) * 100) : 0}%)</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">Reserved</p>
                        <p className="text-xl font-bold text-amber-600">{kpis.reserved}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70">Occupied</p>
                        <p className="text-xl font-bold text-indigo-600">{kpis.occupied}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-600/70">Maintenance</p>
                        <p className="text-xl font-bold text-red-600">{kpis.maintenance}</p>
                      </div>

                    </div>
                  </div>

                  {/* Action Side */}
                  <div className="p-6 bg-white lg:w-48 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 justify-center lg:justify-start">
                      <Clock className="h-3.5 w-3.5" />
                      Updated recently
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 shadow-sm"
                      onClick={() => router.push(`/supply/status-management/${property.id}`)}
                    >
                      View Status <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                </div>
              </Card>
            );
          })}

          {activeProperties.length === 0 && (
            <div className="text-center p-16 bg-white rounded-xl border border-slate-200">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Properties Found</h3>
              <p className="text-slate-500 font-medium">Only approved properties appear in Status Management.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
