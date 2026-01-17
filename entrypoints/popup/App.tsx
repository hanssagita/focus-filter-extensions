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
    const [activeTab, setActiveTab] = useState<'focus' | 'solstice'>('focus');
    const [isEnabled, setIsEnabled] = useState(true);
    const [blockedSites, setBlockedSitesState] = useState<string[]>([]);
    const [newSite, setNewSite] = useState('');

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            const enabled = await getIsBlockingEnabled();
            const sites = await getBlockedSites();
            setIsEnabled(enabled);
            setBlockedSitesState(sites);

            // Check audio status
            try {
                const response = await browser.runtime.sendMessage({ type: 'GET_AUDIO_STATUS' });
                if (response && response.isPlaying) {
                    setIsPlaying(true);
                }
            } catch (e) {
                // Ignore error if background not ready
            }
        };
        loadData();

        // Listen for status changes (e.g. if window closed manually)
        const messageListener = (message: any) => {
            if (message.type === 'AUDIO_STATUS_CHANGED') {
                setIsPlaying(message.isPlaying);
            }
        };
        browser.runtime.onMessage.addListener(messageListener);

        return () => {
            browser.runtime.onMessage.removeListener(messageListener);
        };
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

    // Audio Logic
    const toggleAudio = async () => {
        const newState = !isPlaying;
        setIsPlaying(newState); // Optimistic UI update
        try {
            if (newState) {
                await browser.runtime.sendMessage({ type: 'PLAY_AUDIO' });
            } else {
                await browser.runtime.sendMessage({ type: 'STOP_AUDIO' });
            }
        } catch (error) {
            console.error('Audio toggle failed:', error);
            setIsPlaying(!newState); // Revert on failure
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
                    <button
                        onClick={() => setActiveTab('solstice')}
                        className={`text-sm font-semibold transition-colors relative ${activeTab === 'solstice' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Solstice
                        {activeTab === 'solstice' && (
                            <div className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Global Focus Status Indicator (small) */}
                <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground/30'}`} title={isEnabled ? "Focus Mode Active" : "Focus Mode Inactive"} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'focus' ? (
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
                ) : (
                    // Solstice Tab
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-light tracking-wide text-foreground">Solstice Radio</h2>
                            <p className="text-sm text-muted-foreground">Focus frequencies via <b>lofi.cafe</b></p>
                        </div>

                        {/* Visualizer / Card */}
                        <div className={`w-48 h-48 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-700 ${isPlaying ? 'shadow-[0_0_40px_rgba(99,102,241,0.2)]' : ''}`}>
                            {isPlaying ? (
                                <div className="flex gap-1 items-end h-16">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-2 bg-primary rounded-full animate-pulse" style={{ height: '40%', animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-4xl grayscale opacity-30">☕️</div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-6 w-full max-w-xs">
                            <Button
                                onClick={toggleAudio}
                                size="lg"
                                className={`w-full h-14 text-lg rounded-full transition-all duration-300 ${isPlaying ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(56,189,248,0.3)]'}`}
                            >
                                {isPlaying ? 'Pause Transmission' : 'Start Focus Audio'}
                            </Button>

                            <a
                                href="https://lofi.cafe"
                                target="_blank"
                                className="block text-xs text-muted-foreground/60 hover:text-primary transition-colors"
                            >
                                Open Full Player ↗
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
