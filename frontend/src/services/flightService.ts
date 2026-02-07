/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://localhost:3001/flights';

const headers = {
    'Content-Type': 'application/json',
};

// Generic helper for POST requests
async function postRequest(endpoint: string, data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error requesting ${endpoint}:`, error);
        throw error;
    }
}

export const FlightService = {
    // 1. Signature
    authenticate: (payload: any) => postRequest('/signature', payload),

    // 2 & 3. ExpressSearch (One-Way & Round-Trip)
    expressSearch: (payload: any) => postRequest('/express-search', payload),

    // 4. GetExpSearch
    getExpressSearchResults: (payload: any) => postRequest('/get-exp-search', payload),

    // 5. SmartPricer
    smartPricer: (payload: any) => postRequest('/smart-pricer', payload),

    // 6. GetSPricer
    getSmartPricerDetails: (payload: any) => postRequest('/get-s-pricer', payload),

    // 7. CreateItinerary
    createItinerary: (payload: any) => postRequest('/create-itinerary', payload),

    // 8. StartPay
    startPayment: (payload: any) => postRequest('/pay', payload),

    // 9. Cancel
    cancelBooking: (payload: any) => postRequest('/cancel', payload),

    // 10. RetrieveBooking
    retrieveBooking: (payload: any) => postRequest('/booking', payload),

    // 11. SeatLayout
    getSeatLayout: (payload: any) => postRequest('/seat-layout', payload),

    // 12. FlightInfo
    getFlightInfo: (payload: any) => postRequest('/flight-info', payload),

    // 13. SSR
    getSSR: (payload: any) => postRequest('/ssr', payload),

    // 14. FareRule
    getFareRules: (payload: any) => postRequest('/fare-rules', payload),

    // 15. GetBookings
    getBookings: (payload: any) => postRequest('/get-bookings', payload),
};
