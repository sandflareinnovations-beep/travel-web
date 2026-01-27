"use client";

import { useState, useEffect } from 'react';
import {
    DollarSign,
    CreditCard,
    Users,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    RefreshCw,
    Globe,
    Plane,
    TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from "@/components/ui/badge";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const generateChartData = () => MONTHS.map(name => ({
    name,
    total: Math.floor(Math.random() * 150000) + 100000,
    bookings: Math.floor(Math.random() * 500) + 200
}));

const SERVICE_DATA = [
    { name: 'Flights', value: 65, color: 'bg-blue-500', amount: "SAR 575,400" },
    { name: 'Hotels', value: 20, color: 'bg-emerald-500', amount: "SAR 176,900" },
    { name: 'Car Rentals', value: 12, color: 'bg-amber-500', amount: "SAR 105,200" },
    { name: 'Visa & Services', value: 3, color: 'bg-purple-500', amount: "SAR 26,500" },
];

const MOCK_BOOKINGS = [
    { time: '09:42', route: 'RUH → LHR', airline: 'Saudia', flight: 'SV121', status: 'Confirmed', price: 'SAR 4,250' },
    { time: '10:15', route: 'JED → JFK', airline: 'Saudia', flight: 'SV020', status: 'Pending', price: 'SAR 6,800' },
    { time: '10:30', route: 'RUH → BOM', airline: 'Air India', flight: 'AI922', status: 'Confirmed', price: 'SAR 1,100' },
    { time: '11:05', route: 'DMM → CAI', airline: 'Flynas', flight: 'XY550', status: 'Confirmed', price: 'SAR 950' },
];

export function DashboardOverview() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [chartData, setChartData] = useState(generateChartData());
    const [stats, setStats] = useState({
        scaes: 38240,
        transactions: 142,
        activeStaff: 24,
        avgTicket: 1850
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate data fetch
        setTimeout(() => {
            setChartData(generateChartData());
            setStats({
                scaes: Math.floor(Math.random() * 20000) + 30000,
                transactions: Math.floor(Math.random() * 50) + 100,
                activeStaff: Math.floor(Math.random() * 10) + 20,
                avgTicket: Math.floor(Math.random() * 500) + 1500
            });
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Dashboard Overview</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4" /> Flyinco Admin Portal • Riyadh HQ
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground bg-white border px-3 py-1.5 rounded-md shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System Operational
                    </div>
                    <Button onClick={handleRefresh} disabled={isRefreshing} size="sm" className="shadow-md">
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Updating...' : 'Refresh Data'}
                    </Button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="h-24 w-24 transform translate-x-4 -translate-y-4" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Today's Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">SAR {stats.scaes.toLocaleString()}</div>
                        <p className="text-xs text-blue-100/80 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.transactions} <span className="text-xs font-normal text-muted-foreground">bookings</span></div>
                        <p className="text-xs text-muted-foreground mt-1 text-emerald-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> Volume High
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeStaff} <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] ml-1 align-top">Online</Badge></div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across Riyadh & Jeddah
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Ticket Value</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">SAR {stats.avgTicket.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on B2B rates
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Bar Chart Section */}
                <Card className="col-span-1 md:col-span-4 shadow-md border-none">
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly performance overview (SAR)</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Service Breakdown Section */}
                <Card className="col-span-1 md:col-span-3 shadow-md border-none">
                    <CardHeader>
                        <CardTitle>Service Mix</CardTitle>
                        <CardDescription>Sales distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {SERVICE_DATA.map((item, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${item.color}`} />
                                            <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                        </div>
                                        <div className="text-sm font-bold">{item.value}%</div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                    <div className="text-right mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-muted-foreground font-mono">{item.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Top Route</span>
                                <Badge variant="outline" className="text-[10px]">RUH - LHR</Badge>
                            </div>
                            <div className="mt-2 text-sm font-mono text-slate-600">
                                482 Pax this week
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section - Recent Bookings */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 lg:col-span-2 shadow-md border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-heading">Real-time Bookings</CardTitle>
                            <CardDescription>Live feed from GDS (Sabre/Amadeus)</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="animate-pulse bg-green-50 text-green-700 border-green-200">Live</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_BOOKINGS.map((booking, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <Plane className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{booking.route}</p>
                                            <p className="text-xs text-muted-foreground">{booking.airline} • {booking.flight}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold font-mono text-slate-700">{booking.price}</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-none bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-blue-100">Quick Actions</CardTitle>
                        <CardDescription className="text-blue-200/60">Common operational tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="secondary" className="w-full justify-start hover:bg-blue-50 hover:text-blue-900 transition-colors">
                            <Plane className="mr-2 h-4 w-4" /> Issue Ticket
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-blue-100 hover:text-white hover:bg-white/10">
                            <RefreshCw className="mr-2 h-4 w-4" /> Reissue / Exchange
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-blue-100 hover:text-white hover:bg-white/10">
                            <Globe className="mr-2 h-4 w-4" /> Check Visa Status
                        </Button>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-xs text-blue-200/50 mb-2">System Status</p>
                            <div className="flex items-center justify-between text-sm">
                                <span>Sabre API</span>
                                <span className="text-emerald-400">Online</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span>Payment Gateway</span>
                                <span className="text-emerald-400">Online</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardOverview;
