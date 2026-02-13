// ============================================
// TypeScript Interfaces
// ============================================

export interface SearchPayload {
    ADT: number;
    CHD: number;
    INF: number;
    Cabin: string;
    Source: string;
    Mode: string;
    ClientID: string;
    TUI: string;
    FareType: string;
    IsMultipleCarrier?: boolean;
    IsRefundable?: boolean;
    preferedAirlines?: string | null;
    SecType?: string;
    Trips: {
        From: string;
        To: string;
        OnwardDate: string;
        ReturnDate?: string;
        TUI: string;
    }[];
    Parameters: {
        Airlines: string;
        GroupType: string;
        Refundable: string;
        IsDirect: boolean;
        IsStudentFare: boolean;
        IsNearbyAirport: boolean;
        IsExtendedSearch?: string;
    };
}

export interface SmartPricerPayload {
    Trips: {
        Amount: number;
        Index: string;
        OrderID: number;
        TUI?: string;
    }[];
    ClientID: string;
    Mode: string;
    Options: string;
    Source: string;
    TripType: string;
    ADT?: number;
    CHD?: number;
    INF?: number;
    TUI?: string;
}

export interface CreateItineraryPayload {
    TUI: string;
    ContactInfo: {
        Title?: string;
        FName: string;
        LName: string;
        Mobile: string;
        Phone?: string;
        Email: string;
        Address?: string;
        CountryCode?: string;
        State?: string;
        City?: string;
        PIN?: string;
        GSTCompanyName?: string;
        GSTTIN?: string;
        GSTMobile?: string;
        GSTEmail?: string;
        UpdateProfile?: boolean;
        IsGuest?: boolean;
    };
    Travellers: {
        ID: number;
        PaxID?: string;
        Operation?: string;
        Title: string;
        FName: string;
        LName: string;
        Email?: string;
        PMobileNo?: string;
        Age: number;
        DOB: string;
        Gender: string;
        Country?: string;
        PTC: string;
        Nationality: string;
        PassportNo?: string;
        PLI?: string;
        PDOI?: string;
        PDOE?: string;
        VisaType?: string;
        EmigrationCheck?: boolean;
        isOptionSelected?: boolean;
        ApproverManagers?: any;
        DocumentType?: string;
    }[];
    PLP: any[];
    SSR: any[];
    CrossSell: any[];
    EnableFareMasking?: boolean;
    AgentTourCode?: string;
    BRulesAccepted?: string;
    NetAmount: number;
    SSRAmount: number;
    ClientID: string;
    DeviceID?: string;
    AppVersion?: string;
    CrossSellAmount: number;
}


export interface StartPayPayload {
    TransactionID: number;
    PaymentAmount: number;
    NetAmount: number;
    StartPay?: boolean;
    BrowserKey: string;
    ClientID: string;
    TUI: string;
    Hold: boolean;
    Promo?: any;
    PaymentType: string;
    BankCode: string;
    GateWayCode: string;
    MerchantID: string;
    PaymentCharge: number;
    ReleaseDate: string;
    OnlinePayment: boolean;
    DepositPayment: boolean;
    Card: {
        Number: string;
        Expiry: string;
        CVV: string;
        CHName: string;
        Address: string;
        City: string;
        State: string;
        Country: string;
        PIN: string;
        International: boolean;
        SaveCard: boolean;
        FName: string;
        LName: string;
        EMIMonths: string;
    };
    VPA: string;
    CardAlias: string;
    QuickPay: any;
    RMSSignature: string;
    TargetCurrency: string;
    TargetAmount: number;
    ServiceType: string;
}

export interface SignaturePayload {
    MerchantID: string;
    ApiKey: string;
    ClientID: string;
    Password: string;
    AgentCode: string;
    BrowserKey: string;
    Key?: string;
}

export interface GetBookingListPayload {
    ClientID: string;
    Service: string;
    Status: string;
    TransactionType: string;
    BookingFromDate: string;
    BookingToDate: string;
    TUI?: string;
    TransactionID?: string;
    PNR?: string;
    TravelFromDate?: string;
    TravelToDate?: string;
}

export interface TravelCheckListPayload {
    TUI: string;
    ClientID: string;
}

export interface TravellerCheckItem {
    PassportNo: number;  // 1 = required, 0 = optional
    DOB: number;
    Nationality: number;
    VisaType: number;
    PDOE: number; // Passport Date of Expiry
    PLI: number;  // Place of Issue?
    PDOI: number; // Passport Date of Issue
    PANNo: number;
    EmigCheck: number;
}

export interface FnuLnuSetting {
    AirlineCode: string;
    TitleMandatory: boolean;
    Fnumessage: string;
    Lnumessage: string;
}

