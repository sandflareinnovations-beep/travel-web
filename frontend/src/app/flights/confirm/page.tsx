"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, CreditCard, Loader2 } from 'lucide-react';

import { FlightService } from '@/services/flightService';

export default function ConfirmBookingPage() {
    const [itinerary, setItinerary] = React.useState<any>(null);

    useEffect(() => {
        // Feature: CreateItinerary
        const create = async () => {
            // Mock payload, needs real passenger/contact data
            const payload = {
                ClientID: "bitest", Source: "SF",
                Trips: [{ TUI: "mock-tui", Index: "0", OrderID: 1, Amount: 5000 }],
                Passenger: [], ContactInfo: {}, GSTInfo: {}
            };

            try {
                const data = await FlightService.createItinerary(payload);
                // Simulate delay
                setTimeout(() => setItinerary(data), 1500);
            } catch (e) {
                console.error(e);
                // Fallback for demo: Create a dummy itinerary so user isn't stuck
                setTimeout(() => setItinerary({
                    itineraryId: "DEMO-ITIN-" + Math.floor(Math.random() * 10000),
                    status: "Confirmed",
                    totalAmount: 500.00
                }), 1500);
            }
        };
        create();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Final Confirmation</h1>
                    <p className="text-slate-500 mt-2">Your itinerary is being generated. Please review and pay.</p>
                </div>

                <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8 text-center pt-8">
                        {itinerary ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-800">Itinerary Created</CardTitle>
                                <p className="text-slate-500 mt-2">Reference ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{itinerary.itineraryId}</span></p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-4">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <CardTitle className="text-xl font-bold text-slate-800">Generating Itinerary...</CardTitle>
                                <p className="text-slate-500 mt-2">Please wait while we secure your booking.</p>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                <span className="text-slate-600">Base Fare</span>
                                <span className="font-medium text-slate-900">$450.00</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                <span className="text-slate-600">Taxes & Fees</span>
                                <span className="font-medium text-slate-900">$50.00</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-lg font-bold text-slate-800">Total Amount</span>
                                <span className="text-2xl font-bold text-blue-600">$500.00</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
                        <Button
                            disabled={!itinerary}
                            onClick={() => window.location.href = '/flights/pay'}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 py-6 text-lg rounded-xl transition-all"
                        >
                            <CreditCard className="w-5 h-5 mr-2" /> Proceed to Payment
                        </Button>
                        <p className="text-xs text-center text-slate-400">
                            By proceeding, you agree to our Terms and Conditions.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
