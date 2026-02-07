import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { FlightsService } from './flights.service';
import type { SearchPayload, SmartPricerPayload, SearchDto } from './flights.service';

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService) { }

    @Post('express-search')
    expressSearch(@Body() payload: SearchPayload, @Headers('authorization') authHeader: string) {
        return this.flightsService.expressSearch(payload, authHeader);
    }

    @Post('get-exp-search')
    getExpSearch(@Body() body: { ClientID: string, TUI: string }, @Headers('authorization') authHeader: string) {
        return this.flightsService.getExpSearch(body.ClientID, body.TUI, authHeader);
    }

    @Post('smart-pricer')
    smartPricer(@Body() payload: SmartPricerPayload, @Headers('authorization') authHeader: string) {
        return this.flightsService.smartPricer(payload, authHeader);
    }

    @Post('get-spricer')
    getSPricer(@Body() body: { tui: string }, @Headers('authorization') authHeader: string) {
        return this.flightsService.getSPricer(body.tui, authHeader);
    }

    @Post('create-itinerary')
    createItinerary(@Body() payload: any, @Headers('authorization') authHeader: string) {
        return this.flightsService.createItinerary(payload, authHeader);
    }

    @Post('start-pay')
    startPay(@Body() payload: any, @Headers('authorization') authHeader: string) {
        return this.flightsService.startPay(payload, authHeader);
    }

    @Get('search')
    search(@Query() query: SearchDto) {
        return this.flightsService.searchFlights(query);
    }
}
