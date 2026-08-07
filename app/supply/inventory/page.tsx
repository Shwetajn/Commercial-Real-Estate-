"use client";

import { useState, Suspense } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, SlidersHorizontal, MapPin, Building, ChevronDown, Plus, MoreHorizontal, Edit2, Copy, Trash2, Eye, LayoutGrid, LayoutList } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyLifecycleStatus, Property } from "@/types";

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading inventory...</div>}>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  const { properties, currentUser, duplicateProperty, deleteProperty } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "all-properties");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || "All");
  const [filterBuildingType, setFilterBuildingType] = useState("All");

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [propertyToArchive, setPropertyToArchive] = useState<string | null>(null);

  const confirmArchive = () => {
    if (propertyToArchive) {
      deleteProperty(propertyToArchive);
      setShowArchiveModal(false);
      setPropertyToArchive(null);
    }
  };

  const getStatusVariant = (status: PropertyLifecycleStatus) => {
    switch (status) {
      case 'Draft': return 'outline';
      case 'Under Review': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (activeTab === "my-properties" && p.createdBy !== currentUser.id) return false;
    
    // Safely check name and city (with fallback strings)
    const pName = p.name || "";
    const pCity = p.city || "";
    if (searchQuery && !pName.toLowerCase().includes(searchQuery.toLowerCase()) && !pCity.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filterCity !== "All" && pCity !== filterCity) return false;
    if (filterStatus !== "All" && p.lifecycleStatus !== filterStatus) return false;
    if (filterBuildingType !== "All" && p.buildingType !== filterBuildingType) return false;
    return true;
  });


  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage commercial properties and workspace availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/supply/inventory/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        </div>
      </div>



      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* TABLE HEADER / FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-5 bg-slate-50 border-b border-slate-200">
          <Tabs defaultValue="all-properties" className="w-full lg:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-slate-200 p-1 rounded-md h-9 shadow-sm">
              <TabsTrigger value="all-properties" className="rounded-sm text-xs font-semibold data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">All Properties</TabsTrigger>
              <TabsTrigger value="my-properties" className="rounded-sm text-xs font-semibold data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">My Properties</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            
            {/* VIEW TOGGLE */}
            <div className="bg-white border border-slate-200 rounded-md p-1 shadow-sm flex items-center h-9">
              <button 
                onClick={() => setViewMode('table')} 
                className={`p-1.5 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Table View"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Card View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-9 bg-white border-slate-200 rounded-md shadow-none h-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="border-l border-slate-200 shadow-2xl">
                <SheetHeader>
                  <SheetTitle>Filter Inventory</SheetTitle>
                  <SheetDescription>Refine your property list</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-8">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">City</h4>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                    >
                      <option value="All">All Cities</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">Building Type</h4>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      value={filterBuildingType}
                      onChange={(e) => setFilterBuildingType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="Corporate Office">Corporate Office</option>
                      <option value="Coworking">Coworking</option>
                      <option value="Business Park">Business Park</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">Status</h4>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                      setFilterCity("All");
                      setFilterStatus("All");
                      setFilterBuildingType("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* CONTENT AREA */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-[10px] uppercase bg-slate-50 border-b border-slate-200 text-slate-400 font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Property</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Developer / Operator</th>
                  <th className="px-6 py-4 font-bold">Inventory Structure</th>
                  <th className="px-6 py-4 font-bold">Available</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center bg-slate-50/50">
                      <Building className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                      {activeTab === 'my-properties' ? (
                        <>
                          <h3 className="text-sm font-bold text-slate-900">You haven't added any properties yet</h3>
                          <div className="mt-4">
                            <Link href="/supply/inventory/add">
                              <Button>Add Property</Button>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-sm font-bold text-slate-900">No inventory available</h3>
                          <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => {
                    
                    // Fallbacks for missing data
                    const propName = property.name || "Not provided";
                    const propCity = property.city || "Not provided";
                    const developerName = property.developer || property.operatorName || "Not provided";
                    
                    // Compute structure and available based on type
                    let structureLines: React.ReactNode[] = [];
                    let availableLabel = "";
                    
                    if (property.buildingType === 'Coworking') {
                      structureLines = [
                        <div key="seats">{property.coworkingInventory?.seats.totalSeats || 0} Seats</div>,
                        <div key="cabins">{property.coworkingInventory?.cabins.length || 0} Cabins</div>,
                        <div key="rooms">{property.coworkingInventory?.meetingRooms.length || 0} Meeting Rooms</div>
                      ];
                      availableLabel = `${property.coworkingInventory?.seats.availableSeats || 0} Seats`;
                    } else {
                      const towersCount = (property.towers || []).length;
                      const floorsCount = (property.towers || []).reduce((acc, t) => acc + t.floors.length, 0);
                      let unitsCount = 0;
                      (property.towers || []).forEach(t => t.floors.forEach(f => unitsCount += f.units.length));
                      
                      structureLines = [
                        <div key="towers">{towersCount} Towers</div>,
                        <div key="floors">{floorsCount} Floors</div>,
                        <div key="units">{unitsCount} Units</div>
                      ];
                      
                      let avUnits = 0;
                      if (property.towers) {
                        property.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
                          if (u.status === 'Available') avUnits++;
                        })));
                      }
                      availableLabel = `${avUnits} Units`;
                    }

                    return (
                      <tr key={property.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => router.push(`/supply/inventory/${property.id}`)}>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{propName}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {propCity}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none ${property.buildingType === 'Coworking' ? 'text-emerald-700 bg-emerald-50' : 'text-indigo-700 bg-indigo-50'}`}>
                            {property.buildingType || "Not provided"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {developerName}
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs space-y-1">
                          {structureLines}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {availableLabel}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusVariant(property.lifecycleStatus)} className="shadow-none border-none text-[11px] font-semibold">
                            {property.lifecycleStatus || "Not provided"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 focus-visible:ring-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-lg border-slate-200 shadow-lg p-1.5">
                              <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-slate-700" onClick={() => router.push(`/supply/inventory/${property.id}`)}>
                                <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-slate-700" onClick={() => router.push(`/supply/inventory/${property.id}?edit=true`)}>
                                <Edit2 className="mr-2 h-4 w-4 text-slate-400" /> Edit Property
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-slate-700" onClick={() => duplicateProperty(property.id)}>
                                <Copy className="mr-2 h-4 w-4 text-slate-400" /> Duplicate
                              </DropdownMenuItem>
                              <div className="h-px bg-slate-100 my-1.5" />
                              <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50" onClick={() => { setPropertyToArchive(property.id); setShowArchiveModal(true); }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-slate-50/50 min-h-[400px]">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building className="h-8 w-8 text-slate-300 mb-3" />
                {activeTab === 'my-properties' ? (
                  <>
                    <h3 className="text-sm font-bold text-slate-900">You haven't added any properties yet</h3>
                    <div className="mt-4">
                      <Link href="/supply/inventory/add">
                        <Button>Add Property</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-slate-900">No inventory available</h3>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const propName = property.name || "Not provided";
                  const propCity = property.city || "Not provided";
                  const developerName = property.developer || property.operatorName || "Not provided";
                  
                  let structureLabel = "";
                  let availableLabel = "";
                  
                  if (property.buildingType === 'Coworking') {
                    structureLabel = `${property.coworkingInventory?.seats.totalSeats || 0} Seats`;
                    availableLabel = `${property.coworkingInventory?.seats.availableSeats || 0} Seats`;
                  } else {
                    const towersCount = (property.towers || []).length;
                    structureLabel = `${towersCount} Towers`;
                    
                    let avUnits = 0;
                    if (property.towers) {
                      property.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
                        if (u.status === 'Available') avUnits++;
                      })));
                    }
                    availableLabel = `${avUnits} Units`;
                  }

                  return (
                    <div key={property.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      {/* Top Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900 truncate" title={propName}>{propName}</h3>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {propCity}</div>
                        </div>
                        <Badge variant={getStatusVariant(property.lifecycleStatus)} className="shadow-none border-none text-[10px] font-semibold shrink-0 ml-2">
                          {property.lifecycleStatus || "Not provided"}
                        </Badge>
                      </div>

                      <hr className="border-slate-100 my-4" />

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type</p>
                          <p className="text-xs font-semibold text-slate-900">{property.buildingType || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Developer</p>
                          <p className="text-xs font-semibold text-slate-900 truncate" title={developerName}>{developerName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Structure</p>
                          <p className="text-xs font-semibold text-slate-900">{structureLabel}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Availability</p>
                          <p className="text-xs font-bold text-emerald-600">{availableLabel}</p>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => router.push(`/supply/inventory/${property.id}`)}>
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => router.push(`/supply/inventory/${property.id}?edit=true`)}>
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-lg border-slate-200 shadow-lg p-1.5">
                            <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-slate-700" onClick={() => router.push('/supply/status-management')}>
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-slate-700" onClick={() => duplicateProperty(property.id)}>
                              <Copy className="mr-2 h-4 w-4 text-slate-400" /> Duplicate
                            </DropdownMenuItem>
                            <div className="h-px bg-slate-100 my-1.5" />
                            <DropdownMenuItem className="rounded-md cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50" onClick={() => { setPropertyToArchive(property.id); setShowArchiveModal(true); }}>
                              <Trash2 className="mr-2 h-4 w-4" /> Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl p-6 border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Archive Property</DialogTitle>
            <DialogDescription className="text-sm mt-2 text-slate-500">
              Are you sure you want to archive this property? It will be removed from the active operational list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button variant="outline" className="rounded-lg border-slate-200 font-semibold" onClick={() => setShowArchiveModal(false)}>Cancel</Button>
            <Button className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-none" onClick={confirmArchive}>Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
