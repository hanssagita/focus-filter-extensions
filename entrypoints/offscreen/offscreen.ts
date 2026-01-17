export default defineUnlistedScript(() => {
    const LOFI_URL = 'https://www.lofi.cafe/';

    function startMusic() {
        const container = document.getElementById('player-container');
        if (!container) return;

        // Clear existing
        container.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = LOFI_URL;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

        container.appendChild(iframe);
        console.log('Focus: Audio iframe injected');
    }

    // Start immediately when this document loads
    startMusic();
});
