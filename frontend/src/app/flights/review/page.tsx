"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { FlightService } from '@/services/flightService';
import { useSearchParams } from 'next/navigation';

export default function ReviewPage() {
    const [loading, setLoading] = useState(true);
    const [pricing, setPricing] = useState<any>(null);
    const [rules, setRules] = useState<any>(null);
    const searchParams = useSearchParams();
    const tui = searchParams.get('tui') || '';

    useEffect(() => {
        const fetchData = async () => {
            if (!tui) {
                // In real app, redirect back to results
                console.warn("No TUI provided");
                setLoading(false);
                return;
            }
            try {
                // Feature: SmartPricer - We trigger pricing then get details
                // Or just get details if already priced. 
                // For demo, we just call getSmartPricerDetails with TUI
                const priceRes = await FlightService.getSmartPricerDetails({ TUI: tui });
                setPricing(priceRes);

                // Feature: FareRule
                // Payload needs constructing, using dummy for now
                const ruleRes = await FlightService.getFareRules({
                    Trips: [{ TUI: tui, Index: "0", OrderID: 1, Amount: 0 }],
                    ClientID: "bitest", Mode: "SY", Options: "", Source: "LV", TripType: "ON"
                });
                setRules(ruleRes);
            } catch (error) {
                console.error("Failed to fetch review data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tui]);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Your Itinerary</h1>
                    <p className="text-slate-500 mt-2">Please check your flight details before proceeding.</p>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
                        <div className="h-24 bg-white rounded-2xl shadow-sm"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800 flex items-center justify-between">
                                    <span>Trip Summary</span>
                                    <span className="text-xs font-normal px-3 py-1 bg-green-100 text-green-700 rounded-full">Confirmed Availability</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                                    <div className="text-center md:text-left">
                                        <p className="text-2xl font-bold text-slate-800">TRV</p>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Thiruvananthapuram</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center px-4">
                                        <p className="text-xs text-slate-400 font-medium mb-1">1h 55m</p>
                                        <div className="w-full h-[2px] bg-slate-200 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Non-stop</p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="text-2xl font-bold text-slate-800">DXB</p>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Dubai</p>
                                    </div>
                                </div>

                                {pricing && (
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-900">
                                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Smart Pricing Applied
                                        </h4>
                                        <pre className="text-xs text-blue-800/80 whitespace-pre-wrap font-mono mt-2 bg-blue-100/50 p-2 rounded">{JSON.stringify(pricing, null, 2)}</pre>
                                    </div>
                                )}
                                {rules && (
                                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-sm text-gray-700">
                                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-500"></span> Fare Rules
                                        </h4>
                                        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(rules, null, 2)}</pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between pt-4">
                            <Button variant="ghost" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800">
                                Back to Results
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/flights/passenger'}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-8 py-6 text-lg rounded-xl transition-transform hover:-translate-y-1"
                            >
                                Continue to Passengers
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
