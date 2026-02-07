# B2B Flight API Integration - README

## 🚀 Quick Start

This application integrates with the Benzy Infotech B2B Flight API for flight booking services.

### Environment Configuration

**Test Environment URLs:**
- **Utils API:** `https://b2bapiutils.benzyinfotech.com`
- **Flight API:** `https://b2bapiflights.benzyinfotech.com`

**Test Credentials:**
```
MerchantID: 300
ApiKey: kXAY9yHARK
ClientID: FVI6V120g22Ei5ztGK0FIQ==
Password: staging@1
```

## 📋 Implemented APIs

### ✅ Currently Integrated

| API | Endpoint | Status | Location |
|-----|----------|--------|----------|
| **ExpressSearch** | `/flights/ExpressSearch` | ✅ Implemented | Backend: `FlightsService.expressSearch()` |
| **GetExpSearch** | `/flights/GetExpSearch` | ✅ Implemented | Backend: `FlightsService.getExpSearch()` |
| **SmartPricer** | `/Flights/SmartPricer` | ✅ Implemented | Backend: `FlightsService.smartPricer()` |

### 🔄 To Be Implemented

| API | Endpoint | Priority | Purpose |
|-----|----------|----------|---------|
| **Signature** | `/Utils/Signature` | 🔴 High | Authentication |
| **GetSPricer** | `/Flights/GetSPricer` | 🔴 High | Get validated fare details |
| **CreateItinerary** | `/Flights/CreateItinerary` | 🔴 High | Create booking |
| **StartPay** | `/Payment/StartPay` | 🔴 High | Process payment |
| **FareRule** | `/Flights/FareRule` | 🟡 Medium | Cancellation policy |
| **RetrieveBooking** | `/Utils/RetrieveBooking` | 🟡 Medium | Get booking details |
| **Cancel** | `/Flights/Cancel` | 🟡 Medium | Cancel booking |
| **GetBookings** | `/Utils/GetBookings` | 🟢 Low | List bookings |
| **SeatLayout** | `/Flights/SeatLayout` | 🟢 Low | Seat selection |
| **SSR** | `/Flights/SSR` | 🟢 Low | Meals/baggage |
| **FlightInfo** | `/Flights/FlightInfo` | 🟢 Low | Flight details |

## 🔧 Current Implementation

### Backend (NestJS)

**Files:**
- `backend/src/flights/flights.service.ts` - Flight API service
- `backend/src/flights/flights.controller.ts` - API endpoints
- `backend/src/utils/utils.service.ts` - Utility APIs
- `backend/.env` - Configuration

**Endpoints:**
```
POST /flights/express-search      → ExpressSearch
POST /flights/get-exp-search       → GetExpSearch  
POST /flights/smart-pricer         → SmartPricer
POST /utils/signature              → Signature (Utils)
POST /utils/web-settings           → WebSettings
```

### Frontend (Next.js + React)

**Files:**
- `frontend/src/lib/api.ts` - API client
- `frontend/src/components/FlightSearchCard.tsx` - Search form

**Implemented Features:**
- ✅ Flight search form with passenger selection
- ✅ Real-time search with polling
- ✅ Auto-navigation to results page with TUI
- ⚠️ Results display (needs completion)
- ❌ Fare details page
- ❌ Booking form
- ❌ Payment flow

## 📊 Complete Booking Flow

```
1. [✅] ExpressSearch → Get SearchTUI
2. [✅] GetExpSearch (poll) → Get flight list  
3. [✅] SmartPricer → Initiate fare validation
4. [❌] GetSPricer → Get fare details & pricing
5. [❌] CreateItinerary → Create booking with passengers
6. [❌] StartPay → Process payment
7. [❌] Confirmation → Show PNR & booking details
```

## 🔑 Configuration

### Backend Environment Variables

```env
# API URLs
UTILS_API_BASE_URL="https://b2bapiutils.benzyinfotech.com"
FLIGHT_API_BASE_URL="https://b2bapiflights.benzyinfotech.com"

# Credentials
MERCHANT_ID="300"
API_KEY="kXAY9yHARK"
CLIENT_ID="bitest"
PASSWORD="staging@1"
```

### Frontend Configuration

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://b2bapiflights.benzyinfotech.com';
```

## 🎯 Next Steps

### Priority 1: Complete Core Booking Flow

1. **Add GetSPricer API**
   - Backend service method
   - Frontend API call
   - Fare details display page

2. **Add CreateItinerary API**
   - Passenger form component
   - Validation for passenger data
   - API integration

3. **Add StartPay API**
   - Payment page
   - Deposit payment flow
   - Booking confirmation display

### Priority 2: Authentication

1. **Implement Signature API**
   - Generate BrowserKey
   - Store Token in session
   - Use Token for all API calls
   - Token refresh logic

### Priority 3: Enhanced Features

1. **FareRule** - Show cancellation policy
2. **SeatLayout** - Seat selection
3. **SSR** - Meal and baggage selection
4. **Booking Management** - View/cancel bookings

## 📝 API Usage Examples

### Search Flights

```typescript
// 1. Search
const searchResult = await flightApi.expressSearch({
  ADT: 1, CHD: 0, INF: 0,
  Cabin: "E",
  FareType: "ON",
  Trips: [{ From: "BOM", To: "DEL", OnwardDate: "2025-03-15" }]
});

// 2. Get Results (with polling)
const flights = await flightApi.pollForResults(
  "FVI6V120g22Ei5ztGK0FIQ==",
  searchResult.TUI
);

// 3. User selects flight → SmartPricer
const token = await flightApi.smartPricer({
  Trips: [{ 
    Amount: selectedFlight.NetFare,
    Index: selectedFlight.Index,
    OrderID: 1
  }],
  ClientID: "FVI6V120g22Ei5ztGK0FIQ==",
  TripType: "ON"
});
```

## ⚠️ Known Issues

1. **Hardcoded Authentication** - Currently using hardcoded token instead of Signature API
2. **Missing GetSPricer** - Cannot get validated fare details
3. **No Booking Flow** - CreateItinerary and StartPay not implemented
4. **Results Page Incomplete** - Flight results display needs completion

## 🧪 Testing

### Test Flight Search
- **Route:** BOM → DEL (Mumbai to Delhi)
- **Date:** Any future date
- **Passengers:** 1 Adult

### Expected Flow
1. Fill search form
2. Click "Search Flights"
3. Redirects to `/flights?tui=...`
4. **(TODO)** Results page polls and displays flights
5. **(TODO)** Click flight → Show fare details
6. **(TODO)** Enter passenger info → Create booking
7. **(TODO)** Payment → Confirmation

## 📚 Documentation

- **Full API Docs:** See `API_INTEGRATION_GUIDE.md` (user provided)
- **Postman Collection:** Available from Benzy Infotech
- **Support:** Contact Benzy Infotech technical team

## 🏗️ Architecture

```
Frontend (Next.js)
  └─> API Client (lib/api.ts)
      └─> Backend (NestJS)
          └─> External API (Benzy Infotech)
```

**Why Backend Proxy?**
- Secure credential storage
- Token management
- Request/response transformation
- Error handling
- Rate limiting

---

**Last Updated:** 2026-01-28  
**Status:** 🟡 Partial Implementation - Core booking flow incomplete
