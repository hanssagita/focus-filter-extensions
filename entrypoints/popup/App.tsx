import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Tooltip } from '../../components/ui/tooltip';
import {
    getIsBlockingEnabled,
    setIsBlockingEnabled,
    getBlockedSites,
    addBlockedSite,
    removeBlockedSite,
    getIsTabLimitEnabled,
    setIsTabLimitEnabled,
    getMaxTabsLimit,
    setMaxTabsLimit
} from '../../lib/storage';

function App() {
    const [activeTab, setActiveTab] = useState<'focus'>('focus');
    const [isEnabled, setIsEnabled] = useState(true);
    const [blockedSites, setBlockedSitesState] = useState<string[]>([]);
    const [newSite, setNewSite] = useState('');
    const [isTabLimitEnabled, setIsTabLimitEnabledState] = useState(false);
    const [maxTabsLimit, setMaxTabsLimitState] = useState(10);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            const enabled = await getIsBlockingEnabled();
            const sites = await getBlockedSites();
            const tabLimitEnabled = await getIsTabLimitEnabled();
            const tabLimit = await getMaxTabsLimit();

            setIsEnabled(enabled);
            setBlockedSitesState(sites);
            setIsTabLimitEnabledState(tabLimitEnabled);
            setMaxTabsLimitState(tabLimit);
        };
        loadData();
    }, []);

    const handleToggle = async (checked: boolean) => {
        setIsEnabled(checked);
        await setIsBlockingEnabled(checked);
    };

    const handleTabLimitToggle = async (checked: boolean) => {
        setIsTabLimitEnabledState(checked);
        await setIsTabLimitEnabled(checked);
    };

    const handleTabLimitChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            setMaxTabsLimitState(val);
            await setMaxTabsLimit(val);
        }
    };

    const handleAddSite = async () => {
        const trimmedSite = newSite.trim();
        if (trimmedSite && !blockedSites.includes(trimmedSite)) {
            await addBlockedSite(trimmedSite);
            const updatedSites = await getBlockedSites();
            setBlockedSitesState(updatedSites);
            setNewSite('');
        }
    };

    const handleRemoveSite = async (site: string) => {
        await removeBlockedSite(site);
        const updatedSites = await getBlockedSites();
        setBlockedSitesState(updatedSites);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddSite();
        }
    };

    return (
        <div className="w-[400px] min-h-[500px] bg-background text-foreground dark flex flex-col">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('focus')}
                        className={`text-sm font-semibold transition-colors relative ${activeTab === 'focus' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Focus
                        {activeTab === 'focus' && (
                            <div className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Global Focus Status Indicator (small) */}
                <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground/30'}`} title={isEnabled ? "Focus Mode Active" : "Focus Mode Inactive"} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'focus' && (
                    <Card className="border-0 rounded-none shadow-none bg-transparent">
                        <CardHeader className="space-y-4 pt-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">Focus Control</CardTitle>
                                <div className="flex items-center gap-3">
                                    <Switch checked={isEnabled} onCheckedChange={handleToggle} />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Tab Limit Section */}
                            <div className="space-y-3 pb-4 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-foreground">Limit Open Tabs</label>
                                        <Tooltip content="Automatically close new tabs if you exceed the limit.">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs cursor-help hover:bg-primary hover:text-primary-foreground transition-colors">?</div>
                                        </Tooltip>
                                    </div>
                                    <Switch checked={isTabLimitEnabled} onCheckedChange={handleTabLimitToggle} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-muted-foreground flex-1">Maximum allowed tabs</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={maxTabsLimit}
                                        onChange={handleTabLimitChange}
                                        disabled={!isTabLimitEnabled}
                                        className="w-20 text-center"
                                    />
                                </div>
                            </div>

                            {/* Add Site Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-foreground">Block Website</label>
                                    <Tooltip content="Type a keyword to block URLs containing it.">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs cursor-help hover:bg-primary hover:text-primary-foreground transition-colors">?</div>
                                    </Tooltip>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., instagram"
                                        value={newSite}
                                        onChange={(e) => setNewSite(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleAddSite} disabled={!newSite.trim()} className="px-6">Add</Button>
                                </div>
                            </div>

                            {/* Blocked Sites List */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-foreground">
                                    Blocked Keywords ({blockedSites.length})
                                </label>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {blockedSites.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            No blocked sites yet.
                                        </div>
                                    ) : (
                                        blockedSites.map((site) => (
                                            <div key={site} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group">
                                                <span className="text-sm font-mono text-foreground">{site}</span>
                                                <Button variant="ghost" size="sm" onClick={() => handleRemoveSite(site)} className="opacity-70 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive">✕</Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default App;
