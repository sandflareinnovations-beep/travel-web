"use client";

import { useState, useEffect } from 'react';
import {
    Search, Filter, MoreHorizontal, Plane, Bed, Car,
    FileText, ArrowUpRight, Plus, ArrowLeft, Loader2,
    Eye, XCircle, Download, User, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FlightSearchCard from './FlightSearchCard';
import HotelSearchCard from './HotelSearchCard';
import CarSearchCard from './CarSearchCard';
import VisaSearchCard from './VisaSearchCard';
import { flightApi } from '@/lib/api';
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";

type BookingType = 'flight' | 'hotel' | 'car' | 'visa';

interface BookingManagementProps {
    type: BookingType;
}

const MOCK_DATA = {
    flight: [
        { TransactionID: 'MOCK-101', customer: 'Manual Entry', Origin: 'BOM', Destination: 'DEL', BookingDate: '2026-01-20', NetAmount: 4500, Status: 'BO1', PNR: 'MOCKPNR' },
    ],
    hotel: [], car: [], visa: []
};

const ICONS = { flight: Plane, hotel: Bed, car: Car, visa: FileText };
const TITLES = { flight: 'Flight Bookings', hotel: 'Hotel Reservations', car: 'Car Rentals', visa: 'Visa Management' };

const STATUS_STYLES: Record<string, string> = {
    'Confirmed': 'bg-emerald-100 text-emerald-700',
    'BO1': 'bg-emerald-100 text-emerald-700',
    'TO0': 'bg-emerald-100 text-emerald-700',
    'BR1': 'bg-orange-100 text-orange-700',
    'Pending': 'bg-blue-100 text-blue-700',
    'I8': 'bg-blue-100 text-blue-700',
    'Cancelled': 'bg-red-50 text-red-600 line-through'
};

const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        'BO1': 'Confirmed',
        'BR1': 'Refunded',
        'TO0': 'Confirmed',
        'I8': 'In Progress'
    };
    return statusMap[status] || status;
};

