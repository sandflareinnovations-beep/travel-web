"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function CancelBookingPage() {
    const [loading, setLoading] = React.useState(false);

    const handleCancel = async () => {
        setLoading(true);
        // Feature: Cancel
        try {
            await fetch('http://localhost:3001/flights/cancel', { method: 'POST' });
            // Simulate processing time
            setTimeout(() => {
                alert("Booking Cancelled");
                window.location.href = '/';
            }, 1000);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-none shadow-2xl bg-white rounded-2xl overflow-hidden">
                <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-red-700">Cancel Booking?</h1>
                </div>

                <CardContent className="p-8 text-center">
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Are you sure you want to cancel your booking <span className="font-bold text-slate-800">XYA-882</span>?
                        This action is irreversible and may be subject to cancellation fees according to our policy.
                    </p>

                    <div className="space-y-4">
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={loading}
                            className="w-full h-12 text-lg shadow-lg shadow-red-500/20"
                        >
                            {loading ? 'Processing...' : 'Yes, Cancel Confirmation'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/flights/manage'}
                            disabled={loading}
                            className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Keep My Booking
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
