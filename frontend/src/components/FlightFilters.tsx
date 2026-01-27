"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sunrise, Sun, Sunset, Filter, DollarSign, Ticket, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FlightFilters = () => {
    const [priceRange, setPriceRange] = useState([892, 12792]);
    const [refundable, setRefundable] = useState(false);
    const [nonRefundable, setNonRefundable] = useState(false);
    const [departTime, setDepartTime] = useState<string[]>([]);

    const toggleDepartTime = (time: string) => {
        setDepartTime(prev =>
            prev.includes(time)
                ? prev.filter(t => t !== time)
                : [...prev, time]
        );
    };

    return (
        <Card className="sticky top-4 border-none shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Filter className="h-5 w-5 text-blue-600" /> Filter Your Search
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                {/* Price Range */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="font-semibold text-slate-700 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-slate-400" /> Price Range
                        </Label>
                        <button className="text-xs text-blue-600 hover:underline font-medium">Reset</button>
                    </div>
                    <div className="space-y-4 px-1">
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={892}
                            max={12792}
                            step={100}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span>{priceRange[0]} SAR</span>
                            <span>{priceRange[1]} SAR</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Fare Type */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="font-semibold text-slate-700 flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-slate-400" /> Fare Type
                        </Label>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="refundable"
                                checked={refundable}
                                onCheckedChange={(checked) => setRefundable(checked as boolean)}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                                htmlFor="refundable"
                                className="text-sm font-medium leading-none text-slate-600 cursor-pointer hover:text-slate-900 transition-colors"
                            >
                                Refundable (with Charges)
                            </label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="non-refundable"
                                checked={nonRefundable}
                                onCheckedChange={(checked) => setNonRefundable(checked as boolean)}
                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                                htmlFor="non-refundable"
                                className="text-sm font-medium leading-none text-slate-600 cursor-pointer hover:text-slate-900 transition-colors"
                            >
                                Non Refundable
                            </label>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Depart Time */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="font-semibold text-slate-700 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" /> Departure Time
                        </Label>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <Button
                            type="button"
                            variant={departTime.includes('morning') ? 'default' : 'outline'}
                            className={`w-full justify-start gap-3 h-12 ${departTime.includes('morning') ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                            onClick={() => toggleDepartTime('morning')}
                        >
                            <Sunrise className="h-5 w-5" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-sm font-semibold">Morning</span>
                                <span className="text-[10px] opacity-70">00:00 - 12:00</span>
                            </div>
                        </Button>
                        <Button
                            type="button"
                            variant={departTime.includes('afternoon') ? 'default' : 'outline'}
                            className={`w-full justify-start gap-3 h-12 ${departTime.includes('afternoon') ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                            onClick={() => toggleDepartTime('afternoon')}
                        >
                            <Sun className="h-5 w-5" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-sm font-semibold">Afternoon</span>
                                <span className="text-[10px] opacity-70">12:00 - 17:00</span>
                            </div>
                        </Button>
                        <Button
                            type="button"
                            variant={departTime.includes('evening') ? 'default' : 'outline'}
                            className={`w-full justify-start gap-3 h-12 ${departTime.includes('evening') ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                            onClick={() => toggleDepartTime('evening')}
                        >
                            <Sunset className="h-5 w-5" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-sm font-semibold">Evening</span>
                                <span className="text-[10px] opacity-70">17:00 - 24:00</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FlightFilters;
