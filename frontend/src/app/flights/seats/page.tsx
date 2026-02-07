"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Armchair } from 'lucide-react';

import { FlightService } from '@/services/flightService';

export default function SeatSelectionPage() {
    const [layout, setLayout] = React.useState<any>(null);
    const [selectedSeat, setSelectedSeat] = React.useState<number | null>(null);

    useEffect(() => {
        // Feature: SeatLayout
        const fetchSeats = async () => {
            // Mock payload
            const payload = {
                ClientID: "bitest", Source: "SF",
                Trips: [{ TUI: "mock-tui", Index: "0", OrderID: 1, Amount: 5000 }]
            };
            try {
                const data = await FlightService.getSeatLayout(payload);
                // Map API response to Component expectation
                // API returns { Segments: [ { Rows: [...] } ] }
                // Component expects { cols: 6, rows: ... } for grid
                // We'll mock the grid config if API returns valid segments
                if (data && data.Segments) {
                    // For demo purposes, we set a fixed grid, assuming 3-3 (6 cols)
                    // In reality we'd parse data.Segments[0].Rows to build the map
                    setLayout({ cols: 6, rows: 30 });
                }
            } catch (e) {
                console.error(e);
                // Fallback for demo purposes
                setLayout({ cols: 6, rows: 30 });
            } finally {
                // Fallback if layout is still null
                setLayout((prev: any) => prev || { cols: 6, rows: 30 });
            }
        };
        fetchSeats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Select Your Seat</h1>
                    <p className="text-slate-500 mt-2">Choose your preferred seat on the aircraft.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Legend & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6 border-none shadow-lg bg-white rounded-2xl">
                            <h3 className="font-bold text-slate-800 mb-4">Legend</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200"></div>
                                    <span className="text-sm text-slate-600">Available</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 border-2 border-blue-600 text-white flex items-center justify-center">
                                        <Armchair className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-slate-600">Selected</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 border-2 border-slate-100 opacity-50 cursor-not-allowed"></div>
                                    <span className="text-sm text-slate-600">Occupied</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-none shadow-lg bg-white rounded-2xl">
                            <h3 className="font-bold text-slate-800 mb-2">Selected Seat</h3>
                            {selectedSeat !== null ? (
                                <div className="text-center py-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-3xl font-bold text-blue-600 mb-1">{(selectedSeat % 6) + 1}{String.fromCharCode(65 + Math.floor(selectedSeat / 6))}</p>
                                    <p className="text-xs text-blue-400 uppercase font-semibold">Economy Class</p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No seat selected</p>
                            )}
                        </Card>
                    </div>

                    {/* Seat Map */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem] relative overflow-hidden min-h-[500px]">
                            {/* Cockpit / Front indication */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-100/50 to-transparent rounded-t-[2.5rem] pointer-events-none"></div>

                            {layout ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-b-2xl mb-12 flex items-center justify-center text-slate-400">
                                        Front
                                    </div>

                                    <div className="grid gap-x-4 gap-y-4" style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))` }}>
                                        {/* Aisle Spacer Logic - assuming 3-3 configuration for 6 cols */}
                                        {Array.from({ length: layout.cols * 6 }).map((_, i) => {
                                            const colIndex = i % layout.cols;
                                            // Add aisle gap visualization logic if needed, simplify for now
                                            const isSelected = selectedSeat === i;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedSeat(i)}
                                                    className={`
                                                        w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 flex items-center justify-center
                                                        ${isSelected
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                                            : 'bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-400 hover:text-blue-500'}
                                                    `}
                                                >
                                                    <Armchair className="w-5 h-5 md:w-6 md:h-6" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-slate-500">Loading seat map configuration...</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-8 pb-12">
                    <Button variant="ghost" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-800">
                        Back
                    </Button>
                    <Button
                        disabled={selectedSeat === null}
                        onClick={() => window.location.href = '/flights/confirm'}
                        className={`
                            px-8 py-6 text-lg rounded-xl transition-all duration-300
                            ${selectedSeat !== null
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-1'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        Confirm Selection
                    </Button>
                </div>
            </div>
        </div>
    );
}
