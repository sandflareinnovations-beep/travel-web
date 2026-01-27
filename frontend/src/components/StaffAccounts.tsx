"use client";

import {
    Users,
    Mail,
    Phone,
    MapPin,
    Shield,
    MoreVertical,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STAFF_DATA = [
    {
        id: 'EMP001',
        name: 'Ahmed Al-Sayed',
        role: 'Senior Travel Agent',
        email: 'ahmed.s@flyinco.com',
        phone: '+966 50 123 4567',
        location: 'Riyadh HQ',
        status: 'Active',
        department: 'Corporate Sales'
    },
    {
        id: 'EMP002',
        name: 'Sarah Rahman',
        role: 'Booking Manager',
        email: 'sarah.r@flyinco.com',
        phone: '+966 55 987 6543',
        location: 'Jeddah Branch',
        status: 'Active',
        department: 'Operations'
    },
    {
        id: 'EMP003',
        name: 'Mohammed Ali',
        role: 'Support Specialist',
        email: 'm.ali@flyinco.com',
        phone: '+966 54 555 1212',
        location: 'Remote',
        status: 'Away',
        department: 'Customer Support'
    },
    {
        id: 'EMP004',
        name: 'Fatima Hassan',
        role: 'Finance Officer',
        email: 'fatima.h@flyinco.com',
        phone: '+966 56 444 3322',
        location: 'Riyadh HQ',
        status: 'Active',
        department: 'Finance'
    },
    {
        id: 'EMP005',
        name: 'Omar Khalid',
        role: 'System Admin',
        email: 'omar.k@flyinco.com',
        phone: '+966 59 777 8899',
        location: 'Dammam Branch',
        status: 'Offline',
        department: 'IT'
    }
];

export function StaffAccounts() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading tracking-tight text-slate-900">Staff Accounts</h2>
                    <p className="text-muted-foreground mt-1">Manage employee access and profiles</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Staff
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search staff by name, email or role..."
                                className="pl-9 bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Filter</Button>
                            <Button variant="outline" size="sm">Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3 hidden md:table-cell">Role & Dept</th>
                                    <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                                    <th className="px-4 py-3 hidden lg:table-cell">Location</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {STAFF_DATA.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {staff.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{staff.name}</div>
                                                    <div className="text-xs text-muted-foreground">{staff.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="text-slate-900">{staff.role}</div>
                                            <div className="text-xs text-slate-500">{staff.department}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Mail className="h-3 w-3" /> {staff.email}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-500 mt-0.5 text-xs">
                                                <Phone className="h-3 w-3" /> {staff.phone}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <MapPin className="h-3 w-3" /> {staff.location}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className={`
                                                ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${staff.status === 'Away' ? 'bg-amber-100 text-amber-700' : ''}
                                                ${staff.status === 'Offline' ? 'bg-slate-100 text-slate-600' : ''}
                                                border-none
                                            `}>
                                                {staff.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default StaffAccounts;
