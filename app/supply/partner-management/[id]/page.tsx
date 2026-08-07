"use client";

import { useAppStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Calendar, Edit, ExternalLink, Mail, MapPin, Phone, Plus, UserCircle2, Briefcase, Activity, Target } from "lucide-react";
import Link from "next/link";

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { partners, properties } = useAppStore();
  
  const partnerId = params.id as string;
  const partner = partners.find(p => p.id === partnerId);
  
  if (!partner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Partner not found</h2>
        <Button variant="link" onClick={() => router.push('/supply/partner-management')}>Return to Directory</Button>
      </div>
    );
  }

  // Find associated properties
  const associatedProperties = properties.filter(p => p.developer === partner.name || p.operatorName === partner.name);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/supply/partner-management')} className="rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              {partner.name}
              <Badge variant={partner.status === 'Active' ? 'success' : 'secondary'} className="rounded-sm font-bold uppercase tracking-widest text-[10px]">
                {partner.status}
              </Badge>
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span className="font-semibold text-indigo-600">{partner.type}</span> • <MapPin className="h-3 w-3" /> {partner.city} {partner.website && <span>• <a href={`https://${partner.website}`} target="_blank" rel="noreferrer" className="hover:underline">{partner.website}</a></span>}
            </p>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="bg-white">
              <Edit className="h-4 w-4 mr-2" /> Edit Partner
            </Button>
            {partner.type !== 'Broker' && (
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Property
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: DETAILS */}
          <div className="space-y-6 md:col-span-1">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4" /> Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">Name</p>
                  <p className="font-semibold text-slate-900">{partner.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">Phone</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-400" /> {partner.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">Email</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-400" /> {partner.email || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Relationship Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">Partner Since</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-slate-400" /> {partner.since}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-0.5">Managed By</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <UserCircle2 className="h-3 w-3 text-slate-400" /> {partner.relationshipManager}
                  </p>
                </div>
                {partner.notes && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Notes</p>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100 text-sm text-slate-700">
                      {partner.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: PROPERTIES & ACTIVITY */}
          <div className="space-y-6 md:col-span-2">
            
            {partner.type !== 'Broker' && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Associated Properties
                  </CardTitle>
                  <Badge variant="secondary" className="rounded-full">{associatedProperties.length}</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {associatedProperties.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {associatedProperties.map(prop => (
                        <div key={prop.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 bg-indigo-50 rounded border border-indigo-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{prop.name}</h4>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{prop.micromarket}, {prop.city}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={prop.lifecycleStatus === 'Approved' ? 'success' : 'warning'} className="text-[10px]">
                              {prop.lifecycleStatus}
                            </Badge>
                            <Link href={`/supply/inventory/${prop.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No properties associated with this partner yet.</p>
                      <Button variant="link" className="mt-2" onClick={() => router.push('/supply/inventory/add')}>Add Property</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Activity Timeline
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-indigo-600">
                  <Plus className="h-3 w-3 mr-1" /> Log Activity
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                  {partner.activityHistory.length > 0 ? partner.activityHistory.map((activity, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 z-10 bg-indigo-50 text-indigo-600 shadow-sm shadow-slate-200">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-sm">{activity.action}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-slate-500 italic pl-8 py-2">No activity recorded.</div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
