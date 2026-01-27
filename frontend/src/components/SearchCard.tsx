"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Calendar as CalendarIcon, MapPin, Users, Settings, Activity, DollarSign, Code } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const flightSearchSchema = z.object({
    origin: z.string().min(3, "Airport code required"),
    destination: z.string().min(3, "Airport code required"),
    departureDate: z.date(),
    returnDate: z.date().optional(),
    passengers: z.number().min(1),
    cabinClass: z.enum(["economy", "business", "first"]),
});

const SearchCard = () => {
    const [date, setDate] = useState<Date>();
    const [advancedMode, setAdvancedMode] = useState(false);

    return (
        <div className="relative z-10 -mt-10 container mx-auto px-4">
            <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                    <Tabs defaultValue="round-trip" className="w-full">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <TabsList className="bg-transparent p-0 gap-6">
                                <TabsTrigger value="one-way" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-primary">One Way</TabsTrigger>
                                <TabsTrigger value="round-trip" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-primary">Round Trip</TabsTrigger>
                                <TabsTrigger value="multi-city" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-muted-foreground data-[state=active]:text-primary">Multi City</TabsTrigger>
                            </TabsList>

                            <Select defaultValue="USD">
                                <SelectTrigger className="w-[100px] border-none shadow-none font-bold">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-2">
                                <Label>From</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Origin" className="pl-9" defaultValue="DXB" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>To</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Destination" className="pl-9" defaultValue="LHR" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Departure</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-9 text-left font-normal", !date && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="absolute left-3 top-3 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Travelers</Label>
                                <Select defaultValue="1">
                                    <SelectTrigger className="pl-9 relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Traveler, Economy</SelectItem>
                                        <SelectItem value="2">2 Travelers, Economy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary hover:bg-primary/5"
                                onClick={() => setAdvancedMode(!advancedMode)}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                {advancedMode ? 'Hide Advanced Options' : 'Show Advanced Options'}
                            </Button>

                            <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
                                <Search className="mr-2 h-4 w-4" /> Search Flights
                            </Button>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {advancedMode && (
                <Card className="mt-4 border-dashed bg-slate-50/50 backdrop-blur">
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Activity className="h-3 w-3" /> API Provider</Label>
                            <Select defaultValue="benzy">
                                <SelectTrigger className="bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="benzy">Benzy Infotech</SelectItem>
                                    <SelectItem value="akbar">Akbar Travels</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><DollarSign className="h-3 w-3" /> Markup (%)</Label>
                            <Input type="number" placeholder="0" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Code className="h-3 w-3" /> Payload Preview</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" id="json" className="rounded border-gray-300" />
                                <label htmlFor="json" className="text-sm font-medium">Show Request JSON</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SearchCard;
