"use client";

import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, MapPin, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface Room {
    id: string;
    adults: number;
    children: number;
    infants: number;
}

const HotelSearchCard = () => {
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [rooms, setRooms] = useState<Room[]>([
        { id: '1', adults: 1, children: 0, infants: 0 }
    ]);

    const addRoom = () => {
        const newRoom: Room = {
            id: Date.now().toString(),
            adults: 1,
            children: 0,
            infants: 0
        };
        setRooms([...rooms, newRoom]);
    };

    const updateRoom = (id: string, field: 'adults' | 'children' | 'infants', value: number) => {
        setRooms(rooms.map(room =>
            room.id === id ? { ...room, [field]: Math.max(0, value) } : room
        ));
    };

    const removeRoom = (id: string) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter(room => room.id !== id));
        }
    };

    return (
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <CardContent className="p-8">
                {/* Destination */}
                <div className="space-y-2 mb-6">
                    <Label className="text-sm font-semibold text-gray-700">Destination</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="City"
                            className="pl-11 h-14 text-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            defaultValue=""
                        />
                    </div>
                </div>

                {/* Check-in and Check-out */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Check In</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-11 text-left font-normal border-gray-300 hover:border-blue-500 transition-colors",
                                        !checkIn && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    {checkIn ? format(checkIn, "PP") : <span>12 Aug, 2025</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkIn}
                                    onSelect={setCheckIn}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Check Out</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-11 text-left font-normal border-gray-300 hover:border-blue-500 transition-colors",
                                        !checkOut && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    {checkOut ? format(checkOut, "PP") : <span>13 Aug, 2025</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkOut}
                                    onSelect={setCheckOut}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Rooms Configuration */}
                <div className="space-y-4 mb-6">
                    {rooms.map((room, index) => (
                        <div key={room.id} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-700">Room {index + 1}</h3>
                                {rooms.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRoom(room.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Adult */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-600">Adult (12+)</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'adults', room.adults - 1)}
                                            disabled={room.adults <= 1}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-1 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-lg font-semibold">
                                            {room.adults}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'adults', room.adults + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Child */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-600">Child (1-11)</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'children', room.children - 1)}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-1 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-lg font-semibold">
                                            {room.children}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'children', room.children + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Infant */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-600">Infant (0-1)</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'infants', room.infants - 1)}
                                        >
                                            -
                                        </Button>
                                        <div className="flex-1 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-lg font-semibold">
                                            {room.infants}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg bg-white"
                                            onClick={() => updateRoom(room.id, 'infants', room.infants + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Room Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all"
                        onClick={addRoom}
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Room +
                    </Button>
                </div>

                {/* Nationality */}
                <div className="space-y-2 mb-6">
                    <Label className="text-sm font-semibold text-gray-700">Nationality</Label>
                    <Select defaultValue="sa">
                        <SelectTrigger className="h-14 border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sa">SAUDI ARABIA</SelectItem>
                            <SelectItem value="ae">UNITED ARAB EMIRATES</SelectItem>
                            <SelectItem value="us">UNITED STATES</SelectItem>
                            <SelectItem value="gb">UNITED KINGDOM</SelectItem>
                            <SelectItem value="in">INDIA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Search
                </Button>
            </CardContent>
        </Card>
    );
};

export default HotelSearchCard;
