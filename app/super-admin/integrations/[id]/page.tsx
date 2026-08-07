"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Activity, RefreshCw, AlertTriangle, Play, FileText, 
  Settings, ChevronDown, ChevronUp, Link as LinkIcon, Save, Database, Server, Clock, Mail, MessageSquare, Share2, Calendar
} from "lucide-react";
import { useState } from "react";

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { integrations, updateIntegrationStatus } = useAppStore();
  
  const integration = integrations.find(i => i.id === params.id);
  
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  if (!integration) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <LinkIcon className="h-12 w-12 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Integration not found</h2>
        <button onClick={() => router.push('/super-admin/integrations')} className="mt-4 text-indigo-600 font-semibold hover:underline">Return to list</button>
      </div>
    );
  }

  const handleSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleDisconnect = () => {
    updateIntegrationStatus(integration.id, 'Available');
    router.push('/super-admin/integrations');
  };

  const renderConfigurationFields = () => {
    if (integration.category === 'WhatsApp Business API') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Business Account ID</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="104928374829304" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Phone Number ID</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="109283746592837" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">API Token</label>
            <div className="flex gap-2">
              <input type="password" disabled className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-100 text-slate-500" defaultValue="EAAMy1...abcd" />
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors whitespace-nowrap">
                Update Token
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Webhook URL</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="https://estateos.com/api/webhooks/whatsapp" />
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-900">Webhook Status</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
          </div>
        </div>
      );
    }
    
    if (integration.category === 'LinkedIn Scraper') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Account ID</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="LI_8849302" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Scraper API Key</label>
              <input type="password" disabled className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-100 text-slate-500" defaultValue="••••••••••••••••" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Sync Frequency</label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-white" defaultValue="Every 15 min">
              <option>Every 15 min</option>
              <option>Hourly</option>
              <option>Daily</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Data Capture Options</label>
            <div className="space-y-2">
              {[
                'Company expansion signals',
                'Hiring signals',
                'Funding news',
                'Leadership changes'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (integration.category === 'CRM') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">CRM URL</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="https://estateos.my.salesforce.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Client ID</label>
              <input type="password" disabled className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-100 text-slate-500" defaultValue="••••••••••••" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Client Secret</label>
              <input type="password" disabled className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-100 text-slate-500" defaultValue="••••••••••••••••" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Sync Direction</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="radio" name="syncDir" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Import only</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="syncDir" className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Export only</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="syncDir" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 border-slate-300" />
                <span className="text-sm font-semibold text-slate-700">Two way sync</span>
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (integration.category === 'Email') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Tenant ID</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Email Account</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600 bg-slate-50" defaultValue="hello@estateos.com" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">Permissions</label>
            <div className="space-y-2">
              {[
                'Send email',
                'Read replies',
                'Calendar access'
              ].map(opt => (
                <label key={opt} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-sm text-slate-500">No advanced configuration fields available for this integration type.</p>
      </div>
    );
  };

  const renderConnectedModules = () => {
    let modulesList = [];
    if (integration.category === 'WhatsApp Business API') {
      modulesList = [
        { name: 'Client Connect', desc: 'Client profile messaging', enabled: true },
        { name: 'Lead Follow-up', desc: 'Automated lead sequences', enabled: true },
        { name: 'Notifications', desc: 'Platform alerts', enabled: false }
      ];
    } else if (integration.category === 'LinkedIn Scraper') {
      modulesList = [
        { name: 'Lead Signals', desc: 'Lead discovery automation', enabled: true },
        { name: 'Client Intelligence', desc: 'Profile enrichment', enabled: true },
        { name: 'Competitor Mapping', desc: 'Market tracking', enabled: false }
      ];
    } else if (integration.category === 'Email') {
      modulesList = [
        { name: 'AI Mail Management', desc: 'Context-aware automated replies', enabled: true },
        { name: 'Meeting Scheduler', desc: 'Calendar automation', enabled: true }
      ];
    } else {
      modulesList = [
        { name: 'Lead Tracking', desc: 'Standard pipeline tracking', enabled: true },
        { name: 'Analytics Engine', desc: 'Lead conversion reporting', enabled: false }
      ];
    }

    return (
      <Card className="bg-white border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-100 bg-white">
          <CardTitle className="text-[15px] font-bold text-slate-900">Connected Modules</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Manage integration access</p>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <div className="divide-y divide-slate-100">
            {modulesList.map(mod => (
              <div key={mod.name} className="p-3 hover:bg-slate-50 transition-colors h-16 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${mod.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <p className={`font-semibold text-sm ${mod.enabled ? 'text-slate-900' : 'text-slate-500'}`}>{mod.name}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked={mod.enabled} className="sr-only peer" />
                    <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 pl-3.5 truncate w-[90%]">{mod.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <button className="w-full py-2 bg-white border border-slate-200 text-indigo-600 font-semibold rounded-lg text-xs hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm">
            + Connect Another Module
          </button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <button 
            onClick={() => router.push('/super-admin/integrations')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Integrations
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{integration.provider}</h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              integration.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' :
              integration.status === 'Available' ? 'bg-slate-100 text-slate-500' :
              'bg-red-50 text-red-600'
            }`}>
              {integration.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Activity className="h-4 w-4" /> Test Connection
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm">
            Save Configuration
          </button>
        </div>
      </div>

      {/* SECTION 1: CONNECTION STATUS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Connection Status</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {integration.status}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">API Health</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" /> Healthy
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Last Sync</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" /> {integration.lastSync || 'Never'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col justify-center min-h-[100px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Errors (24h)</p>
            <p className={`text-lg font-bold flex items-center gap-2 ${integration.errors && integration.errors > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              <AlertTriangle className={`h-4 w-4 ${integration.errors && integration.errors > 0 ? 'text-red-500' : 'text-slate-300'}`} /> {integration.errors || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 2: API CONFIGURATION */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderConfigurationFields()}
            </CardContent>
          </Card>

          {/* SECTION 6: ADVANCED SETTINGS */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            <div 
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-slate-400" />
                <h3 className="font-bold text-slate-900">Advanced Settings</h3>
              </div>
              {advancedOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </div>
            {advancedOpen && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">API Timeout (ms)</label>
                    <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" defaultValue="5000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Retry Attempts</label>
                    <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" defaultValue="3" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Data Retention (Days)</label>
                    <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" defaultValue="30" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">Rate Limits (Req/Min)</label>
                    <input type="number" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-600" defaultValue="100" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* SECTION 5: ERROR LOGS */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Error Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Issue</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-600">17 June</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{integration.provider} API rate limit exceeded</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-widest">Resolved</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-600">16 June</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">Timeout waiting for response</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-widest">Resolved</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* DISCONNECT FLOW */}
          <Card className="bg-red-50/50 border-red-200 shadow-sm mt-6">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-red-900 text-lg mb-1">Disconnect Integration</h4>
                <p className="text-sm text-red-700 font-medium">This will stop data sync across all connected modules. Functionality will be suspended immediately.</p>
              </div>
              <button 
                onClick={() => setShowDisconnectModal(true)}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Disconnect
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* SECTION 4: SYNC MANAGEMENT */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Sync Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Last Sync</p>
                  <p className="font-semibold text-slate-900">17 June 2026, 11:30 AM</p>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Records Processed</p>
                    <p className="font-bold text-indigo-600 text-lg">12,430</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Failed</p>
                    <p className="font-bold text-red-500 text-lg">3</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" /> Run Manual Sync
                </button>
                <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" /> View Sync Logs
                </button>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: MODULE CONNECTION */}
          {renderConnectedModules()}

        </div>
      </div>

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Confirm Disconnection
              </h3>
              <button onClick={() => setShowDisconnectModal(false)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Are you sure you want to disconnect <strong>{integration.provider}</strong>? All connected modules will lose access to this integration, and data syncing will stop immediately. This action cannot be easily undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowDisconnectModal(false)} 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-xl bg-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDisconnect} 
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Yes, Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Save className="h-5 w-5 text-emerald-400" />
            <p className="text-sm font-medium">Configuration saved successfully</p>
          </div>
        </div>
      )}

    </div>
  );
}
