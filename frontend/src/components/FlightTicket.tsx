import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Plane, User, Briefcase, Info } from 'lucide-react';

interface FlightTicketProps {
    booking: any;
}

const FlightTicket = forwardRef<HTMLDivElement, FlightTicketProps>(({ booking }, ref) => {
    // Debug: Log the booking structure
    console.log('FlightTicket received booking:', booking);

    // Extract flight data safely - handle different API response structures
    const trip = booking?.Trips?.[0]?.Journey?.[0]?.Segments?.[0];
    const flight = trip?.Flight || trip;

    // Extract passenger data - check multiple possible locations
    const passengers = booking?.Passengers || booking?.Travellers || [];
    const pnr = booking?.PNR || booking?.BookingID || booking?.Ref || 'N/A';

    // Extract flight details with multiple fallbacks
    const origin = flight?.Origin || flight?.From || trip?.Origin || 'DEL';
    const destination = flight?.Destination || flight?.To || trip?.Destination || 'BOM';
    const flightNumber = flight?.FlightNumber || flight?.FN || flight?.Number || 'XX-000';
    const airline = flight?.Airline || flight?.AirlineName || 'Airline';
    const originTerminal = flight?.OriginTerminal || flight?.FromTerminal || 'Terminal';
    const destTerminal = flight?.DestinationTerminal || flight?.ToTerminal || 'Terminal';

    // Parse dates
    const departureTime = flight?.DepartureTime || flight?.DT
        ? new Date(flight.DepartureTime || flight.DT)
        : new Date();
    const arrivalTime = flight?.ArrivalTime || flight?.AT
        ? new Date(flight.ArrivalTime || flight.AT)
        : new Date();

    // Extract pricing
    const baseFare = booking?.BaseFare || booking?.Base || 0;
    const taxFees = booking?.Tax || booking?.Taxes || 0;
    const totalAmount = booking?.TotalAmount || booking?.NetAmount || booking?.GrossFare || 0;

    // Extract baggage
    const cabin = booking?.SSR?.find((s: any) => s.Type === 'Baggage' || s.Code?.includes('CABIN'))?.Weight || '7 Kg';
    const checkin = booking?.SSR?.find((s: any) => s.Type === 'Baggage' && s.Code?.includes('CHECK'))?.Weight || '20 Kg';

    // Fare rules
    const fareRules = booking?.FareRules || [];

    // Flight type (Direct/Connecting)
    const hops = flight?.Hops || 0;
    const flightType = hops === 0 ? 'Direct' : `${hops} Stop${hops > 1 ? 's' : ''}`;

    // Extract passenger name
    const passengerName = passengers?.[0]
        ? `${passengers[0].Title || ''} ${passengers[0].FName || passengers[0].FirstName || ''} ${passengers[0].LName || passengers[0].LastName || ''}`.trim()
        : booking?.ContactInfo?.FName
            ? `${booking.ContactInfo.FName} ${booking.ContactInfo.LName || ''}`.trim()
            : 'Passenger';

    // Generate QR code data (PNR + flight info)
    const qrData = `PNR:${pnr}|FLIGHT:${flightNumber}|FROM:${origin}|TO:${destination}|DATE:${departureTime.toLocaleDateString()}`;

    return (
        <div
            ref={ref}
            style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                backgroundColor: '#ffffff',
                width: '800px',
                padding: '48px',
            }}
        >
            {/* Header - Booking Confirmed */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ backgroundColor: '#22c55e', borderRadius: '9999px', padding: '6px' }}>
                        <CheckCircle style={{ height: '28px', width: '28px', color: '#ffffff', strokeWidth: 2.5 }} />
                    </div>
                    <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Booking Confirmed</h1>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Your flight has been successfully booked</p>
            </div>

            {/* Main Ticket Card */}
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0f2fe',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <img
                        src="/ticket-logo.png"
                        alt="FLYINCO"
                        style={{ height: '64px', objectFit: 'contain' }}
                    />
                </div>

                {/* Flight Route */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>{origin}</div>
                        <div style={{ fontSize: '16px', color: '#4b5563', marginTop: '4px', fontWeight: '600' }}>
                            {departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {departureTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{originTerminal}</div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', marginBottom: '8px' }}>
                            <div style={{ height: '2px', width: '128px', backgroundColor: '#38bdf8' }} />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#0ea5e9',
                                borderRadius: '9999px',
                                padding: '8px'
                            }}>
                                <Plane style={{ height: '20px', width: '20px', color: '#ffffff', transform: 'rotate(90deg)' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{flightType}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>{airline} #{flightNumber}</div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>{destination}</div>
                        <div style={{ fontSize: '16px', color: '#4b5563', marginTop: '4px', fontWeight: '600' }}>
                            {arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {arrivalTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{destTerminal}</div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '24px 0' }} />

                {/* Passenger Details */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passenger Details</h3>
                    {passengers.map((pax: any, idx: number) => (
                        <div key={idx} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    backgroundColor: '#0ea5e9',
                                    color: '#ffffff',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                                        {pax.Title} {pax.FName || pax.FirstName} {pax.LName || pax.LastName}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                        {pax.PTC} • Seat: {pax.SeatNumber || 'TBA'}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                Confirmed
                            </div>
                        </div>
                    ))}
                </div>

                {/* Baggage */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Check-in</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{checkin}</div>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cabin</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{cabin}</div>
                    </div>
                </div>

                {/* Pricing */}
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Base Fare</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>₹{baseFare.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Taxes & Fees</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>₹{taxFees.toLocaleString()}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Total Paid Amount</span>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#0ea5e9' }}>₹{totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Fare Rules */}
                {fareRules.length > 0 && (
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px', textTransform: 'uppercase' }}>Fare Rules</h4>
                        {fareRules.map((rule: string, idx: number) => (
                            <div key={idx} style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>• {rule}</div>
                        ))}
                    </div>
                )}

                {/* PNR & QR Code */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>PNR Number</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', letterSpacing: '0.05em' }}>{pnr}</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <QRCodeSVG
                            value={qrData}
                            size={100}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#9ca3af' }}>
                <p style={{ margin: '0 0 4px 0' }}>Please arrive at the airport 2 hours before departure</p>
                <p style={{ margin: 0 }}>Scan QR code at check-in counter • Keep this ticket safe</p>
            </div>
        </div>
    );
});

FlightTicket.displayName = 'FlightTicket';

export default FlightTicket;
