"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Building2, Layers, Activity, CheckSquare, ArrowRight, FileText, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { properties, tasks, currentUser } = useAppStore();
  const router = useRouter();

  // 1. TOTAL PROPERTIES
  // All properties created/managed by logged-in supply executive. Include Draft, Under Review, Approved, Rejected.
  const myProperties = properties.filter(p => p.createdBy === currentUser?.id || p.assignedSupplyExecutive === currentUser?.id);
  const myPropertiesCount = myProperties.length;

  // 2. ACTIVE INVENTORY
  // Currently live inventory available for sales (status === "Approved")
  const approvedProperties = properties.filter(p => p.lifecycleStatus === 'Approved');
  const activeInventoryCount = approvedProperties.length;

  // Calculate unit counts for Approved Inventory
  let approvedTotalUnits = 0;
  let approvedAvailableUnits = 0;
  
  // 3. AVAILABLE SPACES
  let totalAvailableSpaces = 0;

  approvedProperties.forEach(p => {
    if (p.buildingType === 'Corporate Office' && p.towers) {
      p.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
        approvedTotalUnits++;
        if (u.status === 'Available') {
          approvedAvailableUnits++;
          totalAvailableSpaces++;
        }
      })));
    } else if (p.buildingType === 'Coworking' && p.coworkingInventory) {
      const inv = p.coworkingInventory;
      let cwTotal = inv.cabins.length + inv.meetingRooms.length + inv.seats.totalSeats;
      let cwAvail = 0;
      
      inv.cabins.forEach(c => { if (c.status === 'Available') { cwAvail++; totalAvailableSpaces++; } });
      inv.meetingRooms.forEach(m => { if (m.status === 'Available') { cwAvail++; totalAvailableSpaces++; } });
      cwAvail += inv.seats.availableSeats;
      totalAvailableSpaces += inv.seats.availableSeats;
      
      approvedTotalUnits += cwTotal;
      approvedAvailableUnits += cwAvail;
    }
  });

  const activeInventorySub = `${approvedAvailableUnits} / ${approvedTotalUnits} Units Available`;

  // 4. ACTION REQUIRED
  const pendingApprovalCount = myProperties.filter(p => p.lifecycleStatus === 'Under Review').length;
  const rejectedCount = myProperties.filter(p => p.lifecycleStatus === 'Rejected').length;
  const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  // Inventory status updates required is combined into operational actions concept
  const actionRequiredCount = pendingApprovalCount + rejectedCount + openTasksCount;

  // CHARTS DATA
  // Property Lifecycle Chart: Count should match Total Properties KPI
  const lifecycleCounts = {
    Draft: myProperties.filter(p => p.lifecycleStatus === 'Draft').length,
    'Under Review': pendingApprovalCount,
    Approved: myProperties.filter(p => p.lifecycleStatus === 'Approved').length,
    Rejected: rejectedCount
  };
  
  const pieData = Object.keys(lifecycleCounts).map(k => ({
    name: k,
    value: lifecycleCounts[k as keyof typeof lifecycleCounts]
  })).filter(d => d.value > 0);

  // Colors for Lifecycle
  const LIFECYCLE_COLORS: Record<string, string> = {
    'Approved': '#10b981', // Emerald
    'Under Review': '#f59e0b', // Amber
    'Draft': '#94a3b8', // Slate
    'Rejected': '#ef4444' // Red
  };

  // Inventory Overview Chart: Health across approved inventory only
  const inventoryData = approvedProperties.slice(0, 5).map(p => {
    let available = 0, occupied = 0, maintenance = 0, reserved = 0;
    if (p.buildingType === 'Corporate Office' && p.towers) {
      p.towers.forEach(t => t.floors.forEach(f => f.units.forEach(u => {
        if (u.status === 'Available') available++;
        else if (u.status === 'Occupied') occupied++;
        else if (u.status === 'Under Maintenance') maintenance++;
        else if (u.status === 'Reserved') reserved++;
      })));
    } else if (p.buildingType === 'Coworking' && p.coworkingInventory) {
      const inv = p.coworkingInventory;
      inv.cabins.forEach(c => {
         if (c.status === 'Available') available++;
         else if (c.status === 'Occupied') occupied++;
         else if (c.status === 'Under Maintenance') maintenance++;
         else if (c.status === 'Reserved') reserved++;
      });
      inv.meetingRooms.forEach(m => {
         if (m.status === 'Available') available++;
         else if (m.status === 'Occupied') occupied++;
         else if (m.status === 'Under Maintenance') maintenance++;
         else if (m.status === 'Reserved') reserved++;
      });
      available += inv.seats.availableSeats;
      occupied += (inv.seats.totalSeats - inv.seats.availableSeats);
    }
    return { name: p.name.substring(0, 15) + '...', Available: available, Reserved: reserved, Occupied: occupied, "Under Maintenance": maintenance };
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Supply Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor property onboarding, inventory health and assigned operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/supply/inventory/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Properties"
          value={myPropertiesCount}
          icon={<Building2 className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50"
          onClick={() => router.push('/supply/inventory?tab=my-properties')}
        />

        <div 
          onClick={() => router.push('/supply/inventory?status=Approved')}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group"
        >
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 tracking-tight">Active Inventory</p>
            <h3 className="text-3xl font-black text-slate-900">{activeInventoryCount} <span className="text-sm font-semibold text-slate-500 ml-1">Properties</span></h3>
            <p className="text-xs font-semibold text-emerald-600 mt-2">{activeInventorySub}</p>
          </div>
          <div className={`p-4 rounded-xl bg-emerald-50 shrink-0 group-hover:scale-110 transition-transform`}>
            <Layers className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <KpiCard
          title="Available Spaces"
          value={totalAvailableSpaces}
          icon={<Activity className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
          onClick={() => router.push('/supply/status-management')}
        />

        <KpiCard
          title="Action Required"
          value={actionRequiredCount}
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
          onClick={() => router.push('/supply/task-management')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-3 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Property Lifecycle</h3>
            <p className="text-xs text-slate-500 mt-1">Breakdown of your managed properties.</p>
          </div>
          <div className="h-[280px] relative mt-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-[-20px]">
              <span className="text-3xl font-bold text-slate-900">{myPropertiesCount}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Total</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={LIFECYCLE_COLORS[entry.name]} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push(`/supply/inventory?status=${entry.name}`)} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Inventory Overview</h3>
            <p className="text-xs text-slate-500 mt-1">Availability health across approved inventory.</p>
          </div>
          <div className="h-[280px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" dy={10} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="Available" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="Reserved" stackId="a" fill="#f59e0b" barSize={24} />
                <Bar dataKey="Occupied" stackId="a" fill="#6366f1" barSize={24} />
                <Bar dataKey="Under Maintenance" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold mb-4 tracking-tight text-slate-900 uppercase">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/supply/inventory/add" className="group">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col h-full justify-between">
              <div>
                <div className="rounded-lg bg-indigo-50 p-2.5 w-fit mb-4 text-indigo-600 transition-transform">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Add Property</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Create and onboard a new commercial workspace.</p>
              </div>
              <div className="flex items-center text-indigo-600 text-xs font-bold mt-6 group-hover:gap-2 transition-all uppercase tracking-wider">
                Add Property <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
          <Link href="/supply/inventory" className="group">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col h-full justify-between">
              <div>
                <div className="rounded-lg bg-emerald-50 p-2.5 w-fit mb-4 text-emerald-600 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Edit Property Details</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Manage building, floor and unit information.</p>
              </div>
              <div className="flex items-center text-emerald-600 text-xs font-bold mt-6 group-hover:gap-2 transition-all uppercase tracking-wider">
                Open Inventory <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
          <Link href="/supply/task-management" className="group">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col h-full justify-between">
              <div>
                <div className="rounded-lg bg-amber-50 p-2.5 w-fit mb-4 text-amber-600 transition-transform">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Resolve Tasks</h3>
                <p className="text-xs text-slate-500 leading-relaxed">View pending operational feedback and update actions.</p>
              </div>
              <div className="flex items-center text-amber-600 text-xs font-bold mt-6 group-hover:gap-2 transition-all uppercase tracking-wider">
                View Tasks <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
