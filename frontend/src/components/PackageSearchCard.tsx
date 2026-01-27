"use client";

import React from 'react';
import { Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from 'react';

const PackageSearchCard = () => {
    const [date, setDate] = useState<Date>();

    return (
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Destination */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Destination</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Where do you want to go?"
                                className="pl-11 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    {/* From City */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Departing From</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="City or Airport"
                                className="pl-11 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Travel Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-11 text-left font-normal border-gray-300 hover:border-blue-500 transition-colors",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    {date ? format(date, "PP") : <span>Select Date</span>}
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
                </div>

                <div className="mb-8">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Themes</Label>
                    <div className="flex flex-wrap gap-2">
                        {["Honeymoon", "Family", "Adventure", "Luxury", "Beach", "Cultural"].map((theme) => (
                            <Button key={theme} variant="outline" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                {theme}
                            </Button>
                        ))}
                    </div>
                </div>


                {/* Search Button */}
                <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Find Packages
                </Button>
            </CardContent>
        </Card>
    );
};

export default PackageSearchCard;
