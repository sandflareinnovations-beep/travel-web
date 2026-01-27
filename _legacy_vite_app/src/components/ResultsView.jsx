import React from 'react';
import { CheckCircle } from 'lucide-react';

const ResultsView = () => {
    const results = [
        { id: 1, airline: 'Emirates', airlineCode: 'EK', flightNo: 'EK501', dep: '10:00', arr: '14:30', duration: '4h 30m', price: 450, seats: 9, stops: 0 },
        { id: 2, airline: 'British Airways', airlineCode: 'BA', flightNo: 'BA105', dep: '11:15', arr: '16:00', duration: '4h 45m', price: 420, seats: 5, stops: 0 },
        { id: 3, airline: 'Lufthansa', airlineCode: 'LH', flightNo: 'LH772', dep: '09:30', arr: '15:45', duration: '6h 15m', price: 380, seats: 12, stops: 1 },
    ];

    return (
        <div className="container px-6 pb-20 fade-in" style={{ paddingTop: '2rem' }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Search Results</h2>
                <div className="flex gap-4">
                    {/* Filters placeholders */}
                    <button className="btn btn-outline py-2 px-4 text-sm" style={{ padding: '0.5rem 1rem' }}>Filter by Airline</button>
                    <button className="btn btn-outline py-2 px-4 text-sm" style={{ padding: '0.5rem 1rem' }}>Sort by Price</button>
                </div>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: '3fr 1fr' }}>
                {/* Results List */}
                <div className="flex flex-col gap-4">
                    {results.map((res) => (
                        <div key={res.id} className="glass-panel p-0 rounded-lg overflow-hidden transition-all flex items-center bg-white" style={{ background: 'white', display: 'flex', alignItems: 'stretch' }}>

                            {/* Airline Info */}
                            <div className="p-6 border-r border-slate-100" style={{ width: '20%', borderRight: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-secondary" style={{ width: '32px', height: '32px', background: 'var(--bg-input)' }}>
                                        {res.airlineCode}
                                    </div>
                                    <span className="font-semibold text-slate-800">{res.airline}</span>
                                </div>
                                <div className="text-xs text-muted flex items-center gap-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded" style={{ background: 'var(--bg-input)' }}>{res.flightNo}</span>
                                    <span>A380-800</span>
                                </div>
                            </div>

                            {/* Flight Details */}
                            <div className="p-6 flex-1 flex items-center justify-between" style={{ flex: 1, padding: '1.5rem' }}>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-slate-800">{res.dep}</div>
                                    <div className="text-xs text-muted">DXB</div>
                                </div>

                                <div className="flex-1 px-6 flex flex-col items-center" style={{ padding: '0 1.5rem' }}>
                                    <div className="text-xs text-muted mb-1">{res.duration}</div>
                                    <div className="relative w-full" style={{ height: '2px', background: 'var(--border)', position: 'relative', width: '100%' }}>
                                        <div className="absolute rounded-full border border-slate-300 bg-white" style={{ top: '-4px', left: '0', width: '10px', height: '10px', background: 'white', border: '2px solid var(--border)' }}></div>
                                        <div className="absolute rounded-full border border-slate-300 bg-white" style={{ top: '-4px', right: '0', width: '10px', height: '10px', background: 'white', border: '2px solid var(--border)' }}></div>
                                        {res.stops > 0 && (
                                            <div className="absolute rounded-full bg-slate-300" style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '10px', background: 'var(--border)' }}></div>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted mt-2">{res.stops === 0 ? 'Non-stop' : `${res.stops} Stop`}</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xl font-bold text-slate-800">{res.arr}</div>
                                    <div className="text-xs text-muted">LHR</div>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="p-6 border-l border-slate-100 bg-slate-50 flex flex-col items-end justify-center" style={{ width: '25%', borderLeft: '1px solid var(--border)', background: '#F8FAFC' }}>
                                <div className="text-2xl font-bold text-primary mb-1" style={{ color: 'var(--primary)' }}>${res.price}</div>
                                <div className="text-xs text-muted mb-4 opacity-80">+ $45 Taxes</div>

                                <button className="btn btn-primary w-full py-2 text-sm">
                                    Book Now
                                </button>
                                <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1" style={{ color: 'var(--success)' }}>
                                    {res.seats} Seats Left
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Filters Panel/Logs */}
                <div className="">
                    <div className="glass-panel p-4 rounded-lg sticky top-24" style={{ top: '100px', padding: '1.5rem' }}>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>API Response Stats</h3>

                        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Status</span>
                                <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--success)' }}>
                                    <CheckCircle size={14} /> 200 OK
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Latency</span>
                                <span className="font-medium text-slate-800">1.24s</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Source</span>
                                <span className="font-medium text-blue-600" style={{ color: 'var(--primary)' }}>Benzy</span>
                            </div>

                            <div className="mt-4 pt-4 border-t" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <div className="text-xs font-mono p-3 rounded overflow-x-auto" style={{ background: '#0f172a', color: '#4ade80', borderRadius: '6px' }}>
                                    {`{"status": "success", "count": 3 ...}`}
                                </div>
                                <button className="text-xs mt-2 hover:underline w-full text-center" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>View Full Log</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ResultsView;
