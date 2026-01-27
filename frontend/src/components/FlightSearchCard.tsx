"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search, Plane, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

const FlightSearchCard = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('round-trip');
    const [departDate, setDepartDate] = useState<Date | undefined>(new Date());
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [from, setFrom] = useState('Thiruvananthapuram (TRV)');
    const [to, setTo] = useState('Dubai (DXB)');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const handleSearch = () => {
        router.push('/flights');
    };

    return (
        <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden transition-all hover:shadow-3xl ring-1 ring-slate-100/50">
            <CardContent className="p-8 space-y-8">
                {/* Header: Trip Type */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <RadioGroup
                        defaultValue="round-trip"
                        value={tripType}
                        onValueChange={setTripType}
                        className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl"
                    >
                        {['one-way', 'round-trip', 'multi-city'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={type} className="peer sr-only" />
                                <Label
                                    htmlFor={type}
                                    className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-blue-600 peer-data-[state=checked]:shadow-sm text-slate-500 hover:text-slate-700 capitalize"
                                >
                                    {type.replace('-', ' ')}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">From</Label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="pl-12 h-16 text-lg font-semibold bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl transition-all placeholder:text-slate-300"
                                placeholder="Origin City"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 px-2 py-1 rounded text-slate-600">TRV</div>
                        </div>
                    </div>

                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full bg-white border-slate-200 shadow-lg hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all h-10 w-10"
                            onClick={() => {
                                const temp = from;
                                setFrom(to);
                                setTo(temp);
                            }}
                        >
                            <Plane className="h-4 w-4 rotate-90" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">To</Label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="pl-12 h-16 text-lg font-semibold bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl transition-all placeholder:text-slate-300"
                                placeholder="Destination City"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 px-2 py-1 rounded text-slate-600">DXB</div>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Departure</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-16 justify-start text-left font-normal bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300 rounded-2xl transition-all pl-4",
                                        !departDate && "text-muted-foreground"
                                    )}
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs text-slate-500 font-semibold uppercase">Date</span>
                                        <span className="text-base font-bold text-slate-800">
                                            {departDate ? format(departDate, "PPP") : <span>Pick a date</span>}
                                        </span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={departDate}
                                    onSelect={setDepartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Return</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-16 justify-start text-left font-normal bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300 rounded-2xl transition-all pl-4",
                                        !returnDate && "text-muted-foreground"
                                    )}
                                    disabled={tripType === 'one-way'}
                                >
                                    <div className={`bg-white p-2 rounded-lg shadow-sm mr-3 ${tripType === 'one-way' ? 'opacity-50' : ''}`}>
                                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs text-slate-500 font-semibold uppercase">Date</span>
                                        <span className={`text-base font-bold text-slate-800 ${tripType === 'one-way' ? 'text-slate-400' : ''}`}>
                                            {returnDate ? format(returnDate, "PPP") : (tripType === 'one-way' ? "One Way Trip" : "Add Return Date")}
                                        </span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={returnDate}
                                    onSelect={setReturnDate}
                                    initialFocus
                                    disabled={(date) => date < (departDate || new Date())}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Passengers Selection */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Travelers</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        {/* Adult */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Adults</p>
                                <p className="text-xs text-slate-500">12+ years</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setAdults(Math.max(1, adults - 1))}
                                >-</Button>
                                <span className="w-4 text-center font-bold text-slate-700">{adults}</span>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setAdults(adults + 1)}
                                >+</Button>
                            </div>
                        </div>
                        {/* Child */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Children</p>
                                <p className="text-xs text-slate-500">2-11 years</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                >-</Button>
                                <span className="w-4 text-center font-bold text-slate-700">{children}</span>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setChildren(children + 1)}
                                >+</Button>
                            </div>
                        </div>
                        {/* Infant */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Infants</p>
                                <p className="text-xs text-slate-500">0-2 years</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setInfants(Math.max(0, infants - 1))}
                                >-</Button>
                                <span className="w-4 text-center font-bold text-slate-700">{infants}</span>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                    onClick={() => setInfants(infants + 1)}
                                >+</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cabin & Preferred Airline - Fixed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cabin Class</Label>
                        <Select defaultValue="economy">
                            <SelectTrigger className="h-16 w-full bg-slate-50 border-slate-200 rounded-2xl font-semibold text-slate-800 focus:ring-blue-500 px-4">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="economy" className="font-medium cursor-pointer">Economy Class</SelectItem>
                                <SelectItem value="business" className="font-medium cursor-pointer">Business Class</SelectItem>
                                <SelectItem value="first" className="font-medium cursor-pointer">First Class</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Preferred Airline</Label>
                        <Select defaultValue="any">
                            <SelectTrigger className="h-16 w-full bg-slate-50 border-slate-200 rounded-2xl font-semibold text-slate-800 focus:ring-blue-500 px-4">
                                <SelectValue placeholder="Select Airline" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any Airline</SelectItem>
                                <SelectItem value="emirates">Emirates</SelectItem>
                                <SelectItem value="etihad">Etihad Airways</SelectItem>
                                <SelectItem value="qatar">Qatar Airways</SelectItem>
                                <SelectItem value="oman">Oman Air</SelectItem>
                                <SelectItem value="airindia">Air India</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    size="lg"
                    onClick={handleSearch}
                    className="w-full h-16 text-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-2xl mt-4"
                >
                    <Search className="mr-3 h-6 w-6" />
                    Search Flights
                </Button>
            </CardContent>
        </Card>
    );
};

export default FlightSearchCard;
