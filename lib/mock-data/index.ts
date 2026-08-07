import { Property, Task, User, Unit, Tower, Floor, UnitStatus } from '@/types';

export const mockCurrentUser: User = {
  id: 'usr_1',
  name: 'Sanjay Verma',
  email: 'sanjay.verma@estateos.com',
  role: 'Supply Executive',
  avatar: 'https://i.pravatar.cc/150?u=sanjay',
};

const generateUnits = (count: number, floorPrefix: string, isAvailableHeavy = false): Unit[] => {
  return Array.from({ length: count }).map((_, i) => {
    const r = Math.random();
    let status: 'Available' | 'Occupied' | 'Under Maintenance' = 'Occupied';
    if (isAvailableHeavy) {
      status = r > 0.3 ? 'Available' : (r > 0.2 ? 'Under Maintenance' : 'Occupied');
    } else {
      status = r > 0.7 ? 'Available' : (r > 0.6 ? 'Under Maintenance' : 'Occupied');
    }

    return {
      id: `u_${floorPrefix}_${i + 1}`,
      unitNumber: `${floorPrefix}${String(i + 1).padStart(2, '0')}`,
      area: Math.floor(Math.random() * 5000) + 1500,
      seatCapacity: Math.floor(Math.random() * 100) + 20,
      workspaceType: Math.random() > 0.5 ? 'Private Office' : 'Managed Office',
      status,
      amenities: ['High Speed Internet', 'Meeting Room Access', 'Cafeteria'],
      statusHistory: [
        {
          status: status,
          date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedBy: 'System',
        }
      ]
    };
  });
};

const generateFloors = (count: number, towerPrefix: string): Floor[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `f_${towerPrefix}_${i + 1}`,
    floorNumber: `${i + 1}`,
    units: generateUnits(Math.floor(Math.random() * 5) + 3, `${i + 1}`, i % 2 === 0),
  }));
};

const generateTowers = (count: number, propPrefix: string): Tower[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `t_${propPrefix}_${i + 1}`,
    name: `Tower ${String.fromCharCode(65 + i)}`,
    floors: generateFloors(Math.floor(Math.random() * 10) + 5, `${propPrefix}${String.fromCharCode(65 + i)}`),
  }));
};

