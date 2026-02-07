import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UtilsService {
    private readonly logger = new Logger(UtilsService.name);
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('UTILS_API_BASE_URL') || 'http://13.228.159.25:3001/utils';
    }

    async getSignature(browserKey: string, key?: string) {
        const payload = {
            MerchantID: this.configService.get('MERCHANT_ID'),
            ApiKey: this.configService.get('API_KEY'),
            ClientID: this.configService.get('CLIENT_ID'),
            Password: this.configService.get('PASSWORD'),
            AgentCode: "",
            BrowserKey: browserKey,
            Key: key || 'ef20-925c-4489-bfeb-236c8b406f7e' // Default or passed
        };

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/utils/Signature`, payload)
            );
            return data;
        } catch (error) {
            this.logger.error('Error fetching signature', error?.response?.data || error.message);
            throw error;
        }
    }

    async getWebSettings(tui: string) {
        // Hardcoded for demo as per user request example, or add to env if critical.
        // Using the example ClientID from documentation for WebSettings
        const clientId = "aMfU5nwdsGUTiRhVVny5JJu/NWlx1ROD3YjYSfthSgDk=";

        const payload = {
            ClientID: clientId,
            TUI: tui
        };

        try {
            // distinct URL structure: {UtilsURL}/Utils/WebSettings
            // baseUrl is http://13.228.159.25:3001/utils
            // So endpoint is /WebSettings (case sensitive?) - doc says Utils/WebSettings, my base is params.
            // If baseUrl includes /utils, then just /WebSettings
            const { data } = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/WebSettings`, payload)
            );
            return data;
        } catch (error) {
            this.logger.error('Error fetching web settings', error?.response?.data || error.message);
            throw error;
        }
    }
}

