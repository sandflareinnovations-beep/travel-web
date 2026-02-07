"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import DashboardOverview from "@/components/DashboardOverview";
import CorporateAccounts from "@/components/CorporateAccounts";
import StaffAccounts from "@/components/StaffAccounts";
import BookingManagement from "@/components/BookingManagement";
import ApiControls from "@/components/ApiControls";
import PlaceholderPage from "@/components/PlaceholderPage";
import { flightApi } from '@/lib/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
          console.log("No session found, initializing...");
          await flightApi.signature({
            MerchantID: "300",
            ApiKey: "kXAY9yHARK",
            ClientID: "bitest",
            Password: "staging@1",
            AgentCode: "",
            BrowserKey: "caecd3cd30225512c1811070dce615c1",
            Key: "ef20-925c-4489-bfeb-236c8b406f7e"
          });
        }
      } catch (err) {
        console.error("Session initialization failed:", err);
        router.push('/login');
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [router]);

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

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-blue-100 font-medium animate-pulse">Initializing Secure Session...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        <main className={`flex-1 relative bg-slate-50/50 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
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

