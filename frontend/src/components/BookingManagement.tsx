"use client";

import { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Plane,
    Bed,
    Car,
    FileText,
    ArrowUpRight,
    Plus,
    ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookingHeroSection from './BookingHeroSection';
import FlightSearchCard from './FlightSearchCard';
import HotelSearchCard from './HotelSearchCard';
import CarSearchCard from './CarSearchCard';
import VisaSearchCard from './VisaSearchCard';

type BookingType = 'flight' | 'hotel' | 'car' | 'visa';

interface BookingManagementProps {
    type: BookingType;
}

const MOCK_DATA = {
    flight: [
        { id: 'FLT-1024', customer: 'TechCorp', item: 'RUH → JED', date: '12 Jan 2026', amount: 'SAR 1,250', status: 'Confirmed', provider: 'Saudia' },
        { id: 'FLT-1025', customer: 'Global Ind', item: 'RUH → LHR', date: '15 Jan 2026', amount: 'SAR 4,500', status: 'Pending', provider: 'British Airways' },
        { id: 'FLT-1026', customer: 'Private Client', item: 'DMM → DXB', date: '18 Jan 2026', amount: 'SAR 980', status: 'Confirmed', provider: 'Flynas' },
        { id: 'FLT-1027', customer: 'Innovate LLC', item: 'JED → CAI', date: '22 Jan 2026', amount: 'SAR 1,100', status: 'Cancelled', provider: 'Saudia' },
    ],
    hotel: [
        { id: 'HTL-5501', customer: 'TechCorp', item: 'Ritz Carlton Riyadh', date: '12-14 Jan', amount: 'SAR 3,800', status: 'Confirmed', provider: 'HotelBeds' },
        { id: 'HTL-5502', customer: 'Walk-in', item: 'Hilton Jeddah', date: '20 Jan', amount: 'SAR 950', status: 'Confirmed', provider: 'Expedia' },
    ],
    car: [
        { id: 'CAR-9001', customer: 'Global Ind', item: 'Toyota Camry', date: '12 Jan (3 Days)', amount: 'SAR 600', status: 'Active', provider: 'Budget' },
    ],
    visa: [
        { id: 'VIS-3001', customer: 'Innovate LLC', item: 'UK Business Visa', date: '10 Jan', amount: 'SAR 2,500', status: 'Processing', provider: 'Gov.uk' },
    ]
};

const ICONS = {
    flight: Plane,
    hotel: Bed,
    car: Car,
    visa: FileText
};

const TITLES = {
    flight: 'Flight Bookings',
    hotel: 'Hotel Reservations',
    car: 'Car Rentals',
    visa: 'Visa Management'
};

const STATUS_STYLES: Record<string, string> = {
    'Confirmed': 'bg-emerald-100 text-emerald-700',
    'Active': 'bg-emerald-100 text-emerald-700',
    'Pending': 'bg-blue-100 text-blue-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-slate-100 text-slate-500 line-through'
};

const [isCreating, setIsCreating] = useState(false);
const Icon = ICONS[type];
const data = MOCK_DATA[type];

const renderSearchCard = () => {
    switch (type) {
        case 'flight': return <FlightSearchCard />;
        case 'hotel': return <HotelSearchCard />;
        case 'car': return <CarSearchCard />;
        case 'visa': return <VisaSearchCard />;
        default: return <div>Component not found</div>;
    }
};

return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold font-heading tracking-tight text-slate-900 flex items-center gap-2">
                    <Icon className="h-8 w-8 text-blue-600" />
                    {TITLES[type]}
                </h2>
                <p className="text-muted-foreground mt-1">
                    Track and manage all {type} requests
                </p>
            </div>
            <div className="flex gap-2">
                {isCreating ? (
                    <Button
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                        className="text-slate-600 border-slate-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                ) : (
                    <>
                        <Button variant="outline" className="text-slate-600 border-slate-300">
                            Export Report
                        </Button>
                        <Button
                            onClick={() => setIsCreating(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Booking
                        </Button>
                    </>
                )}
            </div>
        </div>

        {isCreating ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                {renderSearchCard()}
            </div>
        ) : (
            <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Total</span>
                        <div className="text-2xl font-bold mt-1">1,248</div>
                        <span className="text-xs text-emerald-600 flex items-center mt-2"><ArrowUpRight className="h-3 w-3 mr-1" /> +12%</span>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Pending</span>
                        <div className="text-2xl font-bold mt-1 text-blue-600">42</div>
                        <span className="text-xs text-muted-foreground mt-2">Requires action</span>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Confirmed</span>
                        <div className="text-2xl font-bold mt-1 text-emerald-600">895</div>
                        <span className="text-xs text-muted-foreground mt-2">This month</span>
                    </Card>
                    <Card className="p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs text-muted-foreground font-semibold uppercase">Value</span>
                        <div className="text-2xl font-bold mt-1">SAR 1.2M</div>
                        <span className="text-xs text-emerald-600 flex items-center mt-2"><ArrowUpRight className="h-3 w-3 mr-1" /> +8%</span>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search bookings..." className="pl-9 bg-slate-50 border-slate-200" />
                            </div>
                            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-slate-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Booking ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Details</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">{item.id}</td>
                                            <td className="px-4 py-3 text-slate-600">{item.customer}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-800">{item.item}</div>
                                                <div className="text-xs text-slate-500">{item.provider}</div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{item.date}</td>
                                            <td className="px-4 py-3 font-medium font-mono">{item.amount}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary" className={`border-none ${STATUS_STYLES[item.status] || 'bg-slate-100'}`}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </>
        )}
    </div>
);
}

