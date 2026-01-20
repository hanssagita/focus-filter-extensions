import ReactDOM from 'react-dom/client';
import { getTimerState, updateTimerState, TimerState, STORAGE_KEYS } from '@/lib/storage';
import { useEffect, useState } from 'react';
import '../assets/globals.css';

export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: 'ui',

    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: 'wxt-pomodoro-timer',
            position: 'inline',
            onMount: (container) => {
                // visual container
                const wrapper = document.createElement('div');
                container.append(wrapper);

                // Mount React
                const root = ReactDOM.createRoot(wrapper);
                root.render(<FloatingTimer />);
                return root;
            },
            onRemove: (root) => {
                root?.unmount();
            },
        });

        ui.mount();
    },
});

function FloatingTimer() {
    const handleDismiss = async () => {
        await updateTimerState({ status: 'idle', startTime: null, remainingTime: 0 });
    };

    const [state, setState] = useState<TimerState | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Initial load
        const load = async () => {
            const s = await getTimerState();
            setState(s);
            updateTime(s);
        };
        load();

        // Listen for storage changes
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes[STORAGE_KEYS.TIMER_STATE]) {
                const newState = changes[STORAGE_KEYS.TIMER_STATE].newValue as TimerState;
                setState(newState);
                updateTime(newState);
            }
        };
        chrome.storage.onChanged.addListener(listener);

        // Interval for local countdown
        const interval = setInterval(() => {
            if (state) updateTime(state);
        }, 1000);

        return () => {
            chrome.storage.onChanged.removeListener(listener);
            clearInterval(interval);
        };
    }, [state?.status, state?.startTime]);

    const updateTime = (currentState: TimerState) => {
        if (!currentState) return;

        if (currentState.status === 'idle' || currentState.status === 'paused' || currentState.status === 'completed') {
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
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!state || state.status === 'idle') return null;

    // Progress Calculation
    const totalSeconds = state.duration * 60;
    const progress = state.status === 'completed' ? 1
        : Math.min(1, Math.max(0, timeLeft / totalSeconds));

    // Status color
    let color = '#3b82f6'; // Blue default
    if (state.status === 'work') color = '#ef4444'; // Red
    if (state.status === 'completed') color = '#10b981'; // Green

    const size = 32;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress * circumference);

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 2147483647,
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            <div style={{
                background: 'rgba(15, 23, 42, 0.90)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px 10px 14px',
                borderRadius: '9999px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                userSelect: 'none',
                minWidth: '140px'
            }}>
                {/* Progress Ring */}
                <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background Ring */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress Ring */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
                        />
                    </svg>
                    {/* Inner Pulse Dot (smaller) */}
                    <div style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: color,
                        opacity: 0.8,
                        boxShadow: `0 0 8px ${color}`,
                        animation: state.status === 'completed' ? 'none' : undefined
                    }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1,
                        letterSpacing: '-0.5px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        color: state.status === 'completed' ? '#10b981' : 'white'
                    }}>
                        {state.status === 'completed' ? 'Done' : formatTime(timeLeft)}
                    </span>
                    {state.goal && (
                        <span style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            maxWidth: '140px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '4px',
                            fontWeight: 500
                        }}>
                            {state.goal}
                        </span>
                    )}
                </div>

                {state.status === 'completed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                        {state.previousStatus === 'work' ? (
                            <button
                                onClick={async () => {
                                    const newState = { ...state, status: 'break', duration: state.breakDuration, startTime: Date.now(), remainingTime: state.breakDuration * 60 };
                                    await updateTimerState(newState as any);
                                    await chrome.runtime.sendMessage({ type: 'START_TIMER' });
                                }}
                                style={{
                                    background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px',
                                    padding: '4px 8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                ☕️ Break
                            </button>
                        ) : (
                            <button
                                onClick={async () => {
                                    const newState = { ...state, status: 'work', duration: state.workDuration, startTime: Date.now(), remainingTime: state.workDuration * 60 };
                                    await updateTimerState(newState as any);
                                    await chrome.runtime.sendMessage({ type: 'START_TIMER' });
                                }}
                                style={{
                                    background: '#10b981', color: 'white', border: 'none', borderRadius: '6px',
                                    padding: '4px 8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                🎯 Focus
                            </button>
                        )}
                        <div
                            onClick={handleDismiss}
                            style={{
                                cursor: 'pointer',
                                opacity: 0.7,
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                            title="Dismiss"
                        >
                            ✕
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
