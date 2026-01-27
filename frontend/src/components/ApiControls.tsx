"use client";

import {
    Activity,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Server,
    Shield,
    Clock,
    Database,
    Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ApiControls() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading tracking-tight text-slate-900 flex items-center gap-2">
                        <Server className="h-8 w-8 text-indigo-600" />
                        API Controls
                    </h2>
                    <p className="text-muted-foreground mt-1">Manage external GDS and supplier connections</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                        Systems Operational
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-md border-t-4 border-t-indigo-500">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Sabre GDS
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Connected</Badge>
                        </CardTitle>
                        <CardDescription>Primary Flight Provider</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Response Time</span>
                                <span className="font-medium text-slate-900">145ms</span>
                            </div>
                            <Progress value={20} className="h-1.5 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Error Rate</span>
                                <span className="font-medium text-emerald-600">0.02%</span>
                            </div>
                            <Progress value={2} className="h-1.5 bg-slate-100" />
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="w-full">Logs</Button>
                            <Button variant="outline" size="sm" className="w-full">Config</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Amadeus
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Connected</Badge>
                        </CardTitle>
                        <CardDescription>Secondary Flight Provider</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Response Time</span>
                                <span className="font-medium text-slate-900">210ms</span>
                            </div>
                            <Progress value={35} className="h-1.5 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Error Rate</span>
                                <span className="font-medium text-emerald-600">0.05%</span>
                            </div>
                            <Progress value={5} className="h-1.5 bg-slate-100" />
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="w-full">Logs</Button>
                            <Button variant="outline" size="sm" className="w-full">Config</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-t-4 border-t-amber-500">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            HotelBeds
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">Maintenance</Badge>
                        </CardTitle>
                        <CardDescription>Hotel Inventory</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-xs text-amber-800 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            Scheduled maintenance until 04:00 AM UTC. Search results may be limited.
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="w-full">Status Page</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Recent API Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                    <span className="font-mono text-slate-600">REQ_ID_882{i}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">Flight Search</span>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 230ms</span>
                                    <span>Just now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ApiControls;
