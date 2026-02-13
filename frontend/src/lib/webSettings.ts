/**
 * WebSettings Utility
 * 
 * Handles feature availability checks based on WebSettings API response.
 * Each setting contains airline codes that have the feature enabled.
 */

export interface WebSettingItem {
    Key: string;
    Value: string | null;
}

export interface WebSettings {
    Settings?: WebSettingItem[];
}

/**
 * Parse WebSettings array into a clean key-value map
 * Handles duplicates by merging airline codes
 */
export function parseWebSettings(webSettings: WebSettings | null): Map<string, Set<string>> {
    const settingsMap = new Map<string, Set<string>>();

    if (!webSettings?.Settings) {
        return settingsMap;
    }

    for (const setting of webSettings.Settings) {
        const key = setting.Key?.trim();
        const value = setting.Value;

        // Skip invalid entries
        if (!key || value === null || value === undefined) {
            continue;
        }

        // Parse comma-separated airline codes
        const airlineCodes = value
            .split(',')
            .map(code => code.trim())
            .filter(code => code.length > 0); // Remove empty strings

        // Merge with existing codes (handles duplicates)
        if (!settingsMap.has(key)) {
            settingsMap.set(key, new Set());
        }

        const existingCodes = settingsMap.get(key)!;
        airlineCodes.forEach(code => existingCodes.add(code));
    }

    return settingsMap;
}

/**
 * Check if a feature is enabled for a specific airline
 * 
 * @param settingsMap - Parsed settings map from parseWebSettings()
 * @param featureKey - Feature key (e.g., "ShowSeatLayoutDom")
 * @param airlineCode - Airline code (e.g., "6E")
 * @returns true if feature is enabled for the airline, false otherwise
 */
export function isFeatureEnabled(
    settingsMap: Map<string, Set<string>>,
    featureKey: string,
    airlineCode: string
): boolean {
    const airlineCodes = settingsMap.get(featureKey);

    if (!airlineCodes) {
        return false;
    }

    return airlineCodes.has(airlineCode);
}

/**
 * Convenience function to check feature directly from WebSettings object
 * Parses settings on each call - use parseWebSettings() + isFeatureEnabled() for better performance
 */
export function checkFeature(
    webSettings: WebSettings | null,
    featureKey: string,
    airlineCode: string
): boolean {
    const settingsMap = parseWebSettings(webSettings);
    return isFeatureEnabled(settingsMap, featureKey, airlineCode);
}

// Common feature keys for type safety
export const FeatureKeys = {
    SHOW_SEAT_LAYOUT_DOM: 'ShowSeatLayoutDom',
    SHOW_SSR_DOM: 'ShowSSRDom',
    SHOW_BAGGAGE_DOM: 'ShowBaggageDom',
    SHOW_MEALS_DOM: 'ShowMealsDom',
    HOLD_CONFIRM_ENABLED_PROVIDERS: 'HoldConfirmEnabledProviders',
    AUTO_CANCEL_ENABLED: 'AutoCancelEnabled',
    AUTO_REFUND_ENABLED: 'AutoRefundEnabled',
} as const;
