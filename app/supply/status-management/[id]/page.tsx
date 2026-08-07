"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Activity, LayoutGrid, CheckCircle2, Clock, Layers, Users, X, History } from "lucide-react";
import { UnitStatus, Unit } from "@/types";

export default function PropertyStatusDashboard() {
  const params = useParams();
  const router = useRouter();
  const { properties, updateUnitStatus, currentUser } = useAppStore();
  
  const propertyId = params.id as string;
  const property = properties.find(p => p.id === propertyId);

  // Level 3 States
  const [activeSegment, setActiveSegment] = useState<string | null>(null); // 'tower-id', 'cabins', 'meeting-rooms', 'seats'
  
  // Modals for Update & History
  const [selectedUnit, setSelectedUnit] = useState<{ towerId?: string, floorId?: string, unitId?: string, currentStatus: UnitStatus, type: 'commercial' | 'cabin' | 'meetingRoom' | 'seat' } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<any | null>(null);

  // Form State
  const [newStatus, setNewStatus] = useState<UnitStatus>('Available');
  const [statusReason, setStatusReason] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  if (!property) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Property not found</h2>
        <Button variant="link" onClick={() => router.push('/supply/status-management')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Calculate Property-level KPIs
  let total = 0, available = 0, reserved = 0, occupied = 0, maintenance = 0;
  if (property.buildingType === 'Corporate Office' && property.towers) {
    property.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
      total++;
      if (u.status === 'Available') available++;
      else if (u.status === 'Reserved') reserved++;
      else if (u.status === 'Occupied') occupied++;
      else if (u.status === 'Under Maintenance') maintenance++;
    })));
  } else if (property.buildingType === 'Coworking' && property.coworkingInventory) {
    const inv = property.coworkingInventory;
    inv.cabins.forEach(c => {
      total++;
      if (c.status === 'Available') available++;
      else if (c.status === 'Reserved') reserved++;
      else if (c.status === 'Occupied') occupied++;
      else if (c.status === 'Under Maintenance') maintenance++;
    });
    inv.meetingRooms.forEach(m => {
      total++;
      if (m.status === 'Available') available++;
      else if (m.status === 'Reserved') reserved++;
      else if (m.status === 'Occupied') occupied++;
      else if (m.status === 'Under Maintenance') maintenance++;
    });
    total += inv.seats.totalSeats;
    available += inv.seats.availableSeats;
    occupied += (inv.seats.totalSeats - inv.seats.availableSeats);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Reserved': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Occupied': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Under Maintenance': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleUpdateStatus = () => {
    if (selectedUnit) {
      const finalNotes = statusNotes || statusReason;
      
      if (selectedUnit.type === 'commercial' && selectedUnit.towerId && selectedUnit.floorId && selectedUnit.unitId) {
        updateUnitStatus(property.id, selectedUnit.towerId, selectedUnit.floorId, selectedUnit.unitId, newStatus, finalNotes);
      }
      // Note: Coworking specific updates (cabins, seats) would need their own store actions. 
      // For this prototype, we'll pretend they update (or trigger standard if mapped similarly).
      
      setSelectedUnit(null);
    }
  };

  // LEVEL 2: BREAKDOWN RENDERERS
  const renderCommercialBreakdown = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {property.towers?.map(tower => {
          let tTotal = 0, tAvail = 0, tRes = 0, tOcc = 0, tMaint = 0;
          tower.floors.forEach(f => f.units.forEach(u => {
            tTotal++;
            if (u.status === 'Available') tAvail++;
            else if (u.status === 'Reserved') tRes++;
            else if (u.status === 'Occupied') tOcc++;
            else if (u.status === 'Under Maintenance') tMaint++;
          }));

          return (
            <Card key={tower.id} className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-500" /> {tower.name}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveSegment(tower.id)}>
                  View Units
                </Button>
              </CardHeader>
              <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</p>
                  <p className="text-lg font-bold text-slate-900">{tTotal}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Available</p>
                  <p className="text-lg font-bold text-emerald-600">{tAvail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">Reserved</p>
                  <p className="text-lg font-bold text-amber-600">{tRes}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70">Occupied</p>
                  <p className="text-lg font-bold text-indigo-600">{tOcc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderCoworkingBreakdown = () => {
    if (!property.coworkingInventory) return null;
    const inv = property.coworkingInventory;
    
    // Cabins KPIs
    let cTotal = inv.cabins.length, cAvail = 0, cOcc = 0;
    inv.cabins.forEach(c => {
      if (c.status === 'Available') cAvail++;
      if (c.status === 'Occupied') cOcc++;
    });

    // Meetings KPIs
    let mTotal = inv.meetingRooms.length, mAvail = 0, mOcc = 0;
    inv.meetingRooms.forEach(m => {
      if (m.status === 'Available') mAvail++;
      if (m.status === 'Occupied') mOcc++;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" /> Dedicated Cabins
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSegment('cabins')}>View</Button>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-3 gap-4">
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</p><p className="text-lg font-bold text-slate-900">{cTotal}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Avail</p><p className="text-lg font-bold text-emerald-600">{cAvail}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70">Occ</p><p className="text-lg font-bold text-indigo-600">{cOcc}</p></div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-indigo-500" /> Meeting Rooms
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSegment('meeting-rooms')}>View</Button>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-3 gap-4">
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total</p><p className="text-lg font-bold text-slate-900">{mTotal}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Avail</p><p className="text-lg font-bold text-emerald-600">{mAvail}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70">Occ</p><p className="text-lg font-bold text-indigo-600">{mOcc}</p></div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" /> Open Seats
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSegment('seats')}>Manage</Button>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-2 gap-4">
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Seats</p><p className="text-lg font-bold text-slate-900">{inv.seats.totalSeats}</p></div>
            <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">Available</p><p className="text-lg font-bold text-emerald-600">{inv.seats.availableSeats}</p></div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // LEVEL 3: DETAILED VIEW RENDERER
  const renderLevel3View = () => {
    if (activeSegment === 'cabins' || activeSegment === 'meeting-rooms' || activeSegment === 'seats') {
      // COWORKING DETAILS
      const inv = property.coworkingInventory;
      return (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" /> {activeSegment === 'cabins' ? 'Cabins' : activeSegment === 'meeting-rooms' ? 'Meeting Rooms' : 'Open Seats'} Detail
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSegment(null)}>Back to Dashboard</Button>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm italic py-8 text-center bg-slate-50 rounded border border-slate-100">
              Mock view. In a full implementation, you would see a list of {activeSegment} here with individual update actions.
            </p>
          </CardContent>
        </Card>
      );
    }

    // COMMERCIAL TOWER DETAILS
    const tower = property.towers?.find(t => t.id === activeSegment);
    if (!tower) return null;

    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between sticky top-0 z-10">
          <CardTitle className="font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" /> {tower.name} Inventory
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setActiveSegment(null)}>Back to Dashboard</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {tower.floors.map(floor => (
              <div key={floor.id} className="p-6 space-y-4 bg-white hover:bg-slate-50/30 transition-colors">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Floor {floor.floorNumber}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {floor.units.map(unit => (
                    <div key={unit.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors shadow-sm bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-slate-900 text-base">Unit {unit.unitNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(unit.status)}`}>
                          {unit.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mb-4 flex gap-3">
                        <span>Area: <span className="text-slate-900">{unit.area} sqft</span></span>
                        <span>Seats: <span className="text-slate-900">{unit.seatCapacity}</span></span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs h-8 font-semibold"
                          onClick={() => {
                            setSelectedUnit({ towerId: tower.id, floorId: floor.id, unitId: unit.id, currentStatus: unit.status, type: 'commercial' });
                            setNewStatus(unit.status);
                          }}
                        >
                          Update Status
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"
                          onClick={() => setShowHistoryModal({ unit })}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {floor.units.length === 0 && <p className="text-xs text-slate-400 italic">No units defined on this floor.</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)] relative">
      <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/supply/status-management')} className="rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              {property.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-semibold text-indigo-600">{property.developer || property.operatorName}</span> • <MapPin className="h-3 w-3" /> {property.micromarket}, {property.city}
            </p>
          </div>
        </div>

        {/* TOP LEVEL METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Inv.</p><p className="text-2xl font-bold text-slate-900">{total}</p></CardContent></Card>
          <Card className="border-slate-200 shadow-sm border-b-4 border-b-emerald-500"><CardContent className="p-4 flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 mb-1">Available</p><p className="text-2xl font-bold text-emerald-600">{available}</p></CardContent></Card>
          <Card className="border-slate-200 shadow-sm border-b-4 border-b-amber-500"><CardContent className="p-4 flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 mb-1">Reserved</p><p className="text-2xl font-bold text-amber-600">{reserved}</p></CardContent></Card>
          <Card className="border-slate-200 shadow-sm border-b-4 border-b-indigo-500"><CardContent className="p-4 flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70 mb-1">Occupied</p><p className="text-2xl font-bold text-indigo-600">{occupied}</p></CardContent></Card>
          <Card className="border-slate-200 shadow-sm border-b-4 border-b-red-500"><CardContent className="p-4 flex flex-col justify-center"><p className="text-[10px] font-bold uppercase tracking-widest text-red-600/70 mb-1">Maintenance</p><p className="text-2xl font-bold text-red-600">{maintenance}</p></CardContent></Card>
        </div>

        {/* CONTENT AREA: TOGGLE BETWEEN LEVEL 2 & LEVEL 3 */}
        {!activeSegment ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-slate-800 text-lg mb-4 mt-8">Property Breakdown</h3>
            {property.buildingType === 'Corporate Office' ? renderCommercialBreakdown() : renderCoworkingBreakdown()}
          </div>
        ) : (
          <div className="mt-8 animate-in slide-in-from-right-8 duration-500">
            {renderLevel3View()}
          </div>
        )}

      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Update Unit Status</h3>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Change Status To</label>
                <select 
                  value={newStatus} 
                  onChange={e => setNewStatus(e.target.value as UnitStatus)}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Reason (Optional)</label>
                <Input 
                  placeholder="e.g. Client requested hold" 
                  value={statusReason} 
                  onChange={e => setStatusReason(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Effective Date</label>
                <Input 
                  type="date"
                  value={effectiveDate} 
                  onChange={e => setEffectiveDate(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Notes</label>
                <textarea 
                  className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none min-h-[80px]"
                  placeholder="Additional context..."
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedUnit(null)}>Cancel</Button>
              <Button onClick={handleUpdateStatus} className="bg-primary hover:bg-primary/90 font-bold">Save Status</Button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock className="h-4 w-4" /> Status History</h3>
              <button onClick={() => setShowHistoryModal(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit {showHistoryModal.unit.unitNumber}</span>
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 max-h-[60vh] overflow-y-auto pr-2">
                {showHistoryModal.unit.statusHistory && showHistoryModal.unit.statusHistory.length > 0 ? (
                  showHistoryModal.unit.statusHistory.map((history: any, idx: number) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 z-10 bg-indigo-50 text-indigo-600 shadow-sm shadow-slate-200">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-sm">{history.status}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(history.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex gap-1 items-center">
                          By: <span className="text-indigo-600">{history.updatedBy}</span>
                        </p>
                        {history.notes && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                            {history.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 italic pl-8">No history available for this unit.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
