"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Users,
    BookOpen,
    Plane,
    Bed,
    Car,
    FileText,
    Server,
    BarChart3,
    Receipt,
    CreditCard,
    Network,
    Settings,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    hasSubmenu?: boolean;
    isOpen?: boolean;
    onClick?: () => void;
    isCollapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, isActive, hasSubmenu, isOpen, onClick, isCollapsed }: SidebarItemProps) => {
    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-10 font-medium text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                isCollapsed && "justify-center px-2"
            )}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
                <>
                    <span className="flex-1 text-left">{label}</span>
                    {hasSubmenu && (
                        <div className="text-slate-400">
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                    )}
                </>
            )}
        </Button>
    );
};

interface SidebarProps {
    currentView?: string;
    onViewChange?: (view: string) => void;
    isCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ currentView, onViewChange, isCollapsed = false, onCollapsedChange }: SidebarProps) => {

    const [bookingMenuOpen, setBookingMenuOpen] = useState(false);
    const router = useRouter();

    const handleNavigation = (view: string) => {
        if (onViewChange) {
            onViewChange(view);
        } else {
            // We are likely on a separate page (like /agent), so navigate home
            router.push(`/?view=${view}`);
        }
    };

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen border-r bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 pt-4 pb-8 overflow-y-auto hidden md:block shadow-sm transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header with Logo/Toggle */}
            <div className={cn(
                "px-6 mb-8 flex items-center gap-2",
                isCollapsed ? "justify-center px-2" : "cursor-pointer"
            )}>
                {!isCollapsed ? (
                    <img
                        src="/logo.png"
                        alt="Flyinco"
                        className="h-8 w-auto object-contain cursor-pointer"
                        onClick={() => router.push('/')}
                    />
                ) : (
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer" onClick={() => router.push('/')}>
                        F
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => onCollapsedChange?.(!isCollapsed)}
                className={cn(
                    "absolute top-20 -right-3 bg-white border rounded-full p-1 shadow-md hover:bg-slate-50 transition-colors z-50",
                    isCollapsed && "rotate-180"
                )}
            >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>

            <div className="px-3 space-y-1">
                {!isCollapsed && (
                    <div className="pt-2 pb-1 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Administration
                    </div>
                )}

                <SidebarItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    isActive={currentView === 'dashboard'}
                    onClick={() => handleNavigation('dashboard')}
                    isCollapsed={isCollapsed}
                />

                <SidebarItem
                    icon={Building2}
                    label="Corporate Accounts"
                    isActive={currentView === 'corporate'}
                    onClick={() => onViewChange?.('corporate')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={Users}
                    label="Staff Accounts"
                    isActive={currentView === 'staff'}
                    onClick={() => onViewChange?.('staff')}
                    isCollapsed={isCollapsed}
                />

                <SidebarItem
                    icon={BookOpen}
                    label="Booking Management"
                    hasSubmenu={!isCollapsed}
                    isOpen={bookingMenuOpen}
                    onClick={() => !isCollapsed && setBookingMenuOpen(!bookingMenuOpen)}
                    isCollapsed={isCollapsed}
                />

                {bookingMenuOpen && !isCollapsed && (
                    <div className="pl-4 space-y-1 mt-1 border-l ml-5 border-slate-200">
                        <SidebarItem
                            icon={Plane}
                            label="Flight Bookings"
                            isActive={currentView === 'bookings-flight'}
                            onClick={() => onViewChange?.('bookings-flight')}
                        />
                        <SidebarItem
                            icon={Bed}
                            label="Hotel Reservations"
                            isActive={currentView === 'bookings-hotel'}
                            onClick={() => onViewChange?.('bookings-hotel')}
                        />
                        <SidebarItem
                            icon={Car}
                            label="Car Rentals"
                            isActive={currentView === 'bookings-car'}
                            onClick={() => onViewChange?.('bookings-car')}
                        />
                        <SidebarItem
                            icon={FileText}
                            label="Visa Management"
                            isActive={currentView === 'bookings-visa'}
                            onClick={() => onViewChange?.('bookings-visa')}
                        />
                    </div>
                )}

                <SidebarItem
                    icon={Server}
                    label="API Controls (Sabre)"
                    isActive={currentView === 'api-controls'}
                    onClick={() => onViewChange?.('api-controls')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={BarChart3}
                    label="Analytics & Reports"
                    isActive={currentView === 'analytics'}
                    onClick={() => onViewChange?.('analytics')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={Receipt}
                    label="Expense Tracking"
                    isActive={currentView === 'expenses'}
                    onClick={() => onViewChange?.('expenses')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={CreditCard}
                    label="Payment Gateway"
                    isActive={currentView === 'payments'}
                    onClick={() => onViewChange?.('payments')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={Network}
                    label="NTracks System"
                    isActive={currentView === 'ntracks'}
                    onClick={() => onViewChange?.('ntracks')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={Settings}
                    label="System Settings"
                    isActive={currentView === 'settings'}
                    onClick={() => onViewChange?.('settings')}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={ShieldCheck}
                    label="User Roles & Permissions"
                    isActive={currentView === 'roles'}
                    onClick={() => onViewChange?.('roles')}
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
