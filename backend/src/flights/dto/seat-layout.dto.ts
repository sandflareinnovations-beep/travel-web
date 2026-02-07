export class SeatTripDto {
    TUI: string;
    Index: string;
    OrderID: number;
    Amount: number;
}

export class SeatLayoutDto {
    ClientID: string;
    Source: string;
    Trips: SeatTripDto[];
}
