"use client";

import { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import DashboardOverview from "@/components/DashboardOverview";
import CorporateAccounts from "@/components/CorporateAccounts";
import StaffAccounts from "@/components/StaffAccounts";
import BookingManagement from "@/components/BookingManagement";
import ApiControls from "@/components/ApiControls";
import PlaceholderPage from "@/components/PlaceholderPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardOverview />;
      case 'corporate': return <CorporateAccounts />;
      case 'staff': return <StaffAccounts />;
      case 'bookings-flight': return <BookingManagement type="flight" />;
      case 'bookings-hotel': return <BookingManagement type="hotel" />;
      case 'bookings-car': return <BookingManagement type="car" />;
      case 'bookings-visa': return <BookingManagement type="visa" />;
      case 'api-controls': return <ApiControls />;
      case 'analytics': return <PlaceholderPage title="Analytics & Reports" description="Comprehensive data analysis tools are currently under development." />;
      case 'expenses': return <PlaceholderPage title="Expense Tracking" description="Corporate expense management system integration is in progress." />;
      case 'payments': return <PlaceholderPage title="Payment Gateway" description="Secure payment processing configuration and management." />;
      case 'ntracks': return <PlaceholderPage title="NTracks System" description="Legacy NTracks integration status and controls." />;
      case 'settings': return <PlaceholderPage title="System Settings" description="Global application configuration settings." />;
      case 'roles': return <PlaceholderPage title="User Roles & Permissions" description="Manage access levels and security policies." />;
      default: return <DashboardOverview />;
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <main className="flex-1 md:ml-64 relative bg-slate-50/50 min-h-screen">
          {/* Header with minimal content or breadcrumbs if needed, though Sidebar has logo */}
          {/* The previous header had the user profile mostly, we'll keep a minimal header or just top spacing */}
          <div className="h-16 flex items-center justify-end px-8 border-b bg-white">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Last updated: Just now</span>
            </div>
          </div>

          <div className="p-4 md:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
