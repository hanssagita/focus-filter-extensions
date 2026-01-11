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
} from '../../lib/storage';

function App() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [blockedSites, setBlockedSitesState] = useState<string[]>([]);
    const [newSite, setNewSite] = useState('');

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            const enabled = await getIsBlockingEnabled();
            const sites = await getBlockedSites();
            setIsEnabled(enabled);
            setBlockedSitesState(sites);
        };
        loadData();
    }, []);

    const handleToggle = async (checked: boolean) => {
        setIsEnabled(checked);
        await setIsBlockingEnabled(checked);
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
        <div className="w-[400px] min-h-[500px] bg-background text-foreground dark">
            <Card className="border-0 rounded-none shadow-none">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">Focus</CardTitle>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`}>
                                {isEnabled ? 'Active' : 'Inactive'}
                            </span>
                            <Switch checked={isEnabled} onCheckedChange={handleToggle} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Add Site Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-foreground">Block Website</label>
                            <Tooltip content="Type a keyword (e.g., 'instagram') to block all sites containing it, including 'instagram.com', 'm.instagram.com', 'instagram.net', etc.">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs cursor-help hover:bg-primary hover:text-primary-foreground transition-colors">
                                    ?
                                </div>
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
                            <Button
                                onClick={handleAddSite}
                                disabled={!newSite.trim()}
                                className="px-6"
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Blocked Sites List */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                            Blocked Keywords ({blockedSites.length})
                        </label>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                            {blockedSites.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No blocked sites yet. Add one to get started.
                                </div>
                            ) : (
                                blockedSites.map((site) => (
                                    <div
                                        key={site}
                                        className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group"
                                    >
                                        <span className="text-sm font-mono text-foreground">{site}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveSite(site)}
                                            className="opacity-70 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
