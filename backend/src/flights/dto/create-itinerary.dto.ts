export class ContactInfoDto {
    Title: string;
    FName: string;
    LName: string;
    Mobile: string;
    Phone: string;
    Email: string;
    Address: string;
    CountryCode: string;
    State: string;
    City: string;
    PIN: string;
    GSTCompanyName: string;
    GSTTIN: string;
    GSTMobile: string;
    GSTEmail: string;
    UpdateProfile: boolean;
    IsGuest: boolean;
}

export class TravellerDto {
    ID: number;
    Title: string;
    FName: string;
    LName: string;
    Age: number;
    DOB: string;
    Gender: string;
    PTC: string;
    Nationality: string;
    PassportNo: string;
    PLI: string;
    PDOE: string;
    VisaType: string;
}

export class CreateItineraryDto {
    TUI: string;
    ContactInfo: ContactInfoDto;
    Travellers: TravellerDto[];
    PLP: any[]; // Or specific type if known
    SSR: any[]; // Or specific type if known
    CrossSell: any[]; // Or specific type if known
    NetAmount: number;
    SSRAmount: number;
    ClientID: string;
    DeviceID: string;
    AppVersion: string;
    CrossSellAmount: number;
}
