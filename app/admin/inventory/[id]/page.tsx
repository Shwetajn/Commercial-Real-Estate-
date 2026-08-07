"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, ArrowLeft, CheckCircle2, XCircle, AlertCircle, 
  MapPin, FileText, Clock, Layers, FileIcon 
} from "lucide-react";

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { properties, simulateAdminApproval, simulateAdminRejection, updatePropertyStatus } = useAppStore();
  
  const property = properties.find(p => p.id === params.id);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <button onClick={() => router.push('/admin/inventory')} className="text-indigo-600 hover:underline">
          Return to Inventory
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    simulateAdminApproval(property.id);
    // Simulate navigation back or showing success state. 
    // Usually admin might stay on page to see status change.
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) return;
    simulateAdminRejection(property.id, rejectionReason);
    setRejectModalOpen(false);
  };

  const handleRequestChanges = () => {
    updatePropertyStatus(property.id, 'Draft', 'Changes Requested by Admin');
  };

  const statusColors = {
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200/50',
    'Rejected': 'bg-red-50 text-red-700 border-red-200/50',
    'Draft': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER & STICKY ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-40 py-4 border-b border-slate-200/50 -mx-8 px-8">
        <div>
          <button 
            onClick={() => router.push('/admin/inventory')}
            className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{property.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${statusColors[property.lifecycleStatus]}`}>
              {property.lifecycleStatus === 'Under Review' ? 'Pending Approval' : property.lifecycleStatus}
            </span>
          </div>
        </div>

        {property.lifecycleStatus === 'Under Review' && (
          <div className="flex gap-3">
            <button 
              onClick={() => setRejectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button 
              onClick={handleRequestChanges}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-600 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
            >
              <AlertCircle className="h-4 w-4" /> Request Changes
            </button>
            <button 
              onClick={handleApprove}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve Property
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* MAIN COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* PROPERTY OVERVIEW */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" /> Property Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Developer</p>
                  <p className="font-semibold text-slate-900">{property.developer}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Location</p>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="font-semibold text-slate-900 leading-tight">
                      {property.micromarket}, {property.city}
                      <span className="block text-xs font-normal text-slate-500 mt-0.5">{property.address}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Area</p>
                  <p className="font-semibold text-slate-900">{property.totalArea.toLocaleString()} sq ft</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Building Type</p>
                  <p className="font-semibold text-slate-900">{property.buildingType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Grade</p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-700 font-bold text-sm">
                    {property.grade}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                  <p className="font-semibold text-slate-900">{property.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INVENTORY STRUCTURE */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" /> Inventory Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {property.buildingType === 'Corporate Office' || property.buildingType === 'Business Park' ? (
                <div className="space-y-6">
                  {property.towers.map(tower => (
                    <div key={tower.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="font-bold text-slate-900">{tower.name}</h4>
                        <span className="text-xs font-semibold text-slate-500">{tower.floors.length} Floors</span>
                      </div>
                      <div className="divide-y divide-slate-100 p-4 space-y-4">
                        {tower.floors.slice(0, 3).map(floor => (
                          <div key={floor.id} className="pt-2 first:pt-0">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Floor {floor.floorNumber}</span>
                            <div className="flex flex-wrap gap-2">
                              {floor.units.map(unit => {
                                let dotColor = 'bg-slate-300';
                                if (unit.status === 'Available') dotColor = 'bg-emerald-500';
                                else if (unit.status === 'Maintenance') dotColor = 'bg-amber-500';
                                
                                return (
                                  <div 
                                    key={unit.id} 
                                    onClick={() => setSelectedUnit({...unit, floor: floor.floorNumber, tower: tower.name})}
                                    className="cursor-pointer text-xs flex flex-col p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-300 hover:shadow transition-all min-w-[80px]"
                                  >
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                                      <span className="font-bold text-slate-700 leading-none">Unit {unit.unitNumber}</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 leading-none ml-3.5">{unit.seatCapacity} seats</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        {tower.floors.length > 3 && (
                          <div className="pt-4 text-center">
                            <button className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">
                              View All {tower.floors.length} Floors
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Cabin Inventory</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Private Cabins</span>
                        <div className="flex flex-wrap gap-2">
                          {[1,2,3,4].map(c => (
                            <div key={`cabin-${c}`} className="text-xs flex flex-col p-2 bg-white border border-slate-200 rounded-lg shadow-sm min-w-[80px]">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-bold text-slate-700 leading-none">Cabin 0{c}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400 leading-none ml-3.5">{c * 2 + 2} seats</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Meeting Rooms</span>
                        <div className="flex flex-wrap gap-2">
                          {[1,2].map(mr => (
                            <div key={`mr-${mr}`} className="text-xs flex flex-col p-2 bg-white border border-slate-200 rounded-lg shadow-sm min-w-[80px]">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-bold text-slate-700 leading-none">MR0{mr}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400 leading-none ml-3.5">{mr === 1 ? 10 : 20} capacity</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Open Seats</h4>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Available desks:</span>
                      <span className="text-xl font-black text-indigo-600">120</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SIDE COLUMN */}
        <div className="space-y-6">
          
          {/* SUBMISSION DETAILS */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" /> Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    {property.createdBy === 'usr_1' ? 'SV' : 'RM'}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Submitted By</p>
                    <p className="font-semibold text-slate-900">{property.createdBy === 'usr_1' ? 'Sanjay Verma' : 'Rahul Mehta'}</p>
                    <p className="text-xs text-slate-500">Supply Executive</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Submitted Date</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(property.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DOCUMENTS */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-amber-600" /> Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {property.documents.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No documents attached.</p>
              ) : (
                <div className="space-y-2">
                  {property.documents.map(doc => (
                    <a key={doc.id} href={doc.url} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">{doc.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTIVITY TIMELINE */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-2 h-2 rounded-full bg-emerald-500 mt-1.5 -ml-1 border-2 border-white ring-4 ring-slate-50" />
                  <div className="pl-4">
                    <p className="text-sm font-semibold text-slate-900">Submitted for Approval</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-2 h-2 rounded-full bg-slate-300 mt-1.5 -ml-1 border-2 border-white ring-4 ring-slate-50" />
                  <div className="pl-4">
                    <p className="text-sm font-semibold text-slate-900">Property Created</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" /> Reject Property
              </h3>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejecting this property. It will be returned to the Supply Executive.</p>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Rejection Reason</label>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Missing essential fire safety documentation."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 h-32 resize-none"
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT DETAIL MODAL */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Unit {selectedUnit.unitNumber}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedUnit.tower} • Floor {selectedUnit.floor}</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                    selectedUnit.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedUnit.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {selectedUnit.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Seats</p>
                  <p className="font-bold text-slate-900">{selectedUnit.seatCapacity}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Carpet Area</p>
                  <p className="font-bold text-slate-900">{selectedUnit.carpetArea} sq ft</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rent</p>
                  <p className="font-bold text-slate-900">₹{selectedUnit.rentPerSqFt}/sqft</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors">
                  Change Status
                </button>
                <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
