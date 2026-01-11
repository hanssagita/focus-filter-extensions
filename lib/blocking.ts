/**
 * Core blocking logic for the Focus Filter extension.
 * Determines if a URL should be blocked based on keyword matching.
 */

/**
 * Checks if a URL should be blocked based on the blocked sites list.
 * @param url - The full URL to check
 * @param blockedSites - Array of keyword strings to match against
 * @param enabled - Whether blocking is globally enabled
 * @returns true if the URL should be blocked, false otherwise
 */
export function isUrlBlocked(
    url: string,
    blockedSites: string[],
    enabled: boolean
): boolean {
    if (!enabled || blockedSites.length === 0) {
        return false;
    }

    const urlLower = url.toLowerCase();

    return blockedSites.some((site) => {
        const siteLower = site.toLowerCase().trim();
        return siteLower && urlLower.includes(siteLower);
    });
}
