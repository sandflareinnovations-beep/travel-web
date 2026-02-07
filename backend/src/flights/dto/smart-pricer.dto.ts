export class PricingTripDto {
    Amount: number;
    Index: string;
    OrderID: number;
    TUI: string;
}

export class SmartPricerDto {
    Trips: PricingTripDto[];
    ClientID: string;
    Mode: string;
    Options: string;
    Source: string;
    TripType: string;
}
