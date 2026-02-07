import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface SearchPayload {
    ADT: number;
    CHD: number;
    INF: number;
    Cabin: string;
    Source: string;
    Mode: string;
    ClientID: string;
    TUI: string;
    FareType: string;
    IsMultipleCarrier?: boolean;
    IsRefundable?: boolean;
    preferedAirlines?: string | null;
    SecType?: string;
    Trips: {
        From: string;
        To: string;
        OnwardDate: string;
        ReturnDate?: string;
        TUI: string;
    }[];
    Parameters: {
        Airlines: string;
        GroupType: string;
        Refundable: string;
        IsDirect: boolean;
        IsStudentFare: boolean;
        IsNearbyAirport: boolean;
        IsExtendedSearch?: string;
    };
}

export interface SmartPricerPayload {
    Trips: {
        Amount: number;
        Index: string;
        OrderID: number;
        TUI?: string;
    }[];
    ClientID: string;
    Mode: string;
    Options: string;
    Source: string;
    TripType: string;
}


export class SearchDto {
    // Legacy DTO for searchFlights
}

@Injectable()
export class FlightsService {
    private readonly logger = new Logger(FlightsService.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        // User provided curl: http://13.228.159.25:3001/flight/flights/ExpressSearch
        // Previous assuming base was http://13.228.159.25:3001
        this.baseUrl = this.configService.get<string>('FLIGHT_API_BASE_URL') || 'http://13.228.159.25:3001/flight/';
    }

    async expressSearch(payload: SearchPayload, authHeader?: string) {
        try {
            // Demo token from user request as fallback
            const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const url = `${this.baseUrl}/flights/ExpressSearch`;
            this.logger.log(`Calling Flight API: ${url}`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in Express Search', error?.response?.data || error.message);
            throw error;
        }
    }

    async getExpSearch(clientId: string, tui: string, authHeader?: string) {
        try {
            const demoToken = this.configService.get<string>('TOKEN') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const payload = {
                ClientID: clientId,
                TUI: tui
            };

            const url = `${this.baseUrl}/flights/GetExpSearch`;
            this.logger.log(`Fetching flight results with TUI: ${tui}`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in GetExpSearch', error?.response?.data || error.message);
            throw error;
        }
    }

    async smartPricer(payload: SmartPricerPayload, authHeader?: string) {
        try {
            const demoToken = this.configService.get<string>('TOKEN') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const url = `${this.baseUrl}/flights/SmartPricer`;
            this.logger.log(`Calling SmartPricer for fare validation`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in SmartPricer', error?.response?.data || error.message);
            throw error;
        }
    }

    async getSPricer(tui: string, authHeader?: string) {
        try {
            const demoToken = this.configService.get<string>('TOKEN') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const payload = { TUI: tui };
            const url = `${this.baseUrl}/Flights/GetSPricer`;
            this.logger.log(`Getting validated fare for TUI: ${tui}`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in GetSPricer', error?.response?.data || error.message);
            throw error;
        }
    }

    async createItinerary(payload: any, authHeader?: string) {
        try {
            const demoToken = this.configService.get<string>('TOKEN') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const url = `${this.baseUrl}/Flights/CreateItinerary`;
            this.logger.log(`Creating itinerary`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in CreateItinerary', error?.response?.data || error.message);
            throw error;
        }
    }

    async startPay(payload: any, authHeader?: string) {
        try {
            const demoToken = this.configService.get<string>('TOKEN') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTU4MzIyMSwiZXhwIjoxNzc4MjIzMjIxLCJpYXQiOjE3Njk1ODMyMjEsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.OeQ-cX2rdc1cWBji0ul3BSYtqEYdYlmu42435BBUQJ8";

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authHeader || `Bearer ${demoToken}`
            };

            const url = `${this.baseUrl}/Payment/StartPay`;
            this.logger.log(`Processing payment for Transaction ID: ${payload.TransactionID}`);

            const { data } = await firstValueFrom(
                this.httpService.post(url, payload, { headers })
            );
            return data;
        } catch (error) {
            this.logger.error('Error in StartPay', error?.response?.data || error.message);
            throw error;
        }
    }

    // Keeping legacy method or updating it to use expressSearch if needed?
    // User asked for ExpressSearch endpoint specifically.
    // I will leave existing searchFlights as skeleton or alias if needed, but strictly add expressSearch.
    async searchFlights(searchDto: any) {
        return { message: "Use express-search endpoint for full features" };
    }
}