export const mockProperties: Property[] = [
  {
    id: 'prop_1',
    name: 'DLF Cyber City Tower 8',
    developer: 'DLF',
    city: 'Gurugram',
    address: 'DLF Cyber City, DLF Phase 2, Sector 24',
    micromarket: 'Cyber City',
    lat: 28.4950,
    lng: 77.0895,
    buildingType: 'Corporate Office',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2018,
    totalArea: 1200000,
    towers: generateTowers(2, 'DLF8'),
    certifications: ['LEED Platinum', 'WELL Certified'],
    description: 'A premium integrated commercial park offering world-class infrastructure and amenities for Fortune 500 companies.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'],
    documents: [
      { id: 'doc_1', name: 'Building Layout', url: '#' },
      { id: 'doc_2', name: 'Occupancy Certificate', url: '#' }
    ],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_2',
    name: 'One BKC Business Park',
    developer: 'Radius Developers',
    city: 'Mumbai',
    address: 'G Block, Bandra Kurla Complex',
    micromarket: 'BKC',
    lat: 19.0664,
    lng: 72.8653,
    buildingType: 'Corporate Office',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2015,
    totalArea: 800000,
    towers: generateTowers(3, 'BKC'),
    certifications: ['IGBC Gold'],
    description: 'Situated in the heart of Mumbai’s financial district, One BKC provides premium commercial real estate with excellent connectivity.',
    images: ['https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_3',
    name: 'Embassy Tech Village',
    developer: 'Embassy Group',
    city: 'Bengaluru',
    address: 'Outer Ring Road, Devarabisanahalli',
    micromarket: 'Outer Ring Road',
    lat: 12.9350,
    lng: 77.6956,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2014,
    totalArea: 2500000,
    towers: generateTowers(4, 'ETV'),
    certifications: ['LEED Gold'],
    description: 'A large-scale IT park offering extensive amenities and a vibrant ecosystem for enterprise teams.',
    images: ['https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_4',
    name: 'World Trade Center',
    developer: 'Brigade Group',
    city: 'Bengaluru',
    address: 'Malleswaram, Rajajinagar',
    micromarket: 'North Bengaluru',
    lat: 13.0121,
    lng: 77.5555,
    buildingType: 'Corporate Office',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2010,
    totalArea: 1000000,
    towers: generateTowers(1, 'WTC'),
    certifications: ['LEED Gold'],
    description: 'An iconic skyscraper offering premium office spaces with panoramic views of the city.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Under Review',
    createdBy: 'usr_2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_5',
    name: 'Prestige Tech Park',
    developer: 'Prestige Group',
    city: 'Bengaluru',
    address: 'Kadubeesanahalli, ORR',
    micromarket: 'ORR',
    lat: 12.9370,
    lng: 77.6900,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2008,
    totalArea: 3500000,
    towers: generateTowers(5, 'PTP'),
    certifications: ['IGBC Gold'],
    description: 'One of the oldest and most established business parks in Bengaluru.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_6',
    name: 'Godrej BKC',
    developer: 'Godrej Properties',
    city: 'Mumbai',
    address: 'Bandra Kurla Complex',
    micromarket: 'BKC',
    lat: 19.0650,
    lng: 72.8640,
    buildingType: 'Corporate Office',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2016,
    totalArea: 1200000,
    towers: generateTowers(1, 'GBKC'),
    certifications: ['LEED Platinum'],
    description: 'State-of-the-art office spaces in Mumbai’s prime business hub.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Draft',
    createdBy: 'usr_3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop_7',
    name: 'Mindspace Airoli East',
    developer: 'K Raheja Corp',
    city: 'Mumbai',
    address: 'Airoli, Navi Mumbai',
    micromarket: 'Navi Mumbai',
    lat: 19.1620,
    lng: 72.9970,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2012,
    totalArea: 4000000,
    towers: generateTowers(6, 'MSE'),
    certifications: ['IGBC Gold'],
    description: 'A sprawling business park featuring expansive greenery and extensive amenities.',
    images: ['https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_8',
    name: 'Cyber Towers',
    developer: 'L&T',
    city: 'Hyderabad',
    address: 'HITEC City',
    micromarket: 'HITEC City',
    lat: 17.4504,
    lng: 78.3808,
    buildingType: 'Corporate Office',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 1998,
    totalArea: 500000,
    towers: generateTowers(1, 'CTH'),
    certifications: [],
    description: 'The landmark building that initiated Hyderabad’s IT revolution.',
    images: ['https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_2',
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_9',
    name: 'Knowledge City',
    developer: 'Salarpuria Sattva',
    city: 'Hyderabad',
    address: 'Raidurg, HITEC City',
    micromarket: 'HITEC City',
    lat: 17.4399,
    lng: 78.3756,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2018,
    totalArea: 3000000,
    towers: generateTowers(4, 'SKC'),
    certifications: ['LEED Platinum'],
    description: 'One of Asia’s largest and most premium IT parks housing global giants.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Under Review',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_10',
    name: 'DLF Downtown',
    developer: 'DLF',
    city: 'Chennai',
    address: 'Taramani',
    micromarket: 'OMR Pre-Toll',
    lat: 12.9780,
    lng: 80.2450,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Under Construction',
    yearBuilt: 2024,
    totalArea: 2500000,
    towers: generateTowers(3, 'DLFDT'),
    certifications: ['WELL Pre-certified'],
    description: 'Next-generation workspace integrating retail and commercial spaces.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Draft',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_11',
    name: 'Ramanujan IT City',
    developer: 'TRIL',
    city: 'Chennai',
    address: 'Taramani',
    micromarket: 'OMR Pre-Toll',
    lat: 12.9890,
    lng: 80.2470,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2015,
    totalArea: 4500000,
    towers: generateTowers(6, 'RITC'),
    certifications: ['LEED Gold'],
    description: 'Chennai’s premier IT SEZ located in the heart of the city’s IT corridor.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_2',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_12',
    name: 'Magarpatta City',
    developer: 'Magarpatta Township',
    city: 'Pune',
    address: 'Hadapsar',
    micromarket: 'Hadapsar',
    lat: 18.5150,
    lng: 73.9270,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2005,
    totalArea: 5000000,
    towers: generateTowers(8, 'MPC'),
    certifications: [],
    description: 'An award-winning integrated township and IT park.',
    images: ['https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_13',
    name: 'EON Free Zone',
    developer: 'Panchshil Realty',
    city: 'Pune',
    address: 'Kharadi',
    micromarket: 'Kharadi',
    lat: 18.5510,
    lng: 73.9530,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2011,
    totalArea: 4000000,
    towers: generateTowers(4, 'EON'),
    certifications: ['LEED Gold'],
    description: 'Pune’s most prominent IT SEZ offering world-class infrastructure.',
    images: ['https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Rejected',
    rejectionReason: 'Pending environmental clearance updates.',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_14',
    name: 'Candor TechSpace',
    developer: 'Brookfield',
    city: 'Noida',
    address: 'Sector 62',
    micromarket: 'Noida',
    lat: 28.6139,
    lng: 77.3620,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2010,
    totalArea: 2000000,
    towers: generateTowers(5, 'CTS'),
    certifications: ['IGBC Platinum'],
    description: 'A sprawling campus offering comprehensive amenities in Delhi NCR.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Approved',
    createdBy: 'usr_2',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop_15',
    name: 'Embassy Galaxy',
    developer: 'Embassy Group',
    city: 'Noida',
    address: 'Sector 62',
    micromarket: 'Noida',
    lat: 28.6145,
    lng: 77.3650,
    buildingType: 'Business Park',
    grade: 'A',
    status: 'Operational',
    yearBuilt: 2013,
    totalArea: 1500000,
    towers: generateTowers(2, 'EG'),
    certifications: ['LEED Gold'],
    description: 'A modern IT park designed for large scale technology operations.',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=2070&auto=format&fit=crop'],
    documents: [],
    lifecycleStatus: 'Under Review',
    createdBy: 'usr_1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const mockTasks: Task[] = [
  {
    id: 'tsk_101',
    taskName: 'Follow up with Zomato workspace team',
    taskType: 'Follow Up',
    description: 'Discuss 500 seat Gurgaon requirement. Check if they have reviewed the initial property deck.',
    relatedEntity: {
      type: 'Lead',
      id: 'ld_1',
      name: 'TechFlow Solutions' // We'll pretend Zomato is an alias or use ld_1 for now
    },
    assignedBy: 'System',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Open',
    history: [
      {
        status: 'Open',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Task created from new opportunity signal.'
      }
    ]
  },
  {
    id: 'tsk_102',
    taskName: 'Share revised proposal with Paytm',
    taskType: 'Proposal',
    description: 'Update the pricing for the Noida property and share the revised proposal deck.',
    relatedEntity: {
      type: 'Client',
      id: 'cli_1',
      name: 'Paytm'
    },
    assignedBy: 'Sales Manager',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress',
    history: [
      {
        status: 'In Progress',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Started working on the proposal revisions.'
      },
      {
        status: 'Open',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Manager assigned task after meeting.'
      }
    ]
  },
  {
    id: 'tsk_103',
    taskName: 'Schedule site visit for Embassy Manyata',
    taskType: 'Meeting',
    description: 'Coordinate with the supply team and the client to arrange a site visit for 3 towers.',
    relatedEntity: {
      type: 'Property',
      id: 'prop_3',
      name: 'Embassy Manyata Tech Park'
    },
    assignedBy: 'System',
    priority: 'High',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Overdue',
    history: [
      {
        status: 'Open',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Client requested site visit.'
      }
    ]
  },
  {
    id: 'tsk_104',
    taskName: 'Update internal CRM records for Q2',
    taskType: 'Internal',
    description: 'Ensure all lead statuses and contact details are up to date for the quarterly review.',
    assignedBy: 'Admin',
    priority: 'Low',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    history: [
      {
        status: 'Completed',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'Completed',
        notes: 'All records updated successfully.'
      },
      {
        status: 'Open',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

import { Lead, Meeting, Mail } from '@/types';

export const mockLeads: Lead[] = [
  {
    id: 'ld_1',
    type: 'Company',
    companyName: 'TechFlow Solutions',
    contactPerson: 'Anjali Sharma',
    designation: 'VP of Operations',
    email: 'anjali@techflow.io',
    phone: '+91 98765 43210',
    industry: 'Software',
    employeeCount: 150,
    region: 'North India',
    city: 'Gurugram',
    lookingFor: 'Commercial Office',
    micromarket: 'Cyber City',
    requiredArea: 12000,
    expectedSeats: 120,
    budgetRange: '₹12L - ₹15L/month',
    expectedMoveIn: '2024-08-01',
    additionalReqs: 'Needs dedicated server room and 24/7 access.',
    source: 'Website',
    priority: 'High',
    assignedExecutive: 'SAL001',
    status: 'New Requirement',
    suggestedProperties: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'ld_2',
    type: 'Individual',
    clientName: 'Rahul Desai',
    email: 'rahul.d@startup.co',
    phone: '+91 99887 76655',
    region: 'West India',
    city: 'Mumbai',
    lookingFor: 'Coworking Space',
    micromarket: 'BKC',
    coworkingSeats: 25,
    meetingRoomNeed: 1,
    budgetRange: '₹3L - ₹4L/month',
    expectedMoveIn: '2024-07-15',
    additionalReqs: 'Premium amenities, near metro station.',
    source: 'Referral',
    priority: 'Medium',
    assignedExecutive: 'SAL001',
    status: 'Property Suggested',
    suggestedProperties: [
      { propertyId: 'prop_2', matchPercentage: 92, status: 'Suggested' }
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'mtg_1',
    leadId: 'ld_1',
    date: '2024-06-15',
    time: '14:30',
    status: 'Upcoming',
    notes: 'Initial requirement gathering call.'
  },
  {
    id: 'mtg_2',
    leadId: 'ld_2',
    propertyId: 'prop_2',
    date: '2024-06-10',
    time: '11:00',
    status: 'Completed',
    notes: 'Site visit completed. Client liked the layout.'
  }
];

export const mockMails: Mail[] = [
  {
    id: 'mail_1',
    leadId: 'ld_1',
    subject: 'Welcome to Estate OS - Initial Requirement',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'Sent',
    tag: 'Intro',
    message: 'Hi Anjali, Thanks for reaching out. We are currently curating a list of premium commercial spaces in Cyber City matching your 12,000 sq ft requirement. Expect a proposal deck shortly.'
  }
];

mockLeads.push({
  id: 'ld_3',
  type: 'Company',
  companyName: 'Fintech Nexus',
  contactPerson: 'David Chen',
  designation: 'CFO',
  email: 'david.c@fintechnexus.com',
  phone: '+91 91234 56780',
  industry: 'Finance',
  employeeCount: 300,
  region: 'South India',
  city: 'Bengaluru',
  lookingFor: 'Commercial Office',
  micromarket: 'Whitefield',
  requiredArea: 25000,
  expectedSeats: 250,
  budgetRange: '₹30L - ₹35L/month',
  expectedMoveIn: '2024-05-01',
  additionalReqs: 'High security access control required.',
  source: 'Existing Client',
  priority: 'High',
  assignedExecutive: 'SAL001',
  status: 'Closed',
  suggestedProperties: [
    { propertyId: 'prop_1', matchPercentage: 98, status: 'Selected' }
  ],
  createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
});
