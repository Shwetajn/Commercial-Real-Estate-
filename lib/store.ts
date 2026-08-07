import { create } from 'zustand';
import { Property, Task, User, PropertyLifecycleStatus, UnitStatus, TaskStatus, Lead, Meeting, Mail, LeadStatus, Employee, LeadSourceConfig, GlobalWorkspace, AIPrompt, IntegrationConfig, AuditLog, Partner } from '@/types';
import { mockProperties, mockTasks, mockCurrentUser, mockLeads, mockMeetings, mockMails } from './mock-data';

interface AppState {
  isAuthenticated: boolean;
  currentRole: string | null;
  currentUser: User | null;
  properties: Property[];
  tasks: Task[];
  leads: Lead[];
  meetings: Meeting[];
  mails: Mail[];
  employees: Employee[];
  leadSources: LeadSourceConfig[];
  partners: Partner[];
  
  // Super Admin State
  globalWorkspaces: GlobalWorkspace[];
  aiPrompts: AIPrompt[];
  integrations: IntegrationConfig[];
  auditLogs: AuditLog[];
  
  // Super Admin Actions
  toggleWorkspaceModule: (workspaceId: string, module: string) => void;
  updateWorkspaceModules: (workspaceId: string, modules: string[]) => void;
  updateAIPromptConfidence: (promptId: string, accuracy: number) => void;
  updateIntegrationStatus: (integrationId: string, status: 'Connected' | 'Available' | 'Error') => void;
  
