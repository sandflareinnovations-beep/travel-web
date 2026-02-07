import React, { useState } from 'react';
import { X, Search, FileX, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightService } from '@/services/flightService';

interface ManageBookingModalProps {
    onClose: () => void;
}

export default function ManageBookingModal({ onClose }: ManageBookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Retrieve Form State
    const [pnr, setPnr] = useState('');
    const [lastName, setLastName] = useState('');

    // Cancel Form State
    const [cancelPnr, setCancelPnr] = useState('');
    const [cancelId, setCancelId] = useState('');

    const handleRetrieve = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Mock payload structure
            const payload = {
                ReferenceType: "T",
                TUI: "",
                ReferenceNumber: pnr, // Assuming PNR maps to Ref Number for this API
                ClientID: "bitest"
            };
            const data = await FlightService.retrieveBooking(payload);
            setResult({ type: 'retrieve', data });
        } catch (err) {
            console.error(err);
            // Demo fallback
            if (pnr === 'demo') {
                setResult({
                    type: 'retrieve',
                    data: {
                        BookingStatus: "Confirmed",
                        Origin: "BOM", Destination: "DXB",
                        TravelDate: "2025-08-15",
                        Passengers: [{ Name: "John Doe" }]
                    }
                });
            } else {
                setError("Failed to retrieve booking. Please check details.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const payload = {
                BookingID: cancelId,
                RequestType: 1, // Full Cancellation
                Remarks: "User requested cancellation",
                ClientID: "bitest",
                Passengers: []
            };
            const data = await FlightService.cancelBooking(payload);
            setResult({ type: 'cancel', data });
        } catch (err) {
            console.error(err);
            // Demo fallback
            if (cancelId === 'demo') {
                setResult({ type: 'cancel', data: { status: 'Cancelled Successfully', refundAmount: 4500 } });
            } else {
                setError("Failed to cancel booking. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-lg bg-white shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto rounded-xl ring-1 ring-slate-900/5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-800"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <CardHeader>
                    <CardTitle className="text-xl font-bold">Manage Booking</CardTitle>
                    <CardDescription>Retrieve details or cancel your reservation.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="retrieve" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="retrieve">Retrieve Ticket</TabsTrigger>
                            <TabsTrigger value="cancel">Cancel Ticket</TabsTrigger>
                        </TabsList>

                        {/* RETRIEVE TAB */}
                        <TabsContent value="retrieve" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Reference Number (PNR)</Label>
                                <Input
                                    placeholder="e.g. 220009241"
                                    value={pnr}
                                    onChange={e => setPnr(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name / Email</Label>
                                <Input
                                    placeholder="Enter associated last name or email"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-2" onClick={handleRetrieve} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                Retrieve Booking
                            </Button>
                        </TabsContent>

                        {/* CANCEL TAB */}
                        <TabsContent value="cancel" className="space-y-4">
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-6 shadow-sm">
                                <p className="text-sm font-semibold text-red-700 flex items-center">
                                    <FileX className="h-5 w-5 mr-3 text-red-600" />
                                    Warning: Cancellations may incur fees.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Booking ID</Label>
                                <Input
                                    placeholder="Booking ID or PNR"
                                    value={cancelId}
                                    onChange={e => setCancelId(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Reason (Optional)</Label>
                                <Input
                                    placeholder="Why are you cancelling?"
                                    value={cancelPnr}
                                    onChange={e => setCancelPnr(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full mt-4 !bg-[#dc2626] hover:!bg-[#b91c1c] !text-white !opacity-100 font-bold py-3 shadow-md border-2 border-red-700"
                                onClick={handleCancel}
                                disabled={loading}
                                style={{ backgroundColor: '#dc2626', color: 'white' }} // Fallback inline style
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileX className="mr-2 h-4 w-4 text-white" />}
                                Cancel Booking
                            </Button>
                        </TabsContent>
                    </Tabs>

                    {/* RESULTS DISPLAY */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-bottom-2">
                            {result.type === 'retrieve' && (
                                <div>
                                    <h4 className="font-bold text-slate-800 flex items-center mb-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                        Booking Found
                                    </h4>
                                    <div className="text-sm space-y-1 text-slate-600">
                                        <p><span className="font-semibold">Status:</span> {result.data.BookingStatus || result.data.status}</p>
                                        <p><span className="font-semibold">Route:</span> {result.data.Origin} - {result.data.Destination}</p>
                                        <p><span className="font-semibold">Date:</span> {result.data.TravelDate}</p>
                                        {result.data.Passengers && (
                                            <p><span className="font-semibold">Passenger:</span> {result.data.Passengers[0]?.Name}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {result.type === 'cancel' && (
                                <div>
                                    <h4 className="font-bold text-slate-800 flex items-center mb-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                        Cancellation Processed
                                    </h4>
                                    <div className="text-sm space-y-1 text-slate-600">
                                        <p><span className="font-semibold">Status:</span> {result.data.status || 'Cancelled'}</p>
                                        <p className="text-xs text-slate-400 mt-2">Refund will be processed within 5-7 business days.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
