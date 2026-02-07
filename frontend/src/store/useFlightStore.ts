import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TripType = 'ON' | 'RT' | 'MC';
export type CabinClass = 'E' | 'P' | 'B' | 'F';
export type SortType = 'CHEAPEST' | 'BEST' | 'FASTEST';

export interface Flight {
    [key: string]: any;
}

export interface SearchParams {
    tripType: TripType;
    from: string;
    to: string;
    journeyDate: string;
    returnDate: string;
    adults: number;
    children: number;
    infants: number;
    cabin: CabinClass;
    isStudent: boolean;
    isNearby: boolean;
}

export interface FlightStore {
    // Search Params (API Affecting)
    searchParams: SearchParams;
    setSearchParams: (params: Partial<SearchParams>) => void;

    // Results
    flights: Flight[];
    setFlights: (flights: Flight[]) => void;
    // Selected Flight for Booking
    selectedFlight: Flight | null;
    setSelectedFlight: (flight: Flight | null) => void;

    searchTui: string | null;
    setSearchTui: (tui: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string;
    setError: (error: string) => void;

    // Client-Side Filters & Sorting
    filters: {
        isDirect: boolean;
        isRefundable: boolean;
        priceRange: [number, number];
    };
    setFilters: (filters: Partial<FlightStore['filters']>) => void;

    sortType: SortType;
    setSortType: (type: SortType) => void;

    // Actions
    resetState: () => void;
}

const DEFAULT_PARAMS: SearchParams = {
    tripType: 'ON',
    from: 'BOM',
    to: 'DEL',
    journeyDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabin: 'E',
    isStudent: false,
    isNearby: true,
};

const DEFAULT_FILTERS = {
    isDirect: false,
    isRefundable: false,
    priceRange: [0, 500000] as [number, number],
};

export const useFlightStore = create<FlightStore>()(
    persist(
        (set) => ({
            searchParams: DEFAULT_PARAMS,
            setSearchParams: (params) =>
                set((state) => ({ searchParams: { ...state.searchParams, ...params } })),

            flights: [],
            setFlights: (flights) => set({ flights }),

            selectedFlight: null,
            setSelectedFlight: (selectedFlight) => set({ selectedFlight }),

            searchTui: null,
            setSearchTui: (searchTui) => set({ searchTui }),

            loading: false,
            setLoading: (loading) => set({ loading }),

            error: '',
            setError: (error) => set({ error }),

            filters: DEFAULT_FILTERS,
            setFilters: (filters) =>
                set((state) => ({ filters: { ...state.filters, ...filters } })),

            sortType: 'CHEAPEST',
            setSortType: (sortType) => set({ sortType }),

            resetState: () =>
                set({
                    searchParams: DEFAULT_PARAMS,
                    filters: DEFAULT_FILTERS,
                    flights: [],
                    selectedFlight: null,
                    searchTui: null,
                    loading: false,
                    error: '',
                    sortType: 'CHEAPEST'
                }),
        }),
        {
            name: 'flight-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                // Only persist search params and maybe TUI, avoid persisting huge flight lists if possible, 
                // but for now let's persist params to satisfy the requirement
                searchParams: state.searchParams,
                searchTui: state.searchTui,
                selectedFlight: state.selectedFlight,
                // filters: state.filters
            }),
        }
    )
);
