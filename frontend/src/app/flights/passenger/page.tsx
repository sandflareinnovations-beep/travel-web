"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, User } from 'lucide-react';

export default function PassengerPage() {
    const [checklist, setChecklist] = React.useState<string[]>([]);

    useEffect(() => {
        // Feature: GetTravelCheckList
        fetch('http://localhost:3001/flights/checklist')
            .then(res => res.json())
            .then(data => setChecklist(data.checklist || []))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Passenger Details</h1>
                    <p className="text-slate-500 mt-2">Enter the details of the travelers.</p>
                </div>

                <div className="space-y-6">
                    {/* Passenger Form Card */}
                    <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-800">Adult 1</CardTitle>
                                    <CardDescription>Primary Passenger</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-slate-600">First Name</Label>
                                    <Input
                                        type="text"
                                        id="firstName"
                                        placeholder="e.g. John"
                                        className="h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-slate-600">Last Name</Label>
                                    <Input
                                        type="text"
                                        id="lastName"
                                        placeholder="e.g. Doe"
                                        className="h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob" className="text-slate-600">Date of Birth</Label>
                                    <Input
                                        type="date"
                                        id="dob"
                                        className="h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passport" className="text-slate-600">Passport Number</Label>
                                    <Input
                                        type="text"
                                        id="passport"
                                        placeholder="A12345678"
                                        className="h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Travel Checklist Card */}
                    <Card className="border-none shadow-md bg-yellow-50/50 rounded-2xl overflow-hidden border border-yellow-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Travel Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <ul className="space-y-2">
                                {checklist.length > 0 ? checklist.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-yellow-900/80">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
                                        {item}
                                    </li>
                                )) : (
                                    <li className="text-sm text-yellow-700 italic">Loading checklist requirements...</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between pt-4">
                        <Button variant="ghost" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800">
                            Back
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/flights/ssr'}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-8 py-6 text-lg rounded-xl transition-transform hover:-translate-y-1"
                        >
                            Continue to Services
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
