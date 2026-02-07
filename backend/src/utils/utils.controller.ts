import { Controller, Post, Body } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {
    constructor(private readonly utilsService: UtilsService) { }

    @Post('signature')
    getSignature(@Body() body: { browserKey: string, key?: string }) {
        return this.utilsService.getSignature(body.browserKey, body.key);
    }

    @Post('web-settings')
    getWebSettings(@Body() body: { tui: string }) {
        return this.utilsService.getWebSettings(body.tui);
    }
}

