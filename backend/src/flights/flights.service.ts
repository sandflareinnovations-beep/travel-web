
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type SearchDto = {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    cabinClass: string;
}

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) { }

    async searchFlights(searchDto: SearchDto) {
        // TODO: Implement external API integration
        return {
            source: 'LIVE',
            count: 0,
            results: []
        };
    }
}
