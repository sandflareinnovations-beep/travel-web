"use client";

import {
    Building2,
    FileText,
    DollarSign,
    Calendar,
    MoreHorizontal,
    ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_CLIENTS = [
    {
        name: 'TechCorp Solutions',
        bookings: 145,
        revenue: 'SAR 125,000',
        growth: '+12%'
    },
    {
        name: 'Global Industries',
        bookings: 89,
        revenue: 'SAR 98,500',
        growth: '+8%'
    },
    {
        name: 'Innovate LLC',
        bookings: 76,
        revenue: 'SAR 87,200',
        growth: '+15%'
    },
    {
        name: 'Future Systems',
        bookings: 65,
        revenue: 'SAR 72,800',
        growth: '+5%'
    }
];

export function CorporateAccounts() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Corporate Accounts</h2>
                <p className="text-muted-foreground mt-1">Manage corporate client accounts and their travel arrangements</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">247</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">189</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">SAR 2.4M</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +15% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Bookings This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1,847</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +22% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Corporate Clients List */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Top Corporate Clients</CardTitle>
                    <CardDescription>Highest value accounts by monthly bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {MOCK_CLIENTS.map((client, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100 gap-2 sm:gap-0"
                            >
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{client.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{client.bookings} bookings this month</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-sm font-bold font-mono text-slate-900">{client.revenue}</p>
                                    <p className="text-xs text-emerald-600 font-medium flex items-center justify-start sm:justify-end">
                                        {client.growth}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CorporateAccounts;
