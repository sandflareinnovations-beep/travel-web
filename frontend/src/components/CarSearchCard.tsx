"use client";

import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const CarSearchCard = () => {
    const [pickupDate, setPickupDate] = useState<Date>();
    const [dropoffDate, setDropoffDate] = useState<Date>();

    return (
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Pick-up Location */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Pick-up Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="City or Airport"
                                className="pl-11 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    {/* Drop-off Location */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Drop-off Location (Optional)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Same as Pick-up"
                                className="pl-11 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Pick-up Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Pick-up Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-11 text-left font-normal border-gray-300 hover:border-blue-500 transition-colors",
                                        !pickupDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    {pickupDate ? format(pickupDate, "PP") : <span>Select Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={pickupDate}
                                    onSelect={setPickupDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Pick-up Time */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Time</Label>
                        <Select defaultValue="10:00">
                            <SelectTrigger className="h-14 border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="09:00">09:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="12:00">12:00 PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Drop-off Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Drop-off Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-11 text-left font-normal border-gray-300 hover:border-blue-500 transition-colors",
                                        !dropoffDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    {dropoffDate ? format(dropoffDate, "PP") : <span>Select Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dropoffDate}
                                    onSelect={setDropoffDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Drop-off Time */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Time</Label>
                        <Select defaultValue="10:00">
                            <SelectTrigger className="h-14 border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="09:00">09:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="12:00">12:00 PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Driver Age</Label>
                        <Select defaultValue="25+">
                            <SelectTrigger className="h-14 border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25+">25+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                {/* Search Button */}
                <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Search Cars
                </Button>
            </CardContent>
        </Card>
    );
};

export default CarSearchCard;
