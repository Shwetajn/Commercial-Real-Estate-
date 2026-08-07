"use client";

import { Search, Bell, LogOut, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, logout, switchWorkspace } = useAppStore();
  
  const getPageTitle = () => {
    if (pathname === '/supply/dashboard') return "Dashboard";
    if (pathname?.includes('/supply/inventory/add')) return "Onboard Property";
    if (pathname?.includes('/supply/inventory')) return "Inventory";
    if (pathname?.includes('/supply/status-management')) return "Status Management";
    if (pathname?.includes('/supply/task-management')) return "Task Management";
    if (pathname?.includes('/supply/profile')) return "Profile";
    
    if (pathname === '/sales/dashboard') return "Sales Dashboard";
    if (pathname?.includes('/sales/')) return "Sales Workspace";
    
    if (pathname === '/super-admin/dashboard') return "Global Dashboard";
    if (pathname?.includes('/super-admin/')) return "Super Admin Platform";
    
    return "";
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    router.push('/login');
  };

  const handleSwitchWorkspace = () => {
    switchWorkspace();
    router.push('/select-workspace');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight hidden sm:block">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search properties, units..."
            className="w-full rounded-md bg-slate-50 pl-9 border-slate-200 focus-visible:ring-indigo-600/20 text-sm shadow-none h-9 transition-all hover:bg-slate-100"
          />
        </div>
        
        {/* Switch Workspace Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex"
          onClick={handleSwitchWorkspace}
        >
          <Layers className="h-4 w-4 mr-2 text-slate-500" />
          Switch Workspace
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New approval request</DropdownMenuItem>
              <DropdownMenuItem>System alert</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-indigo-600/20 transition-all ml-1">
              <AvatarImage src={currentUser?.avatar || "https://i.pravatar.cc/150?u=sanjay"} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium text-xs rounded-md">SV</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentRole}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSwitchWorkspace}>
                <Layers className="mr-2 h-4 w-4" />
                <span>Switch Workspace</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
