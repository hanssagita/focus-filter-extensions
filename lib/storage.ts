export interface StorageData {
    isBlockingEnabled: boolean;
    blockedSites: string[];
    timerState: TimerState;
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

