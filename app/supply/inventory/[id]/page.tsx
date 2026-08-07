"use client";

import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building, AlertCircle, MapPin, CheckCircle2, FileText, Activity as ActivityIcon, Save, ChevronDown, Edit2, ChevronRight, MoreHorizontal, ExternalLink } from "lucide-react";
import { PropertyLifecycleStatus, UnitStatus, Property } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, updateProperty, updateUnitStatus } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Property>>({});
  
  const [expandedTowers, setExpandedTowers] = useState<Record<string, boolean>>({});
  const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);
  
  const propertyId = typeof params.id === 'string' ? params.id : params.id?.[0];
  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Record Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested inventory record does not exist.</p>
        <Button onClick={() => router.push('/supply/inventory')} className="bg-slate-900 hover:bg-slate-800 text-sm">Return to Inventory</Button>
      </div>
    );
  }

  const getStatusVariant = (status: PropertyLifecycleStatus) => {
    switch (status) {
      case 'Draft': return 'outline';
      case 'Under Review': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  const getUnitStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'Available': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Occupied': return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'Under Maintenance': return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  // Helper Calculations
  let totalAvailable = 0;
  let totalOccupied = 0;
  let totalMaintenance = 0;

  if (property.buildingType === 'Coworking') {
    totalAvailable = property.coworkingInventory?.seats.availableSeats || 0;
    totalOccupied = (property.coworkingInventory?.seats.totalSeats || 0) - totalAvailable;
  } else {
    if (property.towers) {
      property.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
        if (u.status === 'Available') totalAvailable++;
        else if (u.status === 'Occupied') totalOccupied++;
        else totalMaintenance++;
      })));
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-6">
      
      {/* 1. PAGE HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/supply/inventory')} className="shrink-0 h-8 w-8 text-slate-500 hover:bg-slate-100 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {isEditing ? (
                <input type="text" className="text-xl font-bold text-slate-900 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none w-[300px]" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              ) : (
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{property.name}</h1>
              )}
              <Badge variant={getStatusVariant(property.lifecycleStatus)} className="text-[10px] px-2 py-0.5 shadow-none uppercase tracking-wider">
                {property.lifecycleStatus}
              </Badge>
              <Badge className={`text-[10px] px-2 py-0.5 shadow-none uppercase tracking-wider ${property.buildingType === 'Coworking' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                {property.buildingType}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {property.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  updateProperty(property.id, editData);
                  setIsEditing(false);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }} 
              >
                <Save className="h-4 w-4 mr-2" /> Save Details
              </Button>
            </>
          ) : (
            <Button onClick={() => { setIsEditing(true); setEditData({ name: property.name, developer: property.developer, address: property.address, yearBuilt: property.yearBuilt, totalArea: property.totalArea, description: property.description }); }} variant="outline">
              <Edit2 className="h-4 w-4 mr-2" /> Edit Record
            </Button>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Record updated successfully
        </div>
      )}

      {/* 2. STATS ROW (4 equal cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Developer</p>
          <p className="text-base font-semibold text-slate-900 truncate">{property.developer || property.operatorName}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Total Area</p>
          <p className="text-base font-semibold text-slate-900">{property.totalArea.toLocaleString()} sqft</p>
        </div>
        {property.buildingType === 'Coworking' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Total Seats</p>
              <p className="text-base font-semibold text-slate-900">{property.coworkingInventory?.seats.totalSeats || 0}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Available Seats</p>
              <p className="text-base font-bold text-emerald-600">{property.coworkingInventory?.seats.availableSeats || 0}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Structure</p>
              <p className="text-base font-semibold text-slate-900">{(property.towers || []).length} Towers / {(property.towers || []).reduce((acc, t) => acc + t.floors.length, 0)} Floors</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Available Units</p>
              <p className="text-base font-bold text-emerald-600">{totalAvailable}</p>
            </div>
          </>
        )}
      </div>

      {/* 3. MAIN CONTENT AREA (70/30 Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 items-start">
        
        {/* LEFT COLUMN (70%) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="w-full flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-6 pt-4">
              <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 rounded-none border-b-2 border-transparent pb-3 pt-1 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-slate-900">Overview</TabsTrigger>
                <TabsTrigger value="structure" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 rounded-none border-b-2 border-transparent pb-3 pt-1 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-slate-900">Inventory Structure</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 rounded-none border-b-2 border-transparent pb-3 pt-1 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-slate-900">Documents</TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 rounded-none border-b-2 border-transparent pb-3 pt-1 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-slate-900">Activity</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0 outline-none space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Building Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Developer</p>
                      {isEditing ? (
                        <input type="text" className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={editData.developer} onChange={(e) => setEditData({...editData, developer: e.target.value})} />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{property.developer}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Grade</p>
                      <p className="text-sm font-medium text-slate-900">{property.grade ? `Grade ${property.grade}` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                      <p className="text-sm font-medium text-slate-900">{property.status}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Year Built</p>
                      {isEditing ? (
                        <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={editData.yearBuilt || 0} onChange={(e) => setEditData({...editData, yearBuilt: Number(e.target.value)})} />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{property.yearBuilt}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Micromarket</p>
                      <p className="text-sm font-medium text-slate-900">{property.micromarket}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Address</p>
                      {isEditing ? (
                        <input type="text" className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm" value={editData.address || ''} onChange={(e) => setEditData({...editData, address: e.target.value})} />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{property.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Description</h3>
                  {isEditing ? (
                    <textarea className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm min-h-[100px]" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
                  )}
                </div>

                {property.operatingHours && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Technical Details</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Operating Hours</p>
                    <p className="text-sm text-slate-900 font-medium">{property.operatingHours}</p>
                  </div>
                )}
                
                {property.certifications && property.certifications.length > 0 && (
                   <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Amenities & Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.certifications.map(c => (
                        <Badge key={c} variant="secondary" className="font-semibold bg-slate-100 text-slate-700 shadow-none border border-slate-200">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* INVENTORY STRUCTURE TAB */}
              <TabsContent value="structure" className="mt-0 outline-none">
                {property.buildingType === 'Coworking' && property.coworkingInventory ? (
                  <div className="space-y-6">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                        <h4 className="text-sm font-bold text-slate-900">Coworking Inventory Summary</h4>
                      </div>
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                          <tr>
                            <th className="px-4 py-2 font-bold">Category</th>
                            <th className="px-4 py-2 font-bold text-right">Count</th>
                            <th className="px-4 py-2 font-bold text-right">Available</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-900">Dedicated Desks</td>
                            <td className="px-4 py-3 text-right">{property.coworkingInventory.seats.totalSeats}</td>
                            <td className="px-4 py-3 text-right text-emerald-600 font-bold">{property.coworkingInventory.seats.availableSeats}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-900">Private Cabins</td>
                            <td className="px-4 py-3 text-right">{property.coworkingInventory.cabins.length}</td>
                            <td className="px-4 py-3 text-right">{property.coworkingInventory.cabins.filter(c => c.status === 'Available').length}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-900">Meeting Rooms</td>
                            <td className="px-4 py-3 text-right">{property.coworkingInventory.meetingRooms.length}</td>
                            <td className="px-4 py-3 text-right">{property.coworkingInventory.meetingRooms.filter(m => m.status === 'Available').length}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
                    {(property.towers || []).map(tower => {
                      const isTowerExpanded = expandedTowers[tower.id] ?? true;
                      return (
                        <div key={tower.id} className="bg-white">
                          <div 
                            onClick={() => setExpandedTowers(p => ({...p, [tower.id]: !isTowerExpanded}))}
                            className="px-4 py-3 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isTowerExpanded ? 'rotate-90' : ''}`} />
                              <h4 className="font-semibold text-slate-900 text-sm">{tower.name}</h4>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{tower.floors.length} Floors</span>
                          </div>
                          
                          {isTowerExpanded && (
                            <div className="bg-white pb-2 divide-y divide-slate-100">
                              {tower.floors.map(floor => {
                                const isFloorExpanded = expandedFloors[floor.id] ?? true;
                                return (
                                  <div key={floor.id} className="pl-8 pr-4 py-2">
                                    <div 
                                      onClick={() => setExpandedFloors(p => ({...p, [floor.id]: !isFloorExpanded}))}
                                      className="py-2 flex items-center gap-2 cursor-pointer hover:text-slate-900 text-slate-600 transition-colors"
                                    >
                                      <ChevronRight className={`h-3 w-3 transition-transform ${isFloorExpanded ? 'rotate-90' : ''}`} />
                                      <span className="text-xs font-bold uppercase tracking-widest">Floor {floor.floorNumber}</span>
                                    </div>
                                    
                                    {isFloorExpanded && (
                                      <div className="pl-5 pt-2 pb-3">
                                        <table className="w-full text-left text-xs bg-white border border-slate-200 rounded-lg overflow-hidden">
                                          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-widest">
                                            <tr>
                                              <th className="px-3 py-2 font-bold">Unit</th>
                                              <th className="px-3 py-2 font-bold">Area</th>
                                              <th className="px-3 py-2 font-bold">Seats</th>
                                              <th className="px-3 py-2 font-bold">Status</th>
                                              <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 text-slate-600">
                                            {floor.units.map(unit => (
                                              <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2 font-semibold text-slate-900">{unit.unitNumber}</td>
                                                <td className="px-3 py-2">{unit.area} sqft</td>
                                                <td className="px-3 py-2">{unit.seatCapacity} seats</td>
                                                <td className="px-3 py-2">
                                                  <Badge variant="outline" className={`border-none ${getUnitStatusColor(unit.status)} px-1.5 py-0.5 text-[9px]`}>{unit.status}</Badge>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                  <Button variant="outline" size="sm" onClick={() => router.push('/supply/status-management')}>Update Status</Button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="mt-0 outline-none">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-bold">Document Name</th>
                        <th className="px-4 py-3 font-bold">Type</th>
                        <th className="px-4 py-3 font-bold">Uploaded Date</th>
                        <th className="px-4 py-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {property.documents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">No documents uploaded</td>
                        </tr>
                      ) : (
                        property.documents.map(doc => (
                          <tr key={doc.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-400" /> {doc.name}
                            </td>
                            <td className="px-4 py-3">PDF</td>
                            <td className="px-4 py-3">12 Jun 2026</td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* ACTIVITY TAB */}
              <TabsContent value="activity" className="mt-0 outline-none">
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                    <div className="relative flex items-start group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-50 text-indigo-600 z-10 shrink-0">
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-slate-900">Inventory Updated</p>
                          <span className="text-[10px] uppercase font-bold text-slate-400">2 hrs ago</span>
                        </div>
                        <p className="text-sm text-slate-600">Unit availability updated across Tower A.</p>
                      </div>
                    </div>
                    <div className="relative flex items-start group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-50 text-emerald-600 z-10 shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm w-full">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-slate-900">Property Created</p>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{new Date(property.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600">Initial property record and structures created.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Status Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Lifecycle</p>
                <Badge variant={getStatusVariant(property.lifecycleStatus)} className="shadow-none rounded-md px-2 py-1 text-xs">{property.lifecycleStatus}</Badge>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-slate-900">12 June 2026</p>
              </div>
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Inventory Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Available</span>
                <span className="text-sm font-bold text-emerald-600">{totalAvailable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Occupied</span>
                <span className="text-sm font-bold text-slate-900">{totalOccupied}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Maintenance</span>
                <span className="text-sm font-bold text-amber-600">{totalMaintenance}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest border-b border-slate-100 pb-2">Quick Actions</h3>
            <div className="space-y-3 flex flex-col">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/supply/inventory/${property.id}?edit=true`)}>
                Edit Property Details
              </Button>
              <Button className="w-full justify-start" onClick={() => router.push('/supply/status-management')}>
                Update Unit Status
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/supply/task-management')}>
                View Assigned Tasks
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
