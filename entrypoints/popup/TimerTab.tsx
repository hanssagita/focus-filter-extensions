import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { TimerState, getTimerState, updateTimerState } from '../../lib/storage';

export function TimerTab() {
    const [state, setState] = useState<TimerState>({
        status: 'idle',
        startTime: null,
        remainingTime: 35 * 60,
        duration: 35,
        goal: '',
        workDuration: 35,
        breakDuration: 5,
    });
    const [timeLeft, setTimeLeft] = useState(35 * 60);

    // Sync from storage on mount and periodically
    useEffect(() => {
        const loadState = async () => {
            const stored = await getTimerState();
            setState(stored);
            calculateTimeLeft(stored);
        };
        loadState();

        // Check storage updates (or just poll for simplicity since alarm is slow)
        const interval = setInterval(() => {
            loadState();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calculateTimeLeft = (currentState: TimerState) => {
        if (currentState.status === 'idle' || currentState.status === 'paused') {
            setTimeLeft(currentState.remainingTime);
            return;
        }

        if (currentState.startTime) {
            const now = Date.now();
            const endTime = currentState.startTime + (currentState.duration * 60 * 1000);
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remaining);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = async () => {
        const newState = { ...state };
        newState.status = 'work';
        newState.duration = state.workDuration;
        newState.startTime = Date.now();
        // Adjust for existing remaining time if resuming? 
        // For simplicity, let's just start fresh or resume correctly.
        // If resuming from pause:
        if (state.status === 'paused') {
            // duration remains as is, but we need to recalculate start time backward
            // current time - (total duration - remaining time)
            // Or easier: startTime = now - (time elapsed so far)
            // startTime = now - ((duration * 60) - remainingTime) * 1000
            const elapsedSeconds = (state.duration * 60) - state.remainingTime;
            newState.startTime = Date.now() - (elapsedSeconds * 1000);
        }

        await updateTimerState(newState);
        setState(newState);
        await browser.runtime.sendMessage({ type: 'START_TIMER' });
    };

    const handlePause = async () => {
        const newState = { ...state, status: 'paused' as const, remainingTime: timeLeft, startTime: null };
        await updateTimerState(newState);
        setState(newState);
        await browser.runtime.sendMessage({ type: 'PAUSE_TIMER' });
    };

    const handleReset = async () => {
        const newState = {
            ...state,
            status: 'idle' as const,
            startTime: null,
            remainingTime: state.workDuration * 60,
            duration: state.workDuration
        };
        await updateTimerState(newState);
        setState(newState);
        setTimeLeft(state.workDuration * 60);
        await browser.runtime.sendMessage({ type: 'RESET_TIMER' });
    };

    const updateConfig = async (key: 'workDuration' | 'breakDuration', value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) return;

        const updates: Partial<TimerState> = { [key]: num };

        // If idle, also update current display if changing work duration
        if (state.status === 'idle' && key === 'workDuration') {
            updates.duration = num;
            updates.remainingTime = num * 60;
        }

        await updateTimerState(updates);
        // Local update handled by polling
    };

    return (
        <Card className="border-0 rounded-none shadow-none bg-transparent h-full flex flex-col">
            <CardHeader className="space-y-4 pt-6 pb-2">
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                    <span>Pomodoro</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${state.status === 'work' ? 'bg-red-500/20 text-red-500' :
                        state.status === 'break' ? 'bg-blue-500/20 text-blue-500' :
                            state.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                'bg-muted text-muted-foreground'
                        }`}>
                        {state.status.toUpperCase()}
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-6">
                {/* Timer Display */}
                <div className="flex flex-col items-center justify-center py-4 relative">
                    {/* Ring or visual bg? */}
                    <div className="text-6xl font-mono font-bold tracking-tighter text-foreground tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                    {state.goal && (
                        <div className="mt-2 text-sm text-center text-muted-foreground max-w-[80%] truncate">
                            Target: <span className="text-primary">{state.goal}</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                    {state.status === 'work' || state.status === 'break' ? (
                        <Button onClick={handlePause} variant="secondary" className="w-full">
                            Pause
                        </Button>
                    ) : state.status === 'completed' ? (
                        <div className="col-span-2 flex gap-2">
                            {state.previousStatus === 'work' ? (
                                <Button onClick={() => {
                                    const newState = { ...state, status: 'break' as const, duration: state.breakDuration, startTime: Date.now(), remainingTime: state.breakDuration * 60 };
                                    updateTimerState(newState);
                                    browser.runtime.sendMessage({ type: 'START_TIMER' });
                                }} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                    Start Break ({state.breakDuration}m)
                                </Button>
                            ) : (
                                <Button onClick={handleReset} className="w-full bg-green-500 hover:bg-green-600 text-white">
                                    Start Focus ({state.workDuration}m)
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Button onClick={handleStart} className="w-full">
                            {state.status === 'paused' ? 'Resume' : 'Start Focus'}
                        </Button>
                    )}
                    {state.status !== 'completed' && (
                        <Button onClick={handleReset} variant="outline" className="w-full">
                            Reset
                        </Button>
                    )}
                </div>

                {/* Settings / Goal */}
                <div className="space-y-4 mt-auto">
                    {state.status === 'idle' && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Session Goal</label>
                            <Input
                                placeholder="What are you working on?"
                                value={state.goal}
                                onChange={(e) => updateTimerState({ goal: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Work (min)</label>
                            <Input
                                type="number"
                                value={state.workDuration}
                                onChange={(e) => updateConfig('workDuration', e.target.value)}
                                disabled={state.status !== 'idle'}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Break (min)</label>
                            <Input
                                type="number"
                                value={state.breakDuration}
                                onChange={(e) => updateConfig('breakDuration', e.target.value)}
                                disabled={state.status !== 'idle'}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
