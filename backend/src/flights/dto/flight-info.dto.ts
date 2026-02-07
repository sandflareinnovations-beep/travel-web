export class FlightInfoTripDto {
    TUI: string;
    Amount: string;
    OrderID: number;
    Index: string;
}

export class FlightInfoDto {
    ClientID: string;
    Trips: FlightInfoTripDto[];
    TripType: string;
}
