"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Link as LinkIcon, Mail, MessageSquare, Share2, Database, Calendar as CalendarIcon, MoreVertical, RefreshCw, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IntegrationsPage() {
  const { integrations, updateIntegrationStatus } = useAppStore();
  const router = useRouter();

  const [setupWizardOpen, setSetupWizardOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  const getIcon = (category: string) => {
    switch(category) {
      case 'Email': return <Mail className="h-6 w-6 text-slate-700" />;
      case 'WhatsApp Business API': return <MessageSquare className="h-6 w-6 text-emerald-600" />;
      case 'LinkedIn Scraper': return <Share2 className="h-6 w-6 text-blue-600" />;
      case 'CRM': return <Database className="h-6 w-6 text-indigo-600" />;
      case 'Calendar': return <CalendarIcon className="h-6 w-6 text-amber-600" />;
      default: return <LinkIcon className="h-6 w-6 text-slate-700" />;
    }
  };

  const handleConnectClick = (integration: any) => {
    setSelectedIntegration(integration);
    setWizardStep(1);
    setSetupWizardOpen(true);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setWizardStep(3);
    }, 1500);
  };

  const handleActivate = () => {
    updateIntegrationStatus(selectedIntegration.id, 'Connected');
    setSetupWizardOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integration Management</h1>
        <p className="text-slate-500 mt-2">Manage global platform connections to third-party services and APIs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <Card key={integration.id} className={`bg-white border shadow-sm transition-all hover:shadow-md ${integration.errors && integration.errors > 0 ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  {getIcon(integration.category)}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    integration.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' :
                    integration.status === 'Available' ? 'bg-slate-100 text-slate-500' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {integration.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg mb-1">{integration.provider}</h3>
              <p className="text-sm text-slate-500 mb-6">{integration.category} Integration</p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">API Status</span>
                  <span className="font-bold text-slate-900">{integration.status === 'Connected' ? 'Healthy' : 'Disconnected'}</span>
                </div>
                {integration.lastSync && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Last Sync</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> {integration.lastSync}
                    </span>
                  </div>
                )}
                {integration.errors !== undefined && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Errors (24h)</span>
                    <span className={`font-bold ${integration.errors > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{integration.errors}</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {integration.status === 'Connected' ? (
                  <button 
                    onClick={() => router.push(`/super-admin/integrations/${integration.id}`)}
                    className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Configure
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnectClick(integration)}
                    className="w-full py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Connect API
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-slate-50/50 border border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors hover:border-indigo-300 group">
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-105 transition-transform">
            <LinkIcon className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Add Integration</h3>
          <p className="text-xs text-slate-500">Connect a new service or API endpoint to Estate OS.</p>
        </Card>
      </div>

      {/* SETUP WIZARD MODAL */}
      {setupWizardOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {getIcon(selectedIntegration.category)}
                Connect {selectedIntegration.provider}
              </h3>
              <button onClick={() => setSetupWizardOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Stepper */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
                
                {[
                  { step: 1, label: "Credentials" },
                  { step: 2, label: "Verify" },
                  { step: 3, label: "Modules" },
                  { step: 4, label: "Activate" }
                ].map((s) => (
                  <div key={s.step} className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      wizardStep > s.step ? 'bg-indigo-600 border-indigo-600 text-white' :
                      wizardStep === s.step ? 'border-indigo-600 text-indigo-600 bg-indigo-50' :
                      'border-slate-200 text-slate-400 bg-white'
                    }`}>
                      {wizardStep > s.step ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${wizardStep >= s.step ? 'text-indigo-900' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Credentials */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-slate-900 mb-4">Enter API Credentials</h4>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Client ID / Account ID</label>
                    <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" placeholder="Enter ID" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">API Token / Secret</label>
                    <input type="password" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" placeholder="••••••••••••••••" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Webhook URL (Optional)</label>
                    <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" placeholder="https://" />
                  </div>
                </div>
              )}

              {/* Step 2: Verify */}
              {wizardStep === 2 && (
                <div className="py-12 flex flex-col items-center justify-center animate-in fade-in text-center">
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                      <h4 className="font-bold text-slate-900 text-lg">Verifying Connection...</h4>
                      <p className="text-sm text-slate-500 mt-1">Pinging {selectedIntegration.provider} endpoints.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Connection Verified</h4>
                      <p className="text-sm text-slate-500 mt-1">API credentials are valid and endpoints are responding.</p>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Modules */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-slate-900 mb-2">Select Connected Modules</h4>
                  <p className="text-sm text-slate-500 mb-4">Choose where this integration will be active.</p>
                  
                  <div className="space-y-2">
                    {['Lead Follow-up', 'Client Connect', 'Lead Signals', 'AI Mail Management'].map((mod) => (
                      <label key={mod} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-600 cursor-pointer group transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{mod}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Activate */}
              {wizardStep === 4 && (
                <div className="py-8 flex flex-col items-center justify-center animate-in fade-in text-center">
                  <div className="p-4 bg-indigo-50 rounded-full mb-6">
                    {getIcon(selectedIntegration.category)}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xl">Ready to Activate</h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">
                    {selectedIntegration.provider} has been fully configured and mapped to the selected platform modules.
                  </p>
                </div>
              )}

            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button 
                onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setSetupWizardOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                disabled={isVerifying}
              >
                {wizardStep > 1 ? 'Back' : 'Cancel'}
              </button>
              
              {wizardStep === 1 && (
                <button 
                  onClick={() => { setWizardStep(2); handleVerify(); }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Verify Connection <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {wizardStep === 2 && !isVerifying && (
                <button 
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {wizardStep === 3 && (
                <button 
                  onClick={() => setWizardStep(4)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Confirm Modules <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {wizardStep === 4 && (
                <button 
                  onClick={handleActivate}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Activate Integration <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
