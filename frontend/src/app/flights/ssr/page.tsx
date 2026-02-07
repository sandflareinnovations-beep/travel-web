"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Luggage, Utensils, Accessibility, Sparkles } from 'lucide-react';

import { FlightService } from '@/services/flightService';

export default function SSRPage() {
    const [options, setOptions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        // Feature: SSR
        const fetchSSR = async () => {
            // Mock payload, should come from context
            const payload = {
                PaidSSR: false, ClientID: 'bitest', Source: 'LV', FareType: 'N',
                Trips: [{ Amount: 5000, Index: "0", OrderID: 1, TUI: "mock-tui" }]
            };
            try {
                const data = await FlightService.getSSR(payload);
                // Check if data.SSROptions exists and map keys to list for demo
                if (data && data.SSROptions) {
                    const keys = Object.keys(data.SSROptions);
                    // Or flatten values: meals, etc.
                    // The original code expected a list of strings 'services'
                    // We'll just push keys for now: 'Meals', 'Baggage'
                    setOptions(keys);
                }
            } catch (e) {
                console.error(e);
                // Fallback for demo purposes if API fails (likely due to mock TUI)
                setOptions(['Meal Preference', 'Extra Baggage', 'Wheelchair Assistance', 'Priority Boarding']);
            } finally {
                // If options are still empty after API call (e.g. invalid TUI), show mock data for UI demo
                setOptions(prev => prev.length > 0 ? prev : ['Meal Preference', 'Extra Baggage', 'Wheelchair Assistance', 'Priority Boarding']);
                setIsLoading(false);
            }
        };
        fetchSSR();
    }, []);

    // Helper to get icon based on keyword
    const getIcon = (text: string) => {
        const t = text.toLowerCase();
        if (t.includes('meal')) return <Utensils className="h-5 w-5 text-orange-500" />;
        if (t.includes('wheelchair') || t.includes('assistance')) return <Accessibility className="h-5 w-5 text-blue-500" />;
        if (t.includes('baggage')) return <Luggage className="h-5 w-5 text-purple-500" />;
        return <Sparkles className="h-5 w-5 text-slate-500" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Special Services</h1>
                    <p className="text-slate-500 mt-2">Customize your journey with extra services.</p>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Available Services</CardTitle>
                            <CardDescription>Select any additional services you require.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-slate-500">Loading available services...</p>
                                </div>
                            ) : options.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {options.map((opt, i) => (
                                        <label
                                            key={i}
                                            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                        >
                                            <Checkbox id={`ssr-${i}`} className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                                    {getIcon(opt)}
                                                </div>
                                                <div className="font-medium text-slate-700">{opt}</div>
                                            </div>
                                            <div className="text-sm text-slate-400">Optional</div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-500">No special services available for this flight.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between pt-4">
                        <Button variant="ghost" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800">
                            Back
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/flights/seats'}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-8 py-6 text-lg rounded-xl transition-transform hover:-translate-y-1"
                        >
                            Continue to Seat Selection
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