  // Actions
  addEmployee: (employee: Employee) => void;
  addProperty: (property: Property) => void;
  updatePropertyStatus: (propertyId: string, newStatus: PropertyLifecycleStatus, reason?: string) => void;
  updateUnitStatus: (propertyId: string, towerId: string, floorId: string, unitId: string, newStatus: UnitStatus, notes?: string) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, outcome?: string, notes?: string) => void;
  submitPropertyForApproval: (propertyId: string) => void;
  deleteProperty: (propertyId: string) => void;
  deleteTower: (propertyId: string, towerId: string) => void;
  deleteFloor: (propertyId: string, towerId: string, floorId: string) => void;
  deleteUnit: (propertyId: string, towerId: string, floorId: string, unitId: string) => void;
  updateProperty: (propertyId: string, data: Partial<Property>) => void;
  simulateAdminApproval: (propertyId: string) => void;
  simulateAdminRejection: (propertyId: string, reason: string) => void;
  duplicateProperty: (propertyId: string) => void;
  updateUser: (data: Partial<User>) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (partnerId: string, data: Partial<Partner>) => void;
  deletePartner: (partnerId: string) => void;
  
  // Sales Actions
  addLead: (lead: Lead) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  assignLead: (leadId: string, employeeId: string) => void;
  deleteLead: (leadId: string) => void;
  importLeads: (leads: Lead[]) => void;
  suggestPropertyForLead: (leadId: string, propertyId: string, matchPercentage: number) => void;
  updateSuggestedPropertyStatus: (leadId: string, propertyId: string, status: 'Suggested' | 'Interested' | 'Rejected' | 'Selected') => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeetingStatus: (meetingId: string, status: 'Upcoming' | 'Completed' | 'Cancelled') => void;
  addMail: (mail: Mail) => void;
  updateLeadSourceStatus: (id: string, status: 'Active' | 'Inactive') => void;
  updateLeadSourceRule: (id: string, rule: string) => void;
  addLeadSource: (source: LeadSourceConfig) => void;
  
  // Auth Actions
  login: (user: User) => void;
  logout: () => void;
  setWorkspace: (role: string) => void;
  switchWorkspace: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: true,
  currentRole: null,
  currentUser: mockCurrentUser,
  properties: mockProperties,
  tasks: mockTasks,
  leads: mockLeads,
  meetings: mockMeetings,
  mails: mockMails,
  employees: [
    { id: 'emp_1', name: 'System Admin', email: 'admin@workspaceos.com', phone: '+91 99999 00000', department: 'Operations', role: 'Admin', workspaceName: 'Admin Workspace', status: 'Active', region: 'Global', joiningDate: '2023-01-01', propertiesCount: 0 },
    { id: 'emp_2', name: 'Rohit Verma', email: 'rohit.v@workspaceos.com', phone: '+91 98765 12345', department: 'Sales', role: 'Sales Executive', workspaceName: 'Sales Workspace', reportingManagerId: 'Amit Sharma', status: 'Active', region: 'North Region', joiningDate: '2023-05-15', propertiesCount: 0 },
    { id: 'emp_3', name: 'Sanjay Verma', email: 'sanjay.v@workspaceos.com', phone: '+91 98765 12346', department: 'Supply', role: 'Supply Executive', workspaceName: 'Supply Workspace', status: 'Active', region: 'South Region', joiningDate: '2023-08-01', propertiesCount: 0 }
  ],
  leadSources: [
    { id: 'src_1', name: 'Website Form', type: 'Web Form', channelInput: 'https://api.workspaceos.com/v1/webhooks/form-1', aiHandlingRule: 'Auto Parse', status: 'Active', leadsGenerated: 1420, conversionRate: 12.5 },
    { id: 'src_2', name: 'LinkedIn Scraper', type: 'LinkedIn Scraper', channelInput: 'LinkedIn Sales Navigator', aiHandlingRule: 'Extract company signals', status: 'Active', leadsGenerated: 850, conversionRate: 8.2, autoAssignRule: 'North Region -> Rohit Verma' },
    { id: 'src_3', name: 'Business WhatsApp', type: 'WhatsApp', channelInput: '+91 98765 43210', aiHandlingRule: 'Auto AI respond', status: 'Active', leadsGenerated: 430, conversionRate: 15.1 },
    { id: 'src_4', name: 'Manual Upload', type: 'Manual Upload', channelInput: 'CSV Import', aiHandlingRule: 'Ignore incomplete lead', status: 'Active', leadsGenerated: 120, conversionRate: 22.4 },
  ],
  partners: [
    { id: 'pt_1', name: 'DLF Limited', type: 'Developer', status: 'Active', city: 'Gurgaon', contactPerson: 'Rahul Sharma', phone: '+91 98765 43211', email: 'rahul@dlf.in', relationshipManager: 'Sanjay Verma', since: '2022', activityHistory: [{ date: new Date().toISOString(), action: 'Property Added: DLF Cyber City' }] },
    { id: 'pt_2', name: 'WeWork India', type: 'Coworking Operator', status: 'Active', city: 'Bangalore', contactPerson: 'Priya Mehra', phone: '+91 98765 43212', email: 'priya@wework.in', relationshipManager: 'Sanjay Verma', since: '2023', activityHistory: [{ date: new Date().toISOString(), action: 'Meeting Done' }] },
    { id: 'pt_3', name: 'Amit Realty Consultants', type: 'Broker', status: 'Active', city: 'Mumbai', contactPerson: 'Amit Desai', phone: '+91 98765 43213', email: 'amit@amitrealty.com', relationshipManager: 'Sanjay Verma', since: '2023', activityHistory: [] },
  ],

  // Super Admin Mock Data
  globalWorkspaces: [
    { id: 'ws_1', name: 'Sales Workspace', type: 'Sales Workspace', usersCount: 85, modulesEnabled: ['lead_signals', 'client_connect', 'deck_generation', 'ai_mail_management'], status: 'Active' },
    { id: 'ws_2', name: 'Supply Workspace', type: 'Supply Workspace', usersCount: 30, modulesEnabled: ['inventory_management', 'approval_tracking', 'task_management'], status: 'Active' },
    { id: 'ws_3', name: 'Admin Workspace', type: 'Admin Workspace', usersCount: 10, modulesEnabled: ['approval_center', 'team_management'], status: 'Active' },
  ],
  aiPrompts: [
    { id: 'prm_1', name: 'Lead Extraction Prompt', version: 'v2.4', description: 'Extracts structured lead data from raw emails and WhatsApp messages.', status: 'Active', accuracy: 91, processedRequests: 24500 },
    { id: 'prm_2', name: 'Mail Generation Prompt', version: 'v1.8', description: 'Generates context-aware email replies for property suggestions.', status: 'Active', accuracy: 88, processedRequests: 12300 },
    { id: 'prm_3', name: 'Deck Generation Prompt', version: 'v3.1', description: 'Creates structured presentation outlines based on client requirements.', status: 'Active', accuracy: 94, processedRequests: 8400 },
  ],
  integrations: [
    { id: 'int_1', provider: 'WhatsApp Business API', category: 'WhatsApp Business API', status: 'Connected', lastSync: '2 minutes ago', errors: 0 },
    { id: 'int_2', provider: 'LinkedIn Sales Navigator', category: 'LinkedIn Scraper', status: 'Connected', lastSync: '15 minutes ago', errors: 2 },
    { id: 'int_3', provider: 'Salesforce CRM', category: 'CRM', status: 'Available' },
    { id: 'int_4', provider: 'Microsoft 365 Exchange', category: 'Email', status: 'Connected', lastSync: '1 minute ago', errors: 0 },
  ],
  auditLogs: [
    { id: 'log_1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: 'Rohit Verma', role: 'Sales Executive', action: 'Generated client deck', module: 'Sales Workspace' },
    { id: 'log_2', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), user: 'Amit Sharma', role: 'Admin', action: 'Approved property (DLF Cyber City)', module: 'Inventory Management' },
    { id: 'log_3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), user: 'System Admin', role: 'Super Admin', action: 'Updated billing cycle', module: 'Subscription' },
    { id: 'log_4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), user: 'Sanjay Verma', role: 'Supply Executive', action: 'Added new property draft', module: 'Supply Workspace' },
  ],

  addProperty: (property) => 
    set((state) => ({ properties: [...state.properties, property] })),

  updatePropertyStatus: (propertyId, newStatus, reason) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId 
          ? { ...p, lifecycleStatus: newStatus, rejectionReason: reason || p.rejectionReason } 
          : p
      ),
    })),

  updateUnitStatus: (propertyId, towerId, floorId, unitId, newStatus, notes) =>
    set((state) => ({
      properties: state.properties.map((p) => {
        if (p.id !== propertyId) return p;
        return {
          ...p,
          towers: p.towers.map((t) => {
            if (t.id !== towerId) return t;
            return {
              ...t,
              floors: t.floors.map((f) => {
                if (f.id !== floorId) return f;
                return {
                  ...f,
                  units: f.units.map((u) => {
                    if (u.id !== unitId) return u;
                    return {
                      ...u,
                      status: newStatus,
                      statusHistory: [
                        { status: newStatus, date: new Date().toISOString(), updatedBy: state.currentUser?.name || 'System', notes },
                        ...u.statusHistory
                      ]
                    };
                  })
                };
              })
            };
          })
        };
      })
    })),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTaskStatus: (taskId, newStatus, outcome, notes) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          const newEntry = {
            status: newStatus,
            date: new Date().toISOString(),
            notes: notes,
            outcome: outcome
          };
          return { 
            ...t, 
            status: newStatus,
            history: [newEntry, ...t.history]
          };
        }
        return t;
      }),
    })),

  submitPropertyForApproval: (propertyId) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, lifecycleStatus: 'Under Review' } : p
      ),
    })),

  deleteProperty: (propertyId) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== propertyId),
    })),

  deleteTower: (propertyId, towerId) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? { ...p, towers: p.towers.filter((t) => t.id !== towerId) }
          : p
      ),
    })),

  deleteFloor: (propertyId, towerId, floorId) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              towers: p.towers.map((t) =>
                t.id === towerId
                  ? { ...t, floors: t.floors.filter((f) => f.id !== floorId) }
                  : t
              ),
            }
          : p
      ),
    })),

  deleteUnit: (propertyId, towerId, floorId, unitId) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              towers: p.towers.map((t) =>
                t.id === towerId
                  ? {
                      ...t,
                      floors: t.floors.map((f) =>
                        f.id === floorId
                          ? { ...f, units: f.units.filter((u) => u.id !== unitId) }
                          : f
                      ),
                    }
                  : t
              ),
            }
          : p
      ),
    })),

  updateProperty: (propertyId, data) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, ...data } : p
      ),
    })),

  simulateAdminApproval: (propertyId) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, lifecycleStatus: 'Approved' } : p
      ),
    })),

  simulateAdminRejection: (propertyId, reason) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === propertyId ? { ...p, lifecycleStatus: 'Rejected', rejectionReason: reason } : p
      ),
    })),

  duplicateProperty: (propertyId) =>
    set((state) => {
      const propToDuplicate = state.properties.find(p => p.id === propertyId);
      if (!propToDuplicate) return state;
      const newProp = {
        ...propToDuplicate,
        id: `prop_${Date.now()}`,
        name: `${propToDuplicate.name} (Copy)`,
        lifecycleStatus: 'Draft' as PropertyLifecycleStatus,
        createdAt: new Date().toISOString(),
      };
      return { properties: [...state.properties, newProp] };
    }),

  updateUser: (data) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...data }
    })),

  addPartner: (partner) =>
    set((state) => ({ partners: [partner, ...state.partners] })),
    
  updatePartner: (partnerId, data) =>
    set((state) => ({
      partners: state.partners.map((p) => p.id === partnerId ? { ...p, ...data } : p)
    })),
    
  deletePartner: (partnerId) =>
    set((state) => ({
      partners: state.partners.filter((p) => p.id !== partnerId)
    })),

  // Sales Actions Implementation
  addLead: (lead) =>
    set((state) => ({ leads: [lead, ...state.leads] })),
    
  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString() } : l)
    })),

  assignLead: (leadId, employeeId) =>
    set((state) => ({
      leads: state.leads.map((l) => l.id === leadId ? { ...l, assignedExecutive: employeeId, status: 'Property Suggested', updatedAt: new Date().toISOString() } : l)
    })),
    
  deleteLead: (leadId) =>
    set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) })),
    
  importLeads: (leads) =>
    set((state) => ({ leads: [...leads, ...state.leads] })),
    
  suggestPropertyForLead: (leadId, propertyId, matchPercentage) =>
    set((state) => ({
      leads: state.leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            suggestedProperties: [...l.suggestedProperties, { propertyId, matchPercentage, status: 'Suggested' }],
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    })),
    
  updateSuggestedPropertyStatus: (leadId, propertyId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            suggestedProperties: l.suggestedProperties.map(sp => 
              sp.propertyId === propertyId ? { ...sp, status } : sp
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    })),
    
  addMeeting: (meeting) =>
    set((state) => ({ meetings: [meeting, ...state.meetings] })),
    
  updateMeetingStatus: (meetingId, status) =>
    set((state) => ({
      meetings: state.meetings.map(m => m.id === meetingId ? { ...m, status } : m)
    })),
    
  addMail: (mail) =>
    set((state) => ({ mails: [...state.mails, mail] })),

  updateLeadSourceStatus: (id, status) =>
    set((state) => ({
      leadSources: state.leadSources.map(s => s.id === id ? { ...s, status } : s)
    })),
  updateLeadSourceRule: (id, rule) =>
    set((state) => ({
      leadSources: state.leadSources.map(s => s.id === id ? { ...s, autoAssignRule: rule } : s)
    })),
    
    
  addLeadSource: (source) =>
    set((state) => ({ leadSources: [...state.leadSources, source] })),

  toggleWorkspaceModule: (workspaceId, moduleName) =>
    set((state) => ({
      globalWorkspaces: state.globalWorkspaces.map(ws => {
        if (ws.id !== workspaceId) return ws;
        const hasModule = ws.modulesEnabled.includes(moduleName);
        return {
          ...ws,
          modulesEnabled: hasModule 
            ? ws.modulesEnabled.filter(m => m !== moduleName)
            : [...ws.modulesEnabled, moduleName]
        };
      })
    })),
    
  updateWorkspaceModules: (workspaceId, modules) =>
    set((state) => ({
      globalWorkspaces: state.globalWorkspaces.map(ws => {
        if (ws.id !== workspaceId) return ws;
        return {
          ...ws,
          modulesEnabled: modules
        };
      })
    })),
    
  updateAIPromptConfidence: (promptId, accuracy) =>
    set((state) => ({
      aiPrompts: state.aiPrompts.map(p => p.id === promptId ? { ...p, accuracy } : p)
    })),

  updateIntegrationStatus: (integrationId, status) =>
    set((state) => ({
      integrations: state.integrations.map(i => i.id === integrationId ? { ...i, status, errors: status === 'Connected' ? 0 : i.errors } : i)
    })),

  login: (user) => set({ isAuthenticated: true, currentUser: user }),
  logout: () => set({ isAuthenticated: false, currentRole: null, currentUser: null }),
  setWorkspace: (role) => set({ currentRole: role }),
  switchWorkspace: () => set({ currentRole: null }),
  
  // Employee Implementation
  addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
}));
