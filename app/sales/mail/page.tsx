"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Mail as MailIcon, User as UserIcon, Paperclip, Send, X, Bot, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIMail {
  id: string;
  leadId: string;
  trigger: string;
  reason: string;
  subject: string;
  body: string;
  generatedDate: string;
  status: 'Pending' | 'Rejected';
}

export default function MailManagementPage() {
  const { mails, leads, addMail } = useAppStore();
  const [activeTab, setActiveTab] = useState<'AI Generated' | 'Sent' | 'Rejected'>('AI Generated');
  
  // Mock AI Mails
  const [aiMails, setAiMails] = useState<AIMail[]>([
    {
      id: 'ai_1',
      leadId: leads[0]?.id || 'lead_1', // assuming Shweta Jain or similar
      trigger: 'Birthday',
      reason: "Generated because client's birthday is today.",
      subject: 'Wishing you a very Happy Birthday!',
      body: "Dear Client,\n\nWishing you a wonderful birthday from the team at Estate OS! We hope you have a great year ahead.\n\nBest Regards,\nRohit Verma",
      generatedDate: new Date().toISOString(),
      status: 'Pending'
    },
    {
      id: 'ai_2',
      leadId: leads[1]?.id || 'lead_2',
      trigger: 'Promotion',
      reason: 'New premium workspace available matching previous interest.',
      subject: 'New Premium Workspace Available in BKC',
      body: "Hello,\n\nWe noticed you were previously looking for premium spaces in BKC. A new inventory has just opened up that perfectly matches your criteria.\n\nLet me know if you'd like a tour.\n\nBest,\nRohit",
      generatedDate: new Date().toISOString(),
      status: 'Pending'
    },
    {
      id: 'ai_3',
      leadId: leads[2]?.id || 'lead_3',
      trigger: 'Follow Up',
      reason: 'No response after last discussion.',
      subject: 'Following up on our last conversation',
      body: "Hi there,\n\nI wanted to quickly follow up on our last discussion regarding your workspace requirements. Have you had a chance to review the proposals?\n\nThanks,\nRohit Verma",
      generatedDate: new Date().toISOString(),
      status: 'Pending'
    },
    {
      id: 'ai_4',
      leadId: leads[3]?.id || 'lead_4',
      trigger: 'Welcome',
      reason: 'New client added to CRM.',
      subject: 'Welcome to Estate OS',
      body: "Welcome!\n\nWe are thrilled to help you find the perfect workspace for your team. I will be your dedicated sales executive and will share some initial options shortly.\n\nRegards,\nRohit",
      generatedDate: new Date().toISOString(),
      status: 'Pending'
    }
  ]);

  const [viewingMailId, setViewingMailId] = useState<string | null>(null);
  const [editableSubject, setEditableSubject] = useState("");
  const [editableBody, setEditableBody] = useState("");

  const handleView = (mail: AIMail) => {
    setViewingMailId(mail.id);
    setEditableSubject(mail.subject);
    setEditableBody(mail.body);
  };

  const handleApproveAndSend = () => {
    const mail = aiMails.find(m => m.id === viewingMailId);
    if (!mail) return;

    // Add to standard mails (Sent)
    addMail({
      id: `mail_${Date.now()}`,
      leadId: mail.leadId,
      subject: editableSubject,
      date: new Date().toISOString(),
      status: 'Sent',
      tag: mail.trigger,
      message: editableBody,
      attachment: undefined
    });

    // Remove from AI Pending list
    setAiMails(prev => prev.filter(m => m.id !== viewingMailId));
    setViewingMailId(null);
    alert('Email approved and sent successfully!');
  };

  const handleReject = () => {
    setAiMails(prev => prev.map(m => m.id === viewingMailId ? { ...m, status: 'Rejected' } : m));
    setViewingMailId(null);
  };

  const handleRegenerate = () => {
    setEditableBody(prev => prev + "\n\n(Regenerated AI Variation: Let me know if you need any further assistance!)");
  };

  const renderAITab = (statusFilter: 'Pending' | 'Rejected') => {
    const filteredAIMails = aiMails.filter(m => m.status === statusFilter);

    return (
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">AI Trigger</th>
                <th className="px-6 py-4 font-bold">Generated Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAIMails.length > 0 ? (
                filteredAIMails.map((mail) => {
                  const lead = leads.find(l => l.id === mail.leadId);
                  const clientName = lead ? (lead.type === 'Company' ? lead.companyName : lead.clientName) : 'Unknown Client';
                  
                  return (
                    <tr key={mail.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          {clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          mail.trigger === 'Birthday' ? 'bg-pink-50 text-pink-700 border border-pink-100' :
                          mail.trigger === 'Promotion' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          mail.trigger === 'Follow Up' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <Bot className="h-3 w-3 mr-1.5" /> {mail.trigger}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs font-medium">
                        {new Date(mail.generatedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusFilter === 'Pending' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                          {statusFilter === 'Pending' ? 'Pending Approval' : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleView(mail)} className="text-indigo-600 font-semibold hover:text-indigo-700 hover:bg-indigo-50">
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Bot className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-sm">No {statusFilter.toLowerCase()} AI emails found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const renderSentTab = () => {
    const sentMails = mails.filter(m => m.status === 'Sent');
    return (
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Attachment</th>
                <th className="px-6 py-4 font-bold">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sentMails.length > 0 ? (
                sentMails.map((mail) => {
                  const lead = leads.find(l => l.id === mail.leadId);
                  const clientName = lead ? (lead.type === 'Company' ? lead.companyName : lead.clientName) : 'Unknown Client';
                  return (
                    <tr key={mail.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          {clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[250px] truncate text-slate-900 font-medium">
                        {mail.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-600">
                          {mail.tag || 'Manual'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mail.attachment ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                            <Paperclip className="h-3 w-3" /> {mail.attachment}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs font-medium">
                        {new Date(mail.date).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <MailIcon className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-sm">No sent emails found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const activeMail = viewingMailId ? aiMails.find(m => m.id === viewingMailId) : null;
  const activeLead = activeMail ? leads.find(l => l.id === activeMail.leadId) : null;
  const activeClientName = activeLead ? (activeLead.type === 'Company' ? activeLead.companyName : activeLead.clientName) : '';

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600" /> AI Mail Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage AI-generated personalized client communication.</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {['AI Generated', 'Sent', 'Rejected'].map(tab => {
          const isActive = activeTab === tab;
          let count = 0;
          if (tab === 'AI Generated') count = aiMails.filter(m => m.status === 'Pending').length;
          if (tab === 'Rejected') count = aiMails.filter(m => m.status === 'Rejected').length;
          if (tab === 'Sent') count = mails.filter(m => m.status === 'Sent').length;

          return (
            <Button 
              key={tab}
              variant={isActive ? 'default' : 'outline'}
              className={`font-semibold ${isActive ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setActiveTab(tab as any)}
              size="sm"
            >
              {tab} <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
            </Button>
          )
        })}
      </div>

      {activeTab === 'AI Generated' && renderAITab('Pending')}
      {activeTab === 'Rejected' && renderAITab('Rejected')}
      {activeTab === 'Sent' && renderSentTab()}

      {/* VIEW EMAIL MODAL / DRAWER */}
      {viewingMailId && activeMail && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-end p-4 sm:p-0 animate-in fade-in">
          <div className="bg-white h-full w-full sm:w-[500px] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-600" /> Review AI Email
              </h3>
              <button onClick={() => setViewingMailId(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">AI Reason</p>
                <p className="font-medium text-indigo-900">{activeMail.reason}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">To</label>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-md text-sm font-semibold text-slate-700">
                    {activeClientName} &lt;{activeLead?.email}&gt;
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Subject</label>
                  <input 
                    type="text"
                    value={editableSubject}
                    onChange={e => setEditableSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-md text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Email Body</label>
                  <textarea 
                    value={editableBody}
                    onChange={e => setEditableBody(e.target.value)}
                    className="w-full h-64 bg-white border border-slate-200 p-3 rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <Button variant="outline" onClick={handleRegenerate} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReject} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button onClick={handleApproveAndSend} className="bg-indigo-600 hover:bg-indigo-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
