const BUTTON_ID = 'snapscript-copy-btn';
const INNERTUBE_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';
const ACTION_BAR_SELECTORS = [
    '#top-level-buttons-computed',
    'ytd-video-primary-info-renderer #actions-inner',
    '#actions #top-level-buttons',
];

export default defineContentScript({
    matches: ['*://*.youtube.com/watch*'],
    runAt: 'document_idle',
    main() {
        let currentUrl = location.href;

        tryInject();

        document.addEventListener('yt-navigate-finish', () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                document.getElementById(BUTTON_ID)?.remove();
                tryInject();
            }
        });

        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                document.getElementById(BUTTON_ID)?.remove();
                tryInject();
            }
        }, 1000);
    },
});

function tryInject() {
    waitForActionBar(12000).then(bar => {
        if (bar) injectButton(bar);
        else console.warn('[SnapScript] action bar not found');
    });
}

async function waitForActionBar(ms: number): Promise<HTMLElement | null> {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
        for (const sel of ACTION_BAR_SELECTORS) {
            const el = document.querySelector<HTMLElement>(sel);
            if (el) return el;
        }
        await tick(100);
    }
    return null;
}

function injectButton(bar: HTMLElement) {
    if (document.getElementById(BUTTON_ID)) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.textContent = 'Copy Transcript';
    Object.assign(btn.style, {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 16px',
        height: '36px',
        borderRadius: '18px',
        border: 'none',
        background: 'transparent',
        color: 'var(--yt-spec-text-primary, #fff)',
        fontFamily: '"Roboto","Arial",sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        marginLeft: '8px',
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'var(--yt-spec-10-percent-layer, rgba(255,255,255,0.1))';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
    });
    btn.addEventListener('click', () => handleClick(btn));

    bar.appendChild(btn);
}

async function handleClick(btn: HTMLButtonElement) {
    btn.disabled = true;
    const orig = btn.textContent ?? 'Copy Transcript';
    btn.textContent = 'Copying…';

    try {
        const text = await getTranscript();
        if (!text) {
            btn.textContent = '❌ Not available';
        } else {
            await copyText(text);
            btn.textContent = '✅ Copied!';
        }
    } catch {
        btn.textContent = '❌ Failed';
    }

    setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
    }, 2000);
}

async function getTranscript(): Promise<string | null> {
    const videoId = getVideoId();
    if (!videoId) return null;
    const tracks = await fetchCaptionTracks(videoId);
    if (!tracks?.length) return null;
    return fetchTranscriptText(tracks);
}

function getVideoId(): string | null {
    const match = location.href.match(/[?&]v=([^&]{11})/);
    return match?.[1] ?? null;
}

async function fetchCaptionTracks(videoId: string): Promise<any[] | null> {
    try {
        const resp = await fetch(INNERTUBE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                context: { client: { clientName: 'WEB', clientVersion: '2.20241231.00.00' } },
                videoId,
            }),
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        return data?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? null;
    } catch {
        return null;
    }
}

async function fetchTranscriptText(tracks: any[]): Promise<string | null> {
    const baseUrl = tracks[0]?.baseUrl as string | undefined;
    if (!baseUrl) return null;
    try {
        const url = new URL(baseUrl);
        if (!url.hostname.endsWith('.youtube.com')) return null;
    } catch {
        return null;
    }
    try {
        const resp = await fetch(baseUrl);
        if (!resp.ok) return null;
        return parseXml(await resp.text());
    } catch {
        return null;
    }
}

function parseXml(xml: string): string | null {
    const lines: string[] = [];
    const re = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
        const text = decodeEntities(m[3]).trim();
        if (text && !/^\[.+\]$/.test(text)) lines.push(text);
    }
    return lines.join(' ').trim() || null;
}

function decodeEntities(s: string): string {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

async function copyText(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
}

function tick(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}