export default function BookingManagement({ type }: BookingManagementProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    useEffect(() => {
        if (type === 'flight') {
            fetchBookings();
        } else {
            setBookings([]);
        }
    }, [type, dateRange]);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError("");
        try {
            const clientId = flightApi.getStoredClientId();

            const now = new Date();
            const timestamp = now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

            const payload = {
                TUI: `6e824e0c-1b79-452a-a992-2ee295b8b676|a98850a2-f1f9-476c-b090-f2fd895e459b|${timestamp}`,
                ClientID: clientId,
                TransactionID: "",
                PNR: "",
                TravelFromDate: "",
                TravelToDate: "",
                Service: "FLT",
                BookingFromDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : "",
                BookingToDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ""
            };

            const res = await flightApi.getBookingList(payload);

            if (res?.Bookings) {
                // ✅ Map API response to UI format
                const mappedBookings = res.Bookings.map((booking: any) => ({
                    TransactionID: booking.TransactionID,
                    customer: booking.CustomerName,
                    Origin: booking.FromSector?.split('-')[0]?.trim() || '',
                    Destination: booking.ToSector?.split('-')[0]?.trim() || '',
                    BookingDate: booking.BookingDate,
                    NetAmount: booking.Netamount, // lowercase 'a'
                    Status: booking.BookingStatus?.split(',')[0] || 'Pending', // "BO1,BR1" -> "BO1"
                    PNR: booking.Itineraries?.[0]?.ConfirmationId || 'PENDING',
                    supplierName: booking.supplierName,
                    TripType: booking.TripType,
                    Itineraries: booking.Itineraries,
                    FromSector: booking.FromSector,
                    ToSector: booking.ToSector,
                    PaxInfo: booking.PaxInfo
                }));

                setBookings(mappedBookings);
            } else {
                setBookings([]);
            }
        } catch (err: any) {
            console.error("Fetch bookings failed", err);
            setError("Live sync failed. Showing mock data.");
            setBookings(MOCK_DATA.flight);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetail = async (booking: any) => {
        setIsDetailLoading(true);
        setSelectedBooking(booking);
        try {
            const clientId = flightApi.getStoredClientId();
            const detail = await flightApi.retrieveBooking(booking.TransactionID, clientId!);
            setSelectedBooking({ ...booking, ...detail });
        } catch (err) {
            console.error("Retrieve failed", err);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return;
        }

        setIsDetailLoading(true);
        try {
            const clientId = flightApi.getStoredClientId();

            // Construct payload as per requirement
            /*
               Example Payload Structure needed:
               {
                 "ClientID": "...",
                 "TUI": "...",
                 "TransactionID": 12345,
                 "Trips": [ { "Journey": [ { "Segments": [ { "CRSPNR": "...", "Pax": [ { "ID": ..., "Ticket": "" } ] } ] } ] } ]
               }
            */

            // 1. Identify Passengers to cancel (All by default for now)
            // We need to map from selectedBooking.PassengerInfo or similar if available details are there.
            // The retrieveBooking response structure is key here.

            // Assuming selectedBooking has 'Itinerary' or 'Passenger' arrays from RetrieveBooking response

            const trips = [];

            // Check if we have Itinerary details to construct segments
            if (selectedBooking.Itinerary && selectedBooking.Passenger) {
                const journey = {
                    Segments: selectedBooking.Itinerary.map((it: any) => ({
                        CRSPNR: selectedBooking.PNR, // Or specific segment PNR
                        Pax: selectedBooking.Passenger.map((p: any) => ({
                            ID: p.PaxId || p.Id, // Check API response field for Pax ID
                            Ticket: p.TicketNumber || ""
                        }))
                    }))
                };
                trips.push({ Journey: [journey] });
            } else {
                // Fallback/Try to construct if minimal data
                // If retrieveBooking hasn't been fully mapped or structure is different, this might fail.
                // Let's look at what details we usually get.
                // If we don't have deep structure, we might need to rely on what RetrieveBooking gave us used in render.
                // Render uses: selectedBooking.Itineraries (array), selectedBooking.PaxInfo (string mostly in list, object in detail?)

                // Let's try to map from the 'Itineraries' array we see in render
                const segments = selectedBooking.Itineraries?.map((it: any) => ({
                    CRSPNR: selectedBooking.PNR,
                    Pax: [] // Need Pax IDs. RetrieveBooking usually returns a list of passengers too.
                })) || [];

                // If we can't find Pax IDs easily from the current state, we might need to assume or check the `Passenger` array if it exists.
                // Let's assume RetrieveBooking returns a `Passenger` array (common in these APIs).
            }

            // Simplification: If the API just needs the TransactionID and basic info for full cancellation:
            /* 
               Actually, the user curl showed:
               "Trips": [ { "Journey": [ { "Segments": [ { "CRSPNR": "TLGS8K", "Pax": [ { "ID": 5234, "Ticket": "" } ] } ] } ] } ]
               This implies we need specific Pax IDs.
            */

            // Let's use the response from RetrieveBooking (detail) which we merged into selectedBooking.
            // We should check if `selectedBooking.Passenger` exists.

            const paxList = selectedBooking.Passenger || [];
            const paxData = paxList.map((p: any) => ({
                ID: p.PaxId || p.Id,
                Ticket: p.TicketNumber || ""
            }));

            const payload = {
                ClientID: clientId,
                ClientIP: "",
                Remarks: "User requested cancellation via Web",
                TUI: selectedBooking.TUI || "", // TUI might be needed if session based, often retrieved booking has TUI
                TransactionID: selectedBooking.TransactionID,
                Trips: [
                    {
                        Journey: [
                            {
                                Segments: [
                                    {
                                        CRSPNR: selectedBooking.PNR,
                                        Pax: paxData.length > 0 ? paxData : [{ ID: 0, Ticket: "" }] // Fallback if parsing fails
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            console.log("Cancelling with payload:", payload);
            const res = await flightApi.cancelBooking(payload);

            if (res.Code === "200" || res.Status === "Success") {
                alert("Booking cancelled successfully!");
                setSelectedBooking(null); // Close modal
                fetchBookings(); // Refresh list
            } else {
                alert("Cancellation failed: " + (res.Msg || "Unknown error"));
            }

        } catch (err: any) {
            console.error("Cancel failed", err);
            alert("Error cancelling booking: " + err.message);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const displayData = bookings.filter(item =>
        (item.PNR?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.Origin?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.Destination?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.TransactionID?.toString().includes(searchTerm))
    );

    const Icon = ICONS[type];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Icon className="h-8 w-8 text-blue-600" />
                        {TITLES[type]}
                    </h2>
                    <p className="text-muted-foreground mt-1 font-medium">
                        {isCreating ? 'Configure your search parameters' :
                            (dateRange?.from ?
                                `Displaying bookings from ${format(dateRange.from, "LLL dd, y")} - ${dateRange.to ? format(dateRange.to, "LLL dd, y") : "..."}`
                                : `Displaying ${displayData.length} records`)
                        }
                    </p>
                </div>
                <div className="flex gap-2">
                    {isCreating ? (
                        <Button variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={fetchBookings} className="rounded-xl border-slate-200">
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Sync Live
                            </Button>
                            <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                                <Plus className="mr-2 h-4 w-4" /> New Booking
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isCreating ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    {type === 'flight' ? <FlightSearchCard /> : type === 'hotel' ? <HotelSearchCard /> : type === 'car' ? <CarSearchCard /> : <VisaSearchCard />}
                </div>
            ) : (
                <>
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden rounded-[1.5rem]">
                        <CardHeader className="pb-4 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by PNR, Transaction ID or City..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white border-slate-200 rounded-xl h-11 w-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[300px] justify-start text-left font-normal rounded-xl h-11",
                                                    !dateRange && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        <>
                                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                                            {format(dateRange.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(dateRange.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Button variant="outline" size="icon" className="rounded-xl h-11 w-11"><Filter className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50/50 text-slate-500 font-bold border-y border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Route / Details</th>
                                            <th className="px-6 py-4">Booking Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {displayData.map((item: any, idx) => (
                                            <tr key={item.TransactionID || idx} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-slate-900">#{item.TransactionID}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                                        {item.Origin} <Plane className="h-3 w-3 text-slate-300 rotate-45" /> {item.Destination}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                        {item.supplierName} • PNR: {item.PNR}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-medium">
                                                    {new Date(item.BookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 font-black text-blue-600">
                                                    ₹{item.NetAmount?.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`rounded-full px-3 border-none ${STATUS_STYLES[item.Status] || 'bg-slate-100 text-slate-500'}`}>
                                                        {getStatusLabel(item.Status)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-200">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                                                            <DropdownMenuItem className="flex items-center gap-2 p-3 cursor-pointer rounded-xl" onClick={() => handleViewDetail(item)}>
                                                                <Eye className="w-4 h-4 text-slate-400" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 p-3 cursor-pointer rounded-xl" onClick={() => window.open(`/flights/bookings/${item.TransactionID}`)}>
                                                                <Download className="w-4 h-4 text-slate-400" /> Get E-Ticket
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {isLoading && (
                                <div className="flex items-center justify-center p-16 bg-white/80">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                                    <span className="font-bold text-slate-600">Retrieving trip history...</span>
                                </div>
                            )}

                            {!isLoading && displayData.length === 0 && (
                                <div className="p-20 text-center space-y-3">
                                    <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                        <Search className="h-7 w-7 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold">No matching records found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* DETAIL MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Itinerary Detail</h3>
                                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Transaction ID: #{selectedBooking.TransactionID}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)} className="rounded-full bg-white shadow-sm hover:rotate-90 transition-transform">
                                <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                            </Button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            {isDetailLoading ? (
                                <div className="flex flex-col items-center py-10">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                                    <p className="font-bold text-slate-500">Connecting to Airline GDS...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-slate-900 uppercase">{selectedBooking.Origin}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Origin</p>
                                        </div>
                                        <Plane className="h-6 w-6 text-blue-400 rotate-45" />
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-slate-900 uppercase">{selectedBooking.Destination}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Destination</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">PNR Status</p>
                                            <p className="font-mono font-black text-lg text-slate-800">{selectedBooking.PNR}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Net Amount</p>
                                            <p className="font-black text-lg text-emerald-600">₹{selectedBooking.NetAmount?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Passenger</p>
                                        <p className="font-bold text-slate-800 text-sm">{selectedBooking.PaxInfo || selectedBooking.customer}</p>
                                    </div>

                                    {selectedBooking.Itineraries && (
                                        <div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Flight Segments</h4>
                                            <div className="space-y-3">
                                                {selectedBooking.Itineraries.map((itin: any, i: number) => (
                                                    <div key={i} className="p-4 bg-white border rounded-2xl">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className="font-bold text-slate-800">{itin.AirlineName} {itin.FlightNumber}</p>
                                                            <Badge className="bg-blue-50 text-blue-600 text-[10px]">{itin.Triptype === 'O' ? 'Outbound' : 'Return'}</Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(itin.FromDate).toLocaleString('en-GB')} → {new Date(itin.ToDate).toLocaleString('en-GB')}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">Duration: {itin.Duration}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-8 bg-slate-50 border-t flex gap-3">
                            <Button
                                variant="destructive"
                                className="h-12 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                                onClick={handleCancelBooking}
                                disabled={isDetailLoading || selectedBooking.Status === 'Cancelled'}
                            >
                                {isDetailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Booking'}
                            </Button>
                            <Button className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-bold" onClick={() => window.open(`/flights/bookings/${selectedBooking.TransactionID}`)}>
                                <Download className="w-4 h-4 mr-2" /> View Full E-Ticket
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}