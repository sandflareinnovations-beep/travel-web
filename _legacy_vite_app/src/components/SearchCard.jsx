import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Settings, Activity, Code, DollarSign, Clock } from 'lucide-react';

const SearchCard = ({ onSearch }) => {
    const [tripType, setTripType] = useState('round-trip');
    const [passengers, setPassengers] = useState(1);
    const [cabinClass, setCabinClass] = useState('economy');
    const [advancedMode, setAdvancedMode] = useState(false);

    // Mock State
    const [provider, setProvider] = useState('benzy');
    const [markup, setMarkup] = useState(0);

    return (
        <div className="w-full max-w-5xl mx-auto -mt-20 relative z-10 fade-in">
            {/* Main Search Card */}
            <div className="glass-panel rounded-lg p-6 mb-6" style={{ borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.95)' }}>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                    {['one-way', 'round-trip', 'multi-city'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTripType(type)}
                            className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-all capitalize`}
                            style={{
                                color: tripType === type ? 'var(--primary)' : 'var(--text-muted)',
                                borderColor: tripType === type ? 'var(--primary)' : 'transparent',
                                cursor: 'pointer',
                                background: 'none',
                                fontFamily: 'var(--font-main)'
                            }}
                        >
                            {type.replace('-', ' ')}
                        </button>
                    ))}

                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs font-medium text-muted">Currency:</span>
                        <select className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-main)' }}>
                            <option>USD</option>
                            <option>INR</option>
                            <option>EUR</option>
                            <option>AED</option>
                        </select>
                    </div>
                </div>

                {/* Input Grid */}
                <div className="grid grid-cols-12 gap-4 mb-6">

                    {/* From */}
                    <div className="col-span-3 input-group" style={{ gridColumn: 'span 3' }}>
                        <label className="input-label">From</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute top-3 left-3" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" placeholder="Origin City or Airport" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} defaultValue="DXB - Dubai International" />
                        </div>
                    </div>

                    {/* To */}
                    <div className="col-span-3 input-group" style={{ gridColumn: 'span 3' }}>
                        <label className="input-label">To</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute top-3 left-3" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" placeholder="Destination" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} defaultValue="LHR - London Heathrow" />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="input-group" style={{ gridColumn: tripType === 'one-way' ? 'span 3' : 'span 2' }}>
                        <label className="input-label">Departure</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute top-3 left-3" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="date" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>

                    {tripType !== 'one-way' && (
                        <div className="col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">Return</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute top-3 left-3" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input type="date" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </div>
                    )}

                    {/* Pax & Class */}
                    <div className="input-group" style={{ gridColumn: tripType === 'one-way' ? 'span 3' : 'span 2' }}>
                        <label className="input-label">Travelers & Class</label>
                        <div className="relative">
                            <Users size={18} className="absolute top-3 left-3" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <select className="input-field w-full appearance-none bg-white" style={{ paddingLeft: '2.5rem' }}>
                                <option>1 Traveler, Economy</option>
                                <option>2 Travelers, Business</option>
                                <option>1 Traveler, First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between mt-8">
                    <button
                        onClick={() => setAdvancedMode(!advancedMode)}
                        className="flex items-center gap-2 text-sm text-primary font-medium btn-ghost px-3 py-2 rounded-lg"
                        style={{ color: 'var(--primary)' }}
                    >
                        <Settings size={16} />
                        {advancedMode ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>

                    <button
                        onClick={onSearch}
                        className="btn btn-primary gap-2 px-8 py-3 text-lg"
                        style={{ boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}
                    >
                        <Search size={20} />
                        Search Flights
                    </button>
                </div>
            </div>

            {/* Advanced B2B Controls Panel */}
            {advancedMode && (
                <div className="glass-panel p-6 rounded-lg mb-6 grid grid-cols-4 gap-6 animate-fadeIn" style={{ animation: 'fadeIn 0.2s ease-out' }}>

                    <div className="input-group">
                        <label className="input-label flex items-center gap-2">
                            <Activity size={14} /> API Provider
                        </label>
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="input-field"
                        >
                            <option value="benzy">Benzy Infotech</option>
                            <option value="akbar">Akbar Travels</option>
                            <option value="amadeus">Amadeus (Internal)</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label flex items-center gap-2">
                            <DollarSign size={14} /> Markup (%)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={markup}
                                onChange={(e) => setMarkup(e.target.value)}
                                className="input-field"
                                style={{ width: '80px' }}
                            />
                            <span className="text-sm text-muted">Global Margin</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label flex items-center gap-2">
                            <Code size={14} /> Payload Preview
                        </label>
                        <div className="flex items-center gap-2 pt-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                                <input type="checkbox" className="" />
                                <span>Show JSON Request</span>
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label flex items-center gap-2">
                            <Clock size={14} /> Max Response Time
                        </label>
                        <div className="text-sm font-medium mt-2 flex items-center gap-2" style={{ color: 'var(--success)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                            Fast (&lt;2s)
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label flex items-center gap-2">
                            <Settings size={14} /> Class Mapping
                        </label>
                        <div className="text-xs text-muted mt-2 border p-2 rounded bg-slate-50" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}>
                            Eco: Y • Bus: J • First: F
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SearchCard;
