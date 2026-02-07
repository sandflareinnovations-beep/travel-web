export class CardDto {
    Number: string;
    Expiry: string;
    CVV: string;
    CHName: string;
    Address: string;
    City: string;
    State: string;
    Country: string;
    PIN: string;
    International: boolean;
    SaveCard: boolean;
    FName: string;
    LName: string;
    EMIMonths: string;
}

export class StartPayDto {
    TransactionID: number;
    PaymentAmount: number;
    NetAmount: number;
    BrowserKey: string;
    ClientID: string;
    TUI: string;
    Hold: boolean;
    Promo: any | null;
    PaymentType: string;
    BankCode: string;
    GateWayCode: string;
    MerchantID: string;
    PaymentCharge: number;
    ReleaseDate: string;
    OnlinePayment: boolean;
    DepositPayment: boolean;
    Card: CardDto;
    VPA: string;
    CardAlias: string;
    QuickPay: any | null;
    RMSSignature: string;
    TargetCurrency: string;
    TargetAmount: number;
    ServiceType: string;
}
