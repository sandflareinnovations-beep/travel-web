import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import type { SearchDto } from './flights.service';

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService) { }

    @Get('search')
    search(@Query() query: SearchDto) {
        return this.flightsService.searchFlights(query);
    }
}
