"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { navigationConfig } from "@/lib/navigationConfig";

const workspaceTypeMap: Record<string, string> = {
  "Admin": "Admin Workspace",
  "Sales Executive": "Sales Workspace",
  "Supply Executive": "Supply Workspace",
  "Super Admin": "Super Admin Workspace"
};

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, globalWorkspaces } = useAppStore();

  const mappedWorkspaceType = currentRole ? workspaceTypeMap[currentRole] : null;
  const currentWorkspace = mappedWorkspaceType ? globalWorkspaces.find(w => w.type === mappedWorkspaceType) : undefined;

  const isActive = (path: string) => {
    if ((path === '/supply/dashboard' || path === '/sales/dashboard' || path === '/admin/dashboard' || path === '/super-admin/dashboard') && pathname === path) return true;
    if (path !== '/supply/dashboard' && path !== '/sales/dashboard' && path !== '/admin/dashboard' && path !== '/super-admin/dashboard' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `group flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all ${
      active 
        ? "text-indigo-600 bg-indigo-50/50 border-l-2 border-indigo-600" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent"
    }`;
  };

  const iconClass = (path: string) => {
    return `h-4 w-4 transition-colors ${isActive(path) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`;
  };

  const renderNavItems = (items: any[]) => {
    return items.filter(item => {
      // Super Admin bypasses all checks
      if (currentRole === 'Super Admin') return true;
      
      // If workspace configuration exists and this item is configurable
      if (currentWorkspace && item.isConfigurable && item.moduleKey) {
        // Only hide if the module is explicitly listed in disabledModules
        const disabledModules = (currentWorkspace as any).disabledModules || [];
        if (disabledModules.includes(item.moduleKey)) {
          return false;
        }
      }
      
      // Default to showing everything
      return true;
    }).map(item => {
      const Icon = item.icon;
      return (
        <Link key={item.path} href={item.path} className={navItemClass(item.path)}>
          <Icon className={iconClass(item.path)} />
          {item.label}
        </Link>
      );
    });
  };

  let navConfig: any[] = [];

  // Determine which navigation array to use based purely on role
  if (!currentRole) {
    navConfig = [{ label: "Dashboard", path: "/", icon: Layers }];
  } else if (currentRole === 'Super Admin') {
    navConfig = navigationConfig.superAdmin;
  } else if (currentRole === 'Admin') {
    navConfig = navigationConfig.admin;
  } else if (currentRole === 'Sales Executive') {
    navConfig = navigationConfig.sales;
  } else {
    navConfig = navigationConfig.supply;
  }

  // Split into primary navigation and profile item for bottom positioning
  const mainNavItems = navConfig.filter(item => item.label !== "Profile");
  const profileItem = navConfig.find(item => item.label === "Profile");

  const logoHref = currentRole === 'Super Admin' 
    ? '/super-admin/dashboard' 
    : currentRole === 'Sales Executive' 
      ? '/sales/dashboard' 
      : currentRole === 'Admin' 
        ? '/admin/dashboard' 
        : currentRole === 'Supply Executive'
          ? '/supply/dashboard'
          : '/';

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-slate-200 bg-white hidden md:flex flex-col">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <Link href={logoHref} className="flex items-center gap-3 font-semibold tracking-tight">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <span className="text-base text-slate-900 tracking-tight font-display">Estate OS</span>
        </Link>
      </div>
      <div className="px-6 py-3 border-b border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</p>
        <p className="text-sm font-semibold text-slate-900 truncate">{currentRole || 'Select Role'}</p>
      </div>
      <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
        {renderNavItems(mainNavItems)}
        
        {profileItem && (
          <div className="mt-auto pt-4">
            {renderNavItems([profileItem])}
          </div>
        )}
      </nav>
    </aside>
  );
}
