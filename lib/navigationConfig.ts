import { 
  LayoutDashboard, 
  Building2, 
  CheckSquare, 
  Activity, 
  User, 
  Layers, 
  Users, 
  Briefcase, 
  MessageSquare, 
  ShieldCheck, 
  Target, 
  Settings, 
  FileText, 
  Zap, 
  Link as LinkIcon, 
  Globe 
} from "lucide-react";

export const navigationConfig = {
  superAdmin: [
    { label: "Global Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
    { label: "Workspace Management", path: "/super-admin/workspaces", icon: Layers },
    { label: "User & Role Management", path: "/super-admin/users", icon: Users },
    { label: "AI Control Center", path: "/super-admin/ai", icon: Zap },
    { label: "Integration Management", path: "/super-admin/integrations", icon: LinkIcon },
    { label: "System Monitoring", path: "/super-admin/monitoring", icon: Activity },
    { label: "Audit & Compliance", path: "/super-admin/audit", icon: FileText },
    { label: "Platform Settings", path: "/super-admin/settings", icon: Settings },
    { label: "Profile", path: "/super-admin/profile", icon: User }
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Team Management", path: "/admin/team-management", icon: Users, moduleKey: "team_management", isConfigurable: true },
    { label: "Inventory Management", path: "/admin/inventory", icon: Building2, moduleKey: "inventory_management", isConfigurable: true },
    { label: "Lead List", path: "/admin/leads", icon: Target, moduleKey: "lead_management", isConfigurable: true },
    { label: "Lead Sources", path: "/admin/sources", icon: Globe, moduleKey: "lead_sources", isConfigurable: true },
    { label: "Approval Center", path: "/admin/approval-center", icon: ShieldCheck, moduleKey: "approval_center", isConfigurable: true },
    { label: "Task Management", path: "/admin/task-management", icon: CheckSquare, moduleKey: "task_management", isConfigurable: true },
    { label: "Platform Settings", path: "/admin/settings", icon: Settings, moduleKey: "platform_settings", isConfigurable: true },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: FileText, moduleKey: "audit_logs", isConfigurable: true },
    { label: "Profile", path: "/admin/profile", icon: User }
  ],
  sales: [
    { label: "Dashboard", path: "/sales/dashboard", icon: LayoutDashboard },
    { label: "Lead Signals", path: "/sales/lead-signals", icon: Activity, moduleKey: "lead_signals", isConfigurable: true },
    { label: "Leads", path: "/sales/leads", icon: Users, moduleKey: "leads", isConfigurable: true },
    { label: "Inventory", path: "/sales/inventory", icon: Building2, moduleKey: "inventory", isConfigurable: true },
    { label: "Meetings", path: "/sales/meetings", icon: Briefcase, moduleKey: "meetings", isConfigurable: true },
    { label: "Client Search", path: "/sales/client-search", icon: User, moduleKey: "client_search", isConfigurable: true },
    { label: "Client Connect", path: "/sales/client-connect", icon: MessageSquare, moduleKey: "client_connect", isConfigurable: true },
    { label: "Deck Generation", path: "/sales/deck-generation", icon: Layers, moduleKey: "deck_generation", isConfigurable: true },
    { label: "AI Mail Management", path: "/sales/mail", icon: CheckSquare, moduleKey: "ai_mail_management", isConfigurable: true },
    { label: "Task Management", path: "/sales/tasks", icon: CheckSquare, moduleKey: "task_management", isConfigurable: true },
    { label: "Profile", path: "/sales/profile", icon: User }
  ],
  supply: [
    { label: "Dashboard", path: "/supply/dashboard", icon: LayoutDashboard },
    { label: "Inventory Management", path: "/supply/inventory", icon: Building2, moduleKey: "inventory_management", isConfigurable: true },
    { label: "Status Management", path: "/supply/status-management", icon: Layers, moduleKey: "status_management", isConfigurable: true },
    // { label: "Partner Management", path: "/supply/partner-management", icon: Users, moduleKey: "partner_management", isConfigurable: true }, // Hidden per request
    { label: "Approval Tracking", path: "/supply/approval-tracking", icon: Activity, moduleKey: "approval_tracking", isConfigurable: true },
    { label: "Task Management", path: "/supply/task-management", icon: CheckSquare, moduleKey: "task_management", isConfigurable: true },
    { label: "Profile", path: "/supply/profile", icon: User }
  ]
};
