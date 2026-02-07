"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, FileText, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function BookingStatusPage() {
    const [status, setStatus] = React.useState("Checking...");

    useEffect(() => {
        // Feature: GetItineraryStatus
        fetch('http://localhost:3001/flights/status')
            .then(res => res.json())
            .then(data => setStatus(data.status))
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <Card className="max-w-lg w-full bg-white border-none shadow-2xl rounded-3xl overflow-hidden text-center p-10">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking {status}</h1>
                <p className="text-slate-500 mb-8">
                    Congratulations! Your flight has been successfully booked. A confirmation email has been sent to you.
                </p>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500 text-sm">Booking Reference</span>
                        <span className="font-mono font-bold text-slate-800">XYA-882</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">Amount Paid</span>
                        <span className="font-bold text-slate-800">$500.00</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700">
                            <Download className="mr-2 h-4 w-4" /> Download Ticket
                        </Button>
                        <Button
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            onClick={() => window.location.href = '/flights/manage'}
                        >
                            <FileText className="mr-2 h-4 w-4" /> View Booking
                        </Button>
                    </div>
                    <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-800" onClick={() => window.location.href = '/'}>
                        <Home className="mr-2 h-4 w-4" /> Return to Home
                    </Button>
                </div>
            </Card>
        </div>
    );
}
