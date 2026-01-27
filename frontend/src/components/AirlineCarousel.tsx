"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Airline {
    id: string;
    name: string;
    code: string;
    price: number;
    currency: string;
    logo?: string;
}

const AirlineCarousel = () => {
    const airlines: Airline[] = [
        { id: '1', name: 'Oman Air', code: 'WY', price: 892, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/WY.png' },
        { id: '2', name: 'Air India', code: 'AI', price: 1003, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/AI.png' },
        { id: '3', name: 'Emirates', code: 'EK', price: 2635, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/EK.png' },
        { id: '4', name: 'Gulf Air', code: 'GF', price: 2508, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/GF.png' },
        { id: '5', name: 'Etihad', code: 'EY', price: 3529, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/EY.png' },
        { id: '6', name: 'Qatar Airways', code: 'QR', price: 12792, currency: 'SAR', logo: 'https://images.kiwi.com/airlines/64/QR.png' },
    ];

    const scrollLeft = () => {
        const container = document.getElementById('airline-carousel');
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const container = document.getElementById('airline-carousel');
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group">
            {/* Left Arrow */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10 border-gray-100"
                onClick={scrollLeft}
            >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
            </Button>

            {/* Carousel Container */}
            <div
                id="airline-carousel"
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {airlines.map((airline, index) => (
                    <Card
                        key={airline.id}
                        className={cn(
                            "flex-shrink-0 px-6 py-4 cursor-pointer transition-all hover:shadow-md hover:scale-105",
                            "border border-gray-100 hover:border-blue-200 bg-white"
                        )}
                    >
                        <div className="flex flex-col items-center gap-3 min-w-[140px]">
                            <div className="h-12 w-24 relative flex items-center justify-center">
                                {/* Use Image or fallback to text if logo fails to load (simplified here) */}
                                <img src={airline.logo} alt={airline.name} className="object-contain h-full w-full opacity-80" onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerText = airline.code;
                                }} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-medium tracking-wide">{airline.name}</p>
                                <p className="text-lg font-bold text-slate-700 mt-1">
                                    {airline.currency} {airline.price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Right Arrow */}
            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10"
                onClick={scrollRight}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default AirlineCarousel;
