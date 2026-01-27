"use client";

import React from 'react';
import { Plane, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AirlineCarousel from './AirlineCarousel';
import FlightFilters from './FlightFilters';
import { useRouter } from 'next/navigation';

interface FlightResult {
    id: string;
    airline: string;
    airlineCode: string;
    flightNumber: string;
    from: string;
    fromCode: string;
    to: string;
    toCode: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
    price: number;
    currency: string;
    refundable: boolean;
    logo?: string;
}

const FlightResultsPage = () => {
    const router = useRouter();
    const mockFlights: FlightResult[] = [
        {
            id: '1',
            airline: 'Oman Air',
            airlineCode: 'WY',
            flightNumber: 'WY212',
            from: 'Thiruvananthapuram',
            fromCode: 'TRV',
            to: 'Dubai',
            toCode: 'DXB',
            departureTime: '8:45 AM',
            arrivalTime: '9:10 AM',
            duration: '1H 55 M',
            stops: 0,
            price: 892.00,
            currency: 'SAR',
            refundable: false,
            logo: 'https://images.kiwi.com/airlines/64/WY.png'
        },
        {
            id: '2',
            airline: 'Air India',
            airlineCode: 'AI',
            flightNumber: 'AI999',
            from: 'Thiruvananthapuram',
            fromCode: 'TRV',
            to: 'Dubai',
            toCode: 'DXB',
            departureTime: '8:45 AM',
            arrivalTime: '3:10 AM',
            duration: '18 H 55 M',
            stops: 1,
            price: 1129.00,
            currency: 'SAR',
            refundable: false,
            logo: 'https://images.kiwi.com/airlines/64/AI.png'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="container mx-auto px-4">
                {/* Header with Route Info */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 mb-8 shadow-2xl shadow-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 tracking-tight">
                                Thiruvananthapuram <ArrowRight className="h-6 w-6 text-slate-400" /> Dubai
                            </h1>
                            <p className="text-slate-400 font-medium">
                                13 Aug 2025 • Adult • Economy
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 mb-1 font-medium">Credit Balance</p>
                            <p className="text-3xl font-bold text-white tracking-tight">5000.00 SAR</p>
                        </div>
                    </div>
                </div>

                {/* Airline Carousel */}
                <div className="mb-8">
                    <AirlineCarousel />
                </div>

                {/* Sort Tabs */}
                <div className="mb-8">
                    <Tabs defaultValue="cheapest" className="w-full">
                        <TabsList className="bg-white/50 backdrop-blur-sm p-1 gap-2 h-auto flex-wrap rounded-xl border border-slate-100">
                            <TabsTrigger value="shortest" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 font-medium px-6 py-3">
                                Shortest flight
                            </TabsTrigger>
                            <TabsTrigger value="cheapest" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 font-medium px-6 py-3">
                                Cheapest flight
                            </TabsTrigger>
                            <TabsTrigger value="best-value" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 font-medium px-6 py-3">
                                Best value flight
                            </TabsTrigger>
                            <TabsTrigger value="sort-price" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 font-medium px-6 py-3 flex items-center gap-2">
                                Sort by Price <ChevronDown className="w-4 h-4" />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Main Content: Filters + Results */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <FlightFilters />
                    </div>

                    {/* Flight Results */}
                    <div className="lg:col-span-3 space-y-4">
                        {mockFlights.map((flight) => (
                            <Card key={flight.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white rounded-2xl overflow-hidden hover:-translate-y-1">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        {/* Left: Airline Info */}
                                        <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                                            <div className="flex flex-col items-center gap-3 min-w-[80px]">
                                                <div className="h-14 w-14 relative flex items-center justify-center bg-white rounded-full shadow-sm p-2 border border-slate-50">
                                                    {/* Logo Image */}
                                                    <img
                                                        src={flight.logo}
                                                        alt={flight.airline}
                                                        className="object-contain w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{flight.airline}</span>
                                            </div>

                                            {/* Flight Details */}
                                            <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center">
                                                {/* Departure */}
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-slate-800">{flight.departureTime}</p>
                                                    <p className="text-sm text-slate-500 mt-1 font-medium">{flight.fromCode}</p>
                                                </div>

                                                {/* Duration & Stops */}
                                                <div className="flex-1 text-center max-w-[120px]">
                                                    <p className="text-xs text-slate-500 font-medium mb-1">{flight.duration}</p>
                                                    <div className="relative flex items-center justify-center">
                                                        <div className="h-[2px] w-full bg-slate-200"></div>
                                                        <Plane className="absolute h-5 w-5 text-blue-500 bg-white px-1 rotate-90" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                                                    </p>
                                                </div>

                                                {/* Arrival */}
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-slate-800">{flight.arrivalTime}</p>
                                                    <p className="text-sm text-slate-500 mt-1 font-medium">{flight.toCode}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Price & Actions */}
                                        <div className="text-right space-y-3 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                            <div>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    {flight.currency} {flight.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                                <Badge variant={flight.refundable ? "default" : "secondary"} className="mt-1 hidden md:inline-flex">
                                                    {flight.refundable ? 'Refundable' : 'Non Refundable'}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2 w-40">
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10"
                                                    onClick={() => router.push('/flights/book')}
                                                >
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flight Number & Details Links */}
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                        <span className="font-medium">{flight.airline} — {flight.flightNumber}</span>
                                        <div className="flex gap-3">
                                            <a href="#" className="text-blue-600 hover:underline font-medium">Flight Details</a>
                                            <a href="#" className="text-blue-600 hover:underline font-medium">Baggage Info</a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResultsPage;
