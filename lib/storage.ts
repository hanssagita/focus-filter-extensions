export interface StorageData {
    isBlockingEnabled: boolean;
    blockedSites: string[];
}

const STORAGE_KEYS = {
    IS_BLOCKING_ENABLED: 'isBlockingEnabled',
    BLOCKED_SITES: 'blockedSites',
} as const;

// Helper functions for storage operations using chrome.storage.local
export async function getIsBlockingEnabled(): Promise<boolean> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.IS_BLOCKING_ENABLED);
    return result[STORAGE_KEYS.IS_BLOCKING_ENABLED] ?? true;
}

export async function setIsBlockingEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.IS_BLOCKING_ENABLED]: enabled });
}

export async function getBlockedSites(): Promise<string[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.BLOCKED_SITES);
    return result[STORAGE_KEYS.BLOCKED_SITES] ?? [];
}

export async function setBlockedSites(sites: string[]): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.BLOCKED_SITES]: sites });
}

export async function addBlockedSite(site: string): Promise<void> {
    const sites = await getBlockedSites();
    if (!sites.includes(site)) {
        await setBlockedSites([...sites, site]);
    }
}

export async function removeBlockedSite(site: string): Promise<void> {
    const sites = await getBlockedSites();
    await setBlockedSites(sites.filter((s) => s !== site));
}
