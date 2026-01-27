"use client";

import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const VisaSearchCard = () => {
    return (
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Citizenship */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">I am a citizen of</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Select defaultValue="sa">
                                <SelectTrigger className="pl-11 h-14 border-gray-300">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sa">Saudi Arabia</SelectItem>
                                    <SelectItem value="ae">United Arab Emirates</SelectItem>
                                    <SelectItem value="in">India</SelectItem>
                                    <SelectItem value="us">United States</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Traveling to</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Select>
                                <SelectTrigger className="pl-11 h-14 border-gray-300">
                                    <SelectValue placeholder="Select Destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="eu">Schengen Area</SelectItem>
                                    <SelectItem value="cn">China</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <Label className="text-sm font-semibold text-gray-700">Visa Type</Label>
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 h-12 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100">Tourist Visa</Button>
                        <Button variant="outline" className="flex-1 h-12 border-gray-300 hover:border-gray-400">Business Visa</Button>
                        <Button variant="outline" className="flex-1 h-12 border-gray-300 hover:border-gray-400">Student Visa</Button>
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Check Visa Requirements
                </Button>
            </CardContent>
        </Card>
    );
};

export default VisaSearchCard;
