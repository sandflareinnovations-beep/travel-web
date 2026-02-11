"use client";
//TODO: 
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, CreditCard, CheckCircle, User, Mail, Phone, Plane, ShieldCheck, Loader2, Armchair, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';
import { flightApi, TravelCheckListResponse } from '@/lib/api';
import { useFlightStore } from '@/store/useFlightStore';
import SSRSelector from '@/components/SSRSelector';

interface Passenger {
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    dob: string;                // "YYYY-MM-DD"
    gender: string;             // "M" | "F"
    nationality: string;        // "IN" | "SA" | ...
    passportNumber: string;
    passportExpiry: string;     // PDOE — "YYYY-MM-DD"
    visaType: string;           // "Visiting Visa" | ...
    type: 'ADT' | 'CHD' | 'INF';
}

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tui = searchParams.get('tui');
    const index = searchParams.get('index');

    const { selectedFlight, setSelectedFlight, searchParams: { adults, children, infants } } = useFlightStore();

    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [isBooked, setIsBooked] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    const [loading, setLoading] = useState(true);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'pricing' | 'itinerary' | 'paying' | 'complete' | 'error'>('pricing');
    const [flightData, setFlightData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Seat Selection
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const [seatLayout, setSeatLayout] = useState<any>(null);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>({}); // passengerId -> seatNumber

    // TravelCheckList (dynamic field requirements)
    const [travelCheckList, setTravelCheckList] = useState<TravelCheckListResponse | null>(null);

    // SSR (Special Service Requests)
    const [selectedSSR, setSelectedSSR] = useState<{
        baggage: any[];
        meals: any[];
    }>({ baggage: [], meals: [] });
    const [ssrTotal, setSSRTotal] = useState(0);

    // Fare change handling
    const [fareChangeInfo, setFareChangeInfo] = useState<{ oldFare: number; newFare: number } | null>(null);
    const [showFareChangeModal, setShowFareChangeModal] = useState(false);

    // Validation Errors State
    const [errors, setErrors] = useState<{
        passengers: Record<number, Partial<Record<keyof Passenger, string>>>;
        contact: { email?: string; phone?: string; };
    }>({ passengers: {}, contact: {} });

    // Prevent double execution in Strict Mode
    const processedTuiRef = React.useRef<string | null>(null);

    // Initialize passengers and flight data from Store
    useEffect(() => {
        if (!tui) {
            console.warn("⚠️ No TUI found, redirecting home");
            router.push('/');
            return;
        }

        // Prevent running twice for the same TUI (Strict Mode fix)
        if (processedTuiRef.current === tui) {
            console.log("Skipping duplicate initialization for TUI:", tui);
            return;
        }
        processedTuiRef.current = tui;

        console.log("📋 Booking page loaded. TUI:", tui);
        console.log("✅ Passenger count from store:", { adults, children, infants });

        // Create passenger forms based on search counts
        const passengerForms: Passenger[] = [];
        let id = 1;

        // Add adult passengers
        for (let i = 0; i < adults; i++) {
            passengerForms.push({
                id: id++,
                title: 'Mr',
                firstName: '',
                lastName: '',
                dob: '',
                gender: 'M',
                nationality: 'IN',
                passportNumber: '',
                passportExpiry: '',
                visaType: 'Visiting Visa',
                type: 'ADT'
            });
        }

        // Add child passengers
        for (let i = 0; i < children; i++) {
            passengerForms.push({
                id: id++,
                title: 'Master',
                firstName: '',
                lastName: '',
                dob: '',
                gender: 'M',
                nationality: 'IN',
                passportNumber: '',
                passportExpiry: '',
                visaType: 'None',
                type: 'CHD'
            });
        }

        // Add infant passengers
        for (let i = 0; i < infants; i++) {
            passengerForms.push({
                id: id++,
                title: 'Infant',
                firstName: '',
                lastName: '',
                dob: '',
                gender: 'M',
                nationality: 'IN',
                passportNumber: '',
                passportExpiry: '',
                visaType: 'None',
                type: 'INF'
            });
        }

        setPassengers(passengerForms);

        // Load flight data from store for instant UI
        if (selectedFlight) {
            console.log("✅ Flight data loaded from store:", selectedFlight);
            setFlightData(selectedFlight);
            setLoading(false);
        } else {
            console.warn("⚠️ No selected flight in store found");
            // Fallback: try session storage just in case
            const cached = sessionStorage.getItem('selectedFlight');
            if (cached) {
                try {
                    setFlightData(JSON.parse(cached));
                    setLoading(false);
                } catch (e) { }
            }
        }

        fetchPricing();
    }, [tui, adults, children, infants, selectedFlight, router]);

    /* -------------------- GET SPRICER — direct call, no polling -------------------- */
    const fetchPricing = async () => {
        try {
            setBookingStatus('pricing');
            if (!flightData) setLoading(true);

            const clientId = flightApi.getStoredClientId();
            // GetSPricer is a direct call — pass the Price TUI from SmartPricer
            const results = await flightApi.getSPricer(clientId, tui!);

            if (results?.Code === "200") {
                // Merge confirmed price into existing flightData if cached, else use response directly
                setFlightData((prev: any) => ({
                    ...prev,
                    ...results, // Merge full response including SSRs, Trips, etc.
                    NetFare: results.NetAmount || prev?.NetFare,
                    GrossFare: results.GrossFare || prev?.GrossFare
                }));

                // SYNC PASSENGERS WITH API COUNTS
                // If the user changed the search inputs but didn't search again, the Store might have more pax than the TUI.
                // We must align with the TUI/Pricing response.
                const apiADT = Number(results.ADT || 0);
                const apiCHD = Number(results.CHD || 0);
                const apiINF = Number(results.INF || 0);

                setPassengers(prev => {
                    const currentADT = prev.filter(p => p.type === 'ADT');
                    const currentCHD = prev.filter(p => p.type === 'CHD');
                    const currentINF = prev.filter(p => p.type === 'INF');

                    let newPassengers: any[] = [];
                    let hasChanged = false;

                    // Helper to sync specific type
                    const syncType = (current: any[], targetAccount: number, type: string) => {
                        if (current.length === targetAccount) {
                            newPassengers.push(...current);
                        } else if (current.length < targetAccount) {
                            // Add missing
                            hasChanged = true;
                            newPassengers.push(...current);
                            for (let i = 0; i < targetAccount - current.length; i++) {
                                newPassengers.push({
                                    id: Date.now() + Math.random(), // Temp ID
                                    title: type === 'ADT' ? 'Mr' : 'Master',
                                    firstName: '',
                                    lastName: '',
                                    dob: '',
                                    gender: 'M',
                                    nationality: 'IN',
                                    passportNumber: '',
                                    passportExpiry: '',
                                    visaType: 'Visiting Visa',
                                    type: type
                                });
                            }
                        } else {
                            // Remove excess
                            hasChanged = true;
                            newPassengers.push(...current.slice(0, targetAccount));
                        }
                    };

                    syncType(currentADT, apiADT, 'ADT');
                    syncType(currentCHD, apiCHD, 'CHD');
                    syncType(currentINF, apiINF, 'INF');

                    if (hasChanged) {
                        console.log("⚠️ Passenger counts synced with API:", { apiADT, apiCHD, apiINF });
                        // Re-index IDs to be safe/clean
                        return newPassengers.map((p, index) => ({ ...p, id: index + 1 }));
                    }
                    return prev;
                });

                setBookingStatus('idle');
                setLoading(false);

                // Fetch TravelCheckList for dynamic validation rules
                try {
                    const checkListRes = await flightApi.getTravelCheckList(
                        results.TUI || tui!, // Use Pricing TUI if available, else fallback
                        clientId
                    );
                    if (checkListRes?.Code === '200') {
                        setTravelCheckList(checkListRes);
                        console.log('✅ TravelCheckList loaded:', checkListRes);
                    }
                } catch (checkListErr) {
                    console.warn('⚠️ TravelCheckList fetch failed (non-blocking):', checkListErr);
                    // Non-blocking: validation falls back to default (all required)
                }
            } else {
                throw new Error(results?.Msg?.[0] || "Failed to validate flight price");
            }
        } catch (error: any) {
            console.error("Pricing failed", error);
            const errorMsg = error.message || "Failed to validate flight price";

            // Check if it's a fare change error
            if (errorMsg.includes('fare') && errorMsg.includes('Amt')) {
                // Parse old and new amounts from message
                const oldMatch = errorMsg.match(/Previous Amt:-?(\d+)/);
                const newMatch = errorMsg.match(/New Amt:-?(\d+)/);

                if (oldMatch && newMatch) {
                    setFareChangeInfo({
                        oldFare: parseInt(oldMatch[1]),
                        newFare: parseInt(newMatch[1])
                    });
                    setShowFareChangeModal(true);
                    setLoading(false);
                    setBookingStatus('idle');
                    return; // Don't show error, show modal instead
                }
            }

            // Check if it's an expired session error
            if (errorMsg.includes("No Data Found") || errorMsg.includes("expired")) {
                setErrorMessage("⏰ This booking session has expired. Redirecting to search...");
                setBookingStatus('error');
                setLoading(false);

                // Clear stale session data
                sessionStorage.removeItem('selectedFlight');
                sessionStorage.removeItem('bookingPassengers');
                sessionStorage.removeItem('bookingContact');
                sessionStorage.removeItem('bookingSSR');
                sessionStorage.removeItem('ssrTotal');

                // Redirect to search after 2 seconds
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setBookingStatus('error');
                setErrorMessage(errorMsg);
                setLoading(false);
            }
        }
    };

    const handleAcceptFareChange = () => {
        setShowFareChangeModal(false);

        // Update flight data with new fare
        if (fareChangeInfo) {
            const updatedFlightData = {
                ...flightData,
                NetFare: fareChangeInfo.newFare,
                GrossFare: fareChangeInfo.newFare
            };

            setFlightData(updatedFlightData);

            // IMPORTANT: Also update Zustand store so Review page gets the correct price
            setSelectedFlight(updatedFlightData);
        }

        // Clear fare change info
        setFareChangeInfo(null);
    };

    /* -------------------- SSR Selection Change Handler -------------------- */
    const handleSSRChange = (selection: { baggage: any[], meals: any[] }, totalCost: number) => {
        setSelectedSSR(selection);
        setSSRTotal(totalCost);
        console.log("🎒 SSR Selection Updated:", selection, "Total:", totalCost);
    };

    /* -------------------- PASSENGER HELPERS -------------------- */
    const addPassenger = () => {
        const newId = passengers.length + 1;
        setPassengers([...passengers, {
            id: newId,
            title: 'Mr',
            firstName: '',
            lastName: '',
            dob: '',
            gender: 'M',
            nationality: 'IN',
            passportNumber: '',
            passportExpiry: '',
            visaType: 'Visiting Visa',
            type: 'ADT'
        }]);
    };

    const removePassenger = (id: number) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter(p => p.id !== id));
        }
    };

    const updatePassenger = (id: number, field: keyof Passenger, value: string) => {
        setPassengers(passengers.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));

        // Clear error when user types
        if (errors.passengers[id]?.[field]) {
            setErrors(prev => ({
                ...prev,
                passengers: {
                    ...prev.passengers,
                    [id]: {
                        ...prev.passengers[id],
                        [field]: undefined
                    }
                }
            }));
        }
    };

    // Derive Age from DOB
    const calcAge = (dob: string): number => {
        if (!dob) return 30;
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    /* -------------------- CONTINUE TO REVIEW -------------------- */
    const handleContinue = () => {
        console.log("📝 Validating booking details...");
        let isValid = true;
        const newErrors: typeof errors = { passengers: {}, contact: {} };

        // 1. Validate Contact Details
        if (!contactEmail) {
            newErrors.contact.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
            newErrors.contact.email = "Invalid email address";
            isValid = false;
        }

        if (!contactPhone) {
            newErrors.contact.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d+$/.test(contactPhone)) {
            newErrors.contact.phone = "Phone number must contain only digits";
            isValid = false;
        }

        // 2. Validate Passengers (using TravelCheckList rules if available)
        const nameRegex = /^[A-Za-z]+$/;
        // Safety check: Ensure arrays exist and have at least one item
        const checkItem = travelCheckList?.TravellerCheckList?.[0] ?? null;
        const fnuLnu = travelCheckList?.FnuLnuSettings?.[0] ?? null;

        // Determine which fields are required (default: all required if no checklist)
        // If checkItem is null, we assume standard requirements (Passport/DOB required for intl, etc., but let's stick to existing logic)
        // Actually, if checkItem is null, it might mean "no special restrictions", so maybe default to FALSE for odd things?
        // Let's stick to: if checklist exists, use it. If not, default to TRUE for standard fields to be safe.
        const isPassportRequired = checkItem ? checkItem.PassportNo === 1 : true;
        const isPDOERequired = checkItem ? checkItem.PDOE === 1 : false; // Default false if missing? Or true if unknown? Let's say false if unchecked.
        const isDOBRequired = checkItem ? checkItem.DOB === 1 : true;
        const isNationalityRequired = checkItem ? checkItem.Nationality === 1 : false;
        const isVisaRequired = checkItem ? checkItem.VisaType === 1 : false;

        // FNU/LNU Strings
        const fnuMsg = fnuLnu?.Fnumessage || "First Name is required";
        const lnuMsg = fnuLnu?.Lnumessage || "Last Name is required";
        const isTitleMandatory = fnuLnu?.TitleMandatory ?? true;

        passengers.forEach(p => {
            const pErrors: Partial<Record<keyof Passenger, string>> = {};

            // First Name — always required
            if (!p.firstName) {
                pErrors.firstName = fnuMsg;
            } else if (!nameRegex.test(p.firstName)) {
                pErrors.firstName = "Alphabets only";
            }

            // Last Name — always required
            if (!p.lastName) {
                pErrors.lastName = lnuMsg;
            } else if (!nameRegex.test(p.lastName)) {
                pErrors.lastName = "Alphabets only";
            }

            // DOB — conditional
            if (isDOBRequired && !p.dob) {
                pErrors.dob = "Date of Birth is required";
            }

            // Passport — conditional (for adults, or when checklist says so)
            if (isPassportRequired && !p.passportNumber) {
                pErrors.passportNumber = "Passport Number is required";
            }

            // Passport Expiry (PDOE) — conditional
            if (isPDOERequired && !p.passportExpiry) {
                pErrors.passportExpiry = "Passport Expiry is required";
            }

            // Nationality — conditional
            if (isNationalityRequired && !p.nationality) {
                pErrors.nationality = "Nationality is required";
            }

            // Visa Type — conditional
            if (isVisaRequired && p.visaType === 'None') {
                pErrors.visaType = "Visa Type is required";
            }

            if (Object.keys(pErrors).length > 0) {
                newErrors.passengers[p.id] = pErrors;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (!isValid) {
            console.warn("❌ Validation failed", newErrors);
            // Scroll to top or first error could be nice, but simple alert fallback or just UI update is okay.
            alert("Please fix the errors highlighted in red.");
            return;
        }

        // Calculate total SSR amount (ssrTotal is updated by SSRSelector component)
        const seatTotal = Object.values(selectedSeats).reduce((sum: number, seat: any) =>
            sum + (seat?.Price || 0), 0
        );

        const totalSSRAmount = ssrTotal + seatTotal;

        // Save to session for review page
        const passengersData = JSON.stringify(passengers);
        const contactData = JSON.stringify({ email: contactEmail, phone: contactPhone });

        sessionStorage.setItem('bookingPassengers', passengersData);
        sessionStorage.setItem('bookingContact', contactData);
        sessionStorage.setItem('bookingSSR', JSON.stringify({
            baggage: selectedSSR.baggage,
            meals: selectedSSR.meals,
            seats: selectedSeats
        }));
        sessionStorage.setItem('ssrTotal', totalSSRAmount.toString());

        // Critical Fix: Save the LATEST flight data (with updated pricing from GetSPricer) to session
        // Only if flightData is available to avoid overwriting with null
        if (flightData) {
            sessionStorage.setItem('selectedFlight', JSON.stringify(flightData));
        }

        console.log("✅ Saved to session:");
        console.log("  - Passengers:", passengers.length, "travelers");
        console.log("  - Contact:", { email: contactEmail, phone: contactPhone });
        console.log("  - SSR Total:", totalSSRAmount);
        console.log("  - Flight TUI:", tui);
        console.log("  - Updated Price (NetFare):", flightData?.NetFare);

        // Update router with new TUI if it changed?
        // Actually, we should pass the LATEST TUI to review page
        const finalTUI = flightData?.TUI || tui; // Use optional chaining for flightData
        const reviewUrl = `/flights/book/review?tui=${encodeURIComponent(finalTUI!)}`; // Removed index as it's not defined in this scope
        console.log("🚀 Navigating to review page:", reviewUrl);

        router.push(reviewUrl);
    };

    /* -------------------- SEAT SELECTION -------------------- */
    const handleOpenSeats = async () => {
        setIsSeatModalOpen(true);
        if (seatLayout) return; // already loaded

        setLoadingSeats(true);
        try {
            const clientId = flightApi.getStoredClientId();
            const data = await flightApi.getSeatLayout(tui!, clientId, ""); // passing empty index for now as per previous logic
            setSeatLayout(data);
        } catch (err) {
            console.error("SeatLayout failed", err);
        } finally {
            setLoadingSeats(false);
        }
    };

    const toggleSeat = (passengerId: number, seatNum: string) => {
        setSelectedSeats(prev => ({ ...prev, [passengerId]: seatNum }));
    };



    const formatTime = (dateTime: string) => {
        if (!dateTime) return 'N/A';
        const time = dateTime.includes('T') ? dateTime.split('T')[1] : dateTime;
        return time.substring(0, 5);
    };

    const isPricingInProgress = bookingStatus === 'pricing' && !flightData;

    /* -------------------- DUMMY DATA FILLER -------------------- */
    const fillDummyData = () => {
        const dummyPassengers = passengers.map((p) => {
            const isAdult = p.type === 'ADT';
            const isChild = p.type === 'CHD';

            // Generate random alphabet string (5 characters)
            /* 
               Math.random().toString(36) includes numbers. 
               We need pure alphabets to pass validation "Adult Traveler First Name Can only enter alphabets".
            */
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            let randomStr = "";
            for (let i = 0; i < 5; i++) {
                randomStr += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }

            return {
                ...p,
                title: isAdult ? (p.gender === 'M' ? 'Mr' : 'Ms') : (isChild ? 'Master' : 'Miss'),
                firstName: `Test${p.type}${randomStr}`,
                lastName: 'User',
                dob: isAdult ? '1990-01-01' : (isChild ? '2015-01-01' : '2023-01-01'),
                gender: p.gender,
                nationality: 'IN',
                passportNumber: isAdult ? `P${Math.floor(Math.random() * 10000000)}` : '',
                passportExpiry: isAdult ? '2030-01-01' : '',
                visaType: 'None',
                // email/phone are in contact state, not passenger object usually, 
                // but if we are mapping them, we can keep them or remove if unused in Passenger type.
                // The interface Passenger doesn't have email/phone, but let's keep it safe.
            };
        });

        setPassengers(dummyPassengers);
        setContactEmail('test@example.com');
        setContactPhone('9999999999');
    };

    /* -------------------- LOADING -------------------- */
    if (loading || isPricingInProgress) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800">Validating Fare...</h2>
                <p className="text-slate-500">Checking latest availability and pricing</p>
            </div>
        );
    }

    /* -------------------- ERROR -------------------- */
    if (bookingStatus === 'error') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="bg-red-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                        <ArrowLeft className="h-10 w-10 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Oops! Something went wrong</h2>
                        <p className="text-slate-500 mt-2">{errorMessage}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" onClick={() => fetchPricing()}>
                            Retry Validation
                        </Button>
                        <Button variant="outline" className="w-full h-12 border-slate-200 rounded-xl" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    /* -------------------- MAIN BOOKING FORM -------------------- */
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-200 rounded-full h-10 w-10">
                            <ArrowLeft className="h-5 w-5 text-slate-700" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Traveller Details</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-500 font-medium">Step 1 of 2: Who is flying?</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 italic">
                            <span className="flex items-center gap-1.5 text-emerald-600">
                                <ShieldCheck className="h-4 w-4" /> Secure Booking
                            </span>
                        </div>
                        {/* DEV ONLY: Dummy Fill Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fillDummyData}
                            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                        >
                            Fill Dummy Data
                        </Button>
                    </div>
                </div>

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
                                    >
                                        Accept & Continue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Passenger Forms */}
                        <div className="space-y-6">
                            {passengers.map((passenger, idx) => (
                                <Card key={passenger.id} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4 px-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${passenger.type === 'ADT' ? 'bg-blue-100' :
                                                passenger.type === 'CHD' ? 'bg-green-100' : 'bg-amber-100'
                                                }`}>
                                                <User className={`h-4 w-4 ${passenger.type === 'ADT' ? 'text-blue-600' :
                                                    passenger.type === 'CHD' ? 'text-green-600' : 'text-amber-600'
                                                    }`} />
                                            </div>
                                            Passenger {idx + 1}
                                            <Badge variant="secondary" className={`text-xs ${passenger.type === 'ADT' ? 'bg-blue-50 text-blue-700' :
                                                passenger.type === 'CHD' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {passenger.type === 'ADT' ? 'Adult' : passenger.type === 'CHD' ? 'Child' : 'Infant'}
                                            </Badge>
                                        </CardTitle>
                                        {idx > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePassenger(passenger.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full px-3"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Title</Label>
                                            <Select
                                                defaultValue={passenger.title}
                                                onValueChange={(val) => updatePassenger(passenger.id, 'title', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mr">Mr</SelectItem>
                                                    <SelectItem value="Ms">Ms</SelectItem>
                                                    <SelectItem value="Mrs">Mrs</SelectItem>
                                                    <SelectItem value="Dr">Dr</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Gender */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Gender</Label>
                                            <Select
                                                defaultValue={passenger.gender}
                                                onValueChange={(val) => updatePassenger(passenger.id, 'gender', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M">Male</SelectItem>
                                                    <SelectItem value="F">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* First Name */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">First Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                className={`h-12 focus:ring-blue-500 rounded-xl ${errors.passengers[passenger.id]?.firstName ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                placeholder="As on passport"
                                                value={passenger.firstName}
                                                onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                                            />
                                            {errors.passengers[passenger.id]?.firstName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.passengers[passenger.id]?.firstName}</p>
                                            )}
                                        </div>

                                        {/* Last Name */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Last Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                className={`h-12 focus:ring-blue-500 rounded-xl ${errors.passengers[passenger.id]?.lastName ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                placeholder="As on passport"
                                                value={passenger.lastName}
                                                onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                                            />
                                            {errors.passengers[passenger.id]?.lastName && (
                                                <p className="text-xs text-red-500 mt-1">{errors.passengers[passenger.id]?.lastName}</p>
                                            )}
                                        </div>

                                        {/* DOB */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Date of Birth {(!travelCheckList || travelCheckList.TravellerCheckList?.[0]?.DOB === 1) && <span className="text-red-500">*</span>}</Label>
                                            <Input
                                                className={`h-12 focus:ring-blue-500 rounded-xl ${errors.passengers[passenger.id]?.dob ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                type="date"
                                                value={passenger.dob}
                                                onChange={(e) => updatePassenger(passenger.id, 'dob', e.target.value)}
                                            />
                                            {errors.passengers[passenger.id]?.dob && (
                                                <p className="text-xs text-red-500 mt-1">{errors.passengers[passenger.id]?.dob}</p>
                                            )}
                                        </div>

                                        {/* Nationality */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Nationality</Label>
                                            <Select
                                                defaultValue={passenger.nationality}
                                                onValueChange={(val) => updatePassenger(passenger.id, 'nationality', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="IN">India</SelectItem>
                                                    <SelectItem value="SA">Saudi Arabia</SelectItem>
                                                    <SelectItem value="AE">UAE</SelectItem>
                                                    <SelectItem value="US">USA</SelectItem>
                                                    <SelectItem value="UK">UK</SelectItem>
                                                    <SelectItem value="CA">Canada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Passport Number (PLI) - Mandatory for Adults */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Passport / ID Number {(!travelCheckList || travelCheckList.TravellerCheckList?.[0]?.PassportNo === 1) && <span className="text-red-500">*</span>}</Label>
                                            <Input
                                                className={`h-12 focus:ring-blue-500 rounded-xl ${errors.passengers[passenger.id]?.passportNumber ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                placeholder="Required for Adults"
                                                value={passenger.passportNumber}
                                                onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                                            />
                                            {errors.passengers[passenger.id]?.passportNumber && (
                                                <p className="text-xs text-red-500 mt-1">{errors.passengers[passenger.id]?.passportNumber}</p>
                                            )}
                                        </div>

                                        {/* Passport Expiry */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-600 font-medium">Passport Expiry {(!travelCheckList || travelCheckList.TravellerCheckList?.[0]?.PDOE === 1) && <span className="text-red-500">*</span>}</Label>
                                            <Input
                                                className={`h-12 focus:ring-blue-500 rounded-xl ${errors.passengers[passenger.id]?.passportExpiry ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                                type="date"
                                                value={passenger.passportExpiry}
                                                onChange={(e) => updatePassenger(passenger.id, 'passportExpiry', e.target.value)}
                                            />
                                            {errors.passengers[passenger.id]?.passportExpiry && (
                                                <p className="text-xs text-red-500 mt-1">{errors.passengers[passenger.id]?.passportExpiry}</p>
                                            )}
                                        </div>



                                        {/* Visa Type */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-slate-600 font-medium">Visa Type</Label>
                                            <Select
                                                defaultValue={passenger.visaType}
                                                onValueChange={(val) => updatePassenger(passenger.id, 'visaType', val)}
                                            >
                                                <SelectTrigger className="h-12 border-slate-200 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Visiting Visa">Visiting Visa</SelectItem>
                                                    <SelectItem value="Work Visa">Work Visa</SelectItem>
                                                    <SelectItem value="Student Visa">Student Visa</SelectItem>
                                                    <SelectItem value="Transit Visa">Transit Visa</SelectItem>
                                                    <SelectItem value="None">Not Required</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add Passenger Button */}
                        <Button
                            variant="ghost"
                            className="w-full h-16 border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all rounded-2xl font-semibold text-lg"
                            onClick={addPassenger}
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add Another Passenger
                        </Button>

                        {/* Contact Details */}
                        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-medium">Email Address</Label>
                                    <Input
                                        className={`h-12 focus:ring-blue-500 rounded-xl ${errors.contact.email ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                        type="email"
                                        placeholder="eticket@example.com"
                                        value={contactEmail}
                                        onChange={(e) => {
                                            setContactEmail(e.target.value);
                                            if (errors.contact.email) setErrors(prev => ({ ...prev, contact: { ...prev.contact, email: undefined } }));
                                        }}
                                    />
                                    {errors.contact.email && <p className="text-xs text-red-500 mt-1">{errors.contact.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-medium">Phone Number</Label>
                                    <Input
                                        className={`h-12 focus:ring-blue-500 rounded-xl ${errors.contact.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                                        type="tel"
                                        placeholder="+91 9..."
                                        value={contactPhone}
                                        onChange={(e) => {
                                            setContactPhone(e.target.value);
                                            if (errors.contact.phone) setErrors(prev => ({ ...prev, contact: { ...prev.contact, phone: undefined } }));
                                        }}
                                    />
                                    {errors.contact.phone && <p className="text-xs text-red-500 mt-1">{errors.contact.phone}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SSR (Extra Services) - using data derived from GetSPricer */}
                        {(flightData?.SSR || flightData?.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.SSR) && (
                            <SSRSelector
                                baggage={
                                    // Parse Baggage from flightData (Type 2)
                                    (flightData.SSR || flightData.Trips[0].Journey[0].Segments[0].SSR || [])
                                        .filter((item: any) => item.Type === "2" || item.Code?.includes("BAG"))
                                        .map((item: any) => ({
                                            ...item,
                                            Price: item.Charge || item.Amount || 0,
                                            // Fallback description if Weight is missing
                                            Weight: item.Weight || item.Description
                                        }))
                                }
                                meals={
                                    // Parse Meals from flightData (Type 1)
                                    (flightData.SSR || flightData.Trips[0].Journey[0].Segments[0].SSR || [])
                                        .filter((item: any) => item.Type === "1" || item.Code?.includes("MEAL"))
                                        .map((item: any) => ({
                                            ...item,
                                            Price: item.Charge || item.Amount || 0,
                                            Name: item.Name || item.Description
                                        }))
                                }
                                onSelectionChange={handleSSRChange}
                                initialSelection={selectedSSR}
                            />
                        )}


                        {/* Seat Selection Card */}
                        <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Armchair className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Seat Selection
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                                    onClick={handleOpenSeats}
                                >
                                    {Object.keys(selectedSeats).length > 0 ? 'Change Seats' : 'Select Seats'}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-6">
                                {Object.keys(selectedSeats).length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {passengers.map(p => selectedSeats[p.id] && (
                                            <Badge key={p.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 py-1.5 px-3">
                                                P{p.id}: {selectedSeats[p.id]}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No seats selected yet. Choose your preferred seats for a better journey.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                                <div className="bg-slate-900 p-6 text-white pb-10 relative">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Plane className="h-32 w-32 rotate-12" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-300 mb-1">Flight Route</p>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div>
                                            <p className="text-4xl font-bold">{flightData?.From}</p>
                                        </div>
                                        <div className="mb-2">
                                            <Plane className="h-6 w-6 text-slate-400 rotate-90" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-bold">{flightData?.To}</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-0 relative px-6 pb-6">
                                    <div className="bg-white rounded-xl shadow-lg -mt-6 p-4 border border-slate-100 relative z-20">
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Plane className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{flightData?.AirlineName?.split('|')[0] || 'Airline'}</p>
                                                <p className="text-xs text-slate-500">{flightData?.FlightNo} • {flightData?.Cabin === 'E' ? 'Economy' : 'Business'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <p className="font-semibold text-slate-800">{formatTime(flightData?.DepartureTime)}</p>
                                            <p className="font-semibold text-slate-800">{formatTime(flightData?.ArrivalTime)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-700">Total Amount</span>
                                            <span className="font-bold text-2xl text-blue-600">
                                                {(flightData?.NetFare || flightData?.GrossFare || 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">INR</span>
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-xl shadow-lg shadow-slate-900/10 mt-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                            onClick={handleContinue}
                                        >
                                            Continue to Review <ChevronRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEAT SELECTION MODAL */}
            {isSeatModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="bg-slate-50 px-8 py-6 border-b flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Select Your Seats</h3>
                                <p className="text-slate-500 text-sm font-medium">Click on a seat to assign to the current passenger</p>
                            </div>
                            <button onClick={() => setIsSeatModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
                            {loadingSeats ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                    <p className="text-slate-500 font-bold">Loading aircraft configuration...</p>
                                </div>
                            ) : seatLayout ? (
                                <div className="grid grid-cols-7 gap-3 py-6">
                                    {['A', 'B', 'C', '', 'D', 'E', 'F'].map((l: string, i: number) => (
                                        <div key={i} className="text-center text-[10px] font-bold text-slate-400">{l}</div>
                                    ))}

                                    {/* Rows 1-15 */}
                                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                                        <React.Fragment key={rowIndex}>
                                            {[0, 1, 2].map(colIndex => {
                                                const seatId = `${rowIndex + 1}${'ABC'[colIndex]}`;
                                                const isOccupied = Math.random() > 0.8;
                                                const isSelected = Object.values(selectedSeats).includes(seatId);
                                                return (
                                                    <button
                                                        key={colIndex}
                                                        disabled={isOccupied}
                                                        onClick={() => toggleSeat(1, seatId)}
                                                        className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                                                    ${isOccupied ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                                                                isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-400 scale-110' :
                                                                    'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'}`}
                                                    >
                                                        {rowIndex + 1}
                                                    </button>
                                                );
                                            })}
                                            <div className="flex items-center justify-center text-[10px] font-bold text-slate-300">{rowIndex + 1}</div>
                                            {[3, 4, 5].map(colIndex => {
                                                const seatId = `${rowIndex + 1}${'DEF'[colIndex - 3]}`;
                                                const isOccupied = Math.random() > 0.8;
                                                const isSelected = Object.values(selectedSeats).includes(seatId);
                                                return (
                                                    <button
                                                        key={colIndex}
                                                        disabled={isOccupied}
                                                        onClick={() => toggleSeat(1, seatId)}
                                                        className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                                                    ${isOccupied ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                                                                isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-400 scale-110' :
                                                                    'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'}`}
                                                    >
                                                        {rowIndex + 1}
                                                    </button>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-slate-500">Seat layout unavailable for this flight. Please try again later.</div>
                            )}
                        </div>

                        <div className="px-8 py-6 bg-white border-t flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-white border border-slate-300" /> <span className="text-xs text-slate-500">Available</span>
                                <div className="w-4 h-4 rounded bg-slate-100" /> <span className="text-xs text-slate-500">Occupied</span>
                                <div className="w-4 h-4 rounded bg-blue-600" /> <span className="text-xs text-slate-500">Selected</span>
                            </div>
                            <Button onClick={() => setIsSeatModalOpen(false)} className="rounded-2xl px-10 h-12 bg-slate-900 hover:bg-slate-800 text-lg shadow-xl shadow-slate-200">
                                Confirm Seats
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
