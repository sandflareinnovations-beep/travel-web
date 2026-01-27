"use client";

import React from 'react';
import { Plane, Hotel, Package, Car, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerticalBookingTabsProps {
    activeTab: 'flight' | 'hotel' | 'packages' | 'car' | 'visa';
    onTabChange: (tab: 'flight' | 'hotel' | 'packages' | 'car' | 'visa') => void;
}

const VerticalBookingTabs: React.FC<VerticalBookingTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'flight' as const, icon: Plane, label: 'Flight' },
        { id: 'hotel' as const, icon: Hotel, label: 'Hotel' },
        { id: 'packages' as const, icon: Package, label: 'Packages' },
        { id: 'car' as const, icon: Car, label: 'Car Rental' },
        { id: 'visa' as const, icon: FileText, label: 'Visa' },
    ];

    return (
        <div className="flex flex-col gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-300",
                            "hover:scale-105 active:scale-95",
                            isActive
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        )}
                    >
                        <Icon className={cn("w-6 h-6", isActive && "animate-bounce-subtle")} />
                        <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default VerticalBookingTabs;
