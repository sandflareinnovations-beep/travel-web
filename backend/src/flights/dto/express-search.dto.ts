export class TripDto {
    From: string;
    To: string;
    ReturnDate: string;
    OnwardDate: string;
    TUI: string;
}

export class ParametersDto {
    Airlines: string;
    GroupType: string;
    Refundable: string;
    IsDirect: boolean;
    IsStudentFare: boolean;
    IsNearbyAirport: boolean;
    IsExtendedSearch?: string;
}

export class ExpressSearchDto {
    FareType: string;
    ADT: number;
    CHD: number;
    INF: number;
    Cabin: string;
    Source: string;
    Mode: string;
    ClientID: string;
    IsMultipleCarrier: boolean;
    IsRefundable: boolean;
    preferedAirlines: string | null;
    TUI: string;
    SecType: string;
    Trips: TripDto[];
    Parameters: ParametersDto;
}
