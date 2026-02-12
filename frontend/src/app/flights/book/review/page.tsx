"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft, Plane, CreditCard, Loader2, User, FileText, AlertCircle, CheckCircle   // ✅ ADD THIS
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { flightApi, CreateItineraryPayload, TravelCheckListResponse } from '@/lib/api';
import { useFlightStore } from '@/store/useFlightStore';

// --- HELPER FUNCTIONS ---

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ✅ FIX: Accurate Age Calculation
const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};

export default function ReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tui = searchParams.get('tui');

    const { selectedFlight } = useFlightStore();

    const [loading, setLoading] = useState(false);
    const [passengers, setPassengers] = useState<any[]>([]);
    const [contact, setContact] = useState<any>(null);
    const [flightData, setFlightData] = useState<any>(null);
    const [travelCheckList, setTravelCheckList] = useState<TravelCheckListResponse | null>(null);
    const [error, setError] = useState('');

    // Fare change handling
    const [fareChangeInfo, setFareChangeInfo] = useState<{ oldFare: number; newFare: number } | null>(null);
    const [showFareChangeModal, setShowFareChangeModal] = useState(false);

    // SSR state
    const [ssrSelections, setSSRSelections] = useState<any>(null);
    const [ssrAmount, setSSRAmount] = useState<number>(0);

    useEffect(() => {
        console.log("📄 Review page loaded. TUI:", tui);

        if (!tui) {
            console.warn("⚠️ No TUI parameter, redirecting home");
            router.push('/');
            return;
        }

        console.log("🔍 Checking session storage and store...");
        const storedPassengers = sessionStorage.getItem('bookingPassengers');
        const storedContact = sessionStorage.getItem('bookingContact');

        // IMPORTANT: Prioritize session storage (has updated fare) over Zustand store
        const sessionFlight = sessionStorage.getItem('selectedFlight');
        const currentFlight = sessionFlight ? JSON.parse(sessionFlight) : selectedFlight;

        console.log("Data check:", {
            hasPassengers: !!storedPassengers,
            hasContact: !!storedContact,
            hasFlight: !!currentFlight
        });

        if (!storedPassengers || !storedContact || !currentFlight) {
            const missing = [];
            if (!storedPassengers) missing.push("passengers");
            if (!storedContact) missing.push("contact");
            if (!currentFlight) missing.push("flight");

            console.warn(`❌ Missing data: ${missing.join(', ')}. Redirecting to booking...`);
            router.push(`/flights/book?tui=${tui}`);
            return;
        }

        try {
            setPassengers(JSON.parse(storedPassengers));
            setContact(JSON.parse(storedContact));
            setFlightData(currentFlight);

            // Load SSR info
            const storedSSR = sessionStorage.getItem('bookingSSR');
            const storedSSRTotal = sessionStorage.getItem('ssrTotal');

            if (storedSSR) setSSRSelections(JSON.parse(storedSSR));
            if (storedSSRTotal) setSSRAmount(parseFloat(storedSSRTotal));


            // Fetch checklist again to know what to display
            flightApi.getTravelCheckList(tui!, flightApi.getStoredClientId())
                .then(res => {
                    if (res?.Code === '200') setTravelCheckList(res);
                })
                .catch(err => console.warn("Review checklist fetch failed", err));

        } catch (err) {
            console.error("❌ Error parsing session data:", err);
            router.push(`/flights/book?tui=${tui}`);
        }
    }, [tui, selectedFlight]);

    const handleCreateItinerary = async () => {
        setLoading(true);
        setError('');

        try {
            const clientId = flightApi.getStoredClientId();

            // Format SSR data for API
            const ssrArray: any[] = [];
            if (ssrSelections) {
                // Add baggage items
                if (ssrSelections.baggage && ssrSelections.baggage.length > 0) {
                    ssrSelections.baggage.forEach((item: any) => {
                        ssrArray.push({
                            Code: item.Code,
                            Description: item.Description || item.Weight,
                            Price: item.Price,
                            Type: 'Baggage'
                        });
                    });
                }
                // Add meal items
                if (ssrSelections.meals && ssrSelections.meals.length > 0) {
                    ssrSelections.meals.forEach((item: any) => {
                        ssrArray.push({
                            Code: item.Code,
                            Description: item.Description || item.Name,
                            Price: item.Price,
                            Type: 'Meal'
                        });
                    });
                }
            }

            // DEBUG: Log values before sending
            console.log("=== DEBUG: CreateItinerary Payload Construction ===");
            console.log("fareChangeInfo:", fareChangeInfo);
            console.log("flightData.NetFare:", flightData.NetFare);

            // Explicitly calculate NetAmount to use
            const netAmountToUse = fareChangeInfo?.newFare ?? flightData.NetFare;
            console.log("netAmountToUse:", netAmountToUse);
            console.log("===================================================");

            const payload: CreateItineraryPayload = {
                TUI: tui!,
                ClientID: clientId,
                ContactInfo: {
                    Title: passengers[0].title, // Add Title if API expects it
                    FName: passengers[0].firstName,
                    LName: passengers[0].lastName,
                    Email: contact.email,
                    Mobile: contact.phone
                },
                Travellers: passengers.map((p) => {
                    const exactAge = calculateAge(p.dob);
                    return {
                        ID: p.id,
                        Title: p.title,
                        FName: p.firstName,
                        LName: p.lastName,
                        Age: exactAge,
                        DOB: p.dob,
                        Gender: p.gender,
                        Nationality: p.nationality || "IN",
                        PTC: p.type,
                        PassportNo: p.passportNumber || "",
                        PLI: "MUMBAI",
                        PDOE: p.passportExpiry || "",
                        VisaType: "None"
                    };
                }),
                NetAmount: netAmountToUse,
                SSR: ssrArray.length > 0 ? ssrArray : null,
                SSRAmount: ssrAmount,
                CrossSell: [],
                CrossSellAmount: 0,
                PLP: []
            };

            console.log("Full Payload with NetAmount:", payload.NetAmount);
            console.log("Full Payload:", payload);

            const response = await flightApi.createItinerary(payload);

            if (response.Code === "200" || response.Status === "Success") {
                const transactionId = response.TransactionID || response.BookingID;
                const totalAmount = flightData.NetFare + ssrAmount;

                // CRITICAL: Use TUI from CreateItinerary response, not the original booking TUI
                const paymentTUI = response.TUI || tui;
                console.log("🎫 Using TUI for payment:", paymentTUI);

                router.push(`/flights/book/payment?tid=${transactionId}&amt=${totalAmount}&tui=${encodeURIComponent(paymentTUI!)}`);
            } else {
                // Check for fare change error
                const msg = Array.isArray(response.Msg) ? response.Msg.join(', ') : (response.Msg || "Booking Failed");

                // Detect fare change scenario
                if (msg.includes('fare') && msg.includes('Amt')) {
                    // Parse old and new amounts from message
                    const oldMatch = msg.match(/Previous Amt:-?(\d+)/);
                    const newMatch = msg.match(/New Amt:-?(\d+)/);

                    if (oldMatch && newMatch) {
                        setFareChangeInfo({
                            oldFare: parseInt(oldMatch[1]),
                            newFare: parseInt(newMatch[1])
                        });
                        setShowFareChangeModal(true);
                        return; // Don't throw error, show modal instead
                    }
                }

                throw new Error(msg);
            }

        } catch (err: any) {
            console.error("Booking Creation Failed", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptFareChange = async () => {
        setShowFareChangeModal(false);
        // Don't clear fareChangeInfo yet - handleCreateItinerary needs it for NetAmount

        // Update flight data with new fare for UI display
        if (fareChangeInfo) {
            setFlightData((prev: any) => ({
                ...prev,
                NetFare: fareChangeInfo.newFare
            }));
        }

        // Retry booking with updated fare
        await handleCreateItinerary();

        // Clear fare change info after successful retry
        setFareChangeInfo(null);
    };

    if (!flightData || !contact) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white">
                        <ArrowLeft className="h-5 w-5 text-slate-700" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Review Booking</h1>
                        <p className="text-slate-500">Please verify your details before payment</p>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Booking Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Fare Change Modal */}
                {showFareChangeModal && fareChangeInfo && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-md w-full shadow-2xl">
                            <CardHeader className="bg-amber-50 border-b border-amber-100">
                                <CardTitle className="flex items-center gap-2 text-amber-900">
                                    <AlertCircle className="h-5 w-5" />
                                    Fare Change Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <p className="text-slate-600">
                                    The fare for your selected flight has changed. Would you like to proceed with the new fare?
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                        <p className="text-xs text-red-600 font-semibold mb-1">Previous Fare</p>
                                        <p className="text-2xl font-bold text-red-700">₹{fareChangeInfo.oldFare.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                        <p className="text-xs text-green-600 font-semibold mb-1">New Fare</p>
                                        <p className="text-2xl font-bold text-green-700">₹{fareChangeInfo.newFare.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setShowFareChangeModal(false);
                                            setFareChangeInfo(null);
                                            router.back();
                                        }}
                                    >
                                        Go Back
                                    </Button>
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        onClick={handleAcceptFareChange}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept & Continue'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flight Details Card */}
                        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                                    <Plane className="h-5 w-5 text-blue-600" />
                                    {flightData.From} → {flightData.To}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <img
                                                src={`https://raw.githubusercontent.com/The-Sky-Trails/Images/main/FlightImages/${flightData.AirlineCode}.png`}
                                                alt={flightData.AirlineCode}
                                                className="h-6 w-6 object-contain"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{flightData.AirlineName}</p>
                                            <p className="text-sm text-slate-500">{flightData.AirlineCode}-{flightData.FlightNo}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">{formatDate(flightData.DepartureTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900">{flightData.DepartureTime?.split('T')[1]?.substring(0, 5)}</p>
                                        <p className="text-slate-500">{flightData.From}</p>
                                    </div>
                                    <div className="flex-1 px-4 flex flex-col items-center">
                                        <div className="w-full h-[1px] bg-slate-300 relative top-3"></div>
                                        <div className="bg-slate-50 px-2 relative z-10 text-xs text-slate-400">
                                            {flightData.Duration}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-slate-900">{flightData.ArrivalTime?.split('T')[1]?.substring(0, 5)}</p>
                                        <p className="text-slate-500">{flightData.To}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger Details Card */}
                        <Card className="border-none shadow-sm rounded-2xl">
                            <CardHeader className="bg-white border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                                    <User className="h-5 w-5 text-blue-600" /> Traveller Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {passengers.map((p, i) => (
                                    <div key={i} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex gap-3">
                                            <div className="mt-1 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{p.title} {p.firstName} {p.lastName}</p>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                                                    <span>{p.gender === 'M' ? 'Male' : 'Female'}</span>
                                                    <span>•</span>
                                                    <span>{p.nationality}</span>
                                                    <span>•</span>
                                                    <span>{calculateAge(p.dob)} yrs</span>

                                                    {/* Dynamic Fields Display */}
                                                    {travelCheckList?.TravellerCheckList?.[0]?.PassportNo === 1 && p.passportNumber && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-slate-700 font-medium">Passport: {p.passportNumber}</span>
                                                        </>
                                                    )}
                                                    {travelCheckList?.TravellerCheckList?.[0]?.PassportNo === 1 && p.passportExpiry && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Exp: {formatDate(p.passportExpiry)}</span>
                                                        </>
                                                    )}
                                                    {travelCheckList?.TravellerCheckList?.[0]?.VisaType === 1 && p.visaType && p.visaType !== "None" && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-slate-700 font-medium">Visa: {p.visaType}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    </div>
                                ))}
                                <Separator className="my-4" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 mb-2">Contact Information</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500">Email:</span>
                                            <p className="text-slate-800 font-medium">{contact.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Phone:</span>
                                            <p className="text-slate-800 font-medium">{contact.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Price & Pay */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Fare Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-slate-300 text-sm">
                                        <span>Base Fare ({passengers.length} Travellers)</span>
                                        <span>₹ {(flightData.NetFare * 0.85).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300 text-sm">
                                        <span>Taxes & Surcharges</span>
                                        <span>₹ {(flightData.NetFare * 0.15).toFixed(0)}</span>
                                    </div>
                                    {ssrAmount > 0 && (
                                        <div className="flex justify-between text-blue-300 text-sm">
                                            <span>Extra Services (SSR)</span>
                                            <span>₹ {ssrAmount.toFixed(0)}</span>
                                        </div>
                                    )}
                                    <Separator className="bg-slate-700 my-2" />
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm text-slate-400">Total Amount</p>
                                            <p className="text-3xl font-bold">₹ {(flightData.NetFare + ssrAmount).toFixed(0)}</p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-blue-900/50"
                                        onClick={handleCreateItinerary}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Payment <CreditCard className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                    <div className="text-xs text-center text-slate-500 mt-4">
                                        By proceeding, you agree to the Fare Rules and Terms & Conditions.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}