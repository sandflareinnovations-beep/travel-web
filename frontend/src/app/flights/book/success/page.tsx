"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, Plane, ArrowLeft, SeparatorHorizontal as Separator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useFlightStore } from '@/store/useFlightStore';

export default function BookingSuccessPage() {
    const router = useRouter();
    const { selectedFlight } = useFlightStore();
    const [bookingData, setBookingData] = useState<any>(null);

    useEffect(() => {
        const data = sessionStorage.getItem('lastBooking');

        // Use store flight if available, else check session (legacy fallback)
        const currentFlight = selectedFlight || (sessionStorage.getItem('selectedFlight') ? JSON.parse(sessionStorage.getItem('selectedFlight')!) : null);

        if (!data || !currentFlight) {
            // If no data, maybe redirect home or show error
            // setStatus('error');
            return;
        }

        try {
            setBookingData({
                ...JSON.parse(data),
                flight: currentFlight
            });
        } catch (e) {
            console.error("Failed to parse booking data", e);
        }
    }, [selectedFlight]);

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <p>Loading booking details...</p>
            </div>
        );
    }

    const { pnr, email, passengers, flight } = bookingData;

    const formatTime = (dateTime: string) => {
        if (!dateTime) return 'N/A';
        const time = dateTime.includes('T') ? dateTime.split('T')[1] : dateTime;
        return time.substring(0, 5);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                <div className="bg-emerald-500 p-6 flex flex-col items-center justify-center text-white">
                    <CheckCircle className="h-16 w-16 mb-2 text-white/90" />
                    <h2 className="text-3xl font-bold">Booking Confirmed</h2>
                    <p className="text-emerald-100 font-mono tracking-widest mt-1">PNR: {pnr}</p>
                </div>
                <CardContent className="p-8 space-y-8">
                    <div className="text-center">
                        <p className="text-slate-500 mb-1">E-tickets sent to</p>
                        <p className="font-semibold text-lg text-slate-800">{email}</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                    <Plane className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{flight.AirlineName?.split('|')[0] || 'Airline'}</p>
                                    <p className="text-xs text-slate-400">{flight.FlightNo} • Economy</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Date</p>
                                <p className="font-bold text-slate-800">{flight.DepartureTime?.split('T')[0]}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-3xl font-bold text-slate-800">{flight.From}</p>
                                <p className="text-xs text-slate-400">{formatTime(flight.DepartureTime)}</p>
                            </div>
                            <div className="flex flex-col items-center px-4 flex-1">
                                <div className="w-full h-px bg-slate-300 relative">
                                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-slate-50 rotate-90 text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-400 mt-2">{flight.Duration}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-800">{flight.To}</p>
                                <p className="text-xs text-slate-400">{formatTime(flight.ArrivalTime)}</p>
                            </div>
                        </div>

                        <hr className="mb-4 border-slate-200" />

                        <div className="space-y-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Passengers</p>
                            {passengers?.map((p: any) => (
                                <p key={p.id} className="text-sm font-medium text-slate-700">
                                    {p.title} {p.firstName} {p.lastName}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
