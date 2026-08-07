"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ArrowRight, Activity, Users, MessageSquare, FileText, Globe,
  CheckCircle, Building2, MapPin, Target, Zap, Clock, ShieldAlert, Eye, UserPlus, XCircle
} from "lucide-react";
import { MOCK_SIGNALS } from "../mock-data";

export default function SignalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const signal = MOCK_SIGNALS.find(s => s.id === params.id);

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  if (!signal) {
    return (
      <div className="flex-1 p-8 h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Signal not found</h2>
        <Button onClick={() => router.push('/sales/lead-signals')} className="mt-4">Back to Signals</Button>
      </div>
    );
  }

  const getSourceIcon = (type: string) => {
    switch(type) {
      case 'linkedin': return <Users className="h-3.5 w-3.5" />;
      case 'twitter': return <MessageSquare className="h-3.5 w-3.5" />;
      case 'news': return <FileText className="h-3.5 w-3.5" />;
      default: return <Globe className="h-3.5 w-3.5" />;
    }
  };

  const handleConvert = () => {
    setIsConverted(true);
    setShowConvertModal(false);
  };

  return (
    <div className="flex-1 relative flex flex-col bg-slate-50 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 pb-28 animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* HEADER SECTION */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push('/sales/lead-signals')} className="text-slate-500 hover:text-slate-900 -ml-3 mb-2 font-semibold text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lead Signals
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-[28px] font-bold tracking-tight text-slate-900 mb-3">{signal.company}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" /> {signal.industry}
                  </span>
                  <span className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    {getSourceIcon(signal.sourceIcon)} {signal.source} Signal
                  </span>
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-widest border ${
                    isConverted ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {isConverted ? 'Pending Verification' : 'New Opportunity'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right border-r border-slate-200 pr-6 hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Opportunity Score</p>
                  <p className="text-2xl font-black text-emerald-600 leading-none">{signal.confidenceScore}%</p>
                </div>
                {!isConverted ? (
                  <Button onClick={() => setShowConvertModal(true)} className="bg-indigo-600 hover:bg-indigo-700 font-semibold h-10 px-6">
                    Create Potential Lead
                  </Button>
                ) : (
                  <div className="bg-slate-100 border border-slate-200 text-slate-500 font-bold h-10 px-6 rounded-md flex items-center">
                    Sent for Verification
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              
              {/* SECTION 1: AI OPPORTUNITY SUMMARY */}
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-600"/>
                  <h3 className="text-[16px] font-bold text-slate-900">AI Opportunity Insight</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-[15px] font-medium text-slate-800 leading-relaxed mb-6">
                    "{signal.aiInsight}"
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Signal Type</p><p className="font-semibold text-sm">{signal.signalType}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Detected From</p><p className="font-semibold text-sm">{signal.source}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Confidence</p><p className="font-semibold text-sm text-emerald-600">{signal.confidenceScore}%</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Detected Date</p><p className="font-semibold text-sm">{new Date(signal.detectedDate).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'})}</p></div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5"><Target className="h-3.5 w-3.5"/> Primary Evidence</p>
                    <p className="font-medium text-sm text-slate-700">{signal.evidence.detail}</p>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 2: COMPANY INTELLIGENCE */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500"/> Company Intelligence</h3>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Company Size</p>
                      <p className="font-semibold text-sm text-slate-900">{signal.companyInfo.employees} Employees</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Headquarters</p>
                      <p className="font-semibold text-sm text-slate-900">{signal.companyInfo.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Industry</p>
                      <p className="font-semibold text-sm text-slate-900">{signal.industry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Growth Stage</p>
                      <p className="font-semibold text-sm text-slate-900">Expansion</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Footprint</p>
                        <p className="font-medium text-sm text-slate-700">{signal.companyInfo.currentOffices}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Existing Workspace</p>
                        <p className="font-medium text-sm text-slate-700">~800 Seats Estimated</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* SECTION 3: PREDICTED WORKSPACE REQUIREMENT */}
              <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-600"/> Predicted Workspace Requirement</h3>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Target Location</p>
                      <p className="font-bold text-[15px] text-slate-900">{signal.prediction.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Expected Requirement</p>
                      <p className="font-bold text-[15px] text-slate-900">{signal.prediction.requirement}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Workspace Type</p>
                      <p className="font-semibold text-sm text-slate-700">Managed Office</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Timeline</p>
                      <p className="font-semibold text-sm text-slate-700">{signal.prediction.timeline}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Priority</p>
                      <p className="font-semibold text-sm text-slate-700">High Intent</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Recommended Action</p>
                      <p className="font-semibold text-sm text-indigo-600">Start outreach within 7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 4: DECISION MAKERS */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><Users className="h-4 w-4 text-slate-500"/> Decision Makers</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">2 Identified</span>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    <div className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-slate-900">Amit Sharma</p>
                        <p className="text-xs font-medium text-slate-500">Workplace Manager</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-3"><Eye className="h-3.5 w-3.5 mr-1.5"/> View Profile</Button>
                        <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold px-3"><UserPlus className="h-3.5 w-3.5 mr-1.5"/> Add Contact</Button>
                      </div>
                    </div>
                    <div className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-slate-900">Priya Desai</p>
                        <p className="text-xs font-medium text-slate-500">Head of Real Estate</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-3"><Eye className="h-3.5 w-3.5 mr-1.5"/> View Profile</Button>
                        <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold px-3"><UserPlus className="h-3.5 w-3.5 mr-1.5"/> Add Contact</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 5: COMPETITION / MARKET INTELLIGENCE */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-slate-500"/> Risk & Market Intelligence</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-500">Current Broker Relationship</p>
                      <p className="text-sm font-semibold text-slate-900">Unknown</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-500">Competitor Activity</p>
                      <p className="text-sm font-semibold text-slate-900">High</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-500">Retention Difficulty</p>
                      <p className="text-sm font-semibold text-slate-900">Medium/High</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500">Opportunity Risk</p>
                      <p className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Needs Fast Outreach</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button variant="ghost" className="text-slate-500 hover:text-red-600 font-semibold h-10 px-4">
            <XCircle className="h-4 w-4 mr-2"/> Ignore Signal
          </Button>
          {!isConverted ? (
            <Button onClick={() => setShowConvertModal(true)} className="bg-indigo-600 hover:bg-indigo-700 font-semibold h-10 px-8 shadow-sm">
              Create Potential Lead
            </Button>
          ) : (
            <Button disabled className="bg-slate-100 text-slate-500 font-semibold h-10 px-8 opacity-100">
              <CheckCircle className="h-4 w-4 mr-2"/> Lead Sent for Verification
            </Button>
          )}
        </div>
      </div>

      {/* CREATE POTENTIAL LEAD MODAL */}
      {showConvertModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl animate-in zoom-in-95 border-0 rounded-2xl">
            <h3 className="text-[20px] font-bold tracking-tight text-slate-900 mb-1">Convert Signal into Potential Lead?</h3>
            <p className="text-sm text-slate-500 mb-6">Review the opportunity details before sending to admin for verification.</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Company</p>
                  <p className="font-bold text-slate-900">{signal.company}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Predicted Requirement</p>
                  <p className="font-semibold text-slate-800">{signal.prediction.requirement} in {signal.prediction.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Confidence Score</p>
                  <p className="font-bold text-emerald-600">{signal.confidenceScore}%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-6 pt-4">
              <Button variant="ghost" onClick={() => setShowConvertModal(false)} className="font-semibold h-10 px-5">Cancel</Button>
              <Button onClick={handleConvert} className="bg-primary hover:bg-primary/90 font-semibold h-10 px-6">
                Create Lead
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
