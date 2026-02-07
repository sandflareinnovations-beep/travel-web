"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Plane, User, Calendar, Ticket, Download,
    ArrowLeft, Loader2, CheckCircle, Printer, Clock,
    ShieldCheck, CreditCard, ChevronRight, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { flightApi } from '@/lib/api';

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const transactionId = params?.id;

    useEffect(() => {
        if (transactionId) {
            fetchBooking();
        }
    }, [transactionId]);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const clientId = flightApi.getStoredClientId();
            if (!clientId) throw new Error("Client ID not found");

            const data = await flightApi.retrieveBooking(Number(transactionId), clientId);
            setBooking(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Loading State
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Retrieving secure ticket data...</p>
        </div>
    );

    // 2. Error/Not Found State
    if (!booking || (booking.Code !== "200" && booking.Msg?.[0] !== "Success")) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
                <Ticket className="h-12 w-12 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Booking Not Found</h2>
                <p className="text-slate-500 mt-2">The requested transaction ID might be invalid or still processing.</p>
                <Button onClick={() => router.push('/')} className="mt-6 bg-slate-900 rounded-xl">Back to Home</Button>
            </div>
        );
    }

    // 3. Data Extraction (Safe Access)
    const trip = booking?.Trips?.[0]?.Journey?.[0]?.Segments?.[0];
    const departureDate = trip?.Flight?.DepartureTime ? new Date(trip.Flight.DepartureTime) : new Date();
    const arrivalDate = trip?.Flight?.ArrivalTime ? new Date(trip.Flight.ArrivalTime) : new Date();
    const baggageInfo = booking?.SSR?.find((s: any) => s.Code === "BAG")?.Description || "15Kg Check-in, 7Kg Cabin";

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 print:p-0 print:bg-white">
            <div className="max-w-4xl mx-auto">

                {/* Top Toolbar (Hidden on Print) */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-slate-600">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => window.print()} className="rounded-xl bg-white border-slate-200">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                    </div>
                </div>

                {/* MAIN TICKET CARD */}
                <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white border-slate-100 ring-1 ring-slate-100">

                    {/* Header Section */}
                    <div className="bg-slate-900 p-8 md:p-14 text-white relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-500" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-3">
                                <Badge className="bg-emerald-500 text-white border-none px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                    <ShieldCheck className="w-3 h-3 mr-2" /> Confirmed
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase flex items-center gap-4">
                                    {booking?.From} <Plane className="h-8 w-8 text-slate-600 rotate-45" /> {booking?.To}
                                </h1>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{booking?.FromName?.split('|')[0]}</p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 text-center min-w-[180px]">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Airline PNR</p>
                                <p className="text-5xl font-mono font-black text-orange-400 tracking-tighter">{trip?.Flight?.APNR || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-8 md:p-14">
                        {/* Flight Info Card */}
                        <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="text-center md:text-left">
                                    <p className="text-5xl font-black text-slate-900">{departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="font-black text-blue-600 text-lg uppercase">{booking?.From}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{departureDate.toDateString()}</p>
                                    <Badge variant="secondary" className="mt-4 bg-white text-slate-400 border-slate-100">Terminal {trip?.Flight?.DepartureTerminal || '1'}</Badge>
                                </div>

                                <div className="flex-1 flex flex-col items-center px-6">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{trip?.Duration || 'Direct'}</span>
                                    <div className="w-full h-px border-t border-dashed border-slate-300 relative">
                                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 bg-white p-1" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-900 mt-4 uppercase">
                                        {trip?.Flight?.Airline?.split('|')[0]} <span className="text-slate-400 ml-1">#{trip?.Flight?.FlightNo}</span>
                                    </p>
                                </div>

                                <div className="text-center md:text-right">
                                    <p className="text-5xl font-black text-slate-900">{arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="font-black text-blue-600 text-lg uppercase">{booking?.To}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{arrivalDate.toDateString()}</p>
                                    <Badge variant="secondary" className="mt-4 bg-white text-slate-400 border-slate-100">Terminal {trip?.Flight?.ArrivalTerminal || '1'}</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" /> Passenger Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {booking?.Pax?.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-bold text-white">0{i + 1}</div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase text-sm">{p.Title} {p.FName} {p.LName}</p>
                                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Confirmed • {p.PTC}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-600" /> Baggage
                                </h3>
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Check-in</span>
                                        <span className="text-sm font-black text-blue-900">{baggageInfo.split(',')[0]}</span>
                                    </div>
                                    <Separator className="bg-blue-100" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Cabin</span>
                                        <span className="text-sm font-black text-blue-900">{baggageInfo.split(',')[1] || "7 Kg"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary Section */}
                        <div className="mt-12 bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Base Fare</span>
                                        <span>₹{(booking?.TotalBaseFare || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Taxes & Fees</span>
                                        <span>₹{(booking?.TotalTax || 0).toLocaleString()}</span>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Paid Amount</p>
                                            <p className="text-5xl font-black tracking-tighter text-white">₹{(booking?.GrossAmount || 0).toLocaleString()}</p>
                                        </div>
                                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 hidden md:block">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">Fare Rules</p>
                                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                                        Cancellation: ₹3,000 charge applies per passenger. <br />
                                        Date Change: ₹2,500 + Fare difference.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Print Info */}
                <div className="hidden print:block mt-10 text-[9px] text-slate-400 text-center space-y-2">
                    <p className="font-bold uppercase tracking-[0.2em]">Electronic Ticket Receipt</p>
                    <p>Transaction ID: {booking?.TransactionID} | Booking Date: {booking?.BookingDate}</p>
                    <p>Generated by Benzy Travel Portal. All times shown are local to the airport.</p>
                </div>
            </div>
        </div>
    );
}