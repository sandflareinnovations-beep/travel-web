"use client";

import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CreditCard, CheckCircle, User, Mail, Phone, Plane, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface Passenger {
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    nationality: string;
    passportNumber: string;
    type: 'Adult' | 'Child' | 'Infant';
}

export default function BookingPage() {
    const router = useRouter();
    const [passengers, setPassengers] = useState<Passenger[]>([
        { id: 1, title: 'Mr', firstName: '', lastName: '', nationality: '', passportNumber: '', type: 'Adult' }
    ]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [isBooked, setIsBooked] = useState(false);

    const addPassenger = () => {
        const newId = passengers.length + 1;
        setPassengers([...passengers, {
            id: newId,
            title: 'Mr',
            firstName: '',
            lastName: '',
            nationality: '',
            passportNumber: '',
            type: 'Adult'
        }]);
    };

    const removePassenger = (id: number) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter(p => p.id !== id));
        }
    };

    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(passengers.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleBooking = () => {
        setIsBooked(true);
        // In a real app, this would submit to backend
        setTimeout(() => {
            // Navigate to confirmation or show ticket
        }, 2000);
    };

    if (isBooked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                    <div className="bg-emerald-500 p-6 flex flex-col items-center justify-center text-white">
                        <CheckCircle className="h-16 w-16 mb-2 text-white/90" />
                        <h2 className="text-3xl font-bold">Booking Confirmed</h2>
                        <p className="text-emerald-100">PNR: XYA-882</p>
                    </div>
                    <CardContent className="p-8 space-y-8">
                        <div className="text-center">
                            <p className="text-slate-500 mb-1">E-tickets sent to</p>
                            <p className="font-semibold text-lg text-slate-800">{contactEmail}</p>
                        </div>

                        {/* Minimal Ticket View */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <img src="https://images.kiwi.com/airlines/64/WY.png" alt="Oman Air" className="w-8 h-8 object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Oman Air</p>
                                        <p className="text-xs text-slate-400">WY212 • Economy</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Date</p>
                                    <p className="font-bold text-slate-800">13 Aug, 2025</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-3xl font-bold text-slate-800">TRV</p>
                                    <p className="text-xs text-slate-400">08:45 AM</p>
                                </div>
                                <div className="flex flex-col items-center px-4 flex-1">
                                    <div className="w-full h-px bg-slate-300 relative">
                                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-slate-50 rotate-90 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">1h 55m</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-slate-800">DXB</p>
                                    <p className="text-xs text-slate-400">09:10 AM</p>
                                </div>
                            </div>

                            <Separator className="mb-4" />

                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Passengers</p>
                                {passengers.map(p => (
                                    <p key={p.id} className="text-sm font-medium text-slate-700">
                                        {p.title} {p.firstName} {p.lastName}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200" onClick={() => router.push('/agent')}>
                                Back to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-200 rounded-full h-10 w-10">
                            <ArrowLeft className="h-5 w-5 text-slate-700" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Details</h1>
                            <p className="text-slate-500 font-medium">Secure your journey to Dubai</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span>Secure SSL Transaction</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Passenger Forms */}
                        <div className="space-y-6">
                            {passengers.map((passenger, index) => (
                                <Card key={passenger.id} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4 px-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                            Passenger {index + 1}
                                        </CardTitle>
                                        {index > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePassenger(passenger.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full px-3"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Title</Label>
                                            <Select
                                                defaultValue={passenger.title}
                                                onValueChange={(val) => updatePassenger(passenger.id, 'title', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mr">Mr</SelectItem>
                                                    <SelectItem value="Ms">Ms</SelectItem>
                                                    <SelectItem value="Mrs">Mrs</SelectItem>
                                                    <SelectItem value="Dr">Dr</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Nationality</Label>
                                            <Select
                                                defaultValue="sa"
                                                onValueChange={(val) => updatePassenger(passenger.id, 'nationality', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sa">Saudi Arabia</SelectItem>
                                                    <SelectItem value="ae">UAE</SelectItem>
                                                    <SelectItem value="us">USA</SelectItem>
                                                    <SelectItem value="in">India</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">First Name</Label>
                                            <Input
                                                className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl"
                                                placeholder="As on passport"
                                                value={passenger.firstName}
                                                onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Last Name</Label>
                                            <Input
                                                className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl"
                                                placeholder="As on passport"
                                                value={passenger.lastName}
                                                onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-slate-600 font-medium">Passport Number</Label>
                                            <Input
                                                className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl"
                                                placeholder="Enter Valid Passport Number"
                                                value={passenger.passportNumber}
                                                onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add Passenger Button */}
                        <Button
                            variant="ghost"
                            className="w-full h-16 border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all rounded-2xl font-semibold  text-lg"
                            onClick={addPassenger}
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add Another Passenger
                        </Button>

                        {/* Contact Details */}
                        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-medium">Email Address</Label>
                                    <Input
                                        className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl"
                                        type="email"
                                        placeholder="eticket@example.com"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-medium">Phone Number</Label>
                                    <Input
                                        className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl"
                                        type="tel"
                                        placeholder="+966 5..."
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Flight Summary Card */}
                            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                                <div className="bg-slate-900 p-6 text-white pb-10 relative">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Plane className="h-32 w-32 rotate-12" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-300 mb-1">Outbound Flight</p>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div>
                                            <p className="text-4xl font-bold">TRV</p>
                                            <p className="text-slate-400">Thiruvananthapuram</p>
                                        </div>
                                        <div className="mb-2">
                                            <Plane className="h-6 w-6 text-slate-400 rotate-90" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-bold">DXB</p>
                                            <p className="text-slate-400">Dubai</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-0 relative px-6 pb-6">
                                    <div className="bg-white rounded-xl shadow-lg -mt-6 p-4 border border-slate-100 relative z-20">
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                            <img src="https://images.kiwi.com/airlines/64/WY.png" alt="Oman Air" className="h-8 w-8 object-contain" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">Oman Air</p>
                                                <p className="text-xs text-slate-500">WY212 • Economy</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <div>
                                                <p className="text-slate-400 text-xs">Departure</p>
                                                <p className="font-semibold text-slate-800">13 Aug • 08:45</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-xs">Arrival</p>
                                                <p className="font-semibold text-slate-800">13 Aug • 09:10</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Price Breakdown
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-slate-600">
                                                <span>Adult x {passengers.length}</span>
                                                <span>{(892 * passengers.length).toLocaleString()} SAR</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Taxes & Fees</span>
                                                <span>{(150 * passengers.length).toLocaleString()} SAR</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-700">Total Amount</span>
                                            <span className="font-bold text-2xl text-blue-600">
                                                {((892 + 150) * passengers.length).toLocaleString()} <span className="text-sm font-normal text-slate-500">SAR</span>
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-xl shadow-lg shadow-slate-900/10 mt-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                            onClick={handleBooking}
                                        >
                                            Pay & Book Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
