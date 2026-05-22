export interface StorageData {
    isBlockingEnabled: boolean;
    blockedSites: string[];
    timerState: TimerState;
    isTabLimitEnabled: boolean;
    maxTabsLimit: number;
}

export interface TimerState {
    status: 'idle' | 'work' | 'break' | 'paused' | 'completed';
    startTime: number | null; // Timestamp when the timer started/resumed
    remainingTime: number; // Remaining time in seconds (used for pausing)
    duration: number; // Total duration in minutes (for reference)
    goal: string;
    workDuration: number;
    breakDuration: number;
    previousStatus?: 'work' | 'break';
}

export const STORAGE_KEYS = {
    IS_BLOCKING_ENABLED: 'isBlockingEnabled',
    BLOCKED_SITES: 'blockedSites',
    TIMER_STATE: 'timerState',
    IS_TAB_LIMIT_ENABLED: 'isTabLimitEnabled',
    MAX_TABS_LIMIT: 'maxTabsLimit',
    PASSWORD_HASH: 'focusPasswordHash',
} as const;

export const DEFAULT_TIMER_STATE: TimerState = {
    status: 'idle',
    startTime: null,
    remainingTime: 35 * 60,
    duration: 35,
    goal: '',
    workDuration: 35,
    breakDuration: 5,
};

// Helper functions for storage operations using chrome.storage.local
export async function getIsBlockingEnabled(): Promise<boolean> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.IS_BLOCKING_ENABLED) as any;
    return result[STORAGE_KEYS.IS_BLOCKING_ENABLED] ?? true;
}

export async function setIsBlockingEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.IS_BLOCKING_ENABLED]: enabled });
}

export async function getBlockedSites(): Promise<string[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.BLOCKED_SITES) as any;
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

export async function getTimerState(): Promise<TimerState> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.TIMER_STATE) as any;
    return result[STORAGE_KEYS.TIMER_STATE] ?? DEFAULT_TIMER_STATE;
}

export async function setTimerState(state: TimerState): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.TIMER_STATE]: state });
}

export async function updateTimerState(updates: Partial<TimerState>): Promise<void> {
    const currentState = await getTimerState();
    await setTimerState({ ...currentState, ...updates });
}

export async function getIsTabLimitEnabled(): Promise<boolean> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.IS_TAB_LIMIT_ENABLED) as any;
    return result[STORAGE_KEYS.IS_TAB_LIMIT_ENABLED] ?? false;
}

export async function setIsTabLimitEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.IS_TAB_LIMIT_ENABLED]: enabled });
}

export async function getMaxTabsLimit(): Promise<number> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.MAX_TABS_LIMIT) as any;
    // Default to 10
    return result[STORAGE_KEYS.MAX_TABS_LIMIT] ?? 10;
}

export async function setMaxTabsLimit(limit: number): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.MAX_TABS_LIMIT]: limit });
}

export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getPasswordHash(): Promise<string | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PASSWORD_HASH) as any;
    return result[STORAGE_KEYS.PASSWORD_HASH] ?? null;
}

export async function setPasswordHash(hash: string | null): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.PASSWORD_HASH]: hash });
}

export async function verifyPassword(password: string): Promise<boolean> {
    const hash = await getPasswordHash();
    if (!hash) return true;
    const inputHash = await hashPassword(password);
    return hash === inputHash;
}

