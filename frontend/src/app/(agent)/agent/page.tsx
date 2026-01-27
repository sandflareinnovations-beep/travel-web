"use client";

import React, { useState } from 'react';
import BookingHeroSection from '@/components/BookingHeroSection';
import FlightSearchCard from '@/components/FlightSearchCard';
import HotelSearchCard from '@/components/HotelSearchCard';
import CarSearchCard from '@/components/CarSearchCard';
import VisaSearchCard from '@/components/VisaSearchCard';
import PackageSearchCard from '@/components/PackageSearchCard';
import VerticalBookingTabs from '@/components/VerticalBookingTabs';

export default function AgentDashboardPage() {
    const [activeTab, setActiveTab] = useState<'flight' | 'hotel' | 'packages' | 'car' | 'visa'>('flight');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar could go here */}

            <div className="bg-white rounded-b-3xl shadow-sm border-b border-slate-100 overflow-hidden">
                <BookingHeroSection />
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10 pb-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Tabs */}
                    <div className="hidden lg:block sticky top-8">
                        <VerticalBookingTabs
                            activeTab={activeTab}
                            onTabChange={(tab) => setActiveTab(tab)}
                        />
                    </div>

                    {/* Main Search Area */}
                    <div className="flex-1 w-full animate-fade-in">
                        {activeTab === 'flight' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><FlightSearchCard /></div>}
                        {activeTab === 'hotel' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><HotelSearchCard /></div>}
                        {activeTab === 'packages' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PackageSearchCard /></div>}
                        {activeTab === 'car' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><CarSearchCard /></div>}
                        {activeTab === 'visa' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><VisaSearchCard /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
