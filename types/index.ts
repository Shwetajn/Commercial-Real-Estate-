export type PropertyLifecycleStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected';
export type BuildingType = 'Corporate Office' | 'Coworking' | 'Business Park';
export type Grade = 'A' | 'B';
export type PropertyStatus = 'Operational' | 'Under Construction';
export type WorkspaceType = 'Private Office' | 'Managed Office' | 'Coworking' | 'Meeting Space';
export type UnitStatus = 'Available' | 'Reserved' | 'Occupied' | 'Under Maintenance';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskCategory = 'Follow Up' | 'Meeting' | 'Proposal' | 'Deck' | 'Internal';

export interface TaskHistoryEntry {
  status: TaskStatus;
  date: string;
  notes?: string;
  outcome?: string;
}

export interface UnitStatusHistory {
  status: UnitStatus;
  date: string;
  updatedBy: string;
  notes?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  area: number; // sq ft
  seatCapacity: number;
  workspaceType: WorkspaceType;
  status: UnitStatus;
  amenities: string[];
  statusHistory: UnitStatusHistory[];
}

export interface Floor {
  id: string;
  floorNumber: string;
  units: Unit[];
}

export interface Tower {
  id: string;
  name: string;
  floors: Floor[];
}

export interface CoworkingInventory {
  seats: {
    totalSeats: number;
    availableSeats: number;
    pricePerSeat: number;
    status: UnitStatus;
  };
  cabins: {
    id: string;
    name: string;
    capacity: number;
    status: UnitStatus;
  }[];
  meetingRooms: {
    id: string;
    name: string;
    capacity: number;
    status: UnitStatus;
  }[];
}

export interface Property {
  id: string;
  name: string;
  developer: string;
  city: string;
  address: string;
  micromarket: string;
  lat: number;
  lng: number;
  buildingType: BuildingType;
  grade: Grade;
  status: PropertyStatus;
  yearBuilt: number;
  totalArea: number; // sq ft
  towers: Tower[];
  coworkingInventory?: CoworkingInventory;
  operatorName?: string;
  operatingHours?: string;
  certifications: string[];
  description: string;
  images: string[];
  documents: { id: string; name: string; url: string }[];
  lifecycleStatus: PropertyLifecycleStatus;
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  taskName: string;
  taskType: TaskCategory;
  description?: string;
  relatedEntity?: {
    type: 'Lead' | 'Client' | 'Property' | 'None';
    id?: string;
    name?: string;
  };
  assignedBy: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  history: TaskHistoryEntry[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// ==========================================
// SALES MODULE TYPES
// ==========================================

export type LeadType = 'Individual' | 'Company';
export type LeadStatus = 'New Requirement' | 'Property Suggested' | 'Proposal Sent' | 'Negotiation' | 'Closed';
export type LeadPriority = 'Low' | 'Medium' | 'High';
export type LeadSource = 'Website' | 'Referral' | 'Cold Call' | 'Existing Client';

export interface SuggestedProperty {
  propertyId: string;
  matchPercentage: number;
  status: 'Suggested' | 'Interested' | 'Rejected' | 'Selected';
}

export interface Lead {
  id: string;
  type: LeadType;
  
  // Individual fields
  clientName?: string;
  phone?: string;
  email?: string;
  
  // Company fields
  companyName?: string;
  contactPerson?: string;
  designation?: string;
  industry?: string;
  employeeCount?: number;
  
  region: string;
  city: string;
  
  // Requirement
  lookingFor: 'Commercial Office' | 'Coworking Space';
  micromarket: string;
  
  // Commercial space requirements
  requiredArea?: number;
  expectedSeats?: number;
  leaseDuration?: number;
  
  // Coworking space requirements
  coworkingSeats?: number;
  cabinRequirement?: number;
  meetingRoomNeed?: number;
  
  budgetRange: string;
  expectedMoveIn: string;
  additionalReqs: string;

  // Internal Status
  source: LeadSource;
  priority: LeadPriority;
  assignedExecutive: string;
  status: LeadStatus;
  
  suggestedProperties: SuggestedProperty[];
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  leadId: string;
  propertyId?: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Mail {
  id: string;
  leadId: string;
  subject: string;
  date: string;
  status: 'Sent' | 'Draft';
  tag: string;
  message: string;
  attachment?: string;
}

export interface LeadSourceConfig {
  id: string;
  name: string;
  type: 'Email' | 'WhatsApp' | 'Business Messaging' | 'SMS Notification' | 'Web Form' | 'LinkedIn Scraper' | 'Manual Upload';
  channelInput?: string;
  aiHandlingRule?: string;
  status: 'Active' | 'Inactive';
  leadsGenerated: number;
  conversionRate: number; // percentage
  autoAssignRule?: string; // e.g. "North Region -> Amit Manager"
}

// ==========================================
// SUPER ADMIN MODULE TYPES
// ==========================================

export interface GlobalWorkspace {
  id: string;
  name: string;
  type: 'Admin Workspace' | 'Sales Workspace' | 'Supply Workspace';
  usersCount: number;
  modulesEnabled: string[];
  status: 'Active' | 'Inactive';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  workspaceName?: string;
  reportingManagerId?: string;
  status: 'Active' | 'Inactive';
  region: string;
  joiningDate: string;
  propertiesCount: number;
}

export interface AIPrompt {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'Active' | 'Draft' | 'Archived';
  accuracy: number;
  processedRequests: number;
}

export interface IntegrationConfig {
  id: string;
  provider: string;
  category: 'Email' | 'WhatsApp Business API' | 'LinkedIn Scraper' | 'CRM' | 'Calendar';
  status: 'Connected' | 'Available' | 'Error';
  lastSync?: string;
  errors?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
}

// ==========================================
// SUPPLY MODULE TYPES
// ==========================================

export type PartnerType = 'Developer' | 'Coworking Operator' | 'Broker' | 'Property Owner';

export interface PartnerActivity {
  date: string;
  action: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: 'Active' | 'Inactive';
  website?: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  relationshipManager: string;
  since: string;
  notes?: string;
  activityHistory: PartnerActivity[];
}
