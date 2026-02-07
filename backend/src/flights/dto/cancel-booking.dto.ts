export class PaxDto {
    ID: number;
    Ticket: string;
}

export class SegmentDto {
    CRSPNR: string;
    Pax: PaxDto[];
}

export class JourneyDto {
    Segments: SegmentDto[];
}

export class CancelTripDto {
    Journey: JourneyDto[];
}

export class CancelBookingDto {
    ClientID: string;
    ClientIP: string;
    Remarks: string;
    TUI: string;
    TransactionID: number;
    Trips: CancelTripDto[];
}