export interface TravelCheckListResponse {
    Code: string;
    Msg: string[];
    TravellerCheckList: TravellerCheckItem[];
    FnuLnuSettings: FnuLnuSetting[];
    IsHRMSMandatory: boolean;
}

// ============================================
// API Configuration
// ============================================

const API_BASE_URL = 'http://13.228.159.25:3001/flight';
const UTILS_BASE_URL = 'http://13.228.159.25:3001/utils/utils';
const BOOKING_BASE_URL = 'http://13.228.159.25:3001/flight/Utils';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc3MDMxNjYxMCwiZXhwIjoxNzc4OTU2NjEwLCJpYXQiOjE3NzAzMTY2MTAsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.7VC2odats4DI-2BSGe2c4fuFx55q3Gnsh1YEnJKQpwI';
const HEADER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc3MDMxNzAxNCwiZXhwIjoxNzc4OTU3MDE0LCJpYXQiOjE3NzAzMTcwMTQsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.gsA7CieqP_iqgAS43q1W_PRUlUWdI8L__LDxHVx_1V8';

// ============================================
// Flight API Client
// ============================================

export const flightApi = {
    // Logging Helper
    logAPI: (method: string, type: 'REQUEST' | 'RESPONSE' | 'ERROR', data: any) => {
        const emoji = type === 'REQUEST' ? '📤' : type === 'RESPONSE' ? '📥' : '❌';
        const color = type === 'REQUEST' ? 'color: #2563eb' : type === 'RESPONSE' ? 'color: #16a34a' : 'color: #dc2626';
        console.log(`%c${emoji} [${method}] ${type}`, color, data);
    },

    // 1. Authentication
    signature: async (payload: SignaturePayload) => {
        try {
            console.log('--- Signature Request ---');
            console.log('URL:', `${UTILS_BASE_URL}/Signature`);
            console.log('Payload:', payload);

            const response = await fetch(`${UTILS_BASE_URL}/Signature`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Signature Error Response:', errorText);
                throw new Error(`Authentication failed (${response.status})`);
            }

            const data = await response.json();
            console.log('Signature Response Data:', data);

            // Store token in sessionStorage
            if (data.Token) {
                sessionStorage.setItem('auth_token', data.Token);
                sessionStorage.setItem('client_id', data.ClientID);
            }
            return data;
        } catch (error) {
            console.error('Signature Method Error:', error);
            throw error;
        }
    },

    // 1.1 WebSettings - Get enabled features
    getWebSettings: async (clientId: string, tui: string) => {
        try {
            console.log('--- WebSettings Request ---');
            // Endpoint: {UtilsURL}/Utils/WebSettings
            // Note: UTILS_BASE_URL is '.../utils/utils', so we need to be careful with path
            // Looking at Signature: `${UTILS_BASE_URL}/Signature` -> `.../utils/utils/Signature`
            // Required: `.../utils/utils/WebSettings` ? Or just `/Utils/WebSettings` relative to some base?
            // User provided: "End Point : {UtilsURL}/Utils/WebSettings"
            // If UTILS_BASE_URL is 'http://13.228.159.25:3001/utils/utils', then `${UTILS_BASE_URL}/WebSettings` might be correct if the second 'utils' is the controller.
            // Let's assume standard pattern with UTILS_BASE_URL.

            const url = `${UTILS_BASE_URL}/WebSettings`;
            console.log('URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ ClientID: clientId, TUI: tui }),
            });

            if (!response.ok) {
                throw new Error(`WebSettings failed (${response.status})`);
            }

            const data = await response.json();
            console.log('WebSettings Response:', data);
            return data;
        } catch (error) {
            console.error('WebSettings Error:', error);
            // Don't throw, just return null or empty to not block flow
            return null;
        }
    },

    // 2. Search - ExpressSearch
    expressSearch: async (payload: SearchPayload) => {
        try {
            flightApi.logAPI('ExpressSearch', 'REQUEST', payload);

            const response = await fetch(`${API_BASE_URL}/flights/ExpressSearch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('ExpressSearch Error Response:', errorData);
                throw new Error(errorData.message || 'Flight search failed');
            }

            const data = await response.json();
            flightApi.logAPI('ExpressSearch', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('ExpressSearch', 'ERROR', error);
            throw error;
        }
    },

    // 3. Get Search Results
    getExpSearch: async (clientId: string, tui: string, signal?: AbortSignal) => {
        try {
            flightApi.logAPI('GetExpSearch', 'REQUEST', { ClientID: clientId, TUI: tui });
            // Add 30-second timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 seconds

            const response = await fetch(`${API_BASE_URL}/flights/GetExpSearch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ ClientID: clientId, TUI: tui }),
                signal: signal
            });

            if (!response.ok) {
                if (response.status === 504) {
                    throw new Error('Gateway timeout - Flight API is taking too long to respond');
                }
                throw new Error(`Failed to fetch flight results (${response.status})`);
            }

            return await response.json();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // If the signal was aborted by the component (e.g. navigation), we should be silent
                // but we should check if it was a real timeout
                console.log('GetExpSearch aborted (Manual or Navigation)');
                throw error; // Re-throw so the caller can decide to be silent
            }
            flightApi.logAPI('GetExpSearch', 'ERROR', error);
            throw error;
        }
    },



    // 4. SmartPricer - Initiate fare validation (Direct Call)
    smartPricer: async (payload: SmartPricerPayload) => {
        try {
            flightApi.logAPI('SmartPricer', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/flights/SmartPricer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('SmartPricer Error Response:', errorText);
                throw new Error('SmartPricer failed');
            }

            const data = await response.json();
            flightApi.logAPI('SmartPricer', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('SmartPricer', 'ERROR', error);
            throw error;
        }
    },

    // 5. GetSPricer - Get validated fare details (Direct Call)
    getSPricer: async (clientId: string, tui: string) => {
        try {
            flightApi.logAPI('GetSPricer', 'REQUEST', { TUI: tui, ClientID: clientId });
            const response = await fetch(`${API_BASE_URL}/flights/GetSPricer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ TUI: tui, ClientID: clientId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('GetSPricer Error Response:', errorText);
                throw new Error('GetSPricer failed');
            }

            const data = await response.json();
            // Ensure TUI is preserved in the response object
            if (!data.TUI && tui) data.TUI = tui;
            flightApi.logAPI('GetSPricer', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('GetSPricer', 'ERROR', error);
            throw error;
        }
    },


    // 7. CreateItinerary - Create booking
    createItinerary: async (payload: CreateItineraryPayload) => {
        try {
            flightApi.logAPI('CreateItinerary', 'REQUEST', payload);

            const response = await fetch(`${API_BASE_URL}/flights/CreateItinerary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('CreateItinerary failed');
            }

            const data = await response.json();
            flightApi.logAPI('CreateItinerary', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('CreateItinerary', 'ERROR', error);
            throw error;
        }
    },

    // 8. StartPay - Process payment
    startPay: async (payload: StartPayPayload) => {
        try {
            flightApi.logAPI('StartPay', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/payment/StartPay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const data = await response.json();
            flightApi.logAPI('StartPay', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('StartPay', 'ERROR', error);
            throw error;
        }
    },

    // 9. FareRule - Get cancellation policy
    getFareRule: async (clientId: string, tui: string) => {
        try {
            const payload = { TUI: tui, ClientID: clientId };
            flightApi.logAPI('FareRule', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/flights/FareRule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ TUI: tui, ClientID: clientId }),
            });

            if (!response.ok) {
                throw new Error('FareRule failed');
            }

            const data = await response.json();
            flightApi.logAPI('FareRule', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('FareRule', 'ERROR', error);
            throw error;
        }
    },

    // 10. GetPrice - Get current price for TUI
    getPrice: async (tui: string) => {
        try {
            const payload = { TUI: tui };
            flightApi.logAPI('GetPrice', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/flights/GetPrice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ TUI: tui }),
            });

            if (!response.ok) {
                throw new Error('GetPrice failed');
            }

            const data = await response.json();

            // Ensure TUI is preserved in the response object
            if (!data.TUI && tui) {
                data.TUI = tui;
            }

            if (data.Code === "501") {
                const msg = data.Msg?.[0] || "No Data Found";
                throw new Error(msg);
            }

            return data;
        } catch (error) {
            flightApi.logAPI('GetPrice', 'ERROR', error);
            throw error;
        }
    },

    // 10. SeatLayout - Get seat map
    getSeatLayout: async (tui: string, fuid: string | number, airlineCode: string) => {
        try {
            const payload = {
                TUI: tui,
                PaidSSR: true,
                Trips: [
                    {
                        TUI: tui, // The API explicitly demands this
                        Journey: [
                            {
                                Provider: airlineCode,
                                Segments: [
                                    {
                                        FUID: Number(fuid),
                                        VAC: airlineCode
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            flightApi.logAPI('SeatLayout', 'REQUEST', payload);

            const response = await fetch(`${API_BASE_URL}/Flights/SeatLayout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('SeatLayout failed');
            }

            const data = await response.json();
            flightApi.logAPI('SeatLayout', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('SeatLayout', 'ERROR', error);
            throw error;
        }
    },

    // 11. SSR - Special Service Requests
    getSSR: async (tui: string, clientId: string) => {
        try {
            const payload = {
                ClientID: clientId,
                PaidSSR: true,
                Source: "LV",
                Trips: [{
                    TUI: tui,
                    Amount: 0,
                    OrderID: 1,
                    Index: ""
                }]
            };
            flightApi.logAPI('SSR', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/Flights/SSR`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('SSR failed');
            }

            const data = await response.json();
            flightApi.logAPI('SSR', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('SSR', 'ERROR', error);
            throw error;
        }
    },

    // 12. FlightInfo - Detailed flight information (requires full payload like SmartPricer)
    getFlightInfo: async (payload: any) => {
        try {
            flightApi.logAPI('FlightInfo', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/Flights/FlightInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('FlightInfo failed');
            }

            const data = await response.json();
            flightApi.logAPI('FlightInfo', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('FlightInfo', 'ERROR', error);
            throw error;
        }
    },

    // 13. FareRule - Get fare rules and cancellation policy (with full payload)
    getFareRuleDetails: async (payload: any) => {
        try {
            flightApi.logAPI('FareRuleDetails', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/Flights/FareRule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('FareRule failed');
            }

            const data = await response.json();
            flightApi.logAPI('FareRuleDetails', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('FareRuleDetails', 'ERROR', error);
            throw error;
        }
    },

    // 14. RetrieveBooking - Get booking details
    retrieveBooking: async (transactionId: number, clientId: string, tui?: string) => {
        try {
            // ⚠️ BOOKING_BASE_URL എന്നത് 'http://13.228.159.25:3001/flight/Utils' ആണെന്ന് ഉറപ്പാക്കുക
            const response = await fetch(`${BOOKING_BASE_URL}/RetrieveBooking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN // നിങ്ങളുടെ വാലിഡ് ടോക്കൺ ഇവിടെ ഉണ്ടെന്ന് ഉറപ്പാക്കുക
                },
                // ✅ പേലോഡ് ഇവിടെ മാറ്റം വരുത്തിയിരിക്കുന്നു
                body: JSON.stringify({
                    ReferenceNumber: String(transactionId), // API ആവശ്യപ്പെടുന്ന കൃത്യമായ പേര്
                    ReferenceType: "T",                    // 'T' എന്നാൽ Transaction
                    ServiceType: "FLT",                   // 'FLT' എന്നാൽ Flight
                    ClientID: clientId,
                    TUI: tui || '' // Use provided TUI or empty string
                }),
            });

            if (!response.ok) {
                throw new Error(`RetrieveBooking failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('RetrieveBooking Error:', error);
            throw error;
        }
    },

    // 15. GetBookingList
    getBookingList: async (payload: GetBookingListPayload) => {
        try {
            flightApi.logAPI('GetBookingList', 'REQUEST', payload);
            // Using the specific URL for GetBookings via proxy
            const response = await fetch('/api/utils/utils/GetBookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTH_TOKEN.replace('Bearer ', '')}`,
                    'token': HEADER_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('GetBookingList failed');
            }

            const data = await response.json();
            flightApi.logAPI('GetBookingList', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('GetBookingList', 'ERROR', error);
            throw error;
        }
    },

    // 15. Cancel - Cancel booking
    cancelBooking: async (payload: any) => {
        try {
            flightApi.logAPI('CancelBooking', 'REQUEST', payload);
            const response = await fetch(`${API_BASE_URL}/Flights/Cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Cancel failed');
            }

            const data = await response.json();
            flightApi.logAPI('CancelBooking', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('CancelBooking', 'ERROR', error);
            throw error;
        }
    },

    // 16. GetTravelCheckList - Get required field validation rules
    getTravelCheckList: async (tui: string, clientId: string): Promise<TravelCheckListResponse> => {
        try {
            const payload = { TUI: tui, ClientID: clientId };
            flightApi.logAPI('GetTravelCheckList', 'REQUEST', payload);
            const response = await fetch(`${BOOKING_BASE_URL}/GetTravelCheckList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                },
                body: JSON.stringify({ TUI: tui, ClientID: clientId }),
            });

            if (!response.ok) {
                throw new Error(`GetTravelCheckList failed (${response.status})`);
            }

            const data = await response.json();
            flightApi.logAPI('GetTravelCheckList', 'RESPONSE', data);
            return data;
        } catch (error) {
            flightApi.logAPI('GetTravelCheckList', 'ERROR', error);
            throw error;
        }
    },

    // ============================================
    // Helper Functions
    // ============================================

    generateBrowserKey: () => {
        return Array.from({ length: 32 }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    },

    getStoredToken: () => {
        return sessionStorage.getItem('auth_token') || AUTH_TOKEN;
    },

    getStoredClientId: () => {
        return sessionStorage.getItem('client_id') || 'FVI6V120g22Ei5ztGK0FIQ==';
    }
};
