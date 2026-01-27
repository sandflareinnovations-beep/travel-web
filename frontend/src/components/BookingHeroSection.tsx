"use client";

import React from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const BookingHeroSection = () => {
    return (
        <div className="relative h-[350px] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-background.png"
                    alt="Tropical Beach Paradise"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-teal-400/30 to-blue-500/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Header with Logo */}
            <div className="relative z-10 container mx-auto px-4 pt-6">
                <div className="flex items-center justify-between">
                    <Image
                        src="/flyinco-logo.png"
                        alt="FLYINCO"
                        width={200}
                        height={60}
                        className="drop-shadow-lg w-32 md:w-[200px]"
                    />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
                        <button className="hover:text-purple-200 transition-colors">Wallet</button>
                        <button className="hover:text-purple-200 transition-colors">Logout</button>
                        <button className="hover:text-purple-200 transition-colors">Settings</button>
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                            SAR
                        </div>
                        <button className="hover:text-purple-200 transition-colors">العربية</button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="text-white p-2">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-slate-900 border-slate-800 text-white">
                                <div className="flex flex-col gap-6 mt-8">
                                    <button className="text-left text-lg font-medium hover:text-blue-400">Wallet</button>
                                    <button className="text-left text-lg font-medium hover:text-blue-400">Settings</button>
                                    <button className="text-left text-lg font-medium hover:text-blue-400">Logout</button>
                                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                        <span>Currency</span>
                                        <span className="font-bold">SAR</span>
                                    </div>
                                    <button className="text-left text-lg font-medium hover:text-blue-400">العربية</button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="text-white max-w-4xl mx-auto space-y-4">
                    <h1 className="text-5xl font-bold drop-shadow-2xl tracking-tight">
                        Explore <span className="inline-block border-b-4 border-yellow-400">The World</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default BookingHeroSection;
