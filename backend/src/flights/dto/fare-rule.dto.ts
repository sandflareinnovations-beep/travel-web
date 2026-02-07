export class FareRuleTripDto {
    Amount: number;
    Index: string;
    OrderID: number;
    TUI: string;
}

export class FareRuleDto {
    Trips: FareRuleTripDto[];
    ClientID: string;
    Mode: string;
    Options: string;
    Source: string;
    TripType: string;
}
