export class SSRTripDto {
    Amount: number;
    Index: string;
    OrderID: number;
    TUI: string;
}

export class SSRDto {
    PaidSSR: boolean;
    ClientID: string;
    Source: string;
    FareType: string;
    Trips: SSRTripDto[];
}
