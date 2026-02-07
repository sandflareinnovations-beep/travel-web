"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Ban, Calendar, Clock, Plane, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BookingDetailsPage() {
    const [booking, setBooking] = React.useState<any>(null);

    useEffect(() => {
        // Feature: RetrieveBooking
        fetch('http://localhost:3001/flights/booking')
            .then(res => res.json())
            .then(data => setBooking(data))
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-800 mb-2 md:mb-0" onClick={() => window.location.href = '/'}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Booking</h1>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => window.location.href = '/flights/cancel'}
                        className="shadow-lg shadow-red-500/20"
                    >
                        <Ban className="mr-2 h-4 w-4" /> Cancel Booking
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Booking Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardDescription>Booking Reference</CardDescription>
                                        <CardTitle className="text-2xl font-mono font-bold text-slate-800">{booking?.bookingId || 'Loading...'}</CardTitle>
                                    </div>
                                    <Badge className={`${booking?.status === 'Confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700'}`}>
                                        {booking?.status || 'Loading...'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Plane className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">Thiruvananthapuram (TRV) → Dubai (DXB)</p>
                                            <p className="text-sm text-slate-500">Oman Air • WY212 • Economy</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Date</p>
                                            <p className="font-medium text-slate-800">13 Aug 2025</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</p>
                                            <p className="font-medium text-slate-800">1h 55m</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <User className="h-5 w-5 text-slate-500" /> Passenger Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800">John Doe</p>
                                            <p className="text-xs text-slate-500">Adult</p>
                                        </div>
                                        <p className="text-sm text-slate-500">Seat 1A</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Actions */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800">Payment Info</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Paid</span>
                                        <span className="font-bold text-slate-800">$500.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Card</span>
                                        <span className="text-slate-800">**** 4242</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg bg-blue-600 text-white rounded-2xl overflow-hidden p-6">
                            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                            <p className="text-blue-100 text-sm mb-4">Contact our support team 24/7 for any changes to your itinerary.</p>
                            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none shadow-sm">
                                Contact Support
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
