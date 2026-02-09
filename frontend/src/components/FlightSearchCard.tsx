"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plane,
    Search,
    Loader2,
    AlertCircle,
    Check,
    X,
    Filter,
    ChevronDown,
    Minus,
    Plus,
    Info,
    Building2,
    Ticket,
    ScrollText,
    ArrowLeftRight,
    Calendar,
    Users,
    MapPin,
    ArrowRight,
    SunMedium,
    Moon,
    Clock,
    Zap,
    Luggage,
    Globe,
    ChevronRight,
} from "lucide-react";
import { flightApi } from "@/lib/api";
import { useFlightStore } from "@/store/useFlightStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export default function FlightSearchImproved() {
    const router = useRouter();


    /* --- 1. STORE STATE --- */
    const {
        searchParams,
        setSearchParams,
        flights,
        setFlights,
        loading,
        setLoading,
        error,
        setError,
        searchTui,
        setSearchTui,
        filters,
        setFilters,
        sortType,
        setSortType,
        setSelectedFlight,
    } = useFlightStore();

    const {
        tripType,
        from,
        to,
        journeyDate,
        returnDate,
        adults,
        children,
        infants,
        cabin,
        isStudent,
        isNearby,
    } = searchParams;

    const { isDirect, isRefundable, priceRange } = filters;

    // LOCAL UI STATE
    const [showPaxModal, setShowPaxModal] = useState(false);

    // VISUAL PRICE SLIDER (Local)
    const [visualPriceRange, setVisualPriceRange] = useState<[number, number]>([0, 500000]);

    // Sync visual range with store range
    useEffect(() => {
        setVisualPriceRange(priceRange);
    }, [priceRange]);

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 25;

    // Loading Index
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    // Modal States (info & rules)
    const [activeModal, setActiveModal] = useState<"info" | "rules" | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false);

    const abortController = useRef(false);

    /* --- HELPERS --- */
    const totalPax = adults + children + infants;
    const formatTime = (time: string) => (time ? time.slice(11, 16) : "--:--");
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        });

    const handleCancel = () => {
        abortController.current = true;
        setLoading(false);
    };

    // Swap From/To
    const swapCities = () => {
        setSearchParams({ from: to, to: from });
    };

    /* --- FLIGHT INFO HANDLER --- */
    const handleViewInfo = async (flight: any) => {
        setLoadingModal(true);
        setActiveModal("info");
        setModalData(null);

        try {
            const payload = {
                ClientID: flightApi.getStoredClientId() || "bitest",
                TripType: tripType,
                Trips: [
                    {
                        TUI: searchTui || "",
                        Amount: Number(flight.NetFare || flight.GrossFare),
                        Index: String(flight.Index),
                        OrderID: 1,
                        ChannelCode: null,
                    },
                ],
            };

            const data = await flightApi.getFlightInfo(payload);

            if (data.Code === "1601" || !data.Trips || data.Trips.length === 0) {
                setActiveModal(null);
                alert("Flight details unavailable. Session may have expired.");
                return;
            }

            setModalData(data);
        } catch (err) {
            console.error("Failed to load details", err);
            setActiveModal(null);
        } finally {
            setLoadingModal(false);
        }
    };

    /* --- FARE RULES HANDLER --- */
    const handleFareRules = async (flight: any) => {
        setLoadingModal(true);
        setActiveModal("rules");
        setModalData(null);

        try {
            const payload = {
                ClientID: flightApi.getStoredClientId() || "bitest",
                TripType: tripType,
                Trips: [
                    {
                        TUI: searchTui || "",
                        Amount: Number(flight.NetFare || flight.GrossFare),
                        Index: String(flight.Index),
                        OrderID: 1,
                        ChannelCode: null,
                    },
                ],
            };

            const data = await flightApi.getFareRuleDetails(payload);

            if (data.Code === "1601" || !data.Trips) {
                setActiveModal(null);
                alert("Fare rules unavailable. Session may have expired.");
                return;
            }

            setModalData(data);
        } catch (err) {
            console.error("Rules Error:", err);
            setActiveModal(null);
        } finally {
            setLoadingModal(false);
        }
    };

    /* --- VISUAL FILTERING & SORTING --- */
    const visibleFlights = useMemo(() => {
        // 1. Filter
        const filtered = flights.filter((f) => {
            if (isDirect && f.Stops > 0) return false;
            if (isRefundable && f.Refundable !== "Y") return false;
            const price = f.NetFare || f.GrossFare || 0;
            if (price < priceRange[0] || price > priceRange[1]) return false;
            return true;
        });

        // 2. Sort
        return filtered.sort((a, b) => {
            if (sortType === "CHEAPEST") {
                return (a.NetFare || a.GrossFare) - (b.NetFare || b.GrossFare);
            }
            if (sortType === "FASTEST") {
                // Simple duration parse: assume format "02h 05m" or similar
                // For robustness, comparing Duration minutes would be better if API provides it.
                // Here we'll just try a string comparison for simplicity or rely on price if duration is complex
                // Better: Parse "XH YM" to minutes.
                const getMinutes = (dur: string) => {
                    if (!dur) return 99999;
                    const parts = dur.match(/(\d+)h\s*(\d+)m/);
                    if (!parts) return 99999;
                    return parseInt(parts[1]) * 60 + parseInt(parts[2]);
                };
                return getMinutes(a.Duration) - getMinutes(b.Duration);
            }
            // "BEST" = Balanced. For now, let's keep it same as Cheapest or add custom logic
            // Often "Best" means short duration + low price.
            // Let's fallback to Cheapest for "Best" in this iteration to keep it simple
            return (a.NetFare || a.GrossFare) - (b.NetFare || b.GrossFare);
        });
    }, [flights, isDirect, isRefundable, sortType, priceRange]);

    const paginatedFlights = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return visibleFlights.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [visibleFlights, currentPage]);

    const totalPages = Math.ceil(visibleFlights.length / ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [isDirect, isRefundable, sortType, priceRange, isStudent, isNearby]);

    /* --- POLLING LOGIC --- */
    const pollResults = async (
        tui: string,
        clientId: string,
        startTime: number,
        retryCount = 0
    ) => {
        const MAX_SEARCH_TIME = 90000;
        const elapsed = Date.now() - startTime;

        if (abortController.current) {
            setLoading(false);
            return;
        }

        if (elapsed > MAX_SEARCH_TIME) {
            setLoading(false);
            // Check current flights in store to decide if error
            const currentFlights = useFlightStore.getState().flights;
            if (currentFlights.length === 0) {
                setError("Search timed out. Please try again.");
            }
            return;
        }

        try {
            const results = await flightApi.getExpSearch(clientId, tui);
            if (abortController.current) return;

            const journeyResults = results?.Trips?.[0]?.Journey || [];

            if (journeyResults.length > 0) {
                // Default sort: Cheapest first (ascending price)
                const sorted = [...journeyResults].sort(
                    (a, b) => (a.NetFare || a.GrossFare) - (b.NetFare || b.GrossFare)
                );
                setFlights(sorted);
            }

            if (results?.Complete === true) {
                setLoading(false);
                setSearchComplete(true);
                console.log("✅ Search Polling Complete");
                const currentFlights = useFlightStore.getState().flights;
                if (journeyResults.length === 0 && currentFlights.length === 0) setError("No flights found.");
            } else {
                setTimeout(() => pollResults(tui, clientId, startTime, 0), 2500);
            }
        } catch (err: any) {
            const isTimeout =
                err.message?.includes("504") || err.message?.includes("timeout");
            const newRetryCount = retryCount + 1;

            if (isTimeout && newRetryCount <= 5 && !abortController.current) {
                const delay = Math.min(3000 + newRetryCount * 1000, 8000);
                setTimeout(
                    () => pollResults(tui, clientId, startTime, newRetryCount),
                    delay
                );
            } else if (!abortController.current) {
                setTimeout(() => pollResults(tui, clientId, startTime, 0), 3000);
            }
        }
    };

    /* --- SEARCH HANDLER --- */
    const handleSearch = async () => {
        if (!journeyDate) {
            setError("Please select a departure date");
            return;
        }

        if (tripType === "RT" && !returnDate) {
            setError("Please select a return date");
            return;
        }

        setError("");
        setLoading(true);
        setFlights([]);
        setSearchComplete(false);
        abortController.current = false;
        setShowPaxModal(false);

        try {
            const clientId = flightApi.getStoredClientId() || "bitest";
            const payload = {
                FareType: tripType,
                ADT: adults,
                CHD: children,
                INF: infants,
                Cabin: cabin,
                Source: "CF",
                Mode: "AS",
                ClientID: clientId,
                IsMultipleCarrier: false,
                IsRefundable: false,
                preferedAirlines: null,
                TUI: "",
                SecType: "",
                Trips: [
                    {
                        From: from.toUpperCase(),
                        To: to.toUpperCase(),
                        ReturnDate: tripType === "RT" ? returnDate : "",
                        OnwardDate: journeyDate,
                        TUI: "",
                    },
                ],
                Parameters: {
                    Airlines: "",
                    GroupType: "",
                    Refundable: "",
                    IsDirect: false,
                    IsStudentFare: isStudent,
                    IsNearbyAirport: isNearby,
                    IsExtendedSearch: "false",
                },
            };

            const res = await flightApi.expressSearch(payload);
            if (!res?.TUI) throw new Error("Search failed.");

            setSearchTui(res.TUI);
            pollResults(res.TUI, clientId, Date.now());
        } catch (err: any) {
            setError(err.message || "Search failed.");
            setLoading(false);
        }
    };

    /* --- BOOKING HANDLER --- */
    const isBookingRef = useRef(false);

    const handleBook = async (flight: any) => {
        if (loadingIndex !== null || isBookingRef.current) return;

        isBookingRef.current = true;
        setLoadingIndex(flight.Index);

        try {
            const spRes = await flightApi.smartPricer({
                Trips: [
                    {
                        Amount: Number(flight.NetFare || flight.GrossFare),
                        Index: String(flight.Index),
                        OrderID: 1,
                        TUI: searchTui || "",
                    },
                ],
                ClientID: flightApi.getStoredClientId(),
                Mode: "AS",
                Options: "",
                Source: "SF",
                TripType: tripType,
                ADT: adults,
                CHD: children,
                INF: infants,
            });

            if (!spRes?.TUI) throw new Error("Price verification failed.");

            console.log("=== SmartPricer Response ===", spRes);

            setSelectedFlight(flight);

            router.push(
                `/flights/book?tui=${encodeURIComponent(spRes.TUI)}&index=${flight.Index}`
            );
        } catch (err: any) {
            alert(err.message || "Booking failed.");
            setLoadingIndex(null);
            isBookingRef.current = false;
        }
    };

    const getCabinLabel = (code: string) => {
        const map: any = { E: "Economy", P: "Premium", B: "Business", F: "First" };
        return map[code] || code;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* OVERLAY FOR PASSENGER MODAL */}
            {showPaxModal && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setShowPaxModal(false)}
                />
            )}

            {/* --- HEADER WITH SEARCH CARD --- */}
            <div className="bg-gradient-to-r from-sky-400 to-blue-300 pt-6 pb-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Flight Search</h1>
                            <p className="text-blue-100 text-sm">
                                Find the best deals on flights
                            </p>
                        </div>
                    </div>

                    {/* SEARCH CARD */}
                    <Card className="shadow-2xl border-0">
                        <CardContent className="p-6">
                            {/* TRIP TYPE SELECTOR */}
                            <div className="flex gap-2 mb-6">
                                {[
                                    { value: "ON", label: "One Way" },
                                    { value: "RT", label: "Round Trip" },
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setSearchParams({ tripType: type.value as any })}
                                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${tripType === type.value
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* SEARCH FIELDS - RESPONSIVE GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                                {/* FROM */}
                                <div className="lg:col-span-3 relative">
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 ml-1">
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        From
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Origin"
                                        value={from}
                                        onChange={(e) => setSearchParams({ from: e.target.value })}
                                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase"
                                    />
                                </div>

                                {/* SWAP BUTTON */}
                                <div className="hidden lg:flex lg:col-span-1 items-end justify-center pb-3">
                                    <button
                                        onClick={swapCities}
                                        className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-all"
                                    >
                                        <ArrowLeftRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* TO */}
                                <div className="lg:col-span-3 relative">
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 ml-1">
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        To
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Destination"
                                        value={to}
                                        onChange={(e) => setSearchParams({ to: e.target.value })}
                                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-base font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase"
                                    />
                                </div>

                                {/* DEPARTURE DATE */}
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 ml-1">
                                        <Calendar className="w-3 h-3 inline mr-1" />
                                        Departure
                                    </label>
                                    <input
                                        type="date"
                                        value={journeyDate}
                                        onChange={(e) => setSearchParams({ journeyDate: e.target.value })}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>

                                {/* RETURN DATE */}
                                {tripType === "RT" && (
                                    <div className="lg:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-600 mb-2 ml-1">
                                            <Calendar className="w-3 h-3 inline mr-1" />
                                            Return
                                        </label>
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => setSearchParams({ returnDate: e.target.value })}
                                            min={journeyDate || new Date().toISOString().split("T")[0]}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* TRAVELERS & CLASS */}
                                <div className={tripType === "RT" ? "lg:col-span-3" : "lg:col-span-5"}>
                                    <label className="block text-xs font-semibold text-slate-600 mb-2 ml-1">
                                        <Users className="w-3 h-3 inline mr-1" />
                                        Travelers & Class
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowPaxModal(!showPaxModal)}
                                            className="w-full border-2 border-slate-200 rounded-xl p-3 text-left flex items-center justify-between hover:border-blue-500 transition-all bg-white"
                                        >
                                            <span className="text-sm font-semibold text-slate-700">
                                                {totalPax} Traveler{totalPax > 1 ? "s" : ""},{" "}
                                                {getCabinLabel(cabin)}
                                            </span>
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        </button>

                                        {/* PASSENGER DROPDOWN */}
                                        {showPaxModal && (
                                            <div
                                                className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 p-6 z-50 max-w-md"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Adults */}
                                                <div className="flex items-center justify-between mb-5">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">Adults</p>
                                                        <p className="text-xs text-slate-500">12+ years</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setSearchParams({ adults: Math.max(1, adults - 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-lg">
                                                            {adults}
                                                        </span>
                                                        <button
                                                            onClick={() => setSearchParams({ adults: Math.min(9, adults + 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between mb-5">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">Children</p>
                                                        <p className="text-xs text-slate-500">2-11 years</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setSearchParams({ children: Math.max(0, children - 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-lg">
                                                            {children}
                                                        </span>
                                                        <button
                                                            onClick={() => setSearchParams({ children: Math.min(9, children + 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">Infants</p>
                                                        <p className="text-xs text-slate-500">Under 2 years</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setSearchParams({ infants: Math.max(0, infants - 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-lg">
                                                            {infants}
                                                        </span>
                                                        <button
                                                            onClick={() => setSearchParams({ infants: Math.min(adults, infants + 1) })}
                                                            className="w-9 h-9 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Cabin Class */}
                                                <div className="border-t pt-5">
                                                    <p className="font-semibold text-slate-800 mb-3">
                                                        Cabin Class
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { val: "E", label: "Economy" },
                                                            { val: "P", label: "Premium" },
                                                            { val: "B", label: "Business" },
                                                            { val: "F", label: "First" },
                                                        ].map((c) => (
                                                            <button
                                                                key={c.val}
                                                                onClick={() => setSearchParams({ cabin: c.val })}
                                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${cabin === c.val
                                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                                    }`}
                                                            >
                                                                {c.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setShowPaxModal(false)}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 mt-5 font-semibold transition-colors"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SEARCH BUTTON - Full Width on Mobile */}
                            <div className="mt-6">
                                <button
                                    onClick={loading ? handleCancel : handleSearch}
                                    disabled={loading}
                                    className={`w-full md:w-auto md:px-12 h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${loading
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Stop Search
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            Search Flights
                                        </>
                                    )}
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- RESULTS SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 mt-8 pb-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* SIDEBAR FILTERS (Sticky on Desktop) */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                                    {searchComplete && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                            <Check className="w-3 h-3 mr-1" /> Complete
                                        </Badge>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setFilters({
                                            isDirect: false,
                                            isRefundable: false,
                                            priceRange: [0, 500000]
                                        });
                                        setVisualPriceRange([0, 500000]);
                                    }}
                                    className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Price Range */}
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Price Range</h3>
                                    <div className="px-2">
                                        <Slider
                                            defaultValue={[0, 100000]}
                                            max={150000}
                                            step={1000}
                                            value={[visualPriceRange[0], visualPriceRange[1]]}
                                            onValueChange={(val) => setVisualPriceRange([val[0], val[1]])}
                                            onValueCommit={(val) => setFilters({ priceRange: [val[0], val[1]] })}
                                            className="mb-4"
                                        />
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                            <span>₹{visualPriceRange[0].toLocaleString()}</span>
                                            <span>₹{visualPriceRange[1].toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stops */}
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Stops</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={isDirect}
                                                onChange={() => setFilters({ isDirect: !isDirect })}
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                                            />
                                            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">Non-stop</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                                            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">1 Stop</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                                            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">2+ Stops</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Refundable */}
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Booking Class</h3>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={isRefundable}
                                            onChange={() => setFilters({ isRefundable: !isRefundable })}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                                        />
                                        <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">Refundable</span>
                                    </label>
                                </div>

                                {/* Departure Time */}
                                <div className="border-b border-slate-100 pb-4">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Departure Time</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex flex-col items-center p-3 border border-slate-100 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                                            <SunMedium className="w-5 h-5 text-amber-500 mb-1" />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">Morning</span>
                                            <span className="text-[10px] text-slate-400">06:00 - 12:00</span>
                                        </button>
                                        <button className="flex flex-col items-center p-3 border border-blue-600 bg-blue-50 rounded-lg">
                                            <SunMedium className="w-5 h-5 text-blue-600 mb-1" />
                                            <span className="text-[10px] font-bold uppercase text-blue-600">Afternoon</span>
                                            <span className="text-[10px] text-blue-400">12:00 - 18:00</span>
                                        </button>
                                        <button className="col-span-2 flex flex-col items-center p-3 border border-slate-100 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                                            <Moon className="w-5 h-5 text-indigo-500 mb-1" />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">Evening & Night</span>
                                            <span className="text-[10px] text-slate-400">18:00 - 06:00</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Airlines */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Airlines</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                                                <Globe className="w-3 h-3 text-blue-800" />
                                            </div>
                                            <span className="text-sm text-slate-700">British Airways</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                            <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                                                <Plane className="w-3 h-3 text-red-800" />
                                            </div>
                                            <span className="text-sm text-slate-700">Virgin Atlantic</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN RESULTS */}
                    <div className="flex-1 space-y-6">

                        {/* VALUE TABS */}
                        {/* VALUE TABS */}
                        {flights.length > 0 && (
                            <div className="grid grid-cols-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer">
                                <div
                                    onClick={() => setSortType("CHEAPEST")}
                                    className={`flex flex-col items-center justify-center p-4 border-r border-slate-100 transition-colors cursor-pointer ${sortType === "CHEAPEST" ? "bg-blue-50 border-b-2 border-b-blue-600" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <span className={`text-xs font-bold uppercase ${sortType === "CHEAPEST" ? "text-blue-600" : "text-slate-500"}`}>Cheapest</span>
                                    <span className={`text-lg font-bold ${sortType === "CHEAPEST" ? "text-blue-600" : "text-slate-800"}`}>
                                        ₹{Math.min(...flights.map(f => f.NetFare || f.GrossFare || 0)).toLocaleString()}
                                    </span>
                                    <span className={`text-xs ${sortType === "CHEAPEST" ? "text-blue-400" : "text-slate-400"}`}>Best Value</span>
                                </div>

                                <div
                                    onClick={() => setSortType("BEST")}
                                    className={`flex flex-col items-center justify-center p-4 border-r border-slate-100 transition-colors cursor-pointer ${sortType === "BEST" ? "bg-blue-50 border-b-2 border-b-blue-600" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <span className={`text-xs font-bold uppercase ${sortType === "BEST" ? "text-blue-600" : "text-slate-500"}`}>Best</span>
                                    <span className={`text-lg font-bold ${sortType === "BEST" ? "text-blue-600" : "text-slate-800"}`}>
                                        ₹{Math.round((flights[0]?.NetFare || flights[0]?.GrossFare || 0)).toLocaleString()}
                                    </span>
                                    <span className={`text-xs ${sortType === "BEST" ? "text-blue-400" : "text-slate-400"}`}>Balanced</span>
                                </div>

                                <div
                                    onClick={() => setSortType("FASTEST")}
                                    className={`flex flex-col items-center justify-center p-4 transition-colors cursor-pointer ${sortType === "FASTEST" ? "bg-blue-50 border-b-2 border-b-blue-600" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <span className={`text-xs font-bold uppercase ${sortType === "FASTEST" ? "text-blue-600" : "text-slate-500"}`}>Fastest</span>
                                    <span className={`text-lg font-bold ${sortType === "FASTEST" ? "text-blue-600" : "text-slate-800"}`}>
                                        {(flights.find(f => {
                                            const parts = f.Duration.match(/(\d+)h\s*(\d+)m/);
                                            // simple check for shortest duration to display price
                                            // Just displaying the first flight's price for now or finding min duration flight?
                                            // Let's just show "--" or find the fastest flight price
                                            return true;
                                        })?.Duration) || "--"}
                                    </span>
                                    <span className={`text-xs ${sortType === "FASTEST" ? "text-blue-400" : "text-slate-400"}`}>Shortest Time</span>
                                </div>
                            </div>
                        )}

                        {/* ERROR & LOADING */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-blue-100">
                                <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Searching Flights...</h3>
                                <p className="text-slate-500">We're finding the best options for your trip.</p>
                                <button
                                    onClick={handleCancel}
                                    className="mt-6 text-red-600 font-semibold hover:bg-red-50 px-6 py-2 rounded-full transition-colors"
                                >
                                    Cancel Search
                                </button>
                            </div>
                        )}

                        {/* FLIGHT LIST */}
                        <div className="space-y-4">
                            {paginatedFlights.map((f, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row items-stretch">
                                        {/* LEFT: Flight Details */}
                                        <div className="flex-1 p-6 md:p-8">
                                            {/* Airline Header */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold">
                                                    {f.MAC}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-base">
                                                        {f.AirlineName?.split('|')[0]}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Flight {f.FlightNo} • {f.Cabin === 'E' ? 'Economy' : f.Cabin}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Route Info */}
                                            <div className="flex items-center justify-between gap-4 md:gap-12">
                                                {/* Dep */}
                                                <div className="text-left">
                                                    <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
                                                        {formatTime(f.DepartureTime)}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-600">{f.From}</p>
                                                    <p className="text-xs text-slate-400">Departure</p>
                                                </div>

                                                {/* Graphic */}
                                                <div className="flex-1 flex flex-col items-center gap-1">
                                                    <p className="text-xs font-semibold text-slate-500">{f.Duration}</p>
                                                    <div className="w-full relative flex items-center px-4">
                                                        <div className="h-[2px] w-full bg-slate-200"></div>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Plane className="w-4 h-4 text-blue-500 bg-white px-0.5 rotate-45" />
                                                        </div>
                                                    </div>
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${f.Stops === 0 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                        {f.Stops === 0 ? "Non-stop" : `${f.Stops} Stop(s)`}
                                                    </p>
                                                </div>

                                                {/* Arr */}
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
                                                        {formatTime(f.ArrivalTime)}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-600">{f.To}</p>
                                                    <p className="text-xs text-slate-400">Arrival</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: Price & Action */}
                                        <div className="w-full md:w-64 bg-slate-50 p-6 md:p-8 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100">
                                            <div className="text-center md:text-right mb-4">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                    Total Price
                                                </p>
                                                <p className="text-3xl font-extrabold text-slate-800">
                                                    ₹{Math.round(f.NetFare || f.GrossFare).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleBook(f)}
                                                disabled={loadingIndex !== null}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {loadingIndex === f.Index ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        Select <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* FOOTER: Actions */}
                                    <div className="px-6 py-3 bg-white border-t border-slate-50 flex items-center gap-6">
                                        <button
                                            onClick={() => handleViewInfo(f)}
                                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <Info className="w-3.5 h-3.5" />
                                            Flight Details
                                        </button>
                                        <button
                                            onClick={() => handleFareRules(f)}
                                            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                                        >
                                            <ScrollText className="w-3.5 h-3.5" />
                                            Fare Rules
                                        </button>

                                        <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                            <Luggage className="w-3.5 h-3.5" />
                                            Baggage fees may apply
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PAGINATION CONTROLS */}
                        {visibleFlights.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-semibold text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS (Info & Rules) --- */}
            {activeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
                            {activeModal === "info" ? (
                                <>
                                    <Building2 className="w-6 h-6 text-white" />
                                    <h2 className="text-xl font-bold text-white flex-1 ml-3">
                                        Flight Itinerary
                                    </h2>
                                </>
                            ) : (
                                <>
                                    <Ticket className="w-6 h-6 text-white" />
                                    <h2 className="text-xl font-bold text-white flex-1 ml-3">
                                        Fare Rules & Policy
                                    </h2>
                                </>
                            )}

                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
                            {loadingModal ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                </div>
                            ) : activeModal === "info" ? (
                                /* Flight Info Content */
                                <div>
                                    {/* Route Info Header */}
                                    {modalData && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 flex items-center justify-between">
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-slate-800">
                                                    {modalData.From}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-1">Departure</p>
                                            </div>

                                            <div className="flex-1 mx-6">
                                                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full relative">
                                                    <Plane className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5" />
                                                </div>
                                                <p className="text-center text-xs text-slate-500 mt-2">
                                                    {modalData.Trips?.[0]?.Journey?.[0]?.Segments?.[0]?.Flight
                                                        ?.Duration}
                                                </p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-slate-800">
                                                    {modalData.To}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-1">Arrival</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Segments */}
                                    <div className="space-y-6">
                                        {modalData?.Trips?.[0]?.Journey?.[0]?.Segments?.map(
                                            (seg: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition-colors"
                                                >
                                                    {/* Airline Info */}
                                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                                            {seg.Flight?.MAC}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800">
                                                                {seg.Flight?.Airline?.split("|")[0]}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {seg.Flight?.AirCraft} •{" "}
                                                                {seg.Flight?.FlightNo}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Departure */}
                                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-1">
                                                                DEPARTURE
                                                            </p>
                                                            <p className="text-2xl font-bold text-slate-800">
                                                                {formatTime(seg.Flight?.DepartureTime)}
                                                            </p>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                {formatDate(seg.Flight?.DepartureTime)}
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-800 mt-2">
                                                                {seg.Flight?.DepAirportName?.split("|")[0]}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Terminal {seg.Flight?.DepartureTerminal || "N/A"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-500 mb-1">
                                                                ARRIVAL
                                                            </p>
                                                            <p className="text-2xl font-bold text-slate-800">
                                                                {formatTime(seg.Flight?.ArrivalTime)}
                                                            </p>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                {formatDate(seg.Flight?.ArrivalTime)}
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-800 mt-2">
                                                                {seg.Flight?.ArrAirportName?.split("|")[0]}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Terminal {seg.Flight?.ArrivalTerminal || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Fare Breakdown */}
                                                    <div className="bg-slate-50 rounded-xl p-4">
                                                        <p className="font-bold text-slate-800 mb-3 text-sm">
                                                            Fare Breakdown
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-slate-600">Base Fare</span>
                                                                <span className="font-semibold">
                                                                    ₹
                                                                    {Math.round(
                                                                        seg.Fares?.TotalBaseFare || 0
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-slate-600">
                                                                    Taxes & Fees
                                                                </span>
                                                                <span className="font-semibold">
                                                                    ₹
                                                                    {Math.round(
                                                                        seg.Fares?.TotalTax || 0
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-base font-bold pt-2 border-t">
                                                                <span>Total</span>
                                                                <span className="text-blue-600">
                                                                    ₹
                                                                    {Math.round(
                                                                        seg.Fares?.GrossFare || 0
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        {!modalData?.Trips?.[0]?.Journey?.[0]?.Segments && (
                                            <div className="text-center py-10 text-slate-500">
                                                No flight details available.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Fare Rules Content */
                                <div>
                                    {modalData?.Code === "1099" ? (
                                        <div className="text-center py-16">
                                            <ScrollText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-lg font-bold text-slate-600 mb-2">
                                                No Detailed Rules
                                            </p>
                                            <p className="text-slate-500">
                                                Airline has not provided text rules.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {modalData?.Trips?.[0]?.Journey?.[0]?.Segments?.map(
                                                (seg: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="mb-8 border-2 border-slate-200 rounded-2xl overflow-hidden"
                                                    >
                                                        {/* Segment Header */}
                                                        <div className="bg-gradient-to-r from-slate-100 to-blue-50 p-4 flex items-center justify-between">
                                                            <span className="font-bold text-slate-800">
                                                                {seg.Rules?.[0]?.OrginDestination ||
                                                                    `${seg.Flight?.From} → ${seg.Flight?.To}`}
                                                            </span>
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {seg.VAC || seg.Flight?.MAC}
                                                            </span>
                                                        </div>

                                                        {/* Rules Table */}
                                                        <div className="p-6">
                                                            {seg.Rules?.map((ruleSet: any, rIdx: number) => (
                                                                <div key={rIdx} className="mb-6">
                                                                    {ruleSet.Rule?.map(
                                                                        (ruleCat: any, cIdx: number) => (
                                                                            <div key={cIdx} className="mb-4">
                                                                                <h4 className="font-bold text-slate-800 mb-3">
                                                                                    {ruleCat.Head || "Fee Details"}
                                                                                </h4>

                                                                                <table className="w-full text-sm">
                                                                                    <thead>
                                                                                        <tr className="bg-slate-100">
                                                                                            <th className="text-left p-3 font-semibold text-slate-700">
                                                                                                Time Frame
                                                                                            </th>
                                                                                            <th className="text-right p-3 font-semibold text-slate-700">
                                                                                                Fee (INR)
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {ruleCat.Info?.map(
                                                                                            (fee: any, fIdx: number) => (
                                                                                                <tr
                                                                                                    key={fIdx}
                                                                                                    className="border-b border-slate-200 hover:bg-slate-50"
                                                                                                >
                                                                                                    <td className="p-3 text-slate-700">
                                                                                                        {fee.Description}
                                                                                                    </td>
                                                                                                    <td className="p-3 text-right font-semibold">
                                                                                                        ₹
                                                                                                        {fee.AdultAmount ||
                                                                                                            fee.Amount ||
                                                                                                            "0"}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )
                                                                                        )}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ))}

                                                            {seg.Rules?.[0]?.FareRuleText && (
                                                                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                                                                    {seg.Rules[0].FareRuleText}
                                                                </div>
                                                            )}

                                                            {(!seg.Rules || seg.Rules.length === 0) && (
                                                                <div className="text-center py-8 text-slate-500">
                                                                    No specific rules available for this segment.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}

                                            {!modalData?.Trips?.[0]?.Journey?.[0]?.Segments && (
                                                <div className="text-center py-10 text-slate-500">
                                                    No detailed fare rules available for this flight.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}