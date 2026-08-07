export type SignalStatus = 'New' | 'Ignored' | 'Converted' | 'Pending Verification';
export type Confidence = 'High' | 'Medium' | 'Low';

export interface LeadSignal {
  id: string;
  company: string;
  industry: string;
  source: string;
  sourceIcon: 'linkedin' | 'twitter' | 'news' | 'website';
  signalType: string;
  confidenceScore: number;
  confidenceLevel: Confidence;
  detectedDate: string;
  status: SignalStatus;
  
  // Detail info
  aiInsight: string;
  evidence: { type: string, detail: string, date: string };
  companyInfo: { employees: string, location: string, currentOffices: string };
  prediction: { city: string, requirement: string, timeline: string };
}

export const MOCK_SIGNALS: LeadSignal[] = [
  {
    id: 'sig_1',
    company: 'Zomato',
    industry: 'Technology',
    source: 'LinkedIn',
    sourceIcon: 'linkedin',
    signalType: 'Team Expansion',
    confidenceScore: 92,
    confidenceLevel: 'High',
    detectedDate: '2026-06-14',
    status: 'New',
    aiInsight: 'AI detected rapid hiring growth at Zomato. Engineering and operations roles increased significantly, indicating possible workspace expansion.',
    evidence: { type: 'Hiring Increase', detail: '200+ new job openings posted in the last 14 days.', date: '12 June 2026' },
    companyInfo: { employees: '5000+', location: 'Gurgaon, India', currentOffices: 'Sector 44, Gurgaon' },
    prediction: { city: 'Gurgaon', requirement: '300-500 seats', timeline: '3-6 months' }
  },
  {
    id: 'sig_2',
    company: 'Google India',
    industry: 'Technology',
    source: 'News',
    sourceIcon: 'news',
    signalType: 'New Office Expansion',
    confidenceScore: 88,
    confidenceLevel: 'High',
    detectedDate: '2026-06-13',
    status: 'New',
    aiInsight: 'Recent PR indicates a massive investment in Indian infrastructure. AI correlates this with historical real estate acquisitions.',
    evidence: { type: 'Press Release', detail: 'Announced $1B investment in local infrastructure.', date: '11 June 2026' },
    companyInfo: { employees: '10000+', location: 'Multiple, India', currentOffices: 'Bangalore, Hyderabad, Gurgaon' },
    prediction: { city: 'Pune / Hyderabad', requirement: '1000+ seats', timeline: '6-12 months' }
  },
  {
    id: 'sig_3',
    company: 'Paytm',
    industry: 'Fintech',
    source: 'Twitter/X',
    sourceIcon: 'twitter',
    signalType: 'Relocation Discussion',
    confidenceScore: 75,
    confidenceLevel: 'Medium',
    detectedDate: '2026-06-12',
    status: 'New',
    aiInsight: 'Leadership tweets imply dissatisfaction with current campus lease terms and a push for modernization.',
    evidence: { type: 'Social Sentiment', detail: 'Executive tweets discussing hybrid work model redesigns.', date: '10 June 2026' },
    companyInfo: { employees: '8000+', location: 'Noida, India', currentOffices: 'Sector 98, Noida' },
    prediction: { city: 'Noida / Gurgaon', requirement: '500-800 seats', timeline: '3-6 months' }
  },
  {
    id: 'sig_4',
    company: 'Razorpay',
    industry: 'Fintech',
    source: 'Funding News',
    sourceIcon: 'news',
    signalType: 'Post-Funding Expansion',
    confidenceScore: 95,
    confidenceLevel: 'High',
    detectedDate: '2026-06-10',
    status: 'New',
    aiInsight: 'Closed Series F funding. Startup history shows 90% correlation between Series F and aggressive physical footprint expansion.',
    evidence: { type: 'Funding Round', detail: 'Raised $375M Series F.', date: '09 June 2026' },
    companyInfo: { employees: '2500+', location: 'Bangalore, India', currentOffices: 'Koramangala, Bangalore' },
    prediction: { city: 'Bangalore', requirement: '200-300 seats', timeline: '1-3 months' }
  }
];
